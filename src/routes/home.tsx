import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { GlobeIcon } from '../assets/GlobeIcon'
import { ArrowRight } from '../assets/arrow-right'
import MenuBackground from '../assets/hero-bg.jpg'
import LightBackground from '../assets/light-bg.jpg'
import globeExtrusions from '../assets/globeExtrusions.png'
import overviewPreview from '../assets/overviewPreview.png'
import trackPreview from '../assets/trackPreview.png'
import seePreview from '../assets/tile-02.jpg'
import estimatePreview from '../assets/estimatePreview.jpg'
import griddedEconomics from '../assets/griddedEconomicsBackground.jpg'
import griddedCapitalStock from '../assets/Gridded_Capital_Stock.png'
import griddedGDP from '../assets/Gridded_GDP.png'
import exportable from '../assets/exportable.svg'
import downloadable from '../assets/downloadable.svg'
import transparentMethodology from '../assets/transparentMethodology.svg'
import harmonizedIndicators from '../assets/harmonizedIndicators.svg'
import whiteGeo from '../assets/white-geo.jpg'
import carsBackground from '../assets/cars-bg.jpg'
import IMFLogo from '../assets/IMF-logo 1.png'
import type { ReactElement } from 'react'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
})

const categoryDetails: Record<string, { title: ReactElement, subtitle: ReactElement }> = {
    "Overview": {
        "title": <span className='font-bold text-[60px] xl:text-[100px] leading-none tracking-[-1.816px]'>Track, See & Estimate Economic Risk</span>,
        "subtitle": <span className='tracking-[-1.089px] text-[16px] md:text-[29px]'><b>Real-time monitoring</b> of floods, hurricanes, wildfires and geopolitical events — and exactly what they put in harm's way.</span>
    },
    "Track": {
        "title": <span className='font-bold text-[60px] xl:text-[100px] leading-none tracking-[-1.816px]'>Track Economic Risk</span>,
        "subtitle": <span className='tracking-[-1.089px] text-[16px] md:text-[29px]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
    },
    "See": {
        "title": <span className='font-bold text-[60px] xl:text-[100px] leading-none tracking-[-1.816px]'>See Forward-Looking Risk</span>,
        "subtitle": <span className='tracking-[-1.089px] text-[16px] md:text-[29px]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
    },
    "Estimate": {
        "title": <span className='font-bold text-[60px] xl:text-[100px] leading-none tracking-[-1.816px]'>Estimate Gridded Economies</span>,
        "subtitle": <span className='tracking-[-1.089px] text-[16px] md:text-[29px]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
    },
}

const cardDetails: { title: string, description: string, misc: ReactElement, number: string }[] = [
    {
        title: "Overview",
        description: "What GeoPulse Does",
        misc: <span>GLOBAL</span>,
        number: "01"
    },
    {
        title: "Track",
        description: "",
        misc: <li className='text-(--accentred-100)'>LIVE</li>,
        number: "02"
    },
    {
        title: "See",
        description: "",
        misc: <span>2100</span>,
        number: "03"
    },
    {
        title: "Estimate",
        description: "",
        misc: <span>1Km</span>,
        number: "04"
    }
];

export const mapButton = (background: string, foreground: string, icon1: ReactElement, icon2: ReactElement, link: string) =>
    <Link to={link} activeOptions={{ exact: true }} className={`${background} ${foreground} rounded-[100px] h-15 flex items-center justify-center py-5 px-10 gap-2 cursor-pointer`}>
        {icon1}
        <span className="font-bold text-[18px]">Explore the Map</span>
        {icon2}
    </Link>;

