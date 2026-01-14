import React, { useRef } from 'react'

import {
  Item,
  ItemContent,
} from "@/components/ui/item"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"

type TimelineProps = {
  currentTime: { time: number, url: string },
  headerState: boolean,
  setTime: React.Dispatch<React.SetStateAction<{ time: number, url: string }>>,
  currentHazard: string,
  currentExposure: string
}

const tileLayerURLs = [
  {time: 1980, url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_historical_1980/VectorTileServer"},
  {time: 2030, url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_rcp4p5_2030/VectorTileServer"},
  {time: 2050, url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_rcp4p5_2050/VectorTileServer"},
  {time: 2080, url: "https://tiles.arcgis.com/tiles/weJ1QsnbMYJlCHdG/arcgis/rest/services/riverine_flood_grid_people_rcp4p5_2080/VectorTileServer"}
];

export const Timeline = ({ currentTime, headerState, setTime, currentHazard, currentExposure }: TimelineProps) => {

  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState<number[]>([1980]);

  const handleValueChange = (value: number[]) => {
    value.forEach(number => {
        // add code for future vector tile layers
      setValue([number]);
      setTime({ time: number, url: tileLayerURLs.filter((i) => i.time === number)[0]?.url ?? "" });
      if (ref.current) {
        ref.current.value = number.toString();
      }
    })
  }

  const updateSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) >= 1980 && Number(e.target.value) <= 2100) {
      setValue([Number(e.target.value)]); 
      setTime({ time: Number(e.target.value), url: tileLayerURLs.filter((i) => i.time === Number(e.target.value))[0].url });
    }
  }

  return (
        <Item className='w-65 pt-0'>
          <div className='w-full flex items-center pb-4'>
            <Slider 
              className='w-full'
              defaultValue={[1980]}
              min={1980}
              max={2100}
              step={1}
              value={value}
              onValueChange={handleValueChange}
            />
            <Item variant='muted' className='w-35 px-0 ml-4 py-0'>
              <ItemContent>
                <div className='flex items-center justify-center' style={{ paddingBottom: '4px', paddingTop: '4px' }}>
                  <Input 
                    ref={ref}
                    placeholder={value.toString()}
                    onChange={(e) => updateSlider(e)}
                    value={null}
                  />
                </div>
              </ItemContent>
            </Item>
          </div>
        </Item>
      
  )
}