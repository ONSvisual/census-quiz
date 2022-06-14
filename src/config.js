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
		key: 'agemed_value_2011_all',
		label: 'average (median) age',
		unit: ' years',
		text: 'What is the average (median) age of people in {place}?'
	},
	{
		key: 'density_value_2011_all',
		label: 'population density (people per hectare)',
		unit: ' people',
		text: 'What is the population density of {place} in people per hectare?',
		scale: scaleSqrt
	},
	{
		key: 'age10yr_perc_2001_0-9',
		label: 'proportion of people aged under 10',
		unit: '%',
		text: 'What proportion of people in {place} are aged under 10?'
	},
	{
		key: 'age10yr_perc_2001_70plus',
		label: 'proportion of people aged over 70',
		unit: '%',
		text: 'What proportion of people in {place} are aged 70 or over?'
	},
	{
		key: 'tenure_perc_2011_owned',
		label: 'proportion of people who own their home',
		unit: '%',
		text: 'What proportion of people in {place} own their home?'
	}
];