const overviewCategories: { title: string, description: ReactElement, picture: string, order: string, link: string }[] = [
    {
        title: "Track",
        description: <div className='max-w-90 flex flex-col gap-5'><span><b>Mauris eget ante ex.</b> Sed non elit tincidunt, vehicula sem vel, ullamcorper elit. Nullam aliquet nisl nulla, in sollicitudin augue placerat at.</span>
            <span>Sed non elit tincidunt, vehicula sem vel, ullamcorper elit. Nullam aliquet nisl nulla, in sollicitudin augue placerat at.</span></div>,
        picture: trackPreview,
        order: "normal",
        link: '/events'
    },
    {
        title: "See",
        description: <div className='max-w-90 flex flex-col gap-5'><span><b>Mauris eget ante ex.</b> Sed non elit tincidunt, vehicula sem vel, ullamcorper elit. Nullam aliquet nisl nulla, in sollicitudin augue placerat at.</span>
            <span>Sed non elit tincidunt, vehicula sem vel, ullamcorper elit. Nullam aliquet nisl nulla, in sollicitudin augue placerat at.</span></div>,
        picture: seePreview,
        order: "reverse",
        link: '/grid'
    },
    {
        title: "Estimate",
        description: <div className='max-w-90 flex flex-col gap-5'><span><b>Mauris eget ante ex.</b> Sed non elit tincidunt, vehicula sem vel, ullamcorper elit. Nullam aliquet nisl nulla, in sollicitudin augue placerat at.</span>
            <span>Sed non elit tincidunt, vehicula sem vel, ullamcorper elit. Nullam aliquet nisl nulla, in sollicitudin augue placerat at.</span></div>,
        picture: estimatePreview,
        order: "normal",
        link: '/compare'
    }
];

const griddedCategories: { title: string, subtitle: string, description: string, picture: string }[] = [
    {
        title: "gridded capital stock",
        subtitle: "Physical Capital, Mapped To The Ground",
        description: "Capital stock resolved to the same 1 km grid — the buildings, plant and infrastructure a hazard puts directly at risk, quantified the moment it's threatened.",
        picture: griddedCapitalStock
    },
    {
        title: "gridded gdp",
        subtitle: "Economic Output, By The Kilometer",
        description: "National GDP disaggregated to a 1 km grid, so you can see exactly how much output sits inside a flood plain, a wildfire perimeter, or a hurricane track.",
        picture: griddedGDP
    }
];

const featureCategories: { icon: string, title: string, subtitle: string, position: number }[] = [
    {
        icon: exportable,
        title: "Exportable Charts",
        subtitle: "Communicate findings fast and pull publication-ready charts straight from any view.",
        position: 0
    },
    {
        icon: downloadable,
        title: "Downloadable Datasets",
        subtitle: "Take severity metrics, affected economies and disaster footprints with you.",
        position: 2
    },
    {
        icon: transparentMethodology,
        title: "Transparent Methodology",
        subtitle: "Documented data sources and methods support correct interpretation and citation.",
        position: 1
    },
    {
        icon: harmonizedIndicators,
        title: "Harmonized Indicators",
        subtitle: "Globally consistent indicators for surveillance, financing and policy analysis.",
        position: 3
    }
]

