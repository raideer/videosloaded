# videosLoaded

## usage
``` js
// With callback
new VideosLoaded(element, function(videos) {
    console.log('Loaded videos:', videos);
});

// With promises
var load = new VideosLoaded(element);
load.then(function(videos) {
    console.log('Loaded videos:', videos);
});

// With jQuery
$(selector).videosLoaded(callback);

// With custom jQuery instance
VideosLoaded.bindToJQuery(customJQuery);
customJQuery(selector).videosLoaded(callback);
```

## handling timeouts
``` js
var load = new VideosLoaded(element, {
    timeout: 1000 //ms
});

load.catch(function(e) {
    consoloe.log('Timed out after', e, 'ms');
});
```