import { useState } from 'react'
import * as React from 'react';

import './App.css'

import { LineSquiggleIcon } from './components/icons/lucide-line-squiggle';
import { DatabaseIcon } from './components/icons/lucide-database';
import { InfoIcon } from './components/icons/lucide-info';
import { SquareMenuIcon } from './components/icons/lucide-square-menu';
import { ClockFadingIcon } from './components/icons/lucide-clock-fading';
import { GlobeIcon } from './components/icons/lucide-globe';
import { ScaleIcon } from './components/icons/lucide-scale';
import { ChevronDownIcon } from './components/icons/lucide-chevron-down';
import { ChevronUpIcon } from './components/icons/lucide-chevron-up';

import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function App() {

  type Title = string;
  type Risk = Array<string>;
  type View = Array<{ a: string, b: string }>;
  type Menu = Array<{ a: string, b: React.ReactElement }>;
  type Element = React.ReactElement; 

  const menu = (p: Menu) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className='flex gap-x-2 items-center'>
          <SquareMenuIcon />
          
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {p.map((i) =>
            <DropdownMenuItem>
              {i.b}
              {i.a}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const views = (p: View) => {
    return (
          <ItemGroup className='mx-2 my-0 gap-2 flex flex-col'>
            {
            p.map((i) =>
              headerState == false || (headerState == true && currentView == i.a) 
              ?
              <Item variant={currentView == i.a ? 'muted' : hovering == i.a ? "outline" : "default"} className='w-35 gap-y-0 p-1 items-start cursor-pointer' onClick={() => setView(i.a)} onMouseEnter={() => setHovering(i.a)} onMouseLeave={() => setHovering("")}>
                <ItemHeader className='font-semibold'>
                  {i.a}
                </ItemHeader>
                <ItemContent>
                  {headerState == false 
                  ?
                  <ItemDescription className='text-left'>
                    {i.b}
                  </ItemDescription>
                  :
                  null
                  }

                </ItemContent>
              </Item>
              : 
              null           
            )}
          </ItemGroup>
    )
  }

  const options = (p: Risk, p2: Title) => {
    return (
          <ItemGroup className='mx-2 my-0 gap-2 flex flex-col'>
            {p.map((i) =>
              headerState == false || (headerState == true && (currentHazard == i || currentExposure == i)) 
              ?
              <Item variant={currentHazard == i || currentExposure == i ? 'muted' : hovering == i ? "outline" : "default"} className='w-35 gap-y-0 p-1 items-start cursor-pointer' onClick={p2 == "Hazards" ? () => setHazard(i) : () => setExposure(i)} onMouseEnter={() => setHovering(i)} onMouseLeave={() => setHovering("")}>
                <ItemHeader className='font-medium' key={i} id={i}>
                  {i}
                </ItemHeader>
              </Item>
              :
              null
            )}
          </ItemGroup>
    )
  }

  const timeline = () => {
    const handleValueChange = (value: number[]) => {
      value.forEach(number => {
        switch (number)  {
          case 1: 
            setTime("1980-2014");
            break;
          case 2:
            setTime("2030");
            break;
          case 3:
            setTime("2050");
            break;
          case 4:
            setTime("2080");
            break;
        }
      })

    }

    return (
      <Item className='w-70 pt-0'>
        <div className='w-full flex items-center pb-4'>
          <Slider 
          className='w-full'
          defaultValue={[1]}
          min={1}
          max={4}
          step={1}
          onValueChange={handleValueChange}
          />
          <Item variant='muted' className='w-35 px-0 ml-4 py-0'>
            <ItemContent>
              <div className='flex items-center justify-center' style={{paddingBottom: '4px', paddingTop: '4px'}}>{currentTime}</div>
            </ItemContent>
          </Item>
        </div>  
        {headerState == false
          ?
          <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Decades</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-three" id="option-three" />
              <Label htmlFor="option-three">Months</Label>
            </div>
          </RadioGroup>
          :
          null
        }
      </Item>
    )
  }

  const container = (p: Title, p2: Element) => {
    return (
      <Item variant='outline' className={`${headerState == false ? 'h-70' : 'h-24'} shadow-sm`}>
        <ItemContent className='h-full'>
          <ItemTitle className='pb-1'>
            <div className='font-extrabold'>{p}</div>
          </ItemTitle>
          {p2}
        </ItemContent>
      </Item>
    )
  }

  const additionalInfo: Menu = [
    { a: "Methodology", b: <LineSquiggleIcon /> },
    { a: "Data Sources", b: <DatabaseIcon /> },
    { a: "About", b: <InfoIcon /> }
  ];

  const approaches: View = [
    { a: "Event tracking", b: "View current weather patterns" },
    { a: "Grid", b: "View data on the gridded level" },
    { a: "Compare", b: "Compare regions" }
  ];

  let hazards: Risk = ["Heat Stress", "Urban Heatwave", "Riverine Flooding", "Coastal Flooding", "Drought", "Sea Level"];
  let exposures: Risk = ["Buildings", "Cropland", "GDP", "Urban GDP", "Population"];

  const [currentView, setView] = useState("Grid");
  const [currentHazard, setHazard] = useState("Riverine Flooding");
  const [currentExposure, setExposure] = useState("Population");
  const [currentTime, setTime] = useState("1980-2014");
  const [hovering, setHovering] = useState("");

  const [headerState, setHeader] = useState(true);

  return (
    <div className={`w-full ${headerState == true ? 'h-38' : 'h-88'} overflow-y-hidden flex flex-row items-start gap-x-5 bg-white border-b pt-8`} onMouseEnter={() => setHeader(false)} onMouseLeave={() => setHeader(true)}>
      {menu(additionalInfo)}
      {container("Views", views(approaches))}
      {container("Hazards", options(hazards, "Hazards"))}
      {container("Exposures", options(exposures, "Exposures"))}
      {container("Timeline", timeline())}
      <div style={{height: '96px'}} className='flex items-center justify-center'>
        {headerState == true 
          ? 
          <ChevronDownIcon/>
          :
          <ChevronUpIcon/>
        }
      </div>
    </div>
  )
}

export default App
