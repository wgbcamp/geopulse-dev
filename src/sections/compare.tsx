import React from 'react';
import { Region } from './templates/region';
import { 
    type JsonShape, 
    type Series, 
    type Maximum, 
    type RegionSeries,
    type AreaSeries
} from '../App'

export type Filters = {
    currentTime: {
        time: number,
        url: string
    },
    currentScenario: string,
    country: [object, object],
    setCountry: React.Dispatch<React.SetStateAction<[object, object]>>,
    mapPolygon: JsonShape,
    position: any,
    series: Series,
    setSeries: React.Dispatch<React.SetStateAction<Series>>,
    exposureState: Array<Array<[string, number, number, string]>>,
    setExposureState: React.Dispatch<React.SetStateAction<Array<Array<[string, number, number, string]>>>>,
    maxValue: Maximum,
    setMaxValue: React.Dispatch<React.SetStateAction<Maximum>>,
    regionExposure: RegionSeries,
    setRegionExposure: React.Dispatch<React.SetStateAction<RegionSeries>>,
    areaSeries: AreaSeries,
    setAreaSeries: React.Dispatch<React.SetStateAction<AreaSeries>>,
    currentExposure: string
    setExposure: React.Dispatch<React.SetStateAction<string>>,
    currentHazard: string,
    setHazard: React.Dispatch<React.SetStateAction<string>>
}

const regionCount = [0, 1];

export const Compare = ({
    currentTime,
    currentScenario,
    country,
    setCountry,
    mapPolygon,
    series,
    setSeries,
    exposureState,
    setExposureState,
    maxValue,
    setMaxValue,
    regionExposure,
    setRegionExposure,
    areaSeries,
    setAreaSeries,
    currentExposure,
    setExposure,
    currentHazard,
    setHazard
}: Filters) => {
    return (
        <div className="bg-[#1E1E1E] w-full h-full flex justify-center pt-[152px]">
            <div className=" w-9/10 h-full dark flex flex-row gap-x-5 pt-18">
                {regionCount.map((i) =>
                    <Region
                        key={i}
                        currentTime={currentTime}
                        currentScenario={currentScenario}
                        country={country}
                        setCountry={setCountry}
                        mapPolygon={mapPolygon}
                        position={i}
                        series={series}
                        setSeries={setSeries}
                        exposureState={exposureState}
                        setExposureState={setExposureState}
                        maxValue={maxValue}
                        setMaxValue={setMaxValue}
                        regionExposure={regionExposure}
                        setRegionExposure={setRegionExposure}
                        areaSeries={areaSeries}
                        setAreaSeries={setAreaSeries}
                        currentExposure={currentExposure}
                        setExposure={setExposure}
                        currentHazard={currentHazard}
                        setHazard={setHazard}
                    />
                )}
            </div>
        </div>
    )
}