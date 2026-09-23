import { AppStateContext, AppActionsContext } from "@/app"
import { useContext } from "react"
import { Link } from '@tanstack/react-router'

export default function () {
    const state = useContext(AppStateContext);
    const actions = useContext(AppActionsContext);
    return (
            <div>
                {state?.dataExplainerOpen
                    ?
                    <div className="absolute z-10 bottom-0 w-full h-full bg-[#00000095] flex items-center justify-center">
                        <div className="h-full w-full md:h-8/10 md:w-8/10 max-w-300 bg-white md:rounded-sm flex flex-col overflow-hidden">
                            <div className="bg-(--fundblue) h-38 w-full flex flex-col ">
                                <div className="w-full">
                                    <div className="w-96/100 flex justify-end">
                                        <div className='text-white font-bold pt-5 cursor-pointer' onClick={() => actions?.setDataExplainerState(false)}>CLOSE</div>
                                    </div>
                                </div>
                                <div className='w-full flex justify-end'>
                                    <div className='w-9/10'>
                                        <div className="w-full flex justify-start">
                                            <div className="w-96/100 flex">
                                                <div className='text-white font-bold text-2xl'>Data Explainer</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-x-2 overflow-x-auto">
                                            <div className='flex flex-col w-50'>
                                                <div className="text-xs text-white pt-3 pb-2 tracking-widest font-semibold">REALTIME</div>
                                                <div className={`h-10 w-50 font-bold ${state?.dataExplainerView == "Event Tracking" ? "text-(--primaryblue-100) bg-white" : "text-black bg-(--primarygray-40)"} rounded-t-md flex items-center justify-center cursor-pointer`} onClick={() => actions?.setDataExplainerView("Event Tracking")}>EVENT TRACKING</div>
                                            </div>
                                            <div className='flex flex-col w-100'>
                                                <div className="text-xs text-white pt-3 pb-2 tracking-widest font-semibold">FORWARD LOOKING</div>
                                                <div className='flex flex-row gap-x-1'>
                                                    <div className={`h-10 w-50 font-bold ${state?.dataExplainerView == "Grid" ? "text-(--primaryblue-100) bg-white" : "text-black bg-(--primarygray-40)"} rounded-t-md flex items-center justify-center cursor-pointer`} onClick={() => actions?.setDataExplainerView("Grid")}>GRID</div>
                                                    <div className={`h-10 w-50 font-bold ${state?.dataExplainerView == "Compare" ? "text-(--primaryblue-100) bg-white" : "text-black bg-(--primarygray-40)"} rounded-t-md flex items-center justify-center cursor-pointer`} onClick={() => actions?.setDataExplainerView("Compare")}>COMPARE</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full justify-center overflow-y-scroll my-5'>
                                <div id="dataExplainer" className='flex flex-col lg:flex-row bg-white mt-12 w-9/10 max-h-291 gap-x-9 justify-start'>
                                    {state?.dataExplainerView == "Event Tracking" ?
                                        <div>
                                            <div className='flex flex-col gap-y-5 text-left'>
                                                <section className='font-bold'>Navigating the Real-Time Event Tracking Page</section>
                                                <p>
                                                    The <b>Real-Time</b> view in GeoPulse provides continuous monitoring of natural hazard events as they unfold around the world.
                                                    The interactive maps identify affected locations, understand the scale of potential impacts, and explore exposure across key
                                                    economic and infrastructure indicators.
                                                </p>

                                                <div className='flex flex-col gap-y-5 text-left'>
                                                    <section className='font-bold'>Explore Current and Historical Events</section>

                                                    <p>
                                                        The Real-Time page displays a global map of recent and ongoing events together with relevant exposure layers.
                                                        Users can explore events by selecting event markers directly on the map or by viewing event details in the panel
                                                        on the right side of the screen.
                                                    </p>

                                                    <p>
                                                        The right-side panel provides additional information about the selected event, including:
                                                    </p>

                                                    <ul className='list-disc pl-5'>
                                                        <li>Event name and status</li>
                                                        <li>Timeline and duration</li>
                                                        <li>Event severity metrics</li>
                                                        <li>Affected countries or regions</li>
                                                        <li>Estimated exposure and risk indicators</li>
                                                        <li>Links to download supporting data and explore methodology</li>
                                                    </ul>
                                                </div>

                                                <section className='font-bold'>Refine Your Search</section>
                                                <p>
                                                    The controls in the top navigation bar allow users to focus the analysis on events of interest.
                                                </p>
                                                <p>You can narrow or expand the events displayed by:</p>
                                                <ul className='list-disc pl-5'>
                                                    <li>
                                                        <b>Selecting a time frame</b> (for example, the last three months, last six months, last year, or a custom date range)
                                                    </li>
                                                    <li><b>Choosing a specific country</b></li>
                                                    <li><b>Filtering by event type</b> to focus on particular hazards</li>
                                                </ul>

                                                <section className='font-bold'>Understand Exposure Layers</section>
                                                <p>
                                                    On the left side of the map, users can select from a series of <b>exposure layers</b>. These layers represent key economic,
                                                    demographic, and infrastructure assets that may be affected by natural hazards.
                                                </p>
                                                <p>Exposure layers help answer questions such as:</p>
                                                <ul className='list-disc pl-5'>
                                                    <li>How many people may be affected by an event?</li>
                                                    <li>Which sectoral areas are most vulnerable to economic losses?</li>
                                                </ul>

                                                <p>
                                                    By turning layers on and off, users can visualize where hazards intersect with important assets and better understand
                                                    the geographic distribution of potential impacts.
                                                </p>

                                                <p>
                                                    <Link to="/datamethodology"><b>Read More</b></Link> for additional information on the methodology and data sources behind this analysis.
                                                </p>
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                    {state?.dataExplainerView == "Compare" ?
                                        <div>
                                            <div className='flex flex-col gap-y-5 pb-5 text-left'>
                                                <section className='font-bold'>Navigating the Compare View</section>

                                                <p>
                                                    The <b>Compare</b> view illustrates how climate-related hazards and exposures may evolve under different future climate scenarios.
                                                    Designed for benchmarking and strategic planning, this view enables side-by-side comparisons of countries or subnational
                                                    regions, helping users identify areas that may face higher levels of exposure under future climate conditions.
                                                </p>

                                                <section className='font-bold'>Compare Countries or Subnational Regions</section>

                                                <p>
                                                    The Compare view displays two maps side by side, making it easy to evaluate differences in exposure across locations.
                                                    You can:
                                                </p>

                                                <ul className='list-disc pl-5 space-y-1'>
                                                    <li>
                                                        Compare <b>two different countries</b> to understand how future climate risks vary across economies.
                                                    </li>
                                                    <li>
                                                        Compare <b>subnational regions within the same country</b> to identify areas that may face higher exposure levels.
                                                    </li>
                                                </ul>

                                                <section className='font-bold'>Select a Hazard and Exposure Indicator</section>

                                                <p>At the top of the page, users can choose:</p>

                                                <ul className='list-disc pl-5 space-y-1'>
                                                    <li>
                                                        A <b>hazard category</b> (such as coastal flooding, riverine flooding, heat stress, drought, or other available hazards).
                                                    </li>
                                                    <li>
                                                        An <b>exposure layer</b> (such as population, GDP, urban GDP, buildings).
                                                    </li>
                                                    <li>
                                                        A <b>climate scenario</b> (Orderly or Disorderly).
                                                    </li>
                                                    <li>
                                                        A <b>time horizon</b> for analysis.
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className='flex flex-col gap-y-5 text-left'>
                                                <section className='font-bold'>Choose a Climate Scenario</section>

                                                <p>
                                                    GeoPulse allows users to compare future outcomes under different climate pathways.
                                                </p>

                                                <p>
                                                    <b>Orderly Transition</b> An orderly transition assumes that climate mitigation measures are introduced early and steadily
                                                    over time. In climate science, this represents a lower-emissions pathway where governments, businesses, and societies
                                                    gradually reduce greenhouse gas emissions, limiting the extent of future warming and associated climate impacts.
                                                </p>

                                                <p>
                                                    <b>Disorderly Transition</b> A disorderly transition assumes delayed or uneven climate action. Under this pathway,
                                                    emissions remain higher for longer before stronger mitigation efforts occur later in the century. This results in
                                                    greater warming and generally higher levels of climate-related exposure and risk.
                                                </p>
                                                <div className='flex flex-col gap-y-5 text-left'>
                                                    <section className='font-bold'>Explore Future Time Horizons</section>

                                                    <p>
                                                        The time selector allows users to view projections across multiple planning horizons:
                                                    </p>
                                                    <table className='border'>
                                                        <tr className='border'>
                                                            <th className='border text-center bg-(--primarygray-10)'><b>Future Horizon</b></th>
                                                            <th className='border text-center bg-(--primarygray-10)'><b>Reference Year</b></th>
                                                        </tr>
                                                        <tr>
                                                            <td className='border'>Historical</td>
                                                            <td className='border'>1980-2014</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='border'>Early-Century</td>
                                                            <td className='border'>2030</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='border'>Mid-Century</td>
                                                            <td className='border'>2050</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='border'>End-Century</td>
                                                            <td className='border'>2100</td>
                                                        </tr>
                                                    </table>

                                                    <section className='font-bold'>[Add section about hazard sliders]</section>

                                                    <section className='font-bold'>Interpret the Maps</section>

                                                    <p>
                                                        The maps display exposure levels using a graduated color scale. Darker shades indicate higher levels of exposure relative
                                                        to the selected indicator and scenario.
                                                    </p>

                                                    <p>Users can:</p>

                                                    <ul className='list-disc pl-5 space-y-1'>
                                                        <li>Hover over regions to view detailed values.</li>
                                                        <li>Identify geographic hotspots.</li>
                                                        <li>Compare exposure patterns between locations.</li>
                                                        <li>Understand where future climate impacts may become more concentrated.</li>
                                                        <li>Download results for further analysis.</li>
                                                    </ul>

                                                    <p>
                                                        <Link to="/datamethodology"><b>Read More</b></Link> for additional information on the methodology and data sources behind this analysis.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                    {state?.dataExplainerView == "Grid" ?
                                        <div>
                                            <div className='flex flex-col gap-y-5 text-left'>
                                                <section className='font-bold'>Navigating the Grid View</section>

                                                <p>
                                                    The <b>Grid</b> view enables users to explore forward-looking climate risks at a highly granular spatial level.
                                                    Unlike the Compare view, which focuses on benchmarking locations side by side, the Grid view allows users
                                                    to examine how hazards and exposures intersect across the globe using detailed geospatial data.
                                                </p>

                                                <section className='font-bold'>Select a Hazard, Exposure, and Climate Scenario</section>

                                                <p>
                                                    Using the controls at the top of the page, you can customize the map by selecting:
                                                </p>

                                                <ul className='list-disc pl-5 space-y-1'>
                                                    <li>
                                                        A <b>hazard category</b> (such as coastal flooding, riverine flooding, heat stress, drought, or other available hazards).
                                                    </li>
                                                    <li>
                                                        An <b>exposure layer</b> (such as population, GDP, urban GDP, buildings).
                                                    </li>
                                                    <li>
                                                        A <b>climate scenario</b> (Orderly or Disorderly).
                                                    </li>
                                                    <li>
                                                        A <b>time horizon</b> for analysis.
                                                    </li>
                                                </ul>

                                                <section className='font-bold'>Choose a Climate Scenario</section>

                                                <p>
                                                    GeoPulse allows users to compare future risks under different climate pathways.
                                                </p>

                                                <p>
                                                    <b>Orderly Transition</b> An orderly transition assumes that emissions reductions and climate policies are implemented
                                                    gradually and early. This pathway generally results in lower levels of warming and more moderate future climate impacts.
                                                </p>

                                                <p>
                                                    <b>Disorderly Transition</b> A disorderly transition assumes delayed or uneven climate action, leading to higher
                                                    greenhouse gas concentrations and greater warming before mitigation efforts take effect. This pathway generally
                                                    produces larger increases in climate-related hazards and exposures.
                                                </p>
                                            </div>

                                            <div className='flex flex-col gap-y-5 text-left'>
                                                <section className='font-bold'>Explore Future Time Horizons</section>

                                                <p>
                                                    The time selector enables users to evaluate exposure across multiple planning horizons.
                                                </p>
                                                <table className='border'>
                                                    <tr className='border'>
                                                        <th className='border text-center bg-(--primarygray-10)'><b>Future Horizon</b></th>
                                                        <th className='border text-center bg-(--primarygray-10)'><b>Reference Year</b></th>
                                                    </tr>
                                                    <tr>
                                                        <td className='border'>Historical</td>
                                                        <td className='border'>1980-2014</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border'>Early-Century</td>
                                                        <td className='border'>2030</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border'>Mid-Century</td>
                                                        <td className='border'>2050</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border'>End-Century</td>
                                                        <td className='border'>2100</td>
                                                    </tr>
                                                </table>

                                                <section className='font-bold'>Understanding the Bivariate Legend</section>

                                                <p>
                                                    The legend combines two variables into a single visualization. Rather than displaying only hazard intensity or only exposure,
                                                    the map simultaneously shows both dimensions so users can quickly identify where high hazards overlap with high concentrations
                                                    of exposed assets.
                                                </p>

                                                <p>In the example shown:</p>

                                                <ul className='list-disc pl-5 space-y-1'>
                                                    <li>The <b>vertical axis</b> represents <b>Population Exposure</b> (low to high).</li>
                                                    <li>The <b>horizontal axis</b> represents <b>Flood Height</b> (low to high).</li>
                                                    <li>
                                                        Each grid cell on the map is colored based on the combination of these two variables.
                                                    </li>
                                                </ul>

                                                <p>The legend can be interpreted as follows:</p>

                                                <table className='border'>
                                                    <tr className='border'>
                                                        <th className='border text-center bg-(--primarygray-10)'><b>Legend Category</b></th>
                                                        <th className='border text-center bg-(--primarygray-10)'><b>Meaning</b></th>
                                                    </tr>
                                                    <tr>
                                                        <td className='border'>Low Hazard + Low Exposure</td>
                                                        <td className='border'>Areas where flood levels and exposed populations are both relatively low.</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border'>High Hazard + Low Exposure</td>
                                                        <td className='border'>Areas with severe flooding but relatively few people exposed.</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border'>Low Hazard + High Exposure</td>
                                                        <td className='border'>Areas with large populations but relatively lower flood intensity.</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border'>High Hazard + High Exposure</td>
                                                        <td className='border'>Areas where severe flooding coincides with large exposed populations,
                                                            representing potential risk hotspots.</td>
                                                    </tr>
                                                </table>
                                                <p>
                                                    The color gradient helps users distinguish between these combinations at a glance. Areas that appear in the most
                                                    intense colors represent locations where both hazard levels and exposure levels are relatively high, making them
                                                    important areas for further analysis and resilience planning.
                                                </p>

                                                <p>
                                                    <Link to="/datamethodology"><b>Read More</b></Link> for additional information on the methodology and data sources behind this analysis.
                                                </p>
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    null}
            </div>
        )
}
  