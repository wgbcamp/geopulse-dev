import React from 'react'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type TimelineProps = {
    currentTime: string,
    headerState: boolean,
    setTime: React.Dispatch<React.SetStateAction<string>>
}

export const Timeline = ({currentTime, headerState, setTime}: TimelineProps) => {
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