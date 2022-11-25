<script>
  import { createEventDispatcher } from "svelte";
  import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";
  import { makeEmbed, copyEmbed } from "../utils";
	import bbox from "@turf/bbox";
  
	import Select from "../ui/Select.svelte";
	import Icon from "../ui/Icon.svelte";

  const dispatch = createEventDispatcher();

  export let data;
  export let lookup;
  export let place;
  export let geojson;

  const bounds_ew = [-6.3602, 49.8823, 1.7636, 55.8112];

  let map = null;
  let showMap = false;
  let showEmbed = false;
  let embedPlace = true;
  let bounds = place ? bbox(geojson.features.find(f => f.properties.areacd == place.code)) : bounds_ew;

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
    filterText = "";

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
</script>

<div id="hero">
  <section class="columns" style:padding-top="0">
    <div style:margin-top="0">
      <h2 class="text-lrg">
          How well do you know {place ? place.name : 'your area'}?
      </h2>
      <p class="text-big" style="margin-top: 5px">
        Can you correctly answer eight questions from Census 2021 data about your local authority area?
      </p>

      <form on:submit|preventDefault={e => dispatch('start', {e})}>
        <div style:margin="40px 0 0">
          <div class="form">
            <label for="select"><strong>Choose your area:</strong></label>
            <div class="select-group">
              <Select id="select" mode="search" idKey="code" labelKey="name" items={data} {placeholder} bind:filterText loadOptions={getPostcodes} on:select={doSelectPostcode} value={place} on:clear={doClearPostcode} darkMode/>
            </div>
          </div>
        </div>

        {#if geojson}
        <div class="map-container"
          style:height={showMap ? '250px' : '0'}
          style:margin-bottom="0"
          style:margin-top={showMap ? '10px' : '0'}>
          <div class="map"
            style:display={showMap ? 'visible' : 'hidden'}>
            <Map bind:map style="./data/map-style.json" location={{bounds}} controls options={{fitBoundsOptions: { padding: bounds == bounds_ew ? 0 : 30}}}>
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
                  let:hovered
                  on:select={doSelect}>
                  <MapTooltip content="{lookup[hovered] ? lookup[hovered].name : ''}"/>
                </MapLayer>
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
        </div>
        <button 
          class="btn-link"
          style:color="white"
          style:margin="5px 0 20px"
          type="button"
          on:click={() => showMap = !showMap}
          title="{showMap ? 'Hide map' : 'Show map'}">
          <Icon type="{showMap ? 'map_off' : 'map'}"/>
          <!-- <Icon type="{showMap ? 'map_off' : 'map'}"/> -->
          <span>{showMap ? 'Hide map' : 'Select on map'}</span>
        </button>
        {/if}

        <button
          type="submit"
          class="btn-menu btn-hero mb-5"
          disabled={!place}>
          Start quiz
        </button>
      </form>
      <button
        class="btn-link"
        style:color="white"
        on:click={() => showEmbed = !showEmbed}>
        <Icon type="code"/>
        <span>{showEmbed ? 'Hide embed code' : 'Embed this quiz'}</span>
      </button> |
      <button
        class="btn-link"
        style:color="white"
        on:click={e => dispatch('qa', {e})}
        disabled={!place}>
      <span>View all questions</span>
      </button>

      {#if showEmbed}
      <div class="embed-container">
        <textarea id="embed" readonly>{makeEmbed(place && embedPlace ? place.code : null)}</textarea>
        {#if place}
        <label>
          <input type="checkbox" bind:checked={embedPlace}/>
          Set {place.name} as default selection
        </label>
        {/if}
        <button class="btn-primary" style:margin="3px 0 0" on:click={copyEmbed}><Icon type="copy"/> Copy to clipboard</button>
      </div>
      {/if}

    </div>
  </section>
</div>