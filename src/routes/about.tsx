import { createFileRoute } from '@tanstack/react-router'

import { AppActionsContext } from '@/app';

import MenuBackground from '../assets/image 18.png'
import { useContext } from 'react';

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {

    const actions = useContext(AppActionsContext);
    actions?.setView('About');

    return <div className={`h-full bg-[#1a2868] bg-fixed transition-all overflow-auto`} style={{ backgroundImage: `linear-gradient(90deg, rgba(26,40,104,0.95) 0%, rgba(26,40,104,0.95) 52%, rgba(26,40,104,0.74) 100%), url(${MenuBackground})`, backgroundSize: 'cover' }}>
        <div className={` flex justify-center`}>
            <div className='w-9/10 flex justify-center'>
                <div className="flex py-15 flex-col items-start gap-y-6 text-white">
                    <section className='pt-14.75 text-[22px] font-bold'>IMF GeoPulse: Track, Analyze, and Respond to Economic Risk</section>
                    <div className='flex flex-col gap-x-20 lg:flex-row leading-[21px] text-left'>
                        <div className='flex flex-col gap-y-5 max-w-[75ch]'>
                            <p>IMF GeoPulse is a geospatial platform that monitors physical risks to the economy, people, and our environment. The frequency and severity of damages from natural disasters such as floods, hurricanes, and wildfires have been increasing over time resulting in billions of dollars damage to economies and loss of human lives. As impacts often ripple through economies, including the financial systems, public finances, and trade, the first-order effects of most of these risks are highly localized.
                            </p>
                            <p>GeoPulse provides high-resolution geospatial data on hazards, exposures, and risks to help economies prepare for, respond to, and recover from natural disasters. It is state-of-the-art platform translating complex and big geospatial data into actionable insights for policy analysis, financing, and resilience planning now and for the future.
                            </p>
                            <p>Designed to map the exposure of economies to physical hazards, GeoPulse enables users to quantify both potential and realized risks on people, GDP, physical capital, agriculture, critical infrastructures, and other key sectors of the economy.
                            </p>
                            <p>By delivering globally harmonized data at an unprecedented level of spatial granularity down to one kilometer grid resolution, the platform provides critical and timely information far beyond macroeconomic statistics down to the local level where risks materialize and impacts are felt.
                            </p>
                            <div>
                                <section className='font-bold text-[16px]'>Real-Time Insights</section>
                                <p>The real‑time feature of GeoPulse provides continuous monitoring of looming and ongoing natural disasters, through an interactive global map interface. It enables users to assess the immediate risks and quantify the scale and nature of impacts on population, buildings, capital stock, GDP, agriculture and critical infrastructure such as airports and maritime ports as events unfold in affected regions.
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-y-5 max-w-[75ch]'>
                            <p>Further, it supports retrospective analysis, providing users with detailed data on past disaster events and their impacts. Users can toggle through panels to view and download severity metrics, affected economies, and disaster footprints.
                            </p>
                            <div>
                                <section className='font-bold text-[16px]'>Forward-Looking Analysis</section>
                                <p>Beyond monitoring today’s risks and shocks, GeoPulse enables users to explore tomorrow’s risks. The platform provides forward‑looking indicators under multiple climate scenarios—with projections extending through 2100—so policymakers can visualize how exposure trajectories change under different warming pathways and plan adaptation investments accordingly.
                                </p>
                            </div>
                            <div>
                                <section className='font-bold text-[16px]'>Explore the two forward-looking views:</section>
                                <p>Grid: Investigate hazard–exposure indicators on 2D and 3D interactive maps, with color‑coded intensities and legends to support local decision‑making.
                                    Compare: Benchmark exposure and risk across countries or subnational regions using harmonized indicators, aiding resource allocation and international cooperation.
                                </p>
                            </div>
                            <div>
                                <section className='font-bold text-[16px]'>From Insight to Action</section>
                                <p>GeoPulse supports exportable charts and downloadable datasets, helping users communicate findings, inform disaster risk financing, and embed results in reports to authorities or funders. Methodology and data‑source documentation are available to promote transparency and correct interpretation.
                                </p>
                            </div>
                            <p>
                                <div>An IMF Initiative Advancing Global Data Standards </div>
                                GeoPulse helps fill priority data gaps identified by the G20 Data Gaps Initiative, bringing IMF‑generated risk indicators into a consistent, accessible format for surveillance and policy analysis. The platform is designed and sponsored within the IMF, leveraging secure cloud infrastructure and geospatial services to deliver scalable, high‑quality analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </div>
}