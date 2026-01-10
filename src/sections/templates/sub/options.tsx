import React from "react"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

type Risk = {
    factor: Array<string>, 
    title: string,
    headerState: boolean,
    currentScenario: string,
    currentHazard: string,
    currentExposure: string,
    currentDimension: string,
    hovering: string,
    setHazard: React.Dispatch<React.SetStateAction<string>>,
    setExposure: React.Dispatch<React.SetStateAction<string>>,
    setScenario: React.Dispatch<React.SetStateAction<string>>,
    setHovering: React.Dispatch<React.SetStateAction<string>>,
    setDimension: React.Dispatch<React.SetStateAction<string>>
}

var scenarioFlip = [
  {frontend: 'Orderly', data: 'rcp4p5'},
  {frontend: 'Disorderly', data: 'rcp8p5'},
  {frontend: 'Baseline', data: 'historical'},
  {frontend: 'Hot House', data: 'Hot House'} 
];
var test = 1;
export const Options = ({
    factor,
    title,
    headerState,
    currentScenario,
    currentHazard,
    currentExposure,
    currentDimension,
    hovering,
    setHazard,
    setExposure,
    setScenario,
    setHovering,
    setDimension
}: Risk) => {
    return (
          <ItemGroup className='mx-2 my-0 gap-2 flex flex-col'>
            {factor.map((i) =>
              headerState == false || (headerState == true && (currentHazard == i || currentExposure == i || currentScenario == i || currentDimension == i)) 
              ?
              <Item variant={currentHazard == i || currentExposure == i || currentScenario == i || currentDimension == i ? 'muted' : hovering == i ? "outline" : "default"} className="w-35 gap-y-0 p-1 items-start cursor-pointer" key={i} onClick={title == "Hazards" ? () => setHazard(i) : title == "Exposures" ? () => setExposure(i): title == "Scenarios" ? () => setScenario(scenarioFlip.filter((item) => item.data === i)[0].data): () => setDimension(i)} onMouseEnter={() => setHovering(i)} onMouseLeave={() => setHovering("")}>
                <ItemHeader className={`${currentHazard == i || currentExposure == i || currentScenario == i || currentDimension == i ? 'font-semibold' : "font-medium"}`} key={i} id={i}>
                  {scenarioFlip.filter(item => item.data === i)[0] ? scenarioFlip.filter(item => item.data === i)[0].frontend : i}
               
                </ItemHeader>
              </Item>
              :
              null
            )}
          </ItemGroup>
    )
  }