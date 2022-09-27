<script>
  import { createEventDispatcher } from "svelte";
  import { adjectify, format, higherLower, parseInfo } from "../utils";
	import Icon from "../ui/Icon.svelte";
	import SliderWrapper from "../ui/SliderWrapper.svelte";
  
  const dispatch = createEventDispatcher();

  export let data;
  export let place;
  export let answers;
  export let qNum;
  export let resultsArray;
  export let score;

	let maxAns;
	let minAns;

	function guess(i, correct) {
		answers[i].correct = correct;
		answers[i].set = true;
		score += answers[i].correct ? 1 : 0;

		resultsArray.push(answers[i].correct);
	}

	function guessPercent(i) {
		let vals = answers[i].vals;
		let len = vals.length;
		let plusminus = Math.round(0.15 * len); // Equivalent to +/- 15 percentiles
		let index = vals.indexOf(place[answers[i].key]);
		let max =
			index + plusminus >= len ? vals[len - 1] : vals[index + plusminus];
		let min = index - plusminus < 0 ? vals[0] : vals[index - plusminus];

		maxAns = max;
		minAns = min;

		let correct = answers[i].val >= min && answers[i].val <= max;

		guess(i, correct);
	}

	function guessHigherLower(i, hl) {
		let neighbour = answers[i].neighbour;
		let key = answers[i].key;

		let correct =
			(hl == "higher" && place[key] >= neighbour[key]) ||
			(hl == "lower" && place[key] <= neighbour[key]);

		answers[i].val = hl;
		guess(i, correct);
	}

	function guessSort(i) {
		let arr = answers[i].neighbours;
		let key = answers[i].key;
		let sorted = [...arr].sort((a, b) => b[key] - a[key]);
		let check = arr.map((d, i) => d[key] == sorted[i][key]);

		console.log(arr, sorted, check);
		guess(i, !check.includes(false));
	}

	function sortNeighbours(i, array_ind, change) {
		let arr = [...answers[i].neighbours];
		let new_ind = array_ind + change;
		arr.splice(array_ind, 1);
		arr.splice(new_ind, 0, answers[i].neighbours[array_ind]);
		answers[i].neighbours = arr;
	}
</script>

<div id="q-container">
  <div>
    <h2>
      <span class="text-lrg">
        Question {qNum + 1}
      </span>
    </h2>
    {answers[qNum].text
      .replace("{place}", place.name)
      .replace(
        "{neighbour}",
        answers[qNum].neighbour.name
      )}
  </div>
</div>

<div id="game-container">
  <section class="columns">
    <div>
      <!-- this could probably be done a lot better - ask Ahmad -->

      {#if answers[qNum].type === "slider"}
        <SliderWrapper
          bind:answers
          {qNum}
          {data}
          {place}
          {minAns}
          {maxAns}
        />

        {#if !answers[qNum].set}
          <button
            class="btn-primary"
            on:click={() => guessPercent(qNum)}
            >Submit</button
          >
        {:else}
          <p>
            <strong>
              {#if answers[qNum].correct}
                Good answer!
              {:else}
                Bad luck!
              {/if}
            </strong><br/>
            The {answers[qNum].label} in {place.name}
            is
            <strong
              >{format(answers[qNum].formatVal ? answers[qNum].formatVal : 0)(place[answers[qNum].key])}
              {answers[qNum].unit}</strong
            >, which is {adjectify(
              place[
                answers[qNum].key +
                  "_quintile"
              ]
            )} average compared with other local authorities.
          </p>

        {/if}
      {:else if answers[qNum].type === "higher_lower_avg"}
        <div />

        <button
          on:click={() =>
            guessHigherLower(qNum, "higher")}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == "higher" && answers[qNum].correct}
          class:incorrect={answers[qNum].val == "higher" && !answers[qNum].correct}
          >Higher</button
        >
        <button
          on:click={() =>
            guessHigherLower(qNum, "lower")}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == "lower" && answers[qNum].correct}
          class:incorrect={answers[qNum].val == "lower" && !answers[qNum].correct}
          >Lower</button
        >

        {#if answers[qNum].set}
          <p>
            <strong>
              {#if answers[qNum].correct}
                Correct.
              {:else}
                Incorrect.
              {/if}
            </strong>
            The {answers[qNum].label} in {place.name}
            was
            <strong
              >{place[answers[qNum].key]}
              {answers[qNum].unit}</strong
            >, which was
            <strong
              >{higherLower(
                place[answers[qNum].key] -
                  answers[qNum].neighbour[
                    answers[qNum].key
                  ]
              )}</strong
            >
            than the average (median) of {answers[
              qNum
            ].neighbour[
              answers[qNum].key
            ]}{answers[qNum].unit} across all local
            authorities.
          </p>

        {/if}
      {:else if answers[qNum].type === "sort"}
        <table class="sort">
          <tbody>
            {#each answers[qNum].neighbours as neighbour, i}
            <tr>
              <td>{i + 1}.</td>
              <td>{neighbour.name}</td>
              <td>
                <button on:click={() => sortNeighbours(qNum, i, -1)} disabled={i == 0 || answers[qNum].set} title="Move {neighbour.name} up">
                  <Icon type="chevron" rotation={90}/>
                </button>
                <button on:click={() => sortNeighbours(qNum, i, 1)} disabled={i == answers[qNum].neighbours.length - 1 || answers[qNum].set} title="Move {neighbour.name} down">
                  <Icon type="chevron" rotation={-90}/>
                </button>
              </td>
            </tr>
            {/each}
          </tbody>
        </table>

        {#if !answers[qNum].set}
          <button class="btn-primary" on:click={() => guessSort(qNum)}>
            Submit
          </button>
        {:else}
          <p>
            <strong>
              {#if answers[qNum].correct}
                Good answer!
              {:else}
                Bad luck!
              {/if}
            </strong>
            The correct order of the areas is:
          </p>

          <table class="sort">
            <tbody>
              {#each [...answers[qNum].neighbours].sort((a, b) => b[answers[qNum].key] - a[answers[qNum].key]) as neighbour, i}
              <tr>
                <td>{i + 1}.</td>
                <td>{neighbour.name}</td>
                <td>{format(answers[qNum].formatVal ? answers[qNum].formatVal : 0)(neighbour[answers[qNum].key])}{answers[qNum].unit}</td>
              </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      {:else}
        <div>Error: Unknown Question Type</div>
        <button class="btn-primary" on:click={() => guess(qNum, true)}> NEXT </button>
      {/if}
      {#if answers[qNum].set}

        {#if answers[qNum].info}
          {#if answers[qNum].infoWales}
            {#if place.code.startsWith('W')}
              <p>{parseInfo(data, answers[qNum].infoWales)}</p>
            {:else}
              <p>{parseInfo(data, answers[qNum].info)}</p>
            {/if}
          {:else}
            <p>{parseInfo(data, answers[qNum].info)}</p>
          {/if}
        {/if}
        
        {#if qNum + 1 < answers.length}

          <button class="btn-primary" on:click={() => qNum ++}>
            Next question
          </button>
        {:else}
          <button class="btn-primary" on:click={e => dispatch("end", {e})}>
            View results
          </button>
        {/if}
      {/if}
    </div>
  </section>
</div>