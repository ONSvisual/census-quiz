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
    const types = ["slider", "sort", "higher_lower_avg", "multi_choice_value", "multi_choice_cat"];

		let ans = [];
		
<<<<<<< HEAD
    let filtered = questions.filter(q => types.includes(q.type));
    numberOfQuestions = all_questions ? filtered.length : 8;
    
=======
    let filtered = questions.filter(q => types.includes(q.type))
>>>>>>> 3802d67bbf14665548935caddc4cb0a551dd7beb
    let qs = all_questions ? filtered : shuffle(filtered).slice(0, numberOfQuestions);
    
		qs.forEach((q, i) => {
      let f = q.formatVal ? format(q.formatVal) : format();
      let obj = {
        ...q,
        set: false
      };

      if (q.type === "slider" || q.type === "higher_lower_avg" || q.type === "multi_choice_value") {
        let sorted = [...data].sort((a, b) => a[q.key] - b[q.key]);
        let vals = sorted.map((d) => d[q.key]);
        let len = vals.length;
        let val = q.startVal != undefined ? q.startVal : +f(vals[Math.floor(len / 2)]);

        if (q.type === "slider") {
          // Calculate the min/max/avg/default for the slider
          obj = {
				    ...obj, vals, val,
            breaks: getBreaks(vals, 4),
            min: q.minVal != undefined ? q.minVal : Math.floor(vals[0]),
            max: q.maxVal != undefined ? q.maxVal : Math.ceil(vals[len - 1]),
            avg: vals[Math.floor(len / 2)]
          };
        } else if (q.type === "higher_lower_avg") {
          // Get the median place as a comparator
          obj = {
            ...obj,
            comparator: sorted[Math.floor(len / 2)]
          };
        } else if (q.type === "multi_choice_value") {
          // Get a random place from each quartile
          let brks = [0, Math.floor(len * 0.25), Math.floor(len * 0.5), Math.floor(len * 0.75), len];
          let options = [place];
          for (let i = 1; i <= 4; i ++) {
            if (!(val >= vals[brks[i - 1]] && val <= vals[brks[i]])) {
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
      } else if (q.type === "higher_lower_cat") {
        // insert function here

      } else if (q.type === "multi_choice_cat") {
        // Get highest 4 categories by their value in the selected place
        let options = q.key
          .map(key => ({key, label: catLabels[key], value: place[key]}))
          .sort((a, b) => b.value - a.value);
        let option = options[0]; // Correct answer (highest value of the selected categories)
        options = options.length > 4 ? options.slice(0,4) : options;
        obj = {
          ...obj, option,
          options: shuffle(options)
        };
      } else if (q.type === "true_false_change") {
        // insert function here
      } else if (q.type === "true_false_cat") {
        // insert function here
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

<main>
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
        {data} {place} {answers} bind:qNum bind:resultsArray
        on:end={() => screen = 'results'}/>
    {:else if screen === "results"}
      <Results {numberOfQuestions} {score} {resultsArray}
        on:restart={() => screen = "start"}/>
    {/if}
  {/if}
</main>
