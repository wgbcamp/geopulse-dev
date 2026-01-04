import './App.css'
import { Header } from './sections/header';
import { Grid } from './sections/Grid';
import { useState } from 'react'
import { GlobeMap } from './sections/templates/GlobeMap'


function App() {

const [currentDimension, setDimension] = useState("2D");

  return (
    <div className='h-full'>
      <Header currentDimension={currentDimension} setDimension={setDimension}/>
      <Grid currentDimension={currentDimension}/>
    </div>

  )
}

export default App
