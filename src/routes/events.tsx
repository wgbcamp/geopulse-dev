// creates file-based routing for tanstack react router
import { createFileRoute, Link } from "@tanstack/react-router"
import { z } from 'zod'

// react hooks holding state, context, and references
import { AppStateContext, AppActionsContext } from "../app";
import { useState, useRef, useEffect, useCallback, useContext } from "react";

// this function constructs className strings conditionally and merges tailwindcss classes in javascript
import { cn } from "@/lib/utils";

// shad cn component imports
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// imf icons
import DataIcon from "../assets/data_icon.svg";
import Exposures from "../assets/Layers.svg";

// 3rd party icons
import { Check } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause } from "@fortawesome/free-solid-svg-icons";

// arcgis geographic data layers
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import GroupLayer from "@arcgis/core/layers/GroupLayer.js";
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";

// arcgis map components
import "@arcgis/map-components/components/arcgis-scale-bar";
import type {} from "@arcgis/map-components/types/react";

// arcgis core utilities
import Map from "@arcgis/core/Map.js";
import ClassBreaksRenderer from "@arcgis/core/renderers/ClassBreaksRenderer.js";
import MapView from "@arcgis/core/views/MapView.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

// dataset object configurations
import { realtimeObject, eventTypes } from "@/config/datasets";
import { countryByIso3 } from "@/config/isoCountries";

//import loading overlay component
import LoadingOverlay from "@/components/loadingOverlay";

// provide search schema for query string parameters
const searchSchema = z.object({
  eventid: z.coerce.number().catch(0).transform((val) => (val === 0 ? undefined : val))
});

export const Route = createFileRoute("/events")({
  component: Events,
  validateSearch: searchSchema
});

