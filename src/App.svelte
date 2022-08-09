<script>
  import { setContext, onMount } from "svelte";
  import { themes, urls, questions, colors } from "./config";
  import { getData, getQuantile, adjectify, distinct, format, higherLower } from "./utils";

  // Layout components
  import Filler from "./Filler.svelte";

  // UI elements
  import Icon from "./ui/Icon.svelte";

  import SliderWrapper from "./SliderWrapper.svelte";

  import Map from "./Map.svelte";

  // Data
  import neighbours from "./neighbours_6.json";

  // STYLE CONFIG
  // Set theme globally (options are defined in config.js)
  let theme = "light";
  setContext("theme", theme);

  // STATE
  let data;
  let lookup;
  let place; // Selected row of data
  let answers = [];
  let score = 0;
  let complete = false;
  let screen = "start";
  let questionNum = 0;
  let resultsArray = [];
  let tooltip = false;
  let neighbourList;
  let neighbourListFull;

  function guess(i, correct) {

    answers[i].correct = correct;
    answers[i].set = true;
    score += answers[i].correct ? 1 : 0;

    let comp = true;
    answers.forEach((a) => {
      if (!a.set) comp = false;
    });
    complete = comp;

    resultsArray.push(answers[i].correct);

  }

  function guessPercent(i) {

    let vals = answers[i].vals;
    let len = vals.length;
    let plusminus = Math.round(0.15 * len); // Equivalent to +/- 15 percentiles
    let index = vals.indexOf(place[questions[i].key]);
    let max =
      index + plusminus >= len ? vals[len - 1] : vals[index + plusminus];
    let min = index - plusminus < 0 ? vals[0] : vals[index - plusminus];

	let correct = answers[i].val >= min && answers[i].val <= max;

    guess(i, correct);

  }

  function guessHigherLower(i, hl) {

	let neighbour = lookup[answers[i].neighbour];
	let key = questions[i].key;

	let correct = hl == "higher" && place[key] >= neighbour[key] || hl == "lower" && place[key] <= neighbour[key];

	guess(i, correct)

  }


  function reset() {
    answers.forEach((a, i) => {
      answers[i].set = false;
      score = 0;
    });
    screen = "start";
    questionNum = 0;
    resultsArray = [];
    console.log(place);
  }

  function nextQuestion() {
    questionNum++;
    // console.log(answers);
  }

  function copyResults(results) {
    tooltip = true;
    setTimeout(async () => {
      tooltip = false;
    }, 400);

    var copyString =
      "I scored " +
      score +
      " out of " +
      questions.length +
      " in the ONS 'How Well Do You Know Your Area' quiz for " +
      place.name +
      ". " +
      results;

    if (!navigator.clipboard) {
      copyResultsFallback(copyString);
      return;
    }
    navigator.clipboard.writeText(copyString).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
        console.log(copyString);
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }

  function copyResultsFallback(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      console.log("Fallback: Copying text command was " + msg);
      console.log(copyString);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  }

  getData(urls.data).then((json) => {

    let hash = window.location.hash.replace("#", "");

    place = json.find((e) => e.code == hash);

    place = place ? place : json[Math.floor(Math.random() * json.length)];

    json.sort((a, b) => a.name.localeCompare(b.name));
    let ans = [];
    questions.forEach((q) => {
	  let f = q.formatVal ? format(q.formatVal) : format(0);
      let vals = json.map((d) => d[q.key]).sort((a, b) => a - b);
      let len = vals.length;
	  let randomNeighbour = neighbours[place.code][Math.floor(Math.random() * neighbours[place.code].length)];
      let obj = {
		neighbour: randomNeighbour,
        vals: vals,
        breaks: [
          vals[0],
          vals[Math.floor(len * 0.2)],
          vals[Math.floor(len * 0.4)],
          vals[Math.floor(len * 0.6)],
          vals[Math.floor(len * 0.8)],
          vals[len - 1],
        ],
        min: q.minVal != undefined ? q.minVal : Math.floor(vals[0]),
        max: q.maxVal != undefined ? q.maxVal : Math.ceil(vals[len - 1]),
        avg: vals[Math.floor(len / 2)],
        // val: (Math.floor(vals[0]) + Math.ceil(vals[len - 1])) / 2,
        val: q.startVal != undefined ? q.startVal : +f(vals[Math.floor(len / 2)]),
        set: false,
      };
      ans.push(obj);
    });
    answers = ans;

    console.log(answers);

	let lkp = {};

    json.forEach((d) => {
      questions.forEach((q, i) => {
        let val = d[q.key];
        let avg = answers[i].avg;
        d[q.key + "_group"] =
          val > avg ? "higher" : val < avg ? "lower" : "median";
        d[q.key + "_quintile"] = getQuantile(
          d[q.key],
          answers[i].breaks
        ).toString();
      });

	  lkp[d.code] = d;

    });
    data = json;
	lookup = lkp;

    // let code = window.location.hash.replace("#"," ")
    // place = data.find(d => d.code == code)
  });

  function updateHash(place) {
    // window.location.hash = '#' + place.code;

    history.replaceState(undefined, undefined, "#" + place.code);

    console.log(place);
    console.log(data);

    // neighbourList = neighbours[place.code][0];

    // neighbourList.map((n) => ({ ...n, code: "False" }));
    // neighbourList.forEach((n, i) => {
      // console.log(n);
      // neighbourListFull[i] = 'test'
    // });

    // console.log(neighbourListFull)
  }

  // $:data&&readHash()

  $: data && updateHash(place);
