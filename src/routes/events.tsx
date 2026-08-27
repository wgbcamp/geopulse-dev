// creates file-based routing for tanstack react router 
import { createFileRoute } from '@tanstack/react-router'

// react hooks holding state, context, and references
import { AppStateContext } from '../app';
import { useState, useRef, useEffect, useCallback, useContext } from 'react'

// this function constructs className strings conditionally and merges tailwindcss classes in javascript
import { cn } from "@/lib/utils"

// shad cn component imports
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

// imf icons
import DataIcon from '../assets/data_icon.svg';
import Exposures from '../assets/Layers.svg';


// 3rd party icons
import { Check } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
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
import PointSymbol3D from "@arcgis/core/symbols/PointSymbol3D.js";
import ObjectSymbol3DLayer from "@arcgis/core/symbols/ObjectSymbol3DLayer.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

// dataset object configurations
import { realtimeObject } from '@/config/datasets';
import { countryByIso3 } from "@/config/isoCountries";

export const Route = createFileRoute('/events')({
    component: Events,
})

function Events() {

    // reads context from provider for  
    const state = useContext(AppStateContext);

    // state hook that enables/disables exposure sub-category animations
    const [popInState, setPopInState] = useState<string>("initial");


    const [realtimeExposure, setRealtimeExposure] = useState<{ exposure: string, filter: string }>({ exposure: "Population", filter: "Population" });
    const [events, setEvents] = useState<any>(null);
    const [focusedEvent, setFocusedEvent] = useState<any>("");
    const [eventPopup, setEventPopup] = useState<string>("all events");
    const [focusedFeatures, setFocusedFeatures] = useState<any>(null);
    const [focusedSliderValue, setFocusedSliderValue] = useState<number[]>([0]);
    const [focusedSliderPlaying, setFocusedSliderPlaying] = useState<boolean>(false);
    const [focusedCountryExposures, setFocusedCountryExposures] = useState<any>(null);

    const [currentCountryExposure, setCurrentCountryExposure] = useState<any>(null);

    const [otherCountryDropdownStatus, setOtherCountryDropdownStatus] = useState<any>(false);

    const ref = useRef(null);
    const scaleBarRef = useRef<any>(null);
    const eventRef = useRef<HTMLDivElement | null>(null);
    const pulseContainerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [mobileExposures, setMobileExposures] = useState<boolean>(false);

    let map = useRef<Map | null>(null);
    const view = useRef<MapView>(new MapView);

    const baseLayer = useRef<VectorTileLayer | null>(null);
    const boundariesLayer = useRef<VectorTileLayer | null>(null);
    const exposureLayer = useRef<any>(null);
    const eventFeatureLayer = useRef<FeatureLayer | null>(null);

    const [layerSettingsPopup, setLayerSettingsPopup] = useState<boolean>(false);

    const exposureLayerForGroup = useRef<any>(null);
    const graphicsLayer = useRef<GraphicsLayer>(null);
    const outlineLayer = useRef<GraphicsLayer>(null);
    const groupLayer = useRef<GroupLayer>(null);

    const [dataExplainerOpen, setDataExplainerState] = useState(false);
    const [dataExplainerView, setDataExplainerView] = useState("Event Tracking");

    // function getMinZoom(containerWidth: number, containerHeight: number): number {
    //             const minZoomX = Math.log2(containerWidth / 256);
    //             const minZoomY = Math.log2(containerHeight / 256);
    //             return Math.max(minZoomX, minZoomY);
    //         }

    // const [currentZoom, setCurrentZoom] = useState(Math.max(2, getMinZoom(window.innerWidth, window.innerHeight)))
    useEffect(() => {
        view.current.on("click", async (event) => {
            const response = await view.current.hitTest(event);
            console.log(response);
            response.results.forEach((a: any) => {
                events.forEach((i: any) => {
                    if (i.attributes.eventid == a.graphic.attributes.eventid) {
                        focusOnEvent({ longitude: i.geometry.longitude, latitude: i.geometry.latitude }, i.attributes);
                    }
                })
            })
        })
    }, [events]);

    const queryEvents = useCallback(() => {
        if (!eventFeatureLayer.current || !view.current || !pulseContainerRef.current) return;

        const query = eventFeatureLayer.current!.createQuery();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.outSpatialReference = view.current.spatialReference;
        query.maxRecordCountFactor = 5;

        eventFeatureLayer.current!.queryFeatures(query).then((result) => {
            console.log(result);
            result.features.forEach((f: any) => {
                if (!f.geometry) return;
                var x = result.features.map((feature) => {
                    return {
                        attributes: feature.attributes,
                        geometry: feature.geometry
                    }
                }).sort((a, b) => Math.floor(Date.parse(b.attributes.fromdate) / 1000) - Math.floor(Date.parse(a.attributes.fromdate) / 1000));
                setEvents(x);
            })
        });
    }, [eventPopup]);

    //event polygon feature layer
    const eventPolygonsLayer = new FeatureLayer({
        url: "https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/geopulse_episodes/FeatureServer"
    });

    const countryExposures = new FeatureLayer({
        url: "https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/geopulse_exposures_by_country/FeatureServer"
    });

    const fmt = new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
    });


    useEffect(() => {
        if (ref.current) {

            // base layer displaying the regions of the world
            baseLayer.current = new VectorTileLayer({
                url: "https://cdn.arcgis.com/sharing/rest/content/items/d7397603e9274052808839b70812be50/resources/styles/root.json",
                title: "base"
            });

            // graphics layer displaying the polygon of the focused event, only drawn when overlapping with the top layer
            graphicsLayer.current = new GraphicsLayer({
                blendMode: "destination-in",
                title: "graphics",
            });

            // graphics layer displaying the outline of the event
            outlineLayer.current = new GraphicsLayer({
                blendMode: "normal",
                title: "outline",
            });

            // vector tile layer displaying country boundaries
            boundariesLayer.current = new VectorTileLayer({
                url: "https://cdn.arcgis.com/sharing/rest/content/items/e8ecee3086f34b06b85229d832a1c14a/resources/styles/root.json",
                title: "boundaries",
                opacity: 0.25
            });

            // group layer that will only be shown when an event is in focus
            groupLayer.current = new GroupLayer({
                layers: [
                    graphicsLayer.current,
                    outlineLayer.current
                ]
            });

            // stack three layers by default
            map.current = new Map({
                layers: [baseLayer.current, boundariesLayer.current, groupLayer.current]
            });

            // calculate minimum zoom level based on input
            function getMinZoom(containerWidth: number, containerHeight: number): number {
                const minZoomX = Math.log2(containerWidth / 256);
                const minZoomY = Math.log2(containerHeight / 256);
                return Math.max(minZoomX, minZoomY);
            }

            const minZoom = getMinZoom(window.innerWidth, window.innerHeight);

            // default map properties
            view.current = new MapView({
                container: ref.current,
                map: map.current,
                zoom: Math.max(2, minZoom),
                // center: [-40.9465, 0.775],
                center: [state.countryCoordinates.longitude, state.countryCoordinates.latitude],
                constraints: {
                    minZoom: Math.floor(minZoom),
                    maxZoom: 11,
                },
                popupEnabled: false
            });

            // use this for updating symbol sizes
            // reactiveUtils.watch(
            //     () => view.current.zoom,
            //     (newZoom) => {
            //         console.log("Zoom level changed to:", newZoom);
            //         eventFeatureLayer.current.renderer.uniqueValueInfos = uniqueColorValues;
            //         setCurrentZoom(newZoom);
            //     }
            // );
            if (scaleBarRef.current) {
                scaleBarRef.current.view = view.current;
            }

            // force the view view.current.center to the yLimit whenever the user reaches the limit
            const WORLD_HALF_HEIGHT = 20037508.34; // Web Mercator y at ±85.05°

            // reactiveUtils.watch(
            //     () => view.current.extent,
            //     (extent) => {
            //         if (!extent) return;

            //         const halfViewHeight = extent.height / 2;
            //         const yLimit = Math.max(0, WORLD_HALF_HEIGHT - halfViewHeight);

            //         if (Math.abs(view.current.center.y) > yLimit) {
            //             const clamped = view.current.center.clone();
            //             clamped.y = Math.sign(clamped.y) * yLimit;
            //             view.current.goTo({target: clamped}, {duration: 0});
            //         }
            //     }
            // );

            // resize minimum zoom level when viewport is resized
            const resizeObserver = new ResizeObserver((entries) => {
                const { width, height } = entries[0].contentRect;
                const newMinZoom = getMinZoom(width, height);
                view.current.constraints.minZoom = Math.floor(newMinZoom);

                if (view.current.zoom < newMinZoom) {
                    view.current.zoom = newMinZoom;
                }
            });
            resizeObserver.observe(ref.current);

            // remove all arcgis default ui components
            view.current.ui.components = [];
        }

        // clean up
        return () => {
            view.current.destroy();
            baseLayer.current?.destroy();
            boundariesLayer.current?.destroy();
            graphicsLayer.current?.destroy();
            outlineLayer.current?.destroy();
            groupLayer.current?.destroy();
        }

    }, []);

    useEffect(() => {

        if (!map.current || !groupLayer.current) return;

        // Remove existing exposure layers if they exist
        if (exposureLayer.current) {
            map.current.remove(exposureLayer.current);
            exposureLayer.current.destroy();
        }

        if (exposureLayerForGroup.current) {
            groupLayer.current.remove(exposureLayerForGroup.current);
            exposureLayerForGroup.current.destroy();
        }

        const url = realtimeObject[realtimeExposure.exposure].url[realtimeExposure.filter];
        const classBreaksRenderer = new ClassBreaksRenderer({
            field: "Value",
            classBreakInfos: realtimeObject[realtimeExposure.exposure].colorScheme
        });
        const renderer = new SimpleRenderer({
            symbol: new SimpleMarkerSymbol({
                size: 3,
                color: [255, 200, 0],
                outline: "null"
            })
        });

        // assign exposure layer values based on realtime exposure value 
        switch (realtimeExposure.exposure) {
            case "Airports":
            case "Ports":
                exposureLayer.current = new FeatureLayer({
                    url: url,
                    effect: "bloom(1.8, 0.85px, 0.4)",
                    renderer: renderer,
                    title: "exposure"
                });
                exposureLayerForGroup.current = new FeatureLayer({
                    url: url,
                    effect: "bloom(1.8, 0.85px, 0.4)",
                    renderer: renderer,
                    title: "exposure"
                });
                break;
            default:
                exposureLayer.current = new ImageryTileLayer({
                    url: url,
                    renderer: classBreaksRenderer,
                    title: "exposure"
                });
                exposureLayerForGroup.current = new ImageryTileLayer({
                    url: url,
                    renderer: classBreaksRenderer,
                    title: "exposure"
                });
                break;
        }

        // add and reorder exposure layers
        if (groupLayer.current && exposureLayer.current && exposureLayerForGroup.current && graphicsLayer.current && baseLayer.current) {
            map.current.layers.add(exposureLayer.current);
            map.current.reorder(exposureLayer.current, 2);
            groupLayer.current.add(exposureLayerForGroup.current);
            groupLayer.current.layers.reorder(graphicsLayer.current, 2);

            // if an event is focused and focusedFeatures exists, apply blur, darken, and greyscale to layers outside of the group layer
            if (focusedFeatures?.length > 0) {
                baseLayer.current.effect = "blur(6px) brightness(0.7) grayscale(0.8)";
                exposureLayer.current.effect = "blur(6px) brightness(0.7) grayscale(0.8)";
            }
        }
    }, [realtimeExposure])

    const removeBlur = () => {
        if (baseLayer.current && exposureLayer.current && graphicsLayer.current && outlineLayer.current) {
            baseLayer.current.effect = ""; // remove css filters from layers if no event is focused
            exposureLayer.current.effect = "";
            graphicsLayer.current.graphics.removeAll(); // remove graphics from graphics layers
            outlineLayer.current.graphics.removeAll();
            setFocusedFeatures(null); // reset focused features in state
            setFocusedSliderValue([0]); // reset focused slider value
        }
    }

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
                                        randomizeStartTime: true,
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
                                        randomizeStartTime: true,
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
                                                color: x
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
        }


    }
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
                uniqueValueInfos: uniqueColorValues
            },
            definitionExpression: `(fromdate >= timestamp '${toTimestamp(new Date(state?.dateRange.from))}' AND fromdate <= timestamp '${toTimestamp(new Date(state.dateRange.to))}'
            OR
            todate >= timestamp '${toTimestamp(new Date(state.dateRange.from))}' AND todate <= timestamp '${toTimestamp(new Date(state.dateRange.to))}'
            OR
            fromdate <= timestamp '${toTimestamp(new Date(state.dateRange.from))}' AND todate >= timestamp '${toTimestamp(new Date(state.dateRange.to))}'
        )`
        });

        // run query on feature layer
        eventFeatureLayer.current.when(() => {
            queryEvents();
        });

        map.current.add(eventFeatureLayer.current); // add events feature layer to map

    }, [state?.dateRange.from, state?.dateRange.to])

    view.current.whenLayerView(eventFeatureLayer.current as FeatureLayer).then((layerView) => {
        var x = `eventtype='${state?.eventFilter}' AND`
        var y = `%${state?.countryFilter}%`;
        if (state?.eventFilter == "AL") {
            x = '';
        }
        if (state?.countryFilter == "All countries") {
            y = "%";
        }
        layerView.filter = {
            where: `${x} affectedcountries LIKE '${y}'`
        }
    })

    // query feature layer 
    async function highlightCountry(eventid: any, index?: number) {

        const newQuery = eventPolygonsLayer.createQuery();
        newQuery.returnGeometry = true;
        newQuery.outFields = ["*"];
        newQuery.where = `eventid = ${eventid}`;
        const result = await eventPolygonsLayer.queryFeatures(newQuery);
        console.log("events: ", result);

        // const feature = result.features.filter((x) => x.attributes.episodeid == 1); //features.attributes.eventid
        // const feature = result.features[index || 0]; //features.attributes.eventid

        const ascendingFeatures = Object.values(
            result.features.reduce((groups, feature) => {
                const id = feature.attributes.episodeid;
                (groups[id] ??= []).push(feature);
                return groups;
            }, {} as Record<number, typeof result.features>)
        ).sort((a, b) => a[0].attributes.episodeid - b[0].attributes.episodeid);

        console.log("ASCENDING FEATURES: ", ascendingFeatures);

        console.log("feature ", result.features);



        setFocusedFeatures(ascendingFeatures); // Store the features in state
        console.log("FocusedFeatures: ", ascendingFeatures);

        let combinedExtent: __esri.Extent | null = null;
        for (const feature of result.features) {
            const ext = feature.geometry?.extent;
            console.log("feature element extent: ", feature.geometry?.extent?.toJSON());
            if (!ext) continue;
            combinedExtent = combinedExtent ? combinedExtent.union(ext) : ext;
        }

        if (combinedExtent) {
            console.log("combinedExtent: ", combinedExtent.toJSON());
            view.current.goTo(combinedExtent);
        }



        applyPolygon(ascendingFeatures[ascendingFeatures.length - 1]); // Apply the polygon styling from the first feature (or the specified index)
    }

    const applyPolygon = (features: any) => {
        console.log("sS: ", features);
        if (features && graphicsLayer.current && baseLayer.current && groupLayer.current && outlineLayer.current) {
            graphicsLayer.current.graphics.removeAll();
            outlineLayer.current.graphics.removeAll();

            let graphicsSymbol = {
                type: "simple-fill",
                color: "rgba(255, 255, 255, 1)",
                outline: {
                    color: "#7E0063",
                    width: "2px"
                },
            };

            let outlineSymbol = {
                type: "simple-fill",
                color: "rgba(0, 0, 0, 0.3)",
                outline: {
                    color: "#7E0063",
                    width: "2px"
                },
            };

            features.forEach((x: any) => {
                const graphicClone = x.clone();
                graphicClone.symbol = graphicsSymbol;
                graphicsLayer.current?.graphics.add(graphicClone);

                const outlineClone = x.clone();
                outlineClone.symbol = outlineSymbol;
                outlineLayer.current?.graphics.add(outlineClone);
            })

            baseLayer.current.effect = "blur(6px) brightness(0.7) grayscale(0.8)"; // blur, darken, and greyscale map base layer
            exposureLayer.current.effect = "blur(6px) brightness(0.7) grayscale(0.8)"; // blur, darken, and greyscale map exposure layer
            groupLayer.current.effect = "brightness(1) drop-shadow(0, 0px, 12px, #7E0063)"; // brighten and add drop shadow to the group layer

            // view.current.goTo(features[0].geometry.extent);

            // eventPolygonsLayer.queryExtent().then((res) => {
            //     console.log(res.extent);
            //     view.current.goTo(res.extent);
            // })
        }
    }

    useEffect(() => {
        setFocusedSliderValue([focusedFeatures?.length - 1]);
    }, [focusedFeatures]);

    // focuses view on the event selected
    const focusOnEvent = async (coors: { longitude: number, latitude: number }, attributes: any) => {
        pauseSlider();
        removeBlur(); // remove blur from previous event if it exists
        setFocusedSliderValue([0]); // reset slider value to 0 when focusing on a new event
        console.log(coors);

        if (!map.current) return;

        // reveal group layer for focused event and blur other layers
        highlightCountry(attributes.eventid);


        console.log(map.current);

        const newQuery = countryExposures.createQuery();
        newQuery.returnGeometry = true;
        newQuery.outFields = ["*"];
        newQuery.where = `eventid = ${attributes.eventid}`;
        const result = await countryExposures.queryFeatures(newQuery);
        console.log("theCountryEXPOSURES: ", result);
        setCurrentCountryExposure("ALL");
        setFocusedCountryExposures(result.features);
        setFocusedEvent(attributes);
        setEventPopup("focused event");

        // hide event dots 
        document.querySelectorAll<HTMLElement>(".pw").forEach(element => {
            element.style.visibility = "hidden";
        })

        if (!eventFeatureLayer.current) return;
        eventFeatureLayer.current.renderer.uniqueValueInfos = [];
    }

    // play through the event by incrementing the slider value which updates the position
    const playEvent = (status: string) => {
        const blocker = focusedEvent;
        let i = focusedSliderValue[0];
        let interval = 0;

        switch (status) {
            case "play":
                setFocusedSliderPlaying(true);
                intervalRef.current = setInterval(() => {
                    if (blocker !== focusedEvent || ((i >= focusedFeatures.length - 1) && (interval !== 0))) {
                        pauseSlider();
                        return;
                    } else if (((i == focusedFeatures.length - 1) && (interval == 0))) {
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
    }

    const unfocusEvent = () => {
        setEventPopup("all events");
        setFocusedEvent("");
        removeBlur();
        pauseSlider();
        if (!eventFeatureLayer.current) return;
        console.log("DUD")
        eventFeatureLayer.current.renderer.uniqueValueInfos = uniqueColorValues;
    }

    const exposuresArray: any = [
        {
            name: "Population",
            id: "population",
            icon: <svg width="17" height="17" viewBox="0 0 17 17" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.26163 2.05815C9.26163 1.47929 8.81141 1.02908 8.23256 1.02908C7.65371 1.02908 7.20349 1.47929 7.20349 2.05815C7.20349 2.637 7.65371 3.08721 8.23256 3.08721C8.81141 3.08721 9.26163 2.637 9.26163 2.05815ZM6.17442 2.05815C6.17442 0.9326 7.10701 5.48363e-06 8.23256 5.48363e-06C9.3581 5.48363e-06 10.2907 0.9326 10.2907 2.05815C10.2907 3.18369 9.3581 4.11628 8.23256 4.11628C7.10701 4.11628 6.17442 3.18369 6.17442 2.05815ZM3.08721 3.60175C3.50527 3.60175 3.85901 3.24801 3.85901 2.82995C3.85901 2.41189 3.50527 2.05815 3.08721 2.05815C2.66915 2.05815 2.31541 2.41189 2.31541 2.82995C2.31541 3.24801 2.66915 3.60175 3.08721 3.60175ZM3.08721 1.02908C4.08412 1.02908 4.88808 1.83304 4.88808 2.82995C4.88808 3.82686 4.08412 4.63082 3.08721 4.63082C2.0903 4.63082 1.28634 3.82686 1.28634 2.82995C1.28634 1.83304 2.0903 1.02908 3.08721 1.02908ZM13.3779 3.60175C13.796 3.60175 14.1497 3.24801 14.1497 2.82995C14.1497 2.41189 13.796 2.05815 13.3779 2.05815C12.9598 2.05815 12.6061 2.41189 12.6061 2.82995C12.6061 3.24801 12.9598 3.60175 13.3779 3.60175ZM13.3779 1.02908C14.3748 1.02908 15.1788 1.83304 15.1788 2.82995C15.1788 3.82686 14.3748 4.63082 13.3779 4.63082C12.381 4.63082 11.577 3.82686 11.577 2.82995C11.577 1.83304 12.381 1.02908 13.3779 1.02908ZM4.08412 6.20658C3.85901 6.52817 3.66606 6.84975 3.50527 7.20349C2.12246 7.23565 1.02907 8.39336 1.02907 9.77617C1.02907 10.548 1.35065 11.2233 1.89735 11.7057C1.99382 11.8021 2.05814 11.9308 2.05814 12.0916V14.9215C2.05814 15.2109 1.83303 15.4361 1.5436 15.4361C1.25418 15.4361 1.02907 15.2109 1.02907 14.9215V12.2845C0.385901 11.6414 0 10.7731 0 9.77617C0 7.78235 1.60792 6.17442 3.60174 6.17442C3.76254 6.17442 3.92333 6.17442 4.08412 6.20658ZM12.9598 7.20349C12.7991 6.84975 12.6061 6.52817 12.381 6.20658C12.5418 6.17442 12.7026 6.17442 12.8634 6.17442C14.8572 6.17442 16.4651 7.78235 16.4651 9.77617C16.4651 10.7731 16.0792 11.6414 15.436 12.2845V14.9215C15.436 15.2109 15.2109 15.4361 14.9215 15.4361C14.6321 15.4361 14.407 15.2109 14.407 14.9215V12.0916C14.407 11.9308 14.4713 11.8021 14.5678 11.7057C15.1145 11.2233 15.436 10.548 15.436 9.77617C15.436 8.39336 14.3427 7.26781 12.9598 7.20349ZM8.23256 6.68896C6.81759 6.68896 5.65988 7.84666 5.65988 9.26163V9.77617C5.65988 10.548 5.98147 11.2233 6.52816 11.7057C6.62464 11.8021 6.68895 11.9308 6.68895 12.0916V14.6642C6.68895 15.0823 7.0427 15.4361 7.46076 15.4361H9.00436C9.42242 15.4361 9.77616 15.0823 9.77616 14.6642V12.0916C9.77616 11.9308 9.84048 11.8021 9.93696 11.7057C10.4836 11.2233 10.8052 10.548 10.8052 9.77617V9.26163C10.8052 7.84666 9.64753 6.68896 8.23256 6.68896ZM4.63081 9.26163C4.63081 7.26781 6.23874 5.65989 8.23256 5.65989C10.2264 5.65989 11.8343 7.26781 11.8343 9.26163V9.77617C11.8343 10.7731 11.4484 11.6414 10.8052 12.2845V14.6642C10.8052 15.6612 10.0013 16.4651 9.00436 16.4651H7.46076C6.46384 16.4651 5.65988 15.6612 5.65988 14.6642V12.2845C5.01672 11.6414 4.63081 10.7731 4.63081 9.77617V9.26163Z" />
            </svg>,
            categories: ["Working population", "< 15 years old", "≥ 65 years old"],
            suffix: "people"
        },
        {
            name: "Buildings",
            id: "buildings",
            icon: <svg width="21" height="17" viewBox="0 0 21 17" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5877 1.02908H11.3842C10.8054 1.02908 10.3552 1.47929 10.3552 2.05815V4.01981L9.32608 3.11937V2.05815C9.32608 0.9326 10.2587 5.48363e-06 11.3842 5.48363e-06H18.5877C19.7133 5.48363e-06 20.6458 0.9326 20.6458 2.05815V14.407C20.6458 15.5325 19.7133 16.4651 18.5877 16.4651H13.3137C13.5388 16.1435 13.6996 15.822 13.7961 15.4361H18.5877C19.1666 15.4361 19.6168 14.9858 19.6168 14.407V2.05815C19.6168 1.47929 19.1666 1.02908 18.5877 1.02908ZM15.7578 3.85902C15.7578 3.56959 15.9829 3.34448 16.2723 3.34448H16.7868C17.0763 3.34448 17.3014 3.56959 17.3014 3.85902V4.37355C17.3014 4.66298 17.0763 4.88809 16.7868 4.88809H16.2723C15.9829 4.88809 15.7578 4.66298 15.7578 4.37355V3.85902ZM16.2723 6.43169H16.7868C17.0763 6.43169 17.3014 6.6568 17.3014 6.94623V7.46076C17.3014 7.75019 17.0763 7.9753 16.7868 7.9753H16.2723C15.9829 7.9753 15.7578 7.75019 15.7578 7.46076V6.94623C15.7578 6.6568 15.9829 6.43169 16.2723 6.43169ZM15.7578 10.0334C15.7578 9.74401 15.9829 9.5189 16.2723 9.5189H16.7868C17.0763 9.5189 17.3014 9.74401 17.3014 10.0334V10.548C17.3014 10.8374 17.0763 11.0625 16.7868 11.0625H16.2723C15.9829 11.0625 15.7578 10.8374 15.7578 10.548V10.0334ZM13.1851 3.34448H13.6996C13.9891 3.34448 14.2142 3.56959 14.2142 3.85902V4.37355C14.2142 4.66298 13.9891 4.88809 13.6996 4.88809H13.1851C12.8957 4.88809 12.6706 4.66298 12.6706 4.37355V3.85902C12.6706 3.56959 12.8957 3.34448 13.1851 3.34448ZM7.10715 3.21585L13.2816 8.61846C13.4745 8.81142 13.5067 9.133 13.3137 9.35811C13.1208 9.55106 12.7992 9.58322 12.5741 9.39027L12.4133 9.22948V14.407C12.4133 15.5325 11.4807 16.4651 10.3552 16.4651H3.15166C2.02612 16.4651 1.09352 15.5325 1.09352 14.407V9.22948L0.932731 9.39027C0.707622 9.58322 0.386037 9.55106 0.193087 9.35811C0.000136264 9.133 0.0322947 8.81142 0.257404 8.61846L6.43182 3.21585C6.62477 3.05506 6.9142 3.05506 7.10715 3.21585ZM11.3842 8.32904L6.75341 4.27708L2.12259 8.32904V14.407C2.12259 14.9858 2.57281 15.4361 3.15166 15.4361H10.3552C10.934 15.4361 11.3842 14.9858 11.3842 14.407V8.32904ZM4.95253 9.5189C4.95253 8.94005 5.40275 8.48983 5.9816 8.48983H7.52521C8.10406 8.48983 8.55428 8.94005 8.55428 9.5189V11.0625C8.55428 11.6414 8.10406 12.0916 7.52521 12.0916H5.9816C5.40275 12.0916 4.95253 11.6414 4.95253 11.0625V9.5189ZM5.9816 9.5189V11.0625H7.52521V9.5189H5.9816Z" fill="white" />
            </svg>
            ,
            categories: [],
            suffix: "assets"
        },
        {
            name: "Capital stock",
            id: "capitalstock_res",
            icon: <svg width="21" height="17" viewBox="0 0 21 17" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5877 1.02908H11.3842C10.8054 1.02908 10.3552 1.47929 10.3552 2.05815V4.01981L9.32608 3.11937V2.05815C9.32608 0.9326 10.2587 5.48363e-06 11.3842 5.48363e-06H18.5877C19.7133 5.48363e-06 20.6458 0.9326 20.6458 2.05815V14.407C20.6458 15.5325 19.7133 16.4651 18.5877 16.4651H13.3137C13.5388 16.1435 13.6996 15.822 13.7961 15.4361H18.5877C19.1666 15.4361 19.6168 14.9858 19.6168 14.407V2.05815C19.6168 1.47929 19.1666 1.02908 18.5877 1.02908ZM15.7578 3.85902C15.7578 3.56959 15.9829 3.34448 16.2723 3.34448H16.7868C17.0763 3.34448 17.3014 3.56959 17.3014 3.85902V4.37355C17.3014 4.66298 17.0763 4.88809 16.7868 4.88809H16.2723C15.9829 4.88809 15.7578 4.66298 15.7578 4.37355V3.85902ZM16.2723 6.43169H16.7868C17.0763 6.43169 17.3014 6.6568 17.3014 6.94623V7.46076C17.3014 7.75019 17.0763 7.9753 16.7868 7.9753H16.2723C15.9829 7.9753 15.7578 7.75019 15.7578 7.46076V6.94623C15.7578 6.6568 15.9829 6.43169 16.2723 6.43169ZM15.7578 10.0334C15.7578 9.74401 15.9829 9.5189 16.2723 9.5189H16.7868C17.0763 9.5189 17.3014 9.74401 17.3014 10.0334V10.548C17.3014 10.8374 17.0763 11.0625 16.7868 11.0625H16.2723C15.9829 11.0625 15.7578 10.8374 15.7578 10.548V10.0334ZM13.1851 3.34448H13.6996C13.9891 3.34448 14.2142 3.56959 14.2142 3.85902V4.37355C14.2142 4.66298 13.9891 4.88809 13.6996 4.88809H13.1851C12.8957 4.88809 12.6706 4.66298 12.6706 4.37355V3.85902C12.6706 3.56959 12.8957 3.34448 13.1851 3.34448ZM7.10715 3.21585L13.2816 8.61846C13.4745 8.81142 13.5067 9.133 13.3137 9.35811C13.1208 9.55106 12.7992 9.58322 12.5741 9.39027L12.4133 9.22948V14.407C12.4133 15.5325 11.4807 16.4651 10.3552 16.4651H3.15166C2.02612 16.4651 1.09352 15.5325 1.09352 14.407V9.22948L0.932731 9.39027C0.707622 9.58322 0.386037 9.55106 0.193087 9.35811C0.000136264 9.133 0.0322947 8.81142 0.257404 8.61846L6.43182 3.21585C6.62477 3.05506 6.9142 3.05506 7.10715 3.21585ZM11.3842 8.32904L6.75341 4.27708L2.12259 8.32904V14.407C2.12259 14.9858 2.57281 15.4361 3.15166 15.4361H10.3552C10.934 15.4361 11.3842 14.9858 11.3842 14.407V8.32904ZM4.95253 9.5189C4.95253 8.94005 5.40275 8.48983 5.9816 8.48983H7.52521C8.10406 8.48983 8.55428 8.94005 8.55428 9.5189V11.0625C8.55428 11.6414 8.10406 12.0916 7.52521 12.0916H5.9816C5.40275 12.0916 4.95253 11.6414 4.95253 11.0625V9.5189ZM5.9816 9.5189V11.0625H7.52521V9.5189H5.9816Z" fill="white" />
            </svg>
            ,
            categories: ["Residential capital stock", "Non-residential capital stock"],
            suffix: "in 2021 USD"
        },
        {
            name: "Nightlights",
            id: "nightlights",
            icon: <svg width="11" height="17" viewBox="0 0 11 17" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.47311 0.28946C4.59866 3.38703e-05 5.65988 0.836153 5.65988 1.99386C5.65988 2.09033 5.65988 2.21897 5.62773 2.31544L8.10392 1.70443C9.22947 1.415 10.2907 2.25112 10.2907 3.40883C10.2907 3.8912 10.0656 4.37358 9.744 4.69516C10.0656 5.01675 10.2907 5.46697 10.2907 5.9815C10.2907 6.46388 10.0656 6.94625 9.744 7.26784C10.0656 7.58942 10.2907 8.03964 10.2907 8.55418C10.2907 9.35814 9.744 10.0656 8.9722 10.2586L6.68895 10.8374V12.4775H7.20349C7.78234 12.4775 8.23256 12.9277 8.23256 13.5066V14.0211C8.23256 15.4361 7.07485 16.5938 5.65988 16.5938H4.63081C3.21584 16.5938 2.05814 15.4361 2.05814 14.0211V13.5066C2.05814 12.9277 2.50836 12.4775 3.08721 12.4775H3.60174V10.355L4.63081 10.0978V12.4775H5.65988V10.4194C5.65988 10.1943 5.82068 9.96915 6.04578 9.93699L8.71493 9.26166C9.03652 9.16519 9.26163 8.87576 9.26163 8.55418C9.26163 8.0718 8.81141 7.71806 8.36119 7.84669C4.92024 8.68281 6.6568 8.26475 4.24491 8.87576L2.18677 9.3903C1.09339 9.64756 0 8.81144 0 7.65374C0 7.17136 0.225109 6.68899 0.546693 6.3674C0.225109 6.04582 0 5.5956 0 5.08107C0 4.59869 0.225109 4.11631 0.546693 3.79473C0.225109 3.47314 0 3.02293 0 2.50839C0 1.70443 0.546693 0.996945 1.35065 0.803995L3.47311 0.28946ZM3.98765 7.84669L8.71493 6.68899C9.03652 6.59251 9.26163 6.30309 9.26163 5.9815C9.26163 5.49913 8.81141 5.14538 8.36119 5.24186L2.18677 6.78546L1.57576 6.94625C1.25418 7.04273 1.02907 7.33216 1.02907 7.65374C1.02907 8.13612 1.47929 8.48986 1.92951 8.36123L3.98765 7.84669ZM4.34139 3.69825L2.18677 4.21279L1.57576 4.37358C1.25418 4.47006 1.02907 4.75948 1.02907 5.08107C1.02907 5.56344 1.47929 5.91719 1.92951 5.78855L8.10392 4.27711V4.24495L8.71493 4.11631C9.03652 4.01984 9.26163 3.73041 9.26163 3.40883C9.26163 2.92645 8.81141 2.57271 8.36119 2.70134L4.34139 3.69825H4.30923H4.34139ZM4.63081 1.99386C4.63081 1.51148 4.1806 1.15774 3.73038 1.28637L1.57576 1.80091C1.25418 1.89738 1.02907 2.18681 1.02907 2.50839C1.02907 2.99077 1.47929 3.34451 1.92951 3.21588L4.08412 2.70134C4.40571 2.60487 4.63081 2.31544 4.63081 1.99386ZM3.08721 13.5066V14.0211C3.08721 14.8894 3.79469 15.5647 4.63081 15.5647H5.65988C6.52816 15.5647 7.20349 14.8894 7.20349 14.0211V13.5066H3.08721Z" fill="white" />
            </svg>
            ,
            categories: [],
            suffix: ""
        },
        {
            name: "GDP",
            id: "gdp",
            icon: <svg width="17" height="13" viewBox="0 0 17 13" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.05814 1.02911C1.47929 1.02911 1.02907 1.47933 1.02907 2.05818V3.08725C2.15461 3.08725 3.08721 2.15465 3.08721 1.02911H2.05814ZM1.02907 4.11632V8.2326C2.73347 8.2326 4.11628 9.61541 4.11628 11.3198H12.3488C12.3488 9.61541 13.7316 8.2326 15.436 8.2326V4.11632C13.7316 4.11632 12.3488 2.73351 12.3488 1.02911H4.11628C4.11628 2.73351 2.73347 4.11632 1.02907 4.11632ZM13.3779 11.3198H14.407C14.9858 11.3198 15.436 10.8696 15.436 10.2907V9.26167C14.3105 9.26167 13.3779 10.1943 13.3779 11.3198ZM1.02907 9.26167V10.2907C1.02907 10.8696 1.47929 11.3198 2.05814 11.3198H3.08721C3.08721 10.1943 2.15461 9.26167 1.02907 9.26167ZM15.436 3.08725V2.05818C15.436 1.47933 14.9858 1.02911 14.407 1.02911H13.3779C13.3779 2.15465 14.3105 3.08725 15.436 3.08725ZM0 2.05818C0 0.932634 0.932594 3.95775e-05 2.05814 3.95775e-05H14.407C15.5325 3.95775e-05 16.4651 0.932634 16.4651 2.05818V10.2907C16.4651 11.4163 15.5325 12.3489 14.407 12.3489H2.05814C0.932594 12.3489 0 11.4163 0 10.2907V2.05818ZM10.2907 6.17446C10.2907 5.04891 9.3581 4.11632 8.23256 4.11632C7.10701 4.11632 6.17442 5.04891 6.17442 6.17446C6.17442 7.3 7.10701 8.2326 8.23256 8.2326C9.3581 8.2326 10.2907 7.3 10.2907 6.17446ZM5.14535 6.17446C5.14535 4.47006 6.52816 3.08725 8.23256 3.08725C9.93696 3.08725 11.3198 4.47006 11.3198 6.17446C11.3198 7.87886 9.93696 9.26167 8.23256 9.26167C6.52816 9.26167 5.14535 7.87886 5.14535 6.17446Z" />
            </svg>
            ,
            categories: ["Agriculture", "Mining", "Electricity", "Construction", "Manufacturing", "Transportation", "Trade",  "Finance", "Government", "Other"],
            suffix: "USD"
        },
        {
            name: "Urban GDP",
            id: "gdp",
            icon: <svg width="19" height="17" viewBox="0 0 19 17" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.26163 1.02908C8.68278 1.02908 8.23256 1.47929 8.23256 2.05815V14.407C8.23256 14.9858 8.68278 15.4361 9.26163 15.4361H16.4651C17.044 15.4361 17.4942 14.9858 17.4942 14.407V8.23256C17.4942 7.65371 17.044 7.20349 16.4651 7.20349H13.8924C13.603 7.20349 13.3779 6.97838 13.3779 6.68896V2.05815C13.3779 1.47929 12.9277 1.02908 12.3488 1.02908H9.26163ZM7.20349 14.407V4.11628H2.05814C1.47929 4.11628 1.02907 4.5665 1.02907 5.14535V14.407C1.02907 14.9858 1.47929 15.4361 2.05814 15.4361H7.49291C7.29996 15.1466 7.20349 14.7929 7.20349 14.407ZM7.20349 2.05815C7.20349 0.9326 8.13608 5.48363e-06 9.26163 5.48363e-06H12.3488C13.4744 5.48363e-06 14.407 0.9326 14.407 2.05815V6.17442H16.4651C17.5907 6.17442 18.5233 7.10702 18.5233 8.23256V14.407C18.5233 15.5325 17.5907 16.4651 16.4651 16.4651H2.05814C0.932594 16.4651 0 15.5325 0 14.407V5.14535C0 4.01981 0.932594 3.08721 2.05814 3.08721V0.51454C2.05814 0.225114 2.28325 5.48363e-06 2.57267 5.48363e-06C2.8621 5.48363e-06 3.08721 0.225114 3.08721 0.51454V3.08721H4.88808V0.51454C4.88808 0.225114 5.11319 5.48363e-06 5.40262 5.48363e-06C5.69204 5.48363e-06 5.91715 0.225114 5.91715 0.51454V3.08721H7.20349V2.05815ZM10.0334 3.34448C10.0334 3.05506 10.2585 2.82995 10.548 2.82995H11.0625C11.3519 2.82995 11.577 3.05506 11.577 3.34448V3.85902C11.577 4.14844 11.3519 4.37355 11.0625 4.37355H10.548C10.2585 4.37355 10.0334 4.14844 10.0334 3.85902V3.34448ZM10.548 5.91716H11.0625C11.3519 5.91716 11.577 6.14227 11.577 6.43169V6.94623C11.577 7.23565 11.3519 7.46076 11.0625 7.46076H10.548C10.2585 7.46076 10.0334 7.23565 10.0334 6.94623V6.43169C10.0334 6.14227 10.2585 5.91716 10.548 5.91716ZM10.0334 9.5189C10.0334 9.22948 10.2585 9.00437 10.548 9.00437H11.0625C11.3519 9.00437 11.577 9.22948 11.577 9.5189V10.0334C11.577 10.3229 11.3519 10.548 11.0625 10.548H10.548C10.2585 10.548 10.0334 10.3229 10.0334 10.0334V9.5189ZM3.34448 5.91716H3.85901C4.14844 5.91716 4.37355 6.14227 4.37355 6.43169V6.94623C4.37355 7.23565 4.14844 7.46076 3.85901 7.46076H3.34448C3.05505 7.46076 2.82994 7.23565 2.82994 6.94623V6.43169C2.82994 6.14227 3.05505 5.91716 3.34448 5.91716ZM2.82994 9.5189C2.82994 9.22948 3.05505 9.00437 3.34448 9.00437H3.85901C4.14844 9.00437 4.37355 9.22948 4.37355 9.5189V10.0334C4.37355 10.3229 4.14844 10.548 3.85901 10.548H3.34448C3.05505 10.548 2.82994 10.3229 2.82994 10.0334V9.5189ZM14.6642 9.00437H15.1788C15.4682 9.00437 15.6933 9.22948 15.6933 9.5189V10.0334C15.6933 10.3229 15.4682 10.548 15.1788 10.548H14.6642C14.3748 10.548 14.1497 10.3229 14.1497 10.0334V9.5189C14.1497 9.22948 14.3748 9.00437 14.6642 9.00437Z" fill="white" />
            </svg>,
            categories: [],
            suffix: "USD"
        },
        {
            name: "Cropland",
            id: "cropland",
            icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.932617 17.3335C0.739667 17.5586 0.418082 17.5586 0.225132 17.3335C2.27168e-05 17.1406 0.0321811 16.819 0.225132 16.626L0.932617 17.3335ZM2.37975 7.97541C2.50838 7.97541 2.63701 8.03973 2.73349 8.1362L4.21278 9.61549C5.01674 10.3873 5.27401 11.5128 5.0489 12.5097C6.04581 12.2846 7.17135 12.5419 7.94316 13.3459L9.42244 14.8252C9.51892 14.9216 9.58324 15.0503 9.58324 15.1789C9.58324 15.3075 9.51892 15.4362 9.42244 15.5326L9.19733 15.7899C8.00747 16.9798 6.04581 16.9798 4.82379 15.7899L3.66608 14.6322L0.932617 17.3335C0.707508 17.1084 0.450241 16.8511 0.225132 16.626L2.92644 13.8926L1.76874 12.7349C0.578874 11.5128 0.578874 9.58333 1.76874 8.36131L2.026 8.1362L2.09032 8.07189C2.1868 8.00757 2.28327 7.97541 2.37975 7.97541ZM7.23567 14.0534C6.49603 13.3459 5.33832 13.2494 4.5022 13.8926L4.43789 13.9569L5.56343 15.0503C6.30308 15.8221 7.5251 15.8542 8.32906 15.1789L7.23567 14.0534ZM5.72422 4.63093C5.85286 4.63093 5.98149 4.69525 6.07797 4.79173L7.55725 6.27101C8.36121 7.04282 8.61848 8.16836 8.39337 9.16527C9.39028 8.94016 10.5158 9.19743 11.2876 10.0014L12.7669 11.4807C12.8634 11.5772 12.9277 11.7058 12.9277 11.8344C12.9277 11.9631 12.8634 12.0917 12.7669 12.1882L12.5418 12.4454C11.3519 13.6353 9.39028 13.6353 8.16826 12.4454L5.11321 9.39038C3.92335 8.16836 3.92335 6.23885 5.11321 5.01683L5.37048 4.79173L5.4348 4.72741C5.53127 4.66309 5.62775 4.63093 5.72422 4.63093ZM2.37975 9.22959C1.70442 10.0335 1.73658 11.2556 2.50838 11.9952L3.63393 13.1208L3.66608 13.0564L3.79472 12.8956C4.30925 12.0917 4.18062 11.0305 3.50529 10.323L2.37975 9.22959ZM10.5801 10.7089C9.8405 9.96923 8.6828 9.90492 7.84668 10.5481L7.78236 10.5802L8.90791 11.7058C9.64755 12.4776 10.8696 12.5097 11.6735 11.8344L10.5801 10.7089ZM9.0687 1.28646C9.19733 1.28646 9.32597 1.35077 9.42244 1.44725L10.9017 2.92654C11.7057 3.69834 11.963 4.82388 11.7378 5.82079C12.7348 5.59569 13.8603 5.85295 14.6321 6.65691L16.1114 8.1362C16.2079 8.23268 16.2722 8.36131 16.2722 8.48994C16.2722 8.61858 16.2079 8.74721 16.1114 8.84369L15.8863 9.10095C14.6964 10.2908 12.7348 10.2908 11.5127 9.10095L8.45769 6.0459C7.26783 4.82388 7.26783 2.89438 8.45769 1.67236L8.71496 1.44725L8.77927 1.38293C8.87575 1.31861 8.97222 1.28646 9.0687 1.28646ZM5.72422 5.88511C5.0489 6.68907 5.08105 7.91109 5.85286 8.65074L6.9784 9.77628L7.01056 9.71197L7.13919 9.55117C7.65373 8.74721 7.5251 7.68598 6.84977 6.9785L5.72422 5.88511ZM13.9246 7.3644C13.185 6.62476 12.0273 6.56044 11.1912 7.20361L11.1268 7.26792L12.2524 8.36131C12.992 9.13311 14.214 9.16527 15.018 8.48994L13.9246 7.3644ZM9.0687 2.54064C8.39337 3.3446 8.42553 4.56662 9.19733 5.30626L10.3229 6.43181L10.355 6.36749L10.4837 6.2067C10.9982 5.40274 10.8696 4.34151 10.1942 3.63402L9.0687 2.54064ZM17.1405 0.00011903C17.2369 0.0322775 17.3334 0.0644359 17.3977 0.160911C17.4942 0.257386 17.5585 0.38602 17.5585 0.514654V1.6402V1.80099C17.4942 3.31244 16.24 4.56662 14.7286 4.63093H14.5678H13.4422C13.3136 4.63093 13.185 4.56662 13.0885 4.47014C12.992 4.37367 12.9277 4.24503 12.9277 4.1164V2.99085C12.9277 1.35077 14.2784 0.00011903 15.9184 0.00011903H17.044H17.1405ZM15.9184 1.02919C14.8251 1.02919 13.9568 1.89747 13.9568 2.99085V3.60186H14.5678H14.7607C15.6933 3.50539 16.433 2.76574 16.5295 1.83315V1.6402V1.02919H15.9184Z" />
            </svg>,
            categories: [],
            suffix: "hectares"
        },
        {
            name: "Airports",
            id: "airports",
            icon: <svg width="19" height="17" viewBox="0 0 19 17" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.7544 6.17442C17.88 6.17442 18.8126 7.10702 18.8126 8.23256C18.8126 9.35811 17.88 10.2907 16.7544 10.2907H13.3778L7.87871 16.3043C7.78224 16.4008 7.6536 16.4651 7.49281 16.4651H4.92014C4.75935 16.4651 4.59855 16.4008 4.50208 16.24C4.4056 16.1114 4.37344 15.9506 4.43776 15.7898L6.27079 10.2907H4.4056L2.50826 12.6704C2.41178 12.7991 2.25099 12.8634 2.0902 12.8634H0.546591C0.385799 12.8634 0.225007 12.7991 0.128532 12.6704C0.0320562 12.5418 -0.000102188 12.381 0.0642147 12.2202L1.06113 8.23256L0.0642147 4.24492C-0.000102188 4.08413 0.0320562 3.92333 0.128532 3.7947C0.225007 3.66607 0.385799 3.60175 0.546591 3.60175H2.0902C2.25099 3.60175 2.41178 3.66607 2.50826 3.7947L4.4056 6.17442H6.27079L4.43776 0.675333C4.37344 0.51454 4.4056 0.353748 4.50208 0.225114C4.59855 0.0964808 4.75935 5.48363e-06 4.92014 5.48363e-06H7.49281C7.6536 5.48363e-06 7.78224 0.0643223 7.87871 0.160798L13.3778 6.17442H16.7544ZM17.7835 8.23256C17.7835 7.65371 17.3333 7.20349 16.7544 7.20349H4.14834C3.98754 7.20349 3.85891 7.13918 3.76243 7.01054L1.83293 4.63082H1.22192L2.0902 8.10393C2.0902 8.20041 2.0902 8.26472 2.0902 8.3612L1.22192 11.8343H1.83293L3.76243 9.45458C3.85891 9.32595 3.98754 9.26163 4.14834 9.26163H16.7544C17.3333 9.26163 17.7835 8.81142 17.7835 8.23256ZM11.995 10.2907H7.36418L5.62762 15.4361H7.2677L11.995 10.2907ZM7.2677 1.02908H5.62762L7.36418 6.17442H11.995L7.2677 1.02908Z" />
            </svg>,
            categories: [],
            suffix: "airports"
        },
        {
            name: "Ports",
            id: "ports",
            icon: <svg width="21" height="18" viewBox="0 0 21 18" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6062 15.1466C13.7639 14.4713 15.2432 14.5034 16.3687 15.3074L16.5938 15.4682C17.1084 15.7898 17.6229 16.047 18.1053 16.1435C18.652 16.24 19.2308 16.1757 19.8097 15.7576L19.9061 15.7255C20.0991 15.629 20.3885 15.6933 20.5171 15.8863C20.6779 16.1114 20.6458 16.4329 20.3885 16.5937L20.2599 16.6902C19.4881 17.2047 18.6841 17.3012 17.9123 17.1726C17.237 17.044 16.5938 16.6902 16.015 16.3043L15.7577 16.1435C14.9859 15.5968 13.9568 15.5647 13.1207 16.047L12.9599 16.1435C12.1881 16.6902 11.3842 17.1726 10.5159 17.2369H10.3229C9.51896 17.2369 8.715 16.851 8.00752 16.3686L7.68593 16.1435C6.91413 15.5968 5.8529 15.5325 5.04894 16.047L4.88815 16.1435C4.14851 16.6581 3.24807 17.1726 2.28332 17.2047L2.09037 17.2369C1.54367 17.2047 0.996979 17.0761 0.482445 16.7545L0.257336 16.5937L0.16086 16.5294C6.81318e-05 16.3686 6.81318e-05 16.0792 0.128702 15.8863C0.289494 15.6933 0.546761 15.629 0.77187 15.7255L0.836187 15.7576L0.996979 15.8863C1.38288 16.1114 1.73662 16.1757 2.09037 16.2078L2.219 16.1757C2.89433 16.1435 3.60181 15.8219 4.27714 15.3074L4.50225 15.1466C5.69211 14.4713 7.1714 14.5034 8.29694 15.3074L8.58637 15.5004C9.2617 15.9506 9.80839 16.2078 10.3229 16.2078H10.548C11.0626 16.1435 11.6414 15.8219 12.3489 15.3074L12.6062 15.1466ZM10.3229 -1.15633e-05C10.6124 -1.15633e-05 10.8375 0.225097 10.8375 0.514523V1.54359H13.9247C14.7929 1.54359 15.4683 2.25108 15.4683 3.0872V5.20965L16.4652 5.43476L16.626 5.46692C17.4621 5.75635 17.9123 6.65678 17.5907 7.46074L16.5295 10.2907C16.4973 10.355 16.4973 10.4193 16.4973 10.4836V13.603C16.1758 13.4422 15.822 13.3136 15.4683 13.2493V10.4836C15.4683 10.2907 15.5004 10.0977 15.5647 9.93694L16.626 7.107C16.7225 6.81758 16.5617 6.49599 16.2401 6.43167L10.8375 5.27397V14.4391C10.6445 14.5678 10.4837 14.6321 10.4194 14.6642H10.3229C10.2908 14.6642 10.13 14.6321 9.80839 14.4391V5.27397L4.40577 6.43167C4.08419 6.49599 3.9234 6.81758 4.01987 7.107L5.0811 9.93694L5.11326 10.0656C5.14542 10.1942 5.17758 10.355 5.17758 10.4836V13.2493C4.82383 13.3136 4.47009 13.4422 4.14851 13.603V10.4836C4.14851 10.4515 4.14851 10.4193 4.14851 10.3872L4.11635 10.2907L3.05512 7.46074C2.73353 6.59247 3.24807 5.62771 4.18066 5.43476L5.17758 5.20965V3.0872C5.17758 2.25108 5.88506 1.54359 6.72118 1.54359H9.80839V0.514523C9.80839 0.225097 10.0335 -1.15633e-05 10.3229 -1.15633e-05ZM6.72118 2.57266C6.43175 2.57266 6.20665 2.79777 6.20665 3.0872V4.98455L10.0013 4.18058C10.2264 4.11627 10.4194 4.11627 10.6445 4.18058L14.4392 4.98455V3.0872C14.4392 2.79777 14.2141 2.57266 13.9247 2.57266H6.72118Z" fill="white" />
            </svg>,
            categories: [],
            suffix: "ports"
        }
    ]

    const hazardsArray = [
        { type: "Earthquake", color: "var(--green)" },
        { type: "Tropical Cyclone", color: "var(--red)" },
        { type: "Drought", color: "var(--purple)" },
        { type: "Flooding", color: "var(--cyan)" },
        { type: "Volcano", color: "var(--yellow)" },
        { type: "Wildfire", color: "var(--orange)" }
    ];

    const toggleLayerSettingsPopup = (value: boolean) => {
        if (window.innerWidth < 768) {
            setLayerSettingsPopup(value);
        }
    }

    const togglePopIn = (value: string) => {
        if (window.innerWidth >= 768) {
            setPopInState(value);
        }
    }

    const MAX_Y = 90;
    const MIN_Y = window.innerHeight - 50;
    const SNAP_TO_MAX_HEIGHT = window.innerHeight - 50;
    const SNAP_TO_MIN_HEIGHT = 90;

    const [y, setY] = useState(SNAP_TO_MAX_HEIGHT);
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

    const onPointerUp = () => {
        dragRef.current.active = false;
        if (y > MIN_Y) setY(SNAP_TO_MAX_HEIGHT);
        if (y < MAX_Y) setY(SNAP_TO_MIN_HEIGHT);
    };

    useEffect(() => {
        view.current.goTo({
            center: [state.countryCoordinates.longitude, state.countryCoordinates.latitude],
        });
    }, [state?.countryCoordinates]);

    function switchTo3D(value) {

        if (value.key == "h") {
            exposureLayer.current = new FeatureLayer({
                url: realtimeObject[realtimeExposure.exposure].url[realtimeExposure.filter],
                renderer: new SimpleRenderer({
                    symbol: new PointSymbol3D({
                        symbolLayers: [new ObjectSymbol3DLayer({
                            resource: {
                                primitive: "cube"
                            },
                            material: {
                                color: "#00E9FF"
                            },
                            anchor: "bottom",
                            width: 60000,
                            depth: 60000,
                            height: 60000
                        })]
                    })
                }),
                title: "exposure"
            });
        }
    }

    return (
        <div className="w-full h-full relative overflow-hidden" onKeyDown={switchTo3D}>
            <div className='w-full h-full'>
                <div className="w-full h-full flex justify-start pt-15" ref={ref}></div>
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden" ref={pulseContainerRef}>
                </div>
            </div>
            <div className={`absolute z-0 md:-z-1 top-33.5 left-8.25 flex items-center border-solid transition-all duration-300 text-white`} onClick={() => toggleLayerSettingsPopup(true)}>
                <div className="rounded-full flex items-center justify-center cursor-pointer h-17.5 w-17.5 md:invisible text-white bg-black border-[1.37px] border-solid border-[#0084FF] mr-[10px]" onClick={() => setMobileExposures(!mobileExposures)}>
                    <img src={Exposures}></img>
                </div>
            </div>
            {exposuresArray.map((e: any, index: number) =>
                <div key={index} id={`${index}`} className={`absolute -z-1 md:z-1 left-8.25 pointer-events-none`} style={{ top: index * 55 + 200 }} onMouseLeave={() => setPopInState("")}>
                    <div className=' flex gap-2 items-start pointer-events-none has-[.pop-in]:pointer-events-auto'>
                        <div className={`flex items-center border-solid transition-all duration-300 text-white`}>
                            <div className={`flex items-center pointer-events-auto cursor-pointer transition-all duration-300  text-white`} onClick={() => setRealtimeExposure({ exposure: e.name, filter: e.name })} onMouseEnter={() => togglePopIn(e.name)}>
                                <div className={`rounded-full flex items-center justify-start ${realtimeExposure.exposure == e.name ? 'bg-(--accentblue-100)' : 'bg-black hover:bg-(--accentdarkblue-100)'} transition-all duration-300 border-[1.37px] border-solid border-[#0084FF] h-[37px] pr-[10px]`}>
                                    <div className='rounded-full flex items-center justify-center bg-black border border-solid border-[#0084FF] h-[37px] w-[37px]'>{e.icon}</div>
                                    <div className='text-white text-[12px] ml-3 font-bold'>{e.name}</div>
                                </div>
                            </div>
                        </div>
                        <div id='exposureContainer' className={`pointer-events-none has-[.pop-in]:pointer-events-auto flex gap-2 ml-10 flex-wrap max-w-5/10 items-center border-solid transition-all duration-300 text-white`}>
                            {e.categories.map((f: any, index: number) =>
                                <div key={`exposure_category_${f}`} id={`exposure_category_${f}`} className={`exposure_ h-9 bg-black border-2 rounded-2xl px-5 opacity-0 cursor-pointer ${popInState == e.name ? 'pop-in' : popInState == "initial" ? 'pop-default' : 'pop-out'} ${realtimeExposure.filter == f ? 'border-(--accentcyan-100)' : 'border-(--accentdarkblue-50)'}`} style={popInState == "initial" ? { animationDelay: index * 0 + 'ms' } : { animationDelay: index * 50 + 'ms' }} onClick={() => setRealtimeExposure({ exposure: e.name, filter: f })}>
                                    <div className='h-9/10 flex justify-center items-center overflow-hidden'>
                                        <div className='text-white text-[12px] font-bold'>{f}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className={`absolute ${layerSettingsPopup ? 'z-3' : '-z-1'} top-0 h-full w-full bg-[#00000090] flex items-center justify-center`}>
                <div className='flex flex-col justify-center items-center gap-y-4 h-full w-full border-(--accentdarkblue-80) border bg-(--accentdarkblue-100)'>
                    <div className='flex w-full flex-col h-1/10 items-center justify-center'>
                        <div className='flex h-full w-86/100 py-4 items-center justify-between'>
                            <section className='text-white font-bold text-[16px]'>Layers</section>
                            <div className='text-white font-bold text-[16px] cursor-pointer' onClick={() => setLayerSettingsPopup(false)}>X</div>
                        </div>
                        <div className='w-9/10 border-b-1 border-(--accentdarkblue-80)'></div>
                    </div>
                    <div className='h-9/10 w-86/100 flex flex-col gap-2 justify-start items-center overflow-scroll'>
                        <div className='flex gap-y-3 flex-col justify-center '>
                            <section className='text-left w-95/100 font-bold text-(--accentdarkblue-50)'>EXPOSURES</section>
                            <div className='flex flex-row flex-wrap gap-3'>
                                {exposuresArray.map((e: any) =>
                                    <div key={e.name} className={`w-25 h-25 bg-black border-2 rounded-2xl cursor-pointer ${realtimeExposure.exposure == e.name ? 'border-(--accentcyan-100)' : 'border-(--accentdarkblue-50)'}`} onClick={() => { setRealtimeExposure({ exposure: e.name, filter: e.name }); setLayerSettingsPopup(false); }}>
                                        <div className='h-full flex justify-center items-end'>
                                            <div className='text-white text-[12px] font-bold'>{e.name}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`absolute z-2 bottom-0 md:top-50 md:transition-all md:duration-300 md:ease-in-out ${eventPopup == "all events" ? "md:right-0" : "md:-right-100 invisible"} md:visible max-h-full md:h-70/100 w-full md:w-[300px] flex flex-col bg-white shadow-lg/40 cursor-default draggable`} style={{
                "--drag-y": `${y}px`,
                touchAction: "none"
            }}>
                <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
                    <div className='h-4 w-full flex items-end justify-center md:hidden'>
                        <div className='w-15 h-1 bg-(--accentcoolgray-60) rounded-xl'></div>
                    </div>
                    <div className="h-[32px] shadow-[0px_4px_5.8px_0px_#00000024] flex items-center justify-start">
                        <b className="ml-2">{events?.filter((element: Record<string, any>) => ((element.attributes.eventtype == state?.eventFilter || state?.eventFilter == "AL") && (element.attributes.affectedcountries?.includes(state?.countryFilter) || state?.countryFilter == "All countries"))).length} Events in Date Range</b>
                    </div>
                </div>
                <div className="h-full pb-20 md:pb-0 overflow-y-scroll flex flex-col justify-start" ref={eventRef}>
                    {events?.filter((element: Record<string, any>) => ((element.attributes.eventtype == state?.eventFilter || state?.eventFilter == "AL") && (element.attributes.affectedcountries?.includes(state?.countryFilter) || state?.countryFilter == "All countries")))?.map((event: any) => (
                        <div key={event.attributes.htmldescription} className="p-2 border-b border-gray-300 items-start flex flex-col text-left">
                            <h3 className="font-bold text-[14px] text-[var(--accentblue-100)]">{event.attributes.country.toUpperCase()}</h3>
                            <h3 className="font-bold text-[16px]">{event.attributes.description}</h3>
                            <p className="text-[14px]">{new Date(event.attributes.fromdate).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            })} - {event.attributes.todate == Date.now() ? "Present" : new Date(event.attributes.todate).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            })}</p>
                            <div className='flex w-full justify-between '>
                                <div className="flex h-6.25 items-center justify-center font-bold cursor-pointer text-[var(--accentblue-100)] border-solid border border-gray-400 rounded-sm px-[5px] mb-[6px] mt-[9px] text-[11px]" onClick={() => focusOnEvent(event.geometry, event.attributes)}>
                                    DETAILS
                                </div>
                                {event.attributes.iscurrent == "true" ?
                                    <div className="flex justify-center items-center bg-(--accentred-100) rounded-sm shadow-lg/10 font-bold text-white px-[5px] mb-[6px] mt-[9px] text-[11px]">
                                        <div>ONGOING</div>
                                    </div>
                                    :
                                    null
                                }

                            </div>
                        </div>
                    ))}
                </div>
                <div className="h-[10px] bg-[var(--darkblue)] flex items-center justify-center text-white font-bold"></div>
            </div>
            <div className={`absolute bottom-0 right-0 md:top-40 md:bottom-[unset] md:transition-all md:duration-300 md:ease-in-out ${eventPopup == "focused event" ? "md:right-0 visible" : "md:-right-100 invisible"} h-40/100 md:h-70/100 w-full md:w-[325px] pt-3 shadow-lg/40 md:rounded-tl-md flex flex-col items-start bg-white cursor-default transition-all ease-in-out duration-300 overflow-y-auto`}>
                <div className="pt-3 w-full flex items-center justify-between pl-4">
                    {focusedEvent.iscurrent == "true" ?
                        <div className="flex h-6.25 justify-center  items-center bg-(--accentred-100) rounded-sm shadow-lg/10 font-bold text-white px-[5px] mb-[6px] mt-[9px] text-[11px]">
                            <div>ONGOING</div>
                        </div>
                        :
                        <b className="flex h-6.25 justify-center  items-center bg-(--accentblue-100) rounded-sm shadow-lg/10 font-bold text-white px-[5px] mb-[6px] mt-[9px] text-[11px]">PAST EVENT</b>
                    }
                    <div className='text-[14px] mr-2 text-(--accentblue-100) font-bold cursor-pointer' onClick={() => unfocusEvent()}> Close details [X]</div>
                </div>
                <div className="text-[20px] h-[38px] font-bold text-left flex w-full pt-2 pl-4">{focusedEvent.description?.length > 25 ? focusedEvent.description.slice(0, 27).trimEnd() + "..." : focusedEvent.description}</div>
                {focusedFeatures?.length > 1 ?
                    <div className='w-full'>
                        <div className="pt-[20px] text-(--accentblue-100) font-bold text-[12px] text-center w-full">Timeline</div>
                        <div className="flex flex-row justify-center items-start w-full pb-[36px]">
                            <div className="flex items-center justify-center text-[25px] w-[25px] h-[25px] mr-3 text-white bg-(--accentblue-100) rounded-4xl">
                                {focusedSliderPlaying ? <FontAwesomeIcon icon={faPause} size="2xs" color="white" onClick={() => playEvent("pause")} /> : <FontAwesomeIcon icon={faPlay} size="2xs" color="white" onClick={() => playEvent("play")} />}
                            </div>
                            <div className="flex flex-col h-full w-7/10">
                                <Slider
                                    className='mr-6 [&_[data-slot=slider-track]]:bg-(--orange) cursor-pointer '
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
                                <div className="relative h-6"
                                    style={{ width: "calc(100%)" }}
                                >
                                    {focusedFeatures?.map((feature: any, index: any) => {
                                        const percent = (index / (focusedFeatures.length - 1)) * 100;
                                        return (
                                            <div
                                                key={index}
                                                className="absolute flex flex-col items-center -translate-x-1/2"
                                                style={{ left: `${percent}%` }}
                                            >
                                                <div className="w-px h-2 bg-muted-foreground/50"></div>
                                                <span className={`text-xs w-10 mt-3`}>
                                                    {index == 0 ? new Date(focusedEvent.fromdate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric"
                                                    }) + " " : index == focusedFeatures.length - 1 ? focusedEvent.todate == Date.now() ? "Present" : " " + new Date(focusedEvent.todate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric"
                                                    }) : ""}
                                                </span>
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    : null}
                <div className="pt-5 font-bold text-[14px] pl-4">Event Severity:</div>
                <div></div>
                <div className={`text-[14px] px-2 ml-4 rounded-md text-white font-extrabold`} style={{ backgroundColor: `var(--${focusedEvent.alertlevel?.toLowerCase()})` }}
                >Level {focusedEvent.alertscore}
                </div>



                <div className="pt-5 font-bold text-[14px] pl-4">View affected economies</div>
                <div className='text-left flex flex-wrap text-[14px] pb-4 pl-4 pt-2 gap-3'>
                        <div className={`rounded-xl h-5 whitespace-nowrap px-3 py-3 ${currentCountryExposure == "ALL" ? "bg-(--accentblue-100) text-white" : "bg-(--accentwarmgray-20)"} font-bold flex items-center justify-center cursor-pointer`} onClick={() => setCurrentCountryExposure("ALL")}>
                            <div>Total</div>
                        </div>
                    {focusedEvent?.affectedcountries?.split(",")?.map((a: string, i: number) => {
                            if ( i < 3) {
                                return (
                                    <div className={`rounded-xl h-5 whitespace-nowrap px-3 py-3 ${currentCountryExposure == a ? "bg-(--accentblue-100) text-white" : "bg-(--accentwarmgray-20)"} font-bold flex items-center justify-center cursor-pointer`} onClick={() => { setCurrentCountryExposure(a); console.log(focusedCountryExposures.indexOf(focusedCountryExposures.find((c: any) => c.attributes.areaid == a))) }}>
                                        <div>{countryByIso3[a]}</div>
                                    </div>
                                )
                            }
                        }
                    )}
                    {focusedEvent?.affectedcountries?.split(",")?.length > 3 ? <div className={`rounded-xl overflow-hidden h-5 px-2 py-3 ${focusedEvent?.affectedcountries?.split(",")?.find((a, i) => a == currentCountryExposure && i > 2) ? 'bg-(--accentblue-100) text-white' : 'bg-(--accentwarmgray-20)'}  font-bold flex items-center justify-center`} onClick={() => setOtherCountryDropdownStatus(!otherCountryDropdownStatus)}>
                        <div className='text-wrap max-w-40 flex justify-between cursor-pointer'>{currentCountryExposure !== "ALL" && focusedEvent?.affectedcountries?.split(",")?.find((a, i) => a == currentCountryExposure && i > 2) ? countryByIso3[currentCountryExposure] : "Other"}</div>
                            <Popover open={otherCountryDropdownStatus} onOpenChange={setOtherCountryDropdownStatus}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={otherCountryDropdownStatus}
                                        className="w-4 h-5.25 font-bold justify-between light border-0 shadow-none p-0 bg-transparent hover:bg-transparent cursor-pointer"
                                    >
                                        
                                        <svg className={`${otherCountryDropdownStatus ? "rotate-180" : "rotate-0"}`} width="14" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 18.75C14.8438 18.75 18.75 14.8438 18.75 10C18.75 5.15625 14.8438 1.25 10 1.25C5.15625 1.25 1.25 5.15625 1.25 10C1.25 14.8438 5.15625 18.75 10 18.75ZM10 0C15.5078 0 20 4.49219 20 10C20 15.5078 15.5078 20 10 20C4.49219 20 0 15.5078 0 10C0 4.49219 4.49219 0 10 0ZM5.19531 9.17969C4.96094 8.94531 4.96094 8.55469 5.19531 8.32031C5.42969 8.08594 5.82031 8.08594 6.05469 8.32031L10 12.2266L13.9453 8.32031C14.1797 8.08594 14.5703 8.08594 14.8047 8.32031C15.0781 8.55469 15.0781 8.94531 14.8047 9.17969L10.4297 13.5547C10.1953 13.8281 9.80469 13.8281 9.57031 13.5547L5.19531 9.17969Z" fill={`${focusedEvent?.affectedcountries?.split(",")?.find((a, i) => a == currentCountryExposure && i > 2) ? "white" : "black"}`} />
                                        </svg>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-60 p-0 light rounded-none">
                                    <Command>
                                        <CommandInput placeholder="Search country..." className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>Country not found.</CommandEmpty>
                                            <CommandGroup>
                                                {focusedEvent?.affectedcountries?.split(",")?.map((a, i) => {
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
                                                                <div className='w-90 text-wrap'>
                                                                    <div>{countryByIso3[a]}</div>
                                                                </div>
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        currentCountryExposure === a ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        )
                                                    }
                                                }
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        :
                        null
                    }
                    
                </div>
                <div className="pt-5 flex flex-row w-full text-[12px] font-bold justify-around border-t-1 px-4">
                    <div className='flex flex-col w-40 items-between text-left'>
                        <div className='pb-2 border-solid border-b-1'>LAYER</div>
                        {exposuresArray.filter((a) => a.name !== "Nightlights").map((e: any) =>
                            <div key={e.name} className='h-[45px] text-[16px] font-medium border-solid border-b-1 flex items-center '>{e.name}</div>
                        )}
                    </div>
                    <div className='w-full text-left'>
                        <div className='pb-2 border-solid border-b-1 pl-3'>EXPOSURE</div>
                        {exposuresArray.filter((a) => a.name !== "Nightlights").map((e: any) =>
                            <div key={e.name} className='h-[45px] text-[16px] font-medium border-solid border-b-1 flex items-center border-l-1 pl-3'>{focusedCountryExposures ? fmt.format(focusedCountryExposures[focusedCountryExposures.indexOf(focusedCountryExposures.find((c: any) => c.attributes.areaid == currentCountryExposure))]?.attributes[e.id]) + " " + e.suffix : "N/A"}</div>     
                        )}
                    </div>
                </div>
                <div className="pt-[24px] pb-5 text-(--accentblue-100) font-bold text-[12px] text-center w-full"><u className='cursor-pointer'>Explore Methodology</u></div>
            </div>
            <div className="absolute bottom-0 invisible md:visible h-[175px] w-[350px] bg-[rgba(0,0,0,0.85)] flex flex-col items-center justify-around">
                <div className="w-8/10 h-5/10 flex flex-col items-center">
                    <div className="flex text-white w-full font-extrabold tracking-wide text-[12px] pb-[10px]">
                        <div>EVENT TYPES</div>
                    </div>
                    <div className='h-full w-full text-white flex flex-col'>
                        <div className="grid grid-cols-2 grid-rows-3 gap-2">
                            {hazardsArray.map((h, i) =>
                                <div key={i} className='flex'>
                                    <div className='flex justify-center border-1 rounded-4xl w-4 h-4' style={{ borderColor: h.color }}>
                                        <div className='flex items-center justify-center'>
                                            <div className="rounded-4xl w-[7px] h-[7px]" style={{ background: h.color }}></div>
                                        </div>
                                    </div>
                                    <div className="mx-2 text-[10px] tracking-wide">{h.type.toUpperCase()}</div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
                <div className='h-3/10 w-8/10 flex flex-col items-center justify-end'>
                    <div className="flex text-white w-full font-extrabold tracking-wide text-[12px] pb-[10px]">
                        <div>{realtimeObject[realtimeExposure.exposure].title.toUpperCase()} {realtimeObject[realtimeExposure.exposure].unit}</div>
                    </div>
                    <div className="h-1/10 w-full" style={{ background: `linear-gradient(to right, ${realtimeObject[realtimeExposure.exposure].colorScheme.map((e, i) => 'rgba(' + e.symbol.color.join(",") + ') ' + (i / realtimeObject[realtimeExposure.exposure].colorScheme.length) * 100 + "%," + ' rgba(' + e.symbol.color.join(",") + ') ' + ((i + 1) / realtimeObject[realtimeExposure.exposure].colorScheme.length) * 100 + "% ").join(",")})` }}></div>
                    <div className="h-[20px] w-full flex justify-between">
                        {realtimeObject[realtimeExposure.exposure].colorScheme.map((e, i) =>
                            <div key={i} className="flex flex-col w-full h-[full]">
                                <div style={{ justifyContent: 'center' }} className='flex items-start w-full h-[20px]'>
                                    <div className="flex justify-end items-start w-full gap-0">
                                        <div className='text-white text-[12px]'>{e.label}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <arcgis-scale-bar
                className='calcite-mode-dark z-150 absolute bottom-3 right-4'
                ref={scaleBarRef}
                bar-style="line"
                unit="metric"
            ></arcgis-scale-bar>
            {dataExplainerOpen 
            ? 
            <div className="absolute z-3 bottom-0 w-full h-full bg-[#00000095] flex items-center justify-center">
                <div className="h-8/10 w-8/10 max-h-300 max-w-300 bg-white rounded-sm flex flex-col overflow-hidden">
                    <div className="bg-(--fundblue) h-38 w-full flex flex-col ">
                        <div className="w-full">
                            <div className="w-96/100 flex justify-end">
                                <div className='text-white font-bold pt-5 cursor-pointer' onClick={() => setDataExplainerState(false)}>CLOSE</div>
                            </div>
                        </div>
                        <div className='w-full flex justify-end'>
                            <div className='w-9/10'>
                                <div className="w-full flex justify-start">
                                    <div className="w-96/100 flex">
                                        <div className='text-white font-bold text-2xl'>Data Explainer</div>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-x-2 overflow-x-auto">
                                    <div className='flex flex-col w-50'>
                                        <div className="text-xs text-white pt-3 pb-2 tracking-widest font-semibold">REALTIME</div>
                                        <div className={`h-10 w-50 font-bold ${dataExplainerView == "Event Tracking" ? "text-(--primaryblue-100) bg-white" : "text-black bg-(--primarygray-40)"} rounded-t-md flex items-center justify-center cursor-pointer`} onClick={() => setDataExplainerView("Event Tracking")}>EVENT TRACKING</div>
                                    </div>
                                    <div className='flex flex-col w-100'>
                                        <div className="text-xs text-white pt-3 pb-2 tracking-widest font-semibold">FORWARD LOOKING</div>
                                        <div className='flex flex-row gap-x-1'>
                                            <div className={`h-10 w-50 font-bold ${dataExplainerView == "Grid" ? "text-(--primaryblue-100) bg-white" : "text-black bg-(--primarygray-40)"} rounded-t-md flex items-center justify-center cursor-pointer`} onClick={() => setDataExplainerView("Grid")}>GRID</div>
                                            <div className={`h-10 w-50 font-bold ${dataExplainerView == "Compare" ? "text-(--primaryblue-100) bg-white" : "text-black bg-(--primarygray-40)"} rounded-t-md flex items-center justify-center cursor-pointer`} onClick={() => setDataExplainerView("Compare")}>COMPARE</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex w-full justify-center overflow-y-scroll my-5'>
                        <div id="dataExplainer" className='flex flex-col lg:flex-row bg-white mt-12 w-9/10 max-h-291 gap-x-9 justify-start'>
                            {dataExplainerView == "Event Tracking" ?
                                <div>
                                    <div className='flex flex-col gap-y-5 text-left'>
                                        <section className='font-bold'>Navigating the Real-Time Event Tracking Page</section>
                                        <p>
                                            The <b>Real-Time</b> view in GeoPulse provides continuous monitoring of natural hazard events as they unfold around the world.
                                            The interactive maps identify affected locations, understand the scale of potential impacts, and explore exposure across key
                                            economic and infrastructure indicators.
                                        </p>

                                        <div className='flex flex-col gap-y-5 text-left'>
                                            <section className='font-bold'>Explore Current and Historical Events</section>

                                            <p>
                                                The Real-Time page displays a global map of recent and ongoing events together with relevant exposure layers.
                                                Users can explore events by selecting event markers directly on the map or by viewing event details in the panel
                                                on the right side of the screen.
                                            </p>

                                            <p>
                                                The right-side panel provides additional information about the selected event, including:
                                            </p>

                                            <ul className='list-disc pl-5'>
                                                <li>Event name and status</li>
                                                <li>Timeline and duration</li>
                                                <li>Event severity metrics</li>
                                                <li>Affected countries or regions</li>
                                                <li>Estimated exposure and risk indicators</li>
                                                <li>Links to download supporting data and explore methodology</li>
                                            </ul>
                                        </div>

                                        <section className='font-bold'>Refine Your Search</section>
                                        <p>
                                            The controls in the top navigation bar allow users to focus the analysis on events of interest.
                                        </p>
                                        <p>You can narrow or expand the events displayed by:</p>
                                        <ul className='list-disc pl-5'>
                                            <li>
                                                <b>Selecting a time frame</b> (for example, the last three months, last six months, last year, or a custom date range)
                                            </li>
                                            <li><b>Choosing a specific country</b></li>
                                            <li><b>Filtering by event type</b> to focus on particular hazards</li>
                                        </ul>

                                        <section className='font-bold'>Understand Exposure Layers</section>
                                        <p>
                                            On the left side of the map, users can select from a series of <b>exposure layers</b>. These layers represent key economic,
                                            demographic, and infrastructure assets that may be affected by natural hazards.
                                        </p>
                                        <p>Exposure layers help answer questions such as:</p>
                                        <ul className='list-disc pl-5'>
                                            <li>How many people may be affected by an event?</li>
                                            <li>Which sectoral areas are most vulnerable to economic losses?</li>
                                        </ul>

                                        <p>
                                            By turning layers on and off, users can visualize where hazards intersect with important assets and better understand
                                            the geographic distribution of potential impacts.
                                        </p>

                                        <p>
                                            <b>Read More</b> for additional information on the methodology and data sources behind this analysis.
                                        </p>
                                    </div>
                                </div>
                                :
                                null
                            }
                            {dataExplainerView == "Compare" ?
                                <div>
                                    <div className='flex flex-col gap-y-5 pb-5 text-left'>
                                        <section className='font-bold'>Navigating the Compare View</section>

                                        <p>
                                            The <b>Compare</b> view illustrates how climate-related hazards and exposures may evolve under different future climate scenarios.
                                            Designed for benchmarking and strategic planning, this view enables side-by-side comparisons of countries or subnational
                                            regions, helping users identify areas that may face higher levels of exposure under future climate conditions.
                                        </p>

                                        <section className='font-bold'>Compare Countries or Subnational Regions</section>

                                        <p>
                                            The Compare view displays two maps side by side, making it easy to evaluate differences in exposure across locations.
                                            You can:
                                        </p>

                                        <ul className='list-disc pl-5 space-y-1'>
                                            <li>
                                                Compare <b>two different countries</b> to understand how future climate risks vary across economies.
                                            </li>
                                            <li>
                                                Compare <b>subnational regions within the same country</b> to identify areas that may face higher exposure levels.
                                            </li>
                                        </ul>

                                        <section className='font-bold'>Select a Hazard and Exposure Indicator</section>

                                        <p>At the top of the page, users can choose:</p>

                                        <ul className='list-disc pl-5 space-y-1'>
                                            <li>
                                                A <b>hazard category</b> (such as coastal flooding, riverine flooding, heat stress, drought, or other available hazards).
                                            </li>
                                            <li>
                                                An <b>exposure layer</b> (such as population, GDP, urban GDP, buildings).
                                            </li>
                                            <li>
                                                A <b>climate scenario</b> (Orderly or Disorderly).
                                            </li>
                                            <li>
                                                A <b>time horizon</b> for analysis.
                                            </li>
                                        </ul>
                                    </div>

                                    <div className='flex flex-col gap-y-5 text-left'>
                                        <section className='font-bold'>Choose a Climate Scenario</section>

                                        <p>
                                            GeoPulse allows users to compare future outcomes under different climate pathways.
                                        </p>

                                        <p>
                                            <b>Orderly Transition</b> An orderly transition assumes that climate mitigation measures are introduced early and steadily
                                            over time. In climate science, this represents a lower-emissions pathway where governments, businesses, and societies
                                            gradually reduce greenhouse gas emissions, limiting the extent of future warming and associated climate impacts.
                                        </p>

                                        <p>
                                            <b>Disorderly Transition</b> A disorderly transition assumes delayed or uneven climate action. Under this pathway,
                                            emissions remain higher for longer before stronger mitigation efforts occur later in the century. This results in
                                            greater warming and generally higher levels of climate-related exposure and risk.
                                        </p>
                                        <div className='flex flex-col gap-y-5 text-left'>
                                            <section className='font-bold'>Explore Future Time Horizons</section>

                                            <p>
                                                The time selector allows users to view projections across multiple planning horizons:
                                            </p>
                                            <table className='border'>
                                                <tr className='border'>
                                                    <th className='border text-center bg-(--primarygray-10)'><b>Future Horizon</b></th>
                                                    <th className='border text-center bg-(--primarygray-10)'><b>Reference Year</b></th>
                                                </tr>
                                                <tr>
                                                    <td className='border'>Historical</td>
                                                    <td className='border'>1980-2014</td>
                                                </tr>
                                                <tr>
                                                    <td className='border'>Early-Century</td>
                                                    <td className='border'>2030</td>
                                                </tr>
                                                <tr>
                                                    <td className='border'>Mid-Century</td>
                                                    <td className='border'>2050</td>
                                                </tr>
                                                <tr>
                                                    <td className='border'>End-Century</td>
                                                    <td className='border'>2100</td>
                                                </tr>
                                            </table>

                                            <section className='font-bold'>[Add section about hazard sliders]</section>

                                            <section className='font-bold'>Interpret the Maps</section>

                                            <p>
                                                The maps display exposure levels using a graduated color scale. Darker shades indicate higher levels of exposure relative
                                                to the selected indicator and scenario.
                                            </p>

                                            <p>Users can:</p>

                                            <ul className='list-disc pl-5 space-y-1'>
                                                <li>Hover over regions to view detailed values.</li>
                                                <li>Identify geographic hotspots.</li>
                                                <li>Compare exposure patterns between locations.</li>
                                                <li>Understand where future climate impacts may become more concentrated.</li>
                                                <li>Download results for further analysis.</li>
                                            </ul>

                                            <p>
                                                <b>Read More</b> for additional information on the methodology and data sources behind this analysis.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                            }
                            {dataExplainerView == "Grid" ?
                                <div>
                                    <div className='flex flex-col gap-y-5 text-left'>
                                        <section className='font-bold'>Navigating the Grid View</section>

                                        <p>
                                            The <b>Grid</b> view enables users to explore forward-looking climate risks at a highly granular spatial level.
                                            Unlike the Compare view, which focuses on benchmarking locations side by side, the Grid view allows users
                                            to examine how hazards and exposures intersect across the globe using detailed geospatial data.
                                        </p>

                                        <section className='font-bold'>Select a Hazard, Exposure, and Climate Scenario</section>

                                        <p>
                                            Using the controls at the top of the page, you can customize the map by selecting:
                                        </p>

                                        <ul className='list-disc pl-5 space-y-1'>
                                            <li>
                                                A <b>hazard category</b> (such as coastal flooding, riverine flooding, heat stress, drought, or other available hazards).
                                            </li>
                                            <li>
                                                An <b>exposure layer</b> (such as population, GDP, urban GDP, buildings).
                                            </li>
                                            <li>
                                                A <b>climate scenario</b> (Orderly or Disorderly).
                                            </li>
                                            <li>
                                                A <b>time horizon</b> for analysis.
                                            </li>
                                        </ul>

                                        <section className='font-bold'>Choose a Climate Scenario</section>

                                        <p>
                                            GeoPulse allows users to compare future risks under different climate pathways.
                                        </p>

                                        <p>
                                            <b>Orderly Transition</b> An orderly transition assumes that emissions reductions and climate policies are implemented
                                            gradually and early. This pathway generally results in lower levels of warming and more moderate future climate impacts.
                                        </p>

                                        <p>
                                            <b>Disorderly Transition</b> A disorderly transition assumes delayed or uneven climate action, leading to higher
                                            greenhouse gas concentrations and greater warming before mitigation efforts take effect. This pathway generally
                                            produces larger increases in climate-related hazards and exposures.
                                        </p>
                                    </div>

                                    <div className='flex flex-col gap-y-5 text-left'>
                                        <section className='font-bold'>Explore Future Time Horizons</section>

                                        <p>
                                            The time selector enables users to evaluate exposure across multiple planning horizons.
                                        </p>
                                        <table className='border'>
                                                <tr className='border'>
                                                    <th className='border text-center bg-(--primarygray-10)'><b>Future Horizon</b></th>
                                                    <th className='border text-center bg-(--primarygray-10)'><b>Reference Year</b></th>
                                                </tr>
                                                <tr>
                                                    <td className='border'>Historical</td>
                                                    <td className='border'>1980-2014</td>
                                                </tr>
                                                <tr>
                                                    <td className='border'>Early-Century</td>
                                                    <td className='border'>2030</td>
                                                </tr>
                                                <tr>
                                                    <td className='border'>Mid-Century</td>
                                                    <td className='border'>2050</td>
                                                </tr>
                                                <tr>
                                                    <td className='border'>End-Century</td>
                                                    <td className='border'>2100</td>
                                                </tr>
                                            </table>

                                        <section className='font-bold'>Understanding the Bivariate Legend</section>

                                        <p>
                                            The legend combines two variables into a single visualization. Rather than displaying only hazard intensity or only exposure,
                                            the map simultaneously shows both dimensions so users can quickly identify where high hazards overlap with high concentrations
                                            of exposed assets.
                                        </p>

                                        <p>In the example shown:</p>

                                        <ul className='list-disc pl-5 space-y-1'>
                                            <li>The <b>vertical axis</b> represents <b>Population Exposure</b> (low to high).</li>
                                            <li>The <b>horizontal axis</b> represents <b>Flood Height</b> (low to high).</li>
                                            <li>
                                                Each grid cell on the map is colored based on the combination of these two variables.
                                            </li>
                                        </ul>

                                        <p>The legend can be interpreted as follows:</p>

                                        <table className='border'>
                                                <tr className='border'>
                                                    <th className='border text-center bg-(--primarygray-10)'><b>Legend Category</b></th>
                                                    <th className='border text-center bg-(--primarygray-10)'><b>Meaning</b></th>
                                                </tr>
                                                <tr>
                                                    <td className='border'>Low Hazard + Low Exposure</td>
                                                    <td className='border'>Areas where flood levels and exposed populations are both relatively low.</td>
                                                </tr>
                                                <tr>
                                                    <td className='border'>High Hazard + Low Exposure</td>
                                                    <td className='border'>Areas with severe flooding but relatively few people exposed.</td>
                                                </tr>
                                                <tr>
                                                    <td className='border'>Low Hazard + High Exposure</td>
                                                    <td className='border'>Areas with large populations but relatively lower flood intensity.</td>
                                                </tr>
                                                <tr>
                                                    <td className='border'>High Hazard + High Exposure</td>
                                                    <td className='border'>Areas where severe flooding coincides with large exposed populations,
                                                representing potential risk hotspots.</td>
                                                </tr>
                                            </table>
                                        <p>
                                            The color gradient helps users distinguish between these combinations at a glance. Areas that appear in the most
                                            intense colors represent locations where both hazard levels and exposure levels are relatively high, making them
                                            important areas for further analysis and resilience planning.
                                        </p>

                                        <p>
                                            <b>Read More</b> for additional information on the methodology and data sources behind this analysis.
                                        </p>
                                    </div>
                                </div>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
            :
            null}
            <div className='flex flex-col items-center justify-center h-14.75 w-15.25 absolute top-20 right-3 gap-y-1 cursor-pointer bg-(--accentdarkblue-80) rounded-sm' onClick={() => {setDataExplainerState(true)}}>
                <img src={DataIcon} width={15}></img>
                <span className='font-bold text-white text-xs text-base/5'>Data Explainer</span>
            </div>

        </div>
    )
}
