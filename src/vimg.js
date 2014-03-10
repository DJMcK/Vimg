(function (global, document, undefined) {
    'use strict';

    var Vimg;

    Vimg = (function () {
        var self = {}
            , internals = {}
            , win = window
            , doc = document;

        /*
            ### Constructor

            Options:
            ```
            {
                // Element selector for placeholders
                selector: ''

                // Delayed render call for performance
                interval: Number
            }
            ```

            Example:
            ``` 
            new Vimg({...});
            ```

            @param {object} options
            @return {object} Vimg
        */
        function Vimg (options) {
            self = this;

            // If options is underfined provide empty object
            this.options = options || {};

            // Set options and provide public access
            this.options.selector = this.options.selector || '.vimg';
            this.options.interval = parseInt(this.options.interval) || 1000;
            this.options.offset = parseInt(this.options.offset) || 300;
            internals.nodes = doc.querySelectorAll(this.options.selector);
            this.nodes = [];
            for (var i = 0; i < internals.nodes.length; i++) {
                this.nodes.push(internals.nodes[i]);
            }

            this.listen();

            internals._shouldPoll = true;
            this.pollNodes();

            return {
                poll: this.pollNodes
              , images: this.nodes
            };
        }

        /*
            ### listen
            
            Binds up base events for afterwhich we would like to poll 
            for any images now being in the view.

            @returns {Number} `setInterval` identifier
        */
        Vimg.prototype.listen = function() {
            this.subscribeEvent(win, 'scroll', this.shouldPoll);
            this.subscribeEvent(win, 'resize', this.shouldPoll);
            this.subscribeEvent(win, 'load', this.shouldPoll);

            this.throttled = setInterval(
                this.pollNodes,this.options.interval
            );

            return this.throttled;
        };


        /*
            ### subscribeEvent

            Method used to call correct event listener method in different
            browsers as required.

            @params {Object} Node to attach event to.
            @params {String} Event to listen for.
        */
        Vimg.prototype.subscribeEvent = function(node, event) {
            if (doc.addEventListener) {
                return node.addEventListener(event, this.shouldPoll, false);
            } else {
                return node.attachEvent('on'+event, this.shouldPoll);
            }
        };

        /*
            ### unsubscribeEvent

            Method used to call correct event detach method in different
            browsers as required.

            @params {Object} Node to attach event to.
            @params {String} Event to listen for.
        */
        Vimg.prototype.unsubscribeEvent = function(node, event) {
            if (doc.removeEventListener) {
                return node.removeEventListener(event, this.shouldPoll, false);
            } else {
                return node.detachEvent('on'+event, this.shouldPoll);
            }
        };

        /*
            ### emitEvent

            Called to fire custom events on any given node. This method is
            used primarily to allow us to fire a `loaded` event on our images.
            This allows others to subscribe to this event and perform any
            additional actions required at the time.

            @params {Object} Node to emit from
            @params {String} Event to be mitted.
        */
        Vimg.prototype.emitEvent = function(node, event) {
            var e = new Event(event);
            return node.dispatchEvent(e);
        };

        /*
            ### shouldPoll

            Called on any of our events subscribed to in `Vimg.listen`.
            This will flag an internal bool true meaning the next tick
            of `Vimg.pollNodes` will perform a check on all nodes.

            @returns {Boolean} will always be `true`.
        */
        Vimg.prototype.shouldPoll = function() {
            internals._shouldPoll = true;
            return internals._shouldPoll;
        };

        /*
            ### pollNodes

            Given that a relevant event has fired and we have at least
            one node we will check if any are in the viewport. For each
            node that is found to be in the view we will remove it from
            our `self.nodes` array and emit our custom event.

            If we have no nodes to be tracking we will unsubscribe from
            any events set in `Vimg.listen` and stop our throttled polling.

            @returns {Array} All nodes (if any) still being tracked.
        */
        Vimg.prototype.pollNodes = function() {
            var me;

            if (internals._shouldPoll && self.nodes.length > 0) {
                for (var i = 0; i < self.nodes.length; i++) {
                    me = self.nodes[i];

                    if (me && self.withinView(me)) {
                        me.src = me.getAttribute('data-src');
                        self.emitEvent(me, 'vimg-loaded');
                        delete self.nodes[i];
                    }
                }

                internals._shouldPoll = false;
            } else if (self.nodes.length === 0) {
                this.unsubscribeEvent(win, 'scroll', this.shouldPoll);
                this.unsubscribeEvent(win, 'resize', this.shouldPoll);
                this.unsubscribeEvent(win, 'load', this.shouldPoll);
                clearInterval(this.throttled);
            }

            return self.nodes;
        };

        /*
            ### withinView

            Given a node we will check if that node is within the boundaries of
            the browser viewport (plus our offset).

            @params {Object} Element object.
            @returns {Boolean} Is it in view?
        */
        Vimg.prototype.withinView = function(node) {
            var coords = node.getBoundingClientRect();
            return ((coords.top >= 0 && coords.left >= 0 && coords.top) <=
                (window.innerHeight || document.documentElement.clientHeight) +
                this.options.offset);
        };

        return Vimg;
    })();

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = Vimg;
    } else if (typeof define === 'function' && define.amd) {
        define(function () { return Vimg; });
    } else if (typeof window === 'object') {
        window.Vimg = Vimg;
    }
}).call(this, window, document);