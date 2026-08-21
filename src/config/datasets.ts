import { countryByIso3 } from '@/config/isoCountries';

export const URL_BASE = "https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services";
export const URL_RTBASE = "https://tiledimageservices9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services";
export const URL_GRIDBASE = URL_RTBASE;

export const gridObject: Record<string, Record<string, Record<string, Record<number, string>>>> = {
    "Riverine Flooding": {
        "Population": {
            "rcp4p5": {
                1980: `${URL_GRIDBASE}/riverine_population_historical_1980_rp1000/ImageServer`,
                2030: `${URL_GRIDBASE}/riverine_population_rcp4p5_2030_rp1000/ImageServer`,
                2050: `${URL_GRIDBASE}/riverine_population_rcp4p5_2050_rp1000/ImageServer`,
                2080: `${URL_GRIDBASE}/riverine_population_rcp4p5_2080_rp1000/ImageServer`,
            },
            "rcp8p5": {
                1980: `${URL_GRIDBASE}/riverine_population_historical_1980_rp1000/ImageServer`,
                2030: `${URL_GRIDBASE}/riverine_population_rcp8p5_2030_rp1000/ImageServer`,
                2050: `${URL_GRIDBASE}/riverine_population_rcp8p5_2050_rp1000/ImageServer`,
                2080: `${URL_GRIDBASE}/riverine_population_rcp8p5_2080_rp1000/ImageServer`,
            },
        }
    },
    "Coastal Flooding": {
        "Population": {
            "rcp4p5": {
                1980: `${URL_GRIDBASE}/coastal_population_historical_1980_rp1000/ImageServer`,
                2030: `${URL_GRIDBASE}/coastal_population_rcp4p5_2030_rp1000/ImageServer`,
                2050: `${URL_GRIDBASE}/coastal_population_rcp4p5_2050_rp1000/ImageServer`,
                2080: `${URL_GRIDBASE}/coastal_population_rcp4p5_2080_rp1000/ImageServer`,
            },
            "rcp8p5": {
                1980: `${URL_GRIDBASE}/coastal_population_historical_1980_rp1000/ImageServer`,
                2030: `${URL_GRIDBASE}/coastal_population_rcp8p5_2030_rp1000/ImageServer`,
                2050: `${URL_GRIDBASE}/coastal_population_rcp8p5_2050_rp1000/ImageServer`,
                2080: `${URL_GRIDBASE}/coastal_population_rcp8p5_2080_rp1000/ImageServer`,
            },
        }
    }
};

