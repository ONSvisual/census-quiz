import { csvParse, autoType } from "d3-dsv";

export async function getData(url) {
	let res = await fetch(url);
	let str = await res.text();
	let data = csvParse(str, autoType);
	return data;
}

export function getBreaks(vals, count = 5) {
	let breaks = [vals[0]];
	let len = vals.length;
	for (let i = 1; i <= count; i ++) {
		breaks.push(vals[Math.floor(len * (i / count))])
	}
	return breaks;
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

export const format = (dp = 0) => (val) => {
  dp = typeof dp === "number" ? dp : null;
  if (dp === null) {
    return val.toLocaleString();
  } else {
    let multiplier = Math.pow(10, dp);
    let rounded = Math.round(val * multiplier) / multiplier;
    return rounded.toLocaleString(undefined, {
      minimumFractionDigits: dp > 0 ? dp : 0,
      maximumFractionDigits: dp > 0 ? dp : 0
    });
  }
}

export function higherLower(val, text = ["higher than", "lower than", "the same as"]) {
	if (val > 0) {
		return text[0]
	} else if (val < 0) {
		return text[1]
	} else {
		return text[2]
	}
}

export function shuffle(array, random = Math.random) {
	return array
	.map(value => ({ value, sort: random() }))
	.sort((a, b) => a.sort - b.sort)
	.map(({ value }) => value);
}

export function getValue(dataset, code, col, dp, divisor = 1) {
  let place = dataset.find(d => d.code == code);
  let value = +place[col];
  return format(+dp)(value / +divisor);
}

export function parseInfo(dataset, template) {
  let output = template;
  let strs = template.match(new RegExp(/\{(.*?)\}/g));

  if (Array.isArray(strs)) {
    let arrs = strs.map(s => s.slice(1,-1).split(","));

    strs.forEach((s, i) => {
      output = output.replace(s, getValue(dataset, ...arrs[i]));
    });
  }
  
  return output;
}