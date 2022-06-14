import { csvParse, autoType } from 'd3-dsv';

export async function getData(url) {
	let res = await fetch(url);
	let str = await res.text();
	let data = csvParse(str, autoType);
	return data;
}

export function getQuantile(value, breaks) {
	let brk = 0;
	for (let i = 0; i < (breaks.length - 1); i ++) {
		if (value >= breaks[i]) brk = i;
	}
	return brk;
}

export function distinct(d, i, arr) {
	return arr.indexOf(d) ==  i;
}

export function adjectify(quintile) {
	let quin = +quintile;
	if (quin == 0) {
		return 'much lower than';
	} else if (quin == 1) {
		return 'slightly lower than';
	} else if (quin == 2) {
		return 'around the';
	} else if (quin == 3) {
		return 'slightly higher than';
	} else {
		return 'much higher than';
	}
}