export const urlObject: Record<string, Record<string, { url: string, measure: string[], threshold?: {type: string; group: Record<string, string>}, thresholdToMeasure?: Record<string, string>, scenarios: string[], source: string, value: string }>> = {
    "Riverine Flooding":
    {
        "Population": {
            url: `${URL_BASE}/riverine_population_table/FeatureServer/0/query`,
            measure: ["RF_PW_EXP"],
            scenarios: ["rcp4p5", "rcp8p5"],
            threshold: {
                type: "RETURN_PERIOD",
                group: { 
                    "rp0005": "20%",
                    "rp0010": "10%",  
                    "rp0025": "4%",  
                    "rp0050": "2%",  
                    "rp0100": "1%",  
                    "rp0500": "0.2%",  
                    "rp1000": "0.1%"
                }
            },
            thresholdToMeasure: {
                "rp1000": "RF_PW_EXP",
                "rp0500": "RF_PW_EXP",
                "rp0100": "RF_PW_EXP",
                "rp0050": "RF_PW_EXP",
                "rp0025": "RF_PW_EXP",
                "rp0010": "RF_PW_EXP",
                "rp0005": "RF_PW_EXP",
            },
            value: "PERCENT_",
            source: "Sources: World Resources Institute, Aqueduct Floods Hazard Maps v2; European Commission JRC, Global Human Settlement Layer (GHS-POP); and IMF staff calculations.",
        },
        "Buildings": {
            url: `${URL_BASE}/riverine_buildings_table/FeatureServer/0/query`,
            measure: ["RF_BLD_EXP"],
            scenarios: ["rcp4p5", "rcp8p5"],
            threshold: {
                type: "RETURN_PERIOD",
                group: { 
                    "rp0005": "20%",
                    "rp0010": "10%",  
                    "rp0025": "4%",  
                    "rp0050": "2%",  
                    "rp0100": "1%",  
                    "rp0500": "0.2%",  
                    "rp1000": "0.1%"
                }
            },
            thresholdToMeasure: {
                "rp1000": "RF_BLD_EXP",
                "rp0500": "RF_BLD_EXP",
                "rp0100": "RF_BLD_EXP",
                "rp0050": "RF_BLD_EXP",
                "rp0025": "RF_BLD_EXP",
                "rp0010": "RF_BLD_EXP",
                "rp0005": "RF_BLD_EXP",
            },
            value: "PERCENT_",
            source: "Sources: World Resources Institute, Aqueduct Floods Hazard Maps v2; Global Building Atlas (TU Munich); and IMF staff calculations."
        },
        "GDP": {
            url: `${URL_BASE}/riverine_gdp_table/FeatureServer/0/query`,
            measure: ["RF_GDP_EXP"],
            scenarios: ["rcp4p5", "rcp8p5"],
            threshold: {
                type: "RETURN_PERIOD",
                group: { 
                    "rp0005": "20%",
                    "rp0010": "10%",  
                    "rp0025": "4%",  
                    "rp0050": "2%",  
                    "rp0100": "1%",  
                    "rp0500": "0.2%",  
                    "rp1000": "0.1%"
                }
            },
            thresholdToMeasure: {
                "rp1000": "RF_GDP_EXP",
                "rp0500": "RF_GDP_EXP",
                "rp0100": "RF_GDP_EXP",
                "rp0050": "RF_GDP_EXP",
                "rp0025": "RF_GDP_EXP",
                "rp0010": "RF_GDP_EXP",
                "rp0005": "RF_GDP_EXP",
            },
            value: "PERCENT_",
            source: "Sources: World Resources Institute, Aqueduct Floods Hazard Maps v2; gridded GDP (Murakami, Yoshida & Yamagata, 2021), downscaled with VIIRS nighttime lights (EOG); and IMF staff calculations."
        },
        "Urban GDP": {
            url: `${URL_BASE}/riverine_ugdp_table/FeatureServer/0/query`,
            measure: ["RF_UGDP_EXP"],
            scenarios: ["rcp4p5", "rcp8p5"],
            threshold: {
                type: "RETURN_PERIOD",
                group: {
                    "rp0005": "20%",
                    "rp0010": "10%",  
                    "rp0025": "4%",  
                    "rp0050": "2%",  
                    "rp0100": "1%",  
                    "rp0500": "0.2%",  
                    "rp1000": "0.1%"
                }
            },
            thresholdToMeasure: {
                "rp1000": "RF_UGDP_EXP",
                "rp0500": "RF_UGDP_EXP",
                "rp0100": "RF_UGDP_EXP",
                "rp0050": "RF_UGDP_EXP",
                "rp0025": "RF_UGDP_EXP",
                "rp0010": "RF_UGDP_EXP",
                "rp0005": "RF_UGDP_EXP",
            },
            value: "PERCENT_",
            source: "Sources: World Resources Institute, Aqueduct Floods Hazard Maps v2; gridded GDP (Murakami, Yoshida & Yamagata, 2021) masked to GHSL urban areas (EC JRC), downscaled with VIIRS nighttime lights (EOG); and IMF staff calculations."
        }
    },
    "Coastal Flooding":
    {
        "Population": {
            url: `${URL_BASE}/coastal_population_table/FeatureServer/0/query`,
            measure: ["CF_PW_EXP"],
            scenarios: ["rcp4p5", "rcp8p5"],
            threshold: {
                type: "RETURN_PERIOD",
                group: { 
                    "rp0005": "20%",
                    "rp0010": "10%",  
                    "rp0025": "4%",  
                    "rp0050": "2%",  
                    "rp0100": "1%",  
                    "rp0500": "0.2%",  
                    "rp1000": "0.1%"
                }
            },
            thresholdToMeasure: {
                "rp1000": "CF_PW_EXP",
                "rp0500": "CF_PW_EXP",
                "rp0100": "CF_PW_EXP",
                "rp0050": "CF_PW_EXP",
                "rp0025": "CF_PW_EXP",
                "rp0010": "CF_PW_EXP",
                "rp0005": "CF_PW_EXP",
            },
            value: "PERCENT_",
            source: "Sources: World Resources Institute, Aqueduct Floods Hazard Maps v2; European Commission JRC, Global Human Settlement Layer (GHS-POP); and IMF staff calculations."
        },
        "Buildings": {
            url: `${URL_BASE}/coastal_buildings_table/FeatureServer/0/query`,
            measure: ["CF_BLD_EXP"],
            scenarios: ["rcp4p5", "rcp8p5"],
            threshold: {
                type: "RETURN_PERIOD",
                group: { 
                    "rp0005": "20%",
                    "rp0010": "10%",  
                    "rp0025": "4%",  
                    "rp0050": "2%",  
                    "rp0100": "1%",  
                    "rp0500": "0.2%",  
                    "rp1000": "0.1%"
                }
            },
            thresholdToMeasure: {
                "rp1000": "CF_BLD_EXP",
                "rp0500": "CF_BLD_EXP",
                "rp0100": "CF_BLD_EXP",
                "rp0050": "CF_BLD_EXP",
                "rp0025": "CF_BLD_EXP",
                "rp0010": "CF_BLD_EXP",
                "rp0005": "CF_BLD_EXP",
            },
            value: "PERCENT_",
            source: "Sources: World Resources Institute, Aqueduct Floods Hazard Maps v2; Global Building Atlas (TU Munich); and IMF staff calculations."
        },
        "GDP": {
            url: `${URL_BASE}/coastal_gdp_table/FeatureServer/0/query`,
            measure: ["CF_GDP_EXP"],
            scenarios: ["rcp4p5", "rcp8p5"],
            threshold: {
                type: "RETURN_PERIOD",
                group: { 
                    "rp0005": "20%",
                    "rp0010": "10%",  
                    "rp0025": "4%",  
                    "rp0050": "2%",  
                    "rp0100": "1%",  
                    "rp0500": "0.2%",  
                    "rp1000": "0.1%"
                }
            },
            thresholdToMeasure: {
                "rp1000": "CF_GDP_EXP",
                "rp0500": "CF_GDP_EXP",
                "rp0100": "CF_GDP_EXP",
                "rp0050": "CF_GDP_EXP",
                "rp0025": "CF_GDP_EXP",
                "rp0010": "CF_GDP_EXP",
                "rp0005": "CF_GDP_EXP",
            },
            value: "PERCENT_",
            source: "Sources: World Resources Institute, Aqueduct Floods Hazard Maps v2; gridded GDP (Murakami, Yoshida & Yamagata, 2021), downscaled with VIIRS nighttime lights (EOG); and IMF staff calculations."
        },
        "Urban GDP": {
            url: `${URL_BASE}/coastal_ugdp_table/FeatureServer/0/query`,
            measure: ["CF_UGDP_EXP"],
            scenarios: ["rcp4p5", "rcp8p5"],
            threshold: {
                type: "RETURN_PERIOD",
                group: {
                    "rp0005": "20%",
                    "rp0010": "10%",  
                    "rp0025": "4%",  
                    "rp0050": "2%",  
                    "rp0100": "1%",  
                    "rp0500": "0.2%",  
                    "rp1000": "0.1%"
                }
            },
            thresholdToMeasure: {
                "rp1000": "CF_UGDP_EXP",
                "rp0500": "CF_UGDP_EXP",
                "rp0100": "CF_UGDP_EXP",
                "rp0050": "CF_UGDP_EXP",
                "rp0025": "CF_UGDP_EXP",
                "rp0010": "CF_UGDP_EXP",
                "rp0005": "CF_UGDP_EXP",
            },
            value: "PERCENT_",
            source: "Sources: World Resources Institute, Aqueduct Floods Hazard Maps v2; gridded GDP (Murakami, Yoshida & Yamagata, 2021) masked to GHSL urban areas (EC JRC), downscaled with VIIRS nighttime lights (EOG); and IMF staff calculations."
        }
    },
    "Drought":
    {
        "Cropland": {
            url: `${URL_BASE}/drought_cropland_table/FeatureServer/0/query`,
            measure: ["CDD_CROP_EXP", "SPEI_CROP_EXP"],
            scenarios: ["SSP126", "SSP245", "SSP370"],
            value: "MEDIAN",
            source: "Sources: World Bank Climate Change Knowledge Portal (CMIP6 / WCRP modelling groups); Copernicus / ESA CCI Land Cover; Maes et al. (2025), OECD; and IMF staff calculations."
        }
    },
    "Temperature Extremes":
    {
        "Population": {
            url: `${URL_BASE}/temperature_population_table/FeatureServer/0/query`,
            measure: ["ID_PW_EXP", "TN_PW_EXP", "HD_PW_EXP"],
            scenarios: ["SSP126", "SSP245", "SSP370"],
            threshold: {
                type: "TEMP_THRESHOLD",
                group: { 
                    "_Z": "< 0",
                    "H_20": "> 20",  
                    "H_26": "> 26",  
                    "H_32": "> 32",  
                    "H_30": "> 30",  
                    "H_35": "> 35",  
                    "H_40": "> 40"
                }
            },
            thresholdToMeasure: {
                "_Z": "ID_PW_EXP",
                "H_20": "TN_PW_EXP",
                "H_26": "TN_PW_EXP",
                "H_32": "TN_PW_EXP",
                "H_30": "HD_PW_EXP",
                "H_35": "HD_PW_EXP",
                "H_40": "HD_PW_EXP",
            },
            value: "MEDIAN",
            source: "Sources: World Bank Climate Change Knowledge Portal (CMIP6 / WCRP modelling groups); European Commission JRC, Global Human Settlement Layer (GHS-POP); Maes et al. (2025), OECD; and IMF staff calculations."
        },
        "Livestock": {
            url: `${URL_BASE}/temperature_livestock_table/FeatureServer/0/query`,
            measure: ["HD_LW_EXP"],
            scenarios: ["SSP126", "SSP245", "SSP370"],
            threshold: {
                type: "TEMP_THRESHOLD",
                group: { "H_35": "> 35" }
            },
            value: "MEDIAN",
            source: "Sources: World Bank Climate Change Knowledge Portal (CMIP6 / WCRP modelling groups); FAO, Gridded Livestock of the World v3 (GLW3); Maes et al. (2025), OECD; and IMF staff calculations."
            
        }

    }
}