function RouteComponent() {
    const [activeCategory, setActiveCategory] = useState<string>("Overview")

    return <div className=''>
        <div className='h-full relative overflow-hidden pt-30 pb-16 flex flex-col justify-start items-center xl:justify-normal xl:items-start w-full bg-fixed bg-cover' style={{ backgroundImage: `url(${MenuBackground})`, backgroundPositionY: "bottom 10px"}}>
            <div className='flex justify-center xl:justify-normal xl:pt-20 xl:pl-15 max-w-200'>
                <div className='w-9/10 xl:w-5/10 grid text-white xl:text-left z-1'>
                    {Object.entries(categoryDetails).map(([key, details]) =>
                        <div
                            key={key}
                            className={`col-start-1 row-start-1 flex flex-col ${key === activeCategory ? '' : 'invisible'}`}
                        >
                            {details.title}
                            {details.subtitle}
                        </div>
                    )}
                </div>
            </div>
            <img className='absolute top-90 xl:-top-4 xl:left-150 w-300 xl:w-510 max-w-none' src={globeExtrusions}></img>
            <div className="relative grid md:grid-cols-2 xl:grid-cols-4 justify-center xl:w-full max-w-320 gap-5 z-1 md:mt-90 xl:mt-40 xl:pl-15">
                {cardDetails.map((e, i) =>
                    <div
                        key={i}
                        className='flex w-70 h-32 rounded-[6px] shadow-[0_8px_16px_0_rgba(0,0,0,0.14)] bg-white p-5 flex-col justify-between items-start'
                        onMouseEnter={() => setActiveCategory(e.title)}
                    >
                        <div className='flex flex-col w-full justify-between h-full'>
                            <div className='w-full flex justify-between'>
                                <span className={`font-bold ${e.title == activeCategory ? 'text-(--accentblue-100)' : 'text-black'}`}>{e.number}</span>
                                <ul className={`font-bold list-disc ${e.title == activeCategory ? 'text-(--accentblue-100)' : 'text-black'}`}>{e.misc}</ul>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <span className={`h-full text-left font-bold leading-[94%] tracking-[-0.34px] text-[24px] text-(--accentblue-100) ${e.title == activeCategory ? 'text-(--accentblue-100)' : 'text-black'}`}>{e.title}</span>
                                <span className='text-left leading-[94%] tracking-[-0.34px] text-[17px]'>{e.description}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <div
            className='w-full flex flex-col items-center gap-y-5 pt-25 pb-25 bg-cover bg-[linear-gradient(180deg,rgba(44,52,115,0)_0%,rgba(44,52,115,0.3)_100%),var(--menu-bg-image)]'
            style={{ '--menu-bg-image': `url(${LightBackground})` } as React.CSSProperties}
        >
            <span className='text-[60px] font-bold leading-[100%] tracking-[-0.34px]'>Overview</span>
            <span className='w-9/10 max-w-200 text-center text-[20px] font-bold leading-[140%]'>Mauris eget ante ex. Sed non elit tincidunt, vehicula sem vel, ullamcorper elit. Nullam aliquet nisl nulla, in sollicitudin augue placerat at. Nunc euismod sagittis iaculis. Etiam pretium ex vitae neque sagittis varius.</span>
            <img src={overviewPreview}></img>
            {mapButton('bg-(--accentdarkblue-90)', 'text-white', <GlobeIcon color={'var(--primarywhite)'}/>, <ArrowRight color={'var(--primarywhite)'}/>, '/events')}
        </div>
        <div className='w-full flex flex-col items-center bg-white'>
            {overviewCategories.map((e, i) =>
                <div className={`w-full md:max-w-500 flex items-center ${e.order == "normal" ? 'flex-col md:flex-row' : 'flex-col md:flex-row-reverse'} pt-10 md:pt-0 bg-white`}>
                    <div className='w-9/10 md:w-5/10 flex flex-col text-left items-center justify-center'>
                        <div className='lg:w-5/10 flex flex-col gap-y-5 justify-start items-start'>
                            <div className='max-w-90 font-bold text-[80px] tracking-[-1.2px] leading-[100%]'>{e.title}</div>
                            {e.description}
                            {mapButton('bg-(--accentdarkblue-90)', 'text-white', <GlobeIcon color={'var(--primarywhite)'}/>, <ArrowRight color={'var(--primarywhite)'}/>, e.link)}
                        </div>
                    </div>
                    <img className='pt-10 md:pt-0 md:w-5/10' src={e.picture}></img>
                </div>
            )}
        </div>
        <div className='w-full bg-cover bg-center py-25 flex flex-col items-center' style={{ backgroundImage: `url(${griddedEconomics})` }}>
            <div className="w-9/10 flex flex-col gap-20">
            <div className='w-9/10 flex flex-col gap-y-3'>
                <div className='font-bold leading-[100%] text-white text-left text-[70px] md:text-[80px] tracking-[-1.2px]'>Gridded Economics</div>
                <div className='text-white text-left text-[20px] leading-[142%] max-w-300'>GeoPulse pairs hazard and exposure layers with new <b>IMF-generated gridded economics</b> — harmonized globally at an unprecedented 1km resolution, far beyond macroeconomic statistics, down to the local level where impacts are felt.</div>
            </div>
            <div className='flex flex-col lg:flex-row gap-7.5'>
                {griddedCategories.map((e, i) =>
                    <div className='flex flex-col md:flex-row items-center md:items-stretch p-10 rounded-[6px] border-[0.5px] border-[#A7A7A7] bg-white gap-5'>
                        <div className="flex w-full md:w-5/10">
                            <div className="flex flex-col gap-4">
                                <span className='uppercase font-bold text-[14px] text-left leading-[100%] text-(--accentlightgreen-100)'>{e.title}</span>
                                <span className='font-bold text-[24px] leading-[120%] text-left'>{e.subtitle}</span>
                                <span className='text-[16px] leading-[130%] text-left max-w-105'>{e.description}</span>
                                <div className="flex gap-2">
                                    <span className='uppercase font-bold leading-[126%] text-[14px]'>Explore</span>
                                    <div className='w-3'><ArrowRight color={'var(--primaryblack-100)'}/></div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className='w-full md:w-5/10 flex items-center justify-start'>
                            <div className='relative flex items-center'>
                                <img src={e.picture} className=''></img>
                                {/* <div className='absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(45,52,116,0)_0%,rgba(45,52,116,0.8)_100%)]'></div> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
        <div className='w-full bg-cover py-25 flex flex-col xl:flex-row bg-position-[50%] bg-no-repeat items-center' style={{ backgroundImage: `url(${whiteGeo})` }}>
            <div className='flex w-full justify-center'>
                <span className='w-9/10 tracking-[-1.2px] leading-[100%] font-bold text-[50px] md:text-[80px] max-w-250'>Built to be Used, Cited & Trusted</span>
            </div>
            <div className='flex w-full justify-center items-center'>
                    <div className='grid grid-cols-1 grid-rows-1 md:grid-cols-2 gap-10 md:gap-10 py-10 w-9/10'>
                        <div className='grid grid-cols-1 grid-rows-2 gap-10 h-140'>
                            {featureCategories.filter((i) => i.position < 2).map((e, i) =>
                                <div className={`flex p-10 flex-col items-start gap-4 rounded-[6px] border-[0.5px] bg-white shadow-[0_10px_14px_0_rgba(0,0,0,0.12)] text-left`}>
                                    <img src={e.icon}></img>
                                    <span className='text-[24px] font-bold leading-[120%]'>{e.title}</span>
                                    <span className='text-[16px] leading-[140%]'>{e.subtitle}</span>
                                </div>
                            )}
                        </div>
                        <div className='grid grid-cols-1 grid-rows-2 gap-10 md:mt-20 h-140'>
                            {featureCategories.filter((i) => i.position > 1).map((e, i) =>
                                <div className={`flex p-10 flex-col items-start gap-4 rounded-[6px] border-[0.5px] bg-white shadow-[0_10px_14px_0_rgba(0,0,0,0.12)] text-left`}>
                                    <img src={e.icon}></img>
                                    <span className='text-[24px] font-bold leading-[120%]'>{e.title}</span>
                                    <span className='text-[16px] leading-[140%]'>{e.subtitle}</span>
                                </div>
                            )}
                        </div>
                    </div>
            </div>
        </div>
        <div
            className='w-full bg-cover py-25 flex flex-col items-center'
            style={{
                backgroundImage: `url(${carsBackground})`,
            }}
        >
            <div className='leading-[100%] tracking-[-0.34px] font-bold text-[60px] w-9/10 text-white pb-7.5'>
                Advancing Global Data Standards
            </div>
            <span className='leading-[140%] text-[20px] text-center text-white w-9/10 max-w-220 pb-12'>Designed and sponsored within the IMF on secure cloud infrastructure, GeoPulse fills priority data gaps identified by the G20 Data Gaps Initiative — bringing IMF‑generated risk indicators into a consistent, accessible format for surveillance and policy analysis.</span>
            <div className='relative'>
                <img src={overviewPreview}></img>
                <div className='absolute inset-0 top-28 w-full flex justify-center'>
                    <div className='w-69'>
                        {mapButton('bg-white', 'text-(--accentdarkblue-90)', <GlobeIcon color={'var(--accentdarkblue-90)'} />, <ArrowRight color={'var(--accentdarkblue-90)'} />, '/events')}
                    </div>
                </div>
                {/* <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(45,52,116,0)_0%,rgba(45,52,116,0.8)_100%)]'></div> */}
            </div>
        </div>
        <div className='w-full flex justify-center items-center py-25 bg-(--accentdarkblue-100)'>
            <div className='flex flex-col items-center gap-9.25'>
                <img src={IMFLogo}></img>
                <span className='text-white font-bold leading-[140%]'>© 2026 INTERNATIONAL MONETARY FUND. ALL RIGHTS RESERVED | <u>Privacy Policy</u> | <u>Copyright & Usage</u></span>
            </div>
        </div>
    </div>
}
