<script>
  import { createEventDispatcher } from "svelte";
  import Icon from "../ui/Icon.svelte";
  import { copyEmbed, makeEmbed, analyticsEvent } from "../utils";
  
  const dispatch = createEventDispatcher();

  export let numberOfQuestions;
  export let score;
  export let answers;
  export let place;

  let copied = false;
  let showEmbed = false;
  let embedPlace = true;

  function copyResults() {
		copied = true;
		setTimeout(async () => {
			copied = false;
		}, 2000);

    let parent = new URLSearchParams(document.location.search).get("parentUrl");
    if (!parent) parent = "https://publishing.dp-prod.aws.onsdigital.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/articles/playthecensus2021quizhowwelldoyouknowyourarea/2022-12-02";
		let copyString = `I tested my knowledge of ${place.name} in the #CensusQuiz and scored 6 out of 8.
${answers.map((d) => (d.correct ? "✅" : "🟥")).join("")}
${parent}`;

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
    analyticsEvent({
			event: "scoreShare",
			place: place.name,
      score: score
		});
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
</script>

<div id="game-container">
  <section class="columns">
    <div>
      <div id="result-container">
        <div aria-live="assertive" class="result-message">
          <h2>You scored {score} out of {numberOfQuestions}!</h2>

          <p style:max-width="500px">	
            {	
              (score >= 6) ? "Well done! You really know where you live. See if you can do it again with some different questions.":
              (score >= 4 && score <= 5) ? "Not bad. Try again with some different questions and find out more about your area.":
              (score <= 3) ? "Never mind! There's a lot that Census 2021 can tell you about your area, so try again with some different questions." : ""
            }

          </p>
        </div>
        <div style:max-width="250px">	
          <img src = "./img/resultsbadges/results{	
            (score >= 6) ? '01':
            (score >= 4 && score <= 5) ? '02':
            (score <= 3) ? '03' : ""
          }.svg" width=100% alt="You scored {score} out of {numberOfQuestions}"/>
        </div>
      </div>
      <button
        class="btn-primary btn-wide"
        on:click={copyResults}
      >
        {#if copied}
          Copied!
        {:else}
          Share
        {/if}
      </button>
      <button class="btn-primary btn-wide" on:click={e => dispatch("restart", {e})}>Play again</button>

      <div class="embed-container">
        <button
          class="btn-link"
          on:click={() => showEmbed = !showEmbed}>
          <Icon type="code"/>
          {showEmbed ? 'Hide embed code' : 'Embed this'}
        </button>

        {#if showEmbed}
        <textarea id="embed" readonly>{makeEmbed(embedPlace ? place.code : null)}</textarea>
        <label>
          <input type="checkbox" bind:checked={embedPlace}/>
          Set {place.name} as default selection
        </label>
        <button class="btn-primary" style:margin="3px 0 0" on:click={copyEmbed}><Icon type="copy"/> Copy to clipboard</button>
        {/if}
      </div>
    </div>
  </section>
</div>


<style>
	.embed-container{
		text-align: left;
		padding-left: 10px;
	}

	#game-container {
		display: flex;
		justify-content: space-around;
	}

	#result-container {
    background-color: #F2FAFB;
    padding: 12px;
    width: 100%;
    margin: 40px 0 50px;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    text-align: left;
  }
  #result-container > div {
    width: 300px;
    margin: 12px;
    padding: 0;
    flex-grow: 1;
  }

  .btn-wide {
    width: 100%;
  }
</style>