export const scenarioMapper: Record<string, string> = {
    rcp4p5: 'Orderly',
    rcp8p5: 'Disorderly',
    SSP126: 'Orderly',
    SSP245: 'Disorderly',
    SSP370: 'Hot House'
};

// Physical-climate pathway codes behind each plain-language scenario name.
export const scenarioCodeMapper: Record<string, string> = {
    rcp4p5: 'RCP 4.5',
    rcp8p5: 'RCP 8.5',
    SSP126: 'SSP1-2.6',
    SSP245: 'SSP2-4.5',
    SSP370: 'SSP3-7.0'
};

// Display label combining the plain-language name with its code, e.g. "Orderly (RCP 4.5)".
// Display-only: scenarioMapper stays the matching key and raw codes remain in data fields.
export const scenarioLabel = (scenario: string): string =>
    `${scenarioMapper[scenario]} (${scenarioCodeMapper[scenario]})`;

// Canonical forward-looking time-period labels (methodology TIME_PERIOD).
// Single source of truth shared by the time slider and the line-chart x-axis.
// Index order matches the year steps: 0 = Historical (1980), 1 = 2030, 2 = 2050, 3 = 2080.
export const timePeriodLabels: string[] = [
    "Historical",
    "Early century",
    "Mid century",
    "End century",
];

