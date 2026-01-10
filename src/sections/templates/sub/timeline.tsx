import React from 'react'

import {
  Item,
  ItemContent,
} from "@/components/ui/item"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type TimelineProps = {
    currentTime: {time: number, url: string},
    headerState: boolean,
    setTime: React.Dispatch<React.SetStateAction<{time: number, url: string}>>
}    

var timeFlip = [
  {frontend: "1980-2014", data: 1980},
  {frontend: "2030", data: 2030},
  {frontend: "2050", data: 2050},
  {frontend: "2100", data: 2080},
]

export const Timeline = ({currentTime, headerState, setTime}: TimelineProps) => {
    const handleValueChange = (value: number[]) => {
      value.forEach(number => {
        switch (number)  {
          case 1: 
            setTime({time: 1980, url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_historical_1980/VectorTileServer"});
            break;
          case 2:
            setTime({time: 2030, url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_rcp4p5_2030/VectorTileServer"});
            break;
          case 3:
            setTime({time: 2050, url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_rcp4p5_2050/VectorTileServer"});
            break;
          case 4:
            setTime({time: 2080, url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_rcp4p5_2080/VectorTileServer"});
            break;
        }
      })

    }

    return (
      <Item className='w-65 pt-0'>
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
              <div className='flex items-center justify-center' style={{paddingBottom: '4px', paddingTop: '4px'}}>{timeFlip.filter(item => item.data === currentTime.time)[0].data}</div>
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
              <RadioGroupItem value="option-two" id="option-two" disabled={true}/>
              <Label htmlFor="option-two">Years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-three" id="option-three" disabled={true}/>
              <Label htmlFor="option-three">Months</Label>
            </div>
          </RadioGroup>
          :
          null
        }
      </Item>
    )
  }