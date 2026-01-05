import { Region } from './templates/region';

export const Compare = () => {
    return(
        <div className="bg-[#1E1E1E] w-full h-full flex justify-center pt-[152px]">
            <div className=" w-9/10 h-full dark flex flex-row gap-x-5 pt-18">
                <Region/>
                <Region/>
            </div>
        </div>
    )
}