export const measureMapper: Record<string, string> = {
    HD_PW_EXP: "Hot Days",
    TN_PW_EXP: "Tropical Nights",
    ID_PW_EXP: "Icing Days",
    CDD_CROP_EXP: "Dry Days",
    SPEI_CROP_EXP: "SPEI Index",
    HD_LW_EXP: "Hot Days",
    RF_PW_EXP: "Flood Level" // not sure
};

const thresholdToTitle: Record<string, string> = {
    _Z: "Tmax < 0",
    H_20: "Tmin > 20",
    H_26: "Tmin > 26",
    H_32: "Tmin > 32",
    H_30: "Tmax > 30",
    H_35: "Tmax > 35",
    H_40: "Tmax > 40"
}


export const realtimeObject: Record<string, { url: Record<string,string>, colorScheme: Array<Record<string, any>>, title: string, unit: string }> = {

    "Population":
    {
        url: {
            "Population": `${URL_RTBASE}/worldpop_population/ImageServer`,
            "< 15 years old": `${URL_RTBASE}/worldpop_population_0_14/ImageServer`,
            "Working population": `${URL_RTBASE}/worldpop_population_15_64/ImageServer`,
            "≥ 65 years old": `${URL_RTBASE}/worldpop_population_65plus/ImageServer`
        },
        colorScheme: [
            {
                "minValue": 0.0,
                "maxValue": 2.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [0, 0, 4, 1.0]
                },
                "label": "< 2"
            },
            {
                "minValue": 2.0,
                "maxValue": 8.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [10, 58, 74, 1.0]
                },
                "label": "8"
            },
            {
                "minValue": 8.0,
                "maxValue": 59.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [27, 138, 138, 1.0]
                },
                "label": "59"
            },
            {
                "minValue": 59.0,
                "maxValue": 284.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [94, 201, 98, 1.0]
                },
                "label": "284"
            },
            {
                "minValue": 284.0,
                "maxValue": 107609.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [212, 255, 80, 1.0]
                },
                "label": "> 284"
            }
        ],
        title: "population count",
        unit: ""
    },
    "Buildings":
    {
        url: {
            "Buildings": `${URL_RTBASE}/gba_buildings_count/ImageServer`,
        },
        colorScheme: [
            {
                "minValue": 0.0,
                "maxValue": 1.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [0, 0, 139, 1.0]
                },
                "label": "< 1"
            },
            {
                "minValue": 1.0,
                "maxValue": 5.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [0, 153, 204, 1.0]
                },
                "label": "5"
            },
            {
                "minValue": 5.0,
                "maxValue": 18.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [0, 204, 136, 1.0]
                },
                "label": "18"
            },
            {
                "minValue": 18.0,
                "maxValue": 81.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [204, 204, 0, 1.0]
                },
                "label": "81"
            },
            {
                "minValue": 81.0,
                "maxValue": 30203.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [255, 0, 0, 1.0]
                },
                "label": "> 81"
            }
        ],
        title: "building count",
        unit: ""

    },
    "Capital stock":
    {
        url: {
            "Capital stock": `${URL_RTBASE}/residential_shell_replacement_value_usd/ImageServer`,
            "Residential capital stock": `${URL_RTBASE}/residential_shell_replacement_value_usd/ImageServer`,
            "Non-residential capital stock": `${URL_RTBASE}/nonresidential_shell_replacement_value_usd/ImageServer`
        },
        colorScheme: [
            {
                "minValue": 0.1,
                "maxValue": 1000,
                "symbol": {
                    "type": "simple-fill",
                    "color": [50, 48, 50, 1.0]
                },
                "label": "< $1K"
            },
            {
                "minValue": 1000,
                "maxValue": 30000,
                "symbol": {
                    "type": "simple-fill",
                    "color": [90, 55, 65, 1.0]
                },
                "label": "$30K"
            },
            {
                "minValue": 30000,
                "maxValue": 800000,
                "symbol": {
                    "type": "simple-fill",
                    "color": [160, 70, 100, 1.0]
                },
                "label": "$800K"
            },
            {
                "minValue": 800000,
                "maxValue": 170000000,
                "symbol": {
                    "type": "simple-fill",
                    "color": [210, 130, 60, 1.0]
                },
                "label": "$170M"
            },
            {
                "minValue": 170000000,
                "maxValue": 36000000000,
                "symbol": {
                    "type": "simple-fill",
                    "color": [240, 249, 33, 1.0]
                },
                "label": "> $170M"
            }
        ],
        title: "Capital stock",
        unit: "(USD)"
 
    },
    "Nightlights":
    {
        url: { "Nightlights": `${URL_RTBASE}/viirs_nighttimelights_harmonized/ImageServer` },
        colorScheme: [
            {
                'minValue': 7,
                'maxValue': 10,
                'symbol': { 'type': 'simple-fill', 'color': [45, 48, 64, 1.0] },
                'label': '< 10'
            },
            {
                'minValue': 10,
                'maxValue': 15,
                'symbol': { 'type': 'simple-fill', 'color': [74, 80, 104, 1.0] },
                'label': '15'
            },
            {
                'minValue': 15,
                'maxValue': 25,
                'symbol': { 'type': 'simple-fill', 'color': [120, 136, 168, 1.0] },
                'label': '25'
            },
            {
                'minValue': 25,
                'maxValue': 40,
                'symbol': { 'type': 'simple-fill', 'color': [255, 200, 100, 1.0] },
                'label': '40'
            },
            {
                'minValue': 40,
                'maxValue': 63,
                'symbol': { 'type': 'simple-fill', 'color': [255, 255, 255, 1.0] },
                'label': '> 40'
            }
        ],
        title: "night-time luminosity",
        unit: "(nW/cm²/sr)"
    },
    "GDP":
    {
        url: { 
            "GDP": `${URL_RTBASE}/CANUSA_Gridded_GDP_Total_Economy_2021/ImageServer`,
            "Agriculture": `${URL_RTBASE}/CANUSA_Gridded_GDP_Agriculture_2021/ImageServer`,
            "Mining": `${URL_RTBASE}/CANUSA_Gridded_GDP_Mining_and_Oil_and_Gas_2021/ImageServer`,
            "Electricity": `${URL_RTBASE}/CANUSA_Gridded_GDP_Electricity_2021/ImageServer`,
            "Manufacturing": `${URL_RTBASE}/CANUSA_Gridded_GDP_Manufacturing_2021/ImageServer`,
            "Construction": `${URL_RTBASE}/CANUSA_Gridded_GDP_Construction_2021/ImageServer`,
            "Transportation & Warehousing": `${URL_RTBASE}/CANUSA_Gridded_GDP_Transportation_and_Warehousing_2021/ImageServer`,
            "Trade": `${URL_RTBASE}/CANUSA_Gridded_GDP_Trade_2021/ImageServer`,   
            "Finance": `${URL_RTBASE}/CANUSA_Gridded_GDP_Financial_Intermediate_and_Real_Estate_2021/ImageServer`,
            "Government": `${URL_RTBASE}/CANUSA_Gridded_GDP_Government_and_Public_Administration_2021/ImageServer`,
            "Other Industries": `${URL_RTBASE}/CANUSA_Gridded_GDP_Other_Services_2021/ImageServer`
        },
        colorScheme: [
            {
                "minValue": 5.9,
                "maxValue": 6.081,
                "symbol": {
                    "type": "simple-fill",
                    "color": [50, 48, 50, 1.0]
                },
                "label": "< $6.1K"
            },
            {
                "minValue": 6.081,
                "maxValue": 7.031,
                "symbol": {
                    "type": "simple-fill",
                    "color": [90, 55, 65, 1.0]
                },
                "label": "$104.9K"
            },
            {
                "minValue": 7.031,
                "maxValue": 7.413306,
                "symbol": {
                    "type": "simple-fill",
                    "color": [160, 70, 100, 1.0]
                },
                "label": "$628.0K"
            },
            {
                "minValue": 7.413306,
                "maxValue": 7.885,
                "symbol": {
                    "type": "simple-fill",
                    "color": [210, 130, 60, 1.0]
                },
                "label": "$13.3M"
            },
            {
                "minValue": 7.885,
                "maxValue": 10.153,
                "symbol": {
                    "type": "simple-fill",
                    "color": [240, 249, 33, 1.0]
                },
                "label": "> $13.3M"
            }
        ],
        title: "gdp",
        unit: "(Purchasing Power Parity, USD)"
    },
    "Urban GDP":
    {
        url: { "Urban GDP": `${URL_RTBASE}/murakami_urbangdp/ImageServer` },
        colorScheme: [
            {
                "minValue": 4.0,
                "maxValue": 6096.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [50, 48, 50, 1.0]
                },
                "label": "< $6.1K"
            },
            {
                "minValue": 6096.0,
                "maxValue": 104910.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [90, 55, 65, 1.0]
                },
                "label": "$104.9K"
            },
            {
                "minValue": 104910.0,
                "maxValue": 627995.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [160, 70, 100, 1.0]
                },
                "label": "$628.0K"
            },
            {
                "minValue": 627995.0,
                "maxValue": 13321377.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [210, 130, 60, 1.0]
                },
                "label": "$13.3M"
            },
            {
                "minValue": 13321377.0,
                "maxValue": 4346626560.0,
                "symbol": {
                    "type": "simple-fill",
                    "color": [240, 249, 33, 1.0]
                },
                "label": "> $13.3M"
            }
        ],
        title: "urban gdp",
        unit: "(Purchasing Power Parity, USD)"


    },
    "Cropland":
    {
        url: { "Cropland": `${URL_RTBASE}/esri_cropland/ImageServer` },
        colorScheme: [
            {
                'minValue': 0.5,
                'maxValue': 1.0,
                'symbol': { 'type': 'simple-fill', 'color': [168, 198, 108, 1] },
                'label': ''
            }
        ],
        title: "land cover class: cropland",
        unit: ""

    },
    "Airports":
    {
        url: { "Airports": `${URL_BASE}/airports_latest/FeatureServer` },
        colorScheme: [
            {
                'minValue': 0.5,
                'maxValue': 1.0,
                'symbol': { 'type': 'simple-fill', 'color': [255, 200, 0, 1] },
                'label': ''
            }
        ],
        title: "airports",
        unit: ""

    },
    "Ports":
    {
        url: { "Ports": `${URL_BASE}/PortWatch_ports_database/FeatureServer` },
        colorScheme: [
            {
                'minValue': 0.5,
                'maxValue': 1.0,
                'symbol': { 'type': 'simple-fill', 'color': [255, 200, 0, 1] },
                'label': ''
            }
        ],
        title: "ports",
        unit: ""

    }
}

