import { createFileRoute } from '@tanstack/react-router'
import { AppStateContext, AppActionsContext } from '../app';
import { useState, useRef, useEffect, useContext } from 'react'

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import SceneView from "@arcgis/core/views/SceneView.js";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer.js";

import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";

import { gridObject } from '@/config/datasets';
import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer';

export const Route = createFileRoute('/grid')({
  component: GridView,
})

function GridView() {

const state = useContext(AppStateContext);
const actions = useContext(AppActionsContext);
actions?.setView("Event tracking");

  const [position, setPosition] = useState({});
  const [currentDimension, setDimension] = useState("2D");

  const [tooltipValue, setTooltipValue] = useState("");

  const ref = useRef(null);
  let map = useRef<Map | null>(null);
  const vtlayer = useRef<ImageryTileLayer | null>(null);
  var view = useRef<MapView | SceneView>(new MapView);

  useEffect(() => {
    if (ref.current) {

      map.current = new Map({
        basemap: 'dark-gray'
      })

      switch (currentDimension) {
        case "2D":
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
            viewpoint: position
          });
          break;
        case "3D":
          view.current = new SceneView({
            map: map.current,
            container: ref.current,
            center: [-38.9465, 7.775],
            zoom: 4,
            constraints: {
              altitude: {
                min: 150000
              }
            },
            viewpoint: position
          });
      }

      view.current.ui.components = [];

      const scaleBar = new ScaleBar({
                view: view.current,
                unit: "metric" // Options: "metric", "non-metric", or "dual"
            });

            view.current.ui.add(scaleBar, {
                position: "bottom-right"
            });


      reactiveUtils.watch(() =>
        [view.current.interacting, view.current.viewpoint],
        ([interacting, viewpoint]) => {
          if (interacting) {
          }
          if (viewpoint) {
            setPosition(viewpoint);
          }
        }
      )

    }
    return () => {
      view.current.destroy();
    }
  }, [currentDimension]);

  useEffect(() => {

    if (!map.current) return;

    if (vtlayer.current) {
      map.current.remove(vtlayer.current);
      vtlayer.current.destroy();
    }



    vtlayer.current = new ImageryTileLayer({
      url: gridObject[state.currentHazard]?.[state.currentExposure]?.[state.currentScenario]?.[state.currentTime],
      renderer: new UniqueValueRenderer({
        field: "Value", uniqueValueInfos: [
          {
            value: 1,
            symbol: {
              type: "simple-fill",
              color: "rgb(233,230,241)",
            },
          },
          {
            value: 2,
            symbol: {
              type: "simple-fill",
              color: "rgb(166,201,223)",
            },
          },
          {
            value: 3,
            symbol: {
              type: "simple-fill",
              color: "rgb(104,171,205)",
            },
          },
          {
            value: 4,
            symbol: {
              type: "simple-fill",
              color: "rgb(142,129,189)",
            },
          },
          {
            value: 5,
            symbol: {
              type: "simple-fill",
              color: "rgb(217,158,202)",
            },
          },
          {
            value: 6,
            symbol: {
              type: "simple-fill",
              color: "rgb(70,99,168)",
            },
          },
          {
            value: 7,
            symbol: {
              type: "simple-fill",
              color: "rgb(206,89,163)",
            },
          },
          {
            value: 8,
            symbol: {
              type: "simple-fill",
              color: "rgb(123,58,147)",
            },
          },
          {
            value: 9,
            symbol: {
              type: "simple-fill",
              color: "rgb(40,27,132)",
            },
          },
        ],
      })
    });



    map.current.add(vtlayer.current);
  }, [state.currentTime, state.currentHazard, state.currentExposure, state.currentScenario])

  var colors: Record<string, string> = {
    "Low Population & Low Flood Height": "rgb(206,89,163)",
    "Low Population & Medium Flood Height": "rgb(123,58,147)",
    "Low Population & High Flood Height": "rgb(40,27,132)",
    "Medium Population & Low Flood Height": "rgb(217,158,202)",
    "Medium Population & Medium Flood Height": "rgb(142,129,189)",
    "Medium Population & High Flood Height": "rgb(70,99,168)",
    "High Population & Low Flood Height": "rgb(233,230,241)",
    "High Population & Medium Flood Height": "rgb(166,201,223)",
    "High Population & High Flood Height": "rgb(104,171,205)"
  };

  const showTooltip = (value: string) => {
    const el = document.querySelector<HTMLElement>('#tooltip');
    if (!el) return;
    el.style.visibility = 'visible';
    el.style.transform = 'translateY(-1.1rem) scale(1.1)';
    el.style.opacity = '1';
    setTooltipValue(value);
  }

  const hideTooltip = () => {
    const el = document.querySelector<HTMLElement>('#tooltip');
    if (!el) return;
    el.style.visibility = 'hidden';
    el.style.transform = 'translateY(0) scale(1)';
    el.style.opacity = '0';
  }

  return (
    <div className="h-full">
      <div className='w-full h-full bg-[#1D2224] ' ref={ref}></div>
      <svg id="legendContainer" className="w-[210px] md:w-[260px] border-solid border-b-1 absolute bottom-0 z-1 pointer-events-none" width="260" viewBox="0 0 260 175" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="175" fill="white" />
        <text id="color3Text" x="12" y="23" fill="#DE4FA6" style={{ font: "bold 12px Arial" }}>
          Population
          <tspan x="12" dy="15">(count)</tspan>
        </text>
        <text id="color7Text" x="250" y="23" fill="#4FADD0" text-anchor="end"
          style={{ font: "bold 12px Arial", textAlign: "right" }}>
          Flood Height
          <tspan x="247" dy="15">(meters)</tspan>
        </text>
        <text x="143" y="23" fill="black" text-anchor="end" style={{ font: "bold 12px Arial", textAlign: "right" }}>
          High
        </text>
        <text x="65" y="95" fill="black" text-anchor="end" style={{ font: "bold 12px Arial", textAlign: "right" }}>
          High-Low
        </text>
        <text x="250" y="95" fill="black" text-anchor="end" style={{ font: "bold 12px Arial", textAlign: "right" }}>
          Low-High
        </text>
        <text x="143" y="161" fill="black" text-anchor="end" style={{ font: "bold 12px Arial", textAlign: "right" }}>
          Low
        </text>
        <rect id="color9" x="148.539" y="127.924" width="26" height="26" transform="rotate(135 148.539 127.924)"
          fill="#e9e6f2" />
        <rect id="color6" x="130.154" y="109.539" width="26" height="26" transform="rotate(135 130.154 109.539)"
          fill="#E39BCC" />
        <rect id="color3" x="111.77" y="91.1543" width="26" height="26" transform="rotate(135 111.77 91.1543)"
          fill="#DE4FA6" />
        <rect id="color8" x="166.924" y="109.539" width="26" height="26" transform="rotate(135 166.924 109.539)"
          fill="#9ccae1" />
        <rect id="color7" x="185.309" y="91.1543" width="26" height="26" transform="rotate(135 185.309 91.1543)"
          fill="#4FADD0" />
        <path id="color4" d="M166.924 72.7695L148.539 91.1543L130.154 72.7695L148.539 54.3848L166.924 72.7695Z"
          fill="#3D64AD" />
        <rect id="color1" x="148.539" y="54.3848" width="26" height="26" transform="rotate(135 148.539 54.3848)"
          fill="#2A1A89" />
        <rect id="color2" x="130.154" y="72.7695" width="26" height="26" transform="rotate(135 130.154 72.7695)"
          fill="#843598" />
        <rect id="color5" x="148.539" y="91.1543" width="26" height="26" transform="rotate(135 148.539 91.1543)"
          fill="#9080bd" />
        <path
          d="M196.165 104.655C196.18 104.379 195.969 104.143 195.693 104.129L191.199 103.887C190.924 103.872 190.688 104.084 190.673 104.359C190.658 104.635 190.87 104.871 191.146 104.886L195.14 105.1L194.925 109.095C194.91 109.37 195.122 109.606 195.398 109.621C195.673 109.636 195.909 109.424 195.924 109.148L196.165 104.655ZM146.666 148.628L147 149L196 105L195.666 104.628L195.332 104.256L146.332 148.256L146.666 148.628Z"
          fill="black" />
        <path
          d="M64.0002 101.5C63.7241 101.5 63.5002 101.724 63.5002 102L63.5002 106.5C63.5002 106.776 63.7241 107 64.0002 107C64.2764 107 64.5002 106.776 64.5002 106.5L64.5002 102.5L68.5002 102.5C68.7764 102.5 69.0002 102.276 69.0002 102C69.0002 101.724 68.7764 101.5 68.5002 101.5L64.0002 101.5ZM110.567 148.567L110.921 148.214L64.3538 101.647L64.0002 102L63.6467 102.354L110.214 148.921L110.567 148.567Z"
          fill="black" />
      </svg>
      {/* <div className='absolute bottom-0 right-0 flex flex-col items-start justify-end rounded-xs bg-white w-50 h-45'>
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
              <div className='flex w-30 h-30 flex-wrap'>
                {Object.entries(colors).map(([key, value]) => (
                  <div key={value} style={{ backgroundColor: value }} className="w-10 h-10 hover:border-2 hover:border-solid hover:border-(--accentred-80)" onMouseOver={() => showTooltip(key)} onTouchStart={() => showTooltip(key)}></div>
                ))}
              </div>
              <div className='w-full h-10 flex justify-center items-center'>
                <div className="text-[10px]"><strong>Flood Height (meters)</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}