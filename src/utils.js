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

export const format = (dp = 0, shift = 0, showpos = true) => (val) => {

	dp = typeof dp === "number" ? dp : 0;
	shift = typeof shift === "number" ? shift : 0;
	let val_new = val;
	if (shift) {
		let shifter = Math.pow(10, shift);
		val_new = val_new * shifter;
	}
	if (dp) {
		let multiplier = Math.pow(10, dp);
		val_new = Math.round(val_new * multiplier) / multiplier;
	}
	val_new = val_new.toLocaleString(undefined, {
		minimumFractionDigits: dp > 0 ? dp : 0,
		maximumFractionDigits: dp > 0 ? dp : 0
	});
	if (showpos)
		return (val_new<=0?"":"+") + val_new
	else
		return (val_new)
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

export function getValue(lookup, code, col, dp, shift = 0) {
  let place = lookup[code];
  let value = +place[col];
  return format(+dp, +shift, false)(value);
}

export function parseInfo(lookup, template) {
  let output = template;
  let strs = template.match(new RegExp(/\{(.*?)\}/g));

  if (Array.isArray(strs)) {
    let arrs = strs.map(s => s.slice(1,-1).split(","));

    strs.forEach((s, i) => {
      output = output.replace(s, getValue(lookup, ...arrs[i]));
    });
  }
  
  return output;
}

export function capitalise(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function setStorage(name, value) {
	let val = JSON.stringify(value);
	localStorage.setItem(name, val);
}

export function getStorage(name) {
	if (localStorage.getItem(name)) {
		return JSON.parse(localStorage.getItem(name));
	}
	return null;
}

export function deleteStorage(name) {
	localStorage.removeItem(name);
}

export function makeEmbed(code) {
  return `<iframe id="censusquiz" src="https://www.ons.gov.uk/visualisations/cenusquiz/" width="100%" height="600px" frameborder="0" allow="clipboard-write" allowfullscreen></iframe>
<script>(function(){let f=document.getElementById("censusquiz");f.src=f.src+"?parentUrl="+document.location.href${code ? `+"#${code}"` : ''};})()</script>`;
}

export function copyEmbed() {
  let text = document.getElementById("embed").value;
  console.log(document.getElementById("embed"), text);
  navigator.clipboard.writeText(text);
  analyticsEvent({
    event: "embed"
  });
}

export function analyticsEvent(props) {
  if (window.dataLayer) window.dataLayer.push(props);
}

export function sleep (ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}