export const comparisonTitles = (hazard: string, exposure: string, measure: string, threshold: string, iso3: string) => {

    const colorAxisTitleMapper: Record<string, Record<string, Record<string, string>>> = {
        "Temperature Extremes": {
            "Population": {
                colorAxis: `${["H_20", "H_26", "H_32"].includes(threshold) ? "Nights" : "Days"} per year`,
                chart: `${countryByIso3[iso3]}: Population-weighted ${measureMapper[measure]} (${thresholdToTitle[threshold]}° C)`,
                subtitle: `(${["H_20", "H_26", "H_32"].includes(threshold) ? "Nights" : "Days"} per year; trajectory across all time periods and scenarios)`,
            },
            "Livestock": {
                colorAxis: `${["H_20", "H_26", "H_32"].includes(threshold) ? "Nights" : "Days"} per year`,
                chart: `${countryByIso3[iso3]}: Livestock-weighted ${measureMapper[measure]} (${thresholdToTitle[threshold]}° C)`,
                subtitle: `(${["H_20", "H_26", "H_32"].includes(threshold) ? "Nights" : "Days"} per year; trajectory across all time periods and scenarios)`,
            },
            "GDP": {
                colorAxis: `${["H_20", "H_26", "H_32"].includes(threshold) ? "Nights" : "Days"} per year`,
                chart: `${countryByIso3[iso3]}: GDP-weighted ${measureMapper[measure]} (${thresholdToTitle[threshold]}° C)`,
                subtitle: `(${["H_20", "H_26", "H_32"].includes(threshold) ? "Nights" : "Days"} per year; trajectory across all time periods and scenarios)`,
            },
            "Urban GDP": {
                colorAxis: `${["H_20", "H_26", "H_32"].includes(threshold) ? "Nights" : "Days"} per year`,
                chart: `${countryByIso3[iso3]}: Urban GDP-weighted ${measureMapper[measure]} (${thresholdToTitle[threshold]}° C)`,
                subtitle: `(${["H_20", "H_26", "H_32"].includes(threshold) ? "Nights" : "Days"} per year; trajectory across all time periods and scenarios)`,
            }
        },
        "Riverine Flooding": {
            "Population": {
                colorAxis: "Percent of population exposed",
                chart: `${countryByIso3[iso3]}: Population Exposed to Riverine Flooding`,
                subtitle: "(Percent of total population; trajectory across all time periods and scenarios)",
            },
            "Buildings": {
                colorAxis: "Percent of buildings exposed",
                chart: `${countryByIso3[iso3]}: Buildings Exposed to Riverine Flooding`,
                subtitle: "(Percent of total buildings; trajectory across all time periods and scenarios)",
            },
            "Builtup Area": {
                colorAxis: "Builtup area exposed (Km²)",
                chart: `${countryByIso3[iso3]}: Builtup Area (Km²) Exposed to Riverine Flooding`,
                subtitle: "(Builtup area in Km²; trajectory across all time periods and scenarios)",
            },
            "GDP": {
                colorAxis: "Percent of GDP exposed",
                chart: `${countryByIso3[iso3]}: GDP Exposed to Riverine Flooding`,
                subtitle: "(Percent of total GDP; trajectory across all time periods and scenarios)",
            },
            "Urban GDP": {
                colorAxis: "Percent of urban GDP exposed",
                chart: `${countryByIso3[iso3]}: Urban GDP Exposed to Riverine Flooding`,
                subtitle: "(Percent of total urban GDP; trajectory across all time periods and scenarios)",
            }
        },
        "Coastal Flooding": {
            "Population": {
                colorAxis: "Percent of population exposed",
                chart: `${countryByIso3[iso3]}: Population Exposed to Coastal Flooding`,
                subtitle: "(Percent of total population; trajectory across all time periods and scenarios)",
            },
            "Buildings": {
                colorAxis: "Percent of buildings exposed",
                chart: `${countryByIso3[iso3]}: Buildings Exposed to Coastal Flooding`,
                subtitle: "(Percent of total buildings; trajectory across all time periods and scenarios)",
            },
            "Builtup Area": {
                colorAxis: "Builtup area exposed (Km²)",
                chart: `${countryByIso3[iso3]}: Builtup Area (Km²) Exposed to Coastal Flooding`,
                subtitle: "(Builtup area in Km²; trajectory across all time periods and scenarios)",
            },
            "GDP": {
                colorAxis: "Percent of GDP exposed",
                chart: `${countryByIso3[iso3]}: GDP Exposed to Coastal Flooding`,
                subtitle: "(Percent of total GDP; trajectory across all time periods and scenarios)",
            },
            "Urban GDP": {
                colorAxis: "Percent of urban GDP exposed",
                chart: `${countryByIso3[iso3]}: Urban GDP Exposed to Coastal Flooding`,
                subtitle: "(Percent of total urban GDP; trajectory across all time periods and scenarios)",
            },
        },
        "Drought": {
            "Cropland": {
                colorAxis: `${measureMapper[measure] == "Dry Days" ? "Days per year" : "SPEI Index for cropland"}`,
                chart: `${measureMapper[measure] == "Dry Days" ? `${countryByIso3[iso3]}: Maximum Number of Consecutive Dry Days on Cropland` : `${countryByIso3[iso3]}: Standardized Precipitation Evapotranspiration Index for Cropland`}`,
                subtitle: `(${measureMapper[measure] == "Dry Days" ? "Days per year" : "Index value"}; trajectory across all time periods and scenarios)`
            }
        }
    }

    return colorAxisTitleMapper[hazard][exposure]
}

