import React from "react"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

type ContainerProps = {
    title: string,
    element: React.ReactElement,
    headerState: boolean
}

export const Container = ({title, element, headerState}: ContainerProps) => {
    return (
        <Item variant='outline' className={`${headerState == false ? 'h-80' : 'h-24'} shadow-sm`}>
            <ItemContent className='h-full'>
                <ItemTitle className='pb-1'>
                    <div className='font-extrabold'>{title}</div>
                </ItemTitle>
                {element}
            </ItemContent>
        </Item>
    )
}