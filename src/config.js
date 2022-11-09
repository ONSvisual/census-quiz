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
	data: './data/census-data-2011.csv'
}

export const bounds_ew = [
    -6.3602,
    49.8823,
    1.7636,
    55.8112
];

// Slider Questions:

// - travel percentage train
// - Percentage people economically inactive
// - Change in unemployed people
// - Male/female split
// - Percentage people black
// - Percentage of people white


// Higher lower/Sort questions

// - Population
// - Median age
// - Population Density
// - number of unemployed people
// - Number of students
// - Percentage of people white


// Still to do
// Age

// Health?

// Should one of the comparisons be the average?

// additional question parameters: legendUnit, questionGroup

// added - customMin, customMax, customStartPos

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
        "type": "slider",
        "key": "population_change",
        "text": "How much did the population in {place} change between 2011 and 2021?",
        "topic": "population",
        "clashID": "population_change",
        "label": "population percentage change",
        "unit": "%",
        "legendUnit": "%",
        "info": "The population of England and Wales was {K04000001,population,1,1e6} million in 2021. It grew by {K04000001,population_change,1}% since the last census in 2011.",
        "formatVal": 1,
        "startVal": 0,
        "minVal": -30,
        "maxVal": 30,
        "customMarker": 0
    },
    {
        "QA_ID": 2,
        "type": "sort",
        "key": "population",
        "text": "Put these local authorities in order of population, highest to lowest:",
        "topic": "population",
        "clashID": "population",
        "unit": " people",
        "info": "The total population of local authority recorded on Census 2021 areas varies a lot, from Birmingham with around {E08000025,population,-2} people to the Isles of Scilly with around {E06000053,population,-2} people.",
        "infoWales": "In Wales, Cardiff had the largest population recorded on Census 2021 with {W06000015,population,-2} while Merthyr Tydfil had the smallest with {W06000024,population,-2}"
    },
    {
        "QA_ID": 3,
        "initial_8": 2,
        "type": "higher_lower_avg",
        "key": "population_change",
        "text": "The population of England and Wales grew by {K04000001,population_change,1}% between 2011 and 2021. Do you think {place} has grown by more or less than this?",
        "topic": "population",
        "clashID": "population_change",
        "label": "population change from 2011",
        "unit": "%",
        "legendUnit": "%",
        "info": "The largest percentage increase in England was in Tower Hamlets, ({E09000030,population_change,1}%) and the largest decrease was in Kensington and Chelsea ({E09000020,population_change,1}%).",
        "infoWales": "The largest increase in Wales was in Newport ({W06000022,population_change,1}%) while the largest decrease was in Ceredigion ({W06000008,population_change,1}%).",
        "formatVal": 1
    },
    {
        "QA_ID": 4,
        "type": "slider",
        "key": "density_fp",
        "text": "If all the land in {place} were divided into football pitches with an equal number of residents, how many people would live on each pitch?",
        "topic": "population",
        "label": "population density (people per football pitch)",
        "unit": " people",
        "info": "If England were divided into football pitches, there would have been {E92000001,density_fp,1} residents per pitch in 2021.",
        "infoWales": "If Wales were divided into football pitches, there would have been {W92000004,density_fp,1} residents per pitch in 2021."
    },
    {
        "QA_ID": 5,
        "initial_8": 1,
        "type": "multi_choice_value",
        "key": "population",
        "text": "What was the overall population of {place} in 2021?",
        "topic": "population",
        "clashID": "population",
        "label": "total number of people",
        "unit": " people"
    },
    {
        "QA_ID": 6,
        "type": "slider",
        "key": "population",
        "text": "How many people lived in {place} in 2021?",
        "topic": "population",
        "clashID": "population",
        "label": "number of people",
        "unit": " people",
        "startVal": 500000,
        "minVal": 0,
        "maxVal": 1100000
    },
    {
        "QA_ID": 7,
        "type": "slider",
        "key": "sex_male",
        "text": "What percentage of the population in {place} were male?",
        "topic": "gender",
        "clashID": "gender",
        "label": "percentage of people who were male",
        "unit": "%",
        "legendUnit": "%",
        "info": "There were 29,177,200 men, {K04000001,sex_male,1}% of the overall population, in England and Wales in 2021.",
        "formatVal": 1,
        "startVal": 50,
        "minVal": 44,
        "maxVal": 56
    },
    {
        "QA_ID": 8,
        "type": "slider",
        "key": "sex_female",
        "text": "What percentage of the population in {place} were female?",
        "topic": "gender",
        "clashID": "gender",
        "label": "percentage of people who were female",
        "unit": "%",
        "legendUnit": "%",
        "info": "There were 30,420,100 women, {K04000001,sex_female,1}% of the overall population, in England and Wales in 2021.",
        "formatVal": 1,
        "startVal": 50,
        "minVal": 44,
        "maxVal": 56
    },
    {
        "QA_ID": 9,
        "initial_8": 3,
        "type": "slider",
        "key": "agemed",
        "text": "What was the median age of people in {place} in 2021? The median age is the age of the person in the middle of the group, such that one half of the group is younger than that person and the other half is older.",
        "topic": "age",
        "clashID": "agemed",
        "label": "average (median) age",
        "unit": " years",
        "info": "That compares with a median age across England and Wales of {K04000001,agemed,0} years.",
        "customMarker": 0
    },
    {
        "QA_ID": 10,
        "type": "slider",
        "key": "age10yr_0-9",
        "text": "For every 1,000 people in {place}, how many were aged under 15 years?",
        "topic": "age",
        "clashID": "age",
        "label": "the number of people out of 1,000 aged under 10"
    },
    {
        "QA_ID": 11,
        "type": "slider",
        "key": "age10yr_80plus",
        "text": "For every 1,000 people in {place}, how many were aged 65 years and over?",
        "topic": "age",
        "clashID": "age",
        "label": "the number of people out of 1,000 aged over 80",
        "formatVal": 1
    },
    {
        "QA_ID": 12,
        "type": "true_false_cat",
        "key": "age10yr_0-9",
        "keyCompare": "age10yr_80plus",
        "keyQualifier": "higher",
        "text": "True or false? There were more children in {place} aged under 10 years in 2021 than there were people aged 80 years and over.",
        "topic": "age",
        "clashID": "age",
        "label": "number of people",
        "unit": "%",
        "info": "Overall in England and Wales, according to Census 2021, there were more residents aged 65 years and over (11,063,400) than there were children aged under 15 years (10,352,600).",
        "formatVal": 1
    },
    {
        "QA_ID": 13,
        "type": "sort",
        "key": "age10yr_80plus",
        "text": "Sort these areas for the percentage of usual residents aged 80 years and over, highest to lowest",
        "topic": "age",
        "clashID": "age",
        "unit": "%",
        "info": "Around {K04000001,age10yr_80plus,1}% of the population of England and Wales, 498,200 people, were aged 90 years and over in 2021.",
        "formatVal": 1
    },
    {
        "QA_ID": 14,
        "type": "slider",
        "key": "agemed_change",
        "text": "How much higher or lower was the median age in {place} in 2021 than in 2011? The median age is the age of the person in the middle of the group, such that one half of the group is younger than that person and the other half is older.",
        "topic": "age",
        "clashID": "agemed",
        "label": "average (median) age",
        "unit": " years",
        "info": "The population has continued to age. In England, the median age increased from 39 years in 2011 to {E92000001,agemed,0} in 2021.",
        "infoWales": "The population has continued to age. In Wales, the median age increased from 41 years in 2011 to {W92000004,agemed,0} in 2021.",
        "startVal": 0,
        "minVal": -13,
        "maxVal": 13,
        "customMarker": 0
    },
    {
        "QA_ID": 15,
        "type": "true_false_change",
        "key": "marital_Single_change",
        "keyQualifier": "less",
        "text": "True or false? The percentage of people in {place} who have never married or been in a civil partnership was lower in 2021 than in 2011.",
        "topic": "households",
        "clashID": "marital_status",
        "unit": "%",
        "info": "The percentage of single people in England and Wales changed by {K04000001,marital_Single_change,1}%."
    },
    {
        "QA_ID": 16,
        "type": "true_false_change",
        "key": "marital_Seperated_change",
        "keyQualifier": "less",
        "text": "True or false? The percentage of people who were divorced or separated in {place} was lower in 2021 than in 2011.",
        "topic": "households",
        "clashID": "marital_status",
        "unit": "%",
        "info": "Across England and Wales, there were increases in the percentage of the population whose legal partnership status was divorced/separated (at {K04000001,marital_Seperated,1}%, up from 11% in 2011)."
    },
    {
        "QA_ID": 17,
        "type": "multi_choice_value",
        "key": "ethnicity_black",
        "text": "For every 1,000 residents in {place} in 2021, how many were from the Black, Black African, Caribbean or Black British ethnic groups?",
        "topic": "ethnicity",
        "clashID": "ethnicity",
        "label": "the number of people out of 1,000 who identify as Black, Black African, Caribbean or Black British",
        "info": "In the census, people are grouped into five higher-order, or broad, categories (Asian, Asian British or Asian Welsh; Black, Black British, Black Welsh, Caribbean or African; White; Mixed or Multiple ethnic groups; or Other ethnic group). Within these five groups there are 19 ethnic group response options.",
        "formatVal": 2,
        "shiftVal": 1
    },
    {
        "QA_ID": 18,
        "initial_8": 4,
        "type": "multi_choice_value",
        "key": "ethnicity_asian",
        "text": "For every 1,000 residents in {place} in 2021, how many were from the Asian or Asian British ethnic group?",
        "topic": "ethnicity",
        "clashID": "ethnicity",
        "label": "the number of people out of 1,000 who identify as Asian or Asian British",
        "info": "In the census, people are grouped into five higher-order, or broad, categories (Asian, Asian British or Asian Welsh; Black, Black British, Black Welsh, Caribbean or African; White; Mixed or Multiple ethnic groups; or Other ethnic group). Within these five groups there are 19 ethnic group response options.",
        "formatVal": 2,
        "shiftVal": 1
    },
    {
        "QA_ID": 19,
        "type": "slider",
        "key": "religion_Christian_change",
        "text": "How much did the population describing their religion as Christian increase or decrease in {place} between 2011 and 2021?",
        "topic": "religion",
        "unit": "%",
        "legendUnit": "%",
        "info": "Christian was the largest religious affiliation recorded on the census in England and Wales. {K04000001,religion_Christian,1}% of people in 2021, down from 59.3% in 2011. The census question on religion is voluntary and {K04000001,religion_Religionnotstated,1}% of people chose not to answer.",
        "startVal": 0,
        "minVal": -17,
        "maxVal": 17,
        "customMarker": 0
    },
    {
        "QA_ID": 20,
        "initial_8": 5,
        "type": "slider",
        "key": [
            "religion_Noreligion",
            "religion_muslim",
            "religion_Buddhist",
            "religion_Hindu",
            "religion_Jewish",
            "religion_Muslim",
            "religion_Sikh"
        ],
        "keyText": [
            "having no religion",
            "being Muslim",
            "being Buddhist",
            "being Hindu",
            "being Jewish",
            "being Sikh"
        ],
        "text": "For every 1,000 people in {place} in 2021, how many described themselves as {keyText}?\"",
        "topic": "religion",
        "clashID": "religion_detail",
        "label": "the number of people out of 1,000 who describe themselves as {keyText}",
        "info": "In the census data, religion refers to a person’s religious affiliation. This is the religion with which they connect or identify, rather than their beliefs or active religious practice.  Across England and Wales, out of every 1,000 people, {K04000001,{key},0,1} identified as {keyText}. The Census question on religion is voluntary and {K04000001,religion_Religionnotstated,0,1} out of every thousand chose not to answer.",
        "formatVal": 1,
        "shiftVal": 1
    },
    {
        "QA_ID": 21,
        "type": "slider",
        "key": "religion_Muslim",
        "text": "For every 1,000 people in {place} in 2021, how many reported their religion as Muslim?",
        "topic": "religion",
        "clashID": "religion_detail",
        "label": "the number of people out of 1,000 who identify as Muslim",
        "info": "Across England and Wales, out of every 1,000 people, {K04000001,religion_Muslim,0,1} gave their religion as Muslim. The Census question on religion is voluntary, {K04000001,religion_Noreligion,0,1} out of a thousand said they had no religion and {K04000001,religion_Religionnotstated,0,1} chose not to answer.",
        "formatVal": 1,
        "shiftVal": 1,
        "startVal": 20,
        "minVal": 0,
        "maxVal": 40
    },
    {
        "QA_ID": 22,
        "type": "sort",
        "key": "agemed",
        "text": "Which of these areas had the oldest population?",
        "topic": "age",
        "clashID": "agemed",
        "unit": " years",
        "info": "The median age in England and Wales in 2021 was {K04000001,agemed,0} years."
    },
    {
        "QA_ID": 23,
        "type": "higher_lower_cat",
        "key": "sex_male",
        "keyCompare": "sex_female",
        "text": "Was the percentage of males in {place} higher or lower than the percentage of females?",
        "topic": "gender",
        "clashID": "gender",
        "label": "percentage",
        "unit": "%",
        "info": "In England and Wales the percentage of males was {K04000001,sex_male,1}% and the percentage of females was {K04000001,sex_female,1}%."
    },
    {
        "QA_ID": 24,
        "type": "multi_choice_cat",
        "key": [
            "mock_age5yr_0-4_female",
            "mock_age5yr_65-69_female",
            "mock_age5yr_15-19_male",
            "mock_age5yr_30-34_male"
        ],
        "text": "Which was the largest age group in {place}?",
        "topic": "age",
        "info": "Overall in England and Wales, females aged 30 to 34 years were the largest population by sex and five-year age group, with {K04000001,mock_agr5yr_30-34_female,-3} residents. Males aged 50 to 54 years were next, with {K04000001,mock_age5yr_50-54_male,-3}."
    },
    {
        "QA_ID": 25,
        "type": "slider",
        "key": "mock_marital_samesex_perc",
        "text": "For every 1,000 married people in {place}, how many were in a same-sex marriage in 2021?",
        "topic": "households",
        "clashID": "marital_status",
        "label": "the number of married people out of 100 in a same sex marriage",
        "unit": " people",
        "info": "Census 2021 was the first to record data on same-sex marriages. Legislation to allow them took effect in 2014.",
        "formatVal": 1
    },
    {
        "QA_ID": 26,
        "type": "slider",
        "key": "mock_marital_civil-partnership_perc",
        "text": "For every 1,000 people in {place}, how many were married or in a civil partnership in 2021?",
        "topic": "households",
        "clashID": "marital_status",
        "label": "the number of married people out of 100 in a civil partnership",
        "unit": " people",
        "info": "In December 2019, legislation took effect to enable opposite-sex couples to enter civil partnerships. Across England and Wales, {K04000001,mock_marital_civil-partnership_perc,1}% of civil partnerships ({K04000001,mock_marital_civil-partnership_total,-3}) captured in Census 2021 were between same-sex couples and {K04000001,mock_marital_oppositesex_perc,1}% ({K04000001,mock_marital_oppositesex_total,-3}) were between opposite-sex couples",
        "formatVal": 1
    },
    {
        "QA_ID": 27,
        "type": "slider",
        "key": "mock_residency_outside_UK",
        "text": "For every 1,000 residents in {place}, how many had an address outside the UK in the year before Census 2021?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "the number of residents out of 100 with an address outside the UK in the past year",
        "unit": " people",
        "info": "That compares with {K04000001,mock_residency_addressoutsideUK_total,0,1} usual residents in England and Wales ({K04000001,mock_residency_addressoutsideUK_perc,1}% of the population) who had an address outside the UK one year before the Census.  ",
        "formatVal": 1
    },
    {
        "QA_ID": 28,
        "initial_8": 6,
        "type": "slider",
        "key": "mock_born_outside_UK_perc",
        "text": "For every 1,000 residents in {place}, how many were born outside the UK?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "the number of residents out of 1,000 born outside the UK",
        "unit": " people",
        "info": "In March 2021, the non-UK born population in England and Wales was {K04000001,mock_born_outside_UK_total,0,1} ({K04000001,mock_born_outside_UK_perc,1}%) while the UK-born population was {K04000001,mock_born_UK_total,0,1} ({K04000001,mock_born_UK_perc,1}%). ",
        "formatVal": 1
    },
    {
        "QA_ID": 29,
        "type": "multi_choice_cat",
        "key": [
            "mock_birth_country_India_total",
            "mock_birth_country_Poland_total",
            "mock_birth_country_Pakistan_total"
        ],
        "text": "What was the most common country of birth for people born outside the UK living in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "info": "Across England and Wales overall, the three most common countries of birth for non-UK-born usual residents in 2021 were India ({K04000001,mock_birth_country_India_total,-3}), Poland ({K04000001,mock_birth_country_Poland_total,-3}) and Pakistan ({K04000001,mock_birth_country_Pakistan_total,-3})."
    },
    {
        "QA_ID": 30,
        "type": "slider",
        "key": "mock_no_passport_perc",
        "text": "For every 1,000 usual residents in {place}, how many did not have a passport, according to Census 2021?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "the number of residents out of 1,000 without a passport",
        "info": "Overall, {K04000001,mock_no_passport_total,0,-6} million usual residents in England and Wales ({K04000001,mock_no_passport_perc,1}%) held no passport.",
        "formatVal": 1
    },
    {
        "QA_ID": 31,
        "type": "multi_choice_cat",
        "key": [
            "mock_passport_country_India_total",
            "mock_passport_country_Poland_total",
            "mock_passport_country_Pakistan_total",
            "mock_passport_country_Ireland_total"
        ],
        "text": "What was the most common non-UK passport held by people in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "info": "In England and Wales, the three most common non-UK passports were Poland ({K04000001,mock_passport_country_Poland_total,-3}), Ireland ({K04000001,mock_passport_country_Ireland_total,-3}) and India ({K04000001,mock_passport_country_India_total,-3}). Overall, {K04000001,mock_hold_passport_total,0,-6} million usual residents in England and Wales {K04000001,mock_no_passport_total,0,-6} ({K04000001,mock_no_passport_perc,0}%) had no passport."
    },
    {
        "QA_ID": 32,
        "type": "slider",
        "key": "mock_housholds_multiple_ethnicities_perc",
        "text": "What percentage of households in {place} had people in a partnership from at least two or more ethnic groups?",
        "topic": "households",
        "clashID": "ethnicity",
        "label": "the percentage of households with multiple ethnic groups",
        "unit": "%",
        "legendUnit": "%",
        "info": "Respondents could choose one out of 19 tick-box response categories on the ethnic group question, including write-in response options. Across England and wales {K04000001,mock_households_morethan2people_perc,1}% of households contained two or more people. Of these, {K04000001,mock_housholds_multiple_ethnicities_perc,1}% included people from different ethnic groups to each other.",
        "formatVal": 1
    },
    {
        "QA_ID": 33,
        "initial_8": "7a",
        "type": "higher_lower_avg",
        "key": "mock_nationality_English_perc",
        "text": "Was the percentage of people in {place} who described their national identity as \"English\" higher or lower than the average for England?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "countryOnly": "England",
        "info": "Overall, {K04000001,mock_nationality_AnyUK_perc,1}% of the population in England and Wales identified with at least one UK national identity (English, Welsh, Scottish, Northern Irish and British). English was the most common identity, with {K04000001,mock_nationality_English_total,1,-6} million people or {K04000001,mock_nationality_English_perc,1}% of the population. British was second with {K04000001,mock_nationality_British_total,1,-6} million people or {K04000001,mock_nationality_British_perc,1}%. The increase in number of usual residents describing their national identity as “British” and a reduction in the number describing their national identity as “English” may reflect true change. However, it may also be a result of “British” moving to the top response option on the Census 2021 Census questionnaire, for England only. For further info, please see our quality report."
    },
    {
        "QA_ID": 34,
        "initial_8": "7b",
        "type": "higher_lower_avg",
        "key": "mock_nationality_Welsh_perc",
        "text": "Was the percentage of people in {place} who described their national identity as \"Welsh\" higher or lower than the average for Wales?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "countryOnly": "Wales",
        "info": "Overall, {K04000001,mock_nationality_AnyUK_perc,1}% of the population in England and Wales identified with at least one UK national identity (English, Welsh, Scottish, Northern Irish and British). In Wales, {W92000004,mock_nationality_Welsh_total,-6} people or {W92000004,mock_nationality_Welsh_perc,1}% of the population chose Welsh as a sole or combined identity while {W92000004,mock_nationality_WelshOnly_total,1,-6} million people or {W92000004,mock_nationality_WelshOnly_perc,1}% said their identity was Welsh only."
    },
    {
        "QA_ID": 35,
        "type": "multi_choice_cat",
        "key": [
            "mock_nationality_Indian_total",
            "mock_nationality_Polish_total",
            "mock_nationality_Pakistani_total",
            "mock_nationality_Irish_total"
        ],
        "text": "What was the most common non-UK national identity (not English, Welsh, Scottish, Northern Irish or British) in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "info": "In total for England and Wales, Indian was the most common non-UK national identity, selected by {K04000001,mock_nationality_Indian_total,-3} people, {K04000001,mock_nationality_Indian_perc,1}% of usual residents, followed by x thousand people (x.x%) who selected XXXX and x thousand people (x.x%) who selected XXXX "
    },
    {
        "QA_ID": 36,
        "type": "multi_choice_cat",
        "key": [
            "mock_language_Hindustani_total",
            "mock_language_Polish_total",
            "mock_language_Punjabi_total",
            "mock_language_Gujarati_total"
        ],
        "text": "After English and Welsh, what was the most common language spoken in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "countryOnly": "England",
        "info": "Across England and Wales, Polish was the third most common language nationally after English or Welsh in Wales, with {K04000001,mock_language_Polish_total,1,-6} million usual residents reporting they could speak it."
    },
    {
        "QA_ID": 37,
        "type": "multi_choice_cat",
        "key": [
            "mock_language_Hindustani_total",
            "mock_language_Polish_total",
            "mock_language_Punjabi_total",
            "mock_language_Gujarati_total"
        ],
        "text": "After English and Welsh, what was the most common language spoken in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "countryOnly": "Wales",
        "info": "Across England and Wales, Polish was the third most common language nationally after English or Welsh in Wales, with {K04000001,mock_language_Polish_total, -6} million ({K04000001,mock_language_Polish_perc, 1}%) usual residents reporting they could speak it."
    },
    {
        "QA_ID": 38,
        "type": "slider",
        "key": "mock_households_multiplelanguages_total",
        "text": "For every 100 households in {place} with two or more people living there, how many speak more than one main language?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "the number of households out of 100 that speak more than one main language",
        "unit": " people",
        "info": "Census 2021 calculated for the first time whether household members had the same or different languages, irrespective of what the main language was. In {K04000001,mock_households_multiplelanguages_total,-5} ({K04000001,mock_households_multiplelanguages_perc,1}%) of households in England and Wales, there were two or more main languages spoken within the household.",
        "formatVal": 1
    },
    {
        "QA_ID": 39,
        "type": "slider",
        "key": "mock_households_short_term_resident",
        "text": "How many short-term residents were living in {place} on census day? A short-term resident is someone who intended to be in England and Wales for between three months and a year.",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "the number of short term residents",
        "unit": " people",
        "formatVal": 1
    },
    {
        "QA_ID": 40,
        "type": "sort",
        "key": "mock_households_increase",
        "text": "Place these local authority areas in the order of biggest percentage increase in the number of households, highest to lowest.",
        "topic": "households",
        "info": "The increase in the number of households in England ({E92000001,mock_households_increase,1}%) was higher than in Wales ({W92000004,mock_households_increase,1}%)."
    },
    {
        "QA_ID": 41,
        "type": "multi_choice_cat",
        "key": [
            "mock_language_Hindustani_total",
            "mock_language_Polish_total",
            "mock_language_Punjabi_total",
            "mock_language_Gujarati_total"
        ],
        "text": "Excluding English and Welsh, which language in {place} has had the greatest increase in speakers since 2011?",
        "topic": "households"
    },
    {
        "QA_ID": 42,
        "initial_8": 8,
        "type": "slider",
        "key": "mock_armed_forces_perc",
        "text": "For every 1,000 people aged 16 years or over in {place}, how many have ever served in the UK Armed Forces (including Reserves)?",
        "topic": "employment",
        "clashID": "armed_forces",
        "label": "the number of people out of 1,000 that have served in the UK Armed Forces",
        "unit": " people",
        "info": "This compares with {K04000001,mock_armed_forces_perc, 0, 1} in every 100 across England and Wales."
    }
]