function Events() {
  // reads context from provider for app-level state functions
  const state = useContext(AppStateContext);
  const actions = useContext(AppActionsContext);

  actions?.setView("Event tracking");

  // store the value from the query string parameter
  const eventid = Route.useSearch().eventid;

  // state hook that enables/disables exposure sub-category animations
  const [popInState, setPopInState] = useState<string>("initial");

  const [realtimeExposure, setRealtimeExposure] = useState<{
    exposure: string;
    filter: string;
  }>({ exposure: "Population", filter: "Population" });
  const [events, setEvents] = useState<any>(null);
  const [focusedEvent, setFocusedEvent] = useState<any>("");
  const [eventsList, setEventsList] = useState<boolean>(false);
  const [eventPopup, setEventPopup] = useState<string>("all events");
  const [focusedFeatures, setFocusedFeatures] = useState<any>(null);
  const [focusedSliderValue, setFocusedSliderValue] = useState<number[]>([0]);
  const [focusedSliderPlaying, setFocusedSliderPlaying] =
    useState<boolean>(false);
  const [focusedCountryExposures, setFocusedCountryExposures] =
    useState<any>(null);

  const [currentCountryExposure, setCurrentCountryExposure] =
    useState<any>(null);

  const [otherCountryDropdownStatus, setOtherCountryDropdownStatus] =
    useState<any>(false);

  const [eventLoaded, setEventLoaded] = useState<boolean>(false);
  const [polygonsLoaded, setPolygonsLoaded] = useState<boolean>(false);

  const ref = useRef(null);
  const scaleBarRef = useRef<any>(null);
  const eventRef = useRef<HTMLDivElement | null>(null);
  const pulseContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [mobileExposures, setMobileExposures] = useState<boolean>(false);

  let map = useRef<Map | null>(null);
  const view = useRef<MapView>(new MapView());

  const baseLayer = useRef<VectorTileLayer | null>(null);
  const boundariesLayer = useRef<VectorTileLayer | null>(null);
  const exposureLayer = useRef<any>(null);
  const eventFeatureLayer = useRef<FeatureLayer | null>(null);

  const [layerSettingsPopup, setLayerSettingsPopup] = useState<boolean>(false);

  const exposureLayerForGroup = useRef<any>(null);
  const unweightedEventLayer = useRef<GraphicsLayer>(null);
  const weightedEventLayer = useRef<GraphicsLayer>(null);
  const groupLayer = useRef<GroupLayer>(null);

  useEffect(() => {
    // Register click events on the mapView. If the eventid of the symbol graphic
    // matches an eventid in the events array, load the event polygon and exposure values
    view.current.on("click", async (event) => {
      const response = await view.current.hitTest(event);
      response.results.forEach((a: any) => {
        events.forEach((i: any) => {
          if (i.attributes.eventid == a.graphic.attributes.eventid) {
            focusOnEvent(
              {
                longitude: i.geometry.longitude,
                latitude: i.geometry.latitude,
              },
              i.attributes,
            );
          }
        });
      });
      // close symbol popup
      view.current.closePopup();
    });

    // Register pointer movement on the mapView. Check if the mouse cursor overlaps a
    // symbol graphic and the symbol graphic contains an object with a FeatureLayer
    // layer. If true, check if the eventid of the symbol graphic matches an eventid
    // in the events array and set mouse cursor to pointer style. Otherwise, close
    // any open popup and set mouse cursor to default style.
    view.current.on("pointer-move", async (event) => {
      const response = await view.current.hitTest(event);
      const hasFeatureLayer = response.results.some(
        (result) => result.layer instanceof FeatureLayer,
      );
      if (hasFeatureLayer) {
        document.body.style.cursor = "pointer";
        response.results.forEach((a: any) => {
          if (a.graphic) {
            events.forEach((i: any) => {
              if (i.attributes.eventid == a.graphic.attributes.eventid) {
                view.current.openPopup({
                  location: i.geometry,
                  title: i.attributes.description,
                });
                return;
              }
            });
          }
        });
      } else {
        document.body.style.cursor = "default";
        view.current.closePopup();
      }
    });
  }, [events]);

  useEffect(() => {
    // When the query string parameter matches an eventid, load the event only once when page loads
    if (events && !eventsList) {
      if (eventid !== 0 && eventid!== undefined) {
        events.forEach((e: any) => {
          if (e.attributes.eventid == eventid) {
            focusOnEvent({
              longitude: e.geometry.longitude,
              latitude: e.geometry.latitude,
            },
              e.attributes)
          }
        })
      } else {
        actions?.setLoadingOverlay(false);
      }
      setEventsList(true);
    }
  }, [events])


  // Every time the eventPopup changes, return the results of the query of the events feature
  // layer, sorted by end date, then set the events on the events sidebar and the mapView.
  const queryEvents = useCallback(() => {
    if (
      !eventFeatureLayer.current ||
      !view.current ||
      !pulseContainerRef.current
    )
    return;

    const query = eventFeatureLayer.current!.createQuery();
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.outSpatialReference = view.current.spatialReference;
    query.maxRecordCountFactor = 5;

    function runQuery() {
      eventFeatureLayer
        .current!.queryFeatures(query)
        .then((result) => {
          result.features.forEach((f: any) => {
            if (!f.geometry) return;
            var x = result.features
              .map((feature) => {
                return {
                  attributes: feature.attributes,
                  geometry: feature.geometry,
                };
              })
              .sort(
                (a, b) =>
                  Math.floor(Date.parse(b.attributes.todate) / 1000) -
                  Math.floor(Date.parse(a.attributes.todate) / 1000),
              );
            setEvents(x);
          });
        })
        .catch((error) => {
          console.log(error);
          runQuery();
        });
    }

    runQuery();
  }, []);

  // gdacs event polygon feature layer
  const eventPolygonsLayer = new FeatureLayer({
    url: "https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/geopulse_episodes/FeatureServer",
  });

  // country exposures feature layer
  const countryExposures = new FeatureLayer({
    url: "https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/geopulse_exposures_by_country/FeatureServer",
  });

  // implements language-sensitive number formatting
  const fmt = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  useEffect(() => {
    if (ref.current) {
      // base layer displaying the regions of the world
      baseLayer.current = new VectorTileLayer({
        url: "https://cdn.arcgis.com/sharing/rest/content/items/d7397603e9274052808839b70812be50/resources/styles/root.json",
        title: "base",
      });

      // vector tile layer displaying country boundaries
      boundariesLayer.current = new VectorTileLayer({
        url: "https://cdn.arcgis.com/sharing/rest/content/items/e8ecee3086f34b06b85229d832a1c14a/resources/styles/root.json",
        title: "boundaries",
        opacity: 0.25,
      });

      // graphics layer that masks-in the event exposures feature layer
      unweightedEventLayer.current = new GraphicsLayer({
        blendMode: "destination-atop",
        title: "graphics",
      });

      // graphics layer that displays the event polygon
      weightedEventLayer.current = new GraphicsLayer({
        blendMode: "normal",
        title: "outline",
      });

      // group layer that will only be shown when an event is in focus
      groupLayer.current = new GroupLayer({
        layers: [unweightedEventLayer.current, weightedEventLayer.current],
      });

      // assign the layers to the map class
      map.current = new Map({
        layers: [
          baseLayer.current,
          boundariesLayer.current,
          groupLayer.current,
        ],
      });

      // calculate minimum zoom level for map based on browser viewport dimensions
      function getMinZoom(
        containerWidth: number,
        containerHeight: number,
      ): number {
        const minZoomX = Math.log2(containerWidth / 256);
        const minZoomY = Math.log2(containerHeight / 256);
        return Math.max(minZoomX, minZoomY);
      }
      const minZoom = getMinZoom(window.innerWidth, window.innerHeight);

      // Observe the width and height of the browser viewport to enforce minimum
      // zoom level
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        const newMinZoom = getMinZoom(width, height);
        view.current.constraints.minZoom = Math.floor(newMinZoom);

        if (view.current.zoom < newMinZoom) {
          view.current.zoom = newMinZoom;
        }
      });
      resizeObserver.observe(ref.current);

      // assign properties to mapView
      if (!state) return;
      view.current = new MapView({
        container: ref.current,
        map: map.current,
        zoom: Math.max(2, minZoom),
        center: [
          state.countryCoordinates.longitude,
          state.countryCoordinates.latitude,
        ],
        constraints: {
          minZoom: Math.floor(minZoom),
          maxZoom: 11,
        },
        popup: {
          dockEnabled: false,
          viewModel: {
            includeDefaultActions: false,
          },
          dockOptions: {
            position: "top-left",
            breakpoint: false,
            buttonEnabled: false,
          },
        },
      });

      // assign the mapView properties to the scalebar zoom measurement
      scaleBarRef.current.view = view.current;

      // remove all arcgis default ui components
      view.current.ui.components = [];
    }

    // clean up mapView between state changes
    return () => {
      view.current.destroy();
    };
  }, []);

  // When realtimeExposure value changes, remove exposure layer from map and from group layer
  // that is stacked with the event polygons. Remove existing exposure layers, add new exposure
  // layers, and reorder them. Blur base layer and exposure layer outside of event polygon to
  // achieve blurring effect outside of event polygon.
  useEffect(() => {
    if (!map.current || !groupLayer.current) return;

    // Remove existing exposure layers if they exist
    map.current.remove(exposureLayer.current);
    groupLayer.current.remove(exposureLayerForGroup.current);

    // Set up renderer classes depending on the exposure type
    const url =
      realtimeObject[realtimeExposure.exposure].url[realtimeExposure.filter];
    const classBreaksRenderer = new ClassBreaksRenderer({
      field: "Value",
      classBreakInfos: realtimeObject[realtimeExposure.exposure].colorScheme,
    });
    const renderer = new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        size: 3,
        color: [255, 200, 0],
      }),
    });

    // assign layers based on exposure type
    switch (realtimeExposure.exposure) {
      case "Airports":
      case "Ports":
        exposureLayer.current = new FeatureLayer({
          url: url,
          effect: "bloom(1.8, 0.85px, 0.4)",
          renderer: renderer,
          title: "exposure",
        });
        exposureLayerForGroup.current = new FeatureLayer({
          url: url,
          effect: "bloom(1.8, 0.85px, 0.4)",
          renderer: renderer,
          title: "exposure",
        });
        break;
      default:
        exposureLayer.current = new ImageryTileLayer({
          url: url,
          renderer: classBreaksRenderer,
          title: "exposure",
        });
        exposureLayerForGroup.current = new ImageryTileLayer({
          url: url,
          renderer: classBreaksRenderer,
          title: "exposure",
        });
        break;
    }

    // Add and reorder exposure layers to achieve the correct masking effect if the layers
    // used to display the event polygons exist. Layers are ordered such that the exposure
    // feature layer remains at the bottom, while the graphics layer sits above, with the 2nd exposure layer is at the top.
    if (
      unweightedEventLayer.current &&
      baseLayer.current &&
      weightedEventLayer.current
    ) {
      map.current.layers.add(exposureLayer.current);
      groupLayer.current.add(exposureLayerForGroup.current);
      map.current.reorder(exposureLayer.current, 1);
      groupLayer.current.layers.reorder(exposureLayerForGroup.current, 0);
      groupLayer.current.layers.reorder(unweightedEventLayer.current, 1);
      groupLayer.current.layers.reorder(weightedEventLayer.current, 2);

      // if an event is focused and focusedFeatures exists, apply blur, darken, and greyscale to layers outside of the group layer
      if (focusedFeatures?.length > 0) {
        baseLayer.current.effect = "blur(6px) brightness(0.7) grayscale(0.8)";
        exposureLayer.current.effect =
          "blur(6px) brightness(0.7) grayscale(0.8)";
      }
    }
  }, [realtimeExposure]);

  // remove all blur effects when removing focus from an event
  const removeBlur = () => {
    if (
      baseLayer.current &&
      exposureLayer.current &&
      unweightedEventLayer.current &&
      weightedEventLayer.current
    ) {
      baseLayer.current.effect = ""; // remove css filters from layers if no event is focused
      switch (realtimeExposure.exposure) {
        case "Airports":
        case "Ports":
          exposureLayer.current.effect = "bloom(1.8, 0.85px, 0.4)";
          break;
        default:
          exposureLayer.current.effect = "";
          break;
      }
      unweightedEventLayer.current.graphics.removeAll(); // remove graphics from graphics layers
      weightedEventLayer.current.graphics.removeAll();
      setFocusedFeatures(null); // reset focused features in state
      setFocusedSliderValue([0]); // reset focused slider value
    }
  };

  // generate arcs for circle shapes that dot the mapView to show events
  function generateCircleGeometry() {
    return {
      rings: [
        [
          [8.5, 0],
          [7.02, 0.13],
          [5.59, 0.51],
          [4.25, 1.14],
          [3.04, 1.99],
          [1.99, 3.04],
          [1.14, 4.25],
          [0.51, 5.59],
          [0.13, 7.02],
          [0, 8.5],
          [0.13, 9.98],
          [0.51, 11.41],
          [1.14, 12.75],
          [1.99, 13.96],
          [3.04, 15.01],
          [4.25, 15.86],
          [5.59, 16.49],
          [7.02, 16.87],
          [8.5, 17],
          [9.98, 16.87],
          [11.41, 16.49],
          [12.75, 15.86],
          [13.96, 15.01],
          [15.01, 13.96],
          [15.86, 12.75],
          [16.49, 11.41],
          [16.87, 9.98],
          [17, 8.5],
          [16.87, 7.02],
          [16.49, 5.59],
          [15.86, 4.25],
          [15.01, 3.04],
          [13.96, 1.99],
          [12.75, 1.14],
          [11.41, 0.51],
          [9.98, 0.13],
          [8.5, 0],
        ],
      ],
    };
  }

  // Arcade expression returning min + [0, range) from a hash of the feature's location
  const pulseRandom = (seed: number, min: number, range: number) => `
        var g = Geometry($feature);
        var h = Abs(Sin(g.x * 12.9898 + g.y * 78.233 + ${seed}) * 43758.5453);
        return ${min} + (h - Floor(h)) * ${range};`;

  // event
  const eventColor = (value: string) => {
    let x;
    switch (value) {
      case "EQ":
        x = [101, 141, 27, 255];
        break;
      case "TC":
        x = [218, 41, 28, 255];
        break;
      case "DR":
        x = [128, 49, 167, 255];
        break;
      case "FL":
        x = [0, 176, 185, 255];
        break;
      case "VO":
        x = [242, 169, 0, 255];
        break;
      case "WF":
        x = [255, 130, 0, 255];
        break;
      default:
        x = [217, 217, 217, 255];
    }

    return {
      type: "cim", // autocasts as new CIMSymbol
      data: {
        type: "CIMSymbolReference",
        primitiveOverrides: [
          {
            type: "CIMPrimitiveOverride",
            primitiveName: "strokeOverride",
            propertyName: "Color",
            valueExpressionInfo: {
              type: "CIMExpressionInfo",
              title: "Animation override",
              expression: `return 'rgba(${x[0]},${x[1]},${x[2]},${x[3]})';`,
              returnType: "Default",
            },
          },
          // per-feature pseudo-random timing so markers don't pulse in unison;
          // seeded from the point location (not Random()) so the scale and
          // transparency animations always get identical values and stay in sync
          {
            type: "CIMPrimitiveOverride",
            primitiveName: "animationOverride",
            propertyName: "StartTimeOffset",
            valueExpressionInfo: {
              type: "CIMExpressionInfo",
              expression: pulseRandom(1, 0, 3),
              returnType: "Numeric",
            },
          },
          {
            type: "CIMPrimitiveOverride",
            primitiveName: "animationOverride",
            propertyName: "Duration",
            valueExpressionInfo: {
              type: "CIMExpressionInfo",
              expression: pulseRandom(2, 1.4, 1),
              returnType: "Numeric",
            },
          },
          {
            type: "CIMPrimitiveOverride",
            primitiveName: "animationOverride",
            propertyName: "RepeatDelay",
            valueExpressionInfo: {
              type: "CIMExpressionInfo",
              expression: pulseRandom(3, 0.5, 2),
              returnType: "Numeric",
            },
          },
        ],
        symbol: {
          type: "CIMPointSymbol",
          symbolLayers: [
            {
              type: "CIMVectorMarker",
              enable: true,
              animations: [
                {
                  type: "CIMSymbolAnimationScale",
                  primitiveName: "scaleOverride",
                  scaleFactor: 3,
                  animatedSymbolProperties: {
                    type: "CIMAnimatedSymbolProperties",
                    primitiveName: "animationOverride",
                    playAnimation: true,
                    repeatType: "Loop",
                    repeatDelay: 1,
                    duration: 1.8,
                    easing: "EaseOut",
                  },
                },
                {
                  type: "CIMSymbolAnimationTransparency",
                  toTransparency: 100,
                  animatedSymbolProperties: {
                    type: "CIMAnimatedSymbolProperties",
                    primitiveName: "animationOverride",
                    playAnimation: true,
                    repeatType: "Loop",
                    repeatDelay: 1,
                    duration: 1.8,
                    easing: "EaseIn",
                  },
                },
              ],
              size: 5,
              frame: {
                xmin: 0,
                ymin: 0,
                xmax: 17,
                ymax: 17,
              },
              markerGraphics: [
                {
                  type: "CIMMarkerGraphic",
                  geometry: generateCircleGeometry(),
                  symbol: {
                    type: "CIMPolygonSymbol",
                    symbolLayers: [
                      {
                        type: "CIMSolidStroke",
                        primitiveName: "strokeOverride",
                        enable: true,
                        width: 1,
                        color: [255, 255, 255, 0],
                      },
                    ],
                  },
                },
              ],
            },
            {
              type: "CIMVectorMarker",
              enable: true,
              size: 5,
              frame: {
                xmin: 0,
                ymin: 0,
                xmax: 17,
                ymax: 17,
              },
              markerGraphics: [
                {
                  type: "CIMMarkerGraphic",
                  geometry: generateCircleGeometry(),
                  symbol: {
                    type: "CIMPolygonSymbol",
                    symbolLayers: [
                      {
                        type: "CIMSolidFill",
                        enable: true,
                        color: x,
                      },
                    ],
                  },
                },
              ],
              scaleSymbolsProportionally: true,
              respectFrame: true,
            },
          ],
        },
      },
    };
  };
  const uniqueColorValues = [
    {
      value: "EQ",
      symbol: eventColor("EQ"),
    },
    {
      value: "TC",
      symbol: eventColor("TC"),
    },
    {
      value: "DR",
      symbol: eventColor("DR"),
    },
    {
      value: "FL",
      symbol: eventColor("FL"),
    },
    {
      value: "VO",
      symbol: eventColor("VO"),
    },
    {
      value: "WF",
      symbol: eventColor("WF"),
    },
  ];

  useEffect(() => {
    if (!map.current) return;

    // clean up
    if (eventFeatureLayer.current) {
      map.current.remove(eventFeatureLayer.current);
      eventFeatureLayer.current.destroy();
    }

    // convert time values to unix time for query
    function toTimestamp(date: any) {
      return date.toISOString().replace("T", " ").split(".")[0];
    }

    // assign query properties for the feature layer to retrieve world events within the date range
    eventFeatureLayer.current = new FeatureLayer({
      url: "https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/geopulse_events/FeatureServer",
      outFields: ["*"],
      renderer: {
        type: "unique-value",
        field: "eventtype",
        uniqueValueInfos: uniqueColorValues,
      },
      definitionExpression: `(fromdate >= timestamp '${toTimestamp(new Date(state?.dateRange.from))}' AND fromdate <= timestamp '${toTimestamp(new Date(state?.dateRange.to))}'
            OR
            todate >= timestamp '${toTimestamp(new Date(state?.dateRange.from))}' AND todate <= timestamp '${toTimestamp(new Date(state?.dateRange.to))}'
            OR
            fromdate <= timestamp '${toTimestamp(new Date(state?.dateRange.from))}' AND todate >= timestamp '${toTimestamp(new Date(state?.dateRange.to))}'
        )`,
    });

    // run query on feature layer
    eventFeatureLayer.current.when(() => {
      queryEvents();
    });

    map.current.add(eventFeatureLayer.current); // add events feature layer to map
  }, [state?.dateRange.from, state?.dateRange.to]);

  view.current
    .whenLayerView(eventFeatureLayer.current as FeatureLayer)
    .then((layerView) => {
      var x = `eventtype='${state?.eventFilter}' AND`;
      var y = `%${state?.countryFilter}%`;
      if (state?.eventFilter == "AL") {
        x = "";
      }
      if (state?.countryFilter == "All countries") {
        y = "%";
      }
      layerView.filter = {
        where: `${x} affectedcountries LIKE '${y}'`,
      };
    });

  // query feature layer
  function highlightCountry(eventid: any) {
    const newQuery = eventPolygonsLayer.createQuery();
    newQuery.returnGeometry = true;
    newQuery.outFields = ["*"];
    newQuery.where = `eventid = ${eventid}`;

    function runQuery() {
      eventPolygonsLayer
        .queryFeatures(newQuery)
        .then((result) => {
          console.log("events: ", result);

          const ascendingFeatures = Object.values(
            result.features.reduce(
              (groups, feature) => {
                const id = feature.attributes.episodeid;
                (groups[id] ??= []).push(feature);
                return groups;
              },
              {} as Record<number, typeof result.features>,
            ),
          ).sort(
            (a, b) => a[0].attributes.episodeid - b[0].attributes.episodeid,
          );

          console.log("ASCENDING FEATURES: ", ascendingFeatures);
          console.log("feature ", result.features);

          setFocusedFeatures(ascendingFeatures); // Store the features in state
          console.log("FocusedFeatures: ", ascendingFeatures);

          let combinedExtent: __esri.Extent | null = null;
          for (const feature of result.features) {
            const ext = feature.geometry?.extent;
            console.log(
              "feature element extent: ",
              feature.geometry?.extent?.toJSON(),
            );
            if (!ext) continue;
            combinedExtent = combinedExtent ? combinedExtent.union(ext) : ext;
          }

          if (combinedExtent) {
            console.log("combinedExtent: ", combinedExtent.toJSON());
            view.current.goTo(combinedExtent);
          }

          applyPolygon(ascendingFeatures[ascendingFeatures.length - 1]); // Apply the polygon styling from the first feature (or the specified index)
          setPolygonsLoaded(true);
        })
        .catch((error) => {
          console.log(error);
          runQuery();
        });
    }
    runQuery();
  }

  const applyPolygon = (features: any) => {
    console.log("sS: ", features);
    if (
      features &&
      unweightedEventLayer.current &&
      baseLayer.current &&
      groupLayer.current &&
      weightedEventLayer.current
    ) {
      unweightedEventLayer.current.graphics.removeAll();
      weightedEventLayer.current.graphics.removeAll();

      function polygonStyle(value: any) {
        var outlineColor: string = "";
        var color: string = "";
        var style: string = "";
        switch (value.attributes.weight) {
          case 0:
            outlineColor = "#FF000050";
            color = "rgba(0, 0, 0, 0)";
            style = "solid";
            break;
          case 1:
            outlineColor = "#7E0063";
            color = "rgba(62, 28, 52, 1)";
            style = "solid";
        }

        let polygonClone = value.clone();
        polygonClone.symbol = {
          type: "simple-fill",
          color: color,
          outline: {
            color: outlineColor,
            width: "2px",
            style: style,
          },
        };

        switch (value.attributes.weight) {
          case 0:
            weightedEventLayer.current?.graphics.add(polygonClone);
            break;
          case 1:
            unweightedEventLayer.current?.graphics.add(polygonClone);
        }
      }

      features.forEach((x: any) => {
        // if (x.attributes.weight == 1) {
        polygonStyle(x);
        // }
      });

      baseLayer.current.effect = "blur(6px) brightness(0.7) grayscale(0.8)"; // blur, darken, and greyscale map base layer
      exposureLayer.current.effect = "blur(6px) brightness(0.7) grayscale(0.8)"; // blur, darken, and greyscale map exposure layer
      groupLayer.current.effect =
        "brightness(1) drop-shadow(0, 0px, 12px, #7E0063)"; // brighten and add drop shadow to the group layer
    }
  };

  // uses tanstack router method to update query in url
  const navigate = Route.useNavigate();
  const updateURL = (newURL: string) => {
    navigate({
      search: (prev) => ({
        ...prev,          // Keep existing search params
        eventid: newURL // Update or add a specific parameter
      })
    })
  }

  useEffect(() => {
    setFocusedSliderValue([focusedFeatures?.length - 1]);
  }, [focusedFeatures]);

  // focuses view on the event selected
  const focusOnEvent = async (
    coors: { longitude: number; latitude: number },
    attributes: any,
  ) => {
    actions?.setLoadingOverlay(true);
    pauseSlider();
    removeBlur(); // remove blur from previous event if it exists
    setFocusedSliderValue([0]); // reset slider value to 0 when focusing on a new event
    console.log(coors);

    // update url
    updateURL(attributes.eventid);

    if (!map.current) return;

    // reveal group layer for focused event and blur other layers
    highlightCountry(attributes.eventid);

    console.log(map.current);

    const newQuery = countryExposures.createQuery();
    newQuery.returnGeometry = true;
    newQuery.outFields = ["*"];
    newQuery.where = `eventid = ${attributes.eventid}`;

    // TESTING
    function runQuery() {
      countryExposures
        .queryFeatures(newQuery)
        .then((result) => {
          console.log("theCountryEXPOSURES: ", result);
          setCurrentCountryExposure("ALL");
          setFocusedCountryExposures(result.features);
          setFocusedEvent(attributes);
          setEventPopup("focused event");

          // hide event dots
          document.querySelectorAll<HTMLElement>(".pw").forEach((element) => {
            element.style.visibility = "hidden";
          });

          if (!eventFeatureLayer.current) return;

          eventFeatureLayer.current.renderer.uniqueValueInfos = [];
          setEventLoaded(true);
        })
        .catch((error) => {
          console.log(error);
          runQuery();
        });
    }

    runQuery();
  };

  // play through the event by incrementing the slider value which updates the position
  const playEvent = (status: string) => {
    const blocker = focusedEvent;
    let i = focusedSliderValue[0];
    let interval = 0;

    switch (status) {
      case "play":
        setFocusedSliderPlaying(true);
        intervalRef.current = setInterval(() => {
          if (
            blocker !== focusedEvent ||
            (i >= focusedFeatures.length - 1 && interval !== 0)
          ) {
            pauseSlider();
            return;
          } else if (i == focusedFeatures.length - 1 && interval == 0) {
            i = 0;
            interval += 1;
            applyPolygon(focusedFeatures[i]);
            setFocusedSliderValue([i]);
          } else {
            i += 1;
            interval += 1;
            applyPolygon(focusedFeatures[i]);
            setFocusedSliderValue([i]);
          }
        }, 500);
        break;
      case "pause":
        pauseSlider();
        break;
    }
  };

  const pauseSlider = () => {
    // clear any existing intervals and reset slider when focusing on a new event
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setFocusedSliderPlaying(false); // reset playing state of slider when focusing on a new event
    }
  };

  const unfocusEvent = () => {
    setEventPopup("all events");
    setFocusedEvent("");
    removeBlur();
    pauseSlider();
    if (!eventFeatureLayer.current) return;
    eventFeatureLayer.current.renderer.uniqueValueInfos = uniqueColorValues;
  };

  const toggleLayerSettingsPopup = (value: boolean) => {
    if (window.innerWidth < 768) {
      setLayerSettingsPopup(value);
    }
  };

  const togglePopIn = (value: string) => {
    if (window.innerWidth >= 768) {
      setPopInState(value);
    }
  };

  const MAX_Y = 90;
  const MIN_Y = window.innerHeight - 50;
  const INITIAL_HEIGHT = window.innerHeight - 50;
  const SNAP_TO_MAX_HEIGHT = window.innerHeight + 75;
  const SNAP_TO_MIN_HEIGHT = 90;

  const [y, setY] = useState(INITIAL_HEIGHT);
  const dragRef = useRef({ active: false, startY: 0, startOffset: 0 });

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { active: true, startY: e.clientY, startOffset: y };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const delta = e.clientY - dragRef.current.startY;
    if (y < MAX_Y) return;
    setY(dragRef.current.startOffset + delta);
  };

  const onPointerUp = (event) => {
    event.preventDefault();
    dragRef.current.active = false;
    if (y > MIN_Y) setY(SNAP_TO_MAX_HEIGHT);
    if (y < MAX_Y) setY(SNAP_TO_MIN_HEIGHT);
  };

  useEffect(() => {
    view.current.goTo({
      center: [
        state.countryCoordinates.longitude,
        state.countryCoordinates.latitude,
      ],
    });
  }, [state?.countryCoordinates]);

  useEffect(() => {
    if (polygonsLoaded && eventLoaded) {
      actions?.setLoadingOverlay(false);
      setPolygonsLoaded(false);
      setEventLoaded(false);
    }
  }, [polygonsLoaded, eventLoaded]);

  useEffect(() => {
    unfocusEvent();
  },[state?.dateRange, state?.eventFilter, state?.countryFilter])

  return (
    <div className="w-full h-full">
      <LoadingOverlay />
      <div className="w-full h-full relative overflow-hidden">
        <div className="w-full h-full">
          <div className="w-full h-full flex justify-start pt-15" ref={ref}></div>
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
            ref={pulseContainerRef}
          ></div>
        </div>
        <div
          className={`absolute z-0 md:-z-1 top-33.5 left-8.25 flex items-center border-solid transition-all duration-300 text-white`}
          onClick={() => toggleLayerSettingsPopup(true)}
        >
          <div
            className="rounded-full flex items-center justify-center cursor-pointer h-17.5 w-17.5 md:invisible text-white bg-black border-[1.37px] border-solid border-[#0084FF] mr-[10px]"
            onClick={() => setMobileExposures(!mobileExposures)}
          >
            <img src={Exposures}></img>
          </div>
        </div>
        {Object.entries(realtimeObject).map(([key, layer], index: number) => (
          <div
            key={index}
            id={`${index}`}
            className={`absolute -z-1 md:z-1 left-8.25 pointer-events-none`}
            style={{ top: index * 55 + 200 }}
            onMouseLeave={() => setPopInState("")}
          >
            <div className=" flex gap-2 items-start pointer-events-none has-[.pop-in]:pointer-events-auto">
              <div
                className={`flex items-center border-solid transition-all duration-300 text-white`}
              >
                <div
                  className={`flex items-center pointer-events-auto cursor-pointer transition-all duration-300  text-white`}
                  onClick={() =>
                    setRealtimeExposure({ exposure: key, filter: key })
                  }
                  onMouseEnter={() => togglePopIn(key)}
                >
                  <div
                    className={`rounded-full flex items-center justify-start ${realtimeExposure.exposure == key ? "bg-(--accentblue-100)" : "bg-black hover:bg-(--accentdarkblue-100)"} transition-all duration-300 border-[1.37px] border-solid border-[#0084FF] h-[37px] pr-[10px]`}
                  >
                    <div className="rounded-full flex items-center justify-center bg-black border border-solid border-[#0084FF] h-[37px] w-[37px]">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d={layer.icon} />
                      </svg>
                    </div>
                    <div className="text-white text-[12px] ml-3 font-bold">
                      {key}
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="exposureContainer"
                className={`pointer-events-none has-[.pop-in]:pointer-events-auto flex gap-2 ml-10 flex-wrap max-w-5/10 items-center border-solid transition-all duration-300 text-white`}
              >
                {layer.categories.map((f: any, index: number) => (
                  <div
                    key={`exposure_category_${f}`}
                    id={`exposure_category_${f}`}
                    className={`exposure_ h-9 bg-black border-2 rounded-2xl px-5 opacity-0 cursor-pointer ${popInState == key ? "pop-in" : popInState == "initial" ? "pop-default" : "pop-out"} ${realtimeExposure.filter == f ? "border-(--accentcyan-100)" : "border-(--accentdarkblue-50)"}`}
                    style={
                      popInState == "initial"
                        ? { animationDelay: index * 0 + "ms" }
                        : { animationDelay: index * 50 + "ms" }
                    }
                    onClick={() =>
                      setRealtimeExposure({ exposure: key, filter: f })
                    }
                  >
                    <div className="h-9/10 flex justify-center items-center overflow-hidden">
                      <div className="text-white text-[12px] font-bold">{f}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div
          className={`absolute ${layerSettingsPopup ? "z-3" : "-z-1"} top-0 h-full w-full bg-[#00000090] flex items-center justify-center`}
        >
          <div className="flex flex-col justify-center items-center gap-y-4 h-full w-full border-(--accentdarkblue-80) border bg-(--accentdarkblue-100)">
            <div className="flex w-full flex-col h-1/10 items-center justify-center">
              <div className="flex h-full w-86/100 py-4 items-center justify-between">
                <section className="text-white font-bold text-[16px]">
                  Layers
                </section>
                <div
                  className="text-white font-bold text-[16px] cursor-pointer"
                  onClick={() => setLayerSettingsPopup(false)}
                >
                  X
                </div>
              </div>
              <div className="w-9/10 border-b-1 border-(--accentdarkblue-80)"></div>
            </div>
            <div className="h-9/10 w-86/100 flex flex-col gap-2 justify-start items-center overflow-scroll">
              <div className="flex gap-y-3 flex-col justify-center ">
                <section className="text-left w-95/100 font-bold text-(--accentdarkblue-50)">
                  EXPOSURES
                </section>
                <div className="flex flex-row flex-wrap gap-3">
                  {Object.entries(realtimeObject).map(([key, layer], index: number)  => (
                    <div
                      key={key}
                      className={`w-25 h-25 bg-black border-2 rounded-2xl cursor-pointer ${realtimeExposure.exposure == key ? "border-(--accentcyan-100)" : "border-(--accentdarkblue-50)"}`}
                      onClick={() => {
                        setRealtimeExposure({ exposure: key, filter: key });
                        setLayerSettingsPopup(false);
                      }}
                    >
                      <div className="h-full flex justify-center items-end">
                        <div className="text-white text-[12px] font-bold">
                          {key}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`absolute z-2 bottom-65 md:bottom-0 md:transition-[right] md:duration-300 md:ease-in-out ${eventPopup == "all events" ? "md:right-0" : "md:-right-100 invisible"} md:visible max-h-full md:h-85/100 w-full md:w-[350px] flex flex-col bg-white md:shadow-[inset_0px_-16px_10px_-10px_rgba(0,0,0,0.35)] cursor-default draggable`}
          style={{
            "--drag-y": `${y}px`,
            touchAction: "none",
          }}
        >
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => onPointerUp(e)}
          >
            <div className="h-4 w-full flex items-end justify-center md:hidden">
              <div className="w-15 h-1 bg-(--accentcoolgray-60) rounded-xl"></div>
            </div>
            <div className="h-[32px] shadow-[0px_4px_5.8px_0px_#00000024] flex items-center justify-start">
              <b className="ml-2">
                {
                  events?.filter(
                    (element: Record<string, any>) =>
                      (element.attributes.eventtype == state?.eventFilter ||
                        state?.eventFilter == "AL") &&
                      (element.attributes.affectedcountries?.includes(
                        state?.countryFilter,
                      ) ||
                        state?.countryFilter == "All countries"),
                  ).length
                }{" "}
                Events in Date Range
              </b>
            </div>
          </div>
          <div
            className="h-full pb-20 md:pb-0 overflow-y-scroll flex flex-col justify-start"
            ref={eventRef}
          >
            {events
              ?.filter(
                (element: Record<string, any>) =>
                  (element.attributes.eventtype == state?.eventFilter ||
                    state?.eventFilter == "AL") &&
                  (element.attributes.affectedcountries?.includes(
                    state?.countryFilter,
                  ) ||
                    state?.countryFilter == "All countries"),
              )
              ?.map((event: any) => (
                <div
                  key={event.attributes.htmldescription}
                  className="p-2 border-b border-gray-300 items-start flex flex-col text-left"
                >
                  <h3 className="font-bold text-[14px] text-[var(--accentblue-100)]">
                    {event.attributes.country.toUpperCase()}
                  </h3>
                  <h3 className="font-bold text-[16px]">
                    {event.attributes.description}
                  </h3>
                  <p className="text-[14px]">
                    {new Date(event.attributes.fromdate).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}{" "}
                    -{" "}
                    {event.attributes.todate == Date.now()
                      ? "Present"
                      : new Date(event.attributes.todate).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                  </p>
                  <div className="flex w-full justify-between ">
                    <div
                      className="flex h-6.25 leading-[0.75] items-center justify-center font-bold cursor-pointer text-[var(--accentblue-100)] border-solid border border-gray-400 rounded-sm px-[5px] mb-[6px] mt-[9px] text-[11px]"
                      onClick={() =>
                        focusOnEvent(event.geometry, event.attributes)
                      }
                    >
                      DETAILS
                    </div>
                    {event.attributes.iscurrent == 1 ? (
                      <div className="flex justify-center items-center bg-(--accentred-100) rounded-sm shadow-lg/10 font-bold text-white px-[5px] mb-[6px] mt-[9px] text-[11px]">
                        <div>ONGOING</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div
          className={`absolute bottom-0 right-0 md:transition-all md:duration-300 md:ease-in-out ${eventPopup == "focused event" ? "md:right-0 visible" : "md:-right-100 invisible"} h-5/10 md:h-85/100 w-full md:w-[350px] pt-3 shadow-lg/40 md:rounded-tl-md flex gap-5 flex-col items-start bg-white cursor-default transition-all ease-in-out duration-300 overflow-y-auto`}
        >
          <div className="w-full flex items-center justify-between px-4">
            {focusedEvent.iscurrent == 1 ? (
              <div className="flex h-6.25 justify-center  items-center bg-(--accentred-100) rounded-sm shadow-lg/10 font-bold text-white px-[5px] mb-[6px] mt-[9px] text-[11px]">
                <div>ONGOING</div>
              </div>
            ) : (
              <b className="flex h-6.25 justify-center  items-center bg-(--accentblue-100) rounded-sm shadow-lg/10 font-bold text-white px-[5px] mb-[6px] mt-[9px] text-[11px]">
                <span className="leading-[0.75]">PAST EVENT</span>
              </b>
            )}
            <div
              className="text-[14px] mr-2 text-(--accentblue-100) font-bold cursor-pointer"
              onClick={() => unfocusEvent()}
            >
              {" "}
              Close details [X]
            </div>
          </div>
          <div className="text-[20px] h-[38px] font-bold text-left flex w-full px-4">
            {focusedEvent.description?.length > 25
              ? focusedEvent.description.slice(0, 32).trimEnd() + "..."
              : focusedEvent.description}
          </div>
          {focusedFeatures?.length > 1 ? (
            <div className="w-full">
              <div className="text-(--accentblue-100) font-bold text-[12px] text-center w-full">
                Timeline
              </div>
              <div className="flex flex-row justify-center items-start w-full pb-[36px]">
                {focusedSliderPlaying ? (
                  <div
                    className="flex items-center justify-center z-2 text-6.25 w-6.25 h-6.25 text-white bg-(--accentblue-100) rounded-4xl"
                    onClick={() => playEvent("pause")}
                  >
                    <FontAwesomeIcon icon={faPause} size="2xs" color="white" />
                  </div>
                ) : (
                  <div
                    className="z-2 flex items-center justify-center text-6.25 w-6.25 h-6.25 text-white bg-(--accentblue-100) rounded-4xl"
                    onClick={() => playEvent("play")}
                  >
                    <svg
                      width="7"
                      height="13"
                      viewBox="0 0 7 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1"
                    >
                      <path d="M0 0L6.44985 6.44985L0 12.8997V0Z" fill="white" />
                    </svg>
                  </div>
                )}
                <div className="flex flex-col h-full ml-3 w-7/10">
                  <Slider
                    className="mr-6 z-2 [&_[data-slot=slider-track]]:bg-(--orange) cursor-pointer "
                    step={1}
                    min={0}
                    // if there are no features, set max to 10 for demonstrative purposes
                    max={focusedFeatures?.length - 1 || 10}
                    value={focusedSliderValue}
                    onValueChange={(value) => {
                      setFocusedSliderValue(value);
                      // apply polygon based on slider value, if features exist
                      if (focusedFeatures) {
                        applyPolygon(focusedFeatures[value[0]]);
                        pauseSlider();
                      }
                    }}
                  />
                  <div className="relative h-6" style={{ width: "calc(100%)" }}>
                    {focusedFeatures?.map((feature: any, index: any) => {
                      const percent =
                        (index / (focusedFeatures.length - 1)) * 100;
                      return (
                        <div
                          key={index}
                          className="absolute flex flex-col items-center -translate-x-1/2"
                          style={{ left: `${percent}%` }}
                        >
                          <div className="w-px h-2 bg-muted-foreground/50"></div>
                          <span className={`text-xs w-10 mt-3`}>
                            {index == 0
                              ? new Date(
                                focusedEvent.fromdate,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }) + " "
                              : index == focusedFeatures.length - 1
                                ? focusedEvent.todate == Date.now()
                                  ? "Present"
                                  : " " +
                                  new Date(
                                    focusedEvent.todate,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <div className="pt-5 flex items-center">
            <div className="font-bold text-[14px] pl-4">Event Severity</div>
            <div
              className={`text-[14px] px-2 py-2 ml-2 rounded-md h-5 text-white font-extrabold flex items-center justify-center`}
              style={{
                backgroundColor: `var(--${focusedEvent.alertlevel?.toLowerCase()})`,
              }}
            >
              <span className="leading-[0.9] h-3">
                Level {focusedEvent.alertscore}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="font-bold text-[14px] pl-4 text-left">
              View affected economies
            </div>
            <div className="text-left flex flex-wrap text-[14px] pl-4 gap-3">
              <div
                className={`[text-box-edge:cap_alphabetic] leading-none rounded-xl h-6 whitespace-nowrap px-3  ${currentCountryExposure == "ALL" ? "bg-(--accentblue-100) text-white" : "bg-(--accentwarmgray-20)"} font-bold flex items-center justify-center cursor-pointer`}
                onClick={() => setCurrentCountryExposure("ALL")}
              >
                <div className="leading-[0.75]">Total</div>
              </div>
              {focusedEvent?.affectedcountries
                ?.split(",")
                ?.map((a: string, i: number) => {
                  if (i < 3) {
                    return (
                      <div
                        className={`rounded-xl h-6 whitespace-nowrap px-3  ${currentCountryExposure == a ? "bg-(--accentblue-100) text-white" : "bg-(--accentwarmgray-20)"} font-bold flex items-center justify-center cursor-pointer`}
                        onClick={() => {
                          setCurrentCountryExposure(a);
                          console.log(
                            focusedCountryExposures.indexOf(
                              focusedCountryExposures.find(
                                (c: any) => c.attributes.areaid == a,
                              ),
                            ),
                          );
                        }}
                      >
                        <div>{countryByIso3[a]}</div>
                      </div>
                    );
                  }
                })}
              {focusedEvent?.affectedcountries?.split(",")?.length > 3 ? (
                <div
                  className={`rounded-xl overflow-hidden h-5 px-2 py-3 ${focusedEvent?.affectedcountries?.split(",")?.find((a, i) => a == currentCountryExposure && i > 2) ? "bg-(--accentblue-100) text-white" : "bg-(--accentwarmgray-20)"}  font-bold flex items-center justify-center`}
                  onClick={() =>
                    setOtherCountryDropdownStatus(!otherCountryDropdownStatus)
                  }
                >
                  <div className="text-wrap max-w-40 flex justify-between cursor-pointer">
                    {currentCountryExposure !== "ALL" &&
                      focusedEvent?.affectedcountries
                        ?.split(",")
                        ?.find((a, i) => a == currentCountryExposure && i > 2)
                      ? countryByIso3[currentCountryExposure]
                      : "Other"}
                  </div>
                  <Popover
                    open={otherCountryDropdownStatus}
                    onOpenChange={setOtherCountryDropdownStatus}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={otherCountryDropdownStatus}
                        className="w-4 h-5.25 font-bold justify-between light border-0 shadow-none p-0 bg-transparent hover:bg-transparent cursor-pointer"
                      >
                        <svg
                          className={`${otherCountryDropdownStatus ? "rotate-180" : "rotate-0"}`}
                          width="14"
                          height="20"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 18.75C14.8438 18.75 18.75 14.8438 18.75 10C18.75 5.15625 14.8438 1.25 10 1.25C5.15625 1.25 1.25 5.15625 1.25 10C1.25 14.8438 5.15625 18.75 10 18.75ZM10 0C15.5078 0 20 4.49219 20 10C20 15.5078 15.5078 20 10 20C4.49219 20 0 15.5078 0 10C0 4.49219 4.49219 0 10 0ZM5.19531 9.17969C4.96094 8.94531 4.96094 8.55469 5.19531 8.32031C5.42969 8.08594 5.82031 8.08594 6.05469 8.32031L10 12.2266L13.9453 8.32031C14.1797 8.08594 14.5703 8.08594 14.8047 8.32031C15.0781 8.55469 15.0781 8.94531 14.8047 9.17969L10.4297 13.5547C10.1953 13.8281 9.80469 13.8281 9.57031 13.5547L5.19531 9.17969Z"
                            fill={`${focusedEvent?.affectedcountries?.split(",")?.find((a, i) => a == currentCountryExposure && i > 2) ? "white" : "black"}`}
                          />
                        </svg>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-0 light rounded-none">
                      <Command>
                        <CommandInput
                          placeholder="Search country..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Country not found.</CommandEmpty>
                          <CommandGroup>
                            {focusedEvent?.affectedcountries
                              ?.split(",")
                              ?.map((a, i) => {
                                if (i > 2) {
                                  return (
                                    <CommandItem
                                      className="data-[selected=true]:bg-white text-left"
                                      key="all"
                                      value="All countries"
                                      onSelect={() => {
                                        setOtherCountryDropdownStatus(false);
                                        setCurrentCountryExposure(a);
                                      }}
                                    >
                                      <div className="w-90 text-wrap">
                                        <div>{countryByIso3[a]}</div>
                                      </div>
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          currentCountryExposure === a
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  );
                                }
                              })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : null}
            </div>
          </div>
          <div className="pt-5 flex flex-row w-full text-[12px] font-bold justify-around border-t-1 px-4">
            <div className="flex flex-col w-60 items-between text-left">
              <div className="pb-2 border-solid border-b-1">LAYER</div>
              {Object.entries(realtimeObject)
                .filter(([key]) => key !== "Nightlights")
                .map(([key, layer], index: number) => (
                    <div
                      key={key}
                      className="h-[45px] text-[14px] font-medium border-solid border-b-1 flex items-center "
                    >
                      {key}
                    </div>
                  ))}
            </div>
            <div className="w-full text-left">
              <div className="pb-2 border-solid border-b-1 pl-3">EXPOSURE</div>
              {Object.entries(realtimeObject)
                .filter(([key]) => key !== "Nightlights")
                .map(([key, layer], index: number) => (
                  <div
                    key={key}
                    className="h-[45px] text-[14px] font-medium border-solid border-b-1 flex items-center border-l-1 pl-3"
                  >
                    {focusedCountryExposures
                      ? fmt.format(
                        focusedCountryExposures[
                          focusedCountryExposures.indexOf(
                            focusedCountryExposures.find(
                              (c: any) =>
                                c.attributes.areaid == currentCountryExposure,
                            ),
                          )
                        ]?.attributes[key.toLowerCase()],
                      ) +
                      " " +
                      layer.suffix
                      : "N/A"}
                  </div>
                ))}
            </div>
            {currentCountryExposure !== "ALL" ? (
              <div className="w-full text-left">
                <div className="pb-2 border-solid border-b-1 pl-3">
                  PERCENTAGE
                </div>
                {Object.entries(realtimeObject)
                .filter(([key]) => key !== "Nightlights")
                .map(([key, layer], index: number) => (
                    <div
                      key={key + "_pct"}
                      className="h-[45px] text-[14px] font-medium border-solid border-b-1 flex items-center border-l-1 pl-3"
                    >
                      {focusedCountryExposures
                        ? fmt.format(
                          focusedCountryExposures[
                            focusedCountryExposures.indexOf(
                              focusedCountryExposures.find(
                                (c: any) =>
                                  c.attributes.areaid == currentCountryExposure,
                              ),
                            )
                          ]?.attributes[key.toLowerCase() + "_pct"],
                        ) +
                        " " +
                        "%"
                        : "N/A"}
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
          <div className="pt-[24px] pb-5 text-(--accentblue-100) font-bold text-[12px] text-center w-full">
            <u className="cursor-pointer">Explore Methodology</u>
          </div>
        </div>
        <div className="absolute bottom-0 invisible md:visible h-20 w-[350px] bg-[rgba(0,0,0,0.85)] flex flex-col items-center justify-around">
          <div className="w-8/10 flex flex-col items-center justify-end">
            <div className="flex text-white w-full font-extrabold tracking-wide text-[12px] pb-[10px]">
              <div>
                {realtimeObject[realtimeExposure.exposure].title.toUpperCase()}{" "}
                {realtimeObject[realtimeExposure.exposure].unit}
              </div>
            </div>
            <div
              className="h-2 w-full"
              style={{
                background: `linear-gradient(to right, ${realtimeObject[realtimeExposure.exposure].colorScheme.map((e, i) => "rgba(" + e.symbol.color.join(",") + ") " + (i / realtimeObject[realtimeExposure.exposure].colorScheme.length) * 100 + "%," + " rgba(" + e.symbol.color.join(",") + ") " + ((i + 1) / realtimeObject[realtimeExposure.exposure].colorScheme.length) * 100 + "% ").join(",")})`,
              }}
            ></div>
            <div className="h-[20px] w-full flex justify-between">
              {realtimeObject[realtimeExposure.exposure].colorScheme.map(
                (e, i) => (
                  <div key={i} className="flex flex-col w-full h-[full]">
                    <div
                      style={{ justifyContent: "center" }}
                      className="flex items-start w-full h-[20px]"
                    >
                      <div className="flex justify-end items-start w-full gap-0">
                        <div className="text-white text-[12px]">{e.label}</div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
        <arcgis-scale-bar
          className="calcite-mode-dark z-15 absolute top-30 right-5 md:top-auto md:right-auto md:bottom-1 md:left-90 max-w-21"
          ref={scaleBarRef}
          bar-style="line"
          unit="metric"
        ></arcgis-scale-bar>
        <div
          className="flex flex-col items-center justify-center -z-1 xl:z-3 h-14.75 w-15.25 absolute top-20 2xl:top-1 right-3 gap-y-1 cursor-pointer bg-(--accentdarkblue-80) rounded-sm"
          onClick={() => {
            actions?.setDataExplainerState(true);
          }}
        >
          <img src={DataIcon} width={15}></img>
          <span className="font-bold text-white text-xs text-base/5">
            Data Explainer
          </span>
        </div>
      </div>
    </div>
  );
}
