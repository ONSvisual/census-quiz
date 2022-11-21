<script>
  import { onMount } from "svelte";

  export let analyticsId; // Required. Google analytics/tag manager ID
  export let analyticsProps = {}; // Optional props to describe the content
  export let usageCookies = false; // True if usage cookies are allowed (to be read from parent component)

  let allowLoad; // Fill be set to false if on embed url

  function hasCookiesPreferencesSet() {
    return -1 < document.cookie.indexOf("cookies_preferences_set=true");
  }

  // Check if usage cookies are allowed (for Google Analytics + Hotjar)
  function getUsageCookieValue() {
    var cookiesPolicyCookie = document.cookie.match(new RegExp("(^|;) ?cookies_policy=([^;]*)(;|$)"));
    if (cookiesPolicyCookie) {
      var decodedCookie = decodeURIComponent(cookiesPolicyCookie[2]);
      var cookieValue = JSON.parse(decodedCookie);
      return cookieValue.usage;
    }
    return false;
  }

  // Initialise analytics and 'window.dataLayer' (which can be used throughout the app)
  function initAnalytics() {
    console.log("initialising analytics");
    window.dataLayer = [
      {
        analyticsOptOut: false,
        "gtm.whitelist": ["google", "hjtc", "lcl"],
        "gtm.blacklist": ["customScripts", "sp", "adm", "awct", "k", "d", "j"],
        ...analyticsProps,
      },
    ];

    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.head,
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.appendChild(j);
    })(window, document, "script", "dataLayer", analyticsId);
  }

  onMount(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    let parent = new URLSearchParams(document.location.search).get("parentUrl");
    if (parent && parent.includes("ons.gov.uk")) allowLoad = true;
    if (allowLoad && getUsageCookieValue()) initAnalytics();
  });
</script>