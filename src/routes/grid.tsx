import { createFileRoute } from "@tanstack/react-router";
import { AppStateContext, AppActionsContext } from "../app";
import { useState, useRef, useEffect, useContext } from "react";

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import SceneView from "@arcgis/core/views/SceneView.js";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer.js";

import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";

import { gridObject } from "@/config/datasets";
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer";

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
      map.current = new Map({
        basemap: "dark-gray",
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

  useEffect(() => {
    if (!map.current) return;

    if (vtlayer.current) {
      map.current.remove(vtlayer.current);
      vtlayer.current.destroy();
    }

    vtlayer.current = new ImageryTileLayer({
      url: gridObject[state.currentHazard]?.[state.currentExposure]?.[
        state.currentScenario
      ]?.[state.currentTime],
      renderer: new UniqueValueRenderer({
        field: "Value",
        uniqueValueInfos: valuesArray
      }),
    });
    map.current.add(vtlayer.current);
  }, [
    state.currentTime,
    state.currentHazard,
    state.currentExposure,
    state.currentScenario,
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
            for (const [key, value] of Object.entries(colors)) {
              if (e.pixelValue[0] == value.field) {
                if (isolatedField == null || isolatedField == value.field) {
                  showTooltip(key);
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

  function isolateField(value: number) {
    console.log(value);
    if (map.current && vtlayer.current && vtlayer.current.renderer) {
      map.current.remove(vtlayer.current);
      var isolatedValues = valuesArray;
      if (isolatedField !== value) {
        for (var i = 0; i < vtlayer.current.renderer.uniqueValueInfos.length; i++) {
          if (vtlayer.current.renderer.uniqueValueInfos[i].value == value) {
            isolatedValues = [isolatedValues[i]];
            break;
          }
        }
        setIsolatedField(value);
        console.log(value);
      } else {
        setIsolatedField(null);
      }
      vtlayer.current = new ImageryTileLayer({
        url: gridObject[state.currentHazard]?.[state.currentExposure]?.[state.currentScenario]?.[state.currentTime],
        renderer: new UniqueValueRenderer({
          field: "Value",
          uniqueValueInfos: isolatedValues,
        }),
      });
      map.current.add(vtlayer.current);
      return () => {
              // vtlayer.current.destroy();

    };
    };
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
      <div className='absolute bottom-0 left-0 flex flex-col items-start justify-end rounded-xs bg-white w-50 h-45'>
        <div id="newLegend" onMouseLeave={() => hideTooltip()} className='w-full'>
          <div className='absolute bottom-40 w-full flex  justify-center'>
            <div id="tooltip" className='invisible opacity-0 shadow-xl/20 rounded-md flex h-15 w-40 items-center justify-center bg-(--accentdarkblue-80) transition-all delay-150 duration-300 ease-in-out'>
              <div className='text-white text-[10px] w-9/10'><strong>{tooltipValue}</strong></div>
            </div>
          </div>
          <div className='w-5/10 flex'>
            <div className='flex w-10 h-30 items-center justify-center'>
              <div className="text-[10px] rotate-270 whitespace-nowrap"><strong>Population (count)</strong></div>
            </div>
            <div className="">
              <div className='flex w-30 h-30 flex-wrap flex-row-reverse'>
                {Object.entries(colors).map(([key, value], index) => (
                  <div key={key} style={{ backgroundColor: value.colorValue, borderColor: (hoveredField == value.field) ? "#e08b84" : (isolatedField == value.field) ? "#e15449" : value.colorValue}} className={`cursor-pointer w-10 h-10 border-2 transition-all duration-100`} onClick={() => isolateField(value.field)} onMouseOver={() => { showTooltip(key, index), setHoveredField(value.field); }} onMouseOut={() => setHoveredField(null)} onTouchStart={() => showTooltip(key, index)}></div>
                ))}
              </div>
              <div className='w-full h-10 flex justify-center items-center'>
                <div className="text-[10px]"><strong>Flood Height (meters)</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
