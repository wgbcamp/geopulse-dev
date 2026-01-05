import './App.css'
import { Header } from './sections/header';
import { useState } from 'react'
import { ViewContainer } from './sections/ViewContainer';
import { Compare } from './sections/compare';

 function App() {

    type ObjectID = {
      objectIds: number
    };

    const whereClause = `Admin_Filter IN ('gadm0', 'gadm1')`;
    var queryString = `where=${encodeURIComponent(whereClause)}`;

    // async function test() {

    //   const url = `https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Floods_riverine_people_all/FeatureServer/0/query?${queryString}&outFields=*&f=json&returnIdsOnly=true`;
    //   const result = await fetch(url);
    //   var x = await result.json();

    //   var y = x.objectIds.filter((value: ObjectID) => value);
    //   console.log(y);
    //   console.log(y.join(","));
      
    //   var y2;

    //   var count = 1;

    //   type SliceNumber = {
    //     start: number,
    //     end: number
    //   };

    //   function counter({start, end}: SliceNumber) {
    //     y2 = y.slice(start, end);

    //     const params = new URLSearchParams({
    //       objectIds: y2.join(","),
    //       outFields: '*',
    //       f: 'json'
    //     });

    //     fetch('https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Floods_riverine_people_all/FeatureServer/0/query', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       },
    //       body: params
    //     })
    //       .then(res => res.json())
    //       .then(data => {
    //         console.log(data);
    //         if (end < y.length) {
    //           count += 2000;
    //           counter({ start: 0 + count, end: 2000 + count});

    //         }
    //       });
    //   }

    //   counter({ start: 0, end: 2000});
    // }

    // test();


  const [currentView, setView] = useState("Grid");
  const [currentDimension, setDimension] = useState("2D");
  const [currentTime, setTime] = useState({ time: "1980-2014", url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_historical_1980/VectorTileServer" });

  return (
    <div className='h-full'>
      <Header
        currentDimension={currentDimension}
        setDimension={setDimension}
        currentTime={currentTime}
        setTime={setTime}
        currentView={currentView}
        setView={setView}
      />
      {currentView == "Grid"
        ?
        <ViewContainer currentTime={currentTime} currentDimension={currentDimension} />
        :
        <Compare />
      }

    </div>

  )
}

export default App
