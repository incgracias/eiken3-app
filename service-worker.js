const CACHE_NAME = "eiken3-app-v22";
const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./data/chapter01.js",
  "./data/chapter02.js",
  "./data/chapter03.js",
  "./data/chapter04.js",
  "./data/chapter05.js",
  "./data/chapter06.js",
  "./data/chapter07.js",
  "./images/chapter05/part1_01.png",
  "./images/chapter05/part1_02.png",
  "./images/chapter05/part1_03.png",
  "./images/chapter05/part1_04.png",
  "./images/chapter05/part1_05.png",
  "./images/chapter05/part1_06.png",
  "./images/chapter05/part1_07.png",
  "./images/chapter05/part1_08.png",
  "./images/chapter05/part1_09.png",
  "./images/chapter05/part1_10.png",
  "./images/chapter06/interview_01.png",
  "./images/chapter06/interview_02.png",
  "./images/chapter06/interview_03.png",
  "./images/chapter06/interview_04.png",
  "./images/chapter06/interview_05.png",
  "./images/chapter06/interview_06.png",
  "./images/chapter06/interview_07.png",
  "./images/chapter06/card_a.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
