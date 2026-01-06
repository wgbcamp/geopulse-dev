import { ComboBox } from './sub/comboBox';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { MapsChart } from '@highcharts/react/Maps';
import { MapSeries } from '@highcharts/react/series/Map';
import {
    Chart,
    Series,
    Title,
} from '@highcharts/react';

const mapData = await fetch('https://code.highcharts.com/mapdata/custom/world.topo.json').then(res => res.ok ? res.json() : null);


export const Region = () => {
    return(
        <Card className="bg-[#1E1E1E] w-full h-7/10 dark flex items-center shadow-md">
            <ComboBox />
            <MapsChart
                options={{
                    chart: {
                        map: mapData
                    }
                }}
            >
                <MapSeries
                    data={[
                        { 'hc-key': 'no', value: 1 },
                        { 'hc-key': 'dk', value: 2 },
                        { 'hc-key': 'se', value: 3 }
                    ]}
                    />
                </MapsChart>
        </Card>
    )
}