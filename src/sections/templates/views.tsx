import React from "react";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

import { type View } from '../header'

export type ViewProps = {
    list: View,
    headerState: boolean,
    currentView: string,
    hovering: string,
    setView: React.Dispatch<React.SetStateAction<string>>;
    setHovering: React.Dispatch<React.SetStateAction<string>>;
};

export const Views = ({list, headerState, currentView, hovering, setView, setHovering}: ViewProps) => {
    return (
          <ItemGroup className='mx-2 my-0 gap-2 flex flex-col'>
            {
            list.map((i) =>
              headerState == false || (headerState == true && currentView == i.a) 
              ?
              <Item variant={currentView == i.a ? 'muted' : hovering == i.a ? "outline" : "default"} className='w-35 gap-y-0 p-1 items-start cursor-pointer' key={i.a} onClick={() => setView(i.a)} onMouseEnter={() => setHovering(i.a)} onMouseLeave={() => setHovering("")}>
                <ItemHeader className='font-semibold'>
                  {i.a}
                </ItemHeader>
                <ItemContent>
                  {headerState == false 
                  ?
                  <ItemDescription className='text-left'>
                    {i.b}
                  </ItemDescription>
                  :
                  null
                  }
                </ItemContent>
              </Item>
              : 
              null           
            )}
          </ItemGroup>
    )
  }