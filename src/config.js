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
	data: './data/census-quiz-data-2021-v3.csv'
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
        "info": "The population of England and Wales was {K04000001,population_total,1,-6} million in 2021. It grew by {K04000001,population_change,1}% since the last census in 2011.",
        "formatVal": 1,
        "startVal": 0,
        "minVal": -30,
        "maxVal": 30,
        "customMarker": 0
    },
    {
        "QA_ID": 2,
        "type": "sort",
        "key": "population_total",
        "text": "Put these local authorities in order of population, highest to lowest:",
        "topic": "population",
        "clashID": "population",
        "unit": " people",
        "info": "The total population of local authority recorded on Census 2021 areas varies a lot, from Birmingham with around {E08000025,population_total,-2} people to the Isles of Scilly with around {E06000053,population_total,-2} people.",
        "infoWales": "In Wales, Cardiff had the largest population recorded on Census 2021 with {W06000015,population,-2}, while Merthyr Tydfil had the smallest with {W06000024,population,-2}"
    },
    {
        "QA_ID": 3,
        "initial_8": 2,
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
        "QA_ID": 4,
        "type": "slider",
        "key": "density_fp_value",
        "text": "If all the land in {place} were divided into football pitches with an equal number of residents, how many people would live on each pitch?",
        "topic": "population",
        "label": "population density (people per football pitch)",
        "unit": " people",
        "info": "If England were divided into football pitches, there would have been {E92000001,density_fp_value,1} residents per pitch in 2021.",
        "infoWales": "If Wales were divided into football pitches, there would have been {W92000004,density_fp,1} residents per pitch in 2021."
    },
    {
        "QA_ID": 5,
        "initial_8": 1,
        "type": "multi_choice_value",
        "key": "population_total",
        "text": "What was the overall population of {place} in 2021?",
        "topic": "population",
        "clashID": "population",
        "label": "total number of people",
        "unit": " people"
    },
    {
        "QA_ID": 6,
        "type": "slider",
        "key": "population_total",
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
        "minVal": 44,
        "maxVal": 56
    },
    {
        "QA_ID": 8,
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
        "minVal": 44,
        "maxVal": 56
    },
    {
        "QA_ID": 9,
        "initial_8": 3,
        "type": "slider",
        "key": "agemed_value",
        "text": "What was the median age of people in {place} in 2021? The median age is the age of the person in the middle of the group, such that one half of the group is younger than that person and the other half is older.",
        "topic": "age",
        "clashID": "agemed",
        "label": "average (median) age",
        "unit": " years",
        "info": "That compares with a median age across England and Wales of {K04000001,agemed_value,0} years.",
        "customMarker": 0
    },
    {
        "QA_ID": 10,
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
        "text": "For every 1,000 people in {place}, how many were aged {keyText}?",
        "topic": "age",
        "clashID": "age",
        "label": "the number of people out of 1,000 aged under 10",
        "shiftVal": 1
    },
    {
        "QA_ID": 11,
        "type": "true_false_cat",
        "key": "age_0-14_perc",
        "keyCompare": "age_75plus_perc",
        "keyQualifier": "higher",
        "text": "True or false? There were more children in {place} aged under 15 years in 2021 than there were people aged 65 years and over.",
        "topic": "age",
        "clashID": "age",
        "label": "percentage of people",
        "unit": "%",
        "info": "Overall in England and Wales, according to Census 2021, there were more residents aged 75 years and over ({K04000001,age_75plus_total,1,-6} million) than there were children aged under 15 years ({K04000001,age_0-14_total,1,-6} million).",
        "formatVal": 1
    },
    {
        "QA_ID": 12,
        "type": "sort",
        "key": "age_75plus_perc",
        "text": "Sort these areas for the percentage of usual residents aged 75 years and over, highest to lowest",
        "topic": "age",
        "clashID": "age",
        "unit": "%",
        "legendUnit": "%",
        "info": "Around {K04000001,age_75plus_perc,1}% of people in England and Wales, nearly 3 million people, were aged 80 years and over in 2021.",
        "formatVal": 1
    },
    {
        "QA_ID": 13,
        "type": "slider",
        "key": "agemed_change",
        "text": "How much higher or lower was the median age in {place} in 2021 than in 2011? The median age is the age of the person in the middle of the group, such that one half of the group is younger than that person and the other half is older.",
        "topic": "age",
        "clashID": "agemed",
        "label": "the change in average (median) age",
        "unit": " years",
        "info": "The population has continued to age. In England and Wales, the median age increased from **either need to use \"{K04000001,agemed_2011,0}\" or just type in whatever the value in 2011 was** years in 2011 to {K04000001,agemed,0} years in 2021.",
        "infoWales": "The population has continued to age. In England and Wales, the median age increased from {K04000001,agemed,0} years in 2011 to 40 years in 2021.",
        "startVal": 0,
        "minVal": -13,
        "maxVal": 13,
        "customMarker": 0
    },
    {
        "QA_ID": 14,
        "type": "true_false_change",
        "key": "marital_Single_change",
        "keyQualifier": "less",
        "text": "True or false? The percentage of people in {place} who have never married or been in a civil partnership was lower in 2021 than in 2011.",
        "topic": "households",
        "clashID": "marital_status",
        "unit": "%",
        "info": "The percentage of single people in England and Wales, those who had never married or registered a civil partnership, from 34.6% (15.7 million) in 2011 to 37.9% (18.4 million) in 2021."
    },
    {
        "QA_ID": 15,
        "type": "true_false_change",
        "key": "marital_Seperated_change",
        "keyQualifier": "less",
        "text": "True or false? The percentage of people who were divorced or separated in {place} was lower in 2021 than in 2011.",
        "topic": "households",
        "clashID": "marital_status",
        "unit": "%",
        "info": "The number of people in England and Wales who were divorced or whose civil partnership had been dissolved increased from 4.1 million (9.0%) in 2011 to 4.4 million (9.1%) in 2021. Those who were separated increased from 1.2 million (2.6%) in 2011 to 1.1 million (2.2%) in 2021."
    },
    {
        "QA_ID": 16,
        "initial_8": 4,
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
        "label": "the number of people out of 1,000 who identify as {keyText}",
        "info": "In the census, people are grouped into five broad categories (Asian, Asian British or Asian Welsh; Black, Black British, Black Welsh, Caribbean or African; White; Mixed or Multiple ethnic groups; or Other ethnic group). Within these five groups there are 19 ethnic group response options.",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 17,
        "type": "slider",
        "key": "religion_Christian_change",
        "text": "How much did the population describing their religion as Christian increase or decrease in {place} between 2011 and 2021?",
        "topic": "religion",
        "unit": "%",
        "legendUnit": "%",
        "info": "Christian was the largest religious affiliation recorded on the census in England and Wales. {K04000001,religion_Christian_perc,1}% of people in 2021, down from 59.3% in 2011. The census question on religion is voluntary and {K04000001,religion_Religionnotstated_perc,1}% of people chose not to answer.",
        "startVal": 0,
        "minVal": -17,
        "maxVal": 17,
        "customMarker": 0
    },
    {
        "QA_ID": 18,
        "initial_8": 5,
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
        "text": "For every 1,000 people in {place} in 2021, how many described themselves as {keyText}?\"",
        "topic": "religion",
        "clashID": "religion_detail",
        "label": "the number of people out of 1,000 who describe themselves as {keyText}",
        "info": "In the census data, religion refers to a person’s religious affiliation. This is the religion with which they connect or identify, rather than their beliefs or active religious practice.  Across England and Wales, out of every 1,000 people, {K04000001,{key},0,1} identified as {keyText}. The Census question on religion is voluntary and {K04000001,religion_Religionnotstated_perc,0,1} out of every thousand chose not to answer.",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 19,
        "type": "sort",
        "key": "agemed_value",
        "text": "Sort these areas by median age, highest to lowest. The median age is the age of the person in the middle of the group, such that one half of the group is younger than that person and the other half is older.",
        "topic": "age",
        "clashID": "agemed",
        "unit": " years",
        "info": "The median age in England and Wales in 2021 was {K04000001,agemed,0} years."
    },
    {
        "QA_ID": 20,
        "type": "higher_lower_cat",
        "key": "sex_male_perc",
        "keyCompare": "sex_female_perc",
        "text": "Was the percentage of males in {place} higher or lower than the percentage of females?",
        "topic": "gender",
        "clashID": "gender",
        "label": "percentage",
        "unit": "%",
        "info": "In England and Wales the percentage of males was {K04000001,sex_male_perc,0}% and the percentage of females was {K04000001,sex_female_perc,0}%."
    },
    {
        "QA_ID": 21,
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
        "info": "Overall in England and Wales, ** need insert what the largest and smallest \"resident_age_8c\" values are **"
    },
    {
        "QA_ID": 22,
        "type": "multi_choice_cat",
        "key": [
            "household_1-person_perc",
            "household_2-person_perc",
            "household_3-person_perc",
            "household_4-person_perc"
        ],
        "text": "What was the most common household size in {place}"
    },
    {
        "QA_ID": 23,
        "type": "multi_choice_val",
        "key": "household_1-person_perc",
        "text": "What percentage of people lived in a single person household in {place} in 2021?",
        "topic": "households",
        "info": "Census 2021 showed the first increase in the average household size in more than 100 years. In England, there were **INSERT VALUE HERE** residents per household. In 2011, there was an average of 2.4 residents per household across England and Wales.",
        "infoWales": "Census 2021 showed the first increase in the average household size in more than 100 years. In Wales there were {W92000004,people_per_household,1}. In 2011, there was an average of 2.4 residents per household across England and Wales."
    },
    {
        "QA_ID": 24,
        "type": "slider",
        "key": "marital_samesex_perc",
        "text": "For every 1,000 married people in {place}, how many were in a same-sex marriage in 2021?",
        "topic": "households",
        "clashID": "marital_status",
        "label": "the number of married people out of 1,000 in a same sex marriage",
        "unit": " people",
        "info": "Census 2021 was the first to record data on same-sex marriages. Legislation to allow them took effect in 2014.",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 25,
        "type": "slider",
        "key": "marital_civil-partnership_perc",
        "text": "For every 1,000 people in {place}, how many were married or in a civil partnership in 2021?",
        "topic": "households",
        "clashID": "marital_status",
        "label": "the number of married people out of 1,000 in a civil partnership",
        "unit": " people",
        "info": "In December 2019, legislation took effect to enable opposite-sex couples to enter civil partnerships. Across England and Wales, {K04000001,marital_civil-partnership_perc,1}% of civil partnerships ({K04000001,marital_civil-partnership_total,-3}) captured in Census 2021 were in same-sex couples and {K04000001,marital_civil-partnership_perc,1}% ({K04000001,marital_civil-partnership_total,-3}) were in opposite-sex couples.",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 26,
        "type": "slider",
        "key": "residency_addressoutsideUK_perc",
        "text": "For every 1,000 residents in {place}, how many had an address outside the UK in the year before Census 2021?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "the number of residents out of 100 with an address outside the UK in the past year",
        "unit": " people",
        "info": "That compares with {K04000001,residency_addressoutsideUK_total,0,1}  usual residents in England and Wales (({K04000001,residency_addressoutsideUK_perc,1}% of the population) who had an address outside the UK one year before the Census.  ",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 27,
        "initial_8": 6,
        "type": "slider",
        "key": "born_outside_UK_perc",
        "text": "For every 1,000 residents in {place}, how many were born outside the UK?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "the number of residents out of 1,000 born outside the UK",
        "unit": " people",
        "info": "In March 2021, the non-UK born population in England and Wales was 10 million (16.8%). ",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 28,
        "type": "multi_choice_cat",
        "key": [
            "birth_country_India_total",
            "birth_country_Poland_total",
            "birth_country_Pakistan_total"
        ],
        "text": "What was the most common country of birth for people born outside the UK living in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "info": "Across England and Wales overall, the three most common countries of birth for non-UK-born usual residents in 2021 were India ({K04000001,birth_country_India_total,-3}), Poland ({K04000001,birth_country_Poland_total,-3}) and Pakistan ({K04000001,birth_country_Pakistan_total,-3})."
    },
    {
        "QA_ID": 29,
        "type": "slider",
        "key": "no_passport_perc",
        "text": "For every 1,000 usual residents in {place}, how many did not have a passport, according to Census 2021?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "the number of residents out of 1,000 without a passport",
        "info": "Overall, {K04000001,no_passport_total,0,-6} million usual residents in England and Wales ({K04000001,no_passport_perc,1}%) held no passport.",
        "formatVal": 0,
        "shiftVal": 1
    },
    {
        "QA_ID": 30,
        "type": "multi_choice_cat",
        "key": [
            "passport_country_India_total",
            "passport_country_Poland_total",
            "passport_country_Pakistan_total",
            "passport_country_Ireland_total"
        ],
        "text": "What was the most common non-UK passport held by people in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "info": "In England and Wales, the three most common non-UK passports were Poland ({K04000001,passport_country_Poland_total,-3}), Ireland ({K04000001,passport_country_Ireland_total,-3}) and India ({K04000001,passport_country_India_total,-3}). Overall, {K04000001,no_passport_total,0,-6} million usual residents in England and Wales ({K04000001,no_passport_perc,0}%) had no passport."
    },
    {
        "QA_ID": 31,
        "type": "slider",
        "key": "housholds_multiple_ethnicities_perc",
        "text": "What percentage of households in {place} had people in a partnership from at least two or more ethnic groups?",
        "topic": "households",
        "clashID": "ethnicity",
        "label": "the percentage of households with multiple ethnic groups",
        "unit": "%",
        "legendUnit": "%",
        "info": "Across England and Wales {K04000001,household_1-person_perc,1}% of households contained a single occupant. Of the remaining multiple occupant households, {K04000001,housholds_multiple_ethnicities_perc,1}% included people from different ethnic groups to each other.",
        "formatVal": 1
    },
    {
        "QA_ID": 32,
        "initial_8": "7a",
        "type": "higher_lower_avg",
        "key": "nationality_English_perc",
        "text": "Was the percentage of people in {place} who described their national identity as \"English\" higher or lower than the average for England?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "countryOnly": "England",
        "info": "Overall, {K04000001,nationality_AnyUK_perc,1}% of the population in England and Wales identified with at least one UK national identity (English, Welsh, Scottish, Northern Irish and British). English was the most common identity, with {K04000001,nationality_English_total,1,-6} million people or {K04000001,nationality_English_perc,1}% of the population. British was second with {K04000001,nationality_British_total,1,-6} million people or {K04000001,nationality_British_perc,1}%."
    },
    {
        "QA_ID": 33,
        "initial_8": "7b",
        "type": "higher_lower_avg",
        "key": "nationality_Welsh_perc",
        "text": "Was the percentage of people in {place} who described their national identity as \"Welsh\" higher or lower than the average for Wales?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "countryOnly": "Wales",
        "info": "Overall, {K04000001,nationality_AnyUK_perc,1}% of the population in England and Wales identified with at least one UK national identity (English, Welsh, Scottish, Northern Irish and British). In Wales, {W92000004,nationality_Welsh_total,-6} people or {W92000004,nationality_Welsh_perc,1}% of the population chose Welsh as a sole or combined identity while **Have to hard code these numbers IF they are available, otherwise remove** million people or **here too**% said their identity was Welsh only."
    },
    {
        "QA_ID": 34,
        "type": "multi_choice_cat",
        "key": [
            "nationality_Nigerian_total",
            "nationailty_USA_total",
            "nationailty_Lithuanian_total",
            "nationailty_Polish_total",
            "nationailty_French_total",
            "nationailty_Italian_total",
            "nationailty_Portuguese_total",
            "nationailty_Romanian_total",
            "nationailty_Spanish_total",
            "nationailty_Irish_total",
            "nationailty_Indian_total",
            "nationailty_Pakistani_total",
            ""
        ],
        "text": "What was the most common non-UK national identity (not English, Welsh, Scottish, Northern Irish or British) in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "info": "In total for England and Wales, Indian was the most common non-UK national identity, selected by {K04000001,nationality_Indian_total,-3} people, {K04000001,nationality_Indian_perc,1}% of usual residents, followed by **x** thousand people (x.x%) who selected XXXX and x thousand people (x.x%) who selected XXXX **"
    },
    {
        "QA_ID": 35,
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
        "text": "After English and Welsh, what was the most common language spoken in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "countryOnly": "England",
        "info": "Across England and Wales, Polish was the most common language nationally after English or Welsh in Wales, with {K04000001,language_Polish_total, -6} million ({K04000001,language_Polish_perc, 1}%) usual residents reporting they could speak it."
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
        "text": "After English and Welsh, what was the most common language spoken in {place}?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "countryOnly": "Wales",
        "info": "Across England and Wales, Polish was the most common language nationally after English or Welsh in Wales, with {K04000001,language_Polish_total, -6} million ({K04000001,language_Polish_perc, 1}%) usual residents reporting they could speak it."
    },
    {
        "QA_ID": 37,
        "type": "slider",
        "key": "households_multiplelanguages_perc",
        "text": "For every 100 households in {place} with two or more people living there, how many speak more than one main language?",
        "topic": "households",
        "clashID": "residency_birth_language_nationality",
        "label": "the number of households out of 100 that speak more than one main language",
        "unit": " people",
        "info": "In {K04000001,households_multiplelanguages_total,-5} ({K04000001,households_multiplelanguages_perc,1}%) of households in England and Wales, there were two or more main languages spoken within the household.",
        "formatVal": 1
    },
    {
        "QA_ID": 38,
        "type": "sort",
        "key": "households_change",
        "text": "Place these local authority areas in the order of biggest percentage increase in the number of households, highest to lowest.",
        "topic": "households",
        "unit": "%",
        "legendUnit": "%",
        "info": "The increase in the number of households in England ({E92000001,households_change,1}%) was higher than in Wales ({W92000004,households_change,1}%)."
    },
    {
        "QA_ID": 39,
        "type": "multi_choice_cat",
        "key": [
            "language_French_change",
            "language_Portuguese_change",
            "language_Spanish_change",
            "language_Polish_change",
            "language_Russian_change",
            "language_Turkish_change",
            "language_Arabic_change",
            "language_Panjabi_change",
            "language_Urdu_change",
            "language_Bengali_change",
            "language_Gujarati_change",
            "language_Tamil_change",
            "language_Chinese_change"
        ],
        "text": "Excluding English and Welsh, which language in {place} has had the greatest increase in speakers since 2011?",
        "topic": "households"
    },
    {
        "QA_ID": 40,
        "initial_8": 8,
        "type": "slider",
        "key": "armed_forces_perc",
        "text": "For every 100 people aged 16 years or over in {place}, how many have never served in the UK armed forces (including reserves)?",
        "topic": "employment",
        "clashID": "armed_forces",
        "label": "the number of people out of 1,000 that have served in the UK Armed Forces",
        "unit": " people",
        "info": "This compares with {K04000001,armed_forces_perc, 0, 1} in every 100 across England and Wales."
    },
    {
        "QA_ID": 41,
        "initial_8": [
            "mock_language_Hindustani_total",
            "mock_language_Polish_total",
            "mock_language_Punjabi_total",
            "mock_language_Gujarati_total"
        ],
        "keyQualifier": "Excluding English and Welsh, which language in {place} has had the greatest increase in speakers since 2011?",
        "keyText": "households"
    },
    {
        "QA_ID": 42,
        "initial_8": "mock_armed_forces_perc",
        "keyQualifier": "For every 1,000 people aged 16 years or over in {place}, how many have ever served in the UK Armed Forces (including Reserves)?",
        "keyText": "employment",
        "text": "armed_forces",
        "topic": "the number of people out of 1,000 that have served in the UK Armed Forces",
        "clashID": " people",
        "legendUnit": "This compares with {K04000001,mock_armed_forces_perc, 0, 1} in every 100 across England and Wales."
    },
    {}
]

export const catLabels = {
    "age_0-14_perc": "Under 14",
    "age_15-24_perc": "15 to 24",
    "age_25-34_perc": "25 to 34",
    "age_35-44_perc": "35 to 44",
    "age_45-54_perc": "45 to 54",
    "age_55-64_perc": "55 to 64",
    "age_65-74_perc": "65 to 74",
    "age_75plus_perc": "75 plus",
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
    "nationailty_USA_total": "American",
    "nationailty_Lithuanian_total": "Lithuanian",
    "nationailty_Polish_total": "Polish",
    "nationailty_French_total": "French",
    "nationailty_Italian_total": "Italian",
    "nationailty_Portuguese_total": "Portuguese",
    "nationailty_Romanian_total": "Romanian",
    "nationailty_Spanish_total": "Spanish",
    "nationailty_Irish_total": "Irish",
    "nationailty_Indian_total": "Indian",
    "nationailty_Pakistani_total": "Pakistani",
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
    "birth_country_SouthAfrica_total": "SouthAfrica",
    "birth_country_Turkey_total": "Turkey",
    "birth_country_Bangladesh_total": "Bangladesh",
    "birth_country_USA_total": "USA",
    "birth_country_Jamaica_total": "Jamaica"

}