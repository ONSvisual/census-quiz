<script>
	import { setContext, onMount } from "svelte";
	import { feature } from "topojson-client";
	import { urls, questions, catLabels } from "./config";
	import neighbours from "./neighbours.json";
	import { getData, getBreaks, getQuantile, format, shuffle, getStorage, setStorage, analyticsEvent } from "./utils";

	// UI elements
  import Start from "./sections/Start.svelte";
  import Header from "./sections/Header.svelte";
  import Question from "./sections/Question.svelte";
  import Results from "./sections/Results.svelte";
  import Background from "./ui/Background.svelte";
  import Analytics from "./ui/Analytics.svelte";

  // Config
	const topojson = "./data/lad-topo-2021.json";

  // Analytics
  const analyticsId = "GTM-MBCBVQS";
  const analyticsProps = {
    contentTitle: "Census Quiz",
		releaseDate: "20220628",
		contentType: "game",
		outputSeries: "census2021quizhowwelldoyouknowyourarea"
  }

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
    json = json.filter(d => ["E06", "E07", "E08", "E09", "W06"].includes(d.code.slice(0, 3)));

    // Select area based on URL hash (parent hash overrides self)
    let parent = new URLSearchParams(document.location.search).get("parentUrl");
    let parent_hash = parent ? parent.split("#")[1] : null;
    let self_hash = document?.location?.hash;
    if (parent_hash && parent_hash.length === 9) {
      place = json.find((d) => d.code === parent_hash);
    } else if (self_hash && self_hash.length === 10 && self_hash !== "#undefined") {
      let hash = self_hash.replace("#", "");
      place = json.find((d) => d.code === hash);
    }

    data = json;
    lookup = lkp;
  }

	function startQuiz(all_questions = false) {
    const played = getStorage("census-quiz")?.played;
    const types = ["slider", "sort", "higher_lower_avg", "multi_choice_value", "multi_choice_cat", "higher_lower_cat", "true_false_change", "true_false_cat"];

    score = 0;
		
    let filtered = place.code[0] === "W" ? 
      questions.filter(q => types.includes(q.type) && q.countryOnly !== "England") : 
      questions.filter(q => types.includes(q.type) && q.countryOnly !== "Wales");
    let ordered = all_questions || !played ? filtered : shuffle(filtered);

    numberOfQuestions = all_questions ? ordered.length : 8;

    let qs = [];
    if (all_questions) {
      qs = ordered;
    } else if (!played) {
      qs = ordered.slice(0, numberOfQuestions);
    } else {
      let clashes = [];
      let i = 0;
      while (qs.length < numberOfQuestions) {
        let clashID = ordered[i].clashID;
        if (!clashID) {
          qs.push(ordered[i]);
        } else if (!clashes.includes(clashID)) {
          qs.push(ordered[i]);
          clashes.push(clashID);
        }
        i ++;
      }
    }

    let ans = [];

		qs.forEach((qRaw, i) => {
      let q = JSON.parse(JSON.stringify(qRaw));
      let formatArgs = [q.formatVal ? q.formatVal : 0, q.shiftVal ? q.shiftVal : 0, q.minVal < 0 || (q.type.includes("_change") && q.type !== "true_false_change") || [2].includes(q.QA_ID) ? true : false];
      let f = format(...formatArgs);

      if (q.keyText) {
        let i = Math.floor(Math.random() * q.key.length);
        q.text = q.text.replace("{keyText}", q.keyText[i]);
        q.label = q.label.replace("{keyText}", q.keyText[i]);
        if (q.info)  q.info = q.info.replace("{keyText}", q.keyText[i]).replace("{key}", q.key[i]);
        if (q.infoWales) q.infoWales = q.infoWales.replace("{keyText}", q.keyText[i]).replace("{key}", q.key[i]);
        q.key = q.key[i];
      }

      let obj = {
        ...q,
        format: f,
        set: false
      };

      if (q.type === "slider" || q.type === "higher_lower_avg" || q.type === "multi_choice_value") {
        let sorted = [...data].sort((a, b) => a[q.key] - b[q.key]);
        let vals = sorted.map((d) => d[q.key]);
        let len = vals.length;
        let val = q.startVal != undefined ? q.startVal : vals[Math.floor(len / 2)];
        let avgCode = q.countryOnly === "England" ? "E92000001" : q.countryOnly === "Wales" ? "W92000004" : "K04000001";

        if (q.type === "slider") {
          // Calculate the min/max/avg/default for the slider
          let format_ans = format(formatArgs[0] + formatArgs[1]);
          let ans = place[q.key];
          let max = q.maxVal != undefined ? q.maxVal : Math.ceil(vals[len - 1]);
          let min = q.minVal != undefined ? q.minVal : Math.floor(vals[0]);
          let plusminus = ((max-min)/100) * 5;
          let ansMin = +format_ans(ans - plusminus < vals[0] ? vals[0] : ans - plusminus).replaceAll(",","");
          let ansMax = +format_ans(ans + plusminus > vals[len-1] ? vals[len-1] : ans + plusminus).replaceAll(",","");
          
          obj = {
				    ...obj, vals, val,
            breaks: getBreaks(vals, 4),
            ans,
            min,
            max,
            ansMin,
            ansMax,
            avg: lookup[avgCode][q.key]
          };
        } else if (q.type === "higher_lower_avg") {
          // Get the median place as a comparator
          obj = {
            ...obj,
            comparator: lookup[avgCode]
          };

        } else if (q.type === "multi_choice_value") {
          // Get 4 places with a spread of values from the minimum to the maximum
          let brks = [2, Math.floor(len * (1 / 3)), Math.floor(len * (2 / 3)), len - 3];
          let options = brks.map(b => sorted[b]);

          // Find which value is closest to the actual value, then replace it with selected place
          let diffs = options.map(o => Math.abs(o[q.key] - place[q.key]));
          let index = diffs.indexOf(Math.min(...diffs)); 
          options[index] = place;
          
          obj = {
            ...obj,
            options: options.sort((a, b) => a[q.key] - b[q.key])
          };
        }

      } else if (q.type === "sort") {
        // Get 2 random neighbours with different values for the selected variable
        let neighboursAll = shuffle(neighbours[place.code].filter((n) => data.map((d) => d.code).includes(n)).map((d) => lookup[d]));
        let neighboursSelected = [];
        let i = 0;
        while (neighboursSelected.length < 2) {
          let n = neighboursAll[i];
          if (!(n[q.key] === place[q.key] || (neighboursSelected[0] && n[q.key] === neighboursSelected[0][q.key]))) neighboursSelected.push(n);
          i ++;
        }
        shuffle(neighboursAll).forEach((n, i) => {
          
        });
        obj = {
          ...obj,
          options: shuffle([...neighboursSelected, place])
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
          options: [...options].sort((a, b) => a.label.localeCompare(b.label)),
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
    analyticsEvent({
			event: "gameStart",
			place: place.name
		});
	}

  function endQuiz() {
    const played = getStorage("census-quiz")?.played;
    if (!played) setStorage("census-quiz", {played: true});
    screen = 'results';
    analyticsEvent({
			event: "gameEnd",
			place: place.name,
      score: score
		});
  }

  onMount(init);
</script>

<!-- <ONSHeader filled={true} center={false} /> -->

<svelte:body bind:this={main} />

<Analytics {analyticsId} {analyticsProps}/>

<main style="{screen === 'start' ? '' : 'background: white'}">
  <Background offset={qNum / (numberOfQuestions - 1)} zoom={["start", "results"].includes(screen)}/>
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
        {data} {lookup} {place} {answers} bind:score bind:qNum
        on:end={endQuiz}/>
    {:else if screen === "results"}
      <Results {numberOfQuestions} {score} {answers} {place}
        on:restart={() => screen = "start"}/>
    {/if}
  {/if}
</main>
