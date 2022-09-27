<script>
	import { setContext, onMount } from "svelte";
	import { feature } from "topojson-client";
	import { urls, questions, catLabels } from "./config";
	import { getData, getBreaks, getQuantile, format, shuffle } from "./utils";

	// UI elements
  import Start from "./sections/Start.svelte";
  import Header from "./sections/Header.svelte";
  import Question from "./sections/Question.svelte";
  import Results from "./sections/Results.svelte";
	import neighbours from "./neighbours.json";

  // Config
	const topojson = "./data/lad-topo-2021.json";

	// STYLE CONFIG
	// Set theme globally (options are defined in config.js)
	let theme = "light";
	setContext("theme", theme);

	// Data
	let data;
	let lookup;
	let geojson;
	let place; // Selected row of data

  // State
	let numberOfQuestions = 8;
	let qNum = 0;
	let answers = [];
	let score = 0;
	let screen = "start";
	let resultsArray = [];

  async function init() {
    geojson = feature(await (await fetch(topojson)).json(), "geog");
    
    let json = await getData(urls.data);
    let hash = window.location.hash.replace("#", "");

    place = json.find((d) => d.code == hash);

    json.sort((a, b) => a.name.localeCompare(b.name));

    let lkp = {};
    json.forEach((d) => {
      questions.forEach((q, i) => {
        let val = d[q.key];
        let vals = json.map((d) => d[q.key]).sort((a, b) => a[q.key] - b[q.key]);
        let breaks = getBreaks(vals);
        let avg = vals[Math.floor(vals.length / 2)];
        d[q.key + "_group"] = val > avg ? "higher" : val < avg ? "lower" : "median";
        d[q.key + "_quintile"] = getQuantile(d[q.key], breaks).toString();
      });
      
      lkp[d.code] = d;
    });
    data = json;
    lookup = lkp;
  }

	function startQuiz(all_questions = false) {
    const types = ["slider", "sort", "higher_lower_avg"];

		let ans = [];
    numberOfQuestions = all_questions ? questions.length : 8;
		
    let filtered = questions.filter(q => types.includes(q.type))
    let qs = all_questions ? filtered : shuffle(filtered).slice(0, numberOfQuestions);
    
		qs.forEach((q, i) => {
			let f = q.formatVal ? format(q.formatVal) : format(0);
			let sorted = [...data].sort((a, b) => a[q.key] - b[q.key]);
			let vals = sorted.map((d) => d[q.key]);
			let len = vals.length;
			let val = q.type == "higher_lower" ? null : q.startVal != undefined ? q.startVal : +f(vals[Math.floor(len / 2)]);
			let neighboursRand = shuffle(neighbours[place.code].filter((n) => data.map((d) => d.code).includes(n))).slice(0, 2).map((d) => lookup[d]);
			let obj = {
				...q,
				options: shuffle([...neighboursRand, place]),
				comparator: sorted[Math.floor(len / 2)],
				vals: vals,
				breaks: getBreaks(vals),
				min: q.minVal != undefined ? q.minVal : Math.floor(vals[0]),
				max: q.maxVal != undefined ? q.maxVal : Math.ceil(vals[len - 1]),
				avg: vals[Math.floor(len / 2)],
				val: val,
				set: false,
			};
			ans.push(obj);
		});

		answers = ans;
    qNum = 0;
		screen = "question";
	}

	function updateHash(place) {
		console.log('updating hash');
		history.replaceState(undefined, undefined, place ? '#' + place.code : '.');
		console.log(place);
	}

	$: data && updateHash(place);

  onMount(init);
</script>

<!-- <ONSHeader filled={true} center={false} /> -->

<svelte:body bind:this={main} />

<!-- <AnalyticsBanner {analyticsId} {analyticsProps} noBanner bind:gtag/> -->

<main>
  {#if data && geojson}
    {#if screen === "start"}
      <Start
        {data} {geojson} bind:place
        on:start={() => startQuiz()} on:qa={() => startQuiz(true)}/>
    {:else}
      <Header {place} {numberOfQuestions} {qNum}/>
    {/if}
    {#if screen === "question"}
      <Question
        {data} {place} {answers} bind:qNum bind:resultsArray
        on:end={() => screen = 'results'}/>
    {:else if screen === "results"}
      <Results {numberOfQuestions} {score} {resultsArray}
        on:restart={() => screen = "start"}/>
    {/if}
  {/if}
</main>
