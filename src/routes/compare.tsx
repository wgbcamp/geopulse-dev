import { useContext, useState, useCallback, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { AppStateContext } from '../app';

import { Region } from "../components/region"
import { Thresholds } from "../components/thresholds"

import { comparisonNote } from "../config/datasets"

export const Route = createFileRoute('/compare')({
  component: CompareView,
})

function CompareView() {

    const [polygons, setPolygons] = useState<any>(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE}/GADM_ADMIN1.json`)
            .then((res) => res.json())
            .then((jsonRes) => setPolygons(jsonRes));
    }, []);

    // Each panel reports its current data max; both panels then share the joint max as their y-scale.
    const [maxes, setMaxes] = useState<Record<string, number>>({});
    const handleDataMax = useCallback((id: string, max: number) => {
        setMaxes((prev) => (prev[id] === max ? prev : { ...prev, [id]: max }));
    }, []);
    const values = Object.values(maxes);
    const sharedYMax = values.length ? Math.max(...values) : 0;

    return (
        <div className="bg-[#1E1E1E] w-full flex flex-col items-center pb-15" >
                <div className="w-9/10 dark flex flex-col lg:flex-row gap-5 pt-32">
                    <Region
                        regionId="A"
                        defaultIso3={"CHN"}
                        topojson={polygons}
                        sharedYMax={sharedYMax}
                        onDataMax={handleDataMax}
                    />
                    <Region
                        regionId="B"
                        defaultIso3={"BGD"}
                        topojson={polygons}
                        sharedYMax={sharedYMax}
                        onDataMax={handleDataMax}
                    />
                </div>
            <Thresholds />
            <CompareNote />
        </div>
    )
}

function CompareNote() {
    const state = useContext(AppStateContext);
    const notes = comparisonNote(
        state.currentHazard,
        state.currentExposure,
        state.currentMeasure.id,
        state.currentThreshold.threshold
    );

    if (!notes.length) return null;

    return (
        <div className="w-9/10 dark pt-10 text-left text-[#999999] text-[13px]">
            <div className="font-bold mb-1">Note:</div>
            <ol className="list-decimal list-inside flex flex-col gap-1">
                {notes.map((note, i) => (
                    <li key={i}>{note}</li>
                ))}
            </ol>
        </div>
    );
}
