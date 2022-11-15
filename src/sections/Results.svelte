<script>
  import { createEventDispatcher } from "svelte";
  
  const dispatch = createEventDispatcher();

  export let numberOfQuestions;
  export let score;
  export let answers;
  export let place;

	let copied = false;

  function copyResults(results) {
		copied = true;
		setTimeout(async () => {
			copied = false;
		}, 1000);

		var copyString =
			"I scored " +
			score +
			" out of " +
			answers.length +
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
</script>

<div id="game-container">
  <section class="columns">
    <div>
      <h2>Score</h2>

      <p>You scored {score} out of {numberOfQuestions}!</p>

      <p>{answers.map((d) => (d.correct ? "✅" : "🟥")).join("")}</p>

		<p style="font-weight: bold">	
			{
				(score >= 8) ? "We're not worthy! You're clearly a sensei of the census." :
				(score == 7) ? "Cen-sational! You know " + place.name + " almost inside out, but have another try with some different questions." :
				(score == 6) ? "You've nearly got this cen-sussed! Have another try with some different questions." :
				(score == 5) ?  "Not bad! See if you can really get the census cen-sussed by playing again with some different questions." :
				(score == 4) ? "You've got to the centre of the census scoreboard. Try again and find out more things about " + place.name + "." :
				(score == 3) ? "Nearly half way! There's a lot more you can learn from Census 2021 about " + place.name + " if you play again." :
				(score == 2) ? "Surprising, wasn't it? You can make sense of Census 2021 and find out more about " + place.name + " by playing again with some different questions." :
				(score == 1) ? "It's better than nothing! There's lots that Census 2021 can tell you about " + place.name + ". Have another go with some different questions." :
				(score == 0) ? "Never mind! There's lots that Census 2021 can tell you about " + place.name + ". Have another go with some different questions." : "error"
			}
		</p>

		<p>	
			<img src = "./img/resultsbadges/{score}.svg" alt="You scored {score} out of {numberOfQuestions}"/>
		</p>

      <button
        on:click={copyResults(
          answers.map((d) => (d.correct ? "✅" : "🟥")).join("")
        )}
      >
        {#if copied}
          Copied!
        {:else}
          Share
        {/if}
      </button>
      <button on:click={e => dispatch("restart", {e})}>Play again</button>
    </div>
  </section>  
</div>