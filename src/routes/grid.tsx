import { createFileRoute } from "@tanstack/react-router";
import { AppStateContext, AppActionsContext } from "../app";
import { useState, useRef, useEffect, useContext } from "react";

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer.js";

import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";

import { buildGridUrl, buildGridLegend } from "@/config/datasets";
import { Thresholds } from "@/components/thresholds";
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";

export const Route = createFileRoute("/grid")({
  component: GridView,
});

function GridView() {
  const state = useContext(AppStateContext);
  const actions = useContext(AppActionsContext);
  actions?.setView("Event tracking");

  const [position, setPosition] = useState({});

  const [tooltipValue, setTooltipValue] = useState("");

  const [isolatedField, setIsolatedField] = useState<number | null>(null);
  const [hoveredField, setHoveredField] = useState<number | null>(null);

  const ref = useRef(null);
  let map = useRef<Map | null>(null);
  const vtlayer = useRef<ImageryTileLayer | null>(null);
  var view = useRef<MapView>(new MapView());

  useEffect(() => {
    if (ref.current) {
      // same unlabelled base + boundaries as the real-time view
      const baseLayer = new VectorTileLayer({
        url: "https://cdn.arcgis.com/sharing/rest/content/items/d7397603e9274052808839b70812be50/resources/styles/root.json",
        title: "base",
      });
      const boundariesLayer = new VectorTileLayer({
        url: "https://cdn.arcgis.com/sharing/rest/content/items/e8ecee3086f34b06b85229d832a1c14a/resources/styles/root.json",
        title: "boundaries",
        opacity: 0.25,
      });

      map.current = new Map({
        layers: [baseLayer, boundariesLayer],
        // basemap: "dark-gray"
      });

      view.current = new MapView({
        container: ref.current,
        map: map.current,
        zoom: 3,
        center: [-40.9465, 0.775],
        constraints: {
          minZoom: 2,
          maxZoom: 10,
        },
        spatialReference: {
          wkid: 3857,
        },
        viewpoint: position,
      });

      view.current.ui.components = [];

      const scaleBar = new ScaleBar({
        view: view.current,
        unit: "metric", // Options: "metric", "non-metric", or "dual"
      });

      view.current.ui.add(scaleBar, {
        position: "bottom-right",
      });

      reactiveUtils.watch(
        () => [view.current.interacting, view.current.viewpoint],
        ([interacting, viewpoint]) => {
          if (interacting) {
          }
          if (viewpoint) {
            setPosition(viewpoint);
          }
        },
      );
    }
    return () => {
      view.current.destroy();
    };
  }, []);



  // new pink
  var colors: Record<string, { field: number, colorValue: string }> = {
    "High Population & High Flood Height": {
      field: 9,
      colorValue: "#FF139C"
    },
    "High Population & Medium Flood Height": {
      field: 8,
      colorValue: "#E643C4"
    },
    "High Population & Low Flood Height": {
      field: 7,
      colorValue: "#A659EE"
    },
    "Medium Population & High Flood Height": {
      field: 6,
      colorValue: "#BC8DA1"
    },
    "Medium Population & Medium Flood ": {
      field: 5,
      colorValue: "#956D9C"
    },
    "Medium Population & Low Flood Height": {
      field: 4,
      colorValue: "#6D4E93"
    },
    "Low Population & High Flood Height": {
      field: 3,
      colorValue: "#00BCA6"
    },
    "Low Population & Medium Flood Height": {
      field: 2,
      colorValue: "#127A71"
    },
    "Low Population & Low Flood Height": {
      field: 1,
      colorValue: "#343D41"
    }
  };

  // new green
  // var colors: Record<string, { field: number, colorValue: string }> = {
  //   "High Population & High Flood Height": {
  //     field: 9,
  //     colorValue: "rgb(153, 252, 133)"
  //   },
  //   "High Population & Medium Flood Height": {
  //     field: 8,
  //     colorValue: "rgb(79, 142, 171)"
  //   },
  //   "High Population & Low Flood Height": {
  //     field: 7,
  //     colorValue: "rgb(50, 109, 241)"
  //   },
  //   "Medium Population & High Flood Height": {
  //     field: 6,
  //     colorValue: "rgb(140, 215, 90)"
  //   },
  //   "Medium Population & Medium Flood ": {
  //     field: 5,
  //     colorValue: "rgb(71, 119, 138)"
  //   },
  //   "Medium Population & Low Flood Height": {
  //     field: 4,
  //     colorValue: "rgb(37, 75, 157)"
  //   },
  //   "Low Population & High Flood Height": {
  //     field: 3,
  //     colorValue: "rgb(122, 165, 50)"
  //   },
  //   "Low Population & Medium Flood Height": {
  //     field: 2,
  //     colorValue: "rgb(70, 110, 50)"
  //   },
  //   "Low Population & Low Flood Height": {
  //     field: 1,
  //     colorValue: "rgb(31, 77, 87)"
  //   }
  // };

  var valuesArray = [
    {
      value: 1,
      symbol: {
        type: "simple-fill",
        color: Object.values(colors)[8].colorValue,
      },
    },
    {
      value: 2,
      symbol: {
        type: "simple-fill",
        color: Object.values(colors)[7].colorValue,
      },
    },
    {
      value: 3,
      symbol: {
        type: "simple-fill",
        color: Object.values(colors)[6].colorValue,
      },
    },
    {
      value: 4,
      symbol: {
        type: "simple-fill",
        color: Object.values(colors)[5].colorValue,
      },
    },
    {
      value: 5,
      symbol: {
        type: "simple-fill",
        color: Object.values(colors)[4].colorValue,
      },
    },
    {
      value: 6,
      symbol: {
        type: "simple-fill",
        color: Object.values(colors)[3].colorValue,
      },
    },
    {
      value: 7,
      symbol: {
        type: "simple-fill",
        color: Object.values(colors)[2].colorValue,
      },
    },
    {
      value: 8,
      symbol: {
        type: "simple-fill",
        color: Object.values(colors)[1].colorValue,
      },
    },
    {
      value: 9,
      symbol: {
        type: "simple-fill",
        color: Object.values(colors)[0].colorValue,
      },
    },
  ];

  const legend = state ? buildGridLegend(state) : undefined;

  // tooltip text for a legend cell, e.g. "High Population & Medium Flood Height"
  const levels = ["Low", "Medium", "High"];
  const shortLabel = (label: string) => label.replace(/\s*\(.*\)$/, ""); // drop "(count)" etc.
  const cellLabel = (field: number) =>
    legend
      ? `${levels[Math.floor((field - 1) / 3)]} ${shortLabel(legend.exposure)} & ${levels[(field - 1) % 3]} ${shortLabel(legend.hazard)}`
      : "";

  useEffect(() => {
    if (!map.current) return;
    
    isolateField(isolatedField, "dimension");
  }, [
    state.currentTime,
    state.currentHazard,
    state.currentExposure,
    state.currentScenario,
    state.currentThreshold,
    state.currentMeasure,
  ]);

  useEffect(() => {

    let pointerTracker = view.current.on("pointer-move", async (event) => {
      const response = await view.current.hitTest(event);
      const hasImageryTileLayer = response.results.some(
        (result) => result.layer instanceof ImageryTileLayer,
      );
      if (hasImageryTileLayer) {
        response.results.forEach((e) => {
          if (e.type == 'raster') {
            for (const value of Object.values(colors)) {
              if (e.pixelValue[0] == value.field) {
                if (isolatedField == null || isolatedField == value.field) {
                  showTooltip(cellLabel(value.field));
                  setHoveredField(value.field);
                }
              }
            }
          }
        })
      } else {
        hideTooltip();
        setHoveredField(null);
      }
    });

    return () => {
      pointerTracker.remove();
    };
  },[vtlayer.current])

  function isolateField(value: number | null, type: string) {
    if (map.current) {
      if (vtlayer.current) {
        map.current.remove(vtlayer.current);
        vtlayer.current.destroy();
        vtlayer.current = null;
      }
      let isolatedValues = valuesArray;
      if (type == "dimension") {
        if (isolatedField) {
          isolatedValues = valuesArray.filter((v) => v.value == value);
        }
      }

      if (type == "exposure") {
        if (isolatedField !== value) {
          // look up in the full list, not the current renderer (which may already be filtered)
          isolatedValues = valuesArray.filter((v) => v.value == value);
          setIsolatedField(value);
        } else {
          setIsolatedField(null);
        }
      }

      vtlayer.current = new ImageryTileLayer({
        url: state ? buildGridUrl(state) : undefined,
        renderer: new UniqueValueRenderer({
          field: "Value",
          uniqueValueInfos: isolatedValues,
        }),
      });
      map.current.add(vtlayer.current);
    }
  }

  const showTooltip = (value: string) => {
    const el = document.querySelector<HTMLElement>("#tooltip");
    if (!el) return;
    el.style.visibility = "visible";
    el.style.transform = "translateY(-1.1rem) scale(1.1)";
    el.style.opacity = "1";
    setTooltipValue(value);
  };

  const hideTooltip = () => {
    if (isolatedField == null) {
      const el = document.querySelector<HTMLElement>("#tooltip");
      if (!el) return;
      el.style.visibility = "hidden";
      el.style.transform = "translateY(0) scale(1)";
      el.style.opacity = "0";
    }
  };

  return (
    <div className="h-full">
      <div className="w-full h-full bg-[#1D2224] " ref={ref}></div>
      <Thresholds />
      {legend && (
      <div className='absolute bottom-0 left-0 flex flex-col items-start justify-end rounded-xs bg-white w-50 h-51'>
        <div id="newLegend" onMouseLeave={() => hideTooltip()} className='w-full'>
          <div className='absolute bottom-46 w-full flex  justify-center'>
            <div id="tooltip" className='invisible opacity-0 shadow-xl/20 rounded-md flex h-15 w-40 items-center justify-center bg-(--accentdarkblue-80) transition-all delay-150 duration-300 ease-in-out'>
              <div className='text-white text-[10px] w-9/10'><strong>{tooltipValue}</strong></div>
            </div>
          </div>
          <div className='w-5/10 flex'>
            <div className='flex w-10 h-30 items-center justify-center'>
              <div className="text-[10px] rotate-270 whitespace-nowrap"><strong>{legend.exposure}</strong></div>
            </div>
            <div className="">
              <div className='flex w-30 h-30 flex-wrap flex-row-reverse'>
                {Object.values(colors).map((value) => (
                  <div key={value.field}
                    style={{ backgroundColor: value.colorValue, borderColor: (hoveredField == value.field) ? "#e08b84" : (isolatedField == value.field) ? "#e15449" : value.colorValue}} 
                    className={`cursor-pointer w-10 h-10 border-2 transition-all duration-100`} 
                    onClick={() => isolateField(value.field, "exposure")} 
                    onMouseOver={() => { showTooltip(cellLabel(value.field)); setHoveredField(value.field); }} 
                    onMouseOut={() => setHoveredField(null)} 
                    onTouchStart={() => showTooltip(cellLabel(value.field))}>
                  </div>
                ))}
              </div>
              <div className='w-full h-10 flex justify-center items-center'>
                <div className="text-[10px]"><strong>{legend.hazard}</strong></div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full px-2 pb-1 text-[9px] text-left text-[#555555]'>
          {legend.source}
        </div>
      </div>
      )}
    </div>
  );
}
