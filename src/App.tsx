import './App.css'
import { Header } from './sections/header';
import React, { useState, useEffect } from 'react'
import { ViewContainer } from './sections/ViewContainer';
import { Compare } from './sections/compare';

export type JsonShape = {
  features: Array<{
    properties: {
      GID_0: string
    }
  }>
};

export type PolygonPosition = number;

type SeriesTuple = [string, number, number, string];
export type Series = SeriesTuple[][];

export type Maximum = number[];

function App() {

  const [currentView, setView] = useState("Compare");
  const [currentDimension, setDimension] = useState("2D");
  const [currentTime, setTime] = useState({ time: 1980, url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_historical_1980/VectorTileServer" });
  const [currentScenario, setScenario] = useState("rcp4p5");

  let [geoJson, setGeoJson] = React.useState<JsonShape | any>(null)

  useEffect(() => {
    const getGeoJson = async () => {
      var getData = await fetch('/geopulse/GADM_ADMIN1.json');
      geoJson = await getData.json();
      console.log(geoJson);
      setGeoJson(geoJson);
    }
    getGeoJson();
  }, []);

  const [country, setCountry] = React.useState<[object, object]>([
    {
      type: "string",
      features: [{}],
      name: "string",
      iso3: "string"
    },
    {
      type: "string",
      features: [{}],
      name: "string",
      iso3: "string"
    }
  ]);

  const [exposureState, setExposureState] = React.useState<Series>([[],[]]);
  const [series, setSeries] = React.useState<Series>([[],[]]);
  const [maxValue, setMaxValue] = React.useState<Maximum>([0, 0]);

  return (
    <div className='h-full'>
      <Header
        currentDimension={currentDimension}
        setDimension={setDimension}
        currentTime={currentTime}
        setTime={setTime}
        currentView={currentView}
        setView={setView}
        currentScenario={currentScenario}
        setScenario={setScenario}
      />
      {currentView == "Grid"
        ?
        <ViewContainer currentTime={currentTime} currentDimension={currentDimension} />
        :
        <Compare
          currentTime={currentTime}
          currentScenario={currentScenario}
          country={country}
          setCountry={setCountry}
          mapPolygon={geoJson}
          position={null}
          series={series}
          setSeries={setSeries} 
          exposureState={exposureState}
          setExposureState={setExposureState}
          maxValue={maxValue}
          setMaxValue={setMaxValue}
        />
      }

    </div>

  )
}

export default App
