import { useState } from 'react';

import { FlatMap } from './templates/FlatMap';
import { GlobeMap } from './templates/GlobeMap';

type GridProps = {
    currentDimension: string,
    currentTime: {time: string, url: string}
};

export const Grid = ({currentDimension, currentTime}: GridProps) => {

    const [flatPosition, setFlatPosition] = useState({});
    const [globePosition, setGlobePosition] = useState({});

    return(
        <div className='h-full pt-[152px]'>
            {currentDimension == "2D" 
            ?
             <FlatMap globePosition={globePosition} currentTime={currentTime} setFlatPosition={setFlatPosition}/>
             :
             <GlobeMap flatPosition={flatPosition} currentTime={currentTime} setGlobePosition={setGlobePosition}/>
        }
        </div>
        // <GlobeMap/>
    )
}