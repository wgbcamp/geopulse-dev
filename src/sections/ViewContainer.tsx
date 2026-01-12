import { useState, useRef, useEffect } from 'react'

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Map from "@arcgis/core/Map.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";
import MapView from "@arcgis/core/views/MapView.js";
import SceneView from "@arcgis/core/views/SceneView.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";

type MapProps = {
    currentTime: { time: number, url: string },
    currentDimension: string
}

export const ViewContainer = ({ currentTime, currentDimension }: MapProps) => {

    const [position, setPosition] = useState({});

    const ref = useRef(null);
    let map = useRef<Map | null>(null);
    const vtlayer = useRef<VectorTileLayer | null>(null);
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

        vtlayer.current = new VectorTileLayer({
            url: currentTime.url
        });

        map.current.add(vtlayer.current);
    }, [currentTime, currentDimension])

    return (
        <div className='w-full h-full bg-[#1D2224] pt-[152px]' ref={ref}></div>
    )
}