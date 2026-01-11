import React, { useEffect } from 'react';
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
import { useState } from 'react';
import { type Filters } from '../compare'
import { type Maximum } from '../../App'

type DataString = {
    alpha2: string,
    alpha3: string,
    name: string,
    iso3: string,
};

type ExposureShape = [string, number, number, string][];

export const Region = ({
    currentTime, 
    currentScenario, 
    country, 
    setCountry, 
    mapPolygon, 
    position, 
    series, 
    setSeries, 
    exposureState, 
    setExposureState,
    maxValue,
    setMaxValue
}: Filters) => {

    var exposure: ExposureShape = [];

    useEffect(() => {
            applyFilter();
    }, [exposureState, currentTime, currentScenario]);

    // useEffect(() => {
    //     console.log(series);
    // }, [series]);

    var loadGeoJson = async (data: DataString) => {
        var temp = {
            type: "FeatureCollection",
            features: [{}],
            name: data.name,
            iso3: data.alpha3
        };
        for (var i = 0; i < mapPolygon.features.length; i++) {
            if (data.alpha3 == mapPolygon.features[i].properties.GID_0) {
                temp.features.push(mapPolygon.features[i]);
            }
        }

        const updateCountryGeo = (position: number) => {
            const newItems = country;
            newItems.splice(position, 1, temp);
            setCountry(newItems);
        }

        console.log(country)
        updateCountryGeo(position);
        return test(temp);
    }

    type ObjectID = {
      objectIds: number
    };

    type CountryData = {
        type: string,
        features: {}[],
        name: string,
        iso3: string
    }

    type TableArray = Array<{
        features: Array<{
            attributes: {
                NAME_1: string,
                wExposed: number,
                period: number,
                scenario: string,
                Admin_Filter: string
            }
        }>
    }>;

    async function test(countryData: CountryData) {

        const whereClause = `Admin_Filter IN ('gadm0', 'gadm1') AND country_abr IN ('${countryData.iso3}')`;
        var queryString = `where=${encodeURIComponent(whereClause)}`;

        const parameters = new URLSearchParams({
            returnIdsOnly: 'true',
            cacheHint: 'true',
            f: 'json'
        });
        const url = `https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Floods_riverine_people_all/FeatureServer/0/query?${queryString}`;
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: parameters
        });
        var x = await result.json();
        var y = x.objectIds.filter((value: ObjectID) => value);
        console.log(y);
        console.log(y.join(","));

        var count = 1;

        type SliceNumber = {
            start: number,
            end: number
        };

        var tableData: TableArray = [];

        function counter({ start, end }: SliceNumber) {

            const params = new URLSearchParams({
                objectIds: y.slice(start, end).join(","),
                outFields: 'Admin_Filter,period,scenario,country_abr,wExposed,NAME_1',
                f: 'json',
                maxRecordCountFactor: '5'
            });

            fetch('https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Floods_riverine_people_all/FeatureServer/0/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    tableData.push(data);
                    if (end < y.length) {
                        count += 10000;
                        counter({ start: 0 + count, end: 10000 + count });
                    } else {
                        sumWeightedExposure(tableData);
                        // console.log(country);
                        console.log(tableData[0].features[0].attributes);
                    }
                });
        }

        counter({ start: 0, end: 10000 });
    }

    var tempMaxValue: number;

    const sumWeightedExposure = async (tableData: TableArray) => {
        tempMaxValue = 0;
        console.log(tableData);
        for (var a = 0; a < tableData.length; a++) {
            for (var b = 0; b < tableData[a].features.length; b++) {

                // filter out regional (gadm0) results, only including gadm1
                if (tableData[a].features[b].attributes.Admin_Filter === "gadm1") {

                    // set max value for color axis in highcharts
                    if (tempMaxValue < tableData[a].features[b].attributes.wExposed) {
                        tempMaxValue = tableData[a].features[b].attributes.wExposed;
                    }
                    // set check for the length of the exposure array
                    var existence = false;

                    // loop through exposure array 
                    for (var c = 0; c < exposure.length; c++) {

                        // add to existing NAME_1 entries
                        if (exposure[c][0] === tableData[a].features[b].attributes.NAME_1 
                            && exposure[c][2] === tableData[a].features[b].attributes.period
                            && exposure[c][3] === tableData[a].features[b].attributes.scenario) {
                            existence = true;
                            exposure[c][1] += tableData[a].features[b].attributes.wExposed;
                            break;
                        }
                    }
                    // if no existing NAME_1 was found earlier, push new NAME_1 entries
                    if (existence == false) {
                        exposure.push([
                            tableData[a].features[b].attributes.NAME_1,
                            tableData[a].features[b].attributes.wExposed,
                            tableData[a].features[b].attributes.period,
                            tableData[a].features[b].attributes.scenario
                        ]);
                    }
                }
            }
        }
        console.log(exposure);

        const updateMaxValue = (position: number) => {
            setMaxValue(prev => {
                const next = [...prev];
                next[position] = tempMaxValue;
                return next;
            })
        }
        updateMaxValue(position);

        const updateExposureValues = (position: number) => {
            setExposureState(prev => {
                const next = [...prev];
                next[position] = exposure;
                return next;
            })
        }
        updateExposureValues(position);
    }

    function applyFilter() {
        console.log(exposureState);
        console.log(series);

        const updateSeriesValues = (position: number) => {
            console.log(series);
            setSeries(prev => {
                const next = [...prev];
                next[position] = exposureState[position].filter((value) => (value[2] === currentTime.time)).filter((value) => (value[3] === currentScenario));
                return next;
            })
       }
        updateSeriesValues(position);
    }

    return (
        <Card className="bg-[#1E1E1E] w-full h-7/10 dark flex items-center shadow-md">
            <ComboBox loadGeoJson={loadGeoJson} />                
                <MapsChart
                    options={{
                        chart: {
                            map: country[position],
                            backgroundColor: '#1E1E1E',
                            animation: false
                        },
                        mapView: {
                            projection: {
                                name: 'WebMercator',
                                rotation: [-50, 0]
                            },
                            padding: 15,
                        },
                        colorAxis: {
                            min: 0,
                            max: maxValue[position],
                            minColor: '#F1A882',
                            maxColor: '#E35205',
                            labels: {
                                style: {
                                    color: "#999999",
                                    fontWeight: "bold",
                                    textOverflow: 'none'
                                },
                                formatter: function () {
                                    if (this.value >= 1000000) {
                                        return this.value / 1000000 + 'M';
                                    } else if (this.value < 1000000 && this.value >= 1000) {
                                        return this.value / 1000 + 'k';
                                    } else {
                                        return this.value;
                                    }
                                }
                            },
                            width: '90%',
                        },
                        tooltip: {
                            formatter: function () {
                                var value = Math.ceil(this.point.value).toString();
                                var counter = 0;

                                for (var i = value.length - 1; i > 0; i--) {
                                    counter++;
                                    if (counter % 3 === 0) {
                                        value = value.slice(0, i) + "," + value.substring(i, value.length);
                                    }
                                }

                                return `<b>${this.point.NAME_1}</b><br/>${value}`;
                            },
                            backgroundColor: "#212121",
                            style: {
                                color: "white"
                            },
                        },
                        credits: {
                            enabled: false
                        }
                    }}
                >
                    <MapSeries
                        data={series[position]}
                        joinBy={['NAME_1', 0]}
                        keys={['NAME_1', 'value']}
                    />
                </MapsChart>
        </Card>
    )
}