</script>

<!-- <ONSHeader filled={true} center={false} /> -->

<svelte:body bind:this={main} />

<!-- <AnalyticsBanner {analyticsId} {analyticsProps} noBanner bind:gtag/> -->

<main>
  {#if place}
    <header>
      <button
        on:click={() => reset}
        class="btn-link btn-title"
        title="Return to menu"><h1>How well do you know your area?</h1></button
      >
      <!-- {place.name} -->
      <nav>
        <button title="About the game" on:click={() => (screen = "intro")}
          ><Icon type="info" /></button
        >
        <button title="View score history"><Icon type="chart" /></button>
        <!-- <button title=" Full screen mode"><Icon type="{fullscreen ? 'full_exit' : 'full'}"/></button> -->
      </nav>
    </header>
    {#if screen === "start"}
      <div id="game-container">
        <p class="text-big" style="margin-top: 5px">
          Census data can help us to better understand the places where we live.
        </p>
        <p class="text-big">
          Answer the {questions.length} questions in this quiz to test your knowledge
          of your local authority area, and find out how it compares to the rest
          of the country.
        </p>

        <p>This demonstrator currently uses 2011 census data</p>

        <hr />

        <p style="margin-top: 20px">
          Choose an area
          <select bind:value={place}>
            {#each data as d}
              <option value={d}>{d.name}</option>
            {/each}
          </select>
        </p>
        <!-- <p>Or enter a postcode</p> -->
        <!-- <hr>

		<p>Neighbours:</p> -->
        <!-- {neighbours[place.code][0]} -->

        <!-- {#each neighbours[place.code][0] as code}
			{data.find(p => p.code == code).name}
			<br>
		{/each} -->

        <button
          class="btn-menu btn-primary mb-5"
          on:click={() => (screen = "question")}>Continue</button
        >
        <!-- change to "questionmap" once it's working -->
        <!-- <button class="btn-menu btn-primary mb-20" on:click={updateHash}>go to hash</button> -->
        <!-- <button on:click={() => console.log(data)}>test</button> -->
      </div>
    {:else if screen === "intro"}
      <div id="game-container">
        <p class="text-big">
          Census data can help us to better understand the places where we live.
        </p>
        <p class="text-big">
          Answer the {questions.length} questions below to test your knowledge of
          your local authority area, and find out how it compares to the rest of
          the country.
        </p>
        <button on:click={() => (screen = "start")}>Back</button>
      </div>
    {:else if screen === "questionMap"}
      <div id="game-container">
        <h2>Question 1. Where is {place.name}?</h2>
        NOT CURRENTLY WORKING - Just go to next question
        <Map />
        <button on:click={() => (screen = "question")}>Next Question</button>
      </div>
    {:else if screen === "question"}
      <div id="game-container">
        <h2>
          Q.{questionNum + 1} of {questions.length} <br />
          {questions[questionNum].text.replace("{place}", place.name).replace("{neighbour}", lookup[answers[questionNum].neighbour].name)}

        </h2>

        <!-- this could probably be done a lot better - ask Ahmad -->

        {#if questions[questionNum].type === "slider"}

		<SliderWrapper bind:answers {questions} {questionNum} {data} {place}/>
 

          {#if !answers[questionNum].set}
            <button on:click={() => guessPercent(questionNum)}>Guess</button>
          {:else}
            <p>
              <strong>
                {#if answers[questionNum].correct}
                  Good guess!
                {:else}
                  Not quite...
                {/if}
              </strong>
              The {questions[questionNum].label} in {place.name} is
              <strong
                >{place[questions[questionNum].key]}
                {questions[questionNum].unit}</strong
              >, which is {adjectify(
                place[questions[questionNum].key + "_quintile"]
              )} average compared to other local authorities.
            </p>

            {#if questions[questionNum].linkText}
              <p>
                <a href={questions[questionNum].linkURL} target="_blank">
                  {questions[questionNum].linkText}
                </a>
              </p>
            {/if}

            {#if questionNum + 1 < questions.length}
              <button on:click={nextQuestion}>Next Question</button>
            {:else}
              <button on:click={() => (screen = "results")}>View Results</button
              >
            {/if}
          {/if}
        {:else if questions[questionNum].type === "higher_lower"}
			<div></div>

			{#if !answers[questionNum].set}
            <button on:click={() => guessHigherLower(questionNum, "higher")}>Higher</button>
			<button on:click={() => guessHigherLower(questionNum, "lower")}>Lower</button>

			{:else}
            <p>
              <strong>
                {#if answers[questionNum].correct}
                  Correct.
                {:else}
                  Incorrect.
                {/if}
              </strong>
              The {questions[questionNum].label} in {place.name} was
              <strong
                >{place[questions[questionNum].key]}
                {questions[questionNum].unit}</strong
              >, which was <strong>{higherLower(
                place[questions[questionNum].key] - lookup[answers[questionNum].neighbour][questions[questionNum].key]
              )}</strong> than {lookup[answers[questionNum].neighbour].name} ({lookup[answers[questionNum].neighbour][questions[questionNum].key]}{questions[questionNum].unit}).
            </p>

            {#if questions[questionNum].linkText}
              <p>
                <a href={questions[questionNum].linkURL} target="_blank">
                  {questions[questionNum].linkText}
                </a>
              </p>
            {/if}

            {#if questionNum + 1 < questions.length}
              <button on:click={nextQuestion}>Next Question</button>
            {:else}
              <button on:click={() => (screen = "results")}>View Results</button
              >
            {/if}
			{/if}
		{:else}
			<div>Error: Unknown Question Type</div>
		{/if}

      </div>
    {:else if screen === "results"}
      <div id="game-container">
        <h2>Score</h2>

        <p>You scored {score} out of {questions.length}!</p>

        <p>{resultsArray.map((d) => (d ? "✅" : "❌")).join("")}</p>

        <button
          on:click={copyResults(
            resultsArray.map((d) => (d ? "✅" : "❌")).join("")
          )}
        >
          {#if tooltip}
            Copied!
          {:else}
            Share
          {/if}
        </button>

        <button on:click={reset}>Restart</button>
      </div>
    {/if}
  {/if}
</main>

<!-- <ONSFooter /> -->
<style>
  /* @import url("https://onsvisual.github.io/svelte-scrolly/global.css"); */

  /* Stuff pinched from Hexmaps */

  a {
    color: #206095;
  }
  h1 {
    font-size: 1.8em;
    margin: 0 0 5px 0;
    text-align: left;
  }
  @media (max-width: 440px) {
    h1 {
      font-size: 1.55em;
      margin-top: 2px;
    }
  }

  h2 {
    margin: 0 0 5px 0;
  }
  h3 {
    margin: 0;
  }
  hr {
    border: none;
    height: 1px;
    background-color: darkgrey;
  }
  main {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 6px);
    max-height: calc(100vh - 6px);
	/* height: 500px; */
    margin: 3px auto;
    text-align: center;
    width: calc(100% - 6px);
    max-width: 980px;
    background-color: #44368f;
    background-image: linear-gradient(to right, #44368f, #8c2292);
  }
  header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: nowrap;
    margin: 0 auto;
    padding: 6px 12px 0 12px;
    width: 100%;
    color: white;
  }
  nav {
    white-space: nowrap;
  }
  #breadcrumb {
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
    width: calc(100% - 6px);
    min-height: 27px;
    background-color: white;
    margin: 0 3px;
    padding: 2px 9px 0 9px;
  }
  #breadcrumb > span:nth-of-type(1) {
    text-align: left;
    flex-grow: 1;
  }
  #breadcrumb > span:nth-of-type(2) {
    text-align: right;
    min-width: 120px;
    flex-grow: 1;
  }
  #game-container {
    box-sizing: border-box;
    flex-grow: 1;
    margin: 0 3px 3px 3px;
    padding: 0;
    position: relative;
    overflow-y: auto;
    width: calc(100% - 6px);
    background-color: white;
  }
  #q-container {
    display: flex;
    width: calc(100% - 6px);
    flex-direction: row;
    align-items: stretch;
    box-sizing: border-box;
    min-height: 85px;
    margin: 0 3px;
    padding: 10px 0;
    border-bottom: none;
    text-align: left;
    background-color: #ddd;
  }
  @media (max-width: 600px) {
    #q-container {
      flex-wrap: wrap;
    }
  }
  #q-container > div {
    box-sizing: border-box;
    flex-basis: 100%;
    margin: 0;
    padding: 0 10px;
    vertical-align: top;
    min-height: 65px;
  }
  #q-container > h2 {
    width: 100%;
    text-align: center;
    margin: 0;
  }
  #menu {
    width: 400px;
    max-width: calc(100% - 40px);
    height: calc(100% - 75px);
    margin: 0 auto;
    padding: 40px 0;
    text-align: left;
  }
  #button-container {
    position: absolute;
    top: 15px;
    left: 15px;
    text-align: left;
    z-index: 1;
  }
  .columns {
    padding: 0;
    margin: 10px;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    text-align: left;
  }
  .columns > div {
    width: 300px;
    margin: 10px;
    padding: 0;
    flex-grow: 1;
  }
  .flex-reverse {
    flex-direction: row-reverse !important;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 6px;
    width: 100%;
    margin: 15px 0;
    text-align: center;
  }
  .mini-map {
    position: relative;
    width: 100%;
    height: 100%;
  }
  button {
    cursor: pointer;
    border: none;
    border-radius: 0;
    position: relative;
  }
  header button {
    color: white;
  }
  button:focus {
    outline: 3px solid orange;
  }
  button:disabled {
    background-color: grey;
    cursor: default;
  }
  nav > button {
    background: none;
    border: none;
    font-size: 1.2rem;
    padding: 0.4em 0.1em;
    margin: 0 0 0.5em 0.5em;
  }
  .btn-menu {
    display: block;
    width: 100%;
    height: 40px;
    margin: 0 auto 0.5em auto;
    background-color: #bcbcbc;
    color: black;
    border: none;
    font-weight: bold;
  }
  .btn-primary {
    background-color: #902082;
    color: white;
  }
  .btn-menu-inline {
    display: inline-block;
    width: auto;
    max-width: auto;
    text-align: left;
    padding: 0.4em 0.8em;
  }
  .btn-link {
    background: none !important;
    border: none;
    padding: 0 !important;
    margin: 0 !important;
    color: #206095;
    font-weight: normal;
    text-decoration: underline;
    cursor: pointer;
  }
  .btn-title {
    color: white;
    font-weight: bold !important;
    text-decoration: none;
  }
  .btn-hilo {
    border: 2px solid black;
    margin: 0;
    padding: 0.2em 0.6em;
  }
  .btn-hilo:hover {
    background-color: lightgrey;
  }
  #menu label {
    box-sizing: border-box;
    display: block;
    padding: 0.4em 0.4em 0.4em 2.5em;
    width: 100%;
    border: 1px solid black;
    margin: 0 0 5px 0;
    cursor: pointer;
    position: relative;
  }
  label:focus-within {
    outline: 3px solid orange;
  }
  .label-active {
    background-color: #eee;
  }
  .label-active:before {
    content: " ";
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: 1px solid black;
  }
  input[type="radio"] {
    position: absolute;
    margin: 0;
    padding: 0;
    appearance: none;
    border: 2px solid #222;
    height: 22px;
    left: 8px;
    top: 50%;
    width: 22px;
    z-index: 1;
    border-radius: 50%;
    outline: none;
    transform: translateY(-50%);
  }
  input[type="radio"]:checked {
    background: #222;
    box-shadow: inset 0 0 0 3px #fff;
  }
  .text-lrg {
    font-size: 1.4rem;
    font-weight: bold;
  }
  .text-xl {
    font-size: 2.2rem;
    font-weight: bold;
  }
  .mt-10 {
    margin-top: 10px;
  }
  .mb-20 {
    margin-bottom: 20px;
  }
  mark {
    font-weight: bold;
    color: white;
    padding: 0 0.2em;
  }
  .mark-start {
    background-color: #22d0b6;
  }
  .mark-end {
    background-color: #206095;
  }
  .nowrap {
    white-space: nowrap;
  }
  .stats-block {
    margin: 20px 0 25px 0;
  }
  .muted {
    color: #777;
  }
  .logo-block {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 100%;
  }
  .logo {
    cursor: pointer;
    padding: 2px;
    margin: 0;
    line-height: 1;
  }
  .noscroll {
    overflow-y: hidden !important;
  }
</style>
