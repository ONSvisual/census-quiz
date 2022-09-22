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
	//-------------------
	//{
	//	type: can be "slider", "higher_lower" or "sort" - true/false and multiple choice to be added.
	//	key: this is the column header of the data from the .csv
	//	label: the text to use in the reveal
	//	unit: suffix for numbers
	//	legendUnit: optional suffix for use on the scale
	//  customMarker: optional number to appear on the scale (e.g. 0 when there are negatives, 50 when it's around a midpoint)
	//  text: question phrasing, use {place} to indicate the currently selected area
	//	info: additional information to be displayed in the reveal - can use {GSS Code,data column,format,optional divisor} to grab values from the data (e.g. {K04000001,population,1,1e6} returns the population of England and Wales)
	//	infoWales: as above but text to override if {place} is in Wales - can get values from data as above
	//	linkText: optional "learn more" link text in the reveal
	//	linkURL: hyperlink url for the "learn more" linkText
	//	formatVal: optional number of decimal places (3 would indicate rounded to nearest 0.001, -3 would indicate rounded to thousands (1000s))
	//	startVal: optional where to put the slider marker (by default this appears at the average number)
	//	minVal: optional minimum possible value on the slider (by default this is the lowest value in the data)
	//	maxVal: optional maximum possible value on the slider (by default this is the highest value in the data)

	//  spreadsheetID: not used in the code - for internal reference only
	//}

	{
		type: 'slider',
		key: 'population_change',
		label: 'population percentage change',
		unit: '%',
		legendUnit: '%',
		customMarker: '0',
		text: 'How much has the population in {place} changed between 2011 and 2021?',
		info: 'The population of England and Wales was {K04000001,population,1,1e6} million in 2021. It grew by {K04000001,population_change,1}% since the last census in 2011.',
		linkText: 'You can read more in our bulletin, Population and household estimates, England and Wales: Census 2021',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/populationandhouseholdestimatesenglandandwales/census2021',
		formatVal: 1,
		spreadsheetID: 1
	},
	{
		type: 'sort',
		key: "population",
		text: "Sort these local authorities in order of population, highest to lowest:",
		unit: " people",
		info: "The total population of local authority areas varies a lot, from Birmingham with around {E08000025,population,-2} people to the Isles of Scilly with around {E06000053,population,-2} people.",
		infoWales: "In Wales, Cardiff had the largest population with {W06000015,population,-2} while Merthyr Tydfil had the smallest with {W06000024,population,-2}.",
		linkText: 'You can read more in our bulletin, Population and household estimates, England and Wales: Census 2021',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/populationandhouseholdestimatesenglandandwales/census2021',
		spreadsheetID: 2
	},
	{
		type: 'higher_lower_avg',
		key: 'population_change',
		label: 'population change from 2001',
		unit: '%',
		legendUnit: '%',
		text: 'Has the population in {place} grown more or less than average since 2001?',
		info: 'Across England and Wales, the population grew by {K04000001,population_change,1}% between 2011 and 2021. The largest percentage increase in England was in Tower Hamlets, ({E09000030,population_change,1}%) and the largest decrease was in Kensington and Chelsea ({E09000020,population_change,1}%).',
		infoWales: 'Across England and Wales, the population grew by {K04000001,population_change,1}% between 2011 and 2021. The largest increase in Wales was in Newport ({W06000022,population_change,1}%) while the largest decrease was in Ceredigion ({W06000008,population_change,1}%).',
		linkText: 'You can read more in our bulletin, Population and household estimates, England and Wales: Census 2021',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/populationandhouseholdestimatesenglandandwales/census2021',
		spreadsheetID: 3
	},
	{
		type: 'slider',
		key: 'density_fp',
		label: 'population density (people per footbal pitch)',
		unit: ' people',
		text: 'On average, how many people are there per football pitch area in {place}?',
		info: 'That compares with {E92000001,density_fp,1} residents per football pitch in England in 2021, up from 407 per square kilometre in 2011.',
		infoWales: 'There were about {E92000001} residents per square kilometre in Wales in 2021, up from 148 residents per square kilometre in 2011.',
		linkText: 'You can read more in our bulletin, Population and household estimates, England and Wales: Census 2021',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/populationandhouseholdestimatesenglandandwales/census2021',
		spreadsheetID: 4
		// scale: scaleSqrt ?
	},
	{
		type: 'higher_lower_cat',
		key: 'population',
		label: 'total number of people',
		unit: 'people',
		text: 'Is the population in {place} higher or lower than {neighbour}?',
		spreadsheetID: 5
	},
	{
		type: 'multi_choice_value',
		key: 'population',
		label: 'total number of people',
		unit: 'people',
		text: 'What is the overall population of {place?',
		spreadsheetID: 6
	},
	{
		type: 'slider',
		key: 'population',
		label: 'number of people',
		unit: ' people',
		text: 'How many people live in {place}?',
		linkText: 'You can read more in our bulletin, Population and household estimates, England and Wales: Census 2021',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/populationandhouseholdestimatesenglandandwales/census2021',
		minVal: 0,
		maxVal: 1100000,
		startVal: 500000,
		formatVal: -3,
		spreadsheetID: "not in there"
	},
	{
		type: 'slider',
		key: 'sex_male',
		label: 'percentage of people who are male',
		unit: '%',
		legendUnit: '%',
		text: 'What percentage of the population in {place} are male?',
		info: 'There were 29,177,200 men, {K04000001,sex_male,1}% of the overall population, in England and Wales in 2021.',
		linkText: 'You can read more in our bulletin, Population and household estimates, England and Wales: Census 2021',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/populationandhouseholdestimatesenglandandwales/census2021',
		formatVal: 1,
		spreadsheetID: 7
	},

	{
		type: 'slider',
		key: 'sex_female',
		label: 'percentage of people who are female',
		unit: '%',
		legendUnit: '%',
		text: 'What percentage of the population in {place} are female?',
		info: 'There were 30,420,100 men, {K04000001,sex_female,1}% of the overall population, in England and Wales in 2021.',
		linkText: 'You can read more in our bulletin, Population and household estimates, England and Wales: Census 2021',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/populationandhouseholdestimatesenglandandwales/census2021',
		formatVal: 1,
		spreadsheetID: 8
	},

	{
		type: 'slider',
		key: 'agemed',
		label: 'average (median) age',
		unit: ' years',
		text: 'What is the median age of people in {place}? The median is the age half way between the very oldest and very youngest people.',
		info: 'That compares with a median age across England and Wales of {K04000001,agemed,1} years.',
		linkText: 'You can read more in our bulletin, Population and household estimates, England and Wales: Census 2021',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/populationandhouseholdestimatesenglandandwales/census2021',
		spreadsheetID: 9
	},

	{
		type: 'slider',
		key: 'age10yr_0-9',
		label: 'in 100 people, the number aged under 10',
		unit: ' people',
		text: 'For every 100 people in {place}, how many are aged under 15 years?',
		formatVal: 1,
		spreadsheetID: 10
	},
	{
		type: 'slider',
		key: 'age10yr_80plus',
		label: 'in 100 people, the number aged under 10',
		unit: ' people',
		text: 'For every 100 people in {place}, how many  are aged 65 years and over?',
		formatVal: 1,
		spreadsheetID: 11
	},
	{
		type: 'true_false_cat',
		key: 'age10yr_0-9',
		keyCompare: 'age10yr_80plus',
		text: 'Is it true that there are more children in {place} aged under 10 years than there are people aged 80 years and over?',
		info: 'Overall in England and Wales, there were more residents aged 65 years (11,063,400) and over than there were children aged under 15 years (10,352,600). (need to change, also, do we have the absolute values or just percentages?)',
		formatVal: 1,
		spreadsheetID: 12
	},
	{
		type: 'true_false_change',
		key: 'household_Single_change',
		text: 'True or false: The proportion of people who have never married or been in a civil partnership in {place} was lower in 2021 than in 2011?',
		info: 'The percentage of single people in England and Wales changed by {K04000001,household_Single_change,1}%',
		spreadsheetID: 19
	},
	{
		type: 'multi_choice_value',
		key: 'ethnicity_black',
		text: 'For every 100 residents in {place}, how many are from the black ethnic group?',
		info: 'In the census, people are grouped into five higher-order, or broad, categories (White; Mixed or Multiple ethnic groups; Asian or Asian British; Black, Black British, Caribbean or African; or Other ethnic group). Within these five groups there are 19 ethnic group classifications.',
		formatVal: 2,
		spreadsheetID: 27
	},
	{
		type: 'multi_choice_cat',
		key: ['religion_Buddist','religion_Hindu','religion_Jewish','religion_Muslim','religion_Sikh'],
		text: 'After Christianity, what is the most common religion in {place}?'
	}
];

export const catLabels = {
	religion_Buddist: "Buddism",
	religion_Hindu: "Hinduism",
	religion_Jewish: "Judaism",
	religion_Muslim: "Islam",
	religion_Sikh: "Sikhism"
}