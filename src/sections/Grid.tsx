import { useState } from 'react';

import { FlatMap } from './templates/FlatMap';
import { GlobeMap } from './templates/GlobeMap';

type GridProps = {
    currentDimension: string,
};

export const Grid = ({currentDimension}: GridProps) => {

    const [flatPosition, setFlatPosition] = useState({});
    const [globePosition, setGlobePosition] = useState({});

    return(
        <div className='h-full pt-[152px]'>
            {currentDimension == "2D" 
            ?
             <FlatMap globePosition={globePosition} setFlatPosition={setFlatPosition}/>
             :
             <GlobeMap flatPosition={flatPosition} setGlobePosition={setGlobePosition}/>
        }
        </div>
        // <GlobeMap/>
    )
}