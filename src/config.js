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

export const questions = [
	{
		type: 'sort',
		key: "population_value_2011_all",
		text: "Sort these local authorities in order of population, highest to lowest:",
		unit: " people",
	},
	{
		type: 'slider',
		key: 'population_value_change_all',
		label: 'population percentage change',
		unit: '%',
		text: 'How has the population in {place} changed in the last 10 years?',
		linkText: 'Learn more about population estimates here',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates',
		formatVal: 1
	},
	{
		type: 'higher_lower',
		key: 'population_value_change_all',
		label: 'population change from 2001',
		unit: '%',
		text: 'Has the population in {place} grown more or less than {neighbour} since 2001?'
	},
	{
		type: 'higher_lower',
		key: "population_value_2011_all",
		label: "number of people",
		unit: " people",
		text: "Is the population in {place} higher or lower than {neighbour}?"
	},
	{
		type: 'slider',
		key: 'population_value_2011_all',
		label: 'number of people',
		unit: ' people',
		text: 'What is overall population of {place}? (should this be a "rank" or replaced with the people per hectare?)',
		linkText: 'Learn more about population estimates here',
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
		text: 'What percentage of the population in {place} are Male?',
		//could also do: What is the percentage point difference between men and women in {place}? (negative indicates more women than men - should probably better label the axis)
		linkText: 'Learn more about households by tenure here',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020',
		formatVal: 1
	},
	{
		type: 'slider',
		key: 'tenure_perc_2011_owned',
		label: 'proportion of people who own their home',
		unit: '%',
		text: 'What percentage of people in {place} own their own home? (this could also be phrased in terms of renting, should maybe explain the other categories? could include follow up question of how has this changed in the last 10 years?)',
		linkText: 'Learn more about dwellings and households by tenure here',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/researchoutputssubnationaldwellingstockbytenureestimatesengland2012to2015/2020'
	},
	{
		type: 'slider',
		key: 'agemed_value_2011_all',
		label: 'average (median) age',
		unit: ' years',
		text: 'What is the average (median) age of people in {place}?',
		linkText: 'Learn more about the median age of people across England and Wales here',
		linkURL: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates'
	},
	{
		type: 'slider',
		key: 'density_value_2011_all',
		label: 'population density (people per hectare)',
		unit: ' people',
		text: 'What is the population density of {place} in people per hectare?',
		scale: scaleSqrt
	},
	{
		type: 'slider',
		key: 'age10yr_perc_2001_0-9',
		label: 'proportion of people aged under 10',
		unit: '%',
		text: 'What proportion of people in {place} are aged under 10?'
	},
	{
		type: 'slider',
		key: 'age10yr_perc_2001_70plus',
		label: 'proportion of people aged over 70',
		unit: '%',
		text: 'What proportion of people in {place} are aged 70 or over?'
	}
];