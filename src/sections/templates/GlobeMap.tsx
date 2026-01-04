import { useState, useRef, useEffect } from 'react'

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Map from "@arcgis/core/Map.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";
import SceneView from "@arcgis/core/views/SceneView.js";

type GlobeMapProps = {
    flatPosition: object,
    currentTime: {time: string, url: string},
    setGlobePosition: React.Dispatch<React.SetStateAction<any>>;
}

type MapObject = any;

export const GlobeMap = ({flatPosition, currentTime, setGlobePosition}: GlobeMapProps) => {

    const ref = useRef(null);  
    let map = useRef<Map | null>(null);
    let vtlayer: MapObject;

    useEffect(() => {
        if (ref.current) {

            map.current = new Map({
                basemap: 'dark-gray'
            })

            var view = new SceneView({

                map: map.current,
                container: ref.current,
                center: [-38.9465, 7.775],
                zoom: 4,
                constraints: {
                    altitude: {
                        min: 150000
                    }
                },
                viewpoint: flatPosition
            });

            view.viewpoint = flatPosition;
            view.ui.components = [];

            reactiveUtils.watch(() =>
                [view.interacting, view.viewpoint],
                ([interacting, viewpoint]) => {
                    if (interacting) {
                        console.log(interacting);
                    }
                    if (viewpoint) {
                        console.log(viewpoint);
                        setGlobePosition(viewpoint);
                    }
                }
            )

        }
        return () => {
            view.destroy();
        }
    }, []);

    useEffect(() => {
        map.current!.remove(vtlayer);
        vtlayer = new VectorTileLayer({
            url: currentTime.url
        });
        map.current!.add(vtlayer);
    }, [currentTime])

    return(
      <div className='w-full h-full pt-[152px] bg-[#1D2224]' ref={ref}></div>

    )
}