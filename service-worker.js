importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js");

const urlsToCache = [{ url: "./", revision: "1" }];

if (workbox) {
    workbox.core.skipWaiting();
    workbox.core.clientsClaim();
    console.warn("[!] Workbox OK!");
    // workbox.setConfig({ debug: true });
    // workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
    workbox.core.setCacheNameDetails({
        prefix: "",
        suffix: "",
        precache: "WY-Precache",
        runtime: "WY-Runtime",
    });

    // Set pre-cache
    workbox.precaching.precacheAndRoute(urlsToCache, {
        ignoreUrlParametersMatching: [/.*/],
    });

    // Set other cache
    workbox.routing.registerRoute(
        ({ url }) => url.origin,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: "WY-Cache",
        })
    );
} else {
    console.error("[!] Workbox Failed");
}
