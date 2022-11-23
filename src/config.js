import { scaleSqrt } from "d3-scale";

export const themes = {
  'light': {
    'text': '#222',
    'muted': '#707070',
    'pale': '#f0f0f0',
    'background': '#fff'
  },
  'dark': {
    'text': '#fff',
    'muted': '#bbb',
    'pale': '#333',
    'background': '#222'
  },
	'lightblue': {
		'text': '#206095',
    'muted': '#707070',
    'pale': '#f0f0f0',
		'background': 'rgb(188, 207, 222)'
	},
	'darkblue': {
    'text': '#fff',
    'muted': '#bbb',
    'pale': '#333',
    'background': '#206095'
	}
};

export const colors = ['#ca0020cc','#f4a582cc','#cccccc','#92c5decc','#0571b0cc'];

export const urls = {
	//data: 'https://bothness.github.io/geo-data/csv/census2011_lad2020.csv'
	data: './data/census-quiz-data-2021-v5.csv'
}

export const bounds_ew = [
    -6.3602,
    49.8823,
    1.7636,
    55.8112
];


export const questions = [
    // {
    //     "type": "Type of question (current types; slider, sort, higher_lower_avg, higher_lower_cat, multi_choice_value, multi_choice_cat, true_false_change, true_false_cat)",
    //     "key": "Column header of the data from the .csv",
    //     "keyCompare": "Only for comparing 2 different keys (true_false_cat)",
    //     "keyQualifier": "Only for comparing 2 categories (true_false_cat) higher or lower. (true_false_change) more or less",
    //     "keyText": "text to use on generated questions",
    //     "text": "Text: question phrasing, use {place} to indicate the currently selected area and {comparitor} for the neighbour being compared (if required)",
    //     "topic": "Question topic (for ensuring a good distribution)",
    //     "clashID": "An identifier to indicate similar questions (stops them from appearing in the same quiz)",
    //     "label": "Text to use in the reveal (descriptor of the number) - I think only used for slider at the moment?",
    //     "unit": "Suffix for numbers (slider only?)",
    //     "legendUnit": "set true to display on slider min and max values",
    //     "countryOnly": "\"England\" or \"Wales\" leave blank for questions that relate to both",
    //     "info": "additional information to be displayed in the reveal - can use {GSS Code,data column,format,optional decimal point shifter} to grab values from the data (e.g. {K04000001,population,1,-6} returns the population of England and Wales in millions)",
    //     "infoWales": "same as info but text to override if {place} is in Wales, leave blank to use same for both countries",
    //     "formatVal": "optional number of decimal places (3 would indicate rounded to nearest 0.001, -3 would indicate rounded to thousands (1000s))",
    //     "shiftVal": "move the decimal place (e.g. to show the number as \"thousands\" use -3, \"millions\" use -6)",
    //     "startVal": "optional where to put the slider marker (by default this appears at the average number)",
    //     "minVal": "optional minimum possible value on the slider (by default this is the lowest value in the data)",
    //     "maxVal": "optional maximum possible value on the slider (by default this is the highest value in the data)",
    //     "customMarker": "used to indicate midpoint, or 0 (for numbers that have a possible negative), must be a number between the min and max"
    // },
    {
        "QA_ID": 1,
        "type": "multi_choice_value",
        "key": "population_total",
        "text": "What was the overall population of {place} in 2021?",
        "topic": "population",
        "clashID": "population",
        "label": "total population"
    },
    {
        "QA_ID": 2,
        "type": "higher_lower_avg",
        "key": "population_change",
        "text": "The population of England and Wales grew by {K04000001,population_change,1}% between 2011 and 2021. Do you think population growth in {place} was higher or lower than this?",
        "topic": "population",
        "clashID": "population_change",
        "label": "population change from 2011",
        "unit": "%",
        "legendUnit": "%",
        "info": "The largest percentage increase in England was in Tower Hamlets ({E09000030,population_change,1}%), and the largest decrease was in Kensington and Chelsea ({E09000020,population_change,1}%).",
        "infoWales": "The largest increase in Wales was in Newport ({W06000022,population_change,1}%), while the largest decrease was in Ceredigion ({W06000008,population_change,1}%).",
        "formatVal": 1
    },
    {
        "QA_ID": 3,
        "type": "slider",
        "key": "agemed_value",
        "text": "What was the median age of people in {place} in 2021?",
        "topic": "age",
        "clashID": "agemed",
        "label": "median age",
        "unit": " years",
        "legendUnit": " years",
        "info": "That compares with a median age across England and Wales of {K04000001,agemed_value,0} years.",
        "formatVal": 0,
        "startVal": 20,
        "minVal": 20,
        "maxVal": 60,
        "customMarker": 0
    },
    {
        "QA_ID": 4,
        "type": "multi_choice_value",
        "key": [
            "ethnicity_asian_perc",
            "ethnicity_black_perc",
            "ethnicity_mixed_perc",
            "ethnicity_white_perc"
        ],
        "keyText": [
            "Asian, Asian British or Asian Welsh",
            "Black, Black British, Black Welsh, Caribbean or African",
            "Mixed or Multiple",
            "White"
        ],
        "text": "For every 1,000 residents in {place} in 2021, how many were from the {keyText} ethnic groups?",
        "topic": "ethnicity",
        "clashID": "ethnicity",
        "label": "number of people out of 1,000 who identified as {keyText}",
        "info": "In the census, people are grouped into five broad categories (\"Asian, Asian British or Asian Welsh\"; \"Black, Black British, Black Welsh, Caribbean or African\"; \"White\"; \"Mixed or Multiple ethnic groups\"; or \"Other ethnic group\"). Within these five groups there are 19 ethnic group response options.",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 5,
        "type": "slider",
        "key": [
            "religion_Noreligion_perc",
            "religion_Muslim_perc",
            "religion_Buddhist_perc",
            "religion_Hindu_perc",
            "religion_Jewish_perc",
            "religion_Sikh_perc"
        ],
        "keyText": [
            "having no religion",
            "being Muslim",
            "being Buddhist",
            "being Hindu",
            "being Jewish",
            "being Sikh"
        ],
        "text": "For every 1,000 people in {place} in 2021, how many described themselves as {keyText}?",
        "topic": "religion",
        "clashID": "religion_detail",
        "label": "number of people out of 1,000 who described themselves as {keyText}",
        "info": "In the census data, religion refers to a person’s religious affiliation. This is the religion with which they connect or identify, rather than their beliefs or active religious practice.  Across England and Wales, out of every 1,000 people, {K04000001,{key},0,1} identified as {keyText}. The Census question on religion is voluntary and {K04000001,religion_Religionnotstated_perc,0,1} out of every thousand chose not to answer.",
        "formatVal": 0,
        "shiftVal": 1,
        "startVal": 0,
        "minVal": 0
    },
    {
        "QA_ID": 6,
        "type": "slider",
        "key": "born_outside_UK_perc",
        "text": "For every 1,000 residents in {place}, how many were born outside the UK?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "number of residents out of 1,000 born outside the UK",
        "info": "In March 2021, the non-UK-born population in England and Wales was 10 million (168 in every 1,000). ",
        "formatVal": 0,
        "shiftVal": 1,
        "startVal": 0,
        "minVal": 0
    },
    {
        "QA_ID": 7,
        "type": "higher_lower_avg",
        "key": "nationality_English_perc",
        "text": "Was the percentage of people in {place} who described their national identity as only \"English\" higher or lower than the average for England?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "unit": "%",
        "legendUnit": "%",
        "countryOnly": "England",
        "info": "Overall, {K04000001,nationality_AnyUK_perc,1}% of the population in England and Wales identified with at least one UK national identity (English, Welsh, Scottish, Northern Irish and British).  \"British\" only was the most common identity with {K04000001,nationality_British_total,1,-6} million people or {K04000001,nationality_British_perc,1}%  of the population. \"English\" only was second, with {K04000001,nationality_English_total,1,-6} million people or {K04000001,nationality_English_perc,1}%.",
        "formatVal": 1
    },
    {
        "QA_ID": 8,
        "type": "higher_lower_avg",
        "key": "nationality_Welsh_perc",
        "text": "Was the percentage of people in {place} who described their national identity as only \"Welsh\" higher or lower than the average for Wales?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "unit": "%",
        "legendUnit": "%",
        "countryOnly": "Wales",
        "info": "Overall, {K04000001,nationality_AnyUK_perc,1}% of the population in England and Wales identified with at least one UK national identity (English, Welsh, Scottish, Northern Irish and British). In Wales, 55.2% of the population selected a \"Welsh\" only identity while 18.5% selected a \"British\" only identity and 8.1% selected both \"Welsh\" and \"British\" identities.",
        "formatVal": 1
    },
    {
        "QA_ID": 9,
        "type": "slider",
        "key": "armed_forces_perc",
        "text": "What percentage of people aged 16 years or over in {place} have never served in the UK armed forces (including reserves)?",
        "topic": "employment",
        "clashID": "armed_forces",
        "label": "percentage of people that have never served in the UK armed forces",
        "unit": "%",
        "legendUnit": "%",
        "info": "This compares with {K04000001,armed_forces_perc, 1}% across England and Wales.",
        "formatVal": 1,
        "startVal": 50,
        "minVal": 50
    },
    {
        "QA_ID": 10,
        "type": "slider",
        "key": "population_change",
        "text": "How much did the population in {place} change between 2011 and 2021?",
        "topic": "population",
        "clashID": "population_change",
        "label": "population percentage change",
        "unit": "%",
        "legendUnit": "%",
        "info": "The population of England and Wales was {K04000001,population_total,1,-6} million in 2021. It grew by {K04000001,population_change,1}% since the last census in 2011.",
        "formatVal": 1,
        "startVal": 0,
        "minVal": -25,
        "maxVal": 25,
        "customMarker": 0
    },
    {
        "QA_ID": 11,
        "type": "sort",
        "key": "population_total",
        "text": "Put these local authorities in order of population, highest to lowest:",
        "topic": "population",
        "clashID": "population",
        "unit": " people",
        "info": "The total population of local authorities recorded on Census 2021 areas varies from area to area, from Birmingham with around {E08000025,population_total,-2} people to the Isles of Scilly with around {E06000053,population_total,-2} people.",
        "infoWales": "In Wales, Cardiff had the largest population recorded on Census 2021 with {W06000015,population,-2}, while Merthyr Tydfil had the smallest with {W06000024,population,-2}"
    },
    {
        "QA_ID": 12,
        "type": "slider",
        "key": "density_fp_value",
        "text": "If all the land in {place} were divided into football pitches with an equal number of residents, how many people would live on each pitch?",
        "topic": "population",
        "label": "number of people per football pitch",
        "info": "If England were divided into football pitches, there would have been {E92000001,density_fp_value,0} residents per pitch in 2021.",
        "infoWales": "If Wales were divided into football pitches, there would have been 1 resident per pitch in 2021.",
        "formatVal": 0,
        "startVal": 0
    },
    {
        "QA_ID": 13,
        "type": "slider",
        "key": "population_total",
        "text": "How many people lived in {place} in 2021?",
        "topic": "population",
        "clashID": "population",
        "label": "number of people",
        "unit": " people",
        "formatVal": -3,
        "startVal": 0,
        "minVal": 0,
        "maxVal": 1200000
    },
    {
        "QA_ID": 14,
        "type": "slider",
        "key": "sex_male_perc",
        "text": "What percentage of people in {place} were male?",
        "topic": "gender",
        "clashID": "gender",
        "label": "percentage of people who were male",
        "unit": "%",
        "legendUnit": "%",
        "info": "There were 29 million males, {K04000001,sex_male_perc,1}% of the overall population, in England and Wales in 2021.",
        "formatVal": 1,
        "startVal": 50,
        "minVal": 45,
        "maxVal": 55
    },
    {
        "QA_ID": 15,
        "type": "slider",
        "key": "sex_female_perc",
        "text": "What percentage of people in {place} were female?",
        "topic": "gender",
        "clashID": "gender",
        "label": "percentage of people who were female",
        "unit": "%",
        "legendUnit": "%",
        "info": "There were 30 million females, {K04000001,sex_female_perc,1}% of the overall population, in England and Wales in 2021.",
        "formatVal": 1,
        "startVal": 50,
        "minVal": 45,
        "maxVal": 55
    },
    {
        "QA_ID": 16,
        "type": "slider",
        "key": [
            "age_0-14_perc",
            "age_15-24_perc",
            "age_25-34_perc",
            "age_35-44_perc",
            "age_45-54_perc",
            "age_55-64_perc",
            "age_65-74_perc",
            "age_75plus_perc"
        ],
        "keyText": [
            "under 15",
            "15 to 24",
            "25 to 34",
            "35 to 44",
            "45 to 54",
            "55 to 64",
            "65 to 75",
            "over 75"
        ],
        "text": "For every 1,000 people in {place}, how many were aged {keyText} years?",
        "topic": "age",
        "clashID": "age",
        "label": " number of people out of 1,000 aged {keyText} years",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 17,
        "type": "true_false_cat",
        "key": "age_0-14_perc",
        "keyCompare": "age_75plus_perc",
        "keyQualifier": "higher",
        "text": "True or false? There were more children in {place} aged under 15 years in 2021 than there were people aged 75 years and over.",
        "topic": "age",
        "clashID": "age",
        "label": "percentage of people aged",
        "unit": "%",
        "info": "Overall in England and Wales, according to Census 2021, there were more residents aged 75 years and over ({K04000001,age_75plus_total,1,-6} million) than there were children aged under 15 years ({K04000001,age_0-14_total,1,-6} million).",
        "formatVal": 1
    },
    {
        "QA_ID": 18,
        "type": "sort",
        "key": "age_75plus_perc",
        "text": "Sort these areas for the percentage of usual residents aged 75 years and over, highest to lowest",
        "topic": "age",
        "clashID": "age",
        "unit": "%",
        "legendUnit": "%",
        "info": "Around {K04000001,age_75plus_perc,1}% of people in England and Wales, {K04000001,age_75plus_total,1,-6} million people, were aged 75 years and over in 2021.",
        "formatVal": 1
    },
    {
        "QA_ID": 19,
        "type": "slider",
        "key": "agemed_change",
        "text": "How much higher or lower was the median age in {place} in 2021 than in 2011?",
        "topic": "age",
        "clashID": "agemed",
        "label": "change in median age",
        "unit": " years",
        "info": "The population has continued to age. In England and Wales, the median age increased by {K04000001,agemed_change,0} year to {K04000001,agemed_value,0} years,  from 2011 to 2021.",
        "infoWales": "The population has continued to age. In England and Wales, the median age increased from {K04000001,agemed,0} years in 2011 to 40 years in 2021.",
        "formatVal": 0,
        "startVal": 0,
        "minVal": -10,
        "maxVal": 10,
        "customMarker": 0
    },
    {
        "QA_ID": 20,
        "type": "true_false_change",
        "key": "marital_Single_change",
        "keyQualifier": "less",
        "text": "True or false? The percentage of people in {place} who have never married or been in a civil partnership was lower in 2021 than in 2011.",
        "topic": "households",
        "clashID": "marital_status",
        "unit": "%",
        "info": "The percentage of people in England and Wales who had never married or registered a civil partnership, increased from 34.6% (15.7 million) in 2011 to 37.9% (18.4 million) in 2021.",
        "formatVal": 1
    },
    {
        "QA_ID": 21,
        "type": "true_false_change",
        "key": "marital_DivorcedDissolved_change",
        "keyQualifier": "less",
        "text": "True or false? The percentage of people who were divorced or had dissolved a civil partnership in {place} was lower in 2021 than in 2011.",
        "topic": "households",
        "clashID": "marital_status",
        "unit": "%",
        "info": "The number of people in England and Wales who were divorced or whose civil partnership had been dissolved increased from 4.1 million (9.0%) in 2011 to 4.4 million (9.1%) in 2021."
    },
    {
        "QA_ID": 22,
        "type": "slider",
        "key": "religion_Christian_change",
        "text": "How much did the population describing their religion as Christian increase or decrease in {place} between 2011 and 2021?",
        "topic": "religion",
        "unit": "%",
        "legendUnit": "%",
        "info": "Christian was the largest religious affiliation recorded on the census in England and Wales, with {K04000001,religion_Christian_perc,1}% of people in 2021, down from 59.3% in 2011. The census question on religion is voluntary and {K04000001,religion_Religionnotstated_perc,1}% of people chose not to answer",
        "formatVal": 1,
        "startVal": 0,
        "minVal": -20,
        "maxVal": 20,
        "customMarker": 0
    },
    {
        "QA_ID": 23,
        "type": "sort",
        "key": "agemed_value",
        "text": "Sort these areas by median age, highest to lowest.",
        "topic": "age",
        "clashID": "agemed",
        "unit": " years",
        "info": "The median age in England and Wales in 2021 was {K04000001,agemed_value,0} years."
    },
    {
        "QA_ID": 24,
        "type": "higher_lower_cat",
        "key": "sex_male_perc",
        "keyCompare": "sex_female_perc",
        "text": "Was the percentage of males in {place} higher or lower than the percentage of females?",
        "topic": "gender",
        "clashID": "gender",
        "label": "percentage of",
        "unit": "%",
        "legendUnit": "%",
        "info": "In England and Wales the percentage of males was {K04000001,sex_male_perc,1}% and the percentage of females was {K04000001,sex_female_perc,1}%.",
        "formatVal": 1
    },
    {
        "QA_ID": 25,
        "type": "multi_choice_cat",
        "key": [
            "age_0-14_perc",
            "age_15-24_perc",
            "age_25-34_perc",
            "age_35-44_perc",
            "age_45-54_perc",
            "age_55-64_perc",
            "age_65-74_perc",
            "age_75plus_perc"
        ],
        "text": "Which was the largest age group in {place}?",
        "topic": "age",
        "unit": "%",
        "legendUnit": "%",
        "info": "Overall in England and Wales, the largest age group was under 15 years ({K04000001,age_0-14_perc,1}%) and the smallest was those aged over 75 years ({K04000001,age_75plus_perc,1}%).",
        "formatVal": 1
    },
    {
        "QA_ID": 26,
        "type": "multi_choice_cat",
        "key": [
            "household_1-person_perc",
            "household_2-person_perc",
            "household_3-person_perc",
            "household_4-person_perc"
        ],
        "text": "What was the most common household size in {place}?",
        "unit": "%",
        "legendUnit": "%",
        "formatVal": 1
    },
    {
        "QA_ID": 27,
        "type": "multi_choice_value",
        "key": "household_1-person_perc",
        "text": "What percentage of people lived in a single-person household in {place} in 2021?",
        "topic": "households",
        "unit": "%",
        "legendUnit": "%",
        "info": "In 2021, there were 24.8 million households in England and Wales, up 6.1% from 23.4 million in 2011."
    },
    {
        "QA_ID": 28,
        "type": "slider",
        "key": "marital_samesex_perc",
        "text": "For every 1,000 people aged 16 years and over in {place}, how many were in a same-sex marriage in 2021?",
        "topic": "households",
        "clashID": "marital_status",
        "label": "number of people out of 1,000 in a same-sex marriage",
        "unit": " people",
        "info": "Census 2021 was the first to record data on same-sex marriages. Legislation introducing same-sex marriages took effect in 2014.",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 29,
        "type": "slider",
        "key": "marital_civil-partnership_perc",
        "text": "For every 1,000 people aged 16 years and over in {place}, how many were married or in a civil partnership in 2021?",
        "topic": "households",
        "clashID": "marital_status",
        "label": "number of people out of 1,000 in a civil partnership",
        "unit": " people",
        "info": "In December 2019, legislation took effect to enable opposite-sex couples to enter civil partnerships. Across England and Wales, 65.1% of people in civil partnerships captured in Census 2021 were in same-sex couples and 34.9% were in opposite-sex couples.",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 30,
        "type": "slider",
        "key": "residency_addressoutsideUK_perc",
        "text": "For every 1,000 residents in {place}, how many had an address outside the UK in the year before Census 2021?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "number of residents out of 1,000 with an address outside the UK in the past year",
        "unit": " people",
        "info": "That compares with {K04000001,residency_addressoutsideUK_total,-3}  usual residents in England and Wales ({K04000001,residency_addressoutsideUK_perc,0,1} in every 1,000) who had an address outside the UK one year before the Census.",
        "formatVal": 0,
        "shiftVal": 1,
        "startVal": 0,
        "minVal": 0
    },
    {
        "QA_ID": 31,
        "type": "multi_choice_cat",
        "key": [
            "birth_country_Poland_total",
            "birth_country_Pakistan_total",
            "birth_country_Germany_total",
            "birth_country_China_total",
            "birth_country_India_total",
            "birth_country_Nigeria_total",
            "birth_country_Italy_total",
            "birth_country_Romania_total",
            "birth_country_Lithuania_total",
            "birth_country_Philippines_total",
            "birth_country_Ireland_total",
            "birth_country_SouthAfrica_total",
            "birth_country_Turkey_total",
            "birth_country_Bangladesh_total",
            "birth_country_USA_total",
            "birth_country_Jamaica_total",
            ""
        ],
        "text": "Out of the following options, what was the most common country of birth for people born outside the UK living in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "unit": " people",
        "info": "Across England and Wales overall, the three most common countries of birth for non-UK-born usual residents in 2021 were India ({K04000001,birth_country_India_total,-3}), Poland ({K04000001,birth_country_Poland_total,-3}) and Pakistan ({K04000001,birth_country_Pakistan_total,-3}).",
        "startVal": 0,
        "minVal": 0
    },
    {
        "QA_ID": 32,
        "type": "slider",
        "key": "no_passport_perc",
        "text": "For every 1,000 usual residents in {place}, how many did not have a passport, according to Census 2021?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "number of residents out of 1,000 without a passport",
        "info": "Overall, {K04000001,no_passport_total,0,-6} million usual residents in England and Wales ({K04000001,no_passport_perc,0,1} out of 1,000) held no passport.",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 33,
        "type": "multi_choice_cat",
        "key": [
            "passport_country_India_total",
            "passport_country_Poland_total",
            "passport_country_Pakistan_total",
            "passport_country_Ireland_total"
        ],
        "text": "Out of the following options, what was the most common non-UK passport held by people in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "unit": " holders",
        "info": "In England and Wales, the three most common non-UK passports were Poland ({K04000001,passport_country_Poland_total,-3}), Ireland ({K04000001,passport_country_Ireland_total,-3}) and India ({K04000001,passport_country_India_total,-3}). Overall, {K04000001,no_passport_total,0,-6} million usual residents in England and Wales ({K04000001,no_passport_perc,0}%) had no passport."
    },
    {
        "QA_ID": 34,
        "type": "slider",
        "key": "housholds_multiple_ethnicities_perc",
        "text": "What percentage of households in {place} had people in a partnership from different ethnic groups?",
        "topic": "households",
        "clashID": "ethnicity",
        "label": "percentage of households with people from different ethnic groups",
        "unit": "%",
        "legendUnit": "%",
        "info": "Across England and Wales, {K04000001,household_1-person_perc,1}% of households contained a single occupant. Of the remaining multiple occupant households, {K04000001,housholds_multiple_ethnicities_perc,1}% included people from different ethnic groups.",
        "formatVal": 1,
        "startVal": 0,
        "minVal": 0
    },
    {
        "QA_ID": 35,
        "type": "multi_choice_cat",
        "key": [
            "nationality_Nigerian_total",
            "nationality_USA_total",
            "nationality_Lithuanian_total",
            "nationality_Polish_total",
            "nationality_French_total",
            "nationality_Italian_total",
            "nationality_Portuguese_total",
            "nationality_Romanian_total",
            "nationality_Spanish_total",
            "nationality_Irish_total",
            "nationality_Indian_total",
            "nationality_Pakistani_total",
            ""
        ],
        "text": "Out of the following options, what was the most common non-UK national identity in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "unit": " people",
        "info": "In total for England and Wales, Polish was the most common non-UK national identity, selected by {K04000001,nationality_Polish_total,-3} people, followed by Romanian ({K04000001,nationality_Romanian_total,-3}) and Indian ({K04000001,nationality_Indian_total,-3})."
    },
    {
        "QA_ID": 36,
        "type": "multi_choice_cat",
        "key": [
            "language_French_total",
            "language_Portuguese_total",
            "language_Spanish_total",
            "language_Polish_total",
            "language_Russian_total",
            "language_Turkish_total",
            "language_Arabic_total",
            "language_Panjabi_total",
            "language_Urdu_total",
            "language_Bengali_total",
            "language_Gujarati_total",
            "language_Tamil_total",
            "language_Chinese_total"
        ],
        "text": "Out of the following options, what was the most common language spoken in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "unit": " speakers",
        "countryOnly": "England",
        "info": "Across England and Wales, Polish was the most common language nationally after English or Welsh in Wales, with around {K04000001,language_Polish_total,0,-3} thousand ({K04000001,language_Polish_perc, 1}%) usual residents reporting they could speak it."
    },
    {
        "QA_ID": 37,
        "type": "multi_choice_cat",
        "key": [
            "language_French_total",
            "language_Portuguese_total",
            "language_Spanish_total",
            "language_Polish_total",
            "language_Russian_total",
            "language_Turkish_total",
            "language_Arabic_total",
            "language_Panjabi_total",
            "language_Urdu_total",
            "language_Bengali_total",
            "language_Gujarati_total",
            "language_Tamil_total",
            "language_Chinese_total"
        ],
        "text": "Out of the following options, what was the most common language spoken in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "unit": " speakers",
        "countryOnly": "Wales",
        "info": "Across England and Wales, Polish was the most common language nationally after English or Welsh in Wales, with {K04000001,language_Polish_total,1,-6} million ({K04000001,language_Polish_perc, 1}%) usual residents reporting they could speak it."
    },
    {
        "QA_ID": 38,
        "type": "slider",
        "key": "households_multiplelanguages_perc",
        "text": "For every 1,000 households in {place} with two or more people living there, how many speak more than one main language?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "number of households out of 1,000 that speak more than one main language",
        "unit": " people",
        "info": "In {K04000001,households_multiplelanguages_total,1,-6} million households in England and Wales ({K04000001,households_multiplelanguages_perc,0,1} out of 1,000), there were two or more main languages spoken within the household.",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 39,
        "type": "sort",
        "key": "households_change",
        "text": "Put these local authority areas in the order by biggest increase in number of households, highest to lowest.",
        "topic": "households",
        "unit": "%",
        "legendUnit": "%",
        "info": "The increase in the number of households in England ({E92000001,households_change,1}%) was higher than in Wales ({W92000004,households_change,1}%).",
        "formatVal": 1
    }
]

