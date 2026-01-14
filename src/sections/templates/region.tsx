import React, { useEffect } from 'react';
import { ComboBox } from './sub/comboBox';
import { type RegionSeries } from '../../App';

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
    Subtitle,
    YAxis,
    XAxis,
    Legend,
    Credits,
    Highcharts
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
    setMaxValue,
    // regionExposure,
    // setRegionExposure,
    areaSeries,
    setAreaSeries,
    currentExposure,
    setExposure,
    currentHazard,
    setHazard
}: Filters) => {

    var exposure: ExposureShape = [];
    var gadm0exposure: RegionSeries = [];

    Highcharts.setOptions({
    chart: {
        backgroundColor: 'transparent',
        plotBackgroundColor: 'transparent',
            style: {
              color: '#ffffff',
              fontFamily: 'Arial'
            },
    }
});

    useEffect(() => {
            applyFilter();
    }, [exposureState, currentTime, currentScenario]);

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
                Reference_area: string,
                wExposed: number,
                period: number,
                scenario: string,
                Admin_Filter: string,
                [key: string]: string | number;
            }
        }>
    }>;

    async function test(countryData: CountryData) {

        var isoFix = "ISO3";
        var adminFix = "ADMIN_FILTER";
        var gadm0Fix = "adm0";
        var gadm1Fix = "adm1";

        if (currentHazard === "Riverine Flooding" && currentExposure === "Population") {
            isoFix = "country_abr";
            var adminFix = "Admin_Filter";
            var gadm0Fix = "gadm0";
            var gadm1Fix = "gadm1";
        }

        const whereClause = `${adminFix} IN ('${gadm0Fix}', '${gadm1Fix}') AND ${isoFix} IN ('${countryData.iso3}')`;
        var queryString = `where=${encodeURIComponent(whereClause)}`;
        
        const urlObject = [
            { hazard: "Riverine Flooding", exposure: "Population", 
                url: `https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Floods_riverine_people_all/FeatureServer/0/query?${queryString}`,
                outFields: 'Admin_Filter,wExposed,NAME_1,country_abr,period,scenario'
            },
            { hazard: "Draught", exposure: "Cropland", 
                url: `https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/draught_cropland_table/FeatureServer/0/query?${queryString}`,
                outFields: 'ADMIN_FILTER,MEASURE,REF_AREA_NAME,ISO3,TIME_PERIOD,CLIMATE_SCENARIO'
            },
            { hazard: "Temperature Extremes", exposure: "Population",
                url: `https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/temperature_population_table/FeatureServer/0/query?${queryString}`,
                outFields: 'ADMIN_FILTER,MEASURE,REF_AREA_NAME,ISO3,TIME_PERIOD,CLIMATE_SCENARIO'
                },
            { hazard: "Temperature Extremes", exposure: "Livestock", 
                url: `https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/temperature_livestock_table/FeatureServer/0/query?${queryString}`, 
                outFields: 'ADMIN_FILTER,MEASURE,REF_AREA_NAME,ISO3,TIME_PERIOD,CLIMATE_SCENARIO'
            }
        ];

        let url = "";
        let outFields = "";

        urlObject.forEach((item) => {
            if (item.hazard === currentHazard && item.exposure === currentExposure) {
                url = item.url;
                outFields = item.outFields;
            }
        });

        console.log(queryString);
        console.log(url);

        const parameters = new URLSearchParams({
            returnIdsOnly: 'true',
            cacheHint: 'true',
            f: 'json'
        });

        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: parameters
        });
        var x = await result.json();
        console.log(x);
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
                outFields: outFields,
                f: 'json',
                maxRecordCountFactor: '5'
            });

            fetch(url, {
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
    var tempGadm0 = [{data: [0,0,0,0], name: "Orderly trajectory"}, {data: [0,0,0,0], name: "Disorderly trajectory"}];
    var lineChartOrder = [
        {period: 1980, position: 0},
        {period: 2030, position: 1},
        {period: 2050, position: 2},
        {period: 2080, position: 3}
    ];
    var scenarioModel = [
        {scenario: 'rcp4p5', name: 'Orderly trajectory'},
        {scenario: 'rcp8p5', name: 'Disorderly trajectory'},
        {scenario: 'SSP126', name: 'Orderly trajectory'},
        {scenario: 'SSP245', name: 'Disorderly trajectory'},
        {scenario: 'SSP370', name: 'Hot House'},  
    ];

    const sumWeightedExposure = async (tableData: TableArray) => {
        tempMaxValue = 0;
        console.log(tableData);

        // loop through tableData
        tableData.forEach((parent) => {
            // loop through each feature property
            parent.features.forEach((entry) => {
                // find attributes keys
                var a = Object.keys(entry.attributes);
                    // execute code if gadm1 is found
                    if (entry.attributes[a[0]] === "gadm1" || entry.attributes[a[0]] === "adm1") {
                        // update tempMaxValue for colorAxis range
                        if (entry.attributes[a[1]] as number > tempMaxValue) {
                            tempMaxValue = entry.attributes[a[1]] as number;
                        }
                        var b = false;
                        if (exposure.length > 0) {
                            // loop through exposure array
                            exposure.forEach((exposureElement) => {
                                // if exposure measure value equals entry measure value, add value
                                if (exposureElement[0] === entry.attributes[a[2]]
                                    && exposureElement[2] === entry.attributes[a[4]]
                                    && exposureElement[3] === entry.attributes[a[5]]
                                ) {
                                    exposureElement[1] += entry.attributes[a[1]] as number;
                                    b = true;
                                }
                            })
                        }
                        // push entry array values into exposure array, if entry doesn't already exist
                        if (b === false) {
                            exposure.push([
                                entry.attributes[a[2]] as string,
                                entry.attributes[a[1]] as number,
                                entry.attributes[a[4]] as number,
                                entry.attributes[a[5]] as string
                            ])
                        }
                    // filter down to gadm1 values
                    } else if (entry.attributes[a[0]] === "gadm0" || entry.attributes[a[0]] === "adm0") {
                        // loop through scenario model
                        scenarioModel.forEach((item) => {
                            // reference matching scenario from scenarioModel object
                            if (item.scenario === entry.attributes[a[5]]) {
                                // loop through temporary gadm0 array
                                tempGadm0.forEach((element) => {
                                    // reference matching name from temporary gadm0 array
                                    if (element.name === item.name) {
                                        // loop through lineChartOrder object
                                        lineChartOrder.forEach((index) => {
                                            // reference matching period from lineChartOrder object
                                            if (index.period === entry.attributes[a[4]]) {
                                                // add values to temporary gadm0 array
                                                element.data[index.position] += entry.attributes[a[1]] as number;
                                            }
                                        })
                                    }
                                })
                            }
                        });
                }
            })

            
        })

 
     

        console.log(exposure);

        //replace exposure scenario values with the names that would be visualized
        exposure.forEach((element) => {
            switch (element[3]) {
                case "SSP126":
                    element.splice(3, 1, 'rcp4p5');
                    break;
                case "SSP245":
                    element.splice(3, 1, 'rcp8p5');
                    break;
                case "SSP370":
                    element.splice(3, 1, 'Hot House');
                    break;
            }
        });
         
        console.log(tempGadm0);
        console.log(exposure);
        console.log(tempMaxValue);

        const updateAreaValues = (position: number) => {
            setAreaSeries(prev => {
                const next = [...prev];
                next[position] = tempGadm0;
                return next;
            });
                console.log(areaSeries);
        }
        updateAreaValues(position);

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
                        console.log(next);
                next[position] = exposure;
                console.log(next);
                console.log(exposure);
                return next;
            })
        }
        updateExposureValues(position);
    }

    function applyFilter() {
        console.log(exposureState);
        console.log(series);

        const updateSeriesValues = (position: number) => {
            setSeries(prev => {
                const next = [...prev];
                next[position] = exposureState[position].filter((value) => (value[2] === currentTime.time)).filter((value) => (value[3] === currentScenario));
                console.log(next);
                return next;
            })
       }
        updateSeriesValues(position);
    }

    return (
        <Card className="bg-[#1E1E1E] w-full h-9/10 overflow-y-auto overflow-x-hidden dark flex items-center shadow-md">
            <ComboBox loadGeoJson={loadGeoJson} country={country} position={position}/>
            <div className='flex flex-col '>
                <MapsChart
                    options={{
                        chart: {
                            map: country[position],
                            backgroundColor: '#1E1E1E',
                            animation: false,
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
                        },
                        plotOptions: {
                            series: {
                                point: {
                                    events: {
                                        click: function () {
                                            var tempGadm1 = 
                                                [
                                                    { data: [0, 0, 0, 0], name: "Orderly trajectory" },
                                                    { data: [0, 0, 0, 0], name: "Disorderly trajectory" }
                                                ];
                                            exposureState[position].forEach((element) => {
                                                if (this.NAME_1 === element[0]) {
                                                   lineChartOrder.forEach((index) => {
                                                       if (element[2] === index.period) {
                                                            scenarioModel.forEach((item) => {
                                                                if (element[3] === item.scenario) {
                                                                    tempGadm1.forEach((i) => {
                                                                        if (item.name === i.name) {
                                                                            i.data[index.position] += element[1]
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                       }
                                                   })
                                                }
                                            })
                                            // console.log(exposureState[position]);
                                            console.log(tempGadm1);
                                            const loadSubnationalArea = (position: number) => {
                                                setAreaSeries(prev => {
                                                    const next = [...prev];
                                                    next[position] = tempGadm1;
                                                    return next;
                                                });
                                                console.log(areaSeries);
                                            }
                                            loadSubnationalArea(position);
                                        }
                                    }
                                }
                            }
                        }
                    }}
                >
                    <MapSeries
                        data={series[position]}
                        joinBy={['NAME_1', 0]}
                        keys={['NAME_1', 'value']}
                    />
                </MapsChart>
                <Chart
                    options={{
                        legend: {
                            itemStyle: {
                                color: '#ffffff',
                                fontWeight: "700",
                            },
                            itemHoverStyle: {
                                fontWeight: "900",
                                color: '#ffffff'
                            },
                            align: 'left',
                            verticalAlign: 'top',
                            x: 100,
                            y: -15,
                            floating: true,
                            layout: 'vertical',
                            symbolWidth: 1,
                            symbolPadding: 15,
                            itemMarginBottom: 3,
                        },
                        tooltip: {
                            backgroundColor: "#212121",
                            style: {
                                color: "white"
                            },
                            valueDecimals: 0,
                        },
                        colors: [
                            { 
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [[0, '#FF9500'], [1, '#FF950000']]
                            },
                            { 
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [[0, '#0098FF'], [1, '#0098FF00']]
                            }
                        ],
                        series: [
             
                        ],
                        plotOptions: {
                            series: {
                                lineWidth: 3.5,
                            },
                            area: {
                                marker: {
                                    lineWidth: 2,
                                    lineColor: 'white',
                                },
                                
                            }
                        }
                    }}
                >
                    <Credits enabled={false}/>
                    <XAxis 
                        categories={["1980", "2030", "2050", "2080"]}
                        tickmarkPlacement={'on'}
                        lineWidth={1}
                        lineColor={'#555555'}
                        startOnTick={false}
                        labels={{
                            style: {
                                color: '#ffffff',
                                fontSize: '14px'
                            }
                        }}
                    />
                    <YAxis
                        title={{ text: "" }}
                        lineWidth={1}
                        gridLineWidth={0}
                        tickWidth={1}
                        tickPosition={'inside'}
                        tickLength={5}
                        lineColor={'#555555'}
                        tickColor={'#555555'}
                        labels={{
                            reserveSpace: true,
                            style: {
                                color: '#ffffff',
                                fontSize: '14px'
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
                        }}
                    />

                    {country[position].name === "string" ? null : areaSeries.map((i, index) =>
                        <Series
                            type="area"
                            name={areaSeries[position][index].name}
                            data={areaSeries[position][index].data}
                            marker={{
                                radius: 6,
                                lineWidth: 2,
                                lineColor: 'white',
                            }}
                        />
                    )}
                </Chart>
            </div> 
        </Card>
    )
}