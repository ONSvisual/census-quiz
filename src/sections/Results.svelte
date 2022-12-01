<script>
  import { createEventDispatcher } from "svelte";
  import Icon from "../ui/Icon.svelte";
  import Tooltip from "../ui/TooltipStatic.svelte";
  import { copyEmbed, makeEmbed, analyticsEvent, sleep } from "../utils";
  
  const dispatch = createEventDispatcher();

  export let numberOfQuestions;
  export let score;
  export let answers;
  export let place;

  let copiedEmbed = false;
  let copiedScore = false;
  let showEmbed = false;
  let embedPlace = true;

  async function copyResults() {
    let parent = new URLSearchParams(document.location.search).get("parentUrl");
    if (!parent) parent = "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/articles/playthecensus2021quizhowwelldoyouknowyourarea/2022-12-02";
		let copyString = `I tested my knowledge of ${place.name} in the #CensusQuiz and scored ${score} out of ${numberOfQuestions}.
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
    copiedScore = true;
    await sleep(5000);
    copiedScore = false;
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

<div id="game-container" style:overflow-y="none">
  <div class="scroll-container" style:position="absolute">
  <section class="columns">
    <div>
      <div id="result-container">
        <div aria-live="assertive" class="result-message">
          <h2>You scored {score} out of {numberOfQuestions}!</h2>

          <p style:max-width="450px">	
            {	
              (score >= 6) ? "Well done! You really know where you live. See if you can do it again with some different questions.":
              (score >= 4 && score <= 5) ? "Not bad. Try again with some different questions and find out more about your area.":
              (score <= 3) ? "Never mind! There's a lot that Census 2021 can tell you about your area, so try again with some different questions." : ""
            }

          </p>
        </div>
        <div style:max-width="220px">	
          <img src = "./img/resultsbadges/results{	
            (score >= 6) ? '01':
            (score >= 4 && score <= 5) ? '02':
            '03'
          }.svg" width=100% alt="You scored {score} out of {numberOfQuestions}"/>
        </div>
      </div>
      <button
        class="btn-primary btn-wide"
        on:click={copyResults}
      >
        {#if copiedScore}<Tooltip title="Copied to clipboard!"/>{/if}
        <Icon type="share"/> <span>Share score</span>
      </button>
      <button class="btn-primary btn-wide" on:click={e => dispatch("restart", {e})}>
        <Icon type="replay"/> <span>Play again</span>
      </button>

      <div class="embed-container">
        <button
          class="btn-link"
          on:click={() => showEmbed = !showEmbed}>
          <Icon type="code"/>
          <span>{showEmbed ? 'Hide embed code' : 'Embed this quiz'}</span>
        </button>

        {#if showEmbed}
        <textarea id="embed" readonly>{makeEmbed(embedPlace ? place.code : null)}</textarea>
        <label>
          <input type="checkbox" bind:checked={embedPlace}/>
          Set {place.name} as default selection
        </label>
        <button class="btn-primary" style:margin="3px 0 0" on:click={async () => {
          copyEmbed();
          copiedEmbed = true;
          await sleep(5000);
          copiedEmbed = false;
        }}>
          {#if copiedEmbed}<Tooltip title="Copied!"/>{/if}
          <Icon type="copy"/> Copy to clipboard
        </button>
        {/if}
      </div>
    </div>
  </section>
  </div>
</div>


<style>
	.embed-container{
		text-align: left;
		padding-left: 10px;
    margin-top: 0px;
	}

	#game-container {
		display: flex;
		justify-content: space-around;
	}

	#result-container {
    background-color: #F2FAFB;
    padding: 16px;
    width: 100%;
    margin: 20px 0 30px;
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