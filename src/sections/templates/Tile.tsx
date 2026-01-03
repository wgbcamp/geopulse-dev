import { useState, useRef, useEffect } from 'react'

import Map from "@arcgis/core/Map.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";
import MapView from "@arcgis/core/views/MapView.js";
import Extent from "@arcgis/core/geometry/Extent.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";

export const Tile = () => {

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

            const extent = new Extent({
                xmin: -13056650,
                ymin: 6077558,
                xmax: -13055709,
                ymax: 6077938,
                spatialReference: new SpatialReference({ wkid: 3857 })
            })

            var view = new MapView({
                container: ref.current,
                map: map,
                zoom: 5,
                center: [-90.9465, 0.775],
                constraints: {
                    minZoom: 3,
                    maxZoom: 10,
                    geometry: { // Constrain lateral movement to Lower Manhattan
                        type: "extent",
                        xmin: -360,
                        ymin: -40.700,
                        xmax: 360,
                        ymax: 70.73,
                    },
                },
                spatialReference: {
                    wkid: 3857,
                }
            });
        }

        return () => {
            view.destroy();
        }

    }, []);


    return(
      <div className='w-full h-250 pt-[152px] bg-[#1D2224]' ref={ref}></div>

    )
}