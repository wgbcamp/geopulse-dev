import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SquareMenuIcon } from '../../components/icons/lucide-square-menu';

import { type Menu } from '../header';

type NavigationProps = {
    menu: Menu
};

export const Navigation = ({ menu }: NavigationProps) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className='flex gap-x-2 items-center'>
          <SquareMenuIcon />
          
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {menu.map((i) =>
            <DropdownMenuItem key={i.a}>
              {i.b}
              {i.a}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

