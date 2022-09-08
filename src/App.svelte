<script>
	import { setContext, onMount } from "svelte";
	import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";
	import { feature } from "topojson-client";
	import bbox from "@turf/bbox";
	import { themes, urls, questions, colors, bounds_ew } from "./config";
	import { getData, getBreaks, getQuantile, adjectify, distinct, format, higherLower, shuffle } from "./utils";

	// UI elements
	import Icon from "./ui/Icon.svelte";
	import Select from "./ui/Select.svelte";
	import SliderWrapper from "./ui/SliderWrapper.svelte";
	import tooltip from "./ui/tooltip";

	// Data
	import neighbours from "./neighbours.json";
	import topojson from "./lad-topo-2021.json";
	const geojson = feature(topojson, "geog");
	console.log(bbox(geojson));

	// STYLE CONFIG
	// Set theme globally (options are defined in config.js)
	let theme = "light";
	setContext("theme", theme);

	// STATE
	let data;
	let lookup;
	let place; // Selected row of data
	let map;
	let bounds = bounds_ew; // Default bounds = England & Wales
	let numberOfQuestions = 8;
	let answers = [];
	let score = 0;
	let complete = false;
	let screen = "start";
	let qNum = 0;
	let resultsArray = [];
	let copied = false;
	let fullscreen = false;

	// Postcode search
	let placeholder = "Type a place name or postcode";
	let filterText;
	
	async function getPostcodes(filterText) {
		if (filterText.length > 2 && /\d/.test(filterText)) {
			let res = await fetch(`https://api.postcodes.io/postcodes/${filterText}/autocomplete`);
			let json = await res.json();
			return json.result ? json.result.map(d => ({code: d, name: d, postcode: true})) : [];
		} else if (filterText.length > 2) {
			return data.filter(d => d.name.toLowerCase().slice(0, filterText.length) == filterText.toLowerCase());
		}
		return [];
	}
	async function doSelectPostcode(e) {
		if (e.detail.postcode) {
			let res = await fetch(`https://api.postcodes.io/postcodes/${e.detail.code}`);
			let json = await res.json();
			if (json.result) {
				let place_new = data.find(d => d.code == json.result.codes.admin_district);
				if (place_new) {
					doSelect(place_new.code);
					placeholder = "Type a place name or postcode";
				} else {
					doSelect();
					placeholder = "Postcode must be in England or Wales";
				}
			}
		} else {
			doSelect(e.detail.code);
			placeholder = "Type a place name or postcode";
		}
	}
	function doClearPostcode() {
		doSelect();
	}
	function doSelect(e = null) {
		let code = typeof e == 'string' ? e : e && e.detail ? e.detail.id : null;

		if (code) {
			place = data.find(d => d.code == code);
			let feature = geojson.features.find(f => f.properties.areacd == code);
			bounds = bbox(feature);
		} else {
			place = null;
			bounds = bounds_ew;
		}
		
		map.fitBounds(bounds, {padding: bounds == bounds_ew ? 0 : 30});
	}

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
		let index = vals.indexOf(place[answers[i].key]);
		let max =
			index + plusminus >= len ? vals[len - 1] : vals[index + plusminus];
		let min = index - plusminus < 0 ? vals[0] : vals[index - plusminus];

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

	function reset() {
		answers.forEach((a, i) => {
			answers[i].set = false;
			score = 0;
		});
		screen = "start";
		qNum = 0;
		resultsArray = [];
		console.log(place);
	}

	function nextQuestion() {
		qNum++;
		// console.log(answers);
	}

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

	getData(urls.data).then((json) => {
		let hash = window.location.hash.replace("#", "");

		place = json.find((d) => d.code == hash);
		if (place) {
			let feature = geojson.features.find(f => f.properties.areacd == place.code);
			bounds = bbox(feature);
		}

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
	});

	function startQuiz() {
		let ans = [];
		
		shuffle(questions).slice(0, numberOfQuestions).forEach((q) => {
			let f = q.formatVal ? format(q.formatVal) : format(0);
			let sorted = [...data].sort((a, b) => a[q.key] - b[q.key]);
			let vals = sorted.map((d) => d[q.key]);
			let len = vals.length;
			let val = q.type == "higher_lower" ? null : q.startVal != undefined ? q.startVal : +f(vals[Math.floor(len / 2)]);
			let neighboursRand = shuffle(neighbours[place.code].filter((n) => data.map((d) => d.code).includes(n))).slice(0, 2).map((d) => lookup[d]);
			let obj = {
				...q,
				neighbour: sorted[Math.floor(len / 2)],
				neighbours: shuffle([...neighboursRand, place]),
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

		console.log(answers);

		screen = "question";
	}

	function updateHash(place) {
		console.log('updating hash');
		history.replaceState(undefined, undefined, place ? '#' + place.code : '.');
		console.log(place);
	}

	function toggleFullscreen() {
		if (!fullscreen) {
			document.body.requestFullscreen();
			fullscreen = true;
		} else {
			document.exitFullscreen();
			fullscreen = false;
		}
	}

	$: data && updateHash(place);
</script>

<!-- <ONSHeader filled={true} center={false} /> -->

<svelte:body bind:this={main} />

<!-- <AnalyticsBanner {analyticsId} {analyticsProps} noBanner bind:gtag/> -->

<main>
	{#if data}
		<header>
			<button
				on:click={() => reset}
				class="btn-link btn-title"
				title="Return to menu"><h1>Census quiz</h1></button
			>
			<nav>
				<button
					title="Full screen mode"
					on:click={toggleFullscreen}
					use:tooltip
					><Icon type={fullscreen ? "full_exit" : "full"} /></button
				>
			</nav>
		</header>
		{#if screen === "start"}
			<div id="q-container">
				<div>
					<h2>
						<span class="text-lrg">
							How well do you know {place ? place.name : 'your area'}?
						</span>
					</h2>
				</div>
			</div>
			<div id="game-container">
				<section class="columns">
					<div>
						<p class="text-big" style="margin-top: 5px">
							Census data can help us to better understand the
							area we live in.
						</p>
						<p class="text-big">
							Answer these {numberOfQuestions} questions 
							to test your knowledge of your local authority area,
							and find out how it compares to the rest England and Wales.
						</p>

						<hr />

						<div style="margin: 20px 0">
							<form>
								<label for="select">Choose an area</label>
								<Select id="select" mode="search" idKey="code" labelKey="name" items={data} {placeholder} bind:filterText loadOptions={getPostcodes} on:select={doSelectPostcode} value={place} on:clear={doClearPostcode}/>
							</form>
						</div>

						<div class="map">
							<Map bind:map style="./data/map-style.json" location={{bounds}} options={{fitBoundsOptions: { padding: bounds == bounds_ew ? 0 : 30}}}>
								<MapSource
									id="lad"
									type="geojson"
									data={geojson}
									promoteId="areacd">
									<MapLayer
										id="lad-fill"
										type="fill"
										paint={{
											'fill-color': [
												'case',
					  							['==', ['feature-state', 'selected'], true], 'rgba(32,96,149,0.2)',
					  							'rgba(255,255,255,0)'
					  						]
										}}
										select hover
										selected={place ? place.code : null}
										on:select={doSelect}
									/>
									<MapLayer
										id="lad-line"
										type="line"
										paint={{
											'line-color': 'rgb(32,96,149)',
											'line-width': [
												'case',
												['==', ['feature-state', 'selected'], true], 2,
												0.5
					  						]
										}}
									/>
									<MapLayer
										id="lad-highlight"
										type="line"
										paint={{
											'line-color': [
												'case',
												['==', ['feature-state', 'hovered'], true], 'orange',
												'rgba(255,255,255,0)'
					  						],
											'line-width': 2.5
										}}
									/>
								</MapSource>
							</Map>
						</div>

						<button
							class="btn-menu btn-primary mb-5"
							on:click={startQuiz}
							disabled={!place}>
							Start quiz
						</button>
					</div>
				</section>
			</div>
		{:else if screen === "question"}
			<div id="q-container">
				<div>
					<h2>
						<span class="text-lrg">
							Question {qNum + 1} of {answers.length}
							<br />
							{answers[qNum].text
								.replace("{place}", place.name)
								.replace(
									"{neighbour}",
									answers[qNum].neighbour.name
								)}
						</span>
					</h2>
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
							/>

							{#if !answers[qNum].set}
								<button
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
									</strong>
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

								{#if answers[qNum].linkText}
									<p>
										<a
											href={answers[qNum]
												.linkURL}
											target="_blank"
										>
											{answers[qNum].linkText}
										</a>
									</p>
								{/if}
							{/if}
						{:else if answers[qNum].type === "higher_lower"}
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

								{#if answers[qNum].linkText}
									<p>
										<a
											href={answers[qNum]
												.linkURL}
											target="_blank"
										>
											{answers[qNum].linkText}
										</a>
									</p>
								{/if}
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
								<button on:click={() => guessSort(qNum)}
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
						{/if}
						{#if answers[qNum].set && qNum + 1 < answers.length}
							<button on:click={nextQuestion}
								>Next question</button
							>
						{:else if answers[qNum].set}
							<button on:click={() => (screen = "results")}
								>View results</button
							>
						{/if}
					</div>
				</section>
			</div>
		{:else if screen === "results"}
			<div id="game-container">
				<h2>Score</h2>

				<p>You scored {score} out of {answers.length}!</p>

				<p>{resultsArray.map((d) => (d ? "✅" : "🟥")).join("")}</p>

				<button
					on:click={copyResults(
						resultsArray.map((d) => (d ? "✅" : "🟥")).join("")
					)}
				>
					{#if copied}
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
		height: 100vh;
		max-height: 100vh;
		margin: 0 auto;
		text-align: center;
		width: 100%;
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
		padding: 0 20px;
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
	table.sort {
		table-layout: fixed;
		border-collapse: collapse; 
		width: 100%;
		max-width: 380px;
	}
	table.sort tr + tr {
		border-top: 1px solid black;
	}
	table.sort tr > td:nth-of-type(1) {
		width: 30px;
	}
	table.sort tr > td:nth-of-type(2) {
		width: 200px;
	}
	table.sort tr > td:nth-of-type(3) {
		width: auto;
		text-align: right;
	}
	table.sort button {
		margin: 0;
	}
	table.sort td {
		height: 40px;
	}
	button:focus {
		outline: 3px solid orange;
	}
	button:disabled {
		color: lightgrey;
		cursor: default;
	}
	button.correct {
		color: black;
		background-color: #22D0B6;
	}
	button.incorrect {
		color: black;
		background-color: #F66068;
	}
	button:disabled {
		background-color: grey;
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
	form > label {
		margin-bottom: 4px;
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
	.map {
		width: 100%;
		height: 250px;
		margin-bottom: 10px;
	}
</style>