export const catLabels = {
	religion_Buddhist: "Buddhism",
	religion_Hindu: "Hinduism",
	religion_Jewish: "Judaism",
	religion_Muslim: "Islam",
	religion_Sikh: "Sikhism",
	"mock_language_Hindustani_total": "Hindustani",
	"mock_language_Polish_total": "Polish",
	"mock_language_Punjabi_total": "Punjabi",
	"mock_language_Gujarati_total": "Gujarati",
	"mock_nationality_Indian_total": "Indian",
	"mock_nationality_Polish_total": "Polish",
	"mock_nationality_Pakistani_total": "Pakistani",
	"mock_nationality_Irish_total": "Irish",
	"mock_passport_country_India_total": "Indian",
	"mock_passport_country_Poland_total": "Polish",
	"mock_passport_country_Pakistan_total": "Pakistani",
	"mock_passport_country_Ireland_total": "Irish",
	"mock_birth_country_India_total": "India",
	"mock_birth_country_Poland_total": "Poland",
	"mock_birth_country_Pakistan_total": "Pakistan",
	"mock_age5yr_0-4_female": "females aged 0 to 4",
	"mock_age5yr_65-69_female": "females aged 65 to 69",
	"mock_age5yr_15-19_male": "males aged 15 to 19",
	"mock_age5yr_30-34_male": "males aged 30 to 34",
    "age10yr_0-9": "under 10 years old",
    "age10yr_80plus": "over 80 years old",
    "sex_male": "males",
    "sex_female": "females"

}