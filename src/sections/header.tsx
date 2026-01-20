import React from "react"
import { useState } from 'react'

import { Navigation } from './templates/navigation';
import { Views } from './templates/views';
import { Container } from './templates/container';
import { Options } from './templates/sub/options';
import { Timeline } from './templates/sub/timeline';
import { InequalityGroup } from "./templates/sub/inequalityGroup";

import { LineSquiggleIcon } from '../components/icons/lucide-line-squiggle';
import { DatabaseIcon } from '../components/icons/lucide-database';
import { InfoIcon } from '../components/icons/lucide-info';
import { ChevronDownIcon } from '../components/icons/lucide-chevron-down';
import { ChevronUpIcon } from '../components/icons/lucide-chevron-up';

type HeaderProps = {
    currentDimension: string,
    setDimension: React.Dispatch<React.SetStateAction<string>>,
    currentTime: {time: number, url: string},
    setTime: React.Dispatch<React.SetStateAction<{time: number, url: string}>>,
    currentView: string,
    setView: React.Dispatch<React.SetStateAction<string>>
    currentScenario: string,
    setScenario: React.Dispatch<React.SetStateAction<string>>,
    currentHazard: string,
    setHazard: React.Dispatch<React.SetStateAction<string>>,
    currentExposure: string,
    setExposure: React.Dispatch<React.SetStateAction<string>>,
    currentExposureFilter: string,
    setExposureFilter: React.Dispatch<React.SetStateAction<string>>
};



export type Menu = Array<{ 
    a: string, 
    b: React.ReactElement 
}>;

export type View = Array<{ 
    a: string, 
    b: string 
}>;

type Factor = Array<string>;

let hazards: Factor = ["Temperature Extremes", "Urban Heatwave", "Riverine Flooding", "Coastal Flooding", "Drought", "Draught", "Sea Level"];
let exposures: Factor = ["Buildings", "Cropland", "GDP", "Urban GDP", "Population", "Livestock"];
let scenarios: Factor = ["historical", "rcp4p5", "rcp8p5", "Hot House"];
let spatialDimensions: Factor = ["2D", "3D"];
let subExposures: Factor = ["Hot Days", "Dry Days", "SPEI Index", "Tropical Nights", "Icing Days" ];
let inequalitySymbols = [
    {category: "Hot Days", symbols: ["30*", "35*", "40*"]},
    {category: "Tropical Nights", symbols: ["20*", "26", "32"]}
];

type HeaderTypes = Array<{
    title: string,
    factor: string[]
}>

export const Header = ({ currentDimension, currentTime, currentView, currentScenario, currentHazard, currentExposure, currentExposureFilter,
    setExposure, setHazard, setDimension, setTime, setView, setScenario, setExposureFilter 
}: HeaderProps) => {

  const headerOptions: HeaderTypes = [
    { title: "Hazards", factor: hazards },
    { title: "Exposures", factor: exposures },
    { title: "Scenarios", factor: scenarios },
    { title: "Spatial Dimensions", factor: spatialDimensions },
    { title: "Exposure Filter", factor: subExposures},
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

  const [hovering, setHovering] = useState("");
  const [headerState, setHeader] = useState(true);

    return (
        <div className={`${headerState == true ? 'h-38' : 'h-95'} z-2 w-98/100 select-none overflow-y-hidden flex flex-row absolute items-start gap-x-5 bg-white border-b pt-8`} onMouseEnter={() => setHeader(false)} onMouseLeave={() => setHeader(true)}>
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
                            currentExposureFilter={currentExposureFilter}
                            hovering={hovering}
                            setHazard={setHazard}
                            setExposure={setExposure}
                            setScenario={setScenario}
                            setHovering={setHovering}
                            setDimension={setDimension}
                            setExposureFilter={setExposureFilter}
                            currentView={currentView}
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
                        setTime={setTime} 
                        currentHazard={currentHazard}
                        currentExposure={currentExposure}
                    />}
                headerState={headerState}
            />
            <Container
                title={"Day Comparisons"}
                element={
                    <InequalityGroup
                        currentExposureFilter={currentExposureFilter}
                        setExposureFilter={setExposureFilter}
                        inequalitySymbols={inequalitySymbols}
                        headerState={headerState}
                    />
                }
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