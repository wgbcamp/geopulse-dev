import './App.css'
import { Header } from './sections/header';
import { useState } from 'react'
import { ViewContainer } from './sections/ViewContainer';
import { Compare } from './sections/compare';

 function App() {

  const [currentView, setView] = useState("Grid");
  const [currentDimension, setDimension] = useState("2D");
  const [currentTime, setTime] = useState({ time: 1980, url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_historical_1980/VectorTileServer" });
  const [currentScenario, setScenario] = useState("rcp4p5");

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
        <Compare currentTime={currentTime} currentScenario={currentScenario}/>
      }

    </div>

  )
}

export default App