// Single page-level note for the Compare view. Content varies by indicator only.
// Historical baselines: temperature Population 2005, Livestock 2010 (confirmed).
// TODO(baseline-year): 2020 exposure layer and 2005 flood-historical baseline are still from the
// mocks and unconfirmed (Open Question 1). Update once the team confirms.
export const comparisonNote = (hazard: string, exposure: string, _measure: string, threshold: string): string[] => {
    const isTmin = ["H_20", "H_26", "H_32"].includes(threshold);
    const daysNights = isTmin ? "nights" : "days";

    switch (hazard) {
        case "Riverine Flooding":
        case "Coastal Flooding": {
            const years = threshold ? parseInt(threshold.replace(/[^0-9]/g, ""), 10) : undefined;
            const annualProb = urlObject[hazard][exposure].threshold?.group[threshold];
            return [
                `Values shown for the ${years}-year return period (${annualProb} annual probability of flooding). ${exposure} is held at the observed 2020 layer (2005 for the historical baseline); only the flood hazard evolves across periods, so values isolate the effect of a changing climate. The historical value is common to both scenarios. See the indicator methodology note for details.`,
                "Scenario names (Orderly / Disorderly) are display conventions referring to the physical-climate pathways RCP 4.5 and RCP 8.5. Downloadable tables report the scenario codes (historical, rcp4p5, rcp8p5).",
            ];
        }
        case "Temperature Extremes": {
            const avgClause = exposure === "Population" ? " — i.e. what the average resident experiences" : "";
            const historicalYear = exposure === "Livestock" ? "2010" : "2005";
            return [
                `Values shown for the selected hazard type. The measure is the ${exposure.toLowerCase()}-weighted mean number of ${daysNights} per year meeting the threshold${avgClause}. ${exposure} is held at the observed 2020 layer (${historicalYear} for the historical baseline); only the temperature hazard evolves across periods, so values isolate the effect of a changing climate. The historical value is common to all scenarios. See the indicator methodology note for details.`,
                "Scenario names (Orderly / Disorderly / Hot House) are display conventions referring to the physical-climate pathways SSP1-2.6, SSP2-4.5 and SSP3-7.0. Downloadable tables report the scenario codes (historical, ssp126, ssp245, ssp370).",
            ];
        }
        case "Drought":
            return [
                "Values shown for the selected measure on cropland. Cropland exposure is held fixed; only the drought hazard evolves across periods, so values isolate the effect of a changing climate. The historical value is common to all scenarios. See the indicator methodology note for details.",
                "A dry day is defined as a day with less than 1 mm of accumulated precipitation.",
                "Scenario names (Orderly / Disorderly / Hot House) are display conventions referring to the physical-climate pathways SSP1-2.6, SSP2-4.5 and SSP3-7.0. Downloadable tables report the scenario codes (historical, ssp126, ssp245, ssp370).",
            ];
        default:
            return [];
    }
};

