import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { GlobeIcon } from '../assets/GlobeIcon'
import { ArrowRight } from '../assets/arrow-right'
import { ChevronRight } from '../assets/chevron-right'
import { TopoBackground } from '../components/TopoBackground'
import globeExtrusions from '../assets/globeExtrusions high.webp'
import trackPreview from '../assets/trackPreview.png'
import seePreview from '../assets/anticipatePreview.jpg'
import estimatePreview from '../assets/estimatePreview.jpg'
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

// Hero type scales with screen *height* at xl (the way earthgenome.org sizes its hero), so the whole
// first screen — headline, subtitle and cards — fits any laptop from ~630px to ~1020px of height.
// Below xl it keeps fixed sizes, since phones and tablets scroll the hero rather than fit it.
// The title's slope is steeper than a plain svh value (≈45px at 630 tall, ≈70px at 860, ≈87px at
// 1020) so short screens give up the most size while 13"–16" laptops barely change.
const heroTitle = 'font-bold text-[60px] xl:text-[clamp(40px,calc(10.9svh_-_24px),88px)] leading-none tracking-[-1.816px]'
const heroSubtitle = 'tracking-[-1.089px] text-[16px] md:text-[29px] xl:text-[clamp(17px,2.8svh,28px)]'

const categoryDetails: Record<string, { title: ReactElement, subtitle?: ReactElement }> = {
    "Overview": {
        "title": <span className={heroTitle}>Monitor, Anticipate & Explore Economic Risk</span>,
        "subtitle": <span className={heroSubtitle}><b>GeoPulse</b> is an IMF platform that maps the exposure of economies to physical hazards at 1 km resolution — quantifying realized and potential risk to people, GDP, capital and land.</span>
    },
    "Monitor": {
        "title": <span className={heroTitle}>Monitor Economic Exposure to Disasters</span>,
        "subtitle": <span className={heroSubtitle}>Track ongoing <b>natural disasters in real time</b> and assess exposure of populations, GDP, capital stock, and critical infrastructure. Explore past events through interactive maps and downloadable indicators.</span>
    },
    "Anticipate": {
        "title": <span className={heroTitle}>Anticipate Future Hazard Exposure</span>,
        "subtitle": <span className={heroSubtitle}>Explore <b>forward-looking hazard–exposure indicators</b> across different scenarios through year 2100, using interactive maps or national and subnational comparisons.</span>
    },
    "Explore": {
        "title": <span className={heroTitle}>IMF Gridded Macroeconomic Layers</span>,
        // scoped to the two IMF-produced layers (GDP and capital stock); population and land cover are
        // exposure layers GeoPulse consumes, not IMF products, so they are deliberately not claimed here
        "subtitle": <span className={heroSubtitle}>Access the <b>gridded macroeconomic statistics</b> behind GeoPulse: new layers for GDP and capital stock, built on 1 km spatial disaggregation of official macroeconomic data.</span>
    },
}

// the hero rests on this entry; the cards below cycle through the rest while the user is idle
const mainCategory = "Overview"
// Tuned for pace over full readability: a card window carries the headline and the gist of its
// subtitle (~32 words in 6s is well above a comprehension read), on the assumption that anyone who
// wants the whole thing hovers, which pauses the rotation. Note the 700ms fade eats into the front
// of every window, so the legible time is shorter than the interval.
const idleMs = 8500     // Overview: most copy of the four, and the resting state, so it holds longest
const rotationMs = 6000 // each card, kept identical so the rotation does not feel erratic

// `category` keys the hero copy in categoryDetails; `title`/`misc` are all the card shows.
// `link` must stay in step with the matching entry in overviewCategories below — the card and the
// section band are two routes into the same component, so they should not disagree.
const cardDetails: { category: string, title: string, link: string, misc: ReactElement }[] = [
    {
        category: "Monitor",
        title: "Event Tracking",
        link: '/events',
        misc: <span className='flex items-center gap-2 text-(--accentred-100)'>
            {/* pulsing live dot — dot size is w-[7px]/h-[7px], halo follows it via inset-0 */}
            <span className='relative flex w-[7px] h-[7px]'>
                <span className='absolute inset-0 rounded-full bg-current opacity-70 motion-safe:animate-ping' />
                <span className='relative inline-flex w-[7px] h-[7px] rounded-full bg-current' />
            </span>
            LIVE
        </span>
    },
    {
        category: "Anticipate",
        title: "Forward-Looking Risks",
        link: '/compare',
        misc: <span>THROUGH 2100</span>
    },
    {
        category: "Explore",
        title: "Data Foundation",
        link: '/datamethodology',
        misc: <span>1KM GEOSPATIAL GRIDS</span>
    }
];

// the carousel walks the cards in order, then returns to the main entry
const cycleCategories = cardDetails.map(card => card.category)

