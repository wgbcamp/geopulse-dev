import './App.css'
import { Header } from './sections/header';
import { useState } from 'react'
import { ViewContainer } from './sections/ViewContainer';

function App() {

const [currentDimension, setDimension] = useState("2D");
const [currentTime, setTime] = useState({ time: "1980-2014", url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_historical_1980/VectorTileServer" });

  return (
    <div className='h-full'>
      <Header currentDimension={currentDimension} 
      setDimension={setDimension} 
      currentTime={currentTime}
      setTime={setTime}
      />
      <ViewContainer currentTime={currentTime} currentDimension={currentDimension}/>
    </div>

  )
}

export default App
