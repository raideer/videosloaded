class VideosLoaded {
    constructor(element, callback, options) {
        if (typeof callback == 'object' && !options) {
            options = callback;
            this.callback = null;
        } else {
            this.callback = callback;
        }

        this.options = Object.assign({
            loadInstantly: true,
            timeout: 0,
            readyState: 4
        }, options);

        if (typeof element == 'string') {
            this.element = document.querySelectorAll(element);
        } else {
            this.element = element;
        }

        this.elements = this._nodeListToArray(this.element);

        this.videos = [];
        this.addVideos();

        if (this.options.loadInstantly) {
            return this.load();
        }
    }

    _nodeListToArray(nl) {
        if (Array.isArray(nl)) {
            return nl;
        }

        if (nl instanceof NodeList) {
            return Array.prototype.slice.call(nl);
        }

        return [nl];
    }

    addVideos() {
        this.elements.forEach(element => {
            if (element.nodeName == 'VIDEO') {
                this.videos.push(element);
            }

            element.querySelectorAll('video').forEach(video => {
                this.videos.push(video);
            });
        });
    }

    load() {
        const promises = [];

        const checkIfReady = video => {
            return video.readyState >= this.options.readyState;
        };

        this.videos.forEach(video => {
            promises.push(new Promise(resolve => {
                if (checkIfReady(video)) {
                    return resolve();
                }

                video.addEventListener('loadeddata', () => {
                    if (checkIfReady(video)) {
                        return resolve();
                    }
                }, false);
            }));
        });

        let promise = Promise.all(promises);

        if (this.options.timeout > 0) {
            const timeout = new Promise((resolve, reject) => {
                const t = setTimeout(() => {
                    clearTimeout(t);
                    reject({
                        error: `Load timed out (${this.options.timeout}ms)`,
                        timeout: this.options.timeout
                    });
                }, this.options.timeout);
            });

            promise = Promise.race([
                promise,
                timeout
            ]);
        }

        return promise.then(() => {
            if (typeof this.callback == 'function') {
                this.callback.call(null, this.videos);
            }

            return Promise.resolve(this.videos);
        });
    }

    static bindToJQuery(jQuery) {
        jQuery = jQuery || window.jQuery;
        if (!jQuery) return;

        jQuery.fn.videosLoaded = function videosLoaded(callback, options) {
            return new VideosLoaded(this.get(), callback, options);
        };
    }
}

VideosLoaded.bindToJQuery();

module.exports = VideosLoaded;
