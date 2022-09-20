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
	//	info: additional information to be displayed in the reveal
	//	infoWales: as above but text to override if {place} is in Wales
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
		type: 'higher_lower',
		key: 'population_change',
		label: 'population change from 2001',
		unit: '%',
		legendUnit: '%',
		text: 'Has the population in {place} grown more or less than average since 2001?',
		info: 'Across England and Wales, the population grew by 6.3% between 2011 and 2021. The largest percentage increase in England was in Tower Hamlets, (22.1%) and the largest decrease was in Kensington and Chelsea, down by 9.6%.',
		infoWales: 'Across England and Wales, the population grew by 6.3% between 2011 and 2021. The largest increase in Wales was in Newport (9.5%) while the largest decrease was in Ceredigion (down by 5.8%).',
		linkText: 'You can read more in our bulletin, Population and household estimates, England and Wales: Census 2021',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/populationandhouseholdestimatesenglandandwales/census2021',
		spreadsheetID: 3
	},
	// {
	// 	type: 'slider',
	// 	key: 'tenure_owned',
	// 	label: 'proportion of people who own their home',
	// 	//does this include people who have paid off their mortgage? or do they come under "rent free"?
	// 	unit: '%',
	// 	legendUnit: '%',
	// 	text: 'What percentage of people in {place} own their own home?',
	// 	linkText: 'Learn more about dwellings and households by tenure',
	// 	linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
	// },
	// {
	// 	type: 'slider',
	// 	key: 'tenure_rented_private',
	// 	//is this obvious what is meant? 
	// 	label: 'proportion of people who rent privately',
	// 	unit: '%',
	// 	legendUnit: '%',
	// 	text: 'What percentage of people in {place} rent their home privately?',
	// 	linkText: 'Learn more about dwellings and households by tenure',
	// 	linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
	// },
	// {
	// 	type: 'slider',
	// 	key: 'tenure_owned',
	// 	//is this obvious what is meant? 
	// 	label: 'proportion of people who rent privately',
	// 	unit: '%',
	// 	legendUnit: '%',
	// 	text: 'What percentage of people in {place} rent their home privately?',
	// 	linkText: 'Learn more about dwellings and households by tenure',
	// 	linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
	// },
	// {
	// 	type: 'slider',
	// 	key: 'tenure_owned_change',
	// 	label: 'change in proportion of people who own their home',
	// 	unit: '%',
	// 	legendUnit: '%',
	// 	customMarker: '0',
	// 	text: 'How has the percentage of people who own their own homes in {place} changed?',
	// 	linkText: 'Learn more about dwellings and households by tenure',
	// 	linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
	// },
	{
		type: 'slider',
		key: 'density_fp',
		label: 'population density (people per footbal pitch)',
		unit: ' people',
		text: 'How many people are there per football pitch in {place}?',
		info: 'That compares with 434 residents per square kilometre in England in 2021, up from 407 per square kilometre in 2011.',
		infoWales: ' There were about 150 residents per square kilometre in Wales in 2021, up from 148 residents per square kilometre in 2011.',
		linkText: 'You can read more in our bulletin, Population and household estimates, England and Wales: Census 2021',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/populationandhouseholdestimatesenglandandwales/census2021',
		spreadsheetID: 4
		// scale: scaleSqrt ?
	},
	// {
	// 	type: 'slider',
	// 	key: 'travel_perc_change_home',
	// 	// is this what I think it is?
	// 	label: 'change in percentage of people who work from home',
	// 	unit: '%',
	//	legendUnit: '%',
	// 	text: 'How has the percentage of people who work from home in {place} changed in the last 10 years?',
	// },
	// {
	// 	type: 'slider',
	// 	key: 'travel_car_van_change',
	// 	label: 'change in percentage of people who travel to work by car or van',
	// 	unit: '%',
	// 	legendUnit: '%',
	// 	customMarker: '0',
	// 	text: 'How has the percentage of people who travel to work by car or van from {place} changed in the last 10 years?',
	// 	// from or in? In implies that they work in {place} but may not live there
	// },
	// {
	// 	type: 'slider',
	// 	key: 'travel_bicycle_change',
	// 	label: 'change in percentage of people who travel to work by bicycle',
	// 	unit: '%',
	// 	legendUnit: '%',
	// 	customMarker: '0',
	// 	text: 'How has the percentage of people who travel to work by bicycle from {place} changed in the last 10 years?',
	// 	// from or in? In implies that they work in {place} but may not live there
	// },
	{
		type: 'slider',
		key: 'population',
		label: 'number of people',
		unit: ' people',
		text: 'How many people live in {place}?',
		linkText: 'Learn more about population estimates',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates',
		minVal: 0,
		maxVal: 1100000,
		startVal: 500000,
		formatVal: -3
	},
	// {
	// 	type: 'slider',
	// 	key: 'population_male',
	// 	label: 'proportion of people who are male',
	// 	unit: '%',
	//	legendUnit: '%',
	// 	text: 'What percentage of people in {place} are male?',
	// 	//could also do: What is the percentage point difference between men and women in {place}? (negative indicates more women than men - should probably better label the axis)
	// 	linkText: 'Learn more about households by tenure',
	// 	linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020',
	// 	formatVal: 1
	// },

	{
		type: 'slider',
		key: 'agemed',
		label: 'average (median) age',
		unit: ' years',
		text: 'What is the average (median) age of people in {place}?',
		linkText: 'Learn more about the median age of people across England and Wales',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates'
	},

	{
		type: 'slider',
		key: 'age10yr_0-9',
		label: 'percentage of people aged under 10',
		unit: '%',
		legendUnit: '%',
		text: 'What percentage of people in {place} are aged under 10?'
	},
	{
		type: 'slider',
		key: 'age10yr_80plus',
		label: 'percentage of people aged 80 or over',
		unit: '%',
		legendUnit: '%',
		text: 'What percentage of people in {place} are aged 80 years or over?',
		formatVal: 1
	}
];