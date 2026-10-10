import * as React from "react";
import { useNavigate } from '@tanstack/react-router'

import "@/config/isoCountries";

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { isoCountries, countryByIso3 } from "@/config/isoCountries";

type ComboBoxProps = {
  iso3: string;
  setIso3: React.Dispatch<React.SetStateAction<string>>;
  regionId: string;
};

export const ComboBox = ({ iso3, setIso3, regionId }: ComboBoxProps) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  let queryParameter: any;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between dark"
        >
          {countryByIso3[iso3]}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 dark">
        <Command>
          <CommandInput placeholder="Search country..." className="h-9" />
          <CommandList>
            <CommandEmpty>Country not found.</CommandEmpty>
            <CommandGroup>
              {isoCountries.map((country) => (
                <CommandItem
                  key={country.iso3}
                  value={country.name}
                  onSelect={() => {
                    setOpen(false);
                    setIso3(country.iso3);

                    switch (regionId) {
                      case "A":
                        navigate({
                          to: '.',
                          search: (prev) => ({
                            ...prev,          // Keep existing search params
                            country1: country.iso3 // Update or add a specific parameter
                          }),
                        })
                        break;
                      case "B":
                        navigate({
                          to: '.',
                          search: (prev) => ({
                            ...prev,          // Keep existing search params
                            country2: country.iso3 // Update or add a specific parameter
                          }),
                        })
                    }
                     
                  }}
                >
                  {country.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      iso3 === country.iso3 ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
