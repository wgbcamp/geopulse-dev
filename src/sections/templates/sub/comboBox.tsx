import * as React from "react"
import { useState } from 'react';


import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const isoCountries = [
  {"alpha2": "AD", "alpha3": "AND", "name": "Andorra"},
  {"alpha2": "AE", "alpha3": "ARE", "name": "United Arab Emirates"},
  {"alpha2": "AF", "alpha3": "AFG", "name": "Afghanistan"},
  {"alpha2": "AG", "alpha3": "ATG", "name": "Antigua and Barbuda"},
  {"alpha2": "AL", "alpha3": "ALB", "name": "Albania"},
  {"alpha2": "AM", "alpha3": "ARM", "name": "Armenia"},
  {"alpha2": "AO", "alpha3": "AGO", "name": "Angola"},
  {"alpha2": "AR", "alpha3": "ARG", "name": "Argentina"},
  {"alpha2": "AT", "alpha3": "AUT", "name": "Austria"},
  {"alpha2": "AU", "alpha3": "AUS", "name": "Australia"},
  {"alpha2": "AZ", "alpha3": "AZE", "name": "Azerbaijan"},
  {"alpha2": "BA", "alpha3": "BIH", "name": "Bosnia and Herzegovina"},
  {"alpha2": "BB", "alpha3": "BRB", "name": "Barbados"},
  {"alpha2": "BD", "alpha3": "BGD", "name": "Bangladesh"},
  {"alpha2": "BE", "alpha3": "BEL", "name": "Belgium"},
  {"alpha2": "BF", "alpha3": "BFA", "name": "Burkina Faso"},
  {"alpha2": "BG", "alpha3": "BGR", "name": "Bulgaria"},
  {"alpha2": "BH", "alpha3": "BHR", "name": "Bahrain"},
  {"alpha2": "BI", "alpha3": "BDI", "name": "Burundi"},
  {"alpha2": "BJ", "alpha3": "BEN", "name": "Benin"},
  {"alpha2": "BN", "alpha3": "BRN", "name": "Brunei Darussalam"},
  {"alpha2": "BO", "alpha3": "BOL", "name": "Bolivia (Plurinational State of)"},
  {"alpha2": "BR", "alpha3": "BRA", "name": "Brazil"},
  {"alpha2": "BS", "alpha3": "BHS", "name": "Bahamas"},
  {"alpha2": "BT", "alpha3": "BTN", "name": "Bhutan"},
  {"alpha2": "BW", "alpha3": "BWA", "name": "Botswana"},
  {"alpha2": "BY", "alpha3": "BLR", "name": "Belarus"},
  {"alpha2": "BZ", "alpha3": "BLZ", "name": "Belize"},
  {"alpha2": "CA", "alpha3": "CAN", "name": "Canada"},
  {"alpha2": "CD", "alpha3": "COD", "name": "Congo (Democratic Republic of the)"},
  {"alpha2": "CF", "alpha3": "CAF", "name": "Central African Republic"},
  {"alpha2": "CG", "alpha3": "COG", "name": "Congo"},
  {"alpha2": "CH", "alpha3": "CHE", "name": "Switzerland"},
  {"alpha2": "CI", "alpha3": "CIV", "name": "Côte d'Ivoire"},
  {"alpha2": "CL", "alpha3": "CHL", "name": "Chile"},
  {"alpha2": "CM", "alpha3": "CMR", "name": "Cameroon"},
  {"alpha2": "CN", "alpha3": "CHN", "name": "China"},
  {"alpha2": "CO", "alpha3": "COL", "name": "Colombia"},
  {"alpha2": "CR", "alpha3": "CRI", "name": "Costa Rica"},
  {"alpha2": "CU", "alpha3": "CUB", "name": "Cuba"},
  {"alpha2": "CW", "alpha3": "CUW", "name": "Curaçao"},
  {"alpha2": "CY", "alpha3": "CYP", "name": "Cyprus"},
  {"alpha2": "CZ", "alpha3": "CZE", "name": "Czechia"},
  {"alpha2": "DE", "alpha3": "DEU", "name": "Germany"},
  {"alpha2": "DJ", "alpha3": "DJI", "name": "Djibouti"},
  {"alpha2": "DK", "alpha3": "DNK", "name": "Denmark"},
  {"alpha2": "DM", "alpha3": "DMA", "name": "Dominica"},
  {"alpha2": "DO", "alpha3": "DOM", "name": "Dominican Republic"},
  {"alpha2": "DZ", "alpha3": "DZA", "name": "Algeria"},
  {"alpha2": "EC", "alpha3": "ECU", "name": "Ecuador"},
  {"alpha2": "EE", "alpha3": "EST", "name": "Estonia"},
  {"alpha2": "EG", "alpha3": "EGY", "name": "Egypt"},
  {"alpha2": "ER", "alpha3": "ERI", "name": "Eritrea"},
  {"alpha2": "ES", "alpha3": "ESP", "name": "Spain"},
  {"alpha2": "ET", "alpha3": "ETH", "name": "Ethiopia"},
  {"alpha2": "FI", "alpha3": "FIN", "name": "Finland"},
  {"alpha2": "FJ", "alpha3": "FJI", "name": "Fiji"},
  {"alpha2": "FR", "alpha3": "FRA", "name": "France"},
  {"alpha2": "GA", "alpha3": "GAB", "name": "Gabon"},
  {"alpha2": "GB", "alpha3": "GBR", "name": "United Kingdom of Great Britain and Northern Ireland"},
  {"alpha2": "GD", "alpha3": "GRD", "name": "Grenada"},
  {"alpha2": "GE", "alpha3": "GEO", "name": "Georgia"},
  {"alpha2": "GF", "alpha3": "GUF", "name": "French Guiana"},
  {"alpha2": "GG", "alpha3": "GGY", "name": "Guernsey"},
  {"alpha2": "GH", "alpha3": "GHA", "name": "Ghana"},
  {"alpha2": "GM", "alpha3": "GMB", "name": "Gambia"},
  {"alpha2": "GN", "alpha3": "GIN", "name": "Guinea"},
  {"alpha2": "GP", "alpha3": "GLP", "name": "Guadeloupe"},
  {"alpha2": "GQ", "alpha3": "GNQ", "name": "Equatorial Guinea"},
  {"alpha2": "GR", "alpha3": "GRC", "name": "Greece"},
  {"alpha2": "GT", "alpha3": "GTM", "name": "Guatemala"},
  {"alpha2": "GW", "alpha3": "GNB", "name": "Guinea-Bissau"},
  {"alpha2": "GY", "alpha3": "GUY", "name": "Guyana"},
  {"alpha2": "HN", "alpha3": "HND", "name": "Honduras"},
  {"alpha2": "HR", "alpha3": "HRV", "name": "Croatia"},
  {"alpha2": "HT", "alpha3": "HTI", "name": "Haiti"},
  {"alpha2": "HU", "alpha3": "HUN", "name": "Hungary"},
  {"alpha2": "ID", "alpha3": "IDN", "name": "Indonesia"},
  {"alpha2": "IE", "alpha3": "IRL", "name": "Ireland"},
  {"alpha2": "IL", "alpha3": "ISR", "name": "Israel"},
  {"alpha2": "IN", "alpha3": "IND", "name": "India"},
  {"alpha2": "IQ", "alpha3": "IRQ", "name": "Iraq"},
  {"alpha2": "IR", "alpha3": "IRN", "name": "Iran (Islamic Republic of)"},
  {"alpha2": "IS", "alpha3": "ISL", "name": "Iceland"},
  {"alpha2": "IT", "alpha3": "ITA", "name": "Italy"},
  {"alpha2": "JE", "alpha3": "JEY", "name": "Jersey"},
  {"alpha2": "JM", "alpha3": "JAM", "name": "Jamaica"},
  {"alpha2": "JO", "alpha3": "JOR", "name": "Jordan"},
  {"alpha2": "JP", "alpha3": "JPN", "name": "Japan"},
  {"alpha2": "KE", "alpha3": "KEN", "name": "Kenya"},
  {"alpha2": "KG", "alpha3": "KGZ", "name": "Kyrgyzstan"},
  {"alpha2": "KH", "alpha3": "KHM", "name": "Cambodia"},
  {"alpha2": "KM", "alpha3": "COM", "name": "Comoros"},
  {"alpha2": "KN", "alpha3": "KNA", "name": "Saint Kitts and Nevis"},
  {"alpha2": "KP", "alpha3": "PRK", "name": "Korea (Democratic People's Republic of)"},
  {"alpha2": "KR", "alpha3": "KOR", "name": "Korea (Republic of)"},
  {"alpha2": "KW", "alpha3": "KWT", "name": "Kuwait"},
  {"alpha2": "KZ", "alpha3": "KAZ", "name": "Kazakhstan"},
  {"alpha2": "LA", "alpha3": "LAO", "name": "Lao People's Democratic Republic"},
  {"alpha2": "LB", "alpha3": "LBN", "name": "Lebanon"},
  {"alpha2": "LI", "alpha3": "LIE", "name": "Liechtenstein"},
  {"alpha2": "LK", "alpha3": "LKA", "name": "Sri Lanka"},
  {"alpha2": "LR", "alpha3": "LBR", "name": "Liberia"},
  {"alpha2": "LS", "alpha3": "LSO", "name": "Lesotho"},
  {"alpha2": "LT", "alpha3": "LTU", "name": "Lithuania"},
  {"alpha2": "LU", "alpha3": "LUX", "name": "Luxembourg"},
  {"alpha2": "LV", "alpha3": "LVA", "name": "Latvia"},
  {"alpha2": "LY", "alpha3": "LBY", "name": "Libya"},
  {"alpha2": "MA", "alpha3": "MAR", "name": "Morocco"},
  {"alpha2": "MD", "alpha3": "MDA", "name": "Moldova (Republic of)"},
  {"alpha2": "ME", "alpha3": "MNE", "name": "Montenegro"},
  {"alpha2": "MF", "alpha3": "MAF", "name": "Saint Martin (French part)"},
  {"alpha2": "MG", "alpha3": "MDG", "name": "Madagascar"},
  {"alpha2": "MK", "alpha3": "MKD", "name": "North Macedonia"},
  {"alpha2": "ML", "alpha3": "MLI", "name": "Mali"},
  {"alpha2": "MM", "alpha3": "MMR", "name": "Myanmar"},
  {"alpha2": "MN", "alpha3": "MNG", "name": "Mongolia"},
  {"alpha2": "MO", "alpha3": "MAC", "name": "Macao"},
  {"alpha2": "MQ", "alpha3": "MTQ", "name": "Martinique"},
  {"alpha2": "MR", "alpha3": "MRT", "name": "Mauritania"},
  {"alpha2": "MT", "alpha3": "MLT", "name": "Malta"},
  {"alpha2": "MW", "alpha3": "MWI", "name": "Malawi"},
  {"alpha2": "MX", "alpha3": "MEX", "name": "Mexico"},
  {"alpha2": "MY", "alpha3": "MYS", "name": "Malaysia"},
  {"alpha2": "MZ", "alpha3": "MOZ", "name": "Mozambique"},
  {"alpha2": "NA", "alpha3": "NAM", "name": "Namibia"},
  {"alpha2": "NE", "alpha3": "NER", "name": "Niger"},
  {"alpha2": "NG", "alpha3": "NGA", "name": "Nigeria"},
  {"alpha2": "NI", "alpha3": "NIC", "name": "Nicaragua"},
  {"alpha2": "NL", "alpha3": "NLD", "name": "Netherlands"},
  {"alpha2": "NO", "alpha3": "NOR", "name": "Norway"},
  {"alpha2": "NP", "alpha3": "NPL", "name": "Nepal"},
  {"alpha2": "NZ", "alpha3": "NZL", "name": "New Zealand"},
  {"alpha2": "OM", "alpha3": "OMN", "name": "Oman"},
  {"alpha2": "PA", "alpha3": "PAN", "name": "Panama"},
  {"alpha2": "PE", "alpha3": "PER", "name": "Peru"},
  {"alpha2": "PG", "alpha3": "PNG", "name": "Papua New Guinea"},
  {"alpha2": "PH", "alpha3": "PHL", "name": "Philippines"},
  {"alpha2": "PK", "alpha3": "PAK", "name": "Pakistan"},
  {"alpha2": "PL", "alpha3": "POL", "name": "Poland"},
  {"alpha2": "PM", "alpha3": "SPM", "name": "Saint Pierre and Miquelon"},
  {"alpha2": "PR", "alpha3": "PRI", "name": "Puerto Rico"},
  {"alpha2": "PT", "alpha3": "PRT", "name": "Portugal"},
  {"alpha2": "PY", "alpha3": "PRY", "name": "Paraguay"},
  {"alpha2": "QA", "alpha3": "QAT", "name": "Qatar"},
  {"alpha2": "RO", "alpha3": "ROU", "name": "Romania"},
  {"alpha2": "RS", "alpha3": "SRB", "name": "Serbia"},
  {"alpha2": "RU", "alpha3": "RUS", "name": "Russian Federation"},
  {"alpha2": "RW", "alpha3": "RWA", "name": "Rwanda"},
  {"alpha2": "SA", "alpha3": "SAU", "name": "Saudi Arabia"},
  {"alpha2": "SB", "alpha3": "SLB", "name": "Solomon Islands"},
  {"alpha2": "SD", "alpha3": "SDN", "name": "Sudan"},
  {"alpha2": "SE", "alpha3": "SWE", "name": "Sweden"},
  {"alpha2": "SG", "alpha3": "SGP", "name": "Singapore"},
  {"alpha2": "SI", "alpha3": "SVN", "name": "Slovenia"},
  {"alpha2": "SK", "alpha3": "SVK", "name": "Slovakia"},
  {"alpha2": "SL", "alpha3": "SLE", "name": "Sierra Leone"},
  {"alpha2": "SM", "alpha3": "SMR", "name": "San Marino"},
  {"alpha2": "SN", "alpha3": "SEN", "name": "Senegal"},
  {"alpha2": "SO", "alpha3": "SOM", "name": "Somalia"},
  {"alpha2": "SR", "alpha3": "SUR", "name": "Suriname"},
  {"alpha2": "SS", "alpha3": "SSD", "name": "South Sudan"},
  {"alpha2": "ST", "alpha3": "STP", "name": "Sao Tome and Principe"},
  {"alpha2": "SV", "alpha3": "SLV", "name": "El Salvador"},
  {"alpha2": "SY", "alpha3": "SYR", "name": "Syrian Arab Republic"},
  {"alpha2": "SZ", "alpha3": "SWZ", "name": "Eswatini"},
  {"alpha2": "TC", "alpha3": "TCA", "name": "Turks and Caicos Islands"},
  {"alpha2": "TD", "alpha3": "TCD", "name": "Chad"},
  {"alpha2": "TG", "alpha3": "TGO", "name": "Togo"},
  {"alpha2": "TH", "alpha3": "THA", "name": "Thailand"},
  {"alpha2": "TW", "alpha3": "TWN", "name": "Taiwan, Province of China"},
  {"alpha2": "TJ", "alpha3": "TJK", "name": "Tajikistan"},
  {"alpha2": "TL", "alpha3": "TLS", "name": "Timor-Leste"},
  {"alpha2": "TM", "alpha3": "TKM", "name": "Turkmenistan"},
  {"alpha2": "TN", "alpha3": "TUN", "name": "Tunisia"},
  {"alpha2": "TR", "alpha3": "TUR", "name": "Turkey"},
  {"alpha2": "TT", "alpha3": "TTO", "name": "Trinidad and Tobago"},
  {"alpha2": "TZ", "alpha3": "TZA", "name": "Tanzania, United Republic of"},
  {"alpha2": "UA", "alpha3": "UKR", "name": "Ukraine"},
  {"alpha2": "UG", "alpha3": "UGA", "name": "Uganda"},
  {"alpha2": "US", "alpha3": "USA", "name": "United States of America"},
  {"alpha2": "UY", "alpha3": "URY", "name": "Uruguay"},
  {"alpha2": "UZ", "alpha3": "UZB", "name": "Uzbekistan"},
  {"alpha2": "VC", "alpha3": "VCT", "name": "Saint Vincent and the Grenadines"},
  {"alpha2": "VE", "alpha3": "VEN", "name": "Venezuela (Bolivarian Republic of)"},
  {"alpha2": "VG", "alpha3": "VGB", "name": "Virgin Islands (British)"},
  {"alpha2": "VI", "alpha3": "VIR", "name": "Virgin Islands (U.S.)"},
  {"alpha2": "VN", "alpha3": "VNM", "name": "Viet Nam"},
  {"alpha2": "VU", "alpha3": "VUT", "name": "Vanuatu"},
  {"alpha2": "YE", "alpha3": "YEM", "name": "Yemen"},
  {"alpha2": "YT", "alpha3": "MYT", "name": "Mayotte"},
  {"alpha2": "ZA", "alpha3": "ZAF", "name": "South Africa"},
  {"alpha2": "ZM", "alpha3": "ZMB", "name": "Zambia"},
  {"alpha2": "ZW", "alpha3": "ZWE", "name": "Zimbabwe"}
];

interface CountryName {
  selection: (data: string) => string;
}

type CountryString = {
  alpha2: string,
  alpha3: string,
  name: string
};

type ComboBoxProps = {
  loadGeoJson(value: CountryString): Promise<void>; 
}

export const ComboBox = ({ loadGeoJson}: ComboBoxProps) => {

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = useState("");


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between dark"
                >
                {value ? isoCountries.find((country) => country.name === value)?.name : "Select country..."} 
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
                      key={country.alpha3}
                      value={country.name}
                      onSelect={(currentValue) => {
                        loadGeoJson(country)
                        setOpen(false)
                        setValue(currentValue)
                      }}
                    >
                      {country.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === country.name ? "opacity-100" : "opacity-0"
                        )}
                        />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
    )
}