export const mapButton = (background: string, foreground: string, icon1: ReactElement, icon2: ReactElement, link: string) =>
    <Link to={link} activeOptions={{ exact: true }} className={`${background} ${foreground} rounded-[100px] h-15 flex items-center justify-center py-5 px-10 gap-2 cursor-pointer`}>
        {icon1}
        <span className="font-bold text-[18px]">Explore the Map</span>
        {icon2}
    </Link>;

const externalButton = (background: string, foreground: string, label: string, icon: ReactElement, href: string) =>
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${background} ${foreground} rounded-[100px] h-15 flex items-center justify-center py-5 px-10 gap-2 cursor-pointer`}>
        <span className="font-bold text-[18px]">{label}</span>
        {icon}
    </a>;

const overviewCategories: { title: string, description: ReactElement, picture: string, order: string, link: string }[] = [
    {
        title: "Event Tracking",
        description: <div className='max-w-90 flex flex-col gap-5'><span>Monitor disaster events as they unfold on an interactive global map, or revisit past events.</span>
            <span>Overlay event footprints with exposure layers to see where hazards intersect with populations, GDP, capital stock, agriculture, and critical infrastructure.</span>
            <span>Open an event’s detail card to explore its timeline, severity, and detailed exposure metrics by country, with access to supporting data.</span></div>,
        picture: trackPreview,
        order: "normal",
        link: '/events'
    },
    {
        title: "Forward-Looking Risks",
        description: <div className='max-w-90 flex flex-col gap-5'><span>Explore how hazards and exposure may evolve across different scenarios and time horizons, with projections extending through 2100.</span>
            <span>Compare countries and subnational regions side by side using interactive maps and charts. Download data and maps to support economic analysis, inform policy decisions, and guide adaptation investments.</span></div>,
        picture: seePreview,
        order: "reverse",
        link: '/compare'
    },
    {
        title: "Data Foundation",
        description: <div className='max-w-90 flex flex-col gap-5'><span>Access the gridded macroeconomic statistics behind GeoPulse. The new IMF layers bring GDP and capital stock to a 1 km grid through Fine-Scale Spatial Disaggregation of Macroeconomic Data.</span>
            <span>Part of the IMF’s innovative agenda for geospatially enabled macroeconomic statistics, these layers connect national economic measures to local geographies. Download the data to assess economic exposure to hazards and support research and policy analysis.</span></div>,
        picture: estimatePreview,
        order: "normal",
        link: '/datamethodology'
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
    const [activeCategory, setActiveCategory] = useState<string>(mainCategory)
    const [hovering, setHovering] = useState(false)

    // While the pointer is on a card the user is driving; otherwise the hero rests on the main
    // entry, and after idleMs walks the cards once before settling back on it.
    useEffect(() => {
        if (hovering || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        let step = 0
        let timer: ReturnType<typeof setTimeout>

        const advance = () => {
            const atEndOfCycle = step >= cycleCategories.length
            setActiveCategory(atEndOfCycle ? mainCategory : cycleCategories[step])
            step = atEndOfCycle ? 0 : step + 1
            timer = setTimeout(advance, atEndOfCycle ? idleMs : rotationMs)
        }

        timer = setTimeout(advance, idleMs)
        return () => clearTimeout(timer)
    }, [hovering])

    // highlight: true only while a card owns the hero, so the resting state dims nothing
    const highlighting = cycleCategories.includes(activeCategory)

    {/* `relative isolate` bounds the contour background to this page and keeps it behind every
        section; sections with their own image or colour (cars, footer…) simply cover it. */}
    return <div className='relative isolate bg-white'>
        <TopoBackground />
        {/* At xl the hero is exactly one screen tall with its text + cards centered as one group, as on
            earthgenome.org. xl:pt-28 clears the fixed header (its bottom edge sits ~106px down on /home);
            the globe is absolute, so it stays out of the flow being centered. */}
        <div className='relative overflow-hidden pt-30 pb-16 flex flex-col justify-start items-center xl:min-h-svh xl:pt-28 xl:pb-10 xl:justify-center xl:items-start w-full'>
            <div className='flex justify-center xl:justify-normal xl:pl-15 max-w-200'>
                <div className='w-9/10 xl:w-5/10 grid text-black xl:text-left z-1'>
                    {Object.entries(categoryDetails).map(([key, details]) =>
                        <div
                            key={key}
                            aria-hidden={key !== activeCategory}
                            className={`col-start-1 row-start-1 flex flex-col gap-3 xl:gap-5 transition-opacity duration-700 ease-in-out
                                ${/* gap: the title sets leading-none, so title and subtitle otherwise touch */ ''}
                                ${key === activeCategory ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            {details.title}
                            {details.subtitle}
                        </div>
                    )}
                </div>
            </div>
            {/* At xl the globe is sized by screen height, like earthgenome's calc(100svh - 10rem) globe, so it
                keeps the same composition on every laptop instead of a fixed 2040px crop. The image is
                4070x3036 with the sphere filling ~81% of its height and ending ~21% short of its right
                edge — the right offset parks the sphere's edge just inside the viewport and lets the
                extrusions bleed off. */}
            <img className='absolute top-90 w-300 max-w-none xl:top-1/2 xl:-translate-y-1/2 xl:h-[105svh] xl:w-auto xl:right-[calc(2rem-30svh)]' src={globeExtrusions}></img>
            <div
                className="relative grid md:grid-cols-2 xl:grid-cols-3 justify-center w-fit gap-5 z-1 md:mt-90 xl:mt-[clamp(1.5rem,5svh,3.5rem)] xl:pl-15"
                onMouseLeave={() => {
                    setHovering(false)
                    setActiveCategory(mainCategory)
                }}
            >
                {cardDetails.map((e, i) =>
                    <Link
                        key={i}
                        to={e.link}
                        activeOptions={{ exact: true }}
                        className={`group relative overflow-hidden flex w-70 min-h-32 rounded-[6px] shadow-[0_8px_16px_0_rgba(0,0,0,0.14)] bg-white p-5 flex-col justify-between items-start cursor-pointer
                            ${/* highlight: dim the cards that are not active — delete this line to remove */ ''}
                            transition-opacity duration-500 ${!highlighting || e.category === activeCategory ? 'opacity-100' : 'opacity-60'}`}
                        onMouseEnter={() => {
                            setHovering(true)
                            setActiveCategory(e.category)
                        }}
                    >
                        {/* --- highlight: countdown bar showing how long this card holds the hero.
                            Delete this block (and the `relative overflow-hidden` above) to remove. --- */}
                        {e.category === activeCategory && !hovering &&
                            <span
                                key={activeCategory}
                                className='absolute inset-x-0 top-0 h-1 origin-left bg-(--accentblue-100)'
                                style={{ animation: `cardCountdown ${rotationMs}ms linear forwards` }}
                            />
                        }
                        {/* --- end countdown bar --- */}
                        <div className='flex flex-col w-full justify-between h-full'>
                            <div className='w-full flex justify-end'>
                                <div className={`font-bold transition-colors duration-700 ${e.category == activeCategory ? 'text-(--accentblue-100)' : 'text-black'}`}>{e.misc}</div>
                            </div>
                            {/* Title + arrow. The arrow closes the diagonal with the badge and marks the card as navigable. */}
                            <div className={`w-full flex items-center justify-between gap-3 transition-colors duration-700 ${e.category == activeCategory ? 'text-(--accentblue-100)' : 'text-black'}`}>
                                <span className='text-left uppercase font-bold leading-[110%] tracking-[-0.2px] text-[18px]'>{e.title}</span>
                                {/* filled disc: bg-current picks up the row's active colour, so the circle
                                    and the title change together; the chevron stays knocked out in white */}
                                <div className='w-11 h-11 shrink-0 rounded-full bg-current flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1'>
                                    <ChevronRight color={'white'} />
                                </div>
                            </div>
                        </div>
                    </Link>
                )}
            </div>
        </div>
        <div className='w-full flex flex-col items-center'>
            {overviewCategories.map((e, i) =>
                <div className={`w-full md:max-w-500 flex items-center ${e.order == "normal" ? 'flex-col md:flex-row' : 'flex-col md:flex-row-reverse'} pt-10 md:pt-0`}>
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
        <div className='w-full bg-cover py-25 flex flex-col xl:flex-row bg-position-[50%] bg-no-repeat items-center'>
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
            className='w-full bg-cover py-16 flex flex-col items-center'
            style={{
                backgroundImage: `url(${carsBackground})`,
            }}
        >
            <div className='leading-[100%] tracking-[-0.34px] font-bold text-[60px] w-9/10 text-white pb-7.5'>
                Advancing Global Data Standards
            </div>
            <span className='leading-[140%] text-[20px] text-center text-white w-9/10 max-w-220 pb-10'>The G20 Data Gaps Initiative (DGI‑3) sets out 14 recommendations across four statistical areas. GeoPulse addresses <b>Recommendation 5 — climate physical and transition risks</b> — bringing IMF‑generated indicators into a consistent, accessible format for surveillance and policy analysis.</span>
            {externalButton('bg-white', 'text-(--accentdarkblue-90)', 'About the Data Gaps Initiative', <ArrowRight color={'var(--accentdarkblue-90)'} />, 'https://www.imf.org/en/news/seminars/conferences/g20-data-gaps-initiative')}
        </div>
        <div className='w-full flex justify-center items-center py-25 bg-(--accentdarkblue-100)'>
            <div className='flex flex-col items-center gap-9.25'>
                <img src={IMFLogo}></img>
                <span className='text-white font-bold leading-[140%]'>© 2026 INTERNATIONAL MONETARY FUND. ALL RIGHTS RESERVED | <u>Privacy Policy</u> | <u>Copyright & Usage</u></span>
            </div>
        </div>
    </div>
}
