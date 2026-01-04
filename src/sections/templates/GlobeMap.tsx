import { useState, useRef, useEffect } from 'react'

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Map from "@arcgis/core/Map.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";
import SceneView from "@arcgis/core/views/SceneView.js";

type GlobeMapProps = {
    flatPosition: object;
    setGlobePosition: React.Dispatch<React.SetStateAction<any>>;
}

export const GlobeMap = ({flatPosition, setGlobePosition}: GlobeMapProps) => {


    const ref = useRef(null);  

    useEffect(() => {
        if (ref.current) {

            let map = new Map({
                basemap: 'dark-gray'
            })

            let vtlayer = new VectorTileLayer({
                url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_historical_1980/VectorTileServer"
            });

            map.add(vtlayer);

            var view = new SceneView({

                map: map,
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


    return(
      <div className='w-full h-full pt-[152px] bg-[#1D2224]' ref={ref}></div>

    )
}