// Context line under the map title: the map is a single-period, single-scenario snapshot,
// so it carries the current selection state (unit; scenario; return period [Method B]; time period).
export const comparisonMapContext = (
    hazard: string,
    exposure: string,
    measure: string,
    threshold: string,
    scenario: string,
    time: number,
    iso3: string
): string => {
    const parts: string[] = [];

    // unit — reuse the legend title so wording stays consistent
    parts.push(comparisonTitles(hazard, exposure, measure, threshold, iso3).colorAxis);

    // return period — Method B (flooding) only
    if (urlObject[hazard][exposure].threshold?.type === "RETURN_PERIOD" && threshold) {
        const years = parseInt(threshold.replace(/[^0-9]/g, ""), 10);
        parts.push(`${years}-year return period`);
    }

    // scenario — omit for the scenario-independent historical period; include the code in parens
    const isHistorical = time === 1980;
    if (!isHistorical && scenarioMapper[scenario]) parts.push(scenarioLabel(scenario));

    // time period
    const timeIndex = [1980, 2030, 2050, 2080].indexOf(time);
    if (timePeriodLabels[timeIndex]) parts.push(timePeriodLabels[timeIndex]);

    return `(${parts.join("; ")})`;
};

export const eventTypes: Record<string, string> = {
    "AL": "All Events",
    "EQ": "Earthquakes", 
    "TC": "Tropical Cyclones", 
    "DR": "Droughts", 
    "FL": "Flooding", 
    "VO": "Volcanic Eruptions", 
    "WF": "Wildfires"

} 