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
    risk: Array<string>, 
    title: string,
    headerState: boolean,
    currentScenario: string,
    currentHazard: string,
    currentExposure: string,
    hovering: string,
    setHazard: React.Dispatch<React.SetStateAction<string>>,
    setExposure: React.Dispatch<React.SetStateAction<string>>,
    setScenario: React.Dispatch<React.SetStateAction<string>>,
    setHovering: React.Dispatch<React.SetStateAction<string>>
}

export const Options = ({
    risk,
    title,
    headerState,
    currentScenario,
    currentHazard,
    currentExposure,
    hovering,
    setHazard,
    setExposure,
    setScenario,
    setHovering
}: Risk) => {
    return (
          <ItemGroup className='mx-2 my-0 gap-2 flex flex-col'>
            {risk.map((i) =>
              headerState == false || (headerState == true && (currentHazard == i || currentExposure == i || currentScenario == i)) 
              ?
              <Item variant={currentHazard == i || currentExposure == i || currentScenario == i ? 'muted' : hovering == i ? "outline" : "default"} className="w-35 gap-y-0 p-1 items-start cursor-pointer" key={i} onClick={title == "Hazards" ? () => setHazard(i) : title == "Exposures" ? () => setExposure(i): () => setScenario(i)} onMouseEnter={() => setHovering(i)} onMouseLeave={() => setHovering("")}>
                <ItemHeader className={`${currentHazard == i || currentExposure == i || currentScenario == i ? 'font-semibold' : "font-medium"}`} key={i} id={i}>
                  {i}
                </ItemHeader>
              </Item>
              :
              null
            )}
          </ItemGroup>
    )
  }