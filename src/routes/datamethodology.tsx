import { createFileRoute } from '@tanstack/react-router'

import { AppActionsContext } from '@/app';

import MenuBackground from '../assets/image 18.png'
import { Button } from "@/components/ui/button"
import GriddedCapitalStock from "../assets/Gridded_Capital_Stock.png"
import GriddedGDP from "../assets/Gridded_GDP.png"
import Events from "../assets/events_thumbnail.png"
import HazardTemperatureExtremes from "../assets/hazardTemperatureExtreme.svg"
import { useContext } from 'react';

export const Route = createFileRoute('/datamethodology')({
  component: RouteComponent,
})

function RouteComponent() {
    const actions = useContext(AppActionsContext);
    actions?.setView("DataMethodology");
    const hub = (slug: string) => `https://geopulse-data-imf-dataviz.hub.arcgis.com/datasets/imf-dataviz::${slug}/explore`
    const linkCls = 'w-fit underline underline-offset-2 text-[#9ec5ff] hover:text-white'
    return <div className={`absolute flex justify-center overflow-auto w-full bg-[#1a2868] bg-fixed transition-all `} style={{ backgroundImage: `linear-gradient(90deg, rgba(26,40,104,0.95) 0%, rgba(26,40,104,0.95) 52%, rgba(26,40,104,0.74) 100%), url(${MenuBackground})`, backgroundSize: 'cover' }}>
        <div className="flex py-15 flex-col items-center lg:items-start max-w-350 w-9/10 text-left text-white">
            <section className='pt-14.75 text-[34px] leading-tight tracking-[-0.01em] w-full max-w-250 font-bold'>Access the data that powers GeoPulse</section>
            <div className='flex flex-col gap-y-7 w-full max-w-250'>
                <div className='flex flex-col gap-x-20 gap-y-5 leading-[21px] pt-10'>
                    <p className='text-[18px]'>GeoPulse maps where people and assets meet climate and disaster risks. Three families of open data sit behind it: the IMF’s own high-resolution gridded macroeconomic layers, near-real-time disaster events, and forward-looking climate exposure indicators. Explore them in the app, download them, or pull them live through the API. Sources, methods, and citations for each are below.</p>

                    <span className='text-[24px]'><strong>Imagery layers </strong><span className='text-white/60'>(raster files 30 arc-second)</span></span>
                </div>
                <div className='flex flex-col lg:flex-row gap-y-15'>
                    <div className='w-full'>
                        <div className="w-full flex flex-col gap-y-7 text-[16px]">
                            <div className='flex flex-col gap-y-6'>
                                <p>The IMF-produced exposure layers GeoPulse is built on: global rasters on a 30 arc-second (~1 km) grid showing where economic output is generated and where physical capital sits. Pair them with a hazard layer to see what’s in harm’s way or use them directly in your own GIS.</p>
                                <p>Only these IMF-generated layers (Gridded GDP and Gridded Capital Stock) are available to download here. The other exposure layers GeoPulse draws on (population, cropland, livestock, buildings) are produced by third parties; please obtain those from their original sources, listed in the relevant indicators’ methodology descriptions. Imagery layers are provided as direct GeoTIFF downloads and are not available through the API.</p>
                            </div>
                            <div className='flex flex-wrap xl:flex-nowrap flex-row gap-x-15 gap-y-15'>
                                <div className='flex flex-col gap-y-4 items-center justify-start xl:w-5/10'>
                                    <strong>Gridded Capital Stock</strong>
                                    <img width={150} src={GriddedCapitalStock}></img>
                                    <div className='flex flex-col gap-y-4'>
                                        <span>A ~1 km global estimate of the value of buildings and built assets, from the IMF, showing where physical capital is concentrated.</span>
                                        <div className='flex flex-col'>
                                            <strong>Papers:&nbsp;</strong>
                                            <span><i>[Add relevant papers(s) here.]</i></span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <strong>Citation:&nbsp;</strong>
                                            <span><i>Gridded Physical Capital Stock (forthcoming). International Monetary Fund. Accessed [date]. </i></span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <strong>Data:&nbsp;</strong>
                                            <span><i>Global raster, 30 arc-second (~1 km at the equator), WGS84 (EPSG:4326). Download the .zip file with the total physical capital stock and individual files for residential vs. non-residential.</i></span>
                                        </div>
                                        <Button className='h-7 bg-(--accentblue-60) text-white rounded-md hover:bg-(--accentblue-60) hover:opacity-90 cursor-pointer'>Download GeoTIFF</Button>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-y-4 items-center xl:w-5/10'>
                                    <strong>Gridded GDP</strong>
                                    <img width={150} src={GriddedGDP}></img>
                                    <div className='flex flex-col gap-y-4'>
                                        <span>A ~1 km global estimate of economic output from the IMF, aligned to IMF WEO totals. Available as total GDP or broken down into ten industries. Select a sector to explore its footprint.</span>
                                        <div className='flex flex-col'>
                                            <strong>Papers:&nbsp;</strong>
                                            <span><i>[Add relevant papers(s) here.]</i></span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <strong>Citation:&nbsp;</strong>
                                            <span><i>Gridded GDP by industry (forthcoming). International Monetary Fund. Accessed [date].</i></span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <strong>Data:&nbsp;</strong>
                                            <span>Global ~1 km rasters, WGS84, reconciled to WEO national totals. Download the .zip file with the total GDP and the ten industry layers <i>(Agriculture (AGR); Mining & Oil and Gas (MIN); Manufacturing (MAN); Construction (CON); Transportation & Warehousing (TRAN); Trade (TRAD); Finance, Insurance & Real Estate (FIN); Government & Public Administration (GOV); Public Services (PUB); Other Industries (OTH))</i> GeoTIFF files.</span>
                                        </div>
                                        <Button className=' h-7 bg-(--accentblue-60) text-white rounded-md hover:bg-(--accentblue-60) hover:opacity-90 cursor-pointer'>Download GeoTIFFs</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='flex flex-col gap-y-15'>
                    <div className='w-full border-t border-white/30'></div>
                    <div className='flex flex-col gap-y-5'>
                        <span className='text-[24px]'><strong>Events layer </strong><span className='text-white/60'>(polygons)</span></span>
                        <div className='flex flex-col  items-center xl:flex-row gap-6 xl:gap-14'>
                            <div className='flex justify-center xl:justify-start h-full shrink-0'>
                                <img src={Events} className='w-[150px] h-[150px] rounded-full object-cover shrink-0'></img>
                            </div>
                            <div className='w-full xl:w-7/10'>
                                <p>GeoPulse draws its disaster events from the <a className={linkCls} href="https://www.gdacs.org/" target="_blank" rel="noopener noreferrer">Global Disaster Alert and Coordination System (GDACS)</a>, a joint EC-JRC and UN OCHA service. For each event (earthquakes, tropical cyclones, floods, volcanic eruptions, droughts and more), GDACS publishes the affected-area polygons (earthquake shaking contours, cyclone wind-impact swaths, flood footprints, ash plumes), refreshed as new advisories arrive. We overlay these on our exposure layers inside each country’s borders to estimate the population, buildings, GDP, urban GDP and cropland (plus the airports and ports) caught within the affected area, updating the estimates as new advisories arrive and the disaster polygons are refined. The result is the per-event, per-country exposure shown on each Event Card.</p>
                            </div>
                        </div>

                    </div>

                    <div className='w-full'>
                        <div className="w-full flex flex-col gap-y-7 text-[16px]">
                            <div className='flex flex-wrap xl:flex-nowrap flex-row gap-x-15 gap-y-15'>
                                <div className='flex flex-col gap-y-4 w-full'>
                                    <div className='flex flex-col gap-y-4'>
                                        <div className='flex flex-col'>
                                            <strong>Papers:&nbsp;</strong>
                                            <span><i>[Add relevant papers(s) here.]</i></span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <strong>Citation:&nbsp;</strong>
                                            <span><i>Hazard polygons: GDACS (European Commission, EC-JRC / UN OCHA), CC BY 4.0. Exposure figures: GeoPulse Event Exposures, International Monetary Fund (2026), derived from GDACS. Accessed [date].</i></span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <strong>Data:&nbsp;</strong>
                                            <span><i>Per-event hazard polygons with attached exposure attributes (population, buildings, GDP, urban GDP, cropland, airports, ports) by country. Refreshed daily as new GDACS advisories arrive. Download event exposure tables or connect live through the ArcGIS REST API.</i></span>
                                        </div>
                                        <div className='flex flex-col xl:flex-row gap-3'>
                                            <Button className='h-7 bg-(--accentblue-60) text-white rounded-md hover:bg-(--accentblue-60) hover:opacity-90 cursor-pointer'>View Details and Download</Button>
                                            <Button className='h-7 bg-(--accentblue-60) text-white rounded-md hover:bg-(--accentblue-60) hover:opacity-90 cursor-pointer'>Access API</Button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='w-full border-t border-white/30'></div>
                    <div className='flex flex-col gap-y-7'>
                        <span className='text-[24px]'><strong>Forward-looking Hazard Exposure Indicators</strong></span>
                        <div className='w-full'>
                            <p>How today’s people and assets would be exposed to tomorrow’s climate hazards. Each indicator pairs a hazard with an exposure layer, and computes exposure at country (ADM0) and sub-national (ADM1) level. ADM1 units are the first-level sub-national regions within a country, such as states, provinces or départements.</p>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className="w-full flex flex-col gap-y-7 text-[16px]">
                            <div className='flex flex-wrap xl:flex-nowrap flex-row gap-x-15 gap-y-15'>
                                <div className='flex flex-col gap-y-4 w-full'>
                                    <div className='flex flex-col gap-y-4'>
                                        <div className='flex flex-col'>
                                            <strong>Papers:&nbsp;</strong>
                                            <span><i>[Add relevant papers(s) here.]</i></span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <strong>Citation:&nbsp;</strong>
                                            <span><i>GeoPulse Forward-looking Indicators, International Monetary Fund (2026). Accessed [date]. Cite alongside the underlying sources: temperature & drought: World Bank Climate Change Knowledge Portal (CMIP6 / WCRP modelling groups); flooding: WRI Aqueduct Floods v2; population: GHSL (GHS-POP); livestock: FAO GLW3; cropland: ESA CCI Land Cover; GDP: Murakami, Yoshida & Yamagata (2021). </i></span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <strong>Data:&nbsp;</strong>
                                            <span><i>Country (ADM0) and sub-national (ADM1) indicator tables, one row per administrative unit × hazard dimension × climate scenario × time period, as downloadable tables, with interactive choropleth maps and time series in the <a className={linkCls} href="/#/compare" target="_blank" rel="noopener noreferrer">Forward-Looking view</a>.</i></span>
                                        </div>
                                        <div className='flex flex-col gap-y-5'>
                                            <strong>Browse indicators by hazard:&nbsp;</strong>
                                            <div className='flex flex-col xl:flex-row gap-y-10'>
                                                <div className='flex flex-col w-full'>
                                                    <div className='flex w-50 gap-x-1'>
                                                        <img src={HazardTemperatureExtremes}></img>
                                                        <div>Temperature Extremes</div>
                                                    </div>
                                                    <div className='flex flex-col gap-y-1'>
                                                        <a className={linkCls} href={hub('population-weighted-mean-extreme-temperatures')} target="_blank" rel="noopener noreferrer">Population</a>
                                                        <a className={linkCls} href={hub('livestock-weighted-mean-extreme-temperatures')} target="_blank" rel="noopener noreferrer">Livestock</a>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col w-full'>
                                                    <div className='flex gap-x-1'>
                                                        <img src={HazardTemperatureExtremes}></img>
                                                        <div>Drought</div>
                                                    </div>
                                                    <div className='flex flex-col gap-y-1'>
                                                        <a className={linkCls} href={hub('cropland-weighted-mean-drought-conditions')} target="_blank" rel="noopener noreferrer">Cropland</a>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col w-full'>
                                                    <div className='flex gap-x-1'>
                                                        <img src={HazardTemperatureExtremes}></img>
                                                        <div>Riverine Flooding</div>
                                                    </div>
                                                    <div className='flex flex-col gap-y-1'>
                                                        <a className={linkCls} href={hub('percent-of-population-exposed-to-riverine-flooding')} target="_blank" rel="noopener noreferrer">Population</a>
                                                        <a className={linkCls} href={hub('percent-of-buildings-exposed-to-riverine-flooding')} target="_blank" rel="noopener noreferrer">Buildings</a>
                                                        <a className={linkCls} href={hub('percent-of-gdp-exposed-to-riverine-flooding')} target="_blank" rel="noopener noreferrer">GDP</a>
                                                        <a className={linkCls} href={hub('percent-of-urban-gdp-exposed-to-riverine-flooding')} target="_blank" rel="noopener noreferrer">Urban GDP</a>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col w-full'>
                                                    <div className='flex gap-x-1'>
                                                        <img src={HazardTemperatureExtremes}></img>
                                                        <div>Coastal Flooding</div>
                                                    </div>
                                                    <div className='flex flex-col gap-y-1'>
                                                        <a className={linkCls} href={hub('percent-of-population-exposed-to-coastal-flooding')} target="_blank" rel="noopener noreferrer">Population</a>
                                                        <a className={linkCls} href={hub('percent-of-buildings-exposed-to-coastal-flooding')} target="_blank" rel="noopener noreferrer">Buildings</a>
                                                        <a className={linkCls} href={hub('percent-of-gdp-exposed-to-coastal-flooding')} target="_blank" rel="noopener noreferrer">GDP</a>
                                                        <a className={linkCls} href={hub('percent-of-urban-gdp-exposed-to-coastal-flooding')} target="_blank" rel="noopener noreferrer">Urban GDP</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div><i>Each indicator opens its dataset page, where you can view detailed methodology, download the data, or access it through the ArcGIS REST API.</i></div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
               
            </div>
        </div>
}