import { useState, useRef, useEffect } from 'react'

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Map from "@arcgis/core/Map.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";
import MapView from "@arcgis/core/views/MapView.js";
import Extent from "@arcgis/core/geometry/Extent.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";

type FlatMapProps = {
    globePosition: object,
    currentTime: { time: string, url: string },
    setFlatPosition: React.Dispatch<React.SetStateAction<any>>
}


export const FlatMap = ({ globePosition, currentTime, setFlatPosition }: FlatMapProps) => {

    const ref = useRef(null);
    let map = useRef<Map | null>(null);
    const vtlayer = useRef<VectorTileLayer | null>(null);

    useEffect(() => {
        if (ref.current) {

            map.current = new Map({
                basemap: 'dark-gray'
            })

            var view = new MapView({
                container: ref.current,
                map: map.current,
                zoom: 3,
                center: [-40.9465, 0.775],
                constraints: {
                    minZoom: 2,
                    maxZoom: 10,
                    geometry: { // Constrain lateral movement to Lower Manhattan
                        type: "extent",
                        xmin: -360,
                        ymin: -65.700,
                        xmax: 360,
                        ymax: 80.73,
                    },
                },
                spatialReference: {
                    wkid: 3857,
                },
                viewpoint: globePosition
            });

            view.ui.components = [];

            reactiveUtils.watch(() =>
                [view.interacting, view.viewpoint],
                ([interacting, viewpoint]) => {
                    if (interacting) {
                    }
                    if (viewpoint) {
                        setFlatPosition(viewpoint);
                    }
                }
            )
        }
        return () => {
            view.destroy();
        }
    }, []);

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
    }, [currentTime])

    return (
        <div className='w-full h-full bg-[#1D2224]' ref={ref}></div>
    )
}