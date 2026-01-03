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

export const Header = () => {

  type Risk = Array<string>;

  let hazards: Risk = ["Heat Stress", "Urban Heatwave", "Riverine Flooding", "Coastal Flooding", "Drought", "Sea Level"];
  let exposures: Risk = ["Buildings", "Cropland", "GDP", "Urban GDP", "Population"];
  let scenarios: Risk = ["Baseline", "Orderly", "Disorderly", "Hot House"];

  type HeaderTypes = Array<{
    title: string,
    risk: string[]
  }>

  const headerOptions: HeaderTypes = [
    { title: "Hazards", risk: hazards },
    { title: "Exposures", risk: exposures },
    { title: "Scenarios", risk: scenarios }
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
  const [currentTime, setTime] = useState("1980-2014");
  const [currentScenario, setScenario] = useState("Baseline");
  const [hovering, setHovering] = useState("");
  const [headerState, setHeader] = useState(true);

    return (
        <div className={`${headerState == true ? 'h-38' : 'h-88'} w-full select-none overflow-y-hidden flex flex-row absolute items-start gap-x-5 bg-white border-b pt-8`} onMouseEnter={() => setHeader(false)} onMouseLeave={() => setHeader(true)}>
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
                            risk={x.risk}
                            title={x.title}
                            headerState={headerState}
                            currentScenario={currentScenario}
                            currentHazard={currentHazard}
                            currentExposure={currentExposure}
                            hovering={hovering}
                            setHazard={setHazard}
                            setExposure={setExposure}
                            setScenario={setScenario}
                            setHovering={setHovering}
                        />}
                    headerState={headerState}
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