export const catLabels = {
    "age_0-14_perc": "under 15 years",
    "age_15-24_perc": "15 to 24 years",
    "age_25-34_perc": "25 to 34 years",
    "age_35-44_perc": "35 to 44 years",
    "age_45-54_perc": "45 to 54 years",
    "age_55-64_perc": "55 to 64 years",
    "age_65-74_perc": "65 to 74 years",
    "age_75plus_perc": "75 years and over",
    "household_1-person_perc": "1 person",
    "household_2-person_perc": "2 people",
    "household_3-person_perc": "3 people",
    "household_4-person_perc": "4 people",
    "language_Arabic_change": "Arabic",
    "language_Arabic_total": "Arabic",
    "language_Bengali_change": "Bengali",
    "language_Bengali_total": "Bengali",
    "language_Chinese_change": "Chinese",
    "language_Chinese_total": "Chinese",
    "language_French_change": "French",
    "language_French_total": "French",
    "language_Gujarati_change": "Gujarati",
    "language_Gujarati_total": "Gujarati",
    "language_Panjabi_change": "Panjabi",
    "language_Panjabi_total": "Panjabi",
    "language_Polish_change": "Polish",
    "language_Polish_total": "Polish",
    "language_Polish_perc": "Polish",
    "language_Portuguese_change": "Portuguese",
    "language_Portuguese_total": "Portuguese",
    "language_Russian_change": "Russian",
    "language_Russian_total": "Russian",
    "language_Spanish_change": "Spanish",
    "language_Spanish_total": "Spanish",
    "language_Tamil_change": "Tamil",
    "language_Tamil_total": "Tamil",
    "language_Turkish_change": "Turkish",
    "language_Turkish_total": "Turkish",
    "language_Urdu_change": "Urdu",
    "language_Urdu_total": "Urdu",
    "nationality_Nigerian_total": "Nigerian",
    "nationality_USA_total": "American",
    "nationality_Lithuanian_total": "Lithuanian",
    "nationality_Polish_total": "Polish",
    "nationality_French_total": "French",
    "nationality_Italian_total": "Italian",
    "nationality_Portuguese_total": "Portuguese",
    "nationality_Romanian_total": "Romanian",
    "nationality_Spanish_total": "Spanish",
    "nationality_Irish_total": "Irish",
    "nationality_Indian_total": "Indian",
    "nationality_Pakistani_total": "Pakistani",
    "passport_country_Poland_total": "Poland",
    "passport_country_India_total": "India",
    "passport_country_Pakistan_total": "Pakistan",
    "passport_country_Romania_total": "Romania",
    "passport_country_Portugal_total": "Portugal",
    "passport_country_Lithuania_total": "Lithuania",
    "passport_country_Italy_total": "Italy",
    "passport_country_Ireland_total": "Ireland",
    "passport_country_USA_total": "USA",
    "passport_country_Nigeria_total": "Nigeria",
    "passport_country_France_total": "France",
    "passport_country_Spain_total": "Spain",
    "birth_country_Poland_total": "Poland",
    "birth_country_Pakistan_total": "Pakistan",
    "birth_country_Germany_total": "Germany",
    "birth_country_China_total": "China",
    "birth_country_India_total": "India",
    "birth_country_Nigeria_total": "Nigeria",
    "birth_country_Italy_total": "Italy",
    "birth_country_Romania_total": "Romania",
    "birth_country_Lithuania_total": "Lithuania",
    "birth_country_Philippines_total": "Philippines",
    "birth_country_Ireland_total": "Ireland",
    "birth_country_SouthAfrica_total": "South Africa",
    "birth_country_Turkey_total": "Turkey",
    "birth_country_Bangladesh_total": "Bangladesh",
    "birth_country_USA_total": "USA",
    "birth_country_Jamaica_total": "Jamaica",
    "sex_male_perc": "males",
    "sex_female_perc": "females"

}