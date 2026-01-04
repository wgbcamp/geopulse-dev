import React from "react"
import { useState, useRef, useEffect } from 'react'

import { Navigation, type Menu } from './templates/navigation';
import { Views, type View } from './templates/views';
import { Container } from './templates/container';
import { Options } from './templates/sub/options';
import { Timeline } from './templates/sub/timeline';

import { LineSquiggleIcon } from '../components/icons/lucide-line-squiggle';
import { DatabaseIcon } from '../components/icons/lucide-database';
import { InfoIcon } from '../components/icons/lucide-info';
import { ChevronDownIcon } from '../components/icons/lucide-chevron-down';
import { ChevronUpIcon } from '../components/icons/lucide-chevron-up';

type HeaderProps = {
    currentDimension: string,
    setDimension: React.Dispatch<React.SetStateAction<string>>,
    currentTime: {time: string, url: string},
    setTime: React.Dispatch<React.SetStateAction<{time: string, url: string}>>
};

// type HeaderProps = {
//     dimension: Dimension
// }

export const Header = ({ currentDimension, currentTime, setDimension, setTime }: HeaderProps) => {

  type Factor = Array<string>;

  let hazards: Factor = ["Heat Stress", "Urban Heatwave", "Riverine Flooding", "Coastal Flooding", "Drought", "Sea Level"];
  let exposures: Factor = ["Buildings", "Cropland", "GDP", "Urban GDP", "Population"];
  let scenarios: Factor = ["Baseline", "Orderly", "Disorderly", "Hot House"];
  let spatialDimensions: Factor = ["2D", "3D"];

  type HeaderTypes = Array<{
    title: string,
    factor: string[]
  }>

  const headerOptions: HeaderTypes = [
    { title: "Hazards", factor: hazards },
    { title: "Exposures", factor: exposures },
    { title: "Scenarios", factor: scenarios },
    { title: "Spatial Dimensions", factor: spatialDimensions }
  ];

  const approaches: View = [
    { a: "Event tracking", b: "View current weather patterns" },
    { a: "Grid", b: "View data on the gridded level" },
    { a: "Compare", b: "Compare regions" }
  ];

  const additionalInfo: Menu = [
    { a: "Methodology", b: <LineSquiggleIcon /> },
    { a: "Data Sources", b: <DatabaseIcon /> },
    { a: "About", b: <InfoIcon /> }
  ];

  const [currentView, setView] = useState("Grid");
  const [currentHazard, setHazard] = useState("Riverine Flooding");
  const [currentExposure, setExposure] = useState("Population");
  const [currentScenario, setScenario] = useState("Baseline");
  const [hovering, setHovering] = useState("");
  const [headerState, setHeader] = useState(true);

    return (
        <div className={`${headerState == true ? 'h-38' : 'h-88'} z-2 w-full select-none overflow-y-hidden flex flex-row absolute items-start gap-x-5 bg-white border-b pt-8`} onMouseEnter={() => setHeader(false)} onMouseLeave={() => setHeader(true)}>
            <Navigation menu={additionalInfo} />
            <Container
                title={"Views"}
                element={
                    <Views
                        list={approaches}
                        headerState={headerState}
                        currentView={currentView}
                        hovering={hovering}
                        setView={setView}
                        setHovering={setHovering}
                    />
                }
                headerState={headerState}
            />
            {headerOptions.map((x) =>
                <Container
                    title={x.title}
                    element={
                        <Options
                            factor={x.factor}
                            title={x.title}
                            headerState={headerState}
                            currentScenario={currentScenario}
                            currentHazard={currentHazard}
                            currentExposure={currentExposure}
                            currentDimension={currentDimension}
                            hovering={hovering}
                            setHazard={setHazard}
                            setExposure={setExposure}
                            setScenario={setScenario}
                            setHovering={setHovering}
                            setDimension={setDimension}
                        />}
                    headerState={headerState}
                    key={x.title}
                />
            )}
            <Container
                title={"Timeline"}
                element={
                    <Timeline
                        currentTime={currentTime}
                        headerState={headerState}
                        setTime={setTime} />}
                headerState={headerState}
            />
            <div style={{ height: '96px' }} className='flex items-center justify-center'>
                {headerState == true
                    ?
                    <ChevronDownIcon />
                    :
                    <ChevronUpIcon />
                }
            </div>
        </div>
    )
}