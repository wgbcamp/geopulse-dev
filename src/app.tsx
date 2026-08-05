// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { RouterProvider, createRouter, createHashHistory } from '@tanstack/react-router'
import {
    createContext, useContext, useState, useMemo, useEffect,
    type Dispatch, type SetStateAction, type ReactNode,
} from 'react'
import { type DateRange } from "react-day-picker"

const hashHistory = createHashHistory();

// Create a new router instance
const router = createRouter({
    routeTree,
    history: hashHistory
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

type Measure = { name: string; id: string }
type Threshold = { name: string; threshold: any }

type AppState = {
  currentView: string
  currentTime: number
  currentScenario: string
  currentHazard: string
  currentExposure: string
  currentMeasure: Measure
  currentThreshold: Threshold
  dateRange: DateRange
  eventFilter: string
  countryFilter: string
  countryCoordinates: { longitude: number, latitude: number }
}

type AppActions = {
  setView: Dispatch<SetStateAction<string>>
  setTime: Dispatch<SetStateAction<number>>
  setScenario: Dispatch<SetStateAction<string>>
  setHazard: Dispatch<SetStateAction<string>>
  setExposure: Dispatch<SetStateAction<string>>
  setMeasure: Dispatch<SetStateAction<Measure>>
  setThreshold: Dispatch<SetStateAction<Threshold>>
  setDateRange: Dispatch<SetStateAction<DateRange>>
  setEventFilter: Dispatch<SetStateAction<string>>
  setCountryFilter: Dispatch<SetStateAction<string>>
  setCountryCoordinates: Dispatch<SetStateAction<{ longitude: number, latitude: number }>>
}

 const today = new Date;


export const AppStateContext = createContext<AppState>({
  currentView: "Event tracking",
  currentTime: 1980,
  currentScenario: "rcp4p5",
  currentHazard: "Coastal Flooding",
  currentExposure: "Population",
  currentMeasure: { name: "Flood Level", id: "CF_PW_EXP" },
  currentThreshold: { name: "", threshold: "rp0005" },
  dateRange: {
    from: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()),
    to: (new Date)
  },
  eventFilter: "AL",
  countryFilter: "AND",
  countryCoordinates: { longitude: 42.55108741, latitude: 1.57672606 }

})
export const AppActionsContext = createContext<AppActions | null>(null)

export function App() {

  const [currentView, setView] = useState("Event tracking")
  const [currentTime, setTime] = useState<number>(1980)
  const [currentScenario, setScenario] = useState<string>("rcp4p5")
  const [currentHazard, setHazard] = useState<string>("Coastal Flooding")
  const [currentExposure, setExposure] = useState<string>("Population")
  const [currentMeasure, setMeasure] = useState<Measure>({ name: "Flood Level", id: "CF_PW_EXP" })
  const [currentThreshold, setThreshold] = useState<Threshold>({ name: "", threshold: "rp0005" })
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()),
    to: (new Date)
  });
  const [eventFilter, setEventFilter] = useState<string>("AL");
  const [countryFilter, setCountryFilter] = useState<string>("All countries");
  const [countryCoordinates, setCountryCoordinates] = useState<{ longitude: number, latitude: number }>({ longitude: 42.55108741, latitude: 1.57672606 });

  const state = useMemo<AppState>(() => ({
    currentView, currentTime, currentScenario, currentHazard,
    currentExposure, currentMeasure, currentThreshold, dateRange,
    eventFilter, countryFilter, countryCoordinates
  }), [currentView, currentTime, currentScenario, currentHazard,
       currentExposure, currentMeasure, currentThreshold, dateRange, eventFilter, countryFilter, countryCoordinates])

  const actions = useMemo<AppActions>(() => ({
    setView, setTime, setScenario, setHazard, setExposure, setMeasure, setThreshold,
    setDateRange, setEventFilter, setCountryFilter, setCountryCoordinates
  }), [])


  return (
    <>
      <AppActionsContext.Provider value={actions}>
        <AppStateContext.Provider value={state}>
          <RouterProvider router={router} />
        </AppStateContext.Provider>
      </AppActionsContext.Provider>
    </>
  )
}