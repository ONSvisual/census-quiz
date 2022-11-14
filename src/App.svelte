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
    const types = ["slider", "sort", "higher_lower_avg", "multi_choice_value", "multi_choice_cat", "higher_lower_cat", "true_false_change", "true_false_cat"];

    score = 0;

		let ans = [];
		
    let filtered = questions.filter(q => types.includes(q.type));
    numberOfQuestions = all_questions ? filtered.length : 8;

    let qs = all_questions ? filtered : shuffle(filtered).slice(0, numberOfQuestions);
    
		qs.forEach((qRaw, i) => {
      let q = JSON.parse(JSON.stringify(qRaw));
      let formatArgs = [q.formatVal ? q.formatVal : 0, q.shiftVal ? q.shiftVal : 0];
      let f = format(...formatArgs);

      if (q.keyText) {
        let i = Math.floor(Math.random() * q.key.length);
        q.text = q.text.replace("{keyText}", q.keyText[i]);
        q.label = q.label.replace("{keyText}", q.keyText[i]);
        q.info = q.info.replace("{keyText}", q.keyText[i]).replace("{key}", q.key[i]);
        if (q.infoWales) q.infoWales = q.infoWales.replace("{keyText}", q.keyText[i]).replace("{key}", q.key[i]);
        q.key = q.key[i];
      }

      let obj = {
        ...q,
        format: f,
        set: false
      };

      console.log(q)

      if (q.type === "slider" || q.type === "higher_lower_avg" || q.type === "multi_choice_value") {
        let sorted = [...data].sort((a, b) => a[q.key] - b[q.key]);
        let vals = sorted.map((d) => d[q.key]);
        let len = vals.length;
        let val = q.startVal != undefined ? q.startVal : vals[Math.floor(len / 2)];

        if (q.type === "slider") {
          // Calculate the min/max/avg/default for the slider
          let ans = place[q.key];
          let max = q.maxVal != undefined ? q.maxVal : Math.ceil(vals[len - 1]);
          let min = q.minVal != undefined ? q.minVal : Math.floor(vals[0]);
          let plusminus = ((max-min)/100) * 5;
          let ansMin = ans - plusminus < vals[0] ? vals[0] : ans - plusminus;
          let ansMax = ans + plusminus > vals[len-1] ? vals[len-1] : ans + plusminus;

          obj = {
				    ...obj, vals, val,
            breaks: getBreaks(vals, 4),
            ans,
            min,
            max,
            ansMin,
            ansMax,
            avg: vals[Math.floor(len / 2)]
          };
        } else if (q.type === "higher_lower_avg") {
          // Get the median place as a comparator
          obj = {
            ...obj,
            comparator: sorted[Math.floor(len / 2)]
          };
        } else if (q.type === "multi_choice_value") {
          // Get a random place from each quartile (included selected place)
          let brks = [0, Math.floor(len * 0.25), Math.floor(len * 0.5), Math.floor(len * 0.75), len];
          let index = vals.indexOf(val);
          let options = [place];
          
          for (let i = 1; i <= 4; i ++) {
            if (!(index > brks[i - 1] && index <= brks[i]) && !(index == 0 && brks[i - 1] == 0)) {
              let rand = Math.floor(Math.random() * brks[1]) + brks[i - 1];
              options.push(sorted[rand]);
            }
          }
          obj = {
            ...obj,
            options: options.slice(0, 4).sort((a, b) => a[q.key] - b[q.key])
          };
        }

      } else if (q.type === "sort") {
        // Get 2 random neighbours
        let neighboursRand = shuffle(neighbours[place.code].filter((n) => data.map((d) => d.code).includes(n))).slice(0, 2).map((d) => lookup[d]);
        obj = {
          ...obj,
          options: shuffle([...neighboursRand, place])
        };

      } else if (q.type === "higher_lower_cat" || q.type === "true_false_cat") {
        // Get the value of the category (option) and the one it's being compared to (comparator)
        obj = {
          ...obj,
          option: {key: q.key, value: place[q.key], label: catLabels[q.key]},
          comparator: {key: q.keyCompare, value: place[q.keyCompare], label: catLabels[q.keyCompare]}
        };

      } else if (q.type === "multi_choice_cat") {
        // Get highest 4 categories by their value in the selected place
        let options = q.key
          .map(key => ({key, label: catLabels[key], value: place[key]}))
          .sort((a, b) => b.value - a.value);
        let option = options[0]; // Correct answer (highest value of the selected categories)
        options = options.length > 4 ? options.slice(0,4) : options;
        obj = {
          ...obj, option,
          optionsSorted: options,
          options: shuffle(options),
        };

      } else if (q.type === "true_false_change") {
        // Get the value of the change
        obj = {
          ...obj,
          option: {key: q.key, value: place[q.key]}
        }
      }

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

<main style="{screen === 'start' ? '' : 'background: white'}">
  {#if data && geojson}
    {#if screen === "start"}
      <Start
        {data} {geojson} bind:place
        on:start={() => startQuiz()} on:qa={() => startQuiz(true)}/>
    {:else}  
      <Header {place} {numberOfQuestions} bind:qNum/>
    {/if}
    {#if screen === "question"}
      <Question
        {data} {place} {answers} bind:score bind:qNum
        on:end={() => screen = 'results'}/>
    {:else if screen === "results"}
      <Results {numberOfQuestions} {score} {answers} {place}
        on:restart={() => screen = "start"}/>
    {/if}
  {/if}
</main>
