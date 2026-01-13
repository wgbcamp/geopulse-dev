import React from 'react'

import {
  Item,
  ItemContent,
} from "@/components/ui/item"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type InequalityGroup = {
    currentExposureFilter: string,
    setExposureFilter: React.Dispatch<React.SetStateAction<string>>,
    inequalitySymbols: {category: string, symbols: string[]}[],
    headerState: boolean
}    

export const InequalityGroup = ({headerState, inequalitySymbols, currentExposureFilter, setExposureFilter} : InequalityGroup) => {
    return (
      <Item className='w-65 pt-0'>
        <div className='w-full flex items-center'>
        </div>  
        {headerState == false
          ?
          <div>{currentExposureFilter === "Hot Days" ?
            <RadioGroup defaultValue="option-one">
              {inequalitySymbols[0].symbols.map((i, index) => 
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={`option-${index}`} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{currentExposureFilter} {'>'} {i}</Label>
                </div>
              )}
            </RadioGroup>
            : currentExposureFilter === "Tropical Nights" ? 
            <RadioGroup defaultValue="option-0">
              {inequalitySymbols[1].symbols.map((i, index) => 
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={`option-${index}`} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{currentExposureFilter} {'>'} {i}</Label>
                </div>
              )}
            </RadioGroup>
            :
            null
          }
          </div>
          :
          <RadioGroup defaultValue="option-one" className='flex'>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Placeholder</Label>
            </div>
          </RadioGroup>
        }
      </Item>
    )
  }