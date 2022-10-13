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

	//Questions explained
		// {
		// 	"spreadsheetID": "Not used in code - just to identify against the \"questions suggestion\" page",
		// 	"type": "Type of question (current types; slider, sort, higher_lower_avg, higher_lower_cat, multi_choice_value, multi_choice_cat, true_false_change, true_false_cat)",
		// 	"key": "Column header of the data from the .csv",
		// 	"keyCompare": "Only for comparing 2 different keys (true_false_cat)",
		// 	"keyQualifier": "Only for comparing 2 categories (true_false_cat) higher or lower. (true_false_change) more or less",
		// 	"text": "Text: question phrasing, use {place} to indicate the currently selected area and {comparitor} for the neighbour being compared (if required)",
		// 	"topic": "Question topic (for ensuring a good distribution)",
		// 	"clashID": "An identifier to indicate similar questions (stops them from appearing in the same quiz)",
		// 	"label": "Text to use in the reveal (descriptor of the number) - I think only used for slider at the moment?",
		// 	"unit": "Suffix for numbers (slider only?",
		// 	"legendUnit": "set true to display on slider min and max values",
		// 	"countryOnly": "\"England\" or \"Wales\" leave blank for questions that relate to both",
		// 	"info": "additional information to be displayed in the reveal - can use {GSS Code,data column,format,optional shifter} to grab values from the data (e.g. {K04000001,population,1,-6} returns the population of England and Wales)",
		// 	"infoWales": "same as info but text to override if {place} is in Wales, leave blank to use same for both countries",
		// 	"linktext": "optional \"learn more\" link text in the reveal (may be removed)",
		// 	"linkURL": "hyperlink url for the \"learn more\" linkText",
		// 	"formatVal": "optional number of decimal places (3 would indicate rounded to nearest 0.001, -3 would indicate rounded to thousands (1000s))",
		// 	"startVal": "optional where to put the slider marker (by default this appears at the average number)",
		// 	"minVal": "optional minimum possible value on the slider (by default this is the lowest value in the data)",
		// 	"maxVal": "optional maximum possible value on the slider (by default this is the highest value in the data)",
		// 	"customMarker": "used to indicate midpoint, or 0 (for numbers that have a possible negative), must be a number between the min and max"
		// },
		{
			"spreadsheetID": 1,
			"type": "slider",
			"key": "population_change",
			"text": "How much has the population in {place} changed between 2011 and 2021?",
			"topic": "population",
			"clashID": "population_change",
			"label": "population percentage change",
			"unit": "%",
			"legendUnit": "%",
			"info": "The population of England and Wales was {K04000001,population,1,1e6} million in 2021. It grew by {K04000001,population_change,1}% since the last census in 2011.",
			"linktext": "You can read more in our bulletin, Population and household estimates, England and Wales: Census 2021",
			"linkURL": "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/populationandhouseholdestimatesenglandandwales/census2021",
			"formatVal": 1,
			"startVal": 0,
			"minVal": -30,
			"maxVal": 30,
			"customMarker": 0,
			"Comments": "Suggested text for slider answers where answer is wrong: \"You'd have won a point if you'd said between X and Y.\" ",
			"Date added": "30/09/2022",
			"Initials": "DW"
		},
		{
			"spreadsheetID": 2,
			"type": "sort",
			"key": "population",
			"text": "Put these local authorities in order of population, highest to lowest:",
			"topic": "population",
			"clashID": "population",
			"unit": " people",
			"info": "The total population of local authority areas varies a lot, from Birmingham with around {E08000025,population,-2} people to the Isles of Scilly with around {E06000053,population,-2} people.",
			"infoWales": "In Wales, Cardiff had the largest population with {W06000015,population,-2} while Merthyr Tydfil had the smallest with {W06000024,population,-2}"
		},
		{
			"spreadsheetID": 3,
			"type": "higher_lower_avg",
			"key": "population_change",
			"text": "The population of England and Wales has grown by {K04000001,population_change,1}% between 2011 and 2021. Do you think {place} has grown by more or less than this?",
			"topic": "population",
			"clashID": "population_change",
			"label": "population change from 2001",
			"unit": "%",
			"legendUnit": "%",
			"info": "The largest percentage increase in England was in Tower Hamlets, ({E09000030,population_change,1}%) and the largest decrease was in Kensington and Chelsea ({E09000020,population_change,1}%).",
			"infoWales": "The largest increase in Wales was in Newport ({W06000022,population_change,1}%) while the largest decrease was in Ceredigion ({W06000008,population_change,1}%)."
		},
		{
			"spreadsheetID": 4,
			"type": "slider",
			"key": "density_fp",
			"text": "If all the land in {place} were divided into football pitches with an equal number of residents, how many people would live on each pitch?",
			"topic": "population",
			"label": "population density (people per football pitch)'",
			"unit": " people",
			"info": "If England were divided into football pitches, there would be {E92000001,density_fp,1} residents per pitch in 2021.",
			"infoWales": "If Wales were divided into football pitches, there would be {W92000004,density_fp,1} residents per pitch in 2021."
		},
		{
			"spreadsheetID": 6,
			"type": "multi_choice_value",
			"key": "population",
			"text": "What is the overall population of {place}?",
			"topic": "population",
			"clashID": "population",
			"label": "total number of people",
			"unit": " people"
		},
		{
			"type": "slider",
			"key": "population",
			"text": "How many people live in {place}?",
			"topic": "population",
			"clashID": "population",
			"label": "number of people",
			"unit": " people",
			"formatVal": -3,
			"startVal": 500000,
			"minVal": 0,
			"maxVal": 1100000
		},
		{
			"spreadsheetID": 7,
			"type": "slider",
			"key": "sex_male",
			"text": "What percentage of the population in {place} are male?",
			"topic": "gender",
			"clashID": "gender",
			"label": "percentage of people who are male",
			"unit": "%",
			"legendUnit": "%",
			"info": "There were 29,177,200 men, {K04000001,sex_male,1}% of the overall population, in England and Wales in 2021.",
			"formatVal": 1,
			"startVal": 50,
			"minVal": 44,
			"maxVal": 56
		},
		{
			"spreadsheetID": 8,
			"type": "slider",
			"key": "sex_female",
			"text": "What percentage of the population in {place} are female?",
			"topic": "gender",
			"clashID": "gender",
			"label": "percentage of people who are female",
			"unit": "%",
			"legendUnit": "%",
			"info": "There were 30,420,100 women, {K04000001,sex_female,1}% of the overall population, in England and wales in 2021.",
			"formatVal": 1,
			"startVal": 50,
			"minVal": 44,
			"maxVal": 56
		},
		{
			"spreadsheetID": 9,
			"type": "slider",
			"key": "agemed",
			"text": "What is the median age of people in {place}? The median is the age half way between the very oldest and very youngest people.",
			"topic": "age",
			"clashID": "agemed",
			"label": "average (median) age",
			"unit": " years",
			"info": "That compares with a median age across England and Wales of {K04000001,agemed,0} years.'",
			"customMarker": 0
		},
		{
			"spreadsheetID": 10,
			"type": "slider",
			"key": "age10yr_0-9",
			"text": "For every 1000 people in {place}, how many are aged under 15 years?",
			"topic": "age",
			"clashID": "age",
			"label": "the number of people out of 1000 aged under 10",
      "formatVal": 0,
      "shiftVal": 1
		},
		{
			"spreadsheetID": 11,
			"type": "slider",
			"key": "age10yr_80plus",
			"text": "For every 100 people in {place}, how many are aged 65 years and over?",
			"topic": "age",
			"clashID": "age",
			"label": "the number of people out of 100 aged over 80",
			"formatVal": 1
		},
		{
			"spreadsheetID": 12,
			"type": "true_false_cat",
			"key": "age10yr_0-9",
			"keyCompare": "age10yr_80plus",
			"keyQualifier": "higher",
			"text": "There are more children in {place} aged under 10 years than there are people aged 80 years and over. True or false?",
			"topic": "age",
			"clashID": "age",
			"info": "Overall in England and Wales, there were more residents aged 65 years (11,063,400) and over than there were children aged under 15 years (10,352,600). (need to change, also, do we have the absolute values or just percentages?)",
			"formatVal": 1
		},
		{
			"spreadsheetID": 13,
			"type": "sort",
			"key": "age10yr_80plus",
			"text": "Which area has the highest percentage of people aged 80 years and over? Sort these from highest to lowest: ",
			"topic": "age",
			"clashID": "age",
			"unit": "%",
			"info": "Around {K04000001,age10yr_80plus,1}% of the population of England and Wales, 498,200 people, were aged 90 years and over in 2021."
		},
		{
			"spreadsheetID": 15,
			"type": "slider",
			"key": "agemed_change",
			"text": "How much higher or lower was the average (median) age in {place} in 2021 than in 2011? The median is the age half way between the very oldest and very youngest people.",
			"topic": "age",
			"clashID": "agemed",
			"label": "average (median) age",
			"unit": " years",
			"info": "The population has continued to age. In England, the median age increased from 39 years in 2011 to {E92000001,agemed,0} in 2021.",
			"infoWales": "The population has continued to age. In Wales, the median age increased from 41 years to {W92000004,agemed,0}.",
			"linktext": "You can read more in our bulletin, Population and household estimates, England and Wales: Census 2035",
			"linkURL": "https://officenationalstatistics.sharepoint.com/:w:/s/cencsod/EXFox768qHtGte-ZJ5V2UIsBPuatZwyOnhrf0RYKS3BeVw?e=FQuXJh",
			"startVal": 0,
			"minVal": -13,
			"maxVal": 13,
			"customMarker": 0
		},
		{
			"spreadsheetID": 19,
			"type": "true_false_change",
			"key": "marital_Single_change",
			"keyQualifier": "less",
			"text": "The percentage of people in {place} who have never married or been in a civil partnership was lower in 2021 than in 2011. True or false?",
			"topic": "households",
			"clashID": "marital_status",
			"info": "The percentage of single people in England and Wales changed by {K04000001,marital_Single_change,1}%"
		},
		{
			"spreadsheetID": 20,
			"type": "true_false_change",
			"key": "marital_Seperated_change",
			"keyQualifier": "less",
			"text": "The percentage of people who were divorced/separated in {place} was lower in 2021 than in 2011. True or false?",
			"topic": "households",
			"clashID": "marital_status",
			"info": "Across England and Wales, there were increases in the percentage of the population whose legal partnership status was divorced/seperated (at {K04000001,marital_Seperated,1}%, up from 11% in 2011)"
		},
		{
			"spreadsheetID": 27,
			"type": "multi_choice_value",
			"key": "ethnicity_black",
			"text": "For every 100 residents in {place}, how many are from the Black, Black African, Caribbean or Black British ethnic groups?",
			"topic": "ethnicity",
			"clashID": "ethnicity",
			"info": "In the census, people are grouped into five higher-order, or broad, categories (White; Mixed or Multiple ethnic groups; Asian or Asian British; Black, Black British, Caribbean or African; or Other ethnic group). Within these five groups there are 19 ethnic group classifications.",
			"formatVal": 2
		},
		{
			"spreadsheetID": 27,
			"type": "multi_choice_value",
			"key": "ethnicity_asian",
			"text": "For every 100 residents in {place}, how many are from the Asian ethnic group?",
			"topic": "ethnicity",
			"clashID": "ethnicity",
			"info": "In the census, people are grouped into five higher-order, or broad, categories (White; Mixed or Multiple ethnic groups; Asian or Asian British; Black, Black British, Caribbean or African; or Other ethnic group). Within these five groups there are 19 ethnic group classifications.",
			"formatVal": 2
		},
		{
			"spreadsheetID": 35,
			"type": "slider",
			"key": "religion_Christian_change",
			"text": "How much did the population identifying as Christian increase or decrease in {place} between 2011 and 2021?",
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
			"spreadsheetID": 37,
			"type": "slider",
			"key": "religion_Noreligion",
			"text": "For every 100 people in {place}, how many identify as having no religion?",
			"topic": "religion",
			"clashID": "religion_detail",
			"label": "the number of people out of 100 who identify as having no religion",
			"info": "Across England and Wales, {K04000001,religion_Noreligion,1}% of people identified as having no religion. The Census question on religion is voluntary and {K04000001,religion_Religionnotstated,1}% chose not to report a religion affiliation.",
			"formatVal": 1
		},
		{
			"spreadsheetID": 37,
			"type": "slider",
			"key": "religion_Muslim",
			"text": "For every 100 people in {place}, how many identify as being Muslim?",
			"topic": "religion",
			"clashID": "religion_detail",
			"label": "the number of people out of 100 who identify as Muslim",
			"info": "Across England and Wales, {K04000001,religion_Muslim,1}% of people gave their religion as Muslim. The Census question on religion is voluntary, {K04000001,religion_Noreligion,1}% said they had no religion and {K04000001,religion_Religionnotstated,1}% chose not to report a religion affiliation.",
			"formatVal": 1,
			"startVal": 20,
			"minVal": 0,
			"maxVal": 40
		},
		{
			"spreadsheetID": 38,
			"type": "sort",
			"key": "agemed",
			"text": "Which of these areas had the oldest population?",
			"topic": "age",
			"clashID": "agemed",
			"unit": " years",
			"info": "The median age in England and Wales in 2021 was {K04000001,agemed,0) years."
		},
		{
			"type": "multi_choice_cat",
			"key": [
				"religion_Buddhist",
				"religion_Hindu",
				"religion_Jewish",
				"religion_Muslim",
				"religion_Sikh"
			],
			"text": "After Christianity, what is the most common religion in {place}?",
			"topic": "religion",
			"clashID": "religion_other"
		},
		{
			"type": "higher_lower_cat",
			"key": "sex_male",
			"keyCompare": "sex_female",
			"text": "Is the number of males in {place} higher or lower than the number of females?",
			"topic": "gender",
			"clashID": "gender",
			"label": "percentage",
			"unit": "%",
			"info": "In England and Wales the percentage of males was {K04000001,sex_male,1}% and the percentage of females was {K04000001,sex_female,1}%"
		}
	  	  
];

export const catLabels = {
	religion_Buddhist: "Buddhism",
	religion_Hindu: "Hinduism",
	religion_Jewish: "Judaism",
	religion_Muslim: "Islam",
	religion_Sikh: "Sikhism"
}