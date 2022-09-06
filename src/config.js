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

export let urls = {
	data: 'https://bothness.github.io/geo-data/csv/census2011_lad2020.csv'
}

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
	{
		type: 'slider',
		key: 'population_value_change_all',
		label: 'population percentage change',
		unit: '%',
		text: 'By what percentage has the population of {place} increased or decreased between the 2011 and 2021 censuses?',
		linkText: 'Learn more about population estimates',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates',
		formatVal: 1
	},
	{
		type: 'sort',
		key: "population_value_2011_all",
		text: "Sort these local authorities in order of population, highest to lowest:",
		unit: " people"
	},
	{
		type: 'higher_lower',
		key: 'population_value_change_all',
		label: 'population change from 2001',
		unit: '%',
		text: 'Has the population in {place} grown more or less than average since 2001?'
	},
	{
		type: 'slider',
		key: 'tenure_perc_2011_owned',
		label: 'proportion of people who own their home',
		//does this include people who have paid off their mortgage? or do they come under "rent free"?
		unit: '%',
		text: 'What percentage of people in {place} own their own home?',
		linkText: 'Learn more about dwellings and households by tenure',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
	},
	{
		type: 'slider',
		key: 'tenure_perc_2011_rented_private',
		//is this obvious what is meant? 
		label: 'proportion of people who rent privately',
		unit: '%',
		text: 'What percentage of people in {place} rent their home privately?',
		linkText: 'Learn more about dwellings and households by tenure',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
	},
	{
		type: 'slider',
		key: 'tenure_perc_2011_owned',
		//is this obvious what is meant? 
		label: 'proportion of people who rent privately',
		unit: '%',
		text: 'What percentage of people in {place} rent their home privately?',
		linkText: 'Learn more about dwellings and households by tenure',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
	},
	{
		type: 'slider',
		key: 'tenure_perc_change_owned',
		label: 'change in proportion of people who own their home',
		unit: '%',
		text: 'How has the percentage of people who own their own homes in {place} changed?',
		linkText: 'Learn more about dwellings and households by tenure',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
	},
	{
		type: 'slider',
		key: 'density_value_2011_all',
		label: 'population density (people per hectare)',
		unit: ' people',
		text: 'What is the population density of {place} in people per hectare?',
		// WHAT IS A HECTARE? give in a better comparison? football pitches?
		scale: scaleSqrt
	},
	{
		type: 'slider',
		key: 'travel_perc_change_home',
		// is this what I think it is?
		label: 'change in percentage of people who work from home',
		unit: '%',
		text: 'How has the percentage of people who work from home in {place} changed in the last 10 years?',
	},
	{
		type: 'slider',
		key: 'travel_perc_2001_car_van',
		label: 'change in percentage of people who travel to work by car or van',
		unit: '%',
		text: 'How has the percentage of people who travel to work by car or van from {place} changed in the last 10 years?',
		// from or in? In implies that they work in {place} but may not live there
	},
	{
		type: 'slider',
		key: 'travel_perc_change_bicycle',
		label: 'change in percentage of people who travel to work by bicycle',
		unit: '%',
		text: 'How has the percentage of people who travel to work by bicycle from {place} changed in the last 10 years?',
		// from or in? In implies that they work in {place} but may not live there
	},
	{
		type: 'higher_lower',
		key: "population_value_2011_all",
		label: "number of people",
		unit: " people",
		text: "Are there more people living in {place} or {neighbour}?"
	},
	{
		type: 'slider',
		key: 'population_value_2011_all',
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
	{
		type: 'slider',
		key: 'population_perc_2011_male',
		label: 'proportion of people who are male',
		unit: '%',
		text: 'What percentage of people in {place} are male?',
		//could also do: What is the percentage point difference between men and women in {place}? (negative indicates more women than men - should probably better label the axis)
		linkText: 'Learn more about households by tenure',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020',
		formatVal: 1
	},

	{
		type: 'slider',
		key: 'agemed_value_2011_all',
		label: 'average (median) age',
		unit: ' years',
		text: 'What is the average (median) age of people in {place}?',
		linkText: 'Learn more about the median age of people across England and Wales',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates'
	},

	{
		type: 'slider',
		key: 'age10yr_perc_2001_0-9',
		label: 'percentage of people aged under 10',
		unit: '%',
		text: 'What percentage of people in {place} are aged under 10?'
	},
	{
		type: 'slider',
		key: 'age10yr_perc_2001_70plus',
		label: 'percentage of people aged 70 or over',
		unit: '%',
		text: 'What percentage of people in {place} are aged 70 years or over?',
		formatVal: 1
	}
];