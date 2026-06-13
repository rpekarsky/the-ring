// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:12,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};"object"===typeof module&&(module.exports=Stats);
;/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */
/*global define:false, require:false, exports:false, module:false, signals:false */

/** @license
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license
 * Author: Miller Medeiros
 * Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
 */

(function(global){

    // SignalBinding -------------------------------------------------
    //================================================================

    /**
     * Object that represents a binding between a Signal and a listener function.
     * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
     * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
     * @author Miller Medeiros
     * @constructor
     * @internal
     * @name SignalBinding
     * @param {Signal} signal Reference to Signal object that listener is currently bound to.
     * @param {Function} listener Handler function bound to the signal.
     * @param {boolean} isOnce If binding should be executed just once.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. (default = 0).
     */
    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {

        /**
         * Handler function bound to the signal.
         * @type Function
         * @private
         */
        this._listener = listener;

        /**
         * If binding should be executed just once.
         * @type boolean
         * @private
         */
        this._isOnce = isOnce;

        /**
         * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @memberOf SignalBinding.prototype
         * @name context
         * @type Object|undefined|null
         */
        this.context = listenerContext;

        /**
         * Reference to Signal object that listener is currently bound to.
         * @type Signal
         * @private
         */
        this._signal = signal;

        /**
         * Listener priority
         * @type Number
         * @private
         */
        this._priority = priority || 0;
    }

    SignalBinding.prototype = {

        /**
         * If binding is active and should be executed.
         * @type boolean
         */
        active : true,

        /**
         * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
         * @type Array|null
         */
        params : null,

        /**
         * Call listener passing arbitrary parameters.
         * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
         * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
         * @return {*} Value returned by the listener.
         */
        execute : function (paramsArr) {
            var handlerReturn, params;
            if (this.active && !!this._listener) {
                params = this.params? this.params.concat(paramsArr) : paramsArr;
                handlerReturn = this._listener.apply(this.context, params);
                if (this._isOnce) {
                    this.detach();
                }
            }
            return handlerReturn;
        },

        /**
         * Detach binding from signal.
         * - alias to: mySignal.remove(myBinding.getListener());
         * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
         */
        detach : function () {
            return this.isBound()? this._signal.remove(this._listener, this.context) : null;
        },

        /**
         * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
         */
        isBound : function () {
            return (!!this._signal && !!this._listener);
        },

        /**
         * @return {boolean} If SignalBinding will only be executed once.
         */
        isOnce : function () {
            return this._isOnce;
        },

        /**
         * @return {Function} Handler function bound to the signal.
         */
        getListener : function () {
            return this._listener;
        },

        /**
         * @return {Signal} Signal that listener is currently bound to.
         */
        getSignal : function () {
            return this._signal;
        },

        /**
         * Delete instance properties
         * @private
         */
        _destroy : function () {
            delete this._signal;
            delete this._listener;
            delete this.context;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[SignalBinding isOnce:' + this._isOnce +', isBound:'+ this.isBound() +', active:' + this.active + ']';
        }

    };


/*global SignalBinding:false*/

    // Signal --------------------------------------------------------
    //================================================================

    function validateListener(listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error( 'listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName) );
        }
    }

    /**
     * Custom event broadcaster
     * <br />- inspired by Robert Penner's AS3 Signals.
     * @name Signal
     * @author Miller Medeiros
     * @constructor
     */
    function Signal() {
        /**
         * @type Array.<SignalBinding>
         * @private
         */
        this._bindings = [];
        this._prevParams = null;

        // enforce dispatch to aways work on same context (#47)
        var self = this;
        this.dispatch = function(){
            Signal.prototype.dispatch.apply(self, arguments);
        };
    }

    Signal.prototype = {

        /**
         * Signals Version Number
         * @type String
         * @const
         */
        VERSION : '1.0.0',

        /**
         * If Signal should keep record of previously dispatched parameters and
         * automatically execute listener during `add()`/`addOnce()` if Signal was
         * already dispatched before.
         * @type boolean
         */
        memorize : false,

        /**
         * @type boolean
         * @private
         */
        _shouldPropagate : true,

        /**
         * If Signal is active and should broadcast events.
         * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
         * @type boolean
         */
        active : true,

        /**
         * @param {Function} listener
         * @param {boolean} isOnce
         * @param {Object} [listenerContext]
         * @param {Number} [priority]
         * @return {SignalBinding}
         * @private
         */
        _registerListener : function (listener, isOnce, listenerContext, priority) {

            var prevIndex = this._indexOfListener(listener, listenerContext),
                binding;

            if (prevIndex !== -1) {
                binding = this._bindings[prevIndex];
                if (binding.isOnce() !== isOnce) {
                    throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
                }
            } else {
                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
                this._addBinding(binding);
            }

            if(this.memorize && this._prevParams){
                binding.execute(this._prevParams);
            }

            return binding;
        },

        /**
         * @param {SignalBinding} binding
         * @private
         */
        _addBinding : function (binding) {
            //simplified insertion sort
            var n = this._bindings.length;
            do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
            this._bindings.splice(n + 1, 0, binding);
        },

        /**
         * @param {Function} listener
         * @return {number}
         * @private
         */
        _indexOfListener : function (listener, context) {
            var n = this._bindings.length,
                cur;
            while (n--) {
                cur = this._bindings[n];
                if (cur._listener === listener && cur.context === context) {
                    return n;
                }
            }
            return -1;
        },

        /**
         * Check if listener was attached to Signal.
         * @param {Function} listener
         * @param {Object} [context]
         * @return {boolean} if Signal has the specified listener.
         */
        has : function (listener, context) {
            return this._indexOfListener(listener, context) !== -1;
        },

        /**
         * Add a listener to the signal.
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        add : function (listener, listenerContext, priority) {
            validateListener(listener, 'add');
            return this._registerListener(listener, false, listenerContext, priority);
        },

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        addOnce : function (listener, listenerContext, priority) {
            validateListener(listener, 'addOnce');
            return this._registerListener(listener, true, listenerContext, priority);
        },

        /**
         * Remove a single listener from the dispatch queue.
         * @param {Function} listener Handler function that should be removed.
         * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
         * @return {Function} Listener handler function.
         */
        remove : function (listener, context) {
            validateListener(listener, 'remove');

            var i = this._indexOfListener(listener, context);
            if (i !== -1) {
                this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
                this._bindings.splice(i, 1);
            }
            return listener;
        },

        /**
         * Remove all listeners from the Signal.
         */
        removeAll : function () {
            var n = this._bindings.length;
            while (n--) {
                this._bindings[n]._destroy();
            }
            this._bindings.length = 0;
        },

        /**
         * @return {number} Number of listeners attached to the Signal.
         */
        getNumListeners : function () {
            return this._bindings.length;
        },

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
         * @see Signal.prototype.disable
         */
        halt : function () {
            this._shouldPropagate = false;
        },

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         * @param {...*} [params] Parameters that should be passed to each handler.
         */
        dispatch : function (params) {
            if (! this.active) {
                return;
            }

            var paramsArr = Array.prototype.slice.call(arguments),
                n = this._bindings.length,
                bindings;

            if (this.memorize) {
                this._prevParams = paramsArr;
            }

            if (! n) {
                //should come after memorize
                return;
            }

            bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
            this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

            //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
            //reverse loop since listeners with higher priority will be added at the end of the list
            do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        },

        /**
         * Forget memorized arguments.
         * @see Signal.memorize
         */
        forget : function(){
            this._prevParams = null;
        },

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
         */
        dispose : function () {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[Signal active:'+ this.active +' numListeners:'+ this.getNumListeners() +']';
        }

    };


    // Namespace -----------------------------------------------------
    //================================================================

    /**
     * Signals namespace
     * @namespace
     * @name signals
     */
    var signals = Signal;

    /**
     * Custom event broadcaster
     * @see Signal
     */
    // alias for backwards compatibility (see #gh-44)
    signals.Signal = Signal;



    //exports to multiple environments
    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return signals; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = signals;
    } else { //browser
        //use string because of Google closure compiler ADVANCED_MODE
        /*jslint sub:true */
        global['signals'] = signals;
    }

}(this));
;/*!
MIT License

Copyright (c) 2011 Max Kueng, George Crabtree
 
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
 
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
!function(t){if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.Victor=t()}}(function(){return function t(n,i,o){function r(s,h){if(!i[s]){if(!n[s]){var u="function"==typeof require&&require;if(!h&&u)return u(s,!0);if(e)return e(s,!0);throw new Error("Cannot find module '"+s+"'")}var p=i[s]={exports:{}};n[s][0].call(p.exports,function(t){var i=n[s][1][t];return r(i?i:t)},p,p.exports,t,n,i,o)}return i[s].exports}for(var e="function"==typeof require&&require,s=0;s<o.length;s++)r(o[s]);return r}({1:[function(t,n,i){function o(t,n){return this instanceof o?(this.x=t||0,void(this.y=n||0)):new o(t,n)}function r(t,n){return Math.floor(Math.random()*(n-t+1)+t)}function e(t){return t*h}function s(t){return t/h}i=n.exports=o,o.fromArray=function(t){return new o(t[0]||0,t[1]||0)},o.fromObject=function(t){return new o(t.x||0,t.y||0)},o.prototype.addX=function(t){return this.x+=t.x,this},o.prototype.addY=function(t){return this.y+=t.y,this},o.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},o.prototype.subtractX=function(t){return this.x-=t.x,this},o.prototype.subtractY=function(t){return this.y-=t.y,this},o.prototype.subtract=function(t){return this.x-=t.x,this.y-=t.y,this},o.prototype.divideX=function(t){return this.x/=t.x,this},o.prototype.divideY=function(t){return this.y/=t.y,this},o.prototype.divide=function(t){return this.x/=t.x,this.y/=t.y,this},o.prototype.invertX=function(){return this.x*=-1,this},o.prototype.invertY=function(){return this.y*=-1,this},o.prototype.invert=function(){return this.invertX(),this.invertY(),this},o.prototype.multiplyX=function(t){return this.x*=t.x,this},o.prototype.multiplyY=function(t){return this.y*=t.y,this},o.prototype.multiply=function(t){return this.x*=t.x,this.y*=t.y,this},o.prototype.normalize=function(){var t=this.length();return 0===t?(this.x=1,this.y=0):this.divide(o(t,t)),this},o.prototype.norm=o.prototype.normalize,o.prototype.limit=function(t,n){return Math.abs(this.x)>t&&(this.x*=n),Math.abs(this.y)>t&&(this.y*=n),this},o.prototype.randomize=function(t,n){return this.randomizeX(t,n),this.randomizeY(t,n),this},o.prototype.randomizeX=function(t,n){var i=Math.min(t.x,n.x),o=Math.max(t.x,n.x);return this.x=r(i,o),this},o.prototype.randomizeY=function(t,n){var i=Math.min(t.y,n.y),o=Math.max(t.y,n.y);return this.y=r(i,o),this},o.prototype.randomizeAny=function(t,n){return Math.round(Math.random())?this.randomizeX(t,n):this.randomizeY(t,n),this},o.prototype.unfloat=function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},o.prototype.mixX=function(t,n){return"undefined"==typeof n&&(n=.5),this.x=(1-n)*this.x+n*t.x,this},o.prototype.mixY=function(t,n){return"undefined"==typeof n&&(n=.5),this.y=(1-n)*this.y+n*t.y,this},o.prototype.mix=function(t,n){return this.mixX(t,n),this.mixY(t,n),this},o.prototype.clone=function(){return new o(this.x,this.y)},o.prototype.copyX=function(t){return this.x=t.x,this},o.prototype.copyY=function(t){return this.y=t.y,this},o.prototype.copy=function(t){return this.copyX(t),this.copyY(t),this},o.prototype.zero=function(){return this.x=this.y=0,this},o.prototype.dot=function(t){return this.x*t.x+this.y*t.y},o.prototype.cross=function(t){return this.x*t.y-this.y*t.x},o.prototype.projectOnto=function(t){var n=(this.x*t.x+this.y*t.y)/(t.x*t.x+t.y*t.y);return this.x=n*t.x,this.y=n*t.y,this},o.prototype.horizontalAngle=function(){return Math.atan2(this.y,this.x)},o.prototype.horizontalAngleDeg=function(){return e(this.horizontalAngle())},o.prototype.verticalAngle=function(){return Math.atan2(this.x,this.y)},o.prototype.verticalAngleDeg=function(){return e(this.verticalAngle())},o.prototype.angle=o.prototype.horizontalAngle,o.prototype.angleDeg=o.prototype.horizontalAngleDeg,o.prototype.direction=o.prototype.horizontalAngle,o.prototype.rotate=function(t){var n=this.x*Math.cos(t)-this.y*Math.sin(t),i=this.x*Math.sin(t)+this.y*Math.cos(t);return this.x=n,this.y=i,this},o.prototype.rotateDeg=function(t){return t=s(t),this.rotate(t)},o.prototype.rotateBy=function(t){var n=this.angle()+t;return this.rotate(n)},o.prototype.rotateByDeg=function(t){return t=s(t),this.rotateBy(t)},o.prototype.distanceX=function(t){return this.x-t.x},o.prototype.absDistanceX=function(t){return Math.abs(this.distanceX(t))},o.prototype.distanceY=function(t){return this.y-t.y},o.prototype.absDistanceY=function(t){return Math.abs(this.distanceY(t))},o.prototype.distance=function(t){return Math.sqrt(this.distanceSq(t))},o.prototype.distanceSq=function(t){var n=this.distanceX(t),i=this.distanceY(t);return n*n+i*i},o.prototype.length=function(){return Math.sqrt(this.lengthSq())},o.prototype.lengthSq=function(){return this.x*this.x+this.y*this.y},o.prototype.magnitude=o.prototype.length,o.prototype.isZero=function(){return 0===this.x&&0===this.y},o.prototype.isEqualTo=function(t){return this.x===t.x&&this.y===t.y},o.prototype.toString=function(){return"x:"+this.x+", y:"+this.y},o.prototype.toArray=function(){return[this.x,this.y]},o.prototype.toObject=function(){return{x:this.x,y:this.y}};var h=180/Math.PI},{}]},{},[1])(1)});;/**
 * @license
 * pixi.js - v1.6.0
 * Copyright (c) 2012-2014, Mat Groves
 * http://goodboydigital.com/
 *
 * Compiled: 2014-07-18
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(){var a=this,b=b||{};b.WEBGL_RENDERER=0,b.CANVAS_RENDERER=1,b.VERSION="v1.6.1",b.blendModes={NORMAL:0,ADD:1,MULTIPLY:2,SCREEN:3,OVERLAY:4,DARKEN:5,LIGHTEN:6,COLOR_DODGE:7,COLOR_BURN:8,HARD_LIGHT:9,SOFT_LIGHT:10,DIFFERENCE:11,EXCLUSION:12,HUE:13,SATURATION:14,COLOR:15,LUMINOSITY:16},b.scaleModes={DEFAULT:0,LINEAR:0,NEAREST:1},b._UID=0,"undefined"!=typeof Float32Array?(b.Float32Array=Float32Array,b.Uint16Array=Uint16Array):(b.Float32Array=Array,b.Uint16Array=Array),b.INTERACTION_FREQUENCY=30,b.AUTO_PREVENT_DEFAULT=!0,b.RAD_TO_DEG=180/Math.PI,b.DEG_TO_RAD=Math.PI/180,b.dontSayHello=!1,b.sayHello=function(a){if(!b.dontSayHello){if(navigator.userAgent.toLowerCase().indexOf("chrome")>-1){var c=["%c %c %c Pixi.js "+b.VERSION+" - "+a+"  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ ","background: #ff66a5","background: #ff66a5","color: #ff66a5; background: #030307;","background: #ff66a5","background: #ffc3dc","background: #ff66a5","color: #ff2424; background: #fff","color: #ff2424; background: #fff","color: #ff2424; background: #fff"];console.log.apply(console,c)}else window.console&&console.log("Pixi.js "+b.VERSION+" - http://www.pixijs.com/");b.dontSayHello=!0}},b.Point=function(a,b){this.x=a||0,this.y=b||0},b.Point.prototype.clone=function(){return new b.Point(this.x,this.y)},b.Point.prototype.set=function(a,b){this.x=a||0,this.y=b||(0!==b?this.x:0)},b.Point.prototype.constructor=b.Point,b.Rectangle=function(a,b,c,d){this.x=a||0,this.y=b||0,this.width=c||0,this.height=d||0},b.Rectangle.prototype.clone=function(){return new b.Rectangle(this.x,this.y,this.width,this.height)},b.Rectangle.prototype.contains=function(a,b){if(this.width<=0||this.height<=0)return!1;var c=this.x;if(a>=c&&a<=c+this.width){var d=this.y;if(b>=d&&b<=d+this.height)return!0}return!1},b.Rectangle.prototype.constructor=b.Rectangle,b.EmptyRectangle=new b.Rectangle(0,0,0,0),b.Polygon=function(a){if(a instanceof Array||(a=Array.prototype.slice.call(arguments)),"number"==typeof a[0]){for(var c=[],d=0,e=a.length;e>d;d+=2)c.push(new b.Point(a[d],a[d+1]));a=c}this.points=a},b.Polygon.prototype.clone=function(){for(var a=[],c=0;c<this.points.length;c++)a.push(this.points[c].clone());return new b.Polygon(a)},b.Polygon.prototype.contains=function(a,b){for(var c=!1,d=0,e=this.points.length-1;d<this.points.length;e=d++){var f=this.points[d].x,g=this.points[d].y,h=this.points[e].x,i=this.points[e].y,j=g>b!=i>b&&(h-f)*(b-g)/(i-g)+f>a;j&&(c=!c)}return c},b.Polygon.prototype.constructor=b.Polygon,b.Circle=function(a,b,c){this.x=a||0,this.y=b||0,this.radius=c||0},b.Circle.prototype.clone=function(){return new b.Circle(this.x,this.y,this.radius)},b.Circle.prototype.contains=function(a,b){if(this.radius<=0)return!1;var c=this.x-a,d=this.y-b,e=this.radius*this.radius;return c*=c,d*=d,e>=c+d},b.Circle.prototype.getBounds=function(){return new b.Rectangle(this.x-this.radius,this.y-this.radius,this.width,this.height)},b.Circle.prototype.constructor=b.Circle,b.Ellipse=function(a,b,c,d){this.x=a||0,this.y=b||0,this.width=c||0,this.height=d||0},b.Ellipse.prototype.clone=function(){return new b.Ellipse(this.x,this.y,this.width,this.height)},b.Ellipse.prototype.contains=function(a,b){if(this.width<=0||this.height<=0)return!1;var c=(a-this.x)/this.width,d=(b-this.y)/this.height;return c*=c,d*=d,1>=c+d},b.Ellipse.prototype.getBounds=function(){return new b.Rectangle(this.x-this.width,this.y-this.height,this.width,this.height)},b.Ellipse.prototype.constructor=b.Ellipse,b.Matrix=function(){this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0},b.Matrix.prototype.fromArray=function(a){this.a=a[0],this.b=a[1],this.c=a[3],this.d=a[4],this.tx=a[2],this.ty=a[5]},b.Matrix.prototype.toArray=function(a){this.array||(this.array=new Float32Array(9));var b=this.array;return a?(b[0]=this.a,b[1]=this.c,b[2]=0,b[3]=this.b,b[4]=this.d,b[5]=0,b[6]=this.tx,b[7]=this.ty,b[8]=1):(b[0]=this.a,b[1]=this.b,b[2]=this.tx,b[3]=this.c,b[4]=this.d,b[5]=this.ty,b[6]=0,b[7]=0,b[8]=1),b},b.identityMatrix=new b.Matrix,b.determineMatrixArrayType=function(){return"undefined"!=typeof Float32Array?Float32Array:Array},b.Matrix2=b.determineMatrixArrayType(),b.DisplayObject=function(){this.position=new b.Point,this.scale=new b.Point(1,1),this.pivot=new b.Point(0,0),this.rotation=0,this.alpha=1,this.visible=!0,this.hitArea=null,this.buttonMode=!1,this.renderable=!1,this.parent=null,this.stage=null,this.worldAlpha=1,this._interactive=!1,this.defaultCursor="pointer",this.worldTransform=new b.Matrix,this.color=[],this.dynamic=!0,this._sr=0,this._cr=1,this.filterArea=null,this._bounds=new b.Rectangle(0,0,1,1),this._currentBounds=null,this._mask=null,this._cacheAsBitmap=!1,this._cacheIsDirty=!1},b.DisplayObject.prototype.constructor=b.DisplayObject,b.DisplayObject.prototype.setInteractive=function(a){this.interactive=a},Object.defineProperty(b.DisplayObject.prototype,"interactive",{get:function(){return this._interactive},set:function(a){this._interactive=a,this.stage&&(this.stage.dirty=!0)}}),Object.defineProperty(b.DisplayObject.prototype,"worldVisible",{get:function(){var a=this;do{if(!a.visible)return!1;a=a.parent}while(a);return!0}}),Object.defineProperty(b.DisplayObject.prototype,"mask",{get:function(){return this._mask},set:function(a){this._mask&&(this._mask.isMask=!1),this._mask=a,this._mask&&(this._mask.isMask=!0)}}),Object.defineProperty(b.DisplayObject.prototype,"filters",{get:function(){return this._filters},set:function(a){if(a){for(var b=[],c=0;c<a.length;c++)for(var d=a[c].passes,e=0;e<d.length;e++)b.push(d[e]);this._filterBlock={target:this,filterPasses:b}}this._filters=a}}),Object.defineProperty(b.DisplayObject.prototype,"cacheAsBitmap",{get:function(){return this._cacheAsBitmap},set:function(a){this._cacheAsBitmap!==a&&(a?this._generateCachedSprite():this._destroyCachedSprite(),this._cacheAsBitmap=a)}}),b.DisplayObject.prototype.updateTransform=function(){this.rotation!==this.rotationCache&&(this.rotationCache=this.rotation,this._sr=Math.sin(this.rotation),this._cr=Math.cos(this.rotation));var a=this.parent.worldTransform,b=this.worldTransform,c=this.pivot.x,d=this.pivot.y,e=this._cr*this.scale.x,f=-this._sr*this.scale.y,g=this._sr*this.scale.x,h=this._cr*this.scale.y,i=this.position.x-e*c-d*f,j=this.position.y-h*d-c*g,k=a.a,l=a.b,m=a.c,n=a.d;b.a=k*e+l*g,b.b=k*f+l*h,b.tx=k*i+l*j+a.tx,b.c=m*e+n*g,b.d=m*f+n*h,b.ty=m*i+n*j+a.ty,this.worldAlpha=this.alpha*this.parent.worldAlpha},b.DisplayObject.prototype.getBounds=function(a){return a=a,b.EmptyRectangle},b.DisplayObject.prototype.getLocalBounds=function(){return this.getBounds(b.identityMatrix)},b.DisplayObject.prototype.setStageReference=function(a){this.stage=a,this._interactive&&(this.stage.dirty=!0)},b.DisplayObject.prototype.generateTexture=function(a){var c=this.getLocalBounds(),d=new b.RenderTexture(0|c.width,0|c.height,a);return d.render(this,new b.Point(-c.x,-c.y)),d},b.DisplayObject.prototype.updateCache=function(){this._generateCachedSprite()},b.DisplayObject.prototype._renderCachedSprite=function(a){this._cachedSprite.worldAlpha=this.worldAlpha,a.gl?b.Sprite.prototype._renderWebGL.call(this._cachedSprite,a):b.Sprite.prototype._renderCanvas.call(this._cachedSprite,a)},b.DisplayObject.prototype._generateCachedSprite=function(){this._cacheAsBitmap=!1;var a=this.getLocalBounds();if(this._cachedSprite)this._cachedSprite.texture.resize(0|a.width,0|a.height);else{var c=new b.RenderTexture(0|a.width,0|a.height);this._cachedSprite=new b.Sprite(c),this._cachedSprite.worldTransform=this.worldTransform}var d=this._filters;this._filters=null,this._cachedSprite.filters=d,this._cachedSprite.texture.render(this,new b.Point(-a.x,-a.y)),this._cachedSprite.anchor.x=-(a.x/a.width),this._cachedSprite.anchor.y=-(a.y/a.height),this._filters=d,this._cacheAsBitmap=!0},b.DisplayObject.prototype._destroyCachedSprite=function(){this._cachedSprite&&(this._cachedSprite.texture.destroy(!0),this._cachedSprite=null)},b.DisplayObject.prototype._renderWebGL=function(a){a=a},b.DisplayObject.prototype._renderCanvas=function(a){a=a},Object.defineProperty(b.DisplayObject.prototype,"x",{get:function(){return this.position.x},set:function(a){this.position.x=a}}),Object.defineProperty(b.DisplayObject.prototype,"y",{get:function(){return this.position.y},set:function(a){this.position.y=a}}),b.DisplayObjectContainer=function(){b.DisplayObject.call(this),this.children=[]},b.DisplayObjectContainer.prototype=Object.create(b.DisplayObject.prototype),b.DisplayObjectContainer.prototype.constructor=b.DisplayObjectContainer,Object.defineProperty(b.DisplayObjectContainer.prototype,"width",{get:function(){return this.scale.x*this.getLocalBounds().width},set:function(a){var b=this.getLocalBounds().width;this.scale.x=0!==b?a/(b/this.scale.x):1,this._width=a}}),Object.defineProperty(b.DisplayObjectContainer.prototype,"height",{get:function(){return this.scale.y*this.getLocalBounds().height},set:function(a){var b=this.getLocalBounds().height;this.scale.y=0!==b?a/(b/this.scale.y):1,this._height=a}}),b.DisplayObjectContainer.prototype.addChild=function(a){return this.addChildAt(a,this.children.length)},b.DisplayObjectContainer.prototype.addChildAt=function(a,b){if(b>=0&&b<=this.children.length)return a.parent&&a.parent.removeChild(a),a.parent=this,this.children.splice(b,0,a),this.stage&&a.setStageReference(this.stage),a;throw new Error(a+" The index "+b+" supplied is out of bounds "+this.children.length)},b.DisplayObjectContainer.prototype.swapChildren=function(a,b){if(a!==b){var c=this.children.indexOf(a),d=this.children.indexOf(b);if(0>c||0>d)throw new Error("swapChildren: Both the supplied DisplayObjects must be a child of the caller.");this.children[c]=b,this.children[d]=a}},b.DisplayObjectContainer.prototype.getChildAt=function(a){if(a>=0&&a<this.children.length)return this.children[a];throw new Error("Supplied index does not exist in the child list, or the supplied DisplayObject must be a child of the caller")},b.DisplayObjectContainer.prototype.removeChild=function(a){return this.removeChildAt(this.children.indexOf(a))},b.DisplayObjectContainer.prototype.removeChildAt=function(a){var b=this.getChildAt(a);return this.stage&&b.removeStageReference(),b.parent=void 0,this.children.splice(a,1),b},b.DisplayObjectContainer.prototype.removeChildren=function(a,b){var c=a||0,d="number"==typeof b?b:this.children.length,e=d-c;if(e>0&&d>=e){for(var f=this.children.splice(c,e),g=0;g<f.length;g++){var h=f[g];this.stage&&h.removeStageReference(),h.parent=void 0}return f}throw new Error("Range Error, numeric values are outside the acceptable range")},b.DisplayObjectContainer.prototype.updateTransform=function(){if(this.visible&&(b.DisplayObject.prototype.updateTransform.call(this),!this._cacheAsBitmap))for(var a=0,c=this.children.length;c>a;a++)this.children[a].updateTransform()},b.DisplayObjectContainer.prototype.getBounds=function(a){if(0===this.children.length)return b.EmptyRectangle;if(a){var c=this.worldTransform;this.worldTransform=a,this.updateTransform(),this.worldTransform=c}for(var d,e,f,g=1/0,h=1/0,i=-1/0,j=-1/0,k=!1,l=0,m=this.children.length;m>l;l++){var n=this.children[l];n.visible&&(k=!0,d=this.children[l].getBounds(a),g=g<d.x?g:d.x,h=h<d.y?h:d.y,e=d.width+d.x,f=d.height+d.y,i=i>e?i:e,j=j>f?j:f)}if(!k)return b.EmptyRectangle;var o=this._bounds;return o.x=g,o.y=h,o.width=i-g,o.height=j-h,o},b.DisplayObjectContainer.prototype.getLocalBounds=function(){var a=this.worldTransform;this.worldTransform=b.identityMatrix;for(var c=0,d=this.children.length;d>c;c++)this.children[c].updateTransform();var e=this.getBounds();return this.worldTransform=a,e},b.DisplayObjectContainer.prototype.setStageReference=function(a){this.stage=a,this._interactive&&(this.stage.dirty=!0);for(var b=0,c=this.children.length;c>b;b++){var d=this.children[b];d.setStageReference(a)}},b.DisplayObjectContainer.prototype.removeStageReference=function(){for(var a=0,b=this.children.length;b>a;a++){var c=this.children[a];c.removeStageReference()}this._interactive&&(this.stage.dirty=!0),this.stage=null},b.DisplayObjectContainer.prototype._renderWebGL=function(a){if(this.visible&&!(this.alpha<=0)){if(this._cacheAsBitmap)return this._renderCachedSprite(a),void 0;var b,c;if(this._mask||this._filters){for(this._filters&&(a.spriteBatch.flush(),a.filterManager.pushFilter(this._filterBlock)),this._mask&&(a.spriteBatch.stop(),a.maskManager.pushMask(this.mask,a),a.spriteBatch.start()),b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a);a.spriteBatch.stop(),this._mask&&a.maskManager.popMask(this._mask,a),this._filters&&a.filterManager.popFilter(),a.spriteBatch.start()}else for(b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a)}},b.DisplayObjectContainer.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha){if(this._cacheAsBitmap)return this._renderCachedSprite(a),void 0;this._mask&&a.maskManager.pushMask(this._mask,a.context);for(var b=0,c=this.children.length;c>b;b++){var d=this.children[b];d._renderCanvas(a)}this._mask&&a.maskManager.popMask(a.context)}},b.Sprite=function(a){b.DisplayObjectContainer.call(this),this.anchor=new b.Point,this.texture=a,this._width=0,this._height=0,this.tint=16777215,this.blendMode=b.blendModes.NORMAL,a.baseTexture.hasLoaded?this.onTextureUpdate():(this.onTextureUpdateBind=this.onTextureUpdate.bind(this),this.texture.addEventListener("update",this.onTextureUpdateBind)),this.renderable=!0},b.Sprite.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Sprite.prototype.constructor=b.Sprite,Object.defineProperty(b.Sprite.prototype,"width",{get:function(){return this.scale.x*this.texture.frame.width},set:function(a){this.scale.x=a/this.texture.frame.width,this._width=a}}),Object.defineProperty(b.Sprite.prototype,"height",{get:function(){return this.scale.y*this.texture.frame.height},set:function(a){this.scale.y=a/this.texture.frame.height,this._height=a}}),b.Sprite.prototype.setTexture=function(a){this.texture=a,this.cachedTint=16777215},b.Sprite.prototype.onTextureUpdate=function(){this._width&&(this.scale.x=this._width/this.texture.frame.width),this._height&&(this.scale.y=this._height/this.texture.frame.height)},b.Sprite.prototype.getBounds=function(a){var b=this.texture.frame.width,c=this.texture.frame.height,d=b*(1-this.anchor.x),e=b*-this.anchor.x,f=c*(1-this.anchor.y),g=c*-this.anchor.y,h=a||this.worldTransform,i=h.a,j=h.c,k=h.b,l=h.d,m=h.tx,n=h.ty,o=i*e+k*g+m,p=l*g+j*e+n,q=i*d+k*g+m,r=l*g+j*d+n,s=i*d+k*f+m,t=l*f+j*d+n,u=i*e+k*f+m,v=l*f+j*e+n,w=-1/0,x=-1/0,y=1/0,z=1/0;y=y>o?o:y,y=y>q?q:y,y=y>s?s:y,y=y>u?u:y,z=z>p?p:z,z=z>r?r:z,z=z>t?t:z,z=z>v?v:z,w=o>w?o:w,w=q>w?q:w,w=s>w?s:w,w=u>w?u:w,x=p>x?p:x,x=r>x?r:x,x=t>x?t:x,x=v>x?v:x;var A=this._bounds;return A.x=y,A.width=w-y,A.y=z,A.height=x-z,this._currentBounds=A,A},b.Sprite.prototype._renderWebGL=function(a){if(this.visible&&!(this.alpha<=0)){var b,c;if(this._mask||this._filters){var d=a.spriteBatch;for(this._filters&&(d.flush(),a.filterManager.pushFilter(this._filterBlock)),this._mask&&(d.stop(),a.maskManager.pushMask(this.mask,a),d.start()),d.render(this),b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a);d.stop(),this._mask&&a.maskManager.popMask(this._mask,a),this._filters&&a.filterManager.popFilter(),d.start()}else for(a.spriteBatch.render(this),b=0,c=this.children.length;c>b;b++)this.children[b]._renderWebGL(a)}},b.Sprite.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha){if(this.blendMode!==a.currentBlendMode&&(a.currentBlendMode=this.blendMode,a.context.globalCompositeOperation=b.blendModesCanvas[a.currentBlendMode]),this._mask&&a.maskManager.pushMask(this._mask,a.context),this.texture.valid){a.context.globalAlpha=this.worldAlpha,a.roundPixels?a.context.setTransform(this.worldTransform.a,this.worldTransform.c,this.worldTransform.b,this.worldTransform.d,0|this.worldTransform.tx,0|this.worldTransform.ty):a.context.setTransform(this.worldTransform.a,this.worldTransform.c,this.worldTransform.b,this.worldTransform.d,this.worldTransform.tx,this.worldTransform.ty),a.smoothProperty&&a.scaleMode!==this.texture.baseTexture.scaleMode&&(a.scaleMode=this.texture.baseTexture.scaleMode,a.context[a.smoothProperty]=a.scaleMode===b.scaleModes.LINEAR);var c=this.texture.trim?this.texture.trim.x-this.anchor.x*this.texture.trim.width:this.anchor.x*-this.texture.frame.width,d=this.texture.trim?this.texture.trim.y-this.anchor.y*this.texture.trim.height:this.anchor.y*-this.texture.frame.height;16777215!==this.tint?(this.cachedTint!==this.tint&&(this.cachedTint=this.tint,this.tintedTexture=b.CanvasTinter.getTintedTexture(this,this.tint)),a.context.drawImage(this.tintedTexture,0,0,this.texture.crop.width,this.texture.crop.height,c,d,this.texture.crop.width,this.texture.crop.height)):a.context.drawImage(this.texture.baseTexture.source,this.texture.crop.x,this.texture.crop.y,this.texture.crop.width,this.texture.crop.height,c,d,this.texture.crop.width,this.texture.crop.height)}for(var e=0,f=this.children.length;f>e;e++)this.children[e]._renderCanvas(a);this._mask&&a.maskManager.popMask(a.context)}},b.Sprite.fromFrame=function(a){var c=b.TextureCache[a];if(!c)throw new Error('The frameId "'+a+'" does not exist in the texture cache'+this);return new b.Sprite(c)},b.Sprite.fromImage=function(a,c,d){var e=b.Texture.fromImage(a,c,d);return new b.Sprite(e)},b.SpriteBatch=function(a){b.DisplayObjectContainer.call(this),this.textureThing=a,this.ready=!1},b.SpriteBatch.prototype=Object.create(b.DisplayObjectContainer.prototype),b.SpriteBatch.constructor=b.SpriteBatch,b.SpriteBatch.prototype.initWebGL=function(a){this.fastSpriteBatch=new b.WebGLFastSpriteBatch(a),this.ready=!0},b.SpriteBatch.prototype.updateTransform=function(){b.DisplayObject.prototype.updateTransform.call(this)},b.SpriteBatch.prototype._renderWebGL=function(a){!this.visible||this.alpha<=0||!this.children.length||(this.ready||this.initWebGL(a.gl),a.spriteBatch.stop(),a.shaderManager.setShader(a.shaderManager.fastShader),this.fastSpriteBatch.begin(this,a),this.fastSpriteBatch.render(this),a.spriteBatch.start())},b.SpriteBatch.prototype._renderCanvas=function(a){var c=a.context;c.globalAlpha=this.worldAlpha,b.DisplayObject.prototype.updateTransform.call(this);for(var d=this.worldTransform,e=!0,f=0;f<this.children.length;f++){var g=this.children[f];if(g.visible){var h=g.texture,i=h.frame;if(c.globalAlpha=this.worldAlpha*g.alpha,g.rotation%(2*Math.PI)===0)e&&(c.setTransform(d.a,d.c,d.b,d.d,d.tx,d.ty),e=!1),c.drawImage(h.baseTexture.source,i.x,i.y,i.width,i.height,g.anchor.x*-i.width*g.scale.x+g.position.x+.5|0,g.anchor.y*-i.height*g.scale.y+g.position.y+.5|0,i.width*g.scale.x,i.height*g.scale.y);else{e||(e=!0),b.DisplayObject.prototype.updateTransform.call(g);var j=g.worldTransform;a.roundPixels?c.setTransform(j.a,j.c,j.b,j.d,0|j.tx,0|j.ty):c.setTransform(j.a,j.c,j.b,j.d,j.tx,j.ty),c.drawImage(h.baseTexture.source,i.x,i.y,i.width,i.height,g.anchor.x*-i.width+.5|0,g.anchor.y*-i.height+.5|0,i.width,i.height)}}}},b.MovieClip=function(a){b.Sprite.call(this,a[0]),this.textures=a,this.animationSpeed=1,this.loop=!0,this.onComplete=null,this.currentFrame=0,this.playing=!1},b.MovieClip.prototype=Object.create(b.Sprite.prototype),b.MovieClip.prototype.constructor=b.MovieClip,Object.defineProperty(b.MovieClip.prototype,"totalFrames",{get:function(){return this.textures.length}}),b.MovieClip.prototype.stop=function(){this.playing=!1},b.MovieClip.prototype.play=function(){this.playing=!0},b.MovieClip.prototype.gotoAndStop=function(a){this.playing=!1,this.currentFrame=a;var b=this.currentFrame+.5|0;this.setTexture(this.textures[b%this.textures.length])},b.MovieClip.prototype.gotoAndPlay=function(a){this.currentFrame=a,this.playing=!0},b.MovieClip.prototype.updateTransform=function(){if(b.Sprite.prototype.updateTransform.call(this),this.playing){this.currentFrame+=this.animationSpeed;var a=this.currentFrame+.5|0;this.currentFrame=this.currentFrame%this.textures.length,this.loop||a<this.textures.length?this.setTexture(this.textures[a%this.textures.length]):a>=this.textures.length&&(this.gotoAndStop(this.textures.length-1),this.onComplete&&this.onComplete())}},b.MovieClip.fromFrames=function(a){for(var c=[],d=0;d<a.length;d++)c.push(new b.Texture.fromFrame(a[d]));return new b.MovieClip(c)},b.MovieClip.fromImages=function(a){for(var c=[],d=0;d<a.length;d++)c.push(new b.Texture.fromImage(a[d]));return new b.MovieClip(c)},b.FilterBlock=function(){this.visible=!0,this.renderable=!0},b.Text=function(a,c){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),b.Sprite.call(this,b.Texture.fromCanvas(this.canvas)),this.setText(a),this.setStyle(c)},b.Text.prototype=Object.create(b.Sprite.prototype),b.Text.prototype.constructor=b.Text,Object.defineProperty(b.Text.prototype,"width",{get:function(){return this.dirty&&(this.updateText(),this.dirty=!1),this.scale.x*this.texture.frame.width},set:function(a){this.scale.x=a/this.texture.frame.width,this._width=a}}),Object.defineProperty(b.Text.prototype,"height",{get:function(){return this.dirty&&(this.updateText(),this.dirty=!1),this.scale.y*this.texture.frame.height},set:function(a){this.scale.y=a/this.texture.frame.height,this._height=a}}),b.Text.prototype.setStyle=function(a){a=a||{},a.font=a.font||"bold 20pt Arial",a.fill=a.fill||"black",a.align=a.align||"left",a.stroke=a.stroke||"black",a.strokeThickness=a.strokeThickness||0,a.wordWrap=a.wordWrap||!1,a.wordWrapWidth=a.wordWrapWidth||100,a.wordWrapWidth=a.wordWrapWidth||100,a.dropShadow=a.dropShadow||!1,a.dropShadowAngle=a.dropShadowAngle||Math.PI/6,a.dropShadowDistance=a.dropShadowDistance||4,a.dropShadowColor=a.dropShadowColor||"black",this.style=a,this.dirty=!0},b.Text.prototype.setText=function(a){this.text=a.toString()||" ",this.dirty=!0},b.Text.prototype.updateText=function(){this.context.font=this.style.font;var a=this.text;this.style.wordWrap&&(a=this.wordWrap(this.text));for(var b=a.split(/(?:\r\n|\r|\n)/),c=[],d=0,e=0;e<b.length;e++){var f=this.context.measureText(b[e]).width;c[e]=f,d=Math.max(d,f)}var g=d+this.style.strokeThickness;this.style.dropShadow&&(g+=this.style.dropShadowDistance),this.canvas.width=g+this.context.lineWidth;var h=this.determineFontHeight("font: "+this.style.font+";")+this.style.strokeThickness,i=h*b.length;this.style.dropShadow&&(i+=this.style.dropShadowDistance),this.canvas.height=i,navigator.isCocoonJS&&this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.context.font=this.style.font,this.context.strokeStyle=this.style.stroke,this.context.lineWidth=this.style.strokeThickness,this.context.textBaseline="top";var j,k;if(this.style.dropShadow){this.context.fillStyle=this.style.dropShadowColor;var l=Math.sin(this.style.dropShadowAngle)*this.style.dropShadowDistance,m=Math.cos(this.style.dropShadowAngle)*this.style.dropShadowDistance;for(e=0;e<b.length;e++)j=this.style.strokeThickness/2,k=this.style.strokeThickness/2+e*h,"right"===this.style.align?j+=d-c[e]:"center"===this.style.align&&(j+=(d-c[e])/2),this.style.fill&&this.context.fillText(b[e],j+l,k+m)}for(this.context.fillStyle=this.style.fill,e=0;e<b.length;e++)j=this.style.strokeThickness/2,k=this.style.strokeThickness/2+e*h,"right"===this.style.align?j+=d-c[e]:"center"===this.style.align&&(j+=(d-c[e])/2),this.style.stroke&&this.style.strokeThickness&&this.context.strokeText(b[e],j,k),this.style.fill&&this.context.fillText(b[e],j,k);this.updateTexture()},b.Text.prototype.updateTexture=function(){this.texture.baseTexture.width=this.canvas.width,this.texture.baseTexture.height=this.canvas.height,this.texture.crop.width=this.texture.frame.width=this.canvas.width,this.texture.crop.height=this.texture.frame.height=this.canvas.height,this._width=this.canvas.width,this._height=this.canvas.height,this.requiresUpdate=!0},b.Text.prototype._renderWebGL=function(a){this.requiresUpdate&&(this.requiresUpdate=!1,b.updateWebGLTexture(this.texture.baseTexture,a.gl)),b.Sprite.prototype._renderWebGL.call(this,a)},b.Text.prototype.updateTransform=function(){this.dirty&&(this.updateText(),this.dirty=!1),b.Sprite.prototype.updateTransform.call(this)},b.Text.prototype.determineFontHeight=function(a){var c=b.Text.heightCache[a];if(!c){var d=document.getElementsByTagName("body")[0],e=document.createElement("div"),f=document.createTextNode("M");e.appendChild(f),e.setAttribute("style",a+";position:absolute;top:0;left:0"),d.appendChild(e),c=e.offsetHeight,b.Text.heightCache[a]=c,d.removeChild(e)}return c},b.Text.prototype.wordWrap=function(a){for(var b="",c=a.split("\n"),d=0;d<c.length;d++){for(var e=this.style.wordWrapWidth,f=c[d].split(" "),g=0;g<f.length;g++){var h=this.context.measureText(f[g]).width,i=h+this.context.measureText(" ").width;0===g||i>e?(g>0&&(b+="\n"),b+=f[g],e=this.style.wordWrapWidth-h):(e-=i,b+=" "+f[g])}d<c.length-1&&(b+="\n")}return b},b.Text.prototype.destroy=function(a){this.context=null,this.canvas=null,this.texture.destroy(void 0===a?!0:a)},b.Text.heightCache={},b.BitmapText=function(a,c){b.DisplayObjectContainer.call(this),this._pool=[],this.setText(a),this.setStyle(c),this.updateText(),this.dirty=!1},b.BitmapText.prototype=Object.create(b.DisplayObjectContainer.prototype),b.BitmapText.prototype.constructor=b.BitmapText,b.BitmapText.prototype.setText=function(a){this.text=a||" ",this.dirty=!0},b.BitmapText.prototype.setStyle=function(a){a=a||{},a.align=a.align||"left",this.style=a;var c=a.font.split(" ");this.fontName=c[c.length-1],this.fontSize=c.length>=2?parseInt(c[c.length-2],10):b.BitmapText.fonts[this.fontName].size,this.dirty=!0,this.tint=a.tint},b.BitmapText.prototype.updateText=function(){for(var a=b.BitmapText.fonts[this.fontName],c=new b.Point,d=null,e=[],f=0,g=[],h=0,i=this.fontSize/a.size,j=0;j<this.text.length;j++){var k=this.text.charCodeAt(j);if(/(?:\r\n|\r|\n)/.test(this.text.charAt(j)))g.push(c.x),f=Math.max(f,c.x),h++,c.x=0,c.y+=a.lineHeight,d=null;else{var l=a.chars[k];l&&(d&&l[d]&&(c.x+=l.kerning[d]),e.push({texture:l.texture,line:h,charCode:k,position:new b.Point(c.x+l.xOffset,c.y+l.yOffset)}),c.x+=l.xAdvance,d=k)}}g.push(c.x),f=Math.max(f,c.x);var m=[];for(j=0;h>=j;j++){var n=0;"right"===this.style.align?n=f-g[j]:"center"===this.style.align&&(n=(f-g[j])/2),m.push(n)}var o=this.children.length,p=e.length,q=this.tint||16777215;for(j=0;p>j;j++){var r=o>j?this.children[j]:this._pool.pop();r?r.setTexture(e[j].texture):r=new b.Sprite(e[j].texture),r.position.x=(e[j].position.x+m[e[j].line])*i,r.position.y=e[j].position.y*i,r.scale.x=r.scale.y=i,r.tint=q,r.parent||this.addChild(r)}for(;this.children.length>p;){var s=this.getChildAt(this.children.length-1);this._pool.push(s),this.removeChild(s)}this.textWidth=f*i,this.textHeight=(c.y+a.lineHeight)*i},b.BitmapText.prototype.updateTransform=function(){this.dirty&&(this.updateText(),this.dirty=!1),b.DisplayObjectContainer.prototype.updateTransform.call(this)},b.BitmapText.fonts={},b.InteractionData=function(){this.global=new b.Point,this.target=null,this.originalEvent=null},b.InteractionData.prototype.getLocalPosition=function(a){var c=a.worldTransform,d=this.global,e=c.a,f=c.b,g=c.tx,h=c.c,i=c.d,j=c.ty,k=1/(e*i+f*-h);return new b.Point(i*k*d.x+-f*k*d.y+(j*f-g*i)*k,e*k*d.y+-h*k*d.x+(-j*e+g*h)*k)},b.InteractionData.prototype.constructor=b.InteractionData,b.InteractionManager=function(a){this.stage=a,this.mouse=new b.InteractionData,this.touchs={},this.tempPoint=new b.Point,this.mouseoverEnabled=!0,this.pool=[],this.interactiveItems=[],this.interactionDOMElement=null,this.onMouseMove=this.onMouseMove.bind(this),this.onMouseDown=this.onMouseDown.bind(this),this.onMouseOut=this.onMouseOut.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onTouchStart=this.onTouchStart.bind(this),this.onTouchEnd=this.onTouchEnd.bind(this),this.onTouchMove=this.onTouchMove.bind(this),this.last=0,this.currentCursorStyle="inherit",this.mouseOut=!1},b.InteractionManager.prototype.constructor=b.InteractionManager,b.InteractionManager.prototype.collectInteractiveSprite=function(a,b){for(var c=a.children,d=c.length,e=d-1;e>=0;e--){var f=c[e];f._interactive?(b.interactiveChildren=!0,this.interactiveItems.push(f),f.children.length>0&&this.collectInteractiveSprite(f,f)):(f.__iParent=null,f.children.length>0&&this.collectInteractiveSprite(f,b))}},b.InteractionManager.prototype.setTarget=function(a){this.target=a,null===this.interactionDOMElement&&this.setTargetDomElement(a.view)},b.InteractionManager.prototype.setTargetDomElement=function(a){this.removeEvents(),window.navigator.msPointerEnabled&&(a.style["-ms-content-zooming"]="none",a.style["-ms-touch-action"]="none"),this.interactionDOMElement=a,a.addEventListener("mousemove",this.onMouseMove,!0),a.addEventListener("mousedown",this.onMouseDown,!0),a.addEventListener("mouseout",this.onMouseOut,!0),a.addEventListener("touchstart",this.onTouchStart,!0),a.addEventListener("touchend",this.onTouchEnd,!0),a.addEventListener("touchmove",this.onTouchMove,!0),window.addEventListener("mouseup",this.onMouseUp,!0)},b.InteractionManager.prototype.removeEvents=function(){this.interactionDOMElement&&(this.interactionDOMElement.style["-ms-content-zooming"]="",this.interactionDOMElement.style["-ms-touch-action"]="",this.interactionDOMElement.removeEventListener("mousemove",this.onMouseMove,!0),this.interactionDOMElement.removeEventListener("mousedown",this.onMouseDown,!0),this.interactionDOMElement.removeEventListener("mouseout",this.onMouseOut,!0),this.interactionDOMElement.removeEventListener("touchstart",this.onTouchStart,!0),this.interactionDOMElement.removeEventListener("touchend",this.onTouchEnd,!0),this.interactionDOMElement.removeEventListener("touchmove",this.onTouchMove,!0),this.interactionDOMElement=null,window.removeEventListener("mouseup",this.onMouseUp,!0))},b.InteractionManager.prototype.update=function(){if(this.target){var a=Date.now(),c=a-this.last;if(c=c*b.INTERACTION_FREQUENCY/1e3,!(1>c)){this.last=a;var d=0;this.dirty&&this.rebuildInteractiveGraph();var e=this.interactiveItems.length,f="inherit",g=!1;for(d=0;e>d;d++){var h=this.interactiveItems[d];h.__hit=this.hitTest(h,this.mouse),this.mouse.target=h,h.__hit&&!g?(h.buttonMode&&(f=h.defaultCursor),h.interactiveChildren||(g=!0),h.__isOver||(h.mouseover&&h.mouseover(this.mouse),h.__isOver=!0)):h.__isOver&&(h.mouseout&&h.mouseout(this.mouse),h.__isOver=!1)}this.currentCursorStyle!==f&&(this.currentCursorStyle=f,this.interactionDOMElement.style.cursor=f)}}},b.InteractionManager.prototype.rebuildInteractiveGraph=function(){this.dirty=!1;for(var a=this.interactiveItems.length,b=0;a>b;b++)this.interactiveItems[b].interactiveChildren=!1;this.interactiveItems=[],this.stage.interactive&&this.interactiveItems.push(this.stage),this.collectInteractiveSprite(this.stage,this.stage)},b.InteractionManager.prototype.onMouseMove=function(a){this.dirty&&this.rebuildInteractiveGraph(),this.mouse.originalEvent=a||window.event;var b=this.interactionDOMElement.getBoundingClientRect();this.mouse.global.x=(a.clientX-b.left)*(this.target.width/b.width),this.mouse.global.y=(a.clientY-b.top)*(this.target.height/b.height);for(var c=this.interactiveItems.length,d=0;c>d;d++){var e=this.interactiveItems[d];e.mousemove&&e.mousemove(this.mouse)}},b.InteractionManager.prototype.onMouseDown=function(a){this.dirty&&this.rebuildInteractiveGraph(),this.mouse.originalEvent=a||window.event,b.AUTO_PREVENT_DEFAULT&&this.mouse.originalEvent.preventDefault();for(var c=this.interactiveItems.length,d=0;c>d;d++){var e=this.interactiveItems[d];if((e.mousedown||e.click)&&(e.__mouseIsDown=!0,e.__hit=this.hitTest(e,this.mouse),e.__hit&&(e.mousedown&&e.mousedown(this.mouse),e.__isDown=!0,!e.interactiveChildren)))break}},b.InteractionManager.prototype.onMouseOut=function(){this.dirty&&this.rebuildInteractiveGraph();var a=this.interactiveItems.length;this.interactionDOMElement.style.cursor="inherit";for(var b=0;a>b;b++){var c=this.interactiveItems[b];c.__isOver&&(this.mouse.target=c,c.mouseout&&c.mouseout(this.mouse),c.__isOver=!1)}this.mouseOut=!0,this.mouse.global.x=-1e4,this.mouse.global.y=-1e4},b.InteractionManager.prototype.onMouseUp=function(a){this.dirty&&this.rebuildInteractiveGraph(),this.mouse.originalEvent=a||window.event;
for(var b=this.interactiveItems.length,c=!1,d=0;b>d;d++){var e=this.interactiveItems[d];e.__hit=this.hitTest(e,this.mouse),e.__hit&&!c?(e.mouseup&&e.mouseup(this.mouse),e.__isDown&&e.click&&e.click(this.mouse),e.interactiveChildren||(c=!0)):e.__isDown&&e.mouseupoutside&&e.mouseupoutside(this.mouse),e.__isDown=!1}},b.InteractionManager.prototype.hitTest=function(a,c){var d=c.global;if(!a.worldVisible)return!1;var e=a instanceof b.Sprite,f=a.worldTransform,g=f.a,h=f.b,i=f.tx,j=f.c,k=f.d,l=f.ty,m=1/(g*k+h*-j),n=k*m*d.x+-h*m*d.y+(l*h-i*k)*m,o=g*m*d.y+-j*m*d.x+(-l*g+i*j)*m;if(c.target=a,a.hitArea&&a.hitArea.contains)return a.hitArea.contains(n,o)?(c.target=a,!0):!1;if(e){var p,q=a.texture.frame.width,r=a.texture.frame.height,s=-q*a.anchor.x;if(n>s&&s+q>n&&(p=-r*a.anchor.y,o>p&&p+r>o))return c.target=a,!0}for(var t=a.children.length,u=0;t>u;u++){var v=a.children[u],w=this.hitTest(v,c);if(w)return c.target=a,!0}return!1},b.InteractionManager.prototype.onTouchMove=function(a){this.dirty&&this.rebuildInteractiveGraph();var b,c=this.interactionDOMElement.getBoundingClientRect(),d=a.changedTouches,e=0;for(e=0;e<d.length;e++){var f=d[e];b=this.touchs[f.identifier],b.originalEvent=a||window.event,b.global.x=(f.clientX-c.left)*(this.target.width/c.width),b.global.y=(f.clientY-c.top)*(this.target.height/c.height),navigator.isCocoonJS&&(b.global.x=f.clientX,b.global.y=f.clientY);for(var g=0;g<this.interactiveItems.length;g++){var h=this.interactiveItems[g];h.touchmove&&h.__touchData&&h.__touchData[f.identifier]&&h.touchmove(b)}}},b.InteractionManager.prototype.onTouchStart=function(a){this.dirty&&this.rebuildInteractiveGraph();var c=this.interactionDOMElement.getBoundingClientRect();b.AUTO_PREVENT_DEFAULT&&a.preventDefault();for(var d=a.changedTouches,e=0;e<d.length;e++){var f=d[e],g=this.pool.pop();g||(g=new b.InteractionData),g.originalEvent=a||window.event,this.touchs[f.identifier]=g,g.global.x=(f.clientX-c.left)*(this.target.width/c.width),g.global.y=(f.clientY-c.top)*(this.target.height/c.height),navigator.isCocoonJS&&(g.global.x=f.clientX,g.global.y=f.clientY);for(var h=this.interactiveItems.length,i=0;h>i;i++){var j=this.interactiveItems[i];if((j.touchstart||j.tap)&&(j.__hit=this.hitTest(j,g),j.__hit&&(j.touchstart&&j.touchstart(g),j.__isDown=!0,j.__touchData=j.__touchData||{},j.__touchData[f.identifier]=g,!j.interactiveChildren)))break}}},b.InteractionManager.prototype.onTouchEnd=function(a){this.dirty&&this.rebuildInteractiveGraph();for(var b=this.interactionDOMElement.getBoundingClientRect(),c=a.changedTouches,d=0;d<c.length;d++){var e=c[d],f=this.touchs[e.identifier],g=!1;f.global.x=(e.clientX-b.left)*(this.target.width/b.width),f.global.y=(e.clientY-b.top)*(this.target.height/b.height),navigator.isCocoonJS&&(f.global.x=e.clientX,f.global.y=e.clientY);for(var h=this.interactiveItems.length,i=0;h>i;i++){var j=this.interactiveItems[i];j.__touchData&&j.__touchData[e.identifier]&&(j.__hit=this.hitTest(j,j.__touchData[e.identifier]),f.originalEvent=a||window.event,(j.touchend||j.tap)&&(j.__hit&&!g?(j.touchend&&j.touchend(f),j.__isDown&&j.tap&&j.tap(f),j.interactiveChildren||(g=!0)):j.__isDown&&j.touchendoutside&&j.touchendoutside(f),j.__isDown=!1),j.__touchData[e.identifier]=null)}this.pool.push(f),this.touchs[e.identifier]=null}},b.Stage=function(a){b.DisplayObjectContainer.call(this),this.worldTransform=new b.Matrix,this.interactive=!0,this.interactionManager=new b.InteractionManager(this),this.dirty=!0,this.stage=this,this.stage.hitArea=new b.Rectangle(0,0,1e5,1e5),this.setBackgroundColor(a)},b.Stage.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Stage.prototype.constructor=b.Stage,b.Stage.prototype.setInteractionDelegate=function(a){this.interactionManager.setTargetDomElement(a)},b.Stage.prototype.updateTransform=function(){this.worldAlpha=1;for(var a=0,b=this.children.length;b>a;a++)this.children[a].updateTransform();this.dirty&&(this.dirty=!1,this.interactionManager.dirty=!0),this.interactive&&this.interactionManager.update()},b.Stage.prototype.setBackgroundColor=function(a){this.backgroundColor=a||0,this.backgroundColorSplit=b.hex2rgb(this.backgroundColor);var c=this.backgroundColor.toString(16);c="000000".substr(0,6-c.length)+c,this.backgroundColorString="#"+c},b.Stage.prototype.getMousePosition=function(){return this.interactionManager.mouse.global};for(var c=0,d=["ms","moz","webkit","o"],e=0;e<d.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[d[e]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[d[e]+"CancelAnimationFrame"]||window[d[e]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(a){var b=(new Date).getTime(),d=Math.max(0,16-(b-c)),e=window.setTimeout(function(){a(b+d)},d);return c=b+d,e}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)}),window.requestAnimFrame=window.requestAnimationFrame,b.hex2rgb=function(a){return[(a>>16&255)/255,(a>>8&255)/255,(255&a)/255]},b.rgb2hex=function(a){return(255*a[0]<<16)+(255*a[1]<<8)+255*a[2]},"function"!=typeof Function.prototype.bind&&(Function.prototype.bind=function(){var a=Array.prototype.slice;return function(b){function c(){var f=e.concat(a.call(arguments));d.apply(this instanceof c?this:b,f)}var d=this,e=a.call(arguments,1);if("function"!=typeof d)throw new TypeError;return c.prototype=function f(a){return a&&(f.prototype=a),this instanceof f?void 0:new f}(d.prototype),c}}()),b.AjaxRequest=function(){var a=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Microsoft.XMLHTTP"];if(!window.ActiveXObject)return window.XMLHttpRequest?new window.XMLHttpRequest:!1;for(var b=0;b<a.length;b++)try{return new window.ActiveXObject(a[b])}catch(c){}},b.canUseNewCanvasBlendModes=function(){var a=document.createElement("canvas");a.width=1,a.height=1;var b=a.getContext("2d");return b.fillStyle="#000",b.fillRect(0,0,1,1),b.globalCompositeOperation="multiply",b.fillStyle="#fff",b.fillRect(0,0,1,1),0===b.getImageData(0,0,1,1).data[0]},b.getNextPowerOfTwo=function(a){if(a>0&&0===(a&a-1))return a;for(var b=1;a>b;)b<<=1;return b},b.EventTarget=function(){var a={};this.addEventListener=this.on=function(b,c){void 0===a[b]&&(a[b]=[]),-1===a[b].indexOf(c)&&a[b].unshift(c)},this.dispatchEvent=this.emit=function(b){if(a[b.type]&&a[b.type].length)for(var c=a[b.type].length-1;c>=0;c--)a[b.type][c](b)},this.removeEventListener=this.off=function(b,c){if(void 0!==a[b]){var d=a[b].indexOf(c);-1!==d&&a[b].splice(d,1)}},this.removeAllEventListeners=function(b){var c=a[b];c&&(c.length=0)}},b.autoDetectRenderer=function(a,c,d,e,f){a||(a=800),c||(c=600);var g=function(){try{var a=document.createElement("canvas");return!!window.WebGLRenderingContext&&(a.getContext("webgl")||a.getContext("experimental-webgl"))}catch(b){return!1}}();return g?new b.WebGLRenderer(a,c,d,e,f):new b.CanvasRenderer(a,c,d,e)},b.autoDetectRecommendedRenderer=function(a,c,d,e,f){a||(a=800),c||(c=600);var g=function(){try{var a=document.createElement("canvas");return!!window.WebGLRenderingContext&&(a.getContext("webgl")||a.getContext("experimental-webgl"))}catch(b){return!1}}(),h=/Android/i.test(navigator.userAgent);return g&&!h?new b.WebGLRenderer(a,c,d,e,f):new b.CanvasRenderer(a,c,d,e)},b.PolyK={},b.PolyK.Triangulate=function(a){var c=!0,d=a.length>>1;if(3>d)return[];for(var e=[],f=[],g=0;d>g;g++)f.push(g);g=0;for(var h=d;h>3;){var i=f[(g+0)%h],j=f[(g+1)%h],k=f[(g+2)%h],l=a[2*i],m=a[2*i+1],n=a[2*j],o=a[2*j+1],p=a[2*k],q=a[2*k+1],r=!1;if(b.PolyK._convex(l,m,n,o,p,q,c)){r=!0;for(var s=0;h>s;s++){var t=f[s];if(t!==i&&t!==j&&t!==k&&b.PolyK._PointInTriangle(a[2*t],a[2*t+1],l,m,n,o,p,q)){r=!1;break}}}if(r)e.push(i,j,k),f.splice((g+1)%h,1),h--,g=0;else if(g++>3*h){if(!c)return window.console.log("PIXI Warning: shape too complex to fill"),[];for(e=[],f=[],g=0;d>g;g++)f.push(g);g=0,h=d,c=!1}}return e.push(f[0],f[1],f[2]),e},b.PolyK._PointInTriangle=function(a,b,c,d,e,f,g,h){var i=g-c,j=h-d,k=e-c,l=f-d,m=a-c,n=b-d,o=i*i+j*j,p=i*k+j*l,q=i*m+j*n,r=k*k+l*l,s=k*m+l*n,t=1/(o*r-p*p),u=(r*q-p*s)*t,v=(o*s-p*q)*t;return u>=0&&v>=0&&1>u+v},b.PolyK._convex=function(a,b,c,d,e,f,g){return(b-d)*(e-c)+(c-a)*(f-d)>=0===g},b.initDefaultShaders=function(){},b.CompileVertexShader=function(a,c){return b._CompileShader(a,c,a.VERTEX_SHADER)},b.CompileFragmentShader=function(a,c){return b._CompileShader(a,c,a.FRAGMENT_SHADER)},b._CompileShader=function(a,b,c){var d=b.join("\n"),e=a.createShader(c);return a.shaderSource(e,d),a.compileShader(e),a.getShaderParameter(e,a.COMPILE_STATUS)?e:(window.console.log(a.getShaderInfoLog(e)),null)},b.compileProgram=function(a,c,d){var e=b.CompileFragmentShader(a,d),f=b.CompileVertexShader(a,c),g=a.createProgram();return a.attachShader(g,f),a.attachShader(g,e),a.linkProgram(g),a.getProgramParameter(g,a.LINK_STATUS)||window.console.log("Could not initialise shaders"),g},b.PixiShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision lowp float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;","}"],this.textureCount=0,this.attributes=[],this.init()},b.PixiShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc||b.PixiShader.defaultVertexSrc,this.fragmentSrc);a.useProgram(c),this.uSampler=a.getUniformLocation(c,"uSampler"),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.dimensions=a.getUniformLocation(c,"dimensions"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.aTextureCoord=a.getAttribLocation(c,"aTextureCoord"),this.colorAttribute=a.getAttribLocation(c,"aColor"),-1===this.colorAttribute&&(this.colorAttribute=2),this.attributes=[this.aVertexPosition,this.aTextureCoord,this.colorAttribute];for(var d in this.uniforms)this.uniforms[d].uniformLocation=a.getUniformLocation(c,d);this.initUniforms(),this.program=c},b.PixiShader.prototype.initUniforms=function(){this.textureCount=1;var a,b=this.gl;for(var c in this.uniforms){a=this.uniforms[c];var d=a.type;"sampler2D"===d?(a._init=!1,null!==a.value&&this.initSampler2D(a)):"mat2"===d||"mat3"===d||"mat4"===d?(a.glMatrix=!0,a.glValueLength=1,"mat2"===d?a.glFunc=b.uniformMatrix2fv:"mat3"===d?a.glFunc=b.uniformMatrix3fv:"mat4"===d&&(a.glFunc=b.uniformMatrix4fv)):(a.glFunc=b["uniform"+d],a.glValueLength="2f"===d||"2i"===d?2:"3f"===d||"3i"===d?3:"4f"===d||"4i"===d?4:1)}},b.PixiShader.prototype.initSampler2D=function(a){if(a.value&&a.value.baseTexture&&a.value.baseTexture.hasLoaded){var b=this.gl;if(b.activeTexture(b["TEXTURE"+this.textureCount]),b.bindTexture(b.TEXTURE_2D,a.value.baseTexture._glTextures[b.id]),a.textureData){var c=a.textureData,d=c.magFilter?c.magFilter:b.LINEAR,e=c.minFilter?c.minFilter:b.LINEAR,f=c.wrapS?c.wrapS:b.CLAMP_TO_EDGE,g=c.wrapT?c.wrapT:b.CLAMP_TO_EDGE,h=c.luminance?b.LUMINANCE:b.RGBA;if(c.repeat&&(f=b.REPEAT,g=b.REPEAT),b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL,!!c.flipY),c.width){var i=c.width?c.width:512,j=c.height?c.height:2,k=c.border?c.border:0;b.texImage2D(b.TEXTURE_2D,0,h,i,j,k,h,b.UNSIGNED_BYTE,null)}else b.texImage2D(b.TEXTURE_2D,0,h,b.RGBA,b.UNSIGNED_BYTE,a.value.baseTexture.source);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,d),b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,e),b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,f),b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,g)}b.uniform1i(a.uniformLocation,this.textureCount),a._init=!0,this.textureCount++}},b.PixiShader.prototype.syncUniforms=function(){this.textureCount=1;var a,c=this.gl;for(var d in this.uniforms)a=this.uniforms[d],1===a.glValueLength?a.glMatrix===!0?a.glFunc.call(c,a.uniformLocation,a.transpose,a.value):a.glFunc.call(c,a.uniformLocation,a.value):2===a.glValueLength?a.glFunc.call(c,a.uniformLocation,a.value.x,a.value.y):3===a.glValueLength?a.glFunc.call(c,a.uniformLocation,a.value.x,a.value.y,a.value.z):4===a.glValueLength?a.glFunc.call(c,a.uniformLocation,a.value.x,a.value.y,a.value.z,a.value.w):"sampler2D"===a.type&&(a._init?(c.activeTexture(c["TEXTURE"+this.textureCount]),c.bindTexture(c.TEXTURE_2D,a.value.baseTexture._glTextures[c.id]||b.createWebGLTexture(a.value.baseTexture,c)),c.uniform1i(a.uniformLocation,this.textureCount),this.textureCount++):this.initSampler2D(a))},b.PixiShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attributes=null},b.PixiShader.defaultVertexSrc=["attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","attribute vec2 aColor;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","varying vec2 vTextureCoord;","varying vec4 vColor;","const vec2 center = vec2(-1.0, 1.0);","void main(void) {","   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);","   vTextureCoord = aTextureCoord;","   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;","   vColor = vec4(color * aColor.x, aColor.x);","}"],b.PixiFastShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision lowp float;","varying vec2 vTextureCoord;","varying float vColor;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","attribute vec2 aPositionCoord;","attribute vec2 aScale;","attribute float aRotation;","attribute vec2 aTextureCoord;","attribute float aColor;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","uniform mat3 uMatrix;","varying vec2 vTextureCoord;","varying float vColor;","const vec2 center = vec2(-1.0, 1.0);","void main(void) {","   vec2 v;","   vec2 sv = aVertexPosition * aScale;","   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);","   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);","   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;","   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);","   vTextureCoord = aTextureCoord;","   vColor = aColor;","}"],this.textureCount=0,this.init()},b.PixiFastShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.uSampler=a.getUniformLocation(c,"uSampler"),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.dimensions=a.getUniformLocation(c,"dimensions"),this.uMatrix=a.getUniformLocation(c,"uMatrix"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.aPositionCoord=a.getAttribLocation(c,"aPositionCoord"),this.aScale=a.getAttribLocation(c,"aScale"),this.aRotation=a.getAttribLocation(c,"aRotation"),this.aTextureCoord=a.getAttribLocation(c,"aTextureCoord"),this.colorAttribute=a.getAttribLocation(c,"aColor"),-1===this.colorAttribute&&(this.colorAttribute=2),this.attributes=[this.aVertexPosition,this.aPositionCoord,this.aScale,this.aRotation,this.aTextureCoord,this.colorAttribute],this.program=c},b.PixiFastShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attributes=null},b.StripShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","uniform float alpha;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","attribute vec2 aTextureCoord;","uniform mat3 translationMatrix;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","varying vec2 vTextureCoord;","void main(void) {","   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);","   v -= offsetVector.xyx;","   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);","   vTextureCoord = aTextureCoord;","}"],this.init()},b.StripShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.uSampler=a.getUniformLocation(c,"uSampler"),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.colorAttribute=a.getAttribLocation(c,"aColor"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.aTextureCoord=a.getAttribLocation(c,"aTextureCoord"),this.attributes=[this.aVertexPosition,this.aTextureCoord],this.translationMatrix=a.getUniformLocation(c,"translationMatrix"),this.alpha=a.getUniformLocation(c,"alpha"),this.program=c},b.PrimitiveShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision mediump float;","varying vec4 vColor;","void main(void) {","   gl_FragColor = vColor;","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","attribute vec4 aColor;","uniform mat3 translationMatrix;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","uniform float alpha;","uniform vec3 tint;","varying vec4 vColor;","void main(void) {","   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);","   v -= offsetVector.xyx;","   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);","   vColor = aColor * vec4(tint * alpha, alpha);","}"],this.init()},b.PrimitiveShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.tintColor=a.getUniformLocation(c,"tint"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.colorAttribute=a.getAttribLocation(c,"aColor"),this.attributes=[this.aVertexPosition,this.colorAttribute],this.translationMatrix=a.getUniformLocation(c,"translationMatrix"),this.alpha=a.getUniformLocation(c,"alpha"),this.program=c},b.PrimitiveShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attribute=null},b.ComplexPrimitiveShader=function(a){this._UID=b._UID++,this.gl=a,this.program=null,this.fragmentSrc=["precision mediump float;","varying vec4 vColor;","void main(void) {","   gl_FragColor = vColor;","}"],this.vertexSrc=["attribute vec2 aVertexPosition;","uniform mat3 translationMatrix;","uniform vec2 projectionVector;","uniform vec2 offsetVector;","uniform vec3 tint;","uniform float alpha;","uniform vec3 color;","varying vec4 vColor;","void main(void) {","   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);","   v -= offsetVector.xyx;","   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);","   vColor = vec4(color * alpha * tint, alpha);","}"],this.init()},b.ComplexPrimitiveShader.prototype.init=function(){var a=this.gl,c=b.compileProgram(a,this.vertexSrc,this.fragmentSrc);a.useProgram(c),this.projectionVector=a.getUniformLocation(c,"projectionVector"),this.offsetVector=a.getUniformLocation(c,"offsetVector"),this.tintColor=a.getUniformLocation(c,"tint"),this.color=a.getUniformLocation(c,"color"),this.aVertexPosition=a.getAttribLocation(c,"aVertexPosition"),this.attributes=[this.aVertexPosition,this.colorAttribute],this.translationMatrix=a.getUniformLocation(c,"translationMatrix"),this.alpha=a.getUniformLocation(c,"alpha"),this.program=c},b.ComplexPrimitiveShader.prototype.destroy=function(){this.gl.deleteProgram(this.program),this.uniforms=null,this.gl=null,this.attribute=null},b.WebGLGraphics=function(){},b.WebGLGraphics.renderGraphics=function(a,c){var d,e=c.gl,f=c.projection,g=c.offset,h=c.shaderManager.primitiveShader;a.dirty&&b.WebGLGraphics.updateGraphics(a,e);for(var i=a._webGL[e.id],j=0;j<i.data.length;j++)1===i.data[j].mode?(d=i.data[j],c.stencilManager.pushStencil(a,d,c),e.drawElements(e.TRIANGLE_FAN,4,e.UNSIGNED_SHORT,2*(d.indices.length-4)),c.stencilManager.popStencil(a,d,c),this.last=d.mode):(d=i.data[j],c.shaderManager.setShader(h),h=c.shaderManager.primitiveShader,e.uniformMatrix3fv(h.translationMatrix,!1,a.worldTransform.toArray(!0)),e.uniform2f(h.projectionVector,f.x,-f.y),e.uniform2f(h.offsetVector,-g.x,-g.y),e.uniform3fv(h.tintColor,b.hex2rgb(a.tint)),e.uniform1f(h.alpha,a.worldAlpha),e.bindBuffer(e.ARRAY_BUFFER,d.buffer),e.vertexAttribPointer(h.aVertexPosition,2,e.FLOAT,!1,24,0),e.vertexAttribPointer(h.colorAttribute,4,e.FLOAT,!1,24,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,d.indexBuffer),e.drawElements(e.TRIANGLE_STRIP,d.indices.length,e.UNSIGNED_SHORT,0))},b.WebGLGraphics.updateGraphics=function(a,c){var d=a._webGL[c.id];d||(d=a._webGL[c.id]={lastIndex:0,data:[],gl:c}),a.dirty=!1;var e;if(a.clearDirty){for(a.clearDirty=!1,e=0;e<d.data.length;e++){var f=d.data[e];f.reset(),b.WebGLGraphics.graphicsDataPool.push(f)}d.data=[],d.lastIndex=0}var g;for(e=d.lastIndex;e<a.graphicsData.length;e++){var h=a.graphicsData[e];h.type===b.Graphics.POLY?(h.fill&&h.points.length>6&&(h.points.length>10?(g=b.WebGLGraphics.switchMode(d,1),b.WebGLGraphics.buildComplexPoly(h,g)):(g=b.WebGLGraphics.switchMode(d,0),b.WebGLGraphics.buildPoly(h,g))),h.lineWidth>0&&(g=b.WebGLGraphics.switchMode(d,0),b.WebGLGraphics.buildLine(h,g))):(g=b.WebGLGraphics.switchMode(d,0),h.type===b.Graphics.RECT?b.WebGLGraphics.buildRectangle(h,g):h.type===b.Graphics.CIRC||h.type===b.Graphics.ELIP?b.WebGLGraphics.buildCircle(h,g):h.type===b.Graphics.RREC&&b.WebGLGraphics.buildRoundedRectangle(h,g)),d.lastIndex++}for(e=0;e<d.data.length;e++)g=d.data[e],g.dirty&&g.upload()},b.WebGLGraphics.switchMode=function(a,c){var d;return a.data.length?(d=a.data[a.data.length-1],(d.mode!==c||1===c)&&(d=b.WebGLGraphics.graphicsDataPool.pop()||new b.WebGLGraphicsData(a.gl),d.mode=c,a.data.push(d))):(d=b.WebGLGraphics.graphicsDataPool.pop()||new b.WebGLGraphicsData(a.gl),d.mode=c,a.data.push(d)),d.dirty=!0,d},b.WebGLGraphics.buildRectangle=function(a,c){var d=a.points,e=d[0],f=d[1],g=d[2],h=d[3];if(a.fill){var i=b.hex2rgb(a.fillColor),j=a.fillAlpha,k=i[0]*j,l=i[1]*j,m=i[2]*j,n=c.points,o=c.indices,p=n.length/6;n.push(e,f),n.push(k,l,m,j),n.push(e+g,f),n.push(k,l,m,j),n.push(e,f+h),n.push(k,l,m,j),n.push(e+g,f+h),n.push(k,l,m,j),o.push(p,p,p+1,p+2,p+3,p+3)}if(a.lineWidth){var q=a.points;a.points=[e,f,e+g,f,e+g,f+h,e,f+h,e,f],b.WebGLGraphics.buildLine(a,c),a.points=q}},b.WebGLGraphics.buildRoundedRectangle=function(a,c){var d=a.points,e=d[0],f=d[1],g=d[2],h=d[3],i=d[4],j=[];if(j.push(e,f+i),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e,f+h-i,e,f+h,e+i,f+h)),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e+g-i,f+h,e+g,f+h,e+g,f+h-i)),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e+g,f+i,e+g,f,e+g-i,f)),j=j.concat(b.WebGLGraphics.quadraticBezierCurve(e+i,f,e,f,e,f+i)),a.fill){var k=b.hex2rgb(a.fillColor),l=a.fillAlpha,m=k[0]*l,n=k[1]*l,o=k[2]*l,p=c.points,q=c.indices,r=p.length/6,s=b.PolyK.Triangulate(j),t=0;for(t=0;t<s.length;t+=3)q.push(s[t]+r),q.push(s[t]+r),q.push(s[t+1]+r),q.push(s[t+2]+r),q.push(s[t+2]+r);for(t=0;t<j.length;t++)p.push(j[t],j[++t],m,n,o,l)}if(a.lineWidth){var u=a.points;a.points=j,b.WebGLGraphics.buildLine(a,c),a.points=u}},b.WebGLGraphics.quadraticBezierCurve=function(a,b,c,d,e,f){function g(a,b,c){var d=b-a;return a+d*c}for(var h,i,j,k,l,m,n=20,o=[],p=0,q=0;n>=q;q++)p=q/n,h=g(a,c,p),i=g(b,d,p),j=g(c,e,p),k=g(d,f,p),l=g(h,j,p),m=g(i,k,p),o.push(l,m);return o},b.WebGLGraphics.buildCircle=function(a,c){var d=a.points,e=d[0],f=d[1],g=d[2],h=d[3],i=40,j=2*Math.PI/i,k=0;if(a.fill){var l=b.hex2rgb(a.fillColor),m=a.fillAlpha,n=l[0]*m,o=l[1]*m,p=l[2]*m,q=c.points,r=c.indices,s=q.length/6;for(r.push(s),k=0;i+1>k;k++)q.push(e,f,n,o,p,m),q.push(e+Math.sin(j*k)*g,f+Math.cos(j*k)*h,n,o,p,m),r.push(s++,s++);r.push(s-1)}if(a.lineWidth){var t=a.points;for(a.points=[],k=0;i+1>k;k++)a.points.push(e+Math.sin(j*k)*g,f+Math.cos(j*k)*h);b.WebGLGraphics.buildLine(a,c),a.points=t}},b.WebGLGraphics.buildLine=function(a,c){var d=0,e=a.points;if(0!==e.length){if(a.lineWidth%2)for(d=0;d<e.length;d++)e[d]+=.5;var f=new b.Point(e[0],e[1]),g=new b.Point(e[e.length-2],e[e.length-1]);if(f.x===g.x&&f.y===g.y){e=e.slice(),e.pop(),e.pop(),g=new b.Point(e[e.length-2],e[e.length-1]);var h=g.x+.5*(f.x-g.x),i=g.y+.5*(f.y-g.y);e.unshift(h,i),e.push(h,i)}var j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G=c.points,H=c.indices,I=e.length/2,J=e.length,K=G.length/6,L=a.lineWidth/2,M=b.hex2rgb(a.lineColor),N=a.lineAlpha,O=M[0]*N,P=M[1]*N,Q=M[2]*N;for(l=e[0],m=e[1],n=e[2],o=e[3],r=-(m-o),s=l-n,F=Math.sqrt(r*r+s*s),r/=F,s/=F,r*=L,s*=L,G.push(l-r,m-s,O,P,Q,N),G.push(l+r,m+s,O,P,Q,N),d=1;I-1>d;d++)l=e[2*(d-1)],m=e[2*(d-1)+1],n=e[2*d],o=e[2*d+1],p=e[2*(d+1)],q=e[2*(d+1)+1],r=-(m-o),s=l-n,F=Math.sqrt(r*r+s*s),r/=F,s/=F,r*=L,s*=L,t=-(o-q),u=n-p,F=Math.sqrt(t*t+u*u),t/=F,u/=F,t*=L,u*=L,x=-s+m-(-s+o),y=-r+n-(-r+l),z=(-r+l)*(-s+o)-(-r+n)*(-s+m),A=-u+q-(-u+o),B=-t+n-(-t+p),C=(-t+p)*(-u+o)-(-t+n)*(-u+q),D=x*B-A*y,Math.abs(D)<.1?(D+=10.1,G.push(n-r,o-s,O,P,Q,N),G.push(n+r,o+s,O,P,Q,N)):(j=(y*C-B*z)/D,k=(A*z-x*C)/D,E=(j-n)*(j-n)+(k-o)+(k-o),E>19600?(v=r-t,w=s-u,F=Math.sqrt(v*v+w*w),v/=F,w/=F,v*=L,w*=L,G.push(n-v,o-w),G.push(O,P,Q,N),G.push(n+v,o+w),G.push(O,P,Q,N),G.push(n-v,o-w),G.push(O,P,Q,N),J++):(G.push(j,k),G.push(O,P,Q,N),G.push(n-(j-n),o-(k-o)),G.push(O,P,Q,N)));for(l=e[2*(I-2)],m=e[2*(I-2)+1],n=e[2*(I-1)],o=e[2*(I-1)+1],r=-(m-o),s=l-n,F=Math.sqrt(r*r+s*s),r/=F,s/=F,r*=L,s*=L,G.push(n-r,o-s),G.push(O,P,Q,N),G.push(n+r,o+s),G.push(O,P,Q,N),H.push(K),d=0;J>d;d++)H.push(K++);H.push(K-1)}},b.WebGLGraphics.buildComplexPoly=function(a,c){var d=a.points.slice();if(!(d.length<6)){var e=c.indices;c.points=d,c.alpha=a.fillAlpha,c.color=b.hex2rgb(a.fillColor);for(var f,g,h=1/0,i=-1/0,j=1/0,k=-1/0,l=0;l<d.length;l+=2)f=d[l],g=d[l+1],h=h>f?f:h,i=f>i?f:i,j=j>g?g:j,k=g>k?g:k;d.push(h,j,i,j,i,k,h,k);var m=d.length/2;for(l=0;m>l;l++)e.push(l)}},b.WebGLGraphics.buildPoly=function(a,c){var d=a.points;if(!(d.length<6)){var e=c.points,f=c.indices,g=d.length/2,h=b.hex2rgb(a.fillColor),i=a.fillAlpha,j=h[0]*i,k=h[1]*i,l=h[2]*i,m=b.PolyK.Triangulate(d),n=e.length/6,o=0;for(o=0;o<m.length;o+=3)f.push(m[o]+n),f.push(m[o]+n),f.push(m[o+1]+n),f.push(m[o+2]+n),f.push(m[o+2]+n);for(o=0;g>o;o++)e.push(d[2*o],d[2*o+1],j,k,l,i)}},b.WebGLGraphics.graphicsDataPool=[],b.WebGLGraphicsData=function(a){this.gl=a,this.color=[0,0,0],this.points=[],this.indices=[],this.lastIndex=0,this.buffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),this.mode=1,this.alpha=1,this.dirty=!0},b.WebGLGraphicsData.prototype.reset=function(){this.points=[],this.indices=[],this.lastIndex=0},b.WebGLGraphicsData.prototype.upload=function(){var a=this.gl;this.glPoints=new Float32Array(this.points),a.bindBuffer(a.ARRAY_BUFFER,this.buffer),a.bufferData(a.ARRAY_BUFFER,this.glPoints,a.STATIC_DRAW),this.glIndicies=new Uint16Array(this.indices),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this.glIndicies,a.STATIC_DRAW),this.dirty=!1},b.glContexts=[],b.WebGLRenderer=function(a,c,d,e,f,g){b.defaultRenderer||(b.sayHello("webGL"),b.defaultRenderer=this),this.type=b.WEBGL_RENDERER,this.transparent=!!e,this.preserveDrawingBuffer=g,this.width=a||800,this.height=c||600,this.view=d||document.createElement("canvas"),this.view.width=this.width,this.view.height=this.height,this.contextLost=this.handleContextLost.bind(this),this.contextRestoredLost=this.handleContextRestored.bind(this),this.view.addEventListener("webglcontextlost",this.contextLost,!1),this.view.addEventListener("webglcontextrestored",this.contextRestoredLost,!1),this.options={alpha:this.transparent,antialias:!!f,premultipliedAlpha:!!e,stencil:!0,preserveDrawingBuffer:g};var h=null;if(["experimental-webgl","webgl"].forEach(function(a){try{h=h||this.view.getContext(a,this.options)}catch(b){}},this),!h)throw new Error("This browser does not support webGL. Try using the canvas renderer"+this);this.gl=h,this.glContextId=h.id=b.WebGLRenderer.glContextId++,b.glContexts[this.glContextId]=h,b.blendModesWebGL||(b.blendModesWebGL=[],b.blendModesWebGL[b.blendModes.NORMAL]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.ADD]=[h.SRC_ALPHA,h.DST_ALPHA],b.blendModesWebGL[b.blendModes.MULTIPLY]=[h.DST_COLOR,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.SCREEN]=[h.SRC_ALPHA,h.ONE],b.blendModesWebGL[b.blendModes.OVERLAY]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.DARKEN]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.LIGHTEN]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.COLOR_DODGE]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.COLOR_BURN]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.HARD_LIGHT]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.SOFT_LIGHT]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.DIFFERENCE]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.EXCLUSION]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.HUE]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.SATURATION]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.COLOR]=[h.ONE,h.ONE_MINUS_SRC_ALPHA],b.blendModesWebGL[b.blendModes.LUMINOSITY]=[h.ONE,h.ONE_MINUS_SRC_ALPHA]),this.projection=new b.Point,this.projection.x=this.width/2,this.projection.y=-this.height/2,this.offset=new b.Point(0,0),this.resize(this.width,this.height),this.contextLost=!1,this.shaderManager=new b.WebGLShaderManager(h),this.spriteBatch=new b.WebGLSpriteBatch(h),this.maskManager=new b.WebGLMaskManager(h),this.filterManager=new b.WebGLFilterManager(h,this.transparent),this.stencilManager=new b.WebGLStencilManager(h),this.blendModeManager=new b.WebGLBlendModeManager(h),this.renderSession={},this.renderSession.gl=this.gl,this.renderSession.drawCount=0,this.renderSession.shaderManager=this.shaderManager,this.renderSession.maskManager=this.maskManager,this.renderSession.filterManager=this.filterManager,this.renderSession.blendModeManager=this.blendModeManager,this.renderSession.spriteBatch=this.spriteBatch,this.renderSession.stencilManager=this.stencilManager,this.renderSession.renderer=this,h.useProgram(this.shaderManager.defaultShader.program),h.disable(h.DEPTH_TEST),h.disable(h.CULL_FACE),h.enable(h.BLEND),h.colorMask(!0,!0,!0,this.transparent)},b.WebGLRenderer.prototype.constructor=b.WebGLRenderer,b.WebGLRenderer.prototype.render=function(a){if(!this.contextLost){this.__stage!==a&&(a.interactive&&a.interactionManager.removeEvents(),this.__stage=a),b.WebGLRenderer.updateTextures(),a.updateTransform(),a._interactive&&(a._interactiveEventsAdded||(a._interactiveEventsAdded=!0,a.interactionManager.setTarget(this)));var c=this.gl;c.viewport(0,0,this.width,this.height),c.bindFramebuffer(c.FRAMEBUFFER,null),this.transparent?c.clearColor(0,0,0,0):c.clearColor(a.backgroundColorSplit[0],a.backgroundColorSplit[1],a.backgroundColorSplit[2],1),c.clear(c.COLOR_BUFFER_BIT),this.renderDisplayObject(a,this.projection),a.interactive?a._interactiveEventsAdded||(a._interactiveEventsAdded=!0,a.interactionManager.setTarget(this)):a._interactiveEventsAdded&&(a._interactiveEventsAdded=!1,a.interactionManager.setTarget(this))}},b.WebGLRenderer.prototype.renderDisplayObject=function(a,c,d){this.renderSession.blendModeManager.setBlendMode(b.blendModes.NORMAL),this.renderSession.drawCount=0,this.renderSession.currentBlendMode=9999,this.renderSession.projection=c,this.renderSession.offset=this.offset,this.spriteBatch.begin(this.renderSession),this.filterManager.begin(this.renderSession,d),a._renderWebGL(this.renderSession),this.spriteBatch.end()},b.WebGLRenderer.updateTextures=function(){var a=0;for(a=0;a<b.Texture.frameUpdates.length;a++)b.WebGLRenderer.updateTextureFrame(b.Texture.frameUpdates[a]);for(a=0;a<b.texturesToDestroy.length;a++)b.WebGLRenderer.destroyTexture(b.texturesToDestroy[a]);b.texturesToUpdate.length=0,b.texturesToDestroy.length=0,b.Texture.frameUpdates.length=0},b.WebGLRenderer.destroyTexture=function(a){for(var c=a._glTextures.length-1;c>=0;c--){var d=a._glTextures[c],e=b.glContexts[c];
e&&d&&e.deleteTexture(d)}a._glTextures.length=0},b.WebGLRenderer.updateTextureFrame=function(a){a._updateWebGLuvs()},b.WebGLRenderer.prototype.resize=function(a,b){this.width=a,this.height=b,this.view.width=a,this.view.height=b,this.gl.viewport(0,0,this.width,this.height),this.projection.x=this.width/2,this.projection.y=-this.height/2},b.createWebGLTexture=function(a,c){return a.hasLoaded&&(a._glTextures[c.id]=c.createTexture(),c.bindTexture(c.TEXTURE_2D,a._glTextures[c.id]),c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultipliedAlpha),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,a.source),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),a._powerOf2?(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.REPEAT),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.REPEAT)):(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE)),c.bindTexture(c.TEXTURE_2D,null),a._dirty[c.id]=!1),a._glTextures[c.id]},b.updateWebGLTexture=function(a,c){a._glTextures[c.id]&&(c.bindTexture(c.TEXTURE_2D,a._glTextures[c.id]),c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultipliedAlpha),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,a.source),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,a.scaleMode===b.scaleModes.LINEAR?c.LINEAR:c.NEAREST),a._powerOf2?(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.REPEAT),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.REPEAT)):(c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE)),a._dirty[c.id]=!1)},b.WebGLRenderer.prototype.handleContextLost=function(a){a.preventDefault(),this.contextLost=!0},b.WebGLRenderer.prototype.handleContextRestored=function(){try{this.gl=this.view.getContext("experimental-webgl",this.options)}catch(a){try{this.gl=this.view.getContext("webgl",this.options)}catch(c){throw new Error(" This browser does not support webGL. Try using the canvas renderer"+this)}}var d=this.gl;d.id=b.WebGLRenderer.glContextId++,this.shaderManager.setContext(d),this.spriteBatch.setContext(d),this.primitiveBatch.setContext(d),this.maskManager.setContext(d),this.filterManager.setContext(d),this.renderSession.gl=this.gl,d.disable(d.DEPTH_TEST),d.disable(d.CULL_FACE),d.enable(d.BLEND),d.colorMask(!0,!0,!0,this.transparent),this.gl.viewport(0,0,this.width,this.height);for(var e in b.TextureCache){var f=b.TextureCache[e].baseTexture;f._glTextures=[]}this.contextLost=!1},b.WebGLRenderer.prototype.destroy=function(){this.view.removeEventListener("webglcontextlost",this.contextLost),this.view.removeEventListener("webglcontextrestored",this.contextRestoredLost),b.glContexts[this.glContextId]=null,this.projection=null,this.offset=null,this.shaderManager.destroy(),this.spriteBatch.destroy(),this.primitiveBatch.destroy(),this.maskManager.destroy(),this.filterManager.destroy(),this.shaderManager=null,this.spriteBatch=null,this.maskManager=null,this.filterManager=null,this.gl=null,this.renderSession=null},b.WebGLRenderer.glContextId=0,b.WebGLBlendModeManager=function(a){this.gl=a,this.currentBlendMode=99999},b.WebGLBlendModeManager.prototype.setBlendMode=function(a){if(this.currentBlendMode===a)return!1;this.currentBlendMode=a;var c=b.blendModesWebGL[this.currentBlendMode];return this.gl.blendFunc(c[0],c[1]),!0},b.WebGLBlendModeManager.prototype.destroy=function(){this.gl=null},b.WebGLMaskManager=function(a){this.maskStack=[],this.maskPosition=0,this.setContext(a),this.reverse=!1,this.count=0},b.WebGLMaskManager.prototype.setContext=function(a){this.gl=a},b.WebGLMaskManager.prototype.pushMask=function(a,c){var d=c.gl;a.dirty&&b.WebGLGraphics.updateGraphics(a,d),a._webGL[d.id].data.length&&c.stencilManager.pushStencil(a,a._webGL[d.id].data[0],c)},b.WebGLMaskManager.prototype.popMask=function(a,b){var c=this.gl;b.stencilManager.popStencil(a,a._webGL[c.id].data[0],b)},b.WebGLMaskManager.prototype.destroy=function(){this.maskStack=null,this.gl=null},b.WebGLStencilManager=function(a){this.stencilStack=[],this.setContext(a),this.reverse=!0,this.count=0},b.WebGLStencilManager.prototype.setContext=function(a){this.gl=a},b.WebGLStencilManager.prototype.pushStencil=function(a,b,c){var d=this.gl;this.bindGraphics(a,b,c),0===this.stencilStack.length&&(d.enable(d.STENCIL_TEST),d.clear(d.STENCIL_BUFFER_BIT),this.reverse=!0,this.count=0),this.stencilStack.push(b);var e=this.count;d.colorMask(!1,!1,!1,!1),d.stencilFunc(d.ALWAYS,0,255),d.stencilOp(d.KEEP,d.KEEP,d.INVERT),1===b.mode?(d.drawElements(d.TRIANGLE_FAN,b.indices.length-4,d.UNSIGNED_SHORT,0),this.reverse?(d.stencilFunc(d.EQUAL,255-e,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)):(d.stencilFunc(d.EQUAL,e,255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)),d.drawElements(d.TRIANGLE_FAN,4,d.UNSIGNED_SHORT,2*(b.indices.length-4)),this.reverse?d.stencilFunc(d.EQUAL,255-(e+1),255):d.stencilFunc(d.EQUAL,e+1,255),this.reverse=!this.reverse):(this.reverse?(d.stencilFunc(d.EQUAL,e,255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)):(d.stencilFunc(d.EQUAL,255-e,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)),d.drawElements(d.TRIANGLE_STRIP,b.indices.length,d.UNSIGNED_SHORT,0),this.reverse?d.stencilFunc(d.EQUAL,e+1,255):d.stencilFunc(d.EQUAL,255-(e+1),255)),d.colorMask(!0,!0,!0,!0),d.stencilOp(d.KEEP,d.KEEP,d.KEEP),this.count++},b.WebGLStencilManager.prototype.bindGraphics=function(a,c,d){this._currentGraphics=a;var e,f=this.gl,g=d.projection,h=d.offset;1===c.mode?(e=d.shaderManager.complexPrimativeShader,d.shaderManager.setShader(e),f.uniformMatrix3fv(e.translationMatrix,!1,a.worldTransform.toArray(!0)),f.uniform2f(e.projectionVector,g.x,-g.y),f.uniform2f(e.offsetVector,-h.x,-h.y),f.uniform3fv(e.tintColor,b.hex2rgb(a.tint)),f.uniform3fv(e.color,c.color),f.uniform1f(e.alpha,a.worldAlpha*c.alpha),f.bindBuffer(f.ARRAY_BUFFER,c.buffer),f.vertexAttribPointer(e.aVertexPosition,2,f.FLOAT,!1,8,0),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,c.indexBuffer)):(e=d.shaderManager.primitiveShader,d.shaderManager.setShader(e),f.uniformMatrix3fv(e.translationMatrix,!1,a.worldTransform.toArray(!0)),f.uniform2f(e.projectionVector,g.x,-g.y),f.uniform2f(e.offsetVector,-h.x,-h.y),f.uniform3fv(e.tintColor,b.hex2rgb(a.tint)),f.uniform1f(e.alpha,a.worldAlpha),f.bindBuffer(f.ARRAY_BUFFER,c.buffer),f.vertexAttribPointer(e.aVertexPosition,2,f.FLOAT,!1,24,0),f.vertexAttribPointer(e.colorAttribute,4,f.FLOAT,!1,24,8),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,c.indexBuffer))},b.WebGLStencilManager.prototype.popStencil=function(a,b,c){var d=this.gl;if(this.stencilStack.pop(),this.count--,0===this.stencilStack.length)d.disable(d.STENCIL_TEST);else{var e=this.count;this.bindGraphics(a,b,c),d.colorMask(!1,!1,!1,!1),1===b.mode?(this.reverse=!this.reverse,this.reverse?(d.stencilFunc(d.EQUAL,255-(e+1),255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)):(d.stencilFunc(d.EQUAL,e+1,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)),d.drawElements(d.TRIANGLE_FAN,4,d.UNSIGNED_SHORT,2*(b.indices.length-4)),d.stencilFunc(d.ALWAYS,0,255),d.stencilOp(d.KEEP,d.KEEP,d.INVERT),d.drawElements(d.TRIANGLE_FAN,b.indices.length-4,d.UNSIGNED_SHORT,0),this.reverse?d.stencilFunc(d.EQUAL,e,255):d.stencilFunc(d.EQUAL,255-e,255)):(this.reverse?(d.stencilFunc(d.EQUAL,e+1,255),d.stencilOp(d.KEEP,d.KEEP,d.DECR)):(d.stencilFunc(d.EQUAL,255-(e+1),255),d.stencilOp(d.KEEP,d.KEEP,d.INCR)),d.drawElements(d.TRIANGLE_STRIP,b.indices.length,d.UNSIGNED_SHORT,0),this.reverse?d.stencilFunc(d.EQUAL,e,255):d.stencilFunc(d.EQUAL,255-e,255)),d.colorMask(!0,!0,!0,!0),d.stencilOp(d.KEEP,d.KEEP,d.KEEP)}},b.WebGLStencilManager.prototype.destroy=function(){this.maskStack=null,this.gl=null},b.WebGLShaderManager=function(a){this.maxAttibs=10,this.attribState=[],this.tempAttribState=[],this.shaderMap=[];for(var b=0;b<this.maxAttibs;b++)this.attribState[b]=!1;this.setContext(a)},b.WebGLShaderManager.prototype.setContext=function(a){this.gl=a,this.primitiveShader=new b.PrimitiveShader(a),this.complexPrimativeShader=new b.ComplexPrimitiveShader(a),this.defaultShader=new b.PixiShader(a),this.fastShader=new b.PixiFastShader(a),this.stripShader=new b.StripShader(a),this.setShader(this.defaultShader)},b.WebGLShaderManager.prototype.setAttribs=function(a){var b;for(b=0;b<this.tempAttribState.length;b++)this.tempAttribState[b]=!1;for(b=0;b<a.length;b++){var c=a[b];this.tempAttribState[c]=!0}var d=this.gl;for(b=0;b<this.attribState.length;b++)this.attribState[b]!==this.tempAttribState[b]&&(this.attribState[b]=this.tempAttribState[b],this.tempAttribState[b]?d.enableVertexAttribArray(b):d.disableVertexAttribArray(b))},b.WebGLShaderManager.prototype.setShader=function(a){return this._currentId===a._UID?!1:(this._currentId=a._UID,this.currentShader=a,this.gl.useProgram(a.program),this.setAttribs(a.attributes),!0)},b.WebGLShaderManager.prototype.destroy=function(){this.attribState=null,this.tempAttribState=null,this.primitiveShader.destroy(),this.defaultShader.destroy(),this.fastShader.destroy(),this.stripShader.destroy(),this.gl=null},b.WebGLSpriteBatch=function(a){this.vertSize=6,this.size=2e3;var b=4*this.size*this.vertSize,c=6*this.size;this.vertices=new Float32Array(b),this.indices=new Uint16Array(c),this.lastIndexCount=0;for(var d=0,e=0;c>d;d+=6,e+=4)this.indices[d+0]=e+0,this.indices[d+1]=e+1,this.indices[d+2]=e+2,this.indices[d+3]=e+0,this.indices[d+4]=e+2,this.indices[d+5]=e+3;this.drawing=!1,this.currentBatchSize=0,this.currentBaseTexture=null,this.setContext(a),this.dirty=!0,this.textures=[],this.blendModes=[]},b.WebGLSpriteBatch.prototype.setContext=function(a){this.gl=a,this.vertexBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this.indices,a.STATIC_DRAW),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bufferData(a.ARRAY_BUFFER,this.vertices,a.DYNAMIC_DRAW),this.currentBlendMode=99999},b.WebGLSpriteBatch.prototype.begin=function(a){this.renderSession=a,this.shader=this.renderSession.shaderManager.defaultShader,this.start()},b.WebGLSpriteBatch.prototype.end=function(){this.flush()},b.WebGLSpriteBatch.prototype.render=function(a){var b=a.texture;this.currentBatchSize>=this.size&&(this.flush(),this.currentBaseTexture=b.baseTexture);var c=b._uvs;if(c){var d,e,f,g,h=a.worldAlpha,i=a.tint,j=this.vertices,k=a.anchor.x,l=a.anchor.y;if(b.trim){var m=b.trim;e=m.x-k*m.width,d=e+b.crop.width,g=m.y-l*m.height,f=g+b.crop.height}else d=b.frame.width*(1-k),e=b.frame.width*-k,f=b.frame.height*(1-l),g=b.frame.height*-l;var n=4*this.currentBatchSize*this.vertSize,o=a.worldTransform,p=o.a,q=o.c,r=o.b,s=o.d,t=o.tx,u=o.ty;j[n++]=p*e+r*g+t,j[n++]=s*g+q*e+u,j[n++]=c.x0,j[n++]=c.y0,j[n++]=h,j[n++]=i,j[n++]=p*d+r*g+t,j[n++]=s*g+q*d+u,j[n++]=c.x1,j[n++]=c.y1,j[n++]=h,j[n++]=i,j[n++]=p*d+r*f+t,j[n++]=s*f+q*d+u,j[n++]=c.x2,j[n++]=c.y2,j[n++]=h,j[n++]=i,j[n++]=p*e+r*f+t,j[n++]=s*f+q*e+u,j[n++]=c.x3,j[n++]=c.y3,j[n++]=h,j[n++]=i,this.textures[this.currentBatchSize]=a.texture.baseTexture,this.blendModes[this.currentBatchSize]=a.blendMode,this.currentBatchSize++}},b.WebGLSpriteBatch.prototype.renderTilingSprite=function(a){var c=a.tilingTexture;this.currentBatchSize>=this.size&&(this.flush(),this.currentBaseTexture=c.baseTexture),a._uvs||(a._uvs=new b.TextureUvs);var d=a._uvs;a.tilePosition.x%=c.baseTexture.width*a.tileScaleOffset.x,a.tilePosition.y%=c.baseTexture.height*a.tileScaleOffset.y;var e=a.tilePosition.x/(c.baseTexture.width*a.tileScaleOffset.x),f=a.tilePosition.y/(c.baseTexture.height*a.tileScaleOffset.y),g=a.width/c.baseTexture.width/(a.tileScale.x*a.tileScaleOffset.x),h=a.height/c.baseTexture.height/(a.tileScale.y*a.tileScaleOffset.y);d.x0=0-e,d.y0=0-f,d.x1=1*g-e,d.y1=0-f,d.x2=1*g-e,d.y2=1*h-f,d.x3=0-e,d.y3=1*h-f;var i=a.worldAlpha,j=a.tint,k=this.vertices,l=a.width,m=a.height,n=a.anchor.x,o=a.anchor.y,p=l*(1-n),q=l*-n,r=m*(1-o),s=m*-o,t=4*this.currentBatchSize*this.vertSize,u=a.worldTransform,v=u.a,w=u.c,x=u.b,y=u.d,z=u.tx,A=u.ty;k[t++]=v*q+x*s+z,k[t++]=y*s+w*q+A,k[t++]=d.x0,k[t++]=d.y0,k[t++]=i,k[t++]=j,k[t++]=v*p+x*s+z,k[t++]=y*s+w*p+A,k[t++]=d.x1,k[t++]=d.y1,k[t++]=i,k[t++]=j,k[t++]=v*p+x*r+z,k[t++]=y*r+w*p+A,k[t++]=d.x2,k[t++]=d.y2,k[t++]=i,k[t++]=j,k[t++]=v*q+x*r+z,k[t++]=y*r+w*q+A,k[t++]=d.x3,k[t++]=d.y3,k[t++]=i,k[t++]=j,this.textures[this.currentBatchSize]=c.baseTexture,this.blendModes[this.currentBatchSize]=a.blendMode,this.currentBatchSize++},b.WebGLSpriteBatch.prototype.flush=function(){if(0!==this.currentBatchSize){var a=this.gl;if(this.renderSession.shaderManager.setShader(this.renderSession.shaderManager.defaultShader),this.dirty){this.dirty=!1,a.activeTexture(a.TEXTURE0),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var b=this.renderSession.projection;a.uniform2f(this.shader.projectionVector,b.x,b.y);var c=4*this.vertSize;a.vertexAttribPointer(this.shader.aVertexPosition,2,a.FLOAT,!1,c,0),a.vertexAttribPointer(this.shader.aTextureCoord,2,a.FLOAT,!1,c,8),a.vertexAttribPointer(this.shader.colorAttribute,2,a.FLOAT,!1,c,16)}if(this.currentBatchSize>.5*this.size)a.bufferSubData(a.ARRAY_BUFFER,0,this.vertices);else{var d=this.vertices.subarray(0,4*this.currentBatchSize*this.vertSize);a.bufferSubData(a.ARRAY_BUFFER,0,d)}for(var e,f,g=0,h=0,i=null,j=this.renderSession.blendModeManager.currentBlendMode,k=0,l=this.currentBatchSize;l>k;k++)e=this.textures[k],f=this.blendModes[k],(i!==e||j!==f)&&(this.renderBatch(i,g,h),h=k,g=0,i=e,j=f,this.renderSession.blendModeManager.setBlendMode(j)),g++;this.renderBatch(i,g,h),this.currentBatchSize=0}},b.WebGLSpriteBatch.prototype.renderBatch=function(a,c,d){if(0!==c){var e=this.gl;e.bindTexture(e.TEXTURE_2D,a._glTextures[e.id]||b.createWebGLTexture(a,e)),a._dirty[e.id]&&b.updateWebGLTexture(this.currentBaseTexture,e),e.drawElements(e.TRIANGLES,6*c,e.UNSIGNED_SHORT,6*d*2),this.renderSession.drawCount++}},b.WebGLSpriteBatch.prototype.stop=function(){this.flush()},b.WebGLSpriteBatch.prototype.start=function(){this.dirty=!0},b.WebGLSpriteBatch.prototype.destroy=function(){this.vertices=null,this.indices=null,this.gl.deleteBuffer(this.vertexBuffer),this.gl.deleteBuffer(this.indexBuffer),this.currentBaseTexture=null,this.gl=null},b.WebGLFastSpriteBatch=function(a){this.vertSize=10,this.maxSize=6e3,this.size=this.maxSize;var b=4*this.size*this.vertSize,c=6*this.maxSize;this.vertices=new Float32Array(b),this.indices=new Uint16Array(c),this.vertexBuffer=null,this.indexBuffer=null,this.lastIndexCount=0;for(var d=0,e=0;c>d;d+=6,e+=4)this.indices[d+0]=e+0,this.indices[d+1]=e+1,this.indices[d+2]=e+2,this.indices[d+3]=e+0,this.indices[d+4]=e+2,this.indices[d+5]=e+3;this.drawing=!1,this.currentBatchSize=0,this.currentBaseTexture=null,this.currentBlendMode=0,this.renderSession=null,this.shader=null,this.matrix=null,this.setContext(a)},b.WebGLFastSpriteBatch.prototype.setContext=function(a){this.gl=a,this.vertexBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this.indices,a.STATIC_DRAW),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bufferData(a.ARRAY_BUFFER,this.vertices,a.DYNAMIC_DRAW)},b.WebGLFastSpriteBatch.prototype.begin=function(a,b){this.renderSession=b,this.shader=this.renderSession.shaderManager.fastShader,this.matrix=a.worldTransform.toArray(!0),this.start()},b.WebGLFastSpriteBatch.prototype.end=function(){this.flush()},b.WebGLFastSpriteBatch.prototype.render=function(a){var b=a.children,c=b[0];if(c.texture._uvs){this.currentBaseTexture=c.texture.baseTexture,c.blendMode!==this.renderSession.blendModeManager.currentBlendMode&&(this.flush(),this.renderSession.blendModeManager.setBlendMode(c.blendMode));for(var d=0,e=b.length;e>d;d++)this.renderSprite(b[d]);this.flush()}},b.WebGLFastSpriteBatch.prototype.renderSprite=function(a){if(a.visible&&(a.texture.baseTexture===this.currentBaseTexture||(this.flush(),this.currentBaseTexture=a.texture.baseTexture,a.texture._uvs))){var b,c,d,e,f,g,h,i,j=this.vertices;if(b=a.texture._uvs,c=a.texture.frame.width,d=a.texture.frame.height,a.texture.trim){var k=a.texture.trim;f=k.x-a.anchor.x*k.width,e=f+a.texture.crop.width,h=k.y-a.anchor.y*k.height,g=h+a.texture.crop.height}else e=a.texture.frame.width*(1-a.anchor.x),f=a.texture.frame.width*-a.anchor.x,g=a.texture.frame.height*(1-a.anchor.y),h=a.texture.frame.height*-a.anchor.y;i=4*this.currentBatchSize*this.vertSize,j[i++]=f,j[i++]=h,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x0,j[i++]=b.y1,j[i++]=a.alpha,j[i++]=e,j[i++]=h,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x1,j[i++]=b.y1,j[i++]=a.alpha,j[i++]=e,j[i++]=g,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x2,j[i++]=b.y2,j[i++]=a.alpha,j[i++]=f,j[i++]=g,j[i++]=a.position.x,j[i++]=a.position.y,j[i++]=a.scale.x,j[i++]=a.scale.y,j[i++]=a.rotation,j[i++]=b.x3,j[i++]=b.y3,j[i++]=a.alpha,this.currentBatchSize++,this.currentBatchSize>=this.size&&this.flush()}},b.WebGLFastSpriteBatch.prototype.flush=function(){if(0!==this.currentBatchSize){var a=this.gl;if(this.currentBaseTexture._glTextures[a.id]||b.createWebGLTexture(this.currentBaseTexture,a),a.bindTexture(a.TEXTURE_2D,this.currentBaseTexture._glTextures[a.id]),this.currentBatchSize>.5*this.size)a.bufferSubData(a.ARRAY_BUFFER,0,this.vertices);else{var c=this.vertices.subarray(0,4*this.currentBatchSize*this.vertSize);a.bufferSubData(a.ARRAY_BUFFER,0,c)}a.drawElements(a.TRIANGLES,6*this.currentBatchSize,a.UNSIGNED_SHORT,0),this.currentBatchSize=0,this.renderSession.drawCount++}},b.WebGLFastSpriteBatch.prototype.stop=function(){this.flush()},b.WebGLFastSpriteBatch.prototype.start=function(){var a=this.gl;a.activeTexture(a.TEXTURE0),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var b=this.renderSession.projection;a.uniform2f(this.shader.projectionVector,b.x,b.y),a.uniformMatrix3fv(this.shader.uMatrix,!1,this.matrix);var c=4*this.vertSize;a.vertexAttribPointer(this.shader.aVertexPosition,2,a.FLOAT,!1,c,0),a.vertexAttribPointer(this.shader.aPositionCoord,2,a.FLOAT,!1,c,8),a.vertexAttribPointer(this.shader.aScale,2,a.FLOAT,!1,c,16),a.vertexAttribPointer(this.shader.aRotation,1,a.FLOAT,!1,c,24),a.vertexAttribPointer(this.shader.aTextureCoord,2,a.FLOAT,!1,c,28),a.vertexAttribPointer(this.shader.colorAttribute,1,a.FLOAT,!1,c,36)},b.WebGLFilterManager=function(a,b){this.transparent=b,this.filterStack=[],this.offsetX=0,this.offsetY=0,this.setContext(a)},b.WebGLFilterManager.prototype.setContext=function(a){this.gl=a,this.texturePool=[],this.initShaderBuffers()},b.WebGLFilterManager.prototype.begin=function(a,b){this.renderSession=a,this.defaultShader=a.shaderManager.defaultShader;var c=this.renderSession.projection;this.width=2*c.x,this.height=2*-c.y,this.buffer=b},b.WebGLFilterManager.prototype.pushFilter=function(a){var c=this.gl,d=this.renderSession.projection,e=this.renderSession.offset;a._filterArea=a.target.filterArea||a.target.getBounds(),this.filterStack.push(a);var f=a.filterPasses[0];this.offsetX+=a._filterArea.x,this.offsetY+=a._filterArea.y;var g=this.texturePool.pop();g?g.resize(this.width,this.height):g=new b.FilterTexture(this.gl,this.width,this.height),c.bindTexture(c.TEXTURE_2D,g.texture);var h=a._filterArea,i=f.padding;h.x-=i,h.y-=i,h.width+=2*i,h.height+=2*i,h.x<0&&(h.x=0),h.width>this.width&&(h.width=this.width),h.y<0&&(h.y=0),h.height>this.height&&(h.height=this.height),c.bindFramebuffer(c.FRAMEBUFFER,g.frameBuffer),c.viewport(0,0,h.width,h.height),d.x=h.width/2,d.y=-h.height/2,e.x=-h.x,e.y=-h.y,this.renderSession.shaderManager.setShader(this.defaultShader),c.uniform2f(this.defaultShader.projectionVector,h.width/2,-h.height/2),c.uniform2f(this.defaultShader.offsetVector,-h.x,-h.y),c.colorMask(!0,!0,!0,!0),c.clearColor(0,0,0,0),c.clear(c.COLOR_BUFFER_BIT),a._glFilterTexture=g},b.WebGLFilterManager.prototype.popFilter=function(){var a=this.gl,c=this.filterStack.pop(),d=c._filterArea,e=c._glFilterTexture,f=this.renderSession.projection,g=this.renderSession.offset;if(c.filterPasses.length>1){a.viewport(0,0,d.width,d.height),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),this.vertexArray[0]=0,this.vertexArray[1]=d.height,this.vertexArray[2]=d.width,this.vertexArray[3]=d.height,this.vertexArray[4]=0,this.vertexArray[5]=0,this.vertexArray[6]=d.width,this.vertexArray[7]=0,a.bufferSubData(a.ARRAY_BUFFER,0,this.vertexArray),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),this.uvArray[2]=d.width/this.width,this.uvArray[5]=d.height/this.height,this.uvArray[6]=d.width/this.width,this.uvArray[7]=d.height/this.height,a.bufferSubData(a.ARRAY_BUFFER,0,this.uvArray);var h=e,i=this.texturePool.pop();i||(i=new b.FilterTexture(this.gl,this.width,this.height)),i.resize(this.width,this.height),a.bindFramebuffer(a.FRAMEBUFFER,i.frameBuffer),a.clear(a.COLOR_BUFFER_BIT),a.disable(a.BLEND);for(var j=0;j<c.filterPasses.length-1;j++){var k=c.filterPasses[j];a.bindFramebuffer(a.FRAMEBUFFER,i.frameBuffer),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,h.texture),this.applyFilterPass(k,d,d.width,d.height);var l=h;h=i,i=l}a.enable(a.BLEND),e=h,this.texturePool.push(i)}var m=c.filterPasses[c.filterPasses.length-1];this.offsetX-=d.x,this.offsetY-=d.y;var n=this.width,o=this.height,p=0,q=0,r=this.buffer;if(0===this.filterStack.length)a.colorMask(!0,!0,!0,!0);else{var s=this.filterStack[this.filterStack.length-1];d=s._filterArea,n=d.width,o=d.height,p=d.x,q=d.y,r=s._glFilterTexture.frameBuffer}f.x=n/2,f.y=-o/2,g.x=p,g.y=q,d=c._filterArea;var t=d.x-p,u=d.y-q;a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),this.vertexArray[0]=t,this.vertexArray[1]=u+d.height,this.vertexArray[2]=t+d.width,this.vertexArray[3]=u+d.height,this.vertexArray[4]=t,this.vertexArray[5]=u,this.vertexArray[6]=t+d.width,this.vertexArray[7]=u,a.bufferSubData(a.ARRAY_BUFFER,0,this.vertexArray),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),this.uvArray[2]=d.width/this.width,this.uvArray[5]=d.height/this.height,this.uvArray[6]=d.width/this.width,this.uvArray[7]=d.height/this.height,a.bufferSubData(a.ARRAY_BUFFER,0,this.uvArray),a.viewport(0,0,n,o),a.bindFramebuffer(a.FRAMEBUFFER,r),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,e.texture),this.applyFilterPass(m,d,n,o),this.renderSession.shaderManager.setShader(this.defaultShader),a.uniform2f(this.defaultShader.projectionVector,n/2,-o/2),a.uniform2f(this.defaultShader.offsetVector,-p,-q),this.texturePool.push(e),c._glFilterTexture=null},b.WebGLFilterManager.prototype.applyFilterPass=function(a,c,d,e){var f=this.gl,g=a.shaders[f.id];g||(g=new b.PixiShader(f),g.fragmentSrc=a.fragmentSrc,g.uniforms=a.uniforms,g.init(),a.shaders[f.id]=g),this.renderSession.shaderManager.setShader(g),f.uniform2f(g.projectionVector,d/2,-e/2),f.uniform2f(g.offsetVector,0,0),a.uniforms.dimensions&&(a.uniforms.dimensions.value[0]=this.width,a.uniforms.dimensions.value[1]=this.height,a.uniforms.dimensions.value[2]=this.vertexArray[0],a.uniforms.dimensions.value[3]=this.vertexArray[5]),g.syncUniforms(),f.bindBuffer(f.ARRAY_BUFFER,this.vertexBuffer),f.vertexAttribPointer(g.aVertexPosition,2,f.FLOAT,!1,0,0),f.bindBuffer(f.ARRAY_BUFFER,this.uvBuffer),f.vertexAttribPointer(g.aTextureCoord,2,f.FLOAT,!1,0,0),f.bindBuffer(f.ARRAY_BUFFER,this.colorBuffer),f.vertexAttribPointer(g.colorAttribute,2,f.FLOAT,!1,0,0),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,this.indexBuffer),f.drawElements(f.TRIANGLES,6,f.UNSIGNED_SHORT,0),this.renderSession.drawCount++},b.WebGLFilterManager.prototype.initShaderBuffers=function(){var a=this.gl;this.vertexBuffer=a.createBuffer(),this.uvBuffer=a.createBuffer(),this.colorBuffer=a.createBuffer(),this.indexBuffer=a.createBuffer(),this.vertexArray=new Float32Array([0,0,1,0,0,1,1,1]),a.bindBuffer(a.ARRAY_BUFFER,this.vertexBuffer),a.bufferData(a.ARRAY_BUFFER,this.vertexArray,a.STATIC_DRAW),this.uvArray=new Float32Array([0,0,1,0,0,1,1,1]),a.bindBuffer(a.ARRAY_BUFFER,this.uvBuffer),a.bufferData(a.ARRAY_BUFFER,this.uvArray,a.STATIC_DRAW),this.colorArray=new Float32Array([1,16777215,1,16777215,1,16777215,1,16777215]),a.bindBuffer(a.ARRAY_BUFFER,this.colorBuffer),a.bufferData(a.ARRAY_BUFFER,this.colorArray,a.STATIC_DRAW),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.indexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,1,3,2]),a.STATIC_DRAW)},b.WebGLFilterManager.prototype.destroy=function(){var a=this.gl;this.filterStack=null,this.offsetX=0,this.offsetY=0;for(var b=0;b<this.texturePool.length;b++)this.texturePool[b].destroy();this.texturePool=null,a.deleteBuffer(this.vertexBuffer),a.deleteBuffer(this.uvBuffer),a.deleteBuffer(this.colorBuffer),a.deleteBuffer(this.indexBuffer)},b.FilterTexture=function(a,c,d,e){this.gl=a,this.frameBuffer=a.createFramebuffer(),this.texture=a.createTexture(),e=e||b.scaleModes.DEFAULT,a.bindTexture(a.TEXTURE_2D,this.texture),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,e===b.scaleModes.LINEAR?a.LINEAR:a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,e===b.scaleModes.LINEAR?a.LINEAR:a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindFramebuffer(a.FRAMEBUFFER,this.framebuffer),a.bindFramebuffer(a.FRAMEBUFFER,this.frameBuffer),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,this.texture,0),this.renderBuffer=a.createRenderbuffer(),a.bindRenderbuffer(a.RENDERBUFFER,this.renderBuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.RENDERBUFFER,this.renderBuffer),this.resize(c,d)},b.FilterTexture.prototype.clear=function(){var a=this.gl;a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT)},b.FilterTexture.prototype.resize=function(a,b){if(this.width!==a||this.height!==b){this.width=a,this.height=b;var c=this.gl;c.bindTexture(c.TEXTURE_2D,this.texture),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,a,b,0,c.RGBA,c.UNSIGNED_BYTE,null),c.bindRenderbuffer(c.RENDERBUFFER,this.renderBuffer),c.renderbufferStorage(c.RENDERBUFFER,c.DEPTH_STENCIL,a,b)}},b.FilterTexture.prototype.destroy=function(){var a=this.gl;a.deleteFramebuffer(this.frameBuffer),a.deleteTexture(this.texture),this.frameBuffer=null,this.texture=null},b.CanvasMaskManager=function(){},b.CanvasMaskManager.prototype.pushMask=function(a,c){c.save();var d=a.alpha,e=a.worldTransform;c.setTransform(e.a,e.c,e.b,e.d,e.tx,e.ty),b.CanvasGraphics.renderGraphicsMask(a,c),c.clip(),a.worldAlpha=d},b.CanvasMaskManager.prototype.popMask=function(a){a.restore()},b.CanvasTinter=function(){},b.CanvasTinter.getTintedTexture=function(a,c){var d=a.texture;c=b.CanvasTinter.roundColor(c);var e="#"+("00000"+(0|c).toString(16)).substr(-6);if(d.tintCache=d.tintCache||{},d.tintCache[e])return d.tintCache[e];var f=b.CanvasTinter.canvas||document.createElement("canvas");if(b.CanvasTinter.tintMethod(d,c,f),b.CanvasTinter.convertTintToImage){var g=new Image;g.src=f.toDataURL(),d.tintCache[e]=g}else d.tintCache[e]=f,b.CanvasTinter.canvas=null;return f},b.CanvasTinter.tintWithMultiply=function(a,b,c){var d=c.getContext("2d"),e=a.frame;c.width=e.width,c.height=e.height,d.fillStyle="#"+("00000"+(0|b).toString(16)).substr(-6),d.fillRect(0,0,e.width,e.height),d.globalCompositeOperation="multiply",d.drawImage(a.baseTexture.source,e.x,e.y,e.width,e.height,0,0,e.width,e.height),d.globalCompositeOperation="destination-atop",d.drawImage(a.baseTexture.source,e.x,e.y,e.width,e.height,0,0,e.width,e.height)},b.CanvasTinter.tintWithOverlay=function(a,b,c){var d=c.getContext("2d"),e=a.frame;c.width=e.width,c.height=e.height,d.globalCompositeOperation="copy",d.fillStyle="#"+("00000"+(0|b).toString(16)).substr(-6),d.fillRect(0,0,e.width,e.height),d.globalCompositeOperation="destination-atop",d.drawImage(a.baseTexture.source,e.x,e.y,e.width,e.height,0,0,e.width,e.height)},b.CanvasTinter.tintWithPerPixel=function(a,c,d){var e=d.getContext("2d"),f=a.frame;d.width=f.width,d.height=f.height,e.globalCompositeOperation="copy",e.drawImage(a.baseTexture.source,f.x,f.y,f.width,f.height,0,0,f.width,f.height);for(var g=b.hex2rgb(c),h=g[0],i=g[1],j=g[2],k=e.getImageData(0,0,f.width,f.height),l=k.data,m=0;m<l.length;m+=4)l[m+0]*=h,l[m+1]*=i,l[m+2]*=j;e.putImageData(k,0,0)},b.CanvasTinter.roundColor=function(a){var c=b.CanvasTinter.cacheStepsPerColorChannel,d=b.hex2rgb(a);return d[0]=Math.min(255,d[0]/c*c),d[1]=Math.min(255,d[1]/c*c),d[2]=Math.min(255,d[2]/c*c),b.rgb2hex(d)},b.CanvasTinter.cacheStepsPerColorChannel=8,b.CanvasTinter.convertTintToImage=!1,b.CanvasTinter.canUseMultiply=b.canUseNewCanvasBlendModes(),b.CanvasTinter.tintMethod=b.CanvasTinter.canUseMultiply?b.CanvasTinter.tintWithMultiply:b.CanvasTinter.tintWithPerPixel,b.CanvasRenderer=function(a,c,d,e){b.defaultRenderer||(b.sayHello("Canvas"),b.defaultRenderer=this),this.type=b.CANVAS_RENDERER,this.clearBeforeRender=!0,this.transparent=!!e,b.blendModesCanvas||(b.blendModesCanvas=[],b.canUseNewCanvasBlendModes()?(b.blendModesCanvas[b.blendModes.NORMAL]="source-over",b.blendModesCanvas[b.blendModes.ADD]="lighter",b.blendModesCanvas[b.blendModes.MULTIPLY]="multiply",b.blendModesCanvas[b.blendModes.SCREEN]="screen",b.blendModesCanvas[b.blendModes.OVERLAY]="overlay",b.blendModesCanvas[b.blendModes.DARKEN]="darken",b.blendModesCanvas[b.blendModes.LIGHTEN]="lighten",b.blendModesCanvas[b.blendModes.COLOR_DODGE]="color-dodge",b.blendModesCanvas[b.blendModes.COLOR_BURN]="color-burn",b.blendModesCanvas[b.blendModes.HARD_LIGHT]="hard-light",b.blendModesCanvas[b.blendModes.SOFT_LIGHT]="soft-light",b.blendModesCanvas[b.blendModes.DIFFERENCE]="difference",b.blendModesCanvas[b.blendModes.EXCLUSION]="exclusion",b.blendModesCanvas[b.blendModes.HUE]="hue",b.blendModesCanvas[b.blendModes.SATURATION]="saturation",b.blendModesCanvas[b.blendModes.COLOR]="color",b.blendModesCanvas[b.blendModes.LUMINOSITY]="luminosity"):(b.blendModesCanvas[b.blendModes.NORMAL]="source-over",b.blendModesCanvas[b.blendModes.ADD]="lighter",b.blendModesCanvas[b.blendModes.MULTIPLY]="source-over",b.blendModesCanvas[b.blendModes.SCREEN]="source-over",b.blendModesCanvas[b.blendModes.OVERLAY]="source-over",b.blendModesCanvas[b.blendModes.DARKEN]="source-over",b.blendModesCanvas[b.blendModes.LIGHTEN]="source-over",b.blendModesCanvas[b.blendModes.COLOR_DODGE]="source-over",b.blendModesCanvas[b.blendModes.COLOR_BURN]="source-over",b.blendModesCanvas[b.blendModes.HARD_LIGHT]="source-over",b.blendModesCanvas[b.blendModes.SOFT_LIGHT]="source-over",b.blendModesCanvas[b.blendModes.DIFFERENCE]="source-over",b.blendModesCanvas[b.blendModes.EXCLUSION]="source-over",b.blendModesCanvas[b.blendModes.HUE]="source-over",b.blendModesCanvas[b.blendModes.SATURATION]="source-over",b.blendModesCanvas[b.blendModes.COLOR]="source-over",b.blendModesCanvas[b.blendModes.LUMINOSITY]="source-over")),this.width=a||800,this.height=c||600,this.view=d||document.createElement("canvas"),this.context=this.view.getContext("2d",{alpha:this.transparent}),this.refresh=!0,this.view.width=this.width,this.view.height=this.height,this.count=0,this.maskManager=new b.CanvasMaskManager,this.renderSession={context:this.context,maskManager:this.maskManager,scaleMode:null,smoothProperty:null,roundPixels:!1},"imageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="imageSmoothingEnabled":"webkitImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="webkitImageSmoothingEnabled":"mozImageSmoothingEnabled"in this.context?this.renderSession.smoothProperty="mozImageSmoothingEnabled":"oImageSmoothingEnabled"in this.context&&(this.renderSession.smoothProperty="oImageSmoothingEnabled")},b.CanvasRenderer.prototype.constructor=b.CanvasRenderer,b.CanvasRenderer.prototype.render=function(a){b.texturesToUpdate.length=0,b.texturesToDestroy.length=0,a.updateTransform(),this.context.setTransform(1,0,0,1,0,0),this.context.globalAlpha=1,navigator.isCocoonJS&&this.view.screencanvas&&(this.context.fillStyle="black",this.context.clear()),!this.transparent&&this.clearBeforeRender?(this.context.fillStyle=a.backgroundColorString,this.context.fillRect(0,0,this.width,this.height)):this.transparent&&this.clearBeforeRender&&this.context.clearRect(0,0,this.width,this.height),this.renderDisplayObject(a),a.interactive&&(a._interactiveEventsAdded||(a._interactiveEventsAdded=!0,a.interactionManager.setTarget(this))),b.Texture.frameUpdates.length>0&&(b.Texture.frameUpdates.length=0)
},b.CanvasRenderer.prototype.resize=function(a,b){this.width=a,this.height=b,this.view.width=a,this.view.height=b},b.CanvasRenderer.prototype.renderDisplayObject=function(a,b){this.renderSession.context=b||this.context,a._renderCanvas(this.renderSession)},b.CanvasRenderer.prototype.renderStripFlat=function(a){var b=this.context,c=a.verticies,d=c.length/2;this.count++,b.beginPath();for(var e=1;d-2>e;e++){var f=2*e,g=c[f],h=c[f+2],i=c[f+4],j=c[f+1],k=c[f+3],l=c[f+5];b.moveTo(g,j),b.lineTo(h,k),b.lineTo(i,l)}b.fillStyle="#FF0000",b.fill(),b.closePath()},b.CanvasRenderer.prototype.renderStrip=function(a){var b=this.context,c=a.verticies,d=a.uvs,e=c.length/2;this.count++;for(var f=1;e-2>f;f++){var g=2*f,h=c[g],i=c[g+2],j=c[g+4],k=c[g+1],l=c[g+3],m=c[g+5],n=d[g]*a.texture.width,o=d[g+2]*a.texture.width,p=d[g+4]*a.texture.width,q=d[g+1]*a.texture.height,r=d[g+3]*a.texture.height,s=d[g+5]*a.texture.height;b.save(),b.beginPath(),b.moveTo(h,k),b.lineTo(i,l),b.lineTo(j,m),b.closePath(),b.clip();var t=n*r+q*p+o*s-r*p-q*o-n*s,u=h*r+q*j+i*s-r*j-q*i-h*s,v=n*i+h*p+o*j-i*p-h*o-n*j,w=n*r*j+q*i*p+h*o*s-h*r*p-q*o*j-n*i*s,x=k*r+q*m+l*s-r*m-q*l-k*s,y=n*l+k*p+o*m-l*p-k*o-n*m,z=n*r*m+q*l*p+k*o*s-k*r*p-q*o*m-n*l*s;b.transform(u/t,x/t,v/t,y/t,w/t,z/t),b.drawImage(a.texture.baseTexture.source,0,0),b.restore()}},b.CanvasBuffer=function(a,b){this.width=a,this.height=b,this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.canvas.width=a,this.canvas.height=b},b.CanvasBuffer.prototype.clear=function(){this.context.clearRect(0,0,this.width,this.height)},b.CanvasBuffer.prototype.resize=function(a,b){this.width=this.canvas.width=a,this.height=this.canvas.height=b},b.CanvasGraphics=function(){},b.CanvasGraphics.renderGraphics=function(a,c){for(var d=a.worldAlpha,e="",f=0;f<a.graphicsData.length;f++){var g=a.graphicsData[f],h=g.points;if(c.strokeStyle=e="#"+("00000"+(0|g.lineColor).toString(16)).substr(-6),c.lineWidth=g.lineWidth,g.type===b.Graphics.POLY){c.beginPath(),c.moveTo(h[0],h[1]);for(var i=1;i<h.length/2;i++)c.lineTo(h[2*i],h[2*i+1]);h[0]===h[h.length-2]&&h[1]===h[h.length-1]&&c.closePath(),g.fill&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke())}else if(g.type===b.Graphics.RECT)(g.fillColor||0===g.fillColor)&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fillRect(h[0],h[1],h[2],h[3])),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.strokeRect(h[0],h[1],h[2],h[3]));else if(g.type===b.Graphics.CIRC)c.beginPath(),c.arc(h[0],h[1],h[2],0,2*Math.PI),c.closePath(),g.fill&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke());else if(g.type===b.Graphics.ELIP){var j=g.points,k=2*j[2],l=2*j[3],m=j[0]-k/2,n=j[1]-l/2;c.beginPath();var o=.5522848,p=k/2*o,q=l/2*o,r=m+k,s=n+l,t=m+k/2,u=n+l/2;c.moveTo(m,u),c.bezierCurveTo(m,u-q,t-p,n,t,n),c.bezierCurveTo(t+p,n,r,u-q,r,u),c.bezierCurveTo(r,u+q,t+p,s,t,s),c.bezierCurveTo(t-p,s,m,u+q,m,u),c.closePath(),g.fill&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke())}else if(g.type===b.Graphics.RREC){var v=h[0],w=h[1],x=h[2],y=h[3],z=h[4],A=Math.min(x,y)/2|0;z=z>A?A:z,c.beginPath(),c.moveTo(v,w+z),c.lineTo(v,w+y-z),c.quadraticCurveTo(v,w+y,v+z,w+y),c.lineTo(v+x-z,w+y),c.quadraticCurveTo(v+x,w+y,v+x,w+y-z),c.lineTo(v+x,w+z),c.quadraticCurveTo(v+x,w,v+x-z,w),c.lineTo(v+z,w),c.quadraticCurveTo(v,w,v,w+z),c.closePath(),(g.fillColor||0===g.fillColor)&&(c.globalAlpha=g.fillAlpha*d,c.fillStyle=e="#"+("00000"+(0|g.fillColor).toString(16)).substr(-6),c.fill()),g.lineWidth&&(c.globalAlpha=g.lineAlpha*d,c.stroke())}}},b.CanvasGraphics.renderGraphicsMask=function(a,c){var d=a.graphicsData.length;if(0!==d){d>1&&(d=1,window.console.log("Pixi.js warning: masks in canvas can only mask using the first path in the graphics object"));for(var e=0;1>e;e++){var f=a.graphicsData[e],g=f.points;if(f.type===b.Graphics.POLY){c.beginPath(),c.moveTo(g[0],g[1]);for(var h=1;h<g.length/2;h++)c.lineTo(g[2*h],g[2*h+1]);g[0]===g[g.length-2]&&g[1]===g[g.length-1]&&c.closePath()}else if(f.type===b.Graphics.RECT)c.beginPath(),c.rect(g[0],g[1],g[2],g[3]),c.closePath();else if(f.type===b.Graphics.CIRC)c.beginPath(),c.arc(g[0],g[1],g[2],0,2*Math.PI),c.closePath();else if(f.type===b.Graphics.ELIP){var i=f.points,j=2*i[2],k=2*i[3],l=i[0]-j/2,m=i[1]-k/2;c.beginPath();var n=.5522848,o=j/2*n,p=k/2*n,q=l+j,r=m+k,s=l+j/2,t=m+k/2;c.moveTo(l,t),c.bezierCurveTo(l,t-p,s-o,m,s,m),c.bezierCurveTo(s+o,m,q,t-p,q,t),c.bezierCurveTo(q,t+p,s+o,r,s,r),c.bezierCurveTo(s-o,r,l,t+p,l,t),c.closePath()}else if(f.type===b.Graphics.RREC){var u=g[0],v=g[1],w=g[2],x=g[3],y=g[4],z=Math.min(w,x)/2|0;y=y>z?z:y,c.beginPath(),c.moveTo(u,v+y),c.lineTo(u,v+x-y),c.quadraticCurveTo(u,v+x,u+y,v+x),c.lineTo(u+w-y,v+x),c.quadraticCurveTo(u+w,v+x,u+w,v+x-y),c.lineTo(u+w,v+y),c.quadraticCurveTo(u+w,v,u+w-y,v),c.lineTo(u+y,v),c.quadraticCurveTo(u,v,u,v+y),c.closePath()}}}},b.Graphics=function(){b.DisplayObjectContainer.call(this),this.renderable=!0,this.fillAlpha=1,this.lineWidth=0,this.lineColor="black",this.graphicsData=[],this.tint=16777215,this.blendMode=b.blendModes.NORMAL,this.currentPath={points:[]},this._webGL=[],this.isMask=!1,this.bounds=null,this.boundsPadding=10,this.dirty=!0},b.Graphics.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Graphics.prototype.constructor=b.Graphics,Object.defineProperty(b.Graphics.prototype,"cacheAsBitmap",{get:function(){return this._cacheAsBitmap},set:function(a){this._cacheAsBitmap=a,this._cacheAsBitmap?this._generateCachedSprite():(this.destroyCachedSprite(),this.dirty=!0)}}),b.Graphics.prototype.lineStyle=function(a,c,d){return this.currentPath.points.length||this.graphicsData.pop(),this.lineWidth=a||0,this.lineColor=c||0,this.lineAlpha=arguments.length<3?1:d,this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[],type:b.Graphics.POLY},this.graphicsData.push(this.currentPath),this},b.Graphics.prototype.moveTo=function(a,c){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath=this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[],type:b.Graphics.POLY},this.currentPath.points.push(a,c),this.graphicsData.push(this.currentPath),this},b.Graphics.prototype.lineTo=function(a,b){return this.currentPath.points.push(a,b),this.dirty=!0,this},b.Graphics.prototype.quadraticCurveTo=function(a,b,c,d){0===this.currentPath.points.length&&this.moveTo(0,0);var e,f,g=20,h=this.currentPath.points;0===h.length&&this.moveTo(0,0);for(var i=h[h.length-2],j=h[h.length-1],k=0,l=1;g>=l;l++)k=l/g,e=i+(a-i)*k,f=j+(b-j)*k,h.push(e+(a+(c-a)*k-e)*k,f+(b+(d-b)*k-f)*k);return this.dirty=!0,this},b.Graphics.prototype.bezierCurveTo=function(a,b,c,d,e,f){0===this.currentPath.points.length&&this.moveTo(0,0);for(var g,h,i,j,k,l=20,m=this.currentPath.points,n=m[m.length-2],o=m[m.length-1],p=0,q=1;l>q;q++)p=q/l,g=1-p,h=g*g,i=h*g,j=p*p,k=j*p,m.push(i*n+3*h*p*a+3*g*j*c+k*e,i*o+3*h*p*b+3*g*j*d+k*f);return this.dirty=!0,this},b.Graphics.prototype.arcTo=function(a,b,c,d,e){0===this.currentPath.points.length&&this.moveTo(a,b);var f=this.currentPath.points,g=f[f.length-2],h=f[f.length-1],i=h-b,j=g-a,k=d-b,l=c-a,m=Math.abs(i*l-j*k);if(1e-8>m||0===e)f.push(a,b);else{var n=i*i+j*j,o=k*k+l*l,p=i*k+j*l,q=e*Math.sqrt(n)/m,r=e*Math.sqrt(o)/m,s=q*p/n,t=r*p/o,u=q*l+r*j,v=q*k+r*i,w=j*(r+s),x=i*(r+s),y=l*(q+t),z=k*(q+t),A=Math.atan2(x-v,w-u),B=Math.atan2(z-v,y-u);this.arc(u+a,v+b,e,A,B,j*k>l*i)}return this.dirty=!0,this},b.Graphics.prototype.arc=function(a,b,c,d,e,f){var g=a+Math.cos(d)*c,h=b+Math.sin(d)*c,i=this.currentPath.points;if((0!==i.length&&i[i.length-2]!==g||i[i.length-1]!==h)&&(this.moveTo(g,h),i=this.currentPath.points),d===e)return this;!f&&d>=e?e+=2*Math.PI:f&&e>=d&&(d+=2*Math.PI);var j=f?-1*(d-e):e-d,k=Math.abs(j)/(2*Math.PI)*40;if(0===j)return this;for(var l=j/(2*k),m=2*l,n=Math.cos(l),o=Math.sin(l),p=k-1,q=p%1/p,r=0;p>=r;r++){var s=r+q*r,t=l+d+m*s,u=Math.cos(t),v=-Math.sin(t);i.push((n*u+o*v)*c+a,(n*-v+o*u)*c+b)}return this.dirty=!0,this},b.Graphics.prototype.drawPath=function(a){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath=this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[],type:b.Graphics.POLY},this.graphicsData.push(this.currentPath),this.currentPath.points=this.currentPath.points.concat(a),this.dirty=!0,this},b.Graphics.prototype.beginFill=function(a,b){return this.filling=!0,this.fillColor=a||0,this.fillAlpha=arguments.length<2?1:b,this},b.Graphics.prototype.endFill=function(){return this.filling=!1,this.fillColor=null,this.fillAlpha=1,this},b.Graphics.prototype.drawRect=function(a,c,d,e){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,e],type:b.Graphics.RECT},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.drawRoundedRect=function(a,c,d,e,f){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,e,f],type:b.Graphics.RREC},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.drawCircle=function(a,c,d){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,d],type:b.Graphics.CIRC},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.drawEllipse=function(a,c,d,e){return this.currentPath.points.length||this.graphicsData.pop(),this.currentPath={lineWidth:this.lineWidth,lineColor:this.lineColor,lineAlpha:this.lineAlpha,fillColor:this.fillColor,fillAlpha:this.fillAlpha,fill:this.filling,points:[a,c,d,e],type:b.Graphics.ELIP},this.graphicsData.push(this.currentPath),this.dirty=!0,this},b.Graphics.prototype.clear=function(){return this.lineWidth=0,this.filling=!1,this.dirty=!0,this.clearDirty=!0,this.graphicsData=[],this.bounds=null,this},b.Graphics.prototype.generateTexture=function(){var a=this.getBounds(),c=new b.CanvasBuffer(a.width,a.height),d=b.Texture.fromCanvas(c.canvas);return c.context.translate(-a.x,-a.y),b.CanvasGraphics.renderGraphics(this,c.context),d},b.Graphics.prototype._renderWebGL=function(a){if(this.visible!==!1&&0!==this.alpha&&this.isMask!==!0){if(this._cacheAsBitmap)return this.dirty&&(this._generateCachedSprite(),b.updateWebGLTexture(this._cachedSprite.texture.baseTexture,a.gl),this.dirty=!1),this._cachedSprite.alpha=this.alpha,b.Sprite.prototype._renderWebGL.call(this._cachedSprite,a),void 0;if(a.spriteBatch.stop(),a.blendModeManager.setBlendMode(this.blendMode),this._mask&&a.maskManager.pushMask(this._mask,a),this._filters&&a.filterManager.pushFilter(this._filterBlock),this.blendMode!==a.spriteBatch.currentBlendMode){a.spriteBatch.currentBlendMode=this.blendMode;var c=b.blendModesWebGL[a.spriteBatch.currentBlendMode];a.spriteBatch.gl.blendFunc(c[0],c[1])}if(b.WebGLGraphics.renderGraphics(this,a),this.children.length){a.spriteBatch.start();for(var d=0,e=this.children.length;e>d;d++)this.children[d]._renderWebGL(a);a.spriteBatch.stop()}this._filters&&a.filterManager.popFilter(),this._mask&&a.maskManager.popMask(this.mask,a),a.drawCount++,a.spriteBatch.start()}},b.Graphics.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha&&this.isMask!==!0){var c=a.context,d=this.worldTransform;this.blendMode!==a.currentBlendMode&&(a.currentBlendMode=this.blendMode,c.globalCompositeOperation=b.blendModesCanvas[a.currentBlendMode]),this._mask&&a.maskManager.pushMask(this._mask,a.context),c.setTransform(d.a,d.c,d.b,d.d,d.tx,d.ty),b.CanvasGraphics.renderGraphics(this,c);for(var e=0,f=this.children.length;f>e;e++)this.children[e]._renderCanvas(a);this._mask&&a.maskManager.popMask(a.context)}},b.Graphics.prototype.getBounds=function(a){this.bounds||this.updateBounds();var b=this.bounds.x,c=this.bounds.width+this.bounds.x,d=this.bounds.y,e=this.bounds.height+this.bounds.y,f=a||this.worldTransform,g=f.a,h=f.c,i=f.b,j=f.d,k=f.tx,l=f.ty,m=g*c+i*e+k,n=j*e+h*c+l,o=g*b+i*e+k,p=j*e+h*b+l,q=g*b+i*d+k,r=j*d+h*b+l,s=g*c+i*d+k,t=j*d+h*c+l,u=m,v=n,w=m,x=n;w=w>o?o:w,w=w>q?q:w,w=w>s?s:w,x=x>p?p:x,x=x>r?r:x,x=x>t?t:x,u=o>u?o:u,u=q>u?q:u,u=s>u?s:u,v=p>v?p:v,v=r>v?r:v,v=t>v?t:v;var y=this._bounds;return y.x=w,y.width=u-w,y.y=x,y.height=v-x,y},b.Graphics.prototype.updateBounds=function(){for(var a,c,d,e,f,g=1/0,h=-1/0,i=1/0,j=-1/0,k=0;k<this.graphicsData.length;k++){var l=this.graphicsData[k],m=l.type,n=l.lineWidth;if(a=l.points,m===b.Graphics.RECT)c=a[0]-n/2,d=a[1]-n/2,e=a[2]+n,f=a[3]+n,g=g>c?c:g,h=c+e>h?c+e:h,i=i>d?c:i,j=d+f>j?d+f:j;else if(m===b.Graphics.CIRC||m===b.Graphics.ELIP)c=a[0],d=a[1],e=a[2]+n/2,f=a[3]+n/2,g=g>c-e?c-e:g,h=c+e>h?c+e:h,i=i>d-f?d-f:i,j=d+f>j?d+f:j;else for(var o=0;o<a.length;o+=2)c=a[o],d=a[o+1],g=g>c-n?c-n:g,h=c+n>h?c+n:h,i=i>d-n?d-n:i,j=d+n>j?d+n:j}var p=this.boundsPadding;this.bounds=new b.Rectangle(g-p,i-p,h-g+2*p,j-i+2*p)},b.Graphics.prototype._generateCachedSprite=function(){var a=this.getLocalBounds();if(this._cachedSprite)this._cachedSprite.buffer.resize(a.width,a.height);else{var c=new b.CanvasBuffer(a.width,a.height),d=b.Texture.fromCanvas(c.canvas);this._cachedSprite=new b.Sprite(d),this._cachedSprite.buffer=c,this._cachedSprite.worldTransform=this.worldTransform}this._cachedSprite.anchor.x=-(a.x/a.width),this._cachedSprite.anchor.y=-(a.y/a.height),this._cachedSprite.buffer.context.translate(-a.x,-a.y),b.CanvasGraphics.renderGraphics(this,this._cachedSprite.buffer.context),this._cachedSprite.alpha=this.alpha},b.Graphics.prototype.destroyCachedSprite=function(){this._cachedSprite.texture.destroy(!0),this._cachedSprite=null},b.Graphics.POLY=0,b.Graphics.RECT=1,b.Graphics.CIRC=2,b.Graphics.ELIP=3,b.Graphics.RREC=4,b.Strip=function(a){b.DisplayObjectContainer.call(this),this.texture=a,this.uvs=new b.Float32Array([0,1,1,1,1,0,0,1]),this.verticies=new b.Float32Array([0,0,100,0,100,100,0,100]),this.colors=new b.Float32Array([1,1,1,1]),this.indices=new b.Uint16Array([0,1,2,3]),this.dirty=!0},b.Strip.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Strip.prototype.constructor=b.Strip,b.Strip.prototype._renderWebGL=function(a){!this.visible||this.alpha<=0||(a.spriteBatch.stop(),this._vertexBuffer||this._initWebGL(a),a.shaderManager.setShader(a.shaderManager.stripShader),this._renderStrip(a),a.spriteBatch.start())},b.Strip.prototype._initWebGL=function(a){var b=a.gl;this._vertexBuffer=b.createBuffer(),this._indexBuffer=b.createBuffer(),this._uvBuffer=b.createBuffer(),this._colorBuffer=b.createBuffer(),b.bindBuffer(b.ARRAY_BUFFER,this._vertexBuffer),b.bufferData(b.ARRAY_BUFFER,this.verticies,b.DYNAMIC_DRAW),b.bindBuffer(b.ARRAY_BUFFER,this._uvBuffer),b.bufferData(b.ARRAY_BUFFER,this.uvs,b.STATIC_DRAW),b.bindBuffer(b.ARRAY_BUFFER,this._colorBuffer),b.bufferData(b.ARRAY_BUFFER,this.colors,b.STATIC_DRAW),b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,this._indexBuffer),b.bufferData(b.ELEMENT_ARRAY_BUFFER,this.indices,b.STATIC_DRAW)},b.Strip.prototype._renderStrip=function(a){var c=a.gl,d=a.projection,e=a.offset,f=a.shaderManager.stripShader;c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA),c.uniformMatrix3fv(f.translationMatrix,!1,this.worldTransform.toArray(!0)),c.uniform2f(f.projectionVector,d.x,-d.y),c.uniform2f(f.offsetVector,-e.x,-e.y),c.uniform1f(f.alpha,1),this.dirty?(this.dirty=!1,c.bindBuffer(c.ARRAY_BUFFER,this._vertexBuffer),c.bufferData(c.ARRAY_BUFFER,this.verticies,c.STATIC_DRAW),c.vertexAttribPointer(f.aVertexPosition,2,c.FLOAT,!1,0,0),c.bindBuffer(c.ARRAY_BUFFER,this._uvBuffer),c.bufferData(c.ARRAY_BUFFER,this.uvs,c.STATIC_DRAW),c.vertexAttribPointer(f.aTextureCoord,2,c.FLOAT,!1,0,0),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,this.texture.baseTexture._glTextures[c.id]||b.createWebGLTexture(this.texture.baseTexture,c)),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,this._indexBuffer),c.bufferData(c.ELEMENT_ARRAY_BUFFER,this.indices,c.STATIC_DRAW)):(c.bindBuffer(c.ARRAY_BUFFER,this._vertexBuffer),c.bufferSubData(c.ARRAY_BUFFER,0,this.verticies),c.vertexAttribPointer(f.aVertexPosition,2,c.FLOAT,!1,0,0),c.bindBuffer(c.ARRAY_BUFFER,this._uvBuffer),c.vertexAttribPointer(f.aTextureCoord,2,c.FLOAT,!1,0,0),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,this.texture.baseTexture._glTextures[c.id]||b.createWebGLTexture(this.texture.baseTexture,c)),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,this._indexBuffer)),c.drawElements(c.TRIANGLE_STRIP,this.indices.length,c.UNSIGNED_SHORT,0)},b.Strip.prototype._renderCanvas=function(a){var b=a.context,c=this.worldTransform;a.roundPixels?b.setTransform(c.a,c.c,c.b,c.d,0|c.tx,0|c.ty):b.setTransform(c.a,c.c,c.b,c.d,c.tx,c.ty);var d=this,e=d.verticies,f=d.uvs,g=e.length/2;this.count++;for(var h=0;g-2>h;h++){var i=2*h,j=e[i],k=e[i+2],l=e[i+4],m=e[i+1],n=e[i+3],o=e[i+5],p=(j+k+l)/3,q=(m+n+o)/3,r=j-p,s=m-q,t=Math.sqrt(r*r+s*s);j=p+r/t*(t+3),m=q+s/t*(t+3),r=k-p,s=n-q,t=Math.sqrt(r*r+s*s),k=p+r/t*(t+3),n=q+s/t*(t+3),r=l-p,s=o-q,t=Math.sqrt(r*r+s*s),l=p+r/t*(t+3),o=q+s/t*(t+3);var u=f[i]*d.texture.width,v=f[i+2]*d.texture.width,w=f[i+4]*d.texture.width,x=f[i+1]*d.texture.height,y=f[i+3]*d.texture.height,z=f[i+5]*d.texture.height;b.save(),b.beginPath(),b.moveTo(j,m),b.lineTo(k,n),b.lineTo(l,o),b.closePath(),b.clip();var A=u*y+x*w+v*z-y*w-x*v-u*z,B=j*y+x*l+k*z-y*l-x*k-j*z,C=u*k+j*w+v*l-k*w-j*v-u*l,D=u*y*l+x*k*w+j*v*z-j*y*w-x*v*l-u*k*z,E=m*y+x*o+n*z-y*o-x*n-m*z,F=u*n+m*w+v*o-n*w-m*v-u*o,G=u*y*o+x*n*w+m*v*z-m*y*w-x*v*o-u*n*z;b.transform(B/A,E/A,C/A,F/A,D/A,G/A),b.drawImage(d.texture.baseTexture.source,0,0),b.restore()}},b.Strip.prototype.onTextureUpdate=function(){this.updateFrame=!0},b.Rope=function(a,c){b.Strip.call(this,a),this.points=c,this.verticies=new b.Float32Array(4*c.length),this.uvs=new b.Float32Array(4*c.length),this.colors=new b.Float32Array(2*c.length),this.indices=new b.Uint16Array(2*c.length),this.refresh()},b.Rope.prototype=Object.create(b.Strip.prototype),b.Rope.prototype.constructor=b.Rope,b.Rope.prototype.refresh=function(){var a=this.points;if(!(a.length<1)){var b=this.uvs,c=a[0],d=this.indices,e=this.colors;this.count-=.2,b[0]=0,b[1]=0,b[2]=0,b[3]=1,e[0]=1,e[1]=1,d[0]=0,d[1]=1;for(var f,g,h,i=a.length,j=1;i>j;j++)f=a[j],g=4*j,h=j/(i-1),j%2?(b[g]=h,b[g+1]=0,b[g+2]=h,b[g+3]=1):(b[g]=h,b[g+1]=0,b[g+2]=h,b[g+3]=1),g=2*j,e[g]=1,e[g+1]=1,g=2*j,d[g]=g,d[g+1]=g+1,c=f}},b.Rope.prototype.updateTransform=function(){var a=this.points;if(!(a.length<1)){var c,d=a[0],e={x:0,y:0};this.count-=.2;for(var f,g,h,i,j,k=this.verticies,l=a.length,m=0;l>m;m++)f=a[m],g=4*m,c=m<a.length-1?a[m+1]:f,e.y=-(c.x-d.x),e.x=c.y-d.y,h=10*(1-m/(l-1)),h>1&&(h=1),i=Math.sqrt(e.x*e.x+e.y*e.y),j=this.texture.height/2,e.x/=i,e.y/=i,e.x*=j,e.y*=j,k[g]=f.x+e.x,k[g+1]=f.y+e.y,k[g+2]=f.x-e.x,k[g+3]=f.y-e.y,d=f;b.DisplayObjectContainer.prototype.updateTransform.call(this)}},b.Rope.prototype.setTexture=function(a){this.texture=a},b.TilingSprite=function(a,c,d){b.Sprite.call(this,a),this._width=c||100,this._height=d||100,this.tileScale=new b.Point(1,1),this.tileScaleOffset=new b.Point(1,1),this.tilePosition=new b.Point(0,0),this.renderable=!0,this.tint=16777215,this.blendMode=b.blendModes.NORMAL},b.TilingSprite.prototype=Object.create(b.Sprite.prototype),b.TilingSprite.prototype.constructor=b.TilingSprite,Object.defineProperty(b.TilingSprite.prototype,"width",{get:function(){return this._width},set:function(a){this._width=a}}),Object.defineProperty(b.TilingSprite.prototype,"height",{get:function(){return this._height},set:function(a){this._height=a}}),b.TilingSprite.prototype.setTexture=function(a){this.texture!==a&&(this.texture=a,this.refreshTexture=!0,this.cachedTint=16777215)},b.TilingSprite.prototype._renderWebGL=function(a){if(this.visible!==!1&&0!==this.alpha){var c,d;for(this._mask&&(a.spriteBatch.stop(),a.maskManager.pushMask(this.mask,a),a.spriteBatch.start()),this._filters&&(a.spriteBatch.flush(),a.filterManager.pushFilter(this._filterBlock)),!this.tilingTexture||this.refreshTexture?(this.generateTilingTexture(!0),this.tilingTexture&&this.tilingTexture.needsUpdate&&(b.updateWebGLTexture(this.tilingTexture.baseTexture,a.gl),this.tilingTexture.needsUpdate=!1)):a.spriteBatch.renderTilingSprite(this),c=0,d=this.children.length;d>c;c++)this.children[c]._renderWebGL(a);a.spriteBatch.stop(),this._filters&&a.filterManager.popFilter(),this._mask&&a.maskManager.popMask(a),a.spriteBatch.start()}},b.TilingSprite.prototype._renderCanvas=function(a){if(this.visible!==!1&&0!==this.alpha){var c=a.context;this._mask&&a.maskManager.pushMask(this._mask,c),c.globalAlpha=this.worldAlpha;var d,e,f=this.worldTransform;if(c.setTransform(f.a,f.c,f.b,f.d,f.tx,f.ty),!this.__tilePattern||this.refreshTexture){if(this.generateTilingTexture(!1),!this.tilingTexture)return;this.__tilePattern=c.createPattern(this.tilingTexture.baseTexture.source,"repeat")}this.blendMode!==a.currentBlendMode&&(a.currentBlendMode=this.blendMode,c.globalCompositeOperation=b.blendModesCanvas[a.currentBlendMode]);var g=this.tilePosition,h=this.tileScale;for(g.x%=this.tilingTexture.baseTexture.width,g.y%=this.tilingTexture.baseTexture.height,c.scale(h.x,h.y),c.translate(g.x,g.y),c.fillStyle=this.__tilePattern,c.fillRect(-g.x+this.anchor.x*-this._width,-g.y+this.anchor.y*-this._height,this._width/h.x,this._height/h.y),c.scale(1/h.x,1/h.y),c.translate(-g.x,-g.y),this._mask&&a.maskManager.popMask(a.context),d=0,e=this.children.length;e>d;d++)this.children[d]._renderCanvas(a)}},b.TilingSprite.prototype.getBounds=function(){var a=this._width,b=this._height,c=a*(1-this.anchor.x),d=a*-this.anchor.x,e=b*(1-this.anchor.y),f=b*-this.anchor.y,g=this.worldTransform,h=g.a,i=g.c,j=g.b,k=g.d,l=g.tx,m=g.ty,n=h*d+j*f+l,o=k*f+i*d+m,p=h*c+j*f+l,q=k*f+i*c+m,r=h*c+j*e+l,s=k*e+i*c+m,t=h*d+j*e+l,u=k*e+i*d+m,v=-1/0,w=-1/0,x=1/0,y=1/0;x=x>n?n:x,x=x>p?p:x,x=x>r?r:x,x=x>t?t:x,y=y>o?o:y,y=y>q?q:y,y=y>s?s:y,y=y>u?u:y,v=n>v?n:v,v=p>v?p:v,v=r>v?r:v,v=t>v?t:v,w=o>w?o:w,w=q>w?q:w,w=s>w?s:w,w=u>w?u:w;var z=this._bounds;return z.x=x,z.width=v-x,z.y=y,z.height=w-y,this._currentBounds=z,z},b.TilingSprite.prototype.onTextureUpdate=function(){},b.TilingSprite.prototype.generateTilingTexture=function(a){if(this.texture.baseTexture.hasLoaded){var c,d,e=this.texture,f=e.frame,g=f.width!==e.baseTexture.width||f.height!==e.baseTexture.height,h=!1;if(a?(c=b.getNextPowerOfTwo(f.width),d=b.getNextPowerOfTwo(f.height),(f.width!==c||f.height!==d)&&(h=!0)):g&&(c=f.width,d=f.height,h=!0),h){var i;this.tilingTexture&&this.tilingTexture.isTiling?(i=this.tilingTexture.canvasBuffer,i.resize(c,d),this.tilingTexture.baseTexture.width=c,this.tilingTexture.baseTexture.height=d,this.tilingTexture.needsUpdate=!0):(i=new b.CanvasBuffer(c,d),this.tilingTexture=b.Texture.fromCanvas(i.canvas),this.tilingTexture.canvasBuffer=i,this.tilingTexture.isTiling=!0),i.context.drawImage(e.baseTexture.source,e.crop.x,e.crop.y,e.crop.width,e.crop.height,0,0,c,d),this.tileScaleOffset.x=f.width/c,this.tileScaleOffset.y=f.height/d}else this.tilingTexture&&this.tilingTexture.isTiling&&this.tilingTexture.destroy(!0),this.tileScaleOffset.x=1,this.tileScaleOffset.y=1,this.tilingTexture=e;this.refreshTexture=!1,this.tilingTexture.baseTexture._powerOf2=!0}};var f={};f.BoneData=function(a,b){this.name=a,this.parent=b},f.BoneData.prototype={length:0,x:0,y:0,rotation:0,scaleX:1,scaleY:1},f.SlotData=function(a,b){this.name=a,this.boneData=b},f.SlotData.prototype={r:1,g:1,b:1,a:1,attachmentName:null},f.Bone=function(a,b){this.data=a,this.parent=b,this.setToSetupPose()},f.Bone.yDown=!1,f.Bone.prototype={x:0,y:0,rotation:0,scaleX:1,scaleY:1,m00:0,m01:0,worldX:0,m10:0,m11:0,worldY:0,worldRotation:0,worldScaleX:1,worldScaleY:1,updateWorldTransform:function(a,b){var c=this.parent;null!=c?(this.worldX=this.x*c.m00+this.y*c.m01+c.worldX,this.worldY=this.x*c.m10+this.y*c.m11+c.worldY,this.worldScaleX=c.worldScaleX*this.scaleX,this.worldScaleY=c.worldScaleY*this.scaleY,this.worldRotation=c.worldRotation+this.rotation):(this.worldX=this.x,this.worldY=this.y,this.worldScaleX=this.scaleX,this.worldScaleY=this.scaleY,this.worldRotation=this.rotation);var d=this.worldRotation*Math.PI/180,e=Math.cos(d),g=Math.sin(d);this.m00=e*this.worldScaleX,this.m10=g*this.worldScaleX,this.m01=-g*this.worldScaleY,this.m11=e*this.worldScaleY,a&&(this.m00=-this.m00,this.m01=-this.m01),b&&(this.m10=-this.m10,this.m11=-this.m11),f.Bone.yDown&&(this.m10=-this.m10,this.m11=-this.m11)},setToSetupPose:function(){var a=this.data;this.x=a.x,this.y=a.y,this.rotation=a.rotation,this.scaleX=a.scaleX,this.scaleY=a.scaleY}},f.Slot=function(a,b,c){this.data=a,this.skeleton=b,this.bone=c,this.setToSetupPose()},f.Slot.prototype={r:1,g:1,b:1,a:1,_attachmentTime:0,attachment:null,setAttachment:function(a){this.attachment=a,this._attachmentTime=this.skeleton.time},setAttachmentTime:function(a){this._attachmentTime=this.skeleton.time-a},getAttachmentTime:function(){return this.skeleton.time-this._attachmentTime},setToSetupPose:function(){var a=this.data;this.r=a.r,this.g=a.g,this.b=a.b,this.a=a.a;for(var b=this.skeleton.data.slots,c=0,d=b.length;d>c;c++)if(b[c]==a){this.setAttachment(a.attachmentName?this.skeleton.getAttachmentBySlotIndex(c,a.attachmentName):null);break}}},f.Skin=function(a){this.name=a,this.attachments={}},f.Skin.prototype={addAttachment:function(a,b,c){this.attachments[a+":"+b]=c},getAttachment:function(a,b){return this.attachments[a+":"+b]},_attachAll:function(a,b){for(var c in b.attachments){var d=c.indexOf(":"),e=parseInt(c.substring(0,d),10),f=c.substring(d+1),g=a.slots[e];if(g.attachment&&g.attachment.name==f){var h=this.getAttachment(e,f);h&&g.setAttachment(h)}}}},f.Animation=function(a,b,c){this.name=a,this.timelines=b,this.duration=c},f.Animation.prototype={apply:function(a,b,c){c&&this.duration&&(b%=this.duration);for(var d=this.timelines,e=0,f=d.length;f>e;e++)d[e].apply(a,b,1)},mix:function(a,b,c,d){c&&this.duration&&(b%=this.duration);for(var e=this.timelines,f=0,g=e.length;g>f;f++)e[f].apply(a,b,d)}},f.binarySearch=function(a,b,c){var d=0,e=Math.floor(a.length/c)-2;if(!e)return c;for(var f=e>>>1;;){if(a[(f+1)*c]<=b?d=f+1:e=f,d==e)return(d+1)*c;f=d+e>>>1}},f.linearSearch=function(a,b,c){for(var d=0,e=a.length-c;e>=d;d+=c)if(a[d]>b)return d;return-1},f.Curves=function(a){this.curves=[],this.curves.length=6*(a-1)},f.Curves.prototype={setLinear:function(a){this.curves[6*a]=0},setStepped:function(a){this.curves[6*a]=-1},setCurve:function(a,b,c,d,e){var f=.1,g=f*f,h=g*f,i=3*f,j=3*g,k=6*g,l=6*h,m=2*-b+d,n=2*-c+e,o=3*(b-d)+1,p=3*(c-e)+1,q=6*a,r=this.curves;r[q]=b*i+m*j+o*h,r[q+1]=c*i+n*j+p*h,r[q+2]=m*k+o*l,r[q+3]=n*k+p*l,r[q+4]=o*l,r[q+5]=p*l},getCurvePercent:function(a,b){b=0>b?0:b>1?1:b;var c=6*a,d=this.curves,e=d[c];if(!e)return b;if(-1==e)return 0;for(var f=d[c+1],g=d[c+2],h=d[c+3],i=d[c+4],j=d[c+5],k=e,l=f,m=8;;){if(k>=b){var n=k-e,o=l-f;return o+(l-o)*(b-n)/(k-n)}if(!m)break;m--,e+=g,f+=h,g+=i,h+=j,k+=e,l+=f}return l+(1-l)*(b-k)/(1-k)}},f.RotateTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=2*a},f.RotateTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/2},setFrame:function(a,b,c){a*=2,this.frames[a]=b,this.frames[a+1]=c},apply:function(a,b,c){var d,e=this.frames;if(!(b<e[0])){var g=a.bones[this.boneIndex];if(b>=e[e.length-2]){for(d=g.data.rotation+e[e.length-1]-g.rotation;d>180;)d-=360;for(;-180>d;)d+=360;return g.rotation+=d*c,void 0}var h=f.binarySearch(e,b,2),i=e[h-1],j=e[h],k=1-(b-j)/(e[h-2]-j);for(k=this.curves.getCurvePercent(h/2-1,k),d=e[h+1]-i;d>180;)d-=360;for(;-180>d;)d+=360;for(d=g.data.rotation+(i+d*k)-g.rotation;d>180;)d-=360;for(;-180>d;)d+=360;g.rotation+=d*c}}},f.TranslateTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=3*a},f.TranslateTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/3},setFrame:function(a,b,c,d){a*=3,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.bones[this.boneIndex];if(b>=d[d.length-3])return e.x+=(e.data.x+d[d.length-2]-e.x)*c,e.y+=(e.data.y+d[d.length-1]-e.y)*c,void 0;var g=f.binarySearch(d,b,3),h=d[g-2],i=d[g-1],j=d[g],k=1-(b-j)/(d[g+-3]-j);k=this.curves.getCurvePercent(g/3-1,k),e.x+=(e.data.x+h+(d[g+1]-h)*k-e.x)*c,e.y+=(e.data.y+i+(d[g+2]-i)*k-e.y)*c}}},f.ScaleTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=3*a},f.ScaleTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/3},setFrame:function(a,b,c,d){a*=3,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.bones[this.boneIndex];if(b>=d[d.length-3])return e.scaleX+=(e.data.scaleX-1+d[d.length-2]-e.scaleX)*c,e.scaleY+=(e.data.scaleY-1+d[d.length-1]-e.scaleY)*c,void 0;var g=f.binarySearch(d,b,3),h=d[g-2],i=d[g-1],j=d[g],k=1-(b-j)/(d[g+-3]-j);k=this.curves.getCurvePercent(g/3-1,k),e.scaleX+=(e.data.scaleX-1+h+(d[g+1]-h)*k-e.scaleX)*c,e.scaleY+=(e.data.scaleY-1+i+(d[g+2]-i)*k-e.scaleY)*c}}},f.ColorTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=5*a},f.ColorTimeline.prototype={slotIndex:0,getFrameCount:function(){return this.frames.length/5},setFrame:function(a,b,c,d,e,f){a*=5,this.frames[a]=b,this.frames[a+1]=c,this.frames[a+2]=d,this.frames[a+3]=e,this.frames[a+4]=f},apply:function(a,b,c){var d=this.frames;if(!(b<d[0])){var e=a.slots[this.slotIndex];if(b>=d[d.length-5]){var g=d.length-1;return e.r=d[g-3],e.g=d[g-2],e.b=d[g-1],e.a=d[g],void 0}var h=f.binarySearch(d,b,5),i=d[h-4],j=d[h-3],k=d[h-2],l=d[h-1],m=d[h],n=1-(b-m)/(d[h-5]-m);n=this.curves.getCurvePercent(h/5-1,n);var o=i+(d[h+1]-i)*n,p=j+(d[h+2]-j)*n,q=k+(d[h+3]-k)*n,r=l+(d[h+4]-l)*n;1>c?(e.r+=(o-e.r)*c,e.g+=(p-e.g)*c,e.b+=(q-e.b)*c,e.a+=(r-e.a)*c):(e.r=o,e.g=p,e.b=q,e.a=r)}}},f.AttachmentTimeline=function(a){this.curves=new f.Curves(a),this.frames=[],this.frames.length=a,this.attachmentNames=[],this.attachmentNames.length=a},f.AttachmentTimeline.prototype={slotIndex:0,getFrameCount:function(){return this.frames.length},setFrame:function(a,b,c){this.frames[a]=b,this.attachmentNames[a]=c},apply:function(a,b){var c=this.frames;if(!(b<c[0])){var d;d=b>=c[c.length-1]?c.length-1:f.binarySearch(c,b,1)-1;var e=this.attachmentNames[d];a.slots[this.slotIndex].setAttachment(e?a.getAttachmentBySlotIndex(this.slotIndex,e):null)}}},f.SkeletonData=function(){this.bones=[],this.slots=[],this.skins=[],this.animations=[]},f.SkeletonData.prototype={defaultSkin:null,findBone:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},findBoneIndex:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].name==a)return c;return-1},findSlot:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].name==a)return slot[c];return null},findSlotIndex:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].name==a)return c;return-1},findSkin:function(a){for(var b=this.skins,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},findAnimation:function(a){for(var b=this.animations,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null}},f.Skeleton=function(a){this.data=a,this.bones=[];
for(var b=0,c=a.bones.length;c>b;b++){var d=a.bones[b],e=d.parent?this.bones[a.bones.indexOf(d.parent)]:null;this.bones.push(new f.Bone(d,e))}for(this.slots=[],this.drawOrder=[],b=0,c=a.slots.length;c>b;b++){var g=a.slots[b],h=this.bones[a.bones.indexOf(g.boneData)],i=new f.Slot(g,this,h);this.slots.push(i),this.drawOrder.push(i)}},f.Skeleton.prototype={x:0,y:0,skin:null,r:1,g:1,b:1,a:1,time:0,flipX:!1,flipY:!1,updateWorldTransform:function(){for(var a=this.flipX,b=this.flipY,c=this.bones,d=0,e=c.length;e>d;d++)c[d].updateWorldTransform(a,b)},setToSetupPose:function(){this.setBonesToSetupPose(),this.setSlotsToSetupPose()},setBonesToSetupPose:function(){for(var a=this.bones,b=0,c=a.length;c>b;b++)a[b].setToSetupPose()},setSlotsToSetupPose:function(){for(var a=this.slots,b=0,c=a.length;c>b;b++)a[b].setToSetupPose(b)},getRootBone:function(){return this.bones.length?this.bones[0]:null},findBone:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return b[c];return null},findBoneIndex:function(a){for(var b=this.bones,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return c;return-1},findSlot:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return b[c];return null},findSlotIndex:function(a){for(var b=this.slots,c=0,d=b.length;d>c;c++)if(b[c].data.name==a)return c;return-1},setSkinByName:function(a){var b=this.data.findSkin(a);if(!b)throw"Skin not found: "+a;this.setSkin(b)},setSkin:function(a){this.skin&&a&&a._attachAll(this,this.skin),this.skin=a},getAttachmentBySlotName:function(a,b){return this.getAttachmentBySlotIndex(this.data.findSlotIndex(a),b)},getAttachmentBySlotIndex:function(a,b){if(this.skin){var c=this.skin.getAttachment(a,b);if(c)return c}return this.data.defaultSkin?this.data.defaultSkin.getAttachment(a,b):null},setAttachment:function(a,b){for(var c=this.slots,d=0,e=c.size;e>d;d++){var f=c[d];if(f.data.name==a){var g=null;if(b&&(g=this.getAttachment(d,b),null==g))throw"Attachment not found: "+b+", for slot: "+a;return f.setAttachment(g),void 0}}throw"Slot not found: "+a},update:function(a){time+=a}},f.AttachmentType={region:0},f.RegionAttachment=function(){this.offset=[],this.offset.length=8,this.uvs=[],this.uvs.length=8},f.RegionAttachment.prototype={x:0,y:0,rotation:0,scaleX:1,scaleY:1,width:0,height:0,rendererObject:null,regionOffsetX:0,regionOffsetY:0,regionWidth:0,regionHeight:0,regionOriginalWidth:0,regionOriginalHeight:0,setUVs:function(a,b,c,d,e){var f=this.uvs;e?(f[2]=a,f[3]=d,f[4]=a,f[5]=b,f[6]=c,f[7]=b,f[0]=c,f[1]=d):(f[0]=a,f[1]=d,f[2]=a,f[3]=b,f[4]=c,f[5]=b,f[6]=c,f[7]=d)},updateOffset:function(){var a=this.width/this.regionOriginalWidth*this.scaleX,b=this.height/this.regionOriginalHeight*this.scaleY,c=-this.width/2*this.scaleX+this.regionOffsetX*a,d=-this.height/2*this.scaleY+this.regionOffsetY*b,e=c+this.regionWidth*a,f=d+this.regionHeight*b,g=this.rotation*Math.PI/180,h=Math.cos(g),i=Math.sin(g),j=c*h+this.x,k=c*i,l=d*h+this.y,m=d*i,n=e*h+this.x,o=e*i,p=f*h+this.y,q=f*i,r=this.offset;r[0]=j-m,r[1]=l+k,r[2]=j-q,r[3]=p+k,r[4]=n-q,r[5]=p+o,r[6]=n-m,r[7]=l+o},computeVertices:function(a,b,c,d){a+=c.worldX,b+=c.worldY;var e=c.m00,f=c.m01,g=c.m10,h=c.m11,i=this.offset;d[0]=i[0]*e+i[1]*f+a,d[1]=i[0]*g+i[1]*h+b,d[2]=i[2]*e+i[3]*f+a,d[3]=i[2]*g+i[3]*h+b,d[4]=i[4]*e+i[5]*f+a,d[5]=i[4]*g+i[5]*h+b,d[6]=i[6]*e+i[7]*f+a,d[7]=i[6]*g+i[7]*h+b}},f.AnimationStateData=function(a){this.skeletonData=a,this.animationToMixTime={}},f.AnimationStateData.prototype={defaultMix:0,setMixByName:function(a,b,c){var d=this.skeletonData.findAnimation(a);if(!d)throw"Animation not found: "+a;var e=this.skeletonData.findAnimation(b);if(!e)throw"Animation not found: "+b;this.setMix(d,e,c)},setMix:function(a,b,c){this.animationToMixTime[a.name+":"+b.name]=c},getMix:function(a,b){var c=this.animationToMixTime[a.name+":"+b.name];return c?c:this.defaultMix}},f.AnimationState=function(a){this.data=a,this.queue=[]},f.AnimationState.prototype={animationSpeed:1,current:null,previous:null,currentTime:0,previousTime:0,currentLoop:!1,previousLoop:!1,mixTime:0,mixDuration:0,update:function(a){if(this.currentTime+=a*this.animationSpeed,this.previousTime+=a,this.mixTime+=a,this.queue.length>0){var b=this.queue[0];this.currentTime>=b.delay&&(this._setAnimation(b.animation,b.loop),this.queue.shift())}},apply:function(a){if(this.current)if(this.previous){this.previous.apply(a,this.previousTime,this.previousLoop);var b=this.mixTime/this.mixDuration;b>=1&&(b=1,this.previous=null),this.current.mix(a,this.currentTime,this.currentLoop,b)}else this.current.apply(a,this.currentTime,this.currentLoop)},clearAnimation:function(){this.previous=null,this.current=null,this.queue.length=0},_setAnimation:function(a,b){this.previous=null,a&&this.current&&(this.mixDuration=this.data.getMix(this.current,a),this.mixDuration>0&&(this.mixTime=0,this.previous=this.current,this.previousTime=this.currentTime,this.previousLoop=this.currentLoop)),this.current=a,this.currentLoop=b,this.currentTime=0},setAnimationByName:function(a,b){var c=this.data.skeletonData.findAnimation(a);if(!c)throw"Animation not found: "+a;this.setAnimation(c,b)},setAnimation:function(a,b){this.queue.length=0,this._setAnimation(a,b)},addAnimationByName:function(a,b,c){var d=this.data.skeletonData.findAnimation(a);if(!d)throw"Animation not found: "+a;this.addAnimation(d,b,c)},addAnimation:function(a,b,c){var d={};if(d.animation=a,d.loop=b,!c||0>=c){var e=this.queue.length?this.queue[this.queue.length-1].animation:this.current;c=null!=e?e.duration-this.data.getMix(e,a)+(c||0):0}d.delay=c,this.queue.push(d)},isComplete:function(){return!this.current||this.currentTime>=this.current.duration}},f.SkeletonJson=function(a){this.attachmentLoader=a},f.SkeletonJson.prototype={scale:1,readSkeletonData:function(a){for(var b,c=new f.SkeletonData,d=a.bones,e=0,g=d.length;g>e;e++){var h=d[e],i=null;if(h.parent&&(i=c.findBone(h.parent),!i))throw"Parent bone not found: "+h.parent;b=new f.BoneData(h.name,i),b.length=(h.length||0)*this.scale,b.x=(h.x||0)*this.scale,b.y=(h.y||0)*this.scale,b.rotation=h.rotation||0,b.scaleX=h.scaleX||1,b.scaleY=h.scaleY||1,c.bones.push(b)}var j=a.slots;for(e=0,g=j.length;g>e;e++){var k=j[e];if(b=c.findBone(k.bone),!b)throw"Slot bone not found: "+k.bone;var l=new f.SlotData(k.name,b),m=k.color;m&&(l.r=f.SkeletonJson.toColor(m,0),l.g=f.SkeletonJson.toColor(m,1),l.b=f.SkeletonJson.toColor(m,2),l.a=f.SkeletonJson.toColor(m,3)),l.attachmentName=k.attachment,c.slots.push(l)}var n=a.skins;for(var o in n)if(n.hasOwnProperty(o)){var p=n[o],q=new f.Skin(o);for(var r in p)if(p.hasOwnProperty(r)){var s=c.findSlotIndex(r),t=p[r];for(var u in t)if(t.hasOwnProperty(u)){var v=this.readAttachment(q,u,t[u]);null!=v&&q.addAttachment(s,u,v)}}c.skins.push(q),"default"==q.name&&(c.defaultSkin=q)}var w=a.animations;for(var x in w)w.hasOwnProperty(x)&&this.readAnimation(x,w[x],c);return c},readAttachment:function(a,b,c){b=c.name||b;var d=f.AttachmentType[c.type||"region"];if(d==f.AttachmentType.region){var e=new f.RegionAttachment;return e.x=(c.x||0)*this.scale,e.y=(c.y||0)*this.scale,e.scaleX=c.scaleX||1,e.scaleY=c.scaleY||1,e.rotation=c.rotation||0,e.width=(c.width||32)*this.scale,e.height=(c.height||32)*this.scale,e.updateOffset(),e.rendererObject={},e.rendererObject.name=b,e.rendererObject.scale={},e.rendererObject.scale.x=e.scaleX,e.rendererObject.scale.y=e.scaleY,e.rendererObject.rotation=-e.rotation*Math.PI/180,e}throw"Unknown attachment type: "+d},readAnimation:function(a,b,c){var d,e,g,h,i,j,k,l=[],m=0,n=b.bones;for(var o in n)if(n.hasOwnProperty(o)){var p=c.findBoneIndex(o);if(-1==p)throw"Bone not found: "+o;var q=n[o];for(g in q)if(q.hasOwnProperty(g))if(i=q[g],"rotate"==g){for(e=new f.RotateTimeline(i.length),e.boneIndex=p,d=0,j=0,k=i.length;k>j;j++)h=i[j],e.setFrame(d,h.time,h.angle),f.SkeletonJson.readCurve(e,d,h),d++;l.push(e),m=Math.max(m,e.frames[2*e.getFrameCount()-2])}else{if("translate"!=g&&"scale"!=g)throw"Invalid timeline type for a bone: "+g+" ("+o+")";var r=1;for("scale"==g?e=new f.ScaleTimeline(i.length):(e=new f.TranslateTimeline(i.length),r=this.scale),e.boneIndex=p,d=0,j=0,k=i.length;k>j;j++){h=i[j];var s=(h.x||0)*r,t=(h.y||0)*r;e.setFrame(d,h.time,s,t),f.SkeletonJson.readCurve(e,d,h),d++}l.push(e),m=Math.max(m,e.frames[3*e.getFrameCount()-3])}}var u=b.slots;for(var v in u)if(u.hasOwnProperty(v)){var w=u[v],x=c.findSlotIndex(v);for(g in w)if(w.hasOwnProperty(g))if(i=w[g],"color"==g){for(e=new f.ColorTimeline(i.length),e.slotIndex=x,d=0,j=0,k=i.length;k>j;j++){h=i[j];var y=h.color,z=f.SkeletonJson.toColor(y,0),A=f.SkeletonJson.toColor(y,1),B=f.SkeletonJson.toColor(y,2),C=f.SkeletonJson.toColor(y,3);e.setFrame(d,h.time,z,A,B,C),f.SkeletonJson.readCurve(e,d,h),d++}l.push(e),m=Math.max(m,e.frames[5*e.getFrameCount()-5])}else{if("attachment"!=g)throw"Invalid timeline type for a slot: "+g+" ("+v+")";for(e=new f.AttachmentTimeline(i.length),e.slotIndex=x,d=0,j=0,k=i.length;k>j;j++)h=i[j],e.setFrame(d++,h.time,h.name);l.push(e),m=Math.max(m,e.frames[e.getFrameCount()-1])}}c.animations.push(new f.Animation(a,l,m))}},f.SkeletonJson.readCurve=function(a,b,c){var d=c.curve;d&&("stepped"==d?a.curves.setStepped(b):d instanceof Array&&a.curves.setCurve(b,d[0],d[1],d[2],d[3]))},f.SkeletonJson.toColor=function(a,b){if(8!=a.length)throw"Color hexidecimal length must be 8, recieved: "+a;return parseInt(a.substr(2*b,2),16)/255},f.Atlas=function(a,b){this.textureLoader=b,this.pages=[],this.regions=[];var c=new f.AtlasReader(a),d=[];d.length=4;for(var e=null;;){var g=c.readLine();if(null==g)break;if(g=c.trim(g),g.length)if(e){var h=new f.AtlasRegion;h.name=g,h.page=e,h.rotate="true"==c.readValue(),c.readTuple(d);var i=parseInt(d[0],10),j=parseInt(d[1],10);c.readTuple(d);var k=parseInt(d[0],10),l=parseInt(d[1],10);h.u=i/e.width,h.v=j/e.height,h.rotate?(h.u2=(i+l)/e.width,h.v2=(j+k)/e.height):(h.u2=(i+k)/e.width,h.v2=(j+l)/e.height),h.x=i,h.y=j,h.width=Math.abs(k),h.height=Math.abs(l),4==c.readTuple(d)&&(h.splits=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10),parseInt(d[3],10)],4==c.readTuple(d)&&(h.pads=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10),parseInt(d[3],10)],c.readTuple(d))),h.originalWidth=parseInt(d[0],10),h.originalHeight=parseInt(d[1],10),c.readTuple(d),h.offsetX=parseInt(d[0],10),h.offsetY=parseInt(d[1],10),h.index=parseInt(c.readValue(),10),this.regions.push(h)}else{e=new f.AtlasPage,e.name=g,e.format=f.Atlas.Format[c.readValue()],c.readTuple(d),e.minFilter=f.Atlas.TextureFilter[d[0]],e.magFilter=f.Atlas.TextureFilter[d[1]];var m=c.readValue();e.uWrap=f.Atlas.TextureWrap.clampToEdge,e.vWrap=f.Atlas.TextureWrap.clampToEdge,"x"==m?e.uWrap=f.Atlas.TextureWrap.repeat:"y"==m?e.vWrap=f.Atlas.TextureWrap.repeat:"xy"==m&&(e.uWrap=e.vWrap=f.Atlas.TextureWrap.repeat),b.load(e,g),this.pages.push(e)}else e=null}},f.Atlas.prototype={findRegion:function(a){for(var b=this.regions,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},dispose:function(){for(var a=this.pages,b=0,c=a.length;c>b;b++)this.textureLoader.unload(a[b].rendererObject)},updateUVs:function(a){for(var b=this.regions,c=0,d=b.length;d>c;c++){var e=b[c];e.page==a&&(e.u=e.x/a.width,e.v=e.y/a.height,e.rotate?(e.u2=(e.x+e.height)/a.width,e.v2=(e.y+e.width)/a.height):(e.u2=(e.x+e.width)/a.width,e.v2=(e.y+e.height)/a.height))}}},f.Atlas.Format={alpha:0,intensity:1,luminanceAlpha:2,rgb565:3,rgba4444:4,rgb888:5,rgba8888:6},f.Atlas.TextureFilter={nearest:0,linear:1,mipMap:2,mipMapNearestNearest:3,mipMapLinearNearest:4,mipMapNearestLinear:5,mipMapLinearLinear:6},f.Atlas.TextureWrap={mirroredRepeat:0,clampToEdge:1,repeat:2},f.AtlasPage=function(){},f.AtlasPage.prototype={name:null,format:null,minFilter:null,magFilter:null,uWrap:null,vWrap:null,rendererObject:null,width:0,height:0},f.AtlasRegion=function(){},f.AtlasRegion.prototype={page:null,name:null,x:0,y:0,width:0,height:0,u:0,v:0,u2:0,v2:0,offsetX:0,offsetY:0,originalWidth:0,originalHeight:0,index:0,rotate:!1,splits:null,pads:null},f.AtlasReader=function(a){this.lines=a.split(/\r\n|\r|\n/)},f.AtlasReader.prototype={index:0,trim:function(a){return a.replace(/^\s+|\s+$/g,"")},readLine:function(){return this.index>=this.lines.length?null:this.lines[this.index++]},readValue:function(){var a=this.readLine(),b=a.indexOf(":");if(-1==b)throw"Invalid line: "+a;return this.trim(a.substring(b+1))},readTuple:function(a){var b=this.readLine(),c=b.indexOf(":");if(-1==c)throw"Invalid line: "+b;for(var d=0,e=c+1;3>d;d++){var f=b.indexOf(",",e);if(-1==f){if(!d)throw"Invalid line: "+b;break}a[d]=this.trim(b.substr(e,f-e)),e=f+1}return a[d]=this.trim(b.substring(e)),d+1}},f.AtlasAttachmentLoader=function(a){this.atlas=a},f.AtlasAttachmentLoader.prototype={newAttachment:function(a,b,c){switch(b){case f.AttachmentType.region:var d=this.atlas.findRegion(c);if(!d)throw"Region not found in atlas: "+c+" ("+b+")";var e=new f.RegionAttachment(c);return e.rendererObject=d,e.setUVs(d.u,d.v,d.u2,d.v2,d.rotate),e.regionOffsetX=d.offsetX,e.regionOffsetY=d.offsetY,e.regionWidth=d.width,e.regionHeight=d.height,e.regionOriginalWidth=d.originalWidth,e.regionOriginalHeight=d.originalHeight,e}throw"Unknown attachment type: "+b}},f.Bone.yDown=!0,b.AnimCache={},b.Spine=function(a){if(b.DisplayObjectContainer.call(this),this.spineData=b.AnimCache[a],!this.spineData)throw new Error("Spine data must be preloaded using PIXI.SpineLoader or PIXI.AssetLoader: "+a);this.skeleton=new f.Skeleton(this.spineData),this.skeleton.updateWorldTransform(),this.stateData=new f.AnimationStateData(this.spineData),this.state=new f.AnimationState(this.stateData),this.slotContainers=[];for(var c=0,d=this.skeleton.drawOrder.length;d>c;c++){var e=this.skeleton.drawOrder[c],g=e.attachment,h=new b.DisplayObjectContainer;if(this.slotContainers.push(h),this.addChild(h),g instanceof f.RegionAttachment){var i=g.rendererObject.name,j=this.createSprite(e,g.rendererObject);e.currentSprite=j,e.currentSpriteName=i,h.addChild(j)}}},b.Spine.prototype=Object.create(b.DisplayObjectContainer.prototype),b.Spine.prototype.constructor=b.Spine,b.Spine.prototype.updateTransform=function(){this.lastTime=this.lastTime||Date.now();var a=.001*(Date.now()-this.lastTime);this.lastTime=Date.now(),this.state.update(a),this.state.apply(this.skeleton),this.skeleton.updateWorldTransform();for(var c=this.skeleton.drawOrder,d=0,e=c.length;e>d;d++){var g=c[d],h=g.attachment,i=this.slotContainers[d];if(h instanceof f.RegionAttachment){if(h.rendererObject&&(!g.currentSpriteName||g.currentSpriteName!=h.name)){var j=h.rendererObject.name;if(void 0!==g.currentSprite&&(g.currentSprite.visible=!1),g.sprites=g.sprites||{},void 0!==g.sprites[j])g.sprites[j].visible=!0;else{var k=this.createSprite(g,h.rendererObject);i.addChild(k)}g.currentSprite=g.sprites[j],g.currentSpriteName=j}i.visible=!0;var l=g.bone;i.position.x=l.worldX+h.x*l.m00+h.y*l.m01,i.position.y=l.worldY+h.x*l.m10+h.y*l.m11,i.scale.x=l.worldScaleX,i.scale.y=l.worldScaleY,i.rotation=-(g.bone.worldRotation*Math.PI/180),i.alpha=g.a,g.currentSprite.tint=b.rgb2hex([g.r,g.g,g.b])}else i.visible=!1}b.DisplayObjectContainer.prototype.updateTransform.call(this)},b.Spine.prototype.createSprite=function(a,c){var d=b.TextureCache[c.name]?c.name:c.name+".png",e=new b.Sprite(b.Texture.fromFrame(d));return e.scale=c.scale,e.rotation=c.rotation,e.anchor.x=e.anchor.y=.5,a.sprites=a.sprites||{},a.sprites[c.name]=e,e},b.BaseTextureCache={},b.texturesToUpdate=[],b.texturesToDestroy=[],b.BaseTextureCacheIdGenerator=0,b.BaseTexture=function(a,c){if(b.EventTarget.call(this),this.width=100,this.height=100,this.scaleMode=c||b.scaleModes.DEFAULT,this.hasLoaded=!1,this.source=a,this.id=b.BaseTextureCacheIdGenerator++,this.premultipliedAlpha=!0,this._glTextures=[],this._dirty=[],a){if((this.source.complete||this.source.getContext)&&this.source.width&&this.source.height)this.hasLoaded=!0,this.width=this.source.width,this.height=this.source.height,b.texturesToUpdate.push(this);else{var d=this;this.source.onload=function(){d.hasLoaded=!0,d.width=d.source.width,d.height=d.source.height;for(var a=0;a<d._glTextures.length;a++)d._dirty[a]=!0;d.dispatchEvent({type:"loaded",content:d})},this.source.onerror=function(){d.dispatchEvent({type:"error",content:d})}}this.imageUrl=null,this._powerOf2=!1}},b.BaseTexture.prototype.constructor=b.BaseTexture,b.BaseTexture.prototype.destroy=function(){this.imageUrl?(delete b.BaseTextureCache[this.imageUrl],delete b.TextureCache[this.imageUrl],this.imageUrl=null,this.source.src=null):this.source&&this.source._pixiId&&delete b.BaseTextureCache[this.source._pixiId],this.source=null,b.texturesToDestroy.push(this)},b.BaseTexture.prototype.updateSourceImage=function(a){this.hasLoaded=!1,this.source.src=null,this.source.src=a},b.BaseTexture.fromImage=function(a,c,d){var e=b.BaseTextureCache[a];if(void 0===c&&-1===a.indexOf("data:")&&(c=!0),!e){var f=new Image;c&&(f.crossOrigin=""),f.src=a,e=new b.BaseTexture(f,d),e.imageUrl=a,b.BaseTextureCache[a]=e}return e},b.BaseTexture.fromCanvas=function(a,c){a._pixiId||(a._pixiId="canvas_"+b.TextureCacheIdGenerator++);var d=b.BaseTextureCache[a._pixiId];return d||(d=new b.BaseTexture(a,c),b.BaseTextureCache[a._pixiId]=d),d},b.TextureCache={},b.FrameCache={},b.TextureCacheIdGenerator=0,b.Texture=function(a,c){if(b.EventTarget.call(this),this.noFrame=!1,c||(this.noFrame=!0,c=new b.Rectangle(0,0,1,1)),a instanceof b.Texture&&(a=a.baseTexture),this.baseTexture=a,this.frame=c,this.trim=null,this.valid=!1,this.scope=this,this._uvs=null,this.width=0,this.height=0,this.crop=new b.Rectangle(0,0,1,1),a.hasLoaded)this.noFrame&&(c=new b.Rectangle(0,0,a.width,a.height)),this.setFrame(c);else{var d=this;a.addEventListener("loaded",function(){d.onBaseTextureLoaded()})}},b.Texture.prototype.constructor=b.Texture,b.Texture.prototype.onBaseTextureLoaded=function(){var a=this.baseTexture;a.removeEventListener("loaded",this.onLoaded),this.noFrame&&(this.frame=new b.Rectangle(0,0,a.width,a.height)),this.setFrame(this.frame),this.scope.dispatchEvent({type:"update",content:this})},b.Texture.prototype.destroy=function(a){a&&this.baseTexture.destroy(),this.valid=!1},b.Texture.prototype.setFrame=function(a){if(this.noFrame=!1,this.frame=a,this.width=a.width,this.height=a.height,this.crop.x=a.x,this.crop.y=a.y,this.crop.width=a.width,this.crop.height=a.height,!this.trim&&(a.x+a.width>this.baseTexture.width||a.y+a.height>this.baseTexture.height))throw new Error("Texture Error: frame does not fit inside the base Texture dimensions "+this);this.valid=a&&a.width&&a.height&&this.baseTexture.source&&this.baseTexture.hasLoaded,this.trim&&(this.width=this.trim.width,this.height=this.trim.height,this.frame.width=this.trim.width,this.frame.height=this.trim.height),this.valid&&b.Texture.frameUpdates.push(this)},b.Texture.prototype._updateWebGLuvs=function(){this._uvs||(this._uvs=new b.TextureUvs);var a=this.crop,c=this.baseTexture.width,d=this.baseTexture.height;this._uvs.x0=a.x/c,this._uvs.y0=a.y/d,this._uvs.x1=(a.x+a.width)/c,this._uvs.y1=a.y/d,this._uvs.x2=(a.x+a.width)/c,this._uvs.y2=(a.y+a.height)/d,this._uvs.x3=a.x/c,this._uvs.y3=(a.y+a.height)/d},b.Texture.fromImage=function(a,c,d){var e=b.TextureCache[a];return e||(e=new b.Texture(b.BaseTexture.fromImage(a,c,d)),b.TextureCache[a]=e),e},b.Texture.fromFrame=function(a){var c=b.TextureCache[a];if(!c)throw new Error('The frameId "'+a+'" does not exist in the texture cache ');return c},b.Texture.fromCanvas=function(a,c){var d=b.BaseTexture.fromCanvas(a,c);return new b.Texture(d)},b.Texture.addTextureToCache=function(a,c){b.TextureCache[c]=a},b.Texture.removeTextureFromCache=function(a){var c=b.TextureCache[a];return delete b.TextureCache[a],delete b.BaseTextureCache[a],c},b.Texture.frameUpdates=[],b.TextureUvs=function(){this.x0=0,this.y0=0,this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.x3=0,this.y3=0},b.RenderTexture=function(a,c,d,e){if(b.EventTarget.call(this),this.width=a||100,this.height=c||100,this.frame=new b.Rectangle(0,0,this.width,this.height),this.crop=new b.Rectangle(0,0,this.width,this.height),this.baseTexture=new b.BaseTexture,this.baseTexture.width=this.width,this.baseTexture.height=this.height,this.baseTexture._glTextures=[],this.baseTexture.scaleMode=e||b.scaleModes.DEFAULT,this.baseTexture.hasLoaded=!0,this.renderer=d||b.defaultRenderer,this.renderer.type===b.WEBGL_RENDERER){var f=this.renderer.gl;this.textureBuffer=new b.FilterTexture(f,this.width,this.height,this.baseTexture.scaleMode),this.baseTexture._glTextures[f.id]=this.textureBuffer.texture,this.render=this.renderWebGL,this.projection=new b.Point(this.width/2,-this.height/2)}else this.render=this.renderCanvas,this.textureBuffer=new b.CanvasBuffer(this.width,this.height),this.baseTexture.source=this.textureBuffer.canvas;this.valid=!0,b.Texture.frameUpdates.push(this)},b.RenderTexture.prototype=Object.create(b.Texture.prototype),b.RenderTexture.prototype.constructor=b.RenderTexture,b.RenderTexture.prototype.resize=function(a,c,d){(a!==this.width||c!==this.height)&&(this.width=this.frame.width=this.crop.width=a,this.height=this.frame.height=this.crop.height=c,d&&(this.baseTexture.width=this.width,this.baseTexture.height=this.height),this.renderer.type===b.WEBGL_RENDERER&&(this.projection.x=this.width/2,this.projection.y=-this.height/2),this.textureBuffer.resize(this.width,this.height))},b.RenderTexture.prototype.clear=function(){this.renderer.type===b.WEBGL_RENDERER&&this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER,this.textureBuffer.frameBuffer),this.textureBuffer.clear()},b.RenderTexture.prototype.renderWebGL=function(a,c,d){var e=this.renderer.gl;e.colorMask(!0,!0,!0,!0),e.viewport(0,0,this.width,this.height),e.bindFramebuffer(e.FRAMEBUFFER,this.textureBuffer.frameBuffer),d&&this.textureBuffer.clear();var f=a.children,g=a.worldTransform;a.worldTransform=b.RenderTexture.tempMatrix,a.worldTransform.d=-1,a.worldTransform.ty=-2*this.projection.y,c&&(a.worldTransform.tx=c.x,a.worldTransform.ty-=c.y);for(var h=0,i=f.length;i>h;h++)f[h].updateTransform();b.WebGLRenderer.updateTextures(),this.renderer.spriteBatch.dirty=!0,this.renderer.renderDisplayObject(a,this.projection,this.textureBuffer.frameBuffer),a.worldTransform=g,this.renderer.spriteBatch.dirty=!0},b.RenderTexture.prototype.renderCanvas=function(a,c,d){var e=a.children,f=a.worldTransform;a.worldTransform=b.RenderTexture.tempMatrix,c?(a.worldTransform.tx=c.x,a.worldTransform.ty=c.y):(a.worldTransform.tx=0,a.worldTransform.ty=0);for(var g=0,h=e.length;h>g;g++)e[g].updateTransform();d&&this.textureBuffer.clear();var i=this.textureBuffer.context;this.renderer.renderDisplayObject(a,i),i.setTransform(1,0,0,1,0,0),a.worldTransform=f},b.RenderTexture.tempMatrix=new b.Matrix,b.AssetLoader=function(a,c){b.EventTarget.call(this),this.assetURLs=a,this.crossorigin=c,this.loadersByType={jpg:b.ImageLoader,jpeg:b.ImageLoader,png:b.ImageLoader,gif:b.ImageLoader,webp:b.ImageLoader,json:b.JsonLoader,atlas:b.AtlasLoader,anim:b.SpineLoader,xml:b.BitmapFontLoader,fnt:b.BitmapFontLoader}},b.AssetLoader.prototype.constructor=b.AssetLoader,b.AssetLoader.prototype._getDataType=function(a){var b="data:",c=a.slice(0,b.length).toLowerCase();if(c===b){var d=a.slice(b.length),e=d.indexOf(",");if(-1===e)return null;var f=d.slice(0,e).split(";")[0];return f&&"text/plain"!==f.toLowerCase()?f.split("/").pop().toLowerCase():"txt"}return null},b.AssetLoader.prototype.load=function(){function a(a){b.onAssetLoaded(a.content)}var b=this;this.loadCount=this.assetURLs.length;for(var c=0;c<this.assetURLs.length;c++){var d=this.assetURLs[c],e=this._getDataType(d);e||(e=d.split("?").shift().split(".").pop().toLowerCase());var f=this.loadersByType[e];if(!f)throw new Error(e+" is an unsupported file type");var g=new f(d,this.crossorigin);g.addEventListener("loaded",a),g.load()}},b.AssetLoader.prototype.onAssetLoaded=function(a){this.loadCount--,this.dispatchEvent({type:"onProgress",content:this,loader:a}),this.onProgress&&this.onProgress(a),this.loadCount||(this.dispatchEvent({type:"onComplete",content:this}),this.onComplete&&this.onComplete())},b.JsonLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.baseUrl=a.replace(/[^\/]*$/,""),this.loaded=!1},b.JsonLoader.prototype.constructor=b.JsonLoader,b.JsonLoader.prototype.load=function(){var a=this;window.XDomainRequest&&a.crossorigin?(this.ajaxRequest=new window.XDomainRequest,this.ajaxRequest.timeout=3e3,this.ajaxRequest.onerror=function(){a.onError()},this.ajaxRequest.ontimeout=function(){a.onError()},this.ajaxRequest.onprogress=function(){}):this.ajaxRequest=window.XMLHttpRequest?new window.XMLHttpRequest:new window.ActiveXObject("Microsoft.XMLHTTP"),this.ajaxRequest.onload=function(){a.onJSONLoaded()},this.ajaxRequest.open("GET",this.url,!0),this.ajaxRequest.send()},b.JsonLoader.prototype.onJSONLoaded=function(){if(!this.ajaxRequest.responseText)return this.onError(),void 0;if(this.json=JSON.parse(this.ajaxRequest.responseText),this.json.frames){var a=this,c=this.baseUrl+this.json.meta.image,d=new b.ImageLoader(c,this.crossorigin),e=this.json.frames;this.texture=d.texture.baseTexture,d.addEventListener("loaded",function(){a.onLoaded()});for(var g in e){var h=e[g].frame;if(h&&(b.TextureCache[g]=new b.Texture(this.texture,{x:h.x,y:h.y,width:h.w,height:h.h}),b.TextureCache[g].crop=new b.Rectangle(h.x,h.y,h.w,h.h),e[g].trimmed)){var i=e[g].sourceSize,j=e[g].spriteSourceSize;b.TextureCache[g].trim=new b.Rectangle(j.x,j.y,i.w,i.h)}}d.load()}else if(this.json.bones){var k=new f.SkeletonJson,l=k.readSkeletonData(this.json);b.AnimCache[this.url]=l,this.onLoaded()}else this.onLoaded()},b.JsonLoader.prototype.onLoaded=function(){this.loaded=!0,this.dispatchEvent({type:"loaded",content:this})},b.JsonLoader.prototype.onError=function(){this.dispatchEvent({type:"error",content:this})},b.AtlasLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.baseUrl=a.replace(/[^\/]*$/,""),this.crossorigin=c,this.loaded=!1},b.AtlasLoader.constructor=b.AtlasLoader,b.AtlasLoader.prototype.load=function(){this.ajaxRequest=new b.AjaxRequest,this.ajaxRequest.onreadystatechange=this.onAtlasLoaded.bind(this),this.ajaxRequest.open("GET",this.url,!0),this.ajaxRequest.overrideMimeType&&this.ajaxRequest.overrideMimeType("application/json"),this.ajaxRequest.send(null)},b.AtlasLoader.prototype.onAtlasLoaded=function(){if(4===this.ajaxRequest.readyState)if(200===this.ajaxRequest.status||-1===window.location.href.indexOf("http")){this.atlas={meta:{image:[]},frames:[]};var a=this.ajaxRequest.responseText.split(/\r?\n/),c=-3,d=0,e=null,f=!1,g=0,h=0,i=this.onLoaded.bind(this);for(g=0;g<a.length;g++)if(a[g]=a[g].replace(/^\s+|\s+$/g,""),""===a[g]&&(f=g+1),a[g].length>0){if(f===g)this.atlas.meta.image.push(a[g]),d=this.atlas.meta.image.length-1,this.atlas.frames.push({}),c=-3;else if(c>0)if(c%7===1)null!=e&&(this.atlas.frames[d][e.name]=e),e={name:a[g],frame:{}};else{var j=a[g].split(" ");if(c%7===3)e.frame.x=Number(j[1].replace(",","")),e.frame.y=Number(j[2]);else if(c%7===4)e.frame.w=Number(j[1].replace(",","")),e.frame.h=Number(j[2]);else if(c%7===5){var k={x:0,y:0,w:Number(j[1].replace(",","")),h:Number(j[2])};k.w>e.frame.w||k.h>e.frame.h?(e.trimmed=!0,e.realSize=k):e.trimmed=!1}}c++}if(null!=e&&(this.atlas.frames[d][e.name]=e),this.atlas.meta.image.length>0){for(this.images=[],h=0;h<this.atlas.meta.image.length;h++){var l=this.baseUrl+this.atlas.meta.image[h],m=this.atlas.frames[h];this.images.push(new b.ImageLoader(l,this.crossorigin));for(g in m){var n=m[g].frame;n&&(b.TextureCache[g]=new b.Texture(this.images[h].texture.baseTexture,{x:n.x,y:n.y,width:n.w,height:n.h}),m[g].trimmed&&(b.TextureCache[g].realSize=m[g].realSize,b.TextureCache[g].trim.x=0,b.TextureCache[g].trim.y=0))}}for(this.currentImageId=0,h=0;h<this.images.length;h++)this.images[h].addEventListener("loaded",i);this.images[this.currentImageId].load()}else this.onLoaded()}else this.onError()},b.AtlasLoader.prototype.onLoaded=function(){this.images.length-1>this.currentImageId?(this.currentImageId++,this.images[this.currentImageId].load()):(this.loaded=!0,this.dispatchEvent({type:"loaded",content:this}))},b.AtlasLoader.prototype.onError=function(){this.dispatchEvent({type:"error",content:this})},b.SpriteSheetLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.baseUrl=a.replace(/[^\/]*$/,""),this.texture=null,this.frames={}},b.SpriteSheetLoader.prototype.constructor=b.SpriteSheetLoader,b.SpriteSheetLoader.prototype.load=function(){var a=this,c=new b.JsonLoader(this.url,this.crossorigin);c.addEventListener("loaded",function(b){a.json=b.content.json,a.onLoaded()}),c.load()},b.SpriteSheetLoader.prototype.onLoaded=function(){this.dispatchEvent({type:"loaded",content:this})},b.ImageLoader=function(a,c){b.EventTarget.call(this),this.texture=b.Texture.fromImage(a,c),this.frames=[]},b.ImageLoader.prototype.constructor=b.ImageLoader,b.ImageLoader.prototype.load=function(){if(this.texture.baseTexture.hasLoaded)this.onLoaded();else{var a=this;this.texture.baseTexture.addEventListener("loaded",function(){a.onLoaded()})}},b.ImageLoader.prototype.onLoaded=function(){this.dispatchEvent({type:"loaded",content:this})},b.ImageLoader.prototype.loadFramedSpriteSheet=function(a,c,d){this.frames=[];for(var e=Math.floor(this.texture.width/a),f=Math.floor(this.texture.height/c),g=0,h=0;f>h;h++)for(var i=0;e>i;i++,g++){var j=new b.Texture(this.texture,{x:i*a,y:h*c,width:a,height:c});this.frames.push(j),d&&(b.TextureCache[d+"-"+g]=j)}if(this.texture.baseTexture.hasLoaded)this.onLoaded();else{var k=this;this.texture.baseTexture.addEventListener("loaded",function(){k.onLoaded()})}},b.BitmapFontLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.baseUrl=a.replace(/[^\/]*$/,""),this.texture=null},b.BitmapFontLoader.prototype.constructor=b.BitmapFontLoader,b.BitmapFontLoader.prototype.load=function(){this.ajaxRequest=new b.AjaxRequest;var a=this;this.ajaxRequest.onreadystatechange=function(){a.onXMLLoaded()},this.ajaxRequest.open("GET",this.url,!0),this.ajaxRequest.overrideMimeType&&this.ajaxRequest.overrideMimeType("application/xml"),this.ajaxRequest.send(null)},b.BitmapFontLoader.prototype.onXMLLoaded=function(){if(4===this.ajaxRequest.readyState&&(200===this.ajaxRequest.status||-1===window.location.protocol.indexOf("http"))){var a=this.ajaxRequest.responseXML;if(!a||/MSIE 9/i.test(navigator.userAgent)||navigator.isCocoonJS)if("function"==typeof window.DOMParser){var c=new DOMParser;a=c.parseFromString(this.ajaxRequest.responseText,"text/xml")}else{var d=document.createElement("div");d.innerHTML=this.ajaxRequest.responseText,a=d}var e=this.baseUrl+a.getElementsByTagName("page")[0].getAttribute("file"),f=new b.ImageLoader(e,this.crossorigin);this.texture=f.texture.baseTexture;var g={},h=a.getElementsByTagName("info")[0],i=a.getElementsByTagName("common")[0];g.font=h.getAttribute("face"),g.size=parseInt(h.getAttribute("size"),10),g.lineHeight=parseInt(i.getAttribute("lineHeight"),10),g.chars={};for(var j=a.getElementsByTagName("char"),k=0;k<j.length;k++){var l=parseInt(j[k].getAttribute("id"),10),m=new b.Rectangle(parseInt(j[k].getAttribute("x"),10),parseInt(j[k].getAttribute("y"),10),parseInt(j[k].getAttribute("width"),10),parseInt(j[k].getAttribute("height"),10));g.chars[l]={xOffset:parseInt(j[k].getAttribute("xoffset"),10),yOffset:parseInt(j[k].getAttribute("yoffset"),10),xAdvance:parseInt(j[k].getAttribute("xadvance"),10),kerning:{},texture:b.TextureCache[l]=new b.Texture(this.texture,m)}}var n=a.getElementsByTagName("kerning");for(k=0;k<n.length;k++){var o=parseInt(n[k].getAttribute("first"),10),p=parseInt(n[k].getAttribute("second"),10),q=parseInt(n[k].getAttribute("amount"),10);g.chars[p].kerning[o]=q}b.BitmapText.fonts[g.font]=g;var r=this;f.addEventListener("loaded",function(){r.onLoaded()}),f.load()}},b.BitmapFontLoader.prototype.onLoaded=function(){this.dispatchEvent({type:"loaded",content:this})},b.SpineLoader=function(a,c){b.EventTarget.call(this),this.url=a,this.crossorigin=c,this.loaded=!1},b.SpineLoader.prototype.constructor=b.SpineLoader,b.SpineLoader.prototype.load=function(){var a=this,c=new b.JsonLoader(this.url,this.crossorigin);
c.addEventListener("loaded",function(b){a.json=b.content.json,a.onLoaded()}),c.load()},b.SpineLoader.prototype.onLoaded=function(){this.loaded=!0,this.dispatchEvent({type:"loaded",content:this})},b.AbstractFilter=function(a,b){this.passes=[this],this.shaders=[],this.dirty=!0,this.padding=0,this.uniforms=b||{},this.fragmentSrc=a||[]},b.AlphaMaskFilter=function(a){b.AbstractFilter.call(this),this.passes=[this],a.baseTexture._powerOf2=!0,this.uniforms={mask:{type:"sampler2D",value:a},mapDimensions:{type:"2f",value:{x:1,y:5112}},dimensions:{type:"4fv",value:[0,0,0,0]}},a.baseTexture.hasLoaded?(this.uniforms.mask.value.x=a.width,this.uniforms.mask.value.y=a.height):(this.boundLoadedFunction=this.onTextureLoaded.bind(this),a.baseTexture.on("loaded",this.boundLoadedFunction)),this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D mask;","uniform sampler2D uSampler;","uniform vec2 offset;","uniform vec4 dimensions;","uniform vec2 mapDimensions;","void main(void) {","   vec2 mapCords = vTextureCoord.xy;","   mapCords += (dimensions.zw + offset)/ dimensions.xy ;","   mapCords.y *= -1.0;","   mapCords.y += 1.0;","   mapCords *= dimensions.xy / mapDimensions;","   vec4 original =  texture2D(uSampler, vTextureCoord);","   float maskAlpha =  texture2D(mask, mapCords).r;","   original *= maskAlpha;","   gl_FragColor =  original;","}"]},b.AlphaMaskFilter.prototype=Object.create(b.AbstractFilter.prototype),b.AlphaMaskFilter.prototype.constructor=b.AlphaMaskFilter,b.AlphaMaskFilter.prototype.onTextureLoaded=function(){this.uniforms.mapDimensions.value.x=this.uniforms.mask.value.width,this.uniforms.mapDimensions.value.y=this.uniforms.mask.value.height,this.uniforms.mask.value.baseTexture.off("loaded",this.boundLoadedFunction)},Object.defineProperty(b.AlphaMaskFilter.prototype,"map",{get:function(){return this.uniforms.mask.value},set:function(a){this.uniforms.mask.value=a}}),b.ColorMatrixFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={matrix:{type:"mat4",value:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float invert;","uniform mat4 matrix;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord) * matrix;","}"]},b.ColorMatrixFilter.prototype=Object.create(b.AbstractFilter.prototype),b.ColorMatrixFilter.prototype.constructor=b.ColorMatrixFilter,Object.defineProperty(b.ColorMatrixFilter.prototype,"matrix",{get:function(){return this.uniforms.matrix.value},set:function(a){this.uniforms.matrix.value=a}}),b.GrayFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={gray:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D uSampler;","uniform float gray;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);","}"]},b.GrayFilter.prototype=Object.create(b.AbstractFilter.prototype),b.GrayFilter.prototype.constructor=b.GrayFilter,Object.defineProperty(b.GrayFilter.prototype,"gray",{get:function(){return this.uniforms.gray.value},set:function(a){this.uniforms.gray.value=a}}),b.DisplacementFilter=function(a){b.AbstractFilter.call(this),this.passes=[this],a.baseTexture._powerOf2=!0,this.uniforms={displacementMap:{type:"sampler2D",value:a},scale:{type:"2f",value:{x:30,y:30}},offset:{type:"2f",value:{x:0,y:0}},mapDimensions:{type:"2f",value:{x:1,y:5112}},dimensions:{type:"4fv",value:[0,0,0,0]}},a.baseTexture.hasLoaded?(this.uniforms.mapDimensions.value.x=a.width,this.uniforms.mapDimensions.value.y=a.height):(this.boundLoadedFunction=this.onTextureLoaded.bind(this),a.baseTexture.on("loaded",this.boundLoadedFunction)),this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D displacementMap;","uniform sampler2D uSampler;","uniform vec2 scale;","uniform vec2 offset;","uniform vec4 dimensions;","uniform vec2 mapDimensions;","void main(void) {","   vec2 mapCords = vTextureCoord.xy;","   mapCords += (dimensions.zw + offset)/ dimensions.xy ;","   mapCords.y *= -1.0;","   mapCords.y += 1.0;","   vec2 matSample = texture2D(displacementMap, mapCords).xy;","   matSample -= 0.5;","   matSample *= scale;","   matSample /= mapDimensions;","   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x + matSample.x, vTextureCoord.y + matSample.y));","   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb, 1.0);","   vec2 cord = vTextureCoord;","}"]},b.DisplacementFilter.prototype=Object.create(b.AbstractFilter.prototype),b.DisplacementFilter.prototype.constructor=b.DisplacementFilter,b.DisplacementFilter.prototype.onTextureLoaded=function(){this.uniforms.mapDimensions.value.x=this.uniforms.displacementMap.value.width,this.uniforms.mapDimensions.value.y=this.uniforms.displacementMap.value.height,this.uniforms.displacementMap.value.baseTexture.off("loaded",this.boundLoadedFunction)},Object.defineProperty(b.DisplacementFilter.prototype,"map",{get:function(){return this.uniforms.displacementMap.value},set:function(a){this.uniforms.displacementMap.value=a}}),Object.defineProperty(b.DisplacementFilter.prototype,"scale",{get:function(){return this.uniforms.scale.value},set:function(a){this.uniforms.scale.value=a}}),Object.defineProperty(b.DisplacementFilter.prototype,"offset",{get:function(){return this.uniforms.offset.value},set:function(a){this.uniforms.offset.value=a}}),b.PixelateFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={invert:{type:"1f",value:0},dimensions:{type:"4fv",value:new Float32Array([1e4,100,10,10])},pixelSize:{type:"2f",value:{x:10,y:10}}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec2 testDim;","uniform vec4 dimensions;","uniform vec2 pixelSize;","uniform sampler2D uSampler;","void main(void) {","   vec2 coord = vTextureCoord;","   vec2 size = dimensions.xy/pixelSize;","   vec2 color = floor( ( vTextureCoord * size ) ) / size + pixelSize/dimensions.xy * 0.5;","   gl_FragColor = texture2D(uSampler, color);","}"]},b.PixelateFilter.prototype=Object.create(b.AbstractFilter.prototype),b.PixelateFilter.prototype.constructor=b.PixelateFilter,Object.defineProperty(b.PixelateFilter.prototype,"size",{get:function(){return this.uniforms.pixelSize.value},set:function(a){this.dirty=!0,this.uniforms.pixelSize.value=a}}),b.BlurXFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","   vec4 sum = vec4(0.0);","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;","   gl_FragColor = sum;","}"]},b.BlurXFilter.prototype=Object.create(b.AbstractFilter.prototype),b.BlurXFilter.prototype.constructor=b.BlurXFilter,Object.defineProperty(b.BlurXFilter.prototype,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.dirty=!0,this.uniforms.blur.value=1/7e3*a}}),b.BlurYFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","   vec4 sum = vec4(0.0);","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;","   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;","   gl_FragColor = sum;","}"]},b.BlurYFilter.prototype=Object.create(b.AbstractFilter.prototype),b.BlurYFilter.prototype.constructor=b.BlurYFilter,Object.defineProperty(b.BlurYFilter.prototype,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),b.BlurFilter=function(){this.blurXFilter=new b.BlurXFilter,this.blurYFilter=new b.BlurYFilter,this.passes=[this.blurXFilter,this.blurYFilter]},Object.defineProperty(b.BlurFilter.prototype,"blur",{get:function(){return this.blurXFilter.blur},set:function(a){this.blurXFilter.blur=this.blurYFilter.blur=a}}),Object.defineProperty(b.BlurFilter.prototype,"blurX",{get:function(){return this.blurXFilter.blur},set:function(a){this.blurXFilter.blur=a}}),Object.defineProperty(b.BlurFilter.prototype,"blurY",{get:function(){return this.blurYFilter.blur},set:function(a){this.blurYFilter.blur=a}}),b.InvertFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={invert:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float invert;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix( (vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, 1.0 - invert);","}"]},b.InvertFilter.prototype=Object.create(b.AbstractFilter.prototype),b.InvertFilter.prototype.constructor=b.InvertFilter,Object.defineProperty(b.InvertFilter.prototype,"invert",{get:function(){return this.uniforms.invert.value},set:function(a){this.uniforms.invert.value=a}}),b.SepiaFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={sepia:{type:"1f",value:1}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float sepia;","uniform sampler2D uSampler;","const mat3 sepiaMatrix = mat3(0.3588, 0.7044, 0.1368, 0.2990, 0.5870, 0.1140, 0.2392, 0.4696, 0.0912);","void main(void) {","   gl_FragColor = texture2D(uSampler, vTextureCoord);","   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * sepiaMatrix, sepia);","}"]},b.SepiaFilter.prototype=Object.create(b.AbstractFilter.prototype),b.SepiaFilter.prototype.constructor=b.SepiaFilter,Object.defineProperty(b.SepiaFilter.prototype,"sepia",{get:function(){return this.uniforms.sepia.value},set:function(a){this.uniforms.sepia.value=a}}),b.TwistFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={radius:{type:"1f",value:.5},angle:{type:"1f",value:5},offset:{type:"2f",value:{x:.5,y:.5}}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec4 dimensions;","uniform sampler2D uSampler;","uniform float radius;","uniform float angle;","uniform vec2 offset;","void main(void) {","   vec2 coord = vTextureCoord - offset;","   float distance = length(coord);","   if (distance < radius) {","       float ratio = (radius - distance) / radius;","       float angleMod = ratio * ratio * angle;","       float s = sin(angleMod);","       float c = cos(angleMod);","       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);","   }","   gl_FragColor = texture2D(uSampler, coord+offset);","}"]},b.TwistFilter.prototype=Object.create(b.AbstractFilter.prototype),b.TwistFilter.prototype.constructor=b.TwistFilter,Object.defineProperty(b.TwistFilter.prototype,"offset",{get:function(){return this.uniforms.offset.value},set:function(a){this.dirty=!0,this.uniforms.offset.value=a}}),Object.defineProperty(b.TwistFilter.prototype,"radius",{get:function(){return this.uniforms.radius.value},set:function(a){this.dirty=!0,this.uniforms.radius.value=a}}),Object.defineProperty(b.TwistFilter.prototype,"angle",{get:function(){return this.uniforms.angle.value},set:function(a){this.dirty=!0,this.uniforms.angle.value=a}}),b.ColorStepFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={step:{type:"1f",value:5}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform sampler2D uSampler;","uniform float step;","void main(void) {","   vec4 color = texture2D(uSampler, vTextureCoord);","   color = floor(color * step) / step;","   gl_FragColor = color;","}"]},b.ColorStepFilter.prototype=Object.create(b.AbstractFilter.prototype),b.ColorStepFilter.prototype.constructor=b.ColorStepFilter,Object.defineProperty(b.ColorStepFilter.prototype,"step",{get:function(){return this.uniforms.step.value},set:function(a){this.uniforms.step.value=a}}),b.DotScreenFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={scale:{type:"1f",value:1},angle:{type:"1f",value:5},dimensions:{type:"4fv",value:[0,0,0,0]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec4 dimensions;","uniform sampler2D uSampler;","uniform float angle;","uniform float scale;","float pattern() {","   float s = sin(angle), c = cos(angle);","   vec2 tex = vTextureCoord * dimensions.xy;","   vec2 point = vec2(","       c * tex.x - s * tex.y,","       s * tex.x + c * tex.y","   ) * scale;","   return (sin(point.x) * sin(point.y)) * 4.0;","}","void main() {","   vec4 color = texture2D(uSampler, vTextureCoord);","   float average = (color.r + color.g + color.b) / 3.0;","   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);","}"]},b.DotScreenFilter.prototype=Object.create(b.AbstractFilter.prototype),b.DotScreenFilter.prototype.constructor=b.DotScreenFilter,Object.defineProperty(b.DotScreenFilter.prototype,"scale",{get:function(){return this.uniforms.scale.value},set:function(a){this.dirty=!0,this.uniforms.scale.value=a}}),Object.defineProperty(b.DotScreenFilter.prototype,"angle",{get:function(){return this.uniforms.angle.value},set:function(a){this.dirty=!0,this.uniforms.angle.value=a}}),b.CrossHatchFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={blur:{type:"1f",value:1/512}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform float blur;","uniform sampler2D uSampler;","void main(void) {","    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);","    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);","    if (lum < 1.00) {","        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.75) {","        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.50) {","        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","    if (lum < 0.3) {","        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {","            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);","        }","    }","}"]},b.CrossHatchFilter.prototype=Object.create(b.AbstractFilter.prototype),b.CrossHatchFilter.prototype.constructor=b.BlurYFilter,Object.defineProperty(b.CrossHatchFilter.prototype,"blur",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),b.RGBSplitFilter=function(){b.AbstractFilter.call(this),this.passes=[this],this.uniforms={red:{type:"2f",value:{x:20,y:20}},green:{type:"2f",value:{x:-20,y:20}},blue:{type:"2f",value:{x:20,y:-20}},dimensions:{type:"4fv",value:[0,0,0,0]}},this.fragmentSrc=["precision mediump float;","varying vec2 vTextureCoord;","varying vec4 vColor;","uniform vec2 red;","uniform vec2 green;","uniform vec2 blue;","uniform vec4 dimensions;","uniform sampler2D uSampler;","void main(void) {","   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/dimensions.xy).r;","   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/dimensions.xy).g;","   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/dimensions.xy).b;","   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;","}"]},b.RGBSplitFilter.prototype=Object.create(b.AbstractFilter.prototype),b.RGBSplitFilter.prototype.constructor=b.RGBSplitFilter,Object.defineProperty(b.RGBSplitFilter.prototype,"angle",{get:function(){return this.uniforms.blur.value/(1/7e3)},set:function(a){this.uniforms.blur.value=1/7e3*a}}),"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=b),exports.PIXI=b):"undefined"!=typeof define&&define.amd?define(b):a.PIXI=b}).call(this);; // ----------------------------------------------------------------------------
 // Buzz, a Javascript HTML5 Audio library
 // v1.1.7 - Built 2014-10-13 21:18
 // Licensed under the MIT license.
 // http://buzz.jaysalvat.com/
 // ----------------------------------------------------------------------------
 // Copyright (C) 2010-2014 Jay Salvat
 // http://jaysalvat.com/
 // ----------------------------------------------------------------------------

(function(t,n){"undefined"!=typeof module&&module.exports?module.exports=n():"function"==typeof define&&define.amd?define([],n):t.buzz=n()})(this,function(){window.AudioContext=window.AudioContext||window.webkitAudioContext;var t={audioCtx:window.AudioContext?new AudioContext:null,defaults:{autoplay:!1,duration:5e3,formats:[],loop:!1,placeholder:"--",preload:"metadata",volume:80,webAudioApi:!1,document:window.document},types:{mp3:"audio/mpeg",ogg:"audio/ogg",wav:"audio/wav",aac:"audio/aac",m4a:"audio/x-m4a"},sounds:[],el:document.createElement("audio"),sound:function(n,e){function i(t){for(var n=[],e=t.length-1,i=0;e>=i;i++)n.push({start:t.start(i),end:t.end(i)});return n}function u(t){return t.split(".").pop()}function s(n,e){var i=r.createElement("source");i.src=e,t.types[u(e)]&&(i.type=t.types[u(e)]),n.appendChild(i)}e=e||{};var r=e.document||t.defaults.document,o=0,a=[],h={},d=t.isSupported();if(this.load=function(){return d?(this.sound.load(),this):this},this.play=function(){return d?(this.sound.play(),this):this},this.togglePlay=function(){return d?(this.sound.paused?this.sound.play():this.sound.pause(),this):this},this.pause=function(){return d?(this.sound.pause(),this):this},this.isPaused=function(){return d?this.sound.paused:null},this.stop=function(){return d?(this.setTime(0),this.sound.pause(),this):this},this.isEnded=function(){return d?this.sound.ended:null},this.loop=function(){return d?(this.sound.loop="loop",this.bind("ended.buzzloop",function(){this.currentTime=0,this.play()}),this):this},this.unloop=function(){return d?(this.sound.removeAttribute("loop"),this.unbind("ended.buzzloop"),this):this},this.mute=function(){return d?(this.sound.muted=!0,this):this},this.unmute=function(){return d?(this.sound.muted=!1,this):this},this.toggleMute=function(){return d?(this.sound.muted=!this.sound.muted,this):this},this.isMuted=function(){return d?this.sound.muted:null},this.setVolume=function(t){return d?(0>t&&(t=0),t>100&&(t=100),this.volume=t,this.sound.volume=t/100,this):this},this.getVolume=function(){return d?this.volume:this},this.increaseVolume=function(t){return this.setVolume(this.volume+(t||1))},this.decreaseVolume=function(t){return this.setVolume(this.volume-(t||1))},this.setTime=function(t){if(!d)return this;var n=!0;return this.whenReady(function(){n===!0&&(n=!1,this.sound.currentTime=t)}),this},this.getTime=function(){if(!d)return null;var n=Math.round(100*this.sound.currentTime)/100;return isNaN(n)?t.defaults.placeholder:n},this.setPercent=function(n){return d?this.setTime(t.fromPercent(n,this.sound.duration)):this},this.getPercent=function(){if(!d)return null;var n=Math.round(t.toPercent(this.sound.currentTime,this.sound.duration));return isNaN(n)?t.defaults.placeholder:n},this.setSpeed=function(t){return d?(this.sound.playbackRate=t,this):this},this.getSpeed=function(){return d?this.sound.playbackRate:null},this.getDuration=function(){if(!d)return null;var n=Math.round(100*this.sound.duration)/100;return isNaN(n)?t.defaults.placeholder:n},this.getPlayed=function(){return d?i(this.sound.played):null},this.getBuffered=function(){return d?i(this.sound.buffered):null},this.getSeekable=function(){return d?i(this.sound.seekable):null},this.getErrorCode=function(){return d&&this.sound.error?this.sound.error.code:0},this.getErrorMessage=function(){if(!d)return null;switch(this.getErrorCode()){case 1:return"MEDIA_ERR_ABORTED";case 2:return"MEDIA_ERR_NETWORK";case 3:return"MEDIA_ERR_DECODE";case 4:return"MEDIA_ERR_SRC_NOT_SUPPORTED";default:return null}},this.getStateCode=function(){return d?this.sound.readyState:null},this.getStateMessage=function(){if(!d)return null;switch(this.getStateCode()){case 0:return"HAVE_NOTHING";case 1:return"HAVE_METADATA";case 2:return"HAVE_CURRENT_DATA";case 3:return"HAVE_FUTURE_DATA";case 4:return"HAVE_ENOUGH_DATA";default:return null}},this.getNetworkStateCode=function(){return d?this.sound.networkState:null},this.getNetworkStateMessage=function(){if(!d)return null;switch(this.getNetworkStateCode()){case 0:return"NETWORK_EMPTY";case 1:return"NETWORK_IDLE";case 2:return"NETWORK_LOADING";case 3:return"NETWORK_NO_SOURCE";default:return null}},this.set=function(t,n){return d?(this.sound[t]=n,this):this},this.get=function(t){return d?t?this.sound[t]:this.sound:null},this.bind=function(t,n){if(!d)return this;t=t.split(" ");for(var e=this,i=function(t){n.call(e,t)},u=0;t.length>u;u++){var s=t[u],r=s;s=r.split(".")[0],a.push({idx:r,func:i}),this.sound.addEventListener(s,i,!0)}return this},this.unbind=function(t){if(!d)return this;t=t.split(" ");for(var n=0;t.length>n;n++)for(var e=t[n],i=e.split(".")[0],u=0;a.length>u;u++){var s=a[u].idx.split(".");(a[u].idx==e||s[1]&&s[1]==e.replace(".",""))&&(this.sound.removeEventListener(i,a[u].func,!0),a.splice(u,1))}return this},this.bindOnce=function(t,n){if(!d)return this;var e=this;return h[o++]=!1,this.bind(t+"."+o,function(){h[o]||(h[o]=!0,n.call(e)),e.unbind(t+"."+o)}),this},this.trigger=function(t){if(!d)return this;t=t.split(" ");for(var n=0;t.length>n;n++)for(var e=t[n],i=0;a.length>i;i++){var u=a[i].idx.split(".");if(a[i].idx==e||u[0]&&u[0]==e.replace(".","")){var s=r.createEvent("HTMLEvents");s.initEvent(u[0],!1,!0),this.sound.dispatchEvent(s)}}return this},this.fadeTo=function(n,e,i){function u(){setTimeout(function(){n>s&&n>o.volume?(o.setVolume(o.volume+=1),u()):s>n&&o.volume>n?(o.setVolume(o.volume-=1),u()):i instanceof Function&&i.apply(o)},r)}if(!d)return this;e instanceof Function?(i=e,e=t.defaults.duration):e=e||t.defaults.duration;var s=this.volume,r=e/Math.abs(s-n),o=this;return this.play(),this.whenReady(function(){u()}),this},this.fadeIn=function(t,n){return d?this.setVolume(0).fadeTo(100,t,n):this},this.fadeOut=function(t,n){return d?this.fadeTo(0,t,n):this},this.fadeWith=function(t,n){return d?(this.fadeOut(n,function(){this.stop()}),t.play().fadeIn(n),this):this},this.whenReady=function(t){if(!d)return null;var n=this;0===this.sound.readyState?this.bind("canplay.buzzwhenready",function(){t.call(n)}):t.call(n)},d&&n){for(var l in t.defaults)t.defaults.hasOwnProperty(l)&&void 0===e[l]&&(e[l]=t.defaults[l]);if(this.sound=r.createElement("audio"),e.webAudioApi&&t.audioCtx&&(this.source=t.audioCtx.createMediaElementSource(this.sound),this.source.connect(t.audioCtx.destination)),n instanceof Array)for(var c in n)n.hasOwnProperty(c)&&s(this.sound,n[c]);else if(e.formats.length)for(var f in e.formats)e.formats.hasOwnProperty(f)&&s(this.sound,n+"."+e.formats[f]);else s(this.sound,n);e.loop&&this.loop(),e.autoplay&&(this.sound.autoplay="autoplay"),this.sound.preload=e.preload===!0?"auto":e.preload===!1?"none":e.preload,this.setVolume(e.volume),t.sounds.push(this)}},group:function(t){function n(){for(var n=e(null,arguments),i=n.shift(),u=0;t.length>u;u++)t[u][i].apply(t[u],n)}function e(t,n){return t instanceof Array?t:Array.prototype.slice.call(n)}t=e(t,arguments),this.getSounds=function(){return t},this.add=function(n){n=e(n,arguments);for(var i=0;n.length>i;i++)t.push(n[i])},this.remove=function(n){n=e(n,arguments);for(var i=0;n.length>i;i++)for(var u=0;t.length>u;u++)if(t[u]==n[i]){t.splice(u,1);break}},this.load=function(){return n("load"),this},this.play=function(){return n("play"),this},this.togglePlay=function(){return n("togglePlay"),this},this.pause=function(t){return n("pause",t),this},this.stop=function(){return n("stop"),this},this.mute=function(){return n("mute"),this},this.unmute=function(){return n("unmute"),this},this.toggleMute=function(){return n("toggleMute"),this},this.setVolume=function(t){return n("setVolume",t),this},this.increaseVolume=function(t){return n("increaseVolume",t),this},this.decreaseVolume=function(t){return n("decreaseVolume",t),this},this.loop=function(){return n("loop"),this},this.unloop=function(){return n("unloop"),this},this.setSpeed=function(t){return n("setSpeed",t),this},this.setTime=function(t){return n("setTime",t),this},this.set=function(t,e){return n("set",t,e),this},this.bind=function(t,e){return n("bind",t,e),this},this.unbind=function(t){return n("unbind",t),this},this.bindOnce=function(t,e){return n("bindOnce",t,e),this},this.trigger=function(t){return n("trigger",t),this},this.fade=function(t,e,i,u){return n("fade",t,e,i,u),this},this.fadeIn=function(t,e){return n("fadeIn",t,e),this},this.fadeOut=function(t,e){return n("fadeOut",t,e),this}},all:function(){return new t.group(t.sounds)},isSupported:function(){return!!t.el.canPlayType},isOGGSupported:function(){return!!t.el.canPlayType&&t.el.canPlayType('audio/ogg; codecs="vorbis"')},isWAVSupported:function(){return!!t.el.canPlayType&&t.el.canPlayType('audio/wav; codecs="1"')},isMP3Supported:function(){return!!t.el.canPlayType&&t.el.canPlayType("audio/mpeg;")},isAACSupported:function(){return!!t.el.canPlayType&&(t.el.canPlayType("audio/x-m4a;")||t.el.canPlayType("audio/aac;"))},toTimer:function(t,n){var e,i,u;return e=Math.floor(t/3600),e=isNaN(e)?"--":e>=10?e:"0"+e,i=n?Math.floor(t/60%60):Math.floor(t/60),i=isNaN(i)?"--":i>=10?i:"0"+i,u=Math.floor(t%60),u=isNaN(u)?"--":u>=10?u:"0"+u,n?e+":"+i+":"+u:i+":"+u},fromTimer:function(t){var n=(""+t).split(":");return n&&3==n.length&&(t=3600*parseInt(n[0],10)+60*parseInt(n[1],10)+parseInt(n[2],10)),n&&2==n.length&&(t=60*parseInt(n[0],10)+parseInt(n[1],10)),t},toPercent:function(t,n,e){var i=Math.pow(10,e||0);return Math.round(100*t/n*i)/i},fromPercent:function(t,n,e){var i=Math.pow(10,e||0);return Math.round(n/100*t*i)/i}};return t});;/*!
 * VERSION: 1.13.1
 * DATE: 2014-07-22
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(function(window, moduleName) {

		"use strict";
		var _globals = window.GreenSockGlobals = window.GreenSockGlobals || window;
		if (_globals.TweenLite) {
			return; //in case the core set of classes is already loaded, don't instantiate twice.
		}
		var _namespace = function(ns) {
				var a = ns.split("."),
					p = _globals, i;
				for (i = 0; i < a.length; i++) {
					p[a[i]] = p = p[a[i]] || {};
				}
				return p;
			},
			gs = _namespace("com.greensock"),
			_tinyNum = 0.0000000001,
			_slice = function(a) { //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
				var b = [],
					l = a.length,
					i;
				for (i = 0; i !== l; b.push(a[i++]));
				return b;
			},
			_emptyFunc = function() {},
			_isArray = (function() { //works around issues in iframe environments where the Array global isn't shared, thus if the object originates in a different window/iframe, "(obj instanceof Array)" will evaluate false. We added some speed optimizations to avoid Object.prototype.toString.call() unless it's absolutely necessary because it's VERY slow (like 20x slower)
				var toString = Object.prototype.toString,
					array = toString.call([]);
				return function(obj) {
					return obj != null && (obj instanceof Array || (typeof(obj) === "object" && !!obj.push && toString.call(obj) === array));
				};
			}()),
			a, i, p, _ticker, _tickerActive,
			_defLookup = {},

			/**
			 * @constructor
			 * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
			 * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
			 * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
			 * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
			 *
			 * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
			 * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
			 * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
			 * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
			 * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
			 * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
			 * sandbox the banner one like:
			 *
			 * <script>
			 *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
			 * </script>
			 * <script src="js/greensock/v1.7/TweenMax.js"></script>
			 * <script>
			 *     window.GreenSockGlobals = window._gsQueue = null; //reset it back to null (along with the special _gsQueue variable) so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
			 * </script>
			 * <script src="js/greensock/v1.6/TweenMax.js"></script>
			 * <script>
			 *     gs.TweenLite.to(...); //would use v1.7
			 *     TweenLite.to(...); //would use v1.6
			 * </script>
			 *
			 * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
			 * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
			 * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
			 * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
			 */
			Definition = function(ns, dependencies, func, global) {
				this.sc = (_defLookup[ns]) ? _defLookup[ns].sc : []; //subclasses
				_defLookup[ns] = this;
				this.gsClass = null;
				this.func = func;
				var _classes = [];
				this.check = function(init) {
					var i = dependencies.length,
						missing = i,
						cur, a, n, cl;
					while (--i > -1) {
						if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
							_classes[i] = cur.gsClass;
							missing--;
						} else if (init) {
							cur.sc.push(this);
						}
					}
					if (missing === 0 && func) {
						a = ("com.greensock." + ns).split(".");
						n = a.pop();
						cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);

						//exports to multiple environments
						if (global) {
							_globals[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
							if (typeof(define) === "function" && define.amd){ //AMD
								define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").pop(), [], function() { return cl; });
							} else if (ns === moduleName && typeof(module) !== "undefined" && module.exports){ //node
								module.exports = cl;
							}
						}
						for (i = 0; i < this.sc.length; i++) {
							this.sc[i].check();
						}
					}
				};
				this.check(true);
			},

			//used to create Definition instances (which basically registers a class that has dependencies).
			_gsDefine = window._gsDefine = function(ns, dependencies, func, global) {
				return new Definition(ns, dependencies, func, global);
			},

			//a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
			_class = gs._class = function(ns, func, global) {
				func = func || function() {};
				_gsDefine(ns, [], function(){ return func; }, global);
				return func;
			};

		_gsDefine.globals = _globals;



/*
 * ----------------------------------------------------------------
 * Ease
 * ----------------------------------------------------------------
 */
		var _baseParams = [0, 0, 1, 1],
			_blankArray = [],
			Ease = _class("easing.Ease", function(func, extraParams, type, power) {
				this._func = func;
				this._type = type || 0;
				this._power = power || 0;
				this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
			}, true),
			_easeMap = Ease.map = {},
			_easeReg = Ease.register = function(ease, names, types, create) {
				var na = names.split(","),
					i = na.length,
					ta = (types || "easeIn,easeOut,easeInOut").split(","),
					e, name, j, type;
				while (--i > -1) {
					name = na[i];
					e = create ? _class("easing."+name, null, true) : gs.easing[name] || {};
					j = ta.length;
					while (--j > -1) {
						type = ta[j];
						_easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
					}
				}
			};

		p = Ease.prototype;
		p._calcEnd = false;
		p.getRatio = function(p) {
			if (this._func) {
				this._params[0] = p;
				return this._func.apply(null, this._params);
			}
			var t = this._type,
				pw = this._power,
				r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
			if (pw === 1) {
				r *= r;
			} else if (pw === 2) {
				r *= r * r;
			} else if (pw === 3) {
				r *= r * r * r;
			} else if (pw === 4) {
				r *= r * r * r * r;
			}
			return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
		};

		//create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
		a = ["Linear","Quad","Cubic","Quart","Quint,Strong"];
		i = a.length;
		while (--i > -1) {
			p = a[i]+",Power"+i;
			_easeReg(new Ease(null,null,1,i), p, "easeOut", true);
			_easeReg(new Ease(null,null,2,i), p, "easeIn" + ((i === 0) ? ",easeNone" : ""));
			_easeReg(new Ease(null,null,3,i), p, "easeInOut");
		}
		_easeMap.linear = gs.easing.Linear.easeIn;
		_easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks


/*
 * ----------------------------------------------------------------
 * EventDispatcher
 * ----------------------------------------------------------------
 */
		var EventDispatcher = _class("events.EventDispatcher", function(target) {
			this._listeners = {};
			this._eventTarget = target || this;
		});
		p = EventDispatcher.prototype;

		p.addEventListener = function(type, callback, scope, useParam, priority) {
			priority = priority || 0;
			var list = this._listeners[type],
				index = 0,
				listener, i;
			if (list == null) {
				this._listeners[type] = list = [];
			}
			i = list.length;
			while (--i > -1) {
				listener = list[i];
				if (listener.c === callback && listener.s === scope) {
					list.splice(i, 1);
				} else if (index === 0 && listener.pr < priority) {
					index = i + 1;
				}
			}
			list.splice(index, 0, {c:callback, s:scope, up:useParam, pr:priority});
			if (this === _ticker && !_tickerActive) {
				_ticker.wake();
			}
		};

		p.removeEventListener = function(type, callback) {
			var list = this._listeners[type], i;
			if (list) {
				i = list.length;
				while (--i > -1) {
					if (list[i].c === callback) {
						list.splice(i, 1);
						return;
					}
				}
			}
		};

		p.dispatchEvent = function(type) {
			var list = this._listeners[type],
				i, t, listener;
			if (list) {
				i = list.length;
				t = this._eventTarget;
				while (--i > -1) {
					listener = list[i];
					if (listener.up) {
						listener.c.call(listener.s || t, {type:type, target:t});
					} else {
						listener.c.call(listener.s || t);
					}
				}
			}
		};


/*
 * ----------------------------------------------------------------
 * Ticker
 * ----------------------------------------------------------------
 */
 		var _reqAnimFrame = window.requestAnimationFrame,
			_cancelAnimFrame = window.cancelAnimationFrame,
			_getTime = Date.now || function() {return new Date().getTime();},
			_lastUpdate = _getTime();

		//now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
		a = ["ms","moz","webkit","o"];
		i = a.length;
		while (--i > -1 && !_reqAnimFrame) {
			_reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
			_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
		}

		_class("Ticker", function(fps, useRAF) {
			var _self = this,
				_startTime = _getTime(),
				_useRAF = (useRAF !== false && _reqAnimFrame),
				_lagThreshold = 500,
				_adjustedLag = 33,
				_fps, _req, _id, _gap, _nextTime,
				_tick = function(manual) {
					var elapsed = _getTime() - _lastUpdate,
						overlap, dispatch;
					if (elapsed > _lagThreshold) {
						_startTime += elapsed - _adjustedLag;
					}
					_lastUpdate += elapsed;
					_self.time = (_lastUpdate - _startTime) / 1000;
					overlap = _self.time - _nextTime;
					if (!_fps || overlap > 0 || manual === true) {
						_self.frame++;
						_nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
						dispatch = true;
					}
					if (manual !== true) { //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
						_id = _req(_tick);
					}
					if (dispatch) {
						_self.dispatchEvent("tick");
					}
				};

			EventDispatcher.call(_self);
			_self.time = _self.frame = 0;
			_self.tick = function() {
				_tick(true);
			};

			_self.lagSmoothing = function(threshold, adjustedLag) {
				_lagThreshold = threshold || (1 / _tinyNum); //zero should be interpreted as basically unlimited
				_adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
			};

			_self.sleep = function() {
				if (_id == null) {
					return;
				}
				if (!_useRAF || !_cancelAnimFrame) {
					clearTimeout(_id);
				} else {
					_cancelAnimFrame(_id);
				}
				_req = _emptyFunc;
				_id = null;
				if (_self === _ticker) {
					_tickerActive = false;
				}
			};

			_self.wake = function() {
				if (_id !== null) {
					_self.sleep();
				} else if (_self.frame > 10) { //don't trigger lagSmoothing if we're just waking up, and make sure that at least 10 frames have elapsed because of the iOS bug that we work around below with the 1.5-second setTimout().
					_lastUpdate = _getTime() - _lagThreshold + 5;
				}
				_req = (_fps === 0) ? _emptyFunc : (!_useRAF || !_reqAnimFrame) ? function(f) { return setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0); } : _reqAnimFrame;
				if (_self === _ticker) {
					_tickerActive = true;
				}
				_tick(2);
			};

			_self.fps = function(value) {
				if (!arguments.length) {
					return _fps;
				}
				_fps = value;
				_gap = 1 / (_fps || 60);
				_nextTime = this.time + _gap;
				_self.wake();
			};

			_self.useRAF = function(value) {
				if (!arguments.length) {
					return _useRAF;
				}
				_self.sleep();
				_useRAF = value;
				_self.fps(_fps);
			};
			_self.fps(fps);

			//a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.
			setTimeout(function() {
				if (_useRAF && (!_id || _self.frame < 5)) {
					_self.useRAF(false);
				}
			}, 1500);
		});

		p = gs.Ticker.prototype = new gs.events.EventDispatcher();
		p.constructor = gs.Ticker;


/*
 * ----------------------------------------------------------------
 * Animation
 * ----------------------------------------------------------------
 */
		var Animation = _class("core.Animation", function(duration, vars) {
				this.vars = vars = vars || {};
				this._duration = this._totalDuration = duration || 0;
				this._delay = Number(vars.delay) || 0;
				this._timeScale = 1;
				this._active = (vars.immediateRender === true);
				this.data = vars.data;
				this._reversed = (vars.reversed === true);

				if (!_rootTimeline) {
					return;
				}
				if (!_tickerActive) { //some browsers (like iOS 6 Safari) shut down JavaScript execution when the tab is disabled and they [occasionally] neglect to start up requestAnimationFrame again when returning - this code ensures that the engine starts up again properly.
					_ticker.wake();
				}

				var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
				tl.add(this, tl._time);

				if (this.vars.paused) {
					this.paused(true);
				}
			});

		_ticker = Animation.ticker = new gs.Ticker();
		p = Animation.prototype;
		p._dirty = p._gc = p._initted = p._paused = false;
		p._totalTime = p._time = 0;
		p._rawPrevTime = -1;
		p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
		p._paused = false;


		//some browsers (like iOS) occasionally drop the requestAnimationFrame event when the user switches to a different tab and then comes back again, so we use a 2-second setTimeout() to sense if/when that condition occurs and then wake() the ticker.
		var _checkTimeout = function() {
				if (_tickerActive && _getTime() - _lastUpdate > 2000) {
					_ticker.wake();
				}
				setTimeout(_checkTimeout, 2000);
			};
		_checkTimeout();


		p.play = function(from, suppressEvents) {
			if (from != null) {
				this.seek(from, suppressEvents);
			}
			return this.reversed(false).paused(false);
		};

		p.pause = function(atTime, suppressEvents) {
			if (atTime != null) {
				this.seek(atTime, suppressEvents);
			}
			return this.paused(true);
		};

		p.resume = function(from, suppressEvents) {
			if (from != null) {
				this.seek(from, suppressEvents);
			}
			return this.paused(false);
		};

		p.seek = function(time, suppressEvents) {
			return this.totalTime(Number(time), suppressEvents !== false);
		};

		p.restart = function(includeDelay, suppressEvents) {
			return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, (suppressEvents !== false), true);
		};

		p.reverse = function(from, suppressEvents) {
			if (from != null) {
				this.seek((from || this.totalDuration()), suppressEvents);
			}
			return this.reversed(true).paused(false);
		};

		p.render = function(time, suppressEvents, force) {
			//stub - we override this method in subclasses.
		};

		p.invalidate = function() {
			return this;
		};

		p.isActive = function() {
			var tl = this._timeline, //the 2 root timelines won't have a _timeline; they're always active.
				startTime = this._startTime,
				rawTime;
			return (!tl || (!this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime()) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale));
		};

		p._enabled = function (enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			this._gc = !enabled;
			this._active = this.isActive();
			if (ignoreTimeline !== true) {
				if (enabled && !this.timeline) {
					this._timeline.add(this, this._startTime - this._delay);
				} else if (!enabled && this.timeline) {
					this._timeline._remove(this, true);
				}
			}
			return false;
		};


		p._kill = function(vars, target) {
			return this._enabled(false, false);
		};

		p.kill = function(vars, target) {
			this._kill(vars, target);
			return this;
		};

		p._uncache = function(includeSelf) {
			var tween = includeSelf ? this : this.timeline;
			while (tween) {
				tween._dirty = true;
				tween = tween.timeline;
			}
			return this;
		};

		p._swapSelfInParams = function(params) {
			var i = params.length,
				copy = params.concat();
			while (--i > -1) {
				if (params[i] === "{self}") {
					copy[i] = this;
				}
			}
			return copy;
		};

//----Animation getters/setters --------------------------------------------------------

		p.eventCallback = function(type, callback, params, scope) {
			if ((type || "").substr(0,2) === "on") {
				var v = this.vars;
				if (arguments.length === 1) {
					return v[type];
				}
				if (callback == null) {
					delete v[type];
				} else {
					v[type] = callback;
					v[type + "Params"] = (_isArray(params) && params.join("").indexOf("{self}") !== -1) ? this._swapSelfInParams(params) : params;
					v[type + "Scope"] = scope;
				}
				if (type === "onUpdate") {
					this._onUpdate = callback;
				}
			}
			return this;
		};

		p.delay = function(value) {
			if (!arguments.length) {
				return this._delay;
			}
			if (this._timeline.smoothChildTiming) {
				this.startTime( this._startTime + value - this._delay );
			}
			this._delay = value;
			return this;
		};

		p.duration = function(value) {
			if (!arguments.length) {
				this._dirty = false;
				return this._duration;
			}
			this._duration = this._totalDuration = value;
			this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.
			if (this._timeline.smoothChildTiming) if (this._time > 0) if (this._time < this._duration) if (value !== 0) {
				this.totalTime(this._totalTime * (value / this._duration), true);
			}
			return this;
		};

		p.totalDuration = function(value) {
			this._dirty = false;
			return (!arguments.length) ? this._totalDuration : this.duration(value);
		};

		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			return this.totalTime((value > this._duration) ? this._duration : value, suppressEvents);
		};

		p.totalTime = function(time, suppressEvents, uncapped) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (!arguments.length) {
				return this._totalTime;
			}
			if (this._timeline) {
				if (time < 0 && !uncapped) {
					time += this.totalDuration();
				}
				if (this._timeline.smoothChildTiming) {
					if (this._dirty) {
						this.totalDuration();
					}
					var totalDuration = this._totalDuration,
						tl = this._timeline;
					if (time > totalDuration && !uncapped) {
						time = totalDuration;
					}
					this._startTime = (this._paused ? this._pauseTime : tl._time) - ((!this._reversed ? time : totalDuration - time) / this._timeScale);
					if (!tl._dirty) { //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
						this._uncache(false);
					}
					//in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The startTime of that child would get pushed out, but one of the ancestors may have completed.
					if (tl._timeline) {
						while (tl._timeline) {
							if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
								tl.totalTime(tl._totalTime, true);
							}
							tl = tl._timeline;
						}
					}
				}
				if (this._gc) {
					this._enabled(true, false);
				}
				if (this._totalTime !== time || this._duration === 0) {
					this.render(time, suppressEvents, false);
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
						_lazyRender();
					}
				}
			}
			return this;
		};

		p.progress = p.totalProgress = function(value, suppressEvents) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime(this.duration() * value, suppressEvents);
		};

		p.startTime = function(value) {
			if (!arguments.length) {
				return this._startTime;
			}
			if (value !== this._startTime) {
				this._startTime = value;
				if (this.timeline) if (this.timeline._sortChildren) {
					this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
				}
			}
			return this;
		};

		p.timeScale = function(value) {
			if (!arguments.length) {
				return this._timeScale;
			}
			value = value || _tinyNum; //can't allow zero because it'll throw the math off
			if (this._timeline && this._timeline.smoothChildTiming) {
				var pauseTime = this._pauseTime,
					t = (pauseTime || pauseTime === 0) ? pauseTime : this._timeline.totalTime();
				this._startTime = t - ((t - this._startTime) * this._timeScale / value);
			}
			this._timeScale = value;
			return this._uncache(false);
		};

		p.reversed = function(value) {
			if (!arguments.length) {
				return this._reversed;
			}
			if (value != this._reversed) {
				this._reversed = value;
				this.totalTime(((this._timeline && !this._timeline.smoothChildTiming) ? this.totalDuration() - this._totalTime : this._totalTime), true);
			}
			return this;
		};

		p.paused = function(value) {
			if (!arguments.length) {
				return this._paused;
			}
			if (value != this._paused) if (this._timeline) {
				if (!_tickerActive && !value) {
					_ticker.wake();
				}
				var tl = this._timeline,
					raw = tl.rawTime(),
					elapsed = raw - this._pauseTime;
				if (!value && tl.smoothChildTiming) {
					this._startTime += elapsed;
					this._uncache(false);
				}
				this._pauseTime = value ? raw : null;
				this._paused = value;
				this._active = this.isActive();
				if (!value && elapsed !== 0 && this._initted && this.duration()) {
					this.render((tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale), true, true); //in case the target's properties changed via some other tween or manual update by the user, we should force a render.
				}
			}
			if (this._gc && !value) {
				this._enabled(true, false);
			}
			return this;
		};


/*
 * ----------------------------------------------------------------
 * SimpleTimeline
 * ----------------------------------------------------------------
 */
		var SimpleTimeline = _class("core.SimpleTimeline", function(vars) {
			Animation.call(this, 0, vars);
			this.autoRemoveChildren = this.smoothChildTiming = true;
		});

		p = SimpleTimeline.prototype = new Animation();
		p.constructor = SimpleTimeline;
		p.kill()._gc = false;
		p._first = p._last = null;
		p._sortChildren = false;

		p.add = p.insert = function(child, position, align, stagger) {
			var prevTween, st;
			child._startTime = Number(position || 0) + child._delay;
			if (child._paused) if (this !== child._timeline) { //we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order).
				child._pauseTime = child._startTime + ((this.rawTime() - child._startTime) / child._timeScale);
			}
			if (child.timeline) {
				child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.
			}
			child.timeline = child._timeline = this;
			if (child._gc) {
				child._enabled(true, true);
			}
			prevTween = this._last;
			if (this._sortChildren) {
				st = child._startTime;
				while (prevTween && prevTween._startTime > st) {
					prevTween = prevTween._prev;
				}
			}
			if (prevTween) {
				child._next = prevTween._next;
				prevTween._next = child;
			} else {
				child._next = this._first;
				this._first = child;
			}
			if (child._next) {
				child._next._prev = child;
			} else {
				this._last = child;
			}
			child._prev = prevTween;
			if (this._timeline) {
				this._uncache(true);
			}
			return this;
		};

		p._remove = function(tween, skipDisable) {
			if (tween.timeline === this) {
				if (!skipDisable) {
					tween._enabled(false, true);
				}

				if (tween._prev) {
					tween._prev._next = tween._next;
				} else if (this._first === tween) {
					this._first = tween._next;
				}
				if (tween._next) {
					tween._next._prev = tween._prev;
				} else if (this._last === tween) {
					this._last = tween._prev;
				}
				tween._next = tween._prev = tween.timeline = null;

				if (this._timeline) {
					this._uncache(true);
				}
			}
			return this;
		};

		p.render = function(time, suppressEvents, force) {
			var tween = this._first,
				next;
			this._totalTime = this._time = this._rawPrevTime = time;
			while (tween) {
				next = tween._next; //record it here because the value could change after rendering...
				if (tween._active || (time >= tween._startTime && !tween._paused)) {
					if (!tween._reversed) {
						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
					} else {
						tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
					}
				}
				tween = next;
			}
		};

		p.rawTime = function() {
			if (!_tickerActive) {
				_ticker.wake();
			}
			return this._totalTime;
		};

/*
 * ----------------------------------------------------------------
 * TweenLite
 * ----------------------------------------------------------------
 */
		var TweenLite = _class("TweenLite", function(target, duration, vars) {
				Animation.call(this, duration, vars);
				this.render = TweenLite.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)

				if (target == null) {
					throw "Cannot tween a null target.";
				}

				this.target = target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;

				var isSelector = (target.jquery || (target.length && target !== window && target[0] && (target[0] === window || (target[0].nodeType && target[0].style && !target.nodeType)))),
					overwrite = this.vars.overwrite,
					i, targ, targets;

				this._overwrite = overwrite = (overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof(overwrite) === "number") ? overwrite >> 0 : _overwriteLookup[overwrite];

				if ((isSelector || target instanceof Array || (target.push && _isArray(target))) && typeof(target[0]) !== "number") {
					this._targets = targets = _slice(target);  //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
					this._propLookup = [];
					this._siblings = [];
					for (i = 0; i < targets.length; i++) {
						targ = targets[i];
						if (!targ) {
							targets.splice(i--, 1);
							continue;
						} else if (typeof(targ) === "string") {
							targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings
							if (typeof(targ) === "string") {
								targets.splice(i+1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
							}
							continue;
						} else if (targ.length && targ !== window && targ[0] && (targ[0] === window || (targ[0].nodeType && targ[0].style && !targ.nodeType))) { //in case the user is passing in an array of selector objects (like jQuery objects), we need to check one more level and pull things out if necessary. Also note that <select> elements pass all the criteria regarding length and the first child having style, so we must also check to ensure the target isn't an HTML node itself.
							targets.splice(i--, 1);
							this._targets = targets = targets.concat(_slice(targ));
							continue;
						}
						this._siblings[i] = _register(targ, this, false);
						if (overwrite === 1) if (this._siblings[i].length > 1) {
							_applyOverwrite(targ, this, null, 1, this._siblings[i]);
						}
					}

				} else {
					this._propLookup = {};
					this._siblings = _register(target, this, false);
					if (overwrite === 1) if (this._siblings.length > 1) {
						_applyOverwrite(target, this, null, 1, this._siblings);
					}
				}
				if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
					this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
					this.render(-this._delay);
				}
			}, true),
			_isSelector = function(v) {
				return (v.length && v !== window && v[0] && (v[0] === window || (v[0].nodeType && v[0].style && !v.nodeType))); //we cannot check "nodeType" if the target is window from within an iframe, otherwise it will trigger a security error in some browsers like Firefox.
			},
			_autoCSS = function(vars, target) {
				var css = {},
					p;
				for (p in vars) {
					if (!_reservedProps[p] && (!(p in target) || p === "transform" || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || (_plugins[p] && _plugins[p]._autoCSS))) { //note: <img> elements contain read-only "x" and "y" properties. We should also prioritize editing css width/height rather than the element's properties.
						css[p] = vars[p];
						delete vars[p];
					}
				}
				vars.css = css;
			};

		p = TweenLite.prototype = new Animation();
		p.constructor = TweenLite;
		p.kill()._gc = false;

//----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------

		p.ratio = 0;
		p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
		p._notifyPluginsOfEnabled = p._lazy = false;

		TweenLite.version = "1.13.1";
		TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
		TweenLite.defaultOverwrite = "auto";
		TweenLite.ticker = _ticker;
		TweenLite.autoSleep = true;
		TweenLite.lagSmoothing = function(threshold, adjustedLag) {
			_ticker.lagSmoothing(threshold, adjustedLag);
		};

		TweenLite.selector = window.$ || window.jQuery || function(e) {
			var selector = window.$ || window.jQuery;
			if (selector) {
				TweenLite.selector = selector;
				return selector(e);
			}
			return (typeof(document) === "undefined") ? e : (document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById((e.charAt(0) === "#") ? e.substr(1) : e));
		};

		var _lazyTweens = [],
			_lazyLookup = {},
			_internals = TweenLite._internals = {isArray:_isArray, isSelector:_isSelector, lazyTweens:_lazyTweens}, //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
			_plugins = TweenLite._plugins = {},
			_tweenLookup = _internals.tweenLookup = {},
			_tweenLookupNum = 0,
			_reservedProps = _internals.reservedProps = {ease:1, delay:1, overwrite:1, onComplete:1, onCompleteParams:1, onCompleteScope:1, useFrames:1, runBackwards:1, startAt:1, onUpdate:1, onUpdateParams:1, onUpdateScope:1, onStart:1, onStartParams:1, onStartScope:1, onReverseComplete:1, onReverseCompleteParams:1, onReverseCompleteScope:1, onRepeat:1, onRepeatParams:1, onRepeatScope:1, easeParams:1, yoyo:1, immediateRender:1, repeat:1, repeatDelay:1, data:1, paused:1, reversed:1, autoCSS:1, lazy:1},
			_overwriteLookup = {none:0, all:1, auto:2, concurrent:3, allOnStart:4, preexisting:5, "true":1, "false":0},
			_rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
			_rootTimeline = Animation._rootTimeline = new SimpleTimeline(),
			_lazyRender = _internals.lazyRender = function() {
				var i = _lazyTweens.length;
				_lazyLookup = {};
				while (--i > -1) {
					a = _lazyTweens[i];
					if (a && a._lazy !== false) {
						a.render(a._lazy, false, true);
						a._lazy = false;
					}
				}
				_lazyTweens.length = 0;
			};

		_rootTimeline._startTime = _ticker.time;
		_rootFramesTimeline._startTime = _ticker.frame;
		_rootTimeline._active = _rootFramesTimeline._active = true;
		setTimeout(_lazyRender, 1); //on some mobile devices, there isn't a "tick" before code runs which means any lazy renders wouldn't run before the next official "tick".

		Animation._updateRoot = TweenLite.render = function() {
				var i, a, p;
				if (_lazyTweens.length) { //if code is run outside of the requestAnimationFrame loop, there may be tweens queued AFTER the engine refreshed, so we need to ensure any pending renders occur before we refresh again.
					_lazyRender();
				}
				_rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
				_rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
				if (_lazyTweens.length) {
					_lazyRender();
				}
				if (!(_ticker.frame % 120)) { //dump garbage every 120 frames...
					for (p in _tweenLookup) {
						a = _tweenLookup[p].tweens;
						i = a.length;
						while (--i > -1) {
							if (a[i]._gc) {
								a.splice(i, 1);
							}
						}
						if (a.length === 0) {
							delete _tweenLookup[p];
						}
					}
					//if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly
					p = _rootTimeline._first;
					if (!p || p._paused) if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
						while (p && p._paused) {
							p = p._next;
						}
						if (!p) {
							_ticker.sleep();
						}
					}
				}
			};

		_ticker.addEventListener("tick", Animation._updateRoot);

		var _register = function(target, tween, scrub) {
				var id = target._gsTweenID, a, i;
				if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
					_tweenLookup[id] = {target:target, tweens:[]};
				}
				if (tween) {
					a = _tweenLookup[id].tweens;
					a[(i = a.length)] = tween;
					if (scrub) {
						while (--i > -1) {
							if (a[i] === tween) {
								a.splice(i, 1);
							}
						}
					}
				}
				return _tweenLookup[id].tweens;
			},

			_applyOverwrite = function(target, tween, props, mode, siblings) {
				var i, changed, curTween, l;
				if (mode === 1 || mode >= 4) {
					l = siblings.length;
					for (i = 0; i < l; i++) {
						if ((curTween = siblings[i]) !== tween) {
							if (!curTween._gc) if (curTween._enabled(false, false)) {
								changed = true;
							}
						} else if (mode === 5) {
							break;
						}
					}
					return changed;
				}
				//NOTE: Add 0.0000000001 to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
				var startTime = tween._startTime + _tinyNum,
					overlaps = [],
					oCount = 0,
					zeroDur = (tween._duration === 0),
					globalStart;
				i = siblings.length;
				while (--i > -1) {
					if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {
						//ignore
					} else if (curTween._timeline !== tween._timeline) {
						globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
						if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
							overlaps[oCount++] = curTween;
						}
					} else if (curTween._startTime <= startTime) if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime) if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 0.0000000002)) {
						overlaps[oCount++] = curTween;
					}
				}

				i = oCount;
				while (--i > -1) {
					curTween = overlaps[i];
					if (mode === 2) if (curTween._kill(props, target)) {
						changed = true;
					}
					if (mode !== 2 || (!curTween._firstPT && curTween._initted)) {
						if (curTween._enabled(false, false)) { //if all property tweens have been overwritten, kill the tween.
							changed = true;
						}
					}
				}
				return changed;
			},

			_checkOverlap = function(tween, reference, zeroDur) {
				var tl = tween._timeline,
					ts = tl._timeScale,
					t = tween._startTime;
				while (tl._timeline) {
					t += tl._startTime;
					ts *= tl._timeScale;
					if (tl._paused) {
						return -100;
					}
					tl = tl._timeline;
				}
				t /= ts;
				return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 2 * _tinyNum)) ? _tinyNum : ((t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum) ? 0 : t - reference - _tinyNum;
			};


//---- TweenLite instance methods -----------------------------------------------------------------------------

		p._init = function() {
			var v = this.vars,
				op = this._overwrittenProps,
				dur = this._duration,
				immediate = !!v.immediateRender,
				ease = v.ease,
				i, initPlugins, pt, p, startVars;
			if (v.startAt) {
				if (this._startAt) {
					this._startAt.render(-1, true); //if we've run a startAt previously (when the tween instantiated), we should revert it so that the values re-instantiate correctly particularly for relative tweens. Without this, a TweenLite.fromTo(obj, 1, {x:"+=100"}, {x:"-=100"}), for example, would actually jump to +=200 because the startAt would run twice, doubling the relative change.
					this._startAt.kill();
				}
				startVars = {};
				for (p in v.startAt) { //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, 1, from, to).fromTo(e, 1, to, from);
					startVars[p] = v.startAt[p];
				}
				startVars.overwrite = false;
				startVars.immediateRender = true;
				startVars.lazy = (immediate && v.lazy !== false);
				startVars.startAt = startVars.delay = null; //no nesting of startAt objects allowed (otherwise it could cause an infinite loop).
				this._startAt = TweenLite.to(this.target, 0, startVars);
				if (immediate) {
					if (this._time > 0) {
						this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
					} else if (dur !== 0) {
						return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
					}
				}
			} else if (v.runBackwards && dur !== 0) {
				//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
				if (this._startAt) {
					this._startAt.render(-1, true);
					this._startAt.kill();
					this._startAt = null;
				} else {
					pt = {};
					for (p in v) { //copy props into a new object and skip any reserved props, otherwise onComplete or onUpdate or onStart could fire. We should, however, permit autoCSS to go through.
						if (!_reservedProps[p] || p === "autoCSS") {
							pt[p] = v[p];
						}
					}
					pt.overwrite = 0;
					pt.data = "isFromStart"; //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
					pt.lazy = (immediate && v.lazy !== false);
					pt.immediateRender = immediate; //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
					this._startAt = TweenLite.to(this.target, 0, pt);
					if (!immediate) {
						this._startAt._init(); //ensures that the initial values are recorded
						this._startAt._enabled(false); //no need to have the tween render on the next cycle. Disable it because we'll always manually control the renders of the _startAt tween.
					} else if (this._time === 0) {
						return;
					}
				}
			}
			this._ease = ease = (!ease) ? TweenLite.defaultEase : (ease instanceof Ease) ? ease : (typeof(ease) === "function") ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
			if (v.easeParams instanceof Array && ease.config) {
				this._ease = ease.config.apply(ease, v.easeParams);
			}
			this._easeType = this._ease._type;
			this._easePower = this._ease._power;
			this._firstPT = null;

			if (this._targets) {
				i = this._targets.length;
				while (--i > -1) {
					if ( this._initProps( this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (op ? op[i] : null)) ) {
						initPlugins = true;
					}
				}
			} else {
				initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op);
			}

			if (initPlugins) {
				TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
			}
			if (op) if (!this._firstPT) if (typeof(this.target) !== "function") { //if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
				this._enabled(false, false);
			}
			if (v.runBackwards) {
				pt = this._firstPT;
				while (pt) {
					pt.s += pt.c;
					pt.c = -pt.c;
					pt = pt._next;
				}
			}
			this._onUpdate = v.onUpdate;
			this._initted = true;
		};

		p._initProps = function(target, propLookup, siblings, overwrittenProps) {
			var p, i, initPlugins, plugin, pt, v;
			if (target == null) {
				return false;
			}

			if (_lazyLookup[target._gsTweenID]) {
				_lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
			}

			if (!this.vars.css) if (target.style) if (target !== window && target.nodeType) if (_plugins.css) if (this.vars.autoCSS !== false) { //it's so common to use TweenLite/Max to animate the css of DOM elements, we assume that if the target is a DOM element, that's what is intended (a convenience so that users don't have to wrap things in css:{}, although we still recommend it for a slight performance boost and better specificity). Note: we cannot check "nodeType" on the window inside an iframe.
				_autoCSS(this.vars, target);
			}
			for (p in this.vars) {
				v = this.vars[p];
				if (_reservedProps[p]) {
					if (v) if ((v instanceof Array) || (v.push && _isArray(v))) if (v.join("").indexOf("{self}") !== -1) {
						this.vars[p] = v = this._swapSelfInParams(v, this);
					}

				} else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this)) {

					//t - target 		[object]
					//p - property 		[string]
					//s - start			[number]
					//c - change		[number]
					//f - isFunction	[boolean]
					//n - name			[string]
					//pg - isPlugin 	[boolean]
					//pr - priority		[number]
					this._firstPT = pt = {_next:this._firstPT, t:plugin, p:"setRatio", s:0, c:1, f:true, n:p, pg:true, pr:plugin._priority};
					i = plugin._overwriteProps.length;
					while (--i > -1) {
						propLookup[plugin._overwriteProps[i]] = this._firstPT;
					}
					if (plugin._priority || plugin._onInitAllProps) {
						initPlugins = true;
					}
					if (plugin._onDisable || plugin._onEnable) {
						this._notifyPluginsOfEnabled = true;
					}

				} else {
					this._firstPT = propLookup[p] = pt = {_next:this._firstPT, t:target, p:p, f:(typeof(target[p]) === "function"), n:p, pg:false, pr:0};
					pt.s = (!pt.f) ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
					pt.c = (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : (Number(v) - pt.s) || 0;
				}
				if (pt) if (pt._next) {
					pt._next._prev = pt;
				}
			}

			if (overwrittenProps) if (this._kill(overwrittenProps, target)) { //another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
				return this._initProps(target, propLookup, siblings, overwrittenProps);
			}
			if (this._overwrite > 1) if (this._firstPT) if (siblings.length > 1) if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
				this._kill(propLookup, target);
				return this._initProps(target, propLookup, siblings, overwrittenProps);
			}
			if (this._firstPT) if ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration)) { //zero duration tweens don't lazy render by default; everything else does.
				_lazyLookup[target._gsTweenID] = true;
			}
			return initPlugins;
		};

		p.render = function(time, suppressEvents, force) {
			var prevTime = this._time,
				duration = this._duration,
				prevRawPrevTime = this._rawPrevTime,
				isComplete, callback, pt, rawPrevTime;
			if (time >= duration) {
				this._totalTime = this._time = duration;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
				if (!this._reversed ) {
					isComplete = true;
					callback = "onComplete";
				}
				if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (this._startTime === this._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
						time = 0;
					}
					if (time === 0 || prevRawPrevTime < 0 || prevRawPrevTime === _tinyNum) if (prevRawPrevTime !== time) {
						force = true;
						if (prevRawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
					this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				}

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = 0;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				if (prevTime !== 0 || (duration === 0 && prevRawPrevTime > 0 && prevRawPrevTime !== _tinyNum)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (prevRawPrevTime >= 0) {
							force = true;
						}
						this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					}
				} else if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
					force = true;
				}
			} else {
				this._totalTime = this._time = time;

				if (this._easeType) {
					var r = time / duration, type = this._easeType, pow = this._easePower;
					if (type === 1 || (type === 3 && r >= 0.5)) {
						r = 1 - r;
					}
					if (type === 3) {
						r *= 2;
					}
					if (pow === 1) {
						r *= r;
					} else if (pow === 2) {
						r *= r * r;
					} else if (pow === 3) {
						r *= r * r * r;
					} else if (pow === 4) {
						r *= r * r * r * r;
					}

					if (type === 1) {
						this.ratio = 1 - r;
					} else if (type === 2) {
						this.ratio = r;
					} else if (time / duration < 0.5) {
						this.ratio = r / 2;
					} else {
						this.ratio = 1 - (r / 2);
					}

				} else {
					this.ratio = this._ease.getRatio(time / duration);
				}
			}

			if (this._time === prevTime && !force) {
				return;
			} else if (!this._initted) {
				this._init();
				if (!this._initted || this._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
					return;
				} else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) {
					this._time = this._totalTime = prevTime;
					this._rawPrevTime = prevRawPrevTime;
					_lazyTweens.push(this);
					this._lazy = time;
					return;
				}
				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
				if (this._time && !isComplete) {
					this.ratio = this._ease.getRatio(this._time / duration);
				} else if (isComplete && this._ease._calcEnd) {
					this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
				}
			}
			if (this._lazy !== false) { //in case a lazy render is pending, we should flush it because the new render is occurring now (imagine a lazy tween instantiating and then immediately the user calls tween.seek(tween.duration()), skipping to the end - the end render would be forced, and then if we didn't flush the lazy render, it'd fire AFTER the seek(), rendering it at the wrong time.
				this._lazy = false;
			}
			if (!this._active) if (!this._paused && this._time !== prevTime && time >= 0) {
				this._active = true;  //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
			}
			if (prevTime === 0) {
				if (this._startAt) {
					if (time >= 0) {
						this._startAt.render(time, suppressEvents, force);
					} else if (!callback) {
						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
					}
				}
				if (this.vars.onStart) if (this._time !== 0 || duration === 0) if (!suppressEvents) {
					this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _blankArray);
				}
			}
			pt = this._firstPT;
			while (pt) {
				if (pt.f) {
					pt.t[pt.p](pt.c * this.ratio + pt.s);
				} else {
					pt.t[pt.p] = pt.c * this.ratio + pt.s;
				}
				pt = pt._next;
			}

			if (this._onUpdate) {
				if (time < 0) if (this._startAt && this._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
				}
				if (!suppressEvents) if (this._time !== prevTime || isComplete) {
					this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
				}
			}

			if (callback) if (!this._gc || force) { //check _gc because there's a chance that kill() could be called in an onUpdate
				if (time < 0 && this._startAt && !this._onUpdate && this._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force);
				}
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this.vars[callback].apply(this.vars[callback + "Scope"] || this, this.vars[callback + "Params"] || _blankArray);
				}
				if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
					this._rawPrevTime = 0;
				}
			}
		};

		p._kill = function(vars, target) {
			if (vars === "all") {
				vars = null;
			}
			if (vars == null) if (target == null || target === this.target) {
				this._lazy = false;
				return this._enabled(false, false);
			}
			target = (typeof(target) !== "string") ? (target || this._targets || this.target) : TweenLite.selector(target) || target;
			var i, overwrittenProps, p, pt, propLookup, changed, killProps, record;
			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				while (--i > -1) {
					if (this._kill(vars, target[i])) {
						changed = true;
					}
				}
			} else {
				if (this._targets) {
					i = this._targets.length;
					while (--i > -1) {
						if (target === this._targets[i]) {
							propLookup = this._propLookup[i] || {};
							this._overwrittenProps = this._overwrittenProps || [];
							overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
							break;
						}
					}
				} else if (target !== this.target) {
					return false;
				} else {
					propLookup = this._propLookup;
					overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
				}

				if (propLookup) {
					killProps = vars || propLookup;
					record = (vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (typeof(vars) !== "object" || !vars._tempKill)); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
					for (p in killProps) {
						if ((pt = propLookup[p])) {
							if (pt.pg && pt.t._kill(killProps)) {
								changed = true; //some plugins need to be notified so they can perform cleanup tasks first
							}
							if (!pt.pg || pt.t._overwriteProps.length === 0) {
								if (pt._prev) {
									pt._prev._next = pt._next;
								} else if (pt === this._firstPT) {
									this._firstPT = pt._next;
								}
								if (pt._next) {
									pt._next._prev = pt._prev;
								}
								pt._next = pt._prev = null;
							}
							delete propLookup[p];
						}
						if (record) {
							overwrittenProps[p] = 1;
						}
					}
					if (!this._firstPT && this._initted) { //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
						this._enabled(false, false);
					}
				}
			}
			return changed;
		};

		p.invalidate = function() {
			if (this._notifyPluginsOfEnabled) {
				TweenLite._onPluginEvent("_onDisable", this);
			}
			this._firstPT = null;
			this._overwrittenProps = null;
			this._onUpdate = null;
			this._startAt = null;
			this._initted = this._active = this._notifyPluginsOfEnabled = this._lazy = false;
			this._propLookup = (this._targets) ? {} : [];
			return this;
		};

		p._enabled = function(enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (enabled && this._gc) {
				var targets = this._targets,
					i;
				if (targets) {
					i = targets.length;
					while (--i > -1) {
						this._siblings[i] = _register(targets[i], this, true);
					}
				} else {
					this._siblings = _register(this.target, this, true);
				}
			}
			Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
			if (this._notifyPluginsOfEnabled) if (this._firstPT) {
				return TweenLite._onPluginEvent((enabled ? "_onEnable" : "_onDisable"), this);
			}
			return false;
		};


//----TweenLite static methods -----------------------------------------------------

		TweenLite.to = function(target, duration, vars) {
			return new TweenLite(target, duration, vars);
		};

		TweenLite.from = function(target, duration, vars) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return new TweenLite(target, duration, vars);
		};

		TweenLite.fromTo = function(target, duration, fromVars, toVars) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return new TweenLite(target, duration, toVars);
		};

		TweenLite.delayedCall = function(delay, callback, params, scope, useFrames) {
			return new TweenLite(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, onCompleteScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, onReverseCompleteScope:scope, immediateRender:false, useFrames:useFrames, overwrite:0});
		};

		TweenLite.set = function(target, vars) {
			return new TweenLite(target, 0, vars);
		};

		TweenLite.getTweensOf = function(target, onlyActive) {
			if (target == null) { return []; }
			target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
			var i, a, j, t;
			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				a = [];
				while (--i > -1) {
					a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
				}
				i = a.length;
				//now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
				while (--i > -1) {
					t = a[i];
					j = i;
					while (--j > -1) {
						if (t === a[j]) {
							a.splice(i, 1);
						}
					}
				}
			} else {
				a = _register(target).concat();
				i = a.length;
				while (--i > -1) {
					if (a[i]._gc || (onlyActive && !a[i].isActive())) {
						a.splice(i, 1);
					}
				}
			}
			return a;
		};

		TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function(target, onlyActive, vars) {
			if (typeof(onlyActive) === "object") {
				vars = onlyActive; //for backwards compatibility (before "onlyActive" parameter was inserted)
				onlyActive = false;
			}
			var a = TweenLite.getTweensOf(target, onlyActive),
				i = a.length;
			while (--i > -1) {
				a[i]._kill(vars, target);
			}
		};



/*
 * ----------------------------------------------------------------
 * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another <script> call before loading plugins which is easy to forget)
 * ----------------------------------------------------------------
 */
		var TweenPlugin = _class("plugins.TweenPlugin", function(props, priority) {
					this._overwriteProps = (props || "").split(",");
					this._propName = this._overwriteProps[0];
					this._priority = priority || 0;
					this._super = TweenPlugin.prototype;
				}, true);

		p = TweenPlugin.prototype;
		TweenPlugin.version = "1.10.1";
		TweenPlugin.API = 2;
		p._firstPT = null;

		p._addTween = function(target, prop, start, end, overwriteProp, round) {
			var c, pt;
			if (end != null && (c = (typeof(end) === "number" || end.charAt(1) !== "=") ? Number(end) - start : parseInt(end.charAt(0) + "1", 10) * Number(end.substr(2)))) {
				this._firstPT = pt = {_next:this._firstPT, t:target, p:prop, s:start, c:c, f:(typeof(target[prop]) === "function"), n:overwriteProp || prop, r:round};
				if (pt._next) {
					pt._next._prev = pt;
				}
				return pt;
			}
		};

		p.setRatio = function(v) {
			var pt = this._firstPT,
				min = 0.000001,
				val;
			while (pt) {
				val = pt.c * v + pt.s;
				if (pt.r) {
					val = Math.round(val);
				} else if (val < min) if (val > -min) { //prevents issues with converting very small numbers to strings in the browser
					val = 0;
				}
				if (pt.f) {
					pt.t[pt.p](val);
				} else {
					pt.t[pt.p] = val;
				}
				pt = pt._next;
			}
		};

		p._kill = function(lookup) {
			var a = this._overwriteProps,
				pt = this._firstPT,
				i;
			if (lookup[this._propName] != null) {
				this._overwriteProps = [];
			} else {
				i = a.length;
				while (--i > -1) {
					if (lookup[a[i]] != null) {
						a.splice(i, 1);
					}
				}
			}
			while (pt) {
				if (lookup[pt.n] != null) {
					if (pt._next) {
						pt._next._prev = pt._prev;
					}
					if (pt._prev) {
						pt._prev._next = pt._next;
						pt._prev = null;
					} else if (this._firstPT === pt) {
						this._firstPT = pt._next;
					}
				}
				pt = pt._next;
			}
			return false;
		};

		p._roundProps = function(lookup, value) {
			var pt = this._firstPT;
			while (pt) {
				if (lookup[this._propName] || (pt.n != null && lookup[ pt.n.split(this._propName + "_").join("") ])) { //some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
					pt.r = value;
				}
				pt = pt._next;
			}
		};

		TweenLite._onPluginEvent = function(type, tween) {
			var pt = tween._firstPT,
				changed, pt2, first, last, next;
			if (type === "_onInitAllProps") {
				//sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
				while (pt) {
					next = pt._next;
					pt2 = first;
					while (pt2 && pt2.pr > pt.pr) {
						pt2 = pt2._next;
					}
					if ((pt._prev = pt2 ? pt2._prev : last)) {
						pt._prev._next = pt;
					} else {
						first = pt;
					}
					if ((pt._next = pt2)) {
						pt2._prev = pt;
					} else {
						last = pt;
					}
					pt = next;
				}
				pt = tween._firstPT = first;
			}
			while (pt) {
				if (pt.pg) if (typeof(pt.t[type]) === "function") if (pt.t[type]()) {
					changed = true;
				}
				pt = pt._next;
			}
			return changed;
		};

		TweenPlugin.activate = function(plugins) {
			var i = plugins.length;
			while (--i > -1) {
				if (plugins[i].API === TweenPlugin.API) {
					_plugins[(new plugins[i]())._propName] = plugins[i];
				}
			}
			return true;
		};

		//provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.
		_gsDefine.plugin = function(config) {
			if (!config || !config.propName || !config.init || !config.API) { throw "illegal plugin definition."; }
			var propName = config.propName,
				priority = config.priority || 0,
				overwriteProps = config.overwriteProps,
				map = {init:"_onInitTween", set:"setRatio", kill:"_kill", round:"_roundProps", initAll:"_onInitAllProps"},
				Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin",
					function() {
						TweenPlugin.call(this, propName, priority);
						this._overwriteProps = overwriteProps || [];
					}, (config.global === true)),
				p = Plugin.prototype = new TweenPlugin(propName),
				prop;
			p.constructor = Plugin;
			Plugin.API = config.API;
			for (prop in map) {
				if (typeof(config[prop]) === "function") {
					p[map[prop]] = config[prop];
				}
			}
			Plugin.version = config.version;
			TweenPlugin.activate([Plugin]);
			return Plugin;
		};


		//now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.
		a = window._gsQueue;
		if (a) {
			for (i = 0; i < a.length; i++) {
				a[i]();
			}
			for (p in _defLookup) {
				if (!_defLookup[p].func) {
					window.console.log("GSAP encountered missing dependency: com.greensock." + p);
				}
			}
		}

		_tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated

})((typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window, "TweenLite");;/*!
 * VERSION: beta 1.9.4
 * DATE: 2014-07-17
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("easing.Back",["easing.Ease"],function(t){var e,i,s,r=_gsScope.GreenSockGlobals||_gsScope,n=r.com.greensock,a=2*Math.PI,o=Math.PI/2,h=n._class,l=function(e,i){var s=h("easing."+e,function(){},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,s},_=t.register||function(){},u=function(t,e,i,s){var r=h("easing."+t,{easeOut:new e,easeIn:new i,easeInOut:new s},!0);return _(r,t),r},c=function(t,e,i){this.t=t,this.v=e,i&&(this.next=i,i.prev=this,this.c=i.v-e,this.gap=i.t-t)},p=function(e,i){var s=h("easing."+e,function(t){this._p1=t||0===t?t:1.70158,this._p2=1.525*this._p1},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,r.config=function(t){return new s(t)},s},f=u("Back",p("BackOut",function(t){return(t-=1)*t*((this._p1+1)*t+this._p1)+1}),p("BackIn",function(t){return t*t*((this._p1+1)*t-this._p1)}),p("BackInOut",function(t){return 1>(t*=2)?.5*t*t*((this._p2+1)*t-this._p2):.5*((t-=2)*t*((this._p2+1)*t+this._p2)+2)})),m=h("easing.SlowMo",function(t,e,i){e=e||0===e?e:.7,null==t?t=.7:t>1&&(t=1),this._p=1!==t?e:0,this._p1=(1-t)/2,this._p2=t,this._p3=this._p1+this._p2,this._calcEnd=i===!0},!0),d=m.prototype=new t;return d.constructor=m,d.getRatio=function(t){var e=t+(.5-t)*this._p;return this._p1>t?this._calcEnd?1-(t=1-t/this._p1)*t:e-(t=1-t/this._p1)*t*t*t*e:t>this._p3?this._calcEnd?1-(t=(t-this._p3)/this._p1)*t:e+(t-e)*(t=(t-this._p3)/this._p1)*t*t*t:this._calcEnd?1:e},m.ease=new m(.7,.7),d.config=m.config=function(t,e,i){return new m(t,e,i)},e=h("easing.SteppedEase",function(t){t=t||1,this._p1=1/t,this._p2=t+1},!0),d=e.prototype=new t,d.constructor=e,d.getRatio=function(t){return 0>t?t=0:t>=1&&(t=.999999999),(this._p2*t>>0)*this._p1},d.config=e.config=function(t){return new e(t)},i=h("easing.RoughEase",function(e){e=e||{};for(var i,s,r,n,a,o,h=e.taper||"none",l=[],_=0,u=0|(e.points||20),p=u,f=e.randomize!==!1,m=e.clamp===!0,d=e.template instanceof t?e.template:null,g="number"==typeof e.strength?.4*e.strength:.4;--p>-1;)i=f?Math.random():1/u*p,s=d?d.getRatio(i):i,"none"===h?r=g:"out"===h?(n=1-i,r=n*n*g):"in"===h?r=i*i*g:.5>i?(n=2*i,r=.5*n*n*g):(n=2*(1-i),r=.5*n*n*g),f?s+=Math.random()*r-.5*r:p%2?s+=.5*r:s-=.5*r,m&&(s>1?s=1:0>s&&(s=0)),l[_++]={x:i,y:s};for(l.sort(function(t,e){return t.x-e.x}),o=new c(1,1,null),p=u;--p>-1;)a=l[p],o=new c(a.x,a.y,o);this._prev=new c(0,0,0!==o.t?o:o.next)},!0),d=i.prototype=new t,d.constructor=i,d.getRatio=function(t){var e=this._prev;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&e.t>=t;)e=e.prev;return this._prev=e,e.v+(t-e.t)/e.gap*e.c},d.config=function(t){return new i(t)},i.ease=new i,u("Bounce",l("BounceOut",function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}),l("BounceIn",function(t){return 1/2.75>(t=1-t)?1-7.5625*t*t:2/2.75>t?1-(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1-(7.5625*(t-=2.25/2.75)*t+.9375):1-(7.5625*(t-=2.625/2.75)*t+.984375)}),l("BounceInOut",function(t){var e=.5>t;return t=e?1-2*t:2*t-1,t=1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,e?.5*(1-t):.5*t+.5})),u("Circ",l("CircOut",function(t){return Math.sqrt(1-(t-=1)*t)}),l("CircIn",function(t){return-(Math.sqrt(1-t*t)-1)}),l("CircInOut",function(t){return 1>(t*=2)?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)})),s=function(e,i,s){var r=h("easing."+e,function(t,e){this._p1=t||1,this._p2=e||s,this._p3=this._p2/a*(Math.asin(1/this._p1)||0)},!0),n=r.prototype=new t;return n.constructor=r,n.getRatio=i,n.config=function(t,e){return new r(t,e)},r},u("Elastic",s("ElasticOut",function(t){return this._p1*Math.pow(2,-10*t)*Math.sin((t-this._p3)*a/this._p2)+1},.3),s("ElasticIn",function(t){return-(this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2))},.3),s("ElasticInOut",function(t){return 1>(t*=2)?-.5*this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2):.5*this._p1*Math.pow(2,-10*(t-=1))*Math.sin((t-this._p3)*a/this._p2)+1},.45)),u("Expo",l("ExpoOut",function(t){return 1-Math.pow(2,-10*t)}),l("ExpoIn",function(t){return Math.pow(2,10*(t-1))-.001}),l("ExpoInOut",function(t){return 1>(t*=2)?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))})),u("Sine",l("SineOut",function(t){return Math.sin(t*o)}),l("SineIn",function(t){return-Math.cos(t*o)+1}),l("SineInOut",function(t){return-.5*(Math.cos(Math.PI*t)-1)})),h("easing.EaseLookup",{find:function(e){return t.map[e]}},!0),_(r.SlowMo,"SlowMo","ease,"),_(i,"RoughEase","ease,"),_(e,"SteppedEase","ease,"),f},!0)}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()();;/* mousetrap v1.6.5 craig.is/killing/mice */
(function(q,u,c){function v(a,b,g){a.addEventListener?a.addEventListener(b,g,!1):a.attachEvent("on"+b,g)}function z(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return n[a.which]?n[a.which]:r[a.which]?r[a.which]:String.fromCharCode(a.which).toLowerCase()}function F(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function w(a){return"shift"==a||"ctrl"==a||"alt"==a||
"meta"==a}function A(a,b){var g,d=[];var e=a;"+"===e?e=["+"]:(e=e.replace(/\+{2}/g,"+plus"),e=e.split("+"));for(g=0;g<e.length;++g){var m=e[g];B[m]&&(m=B[m]);b&&"keypress"!=b&&C[m]&&(m=C[m],d.push("shift"));w(m)&&d.push(m)}e=m;g=b;if(!g){if(!p){p={};for(var c in n)95<c&&112>c||n.hasOwnProperty(c)&&(p[n[c]]=c)}g=p[e]?"keydown":"keypress"}"keypress"==g&&d.length&&(g="keydown");return{key:m,modifiers:d,action:g}}function D(a,b){return null===a||a===u?!1:a===b?!0:D(a.parentNode,b)}function d(a){function b(a){a=
a||{};var b=!1,l;for(l in p)a[l]?b=!0:p[l]=0;b||(x=!1)}function g(a,b,t,f,g,d){var l,E=[],h=t.type;if(!k._callbacks[a])return[];"keyup"==h&&w(a)&&(b=[a]);for(l=0;l<k._callbacks[a].length;++l){var c=k._callbacks[a][l];if((f||!c.seq||p[c.seq]==c.level)&&h==c.action){var e;(e="keypress"==h&&!t.metaKey&&!t.ctrlKey)||(e=c.modifiers,e=b.sort().join(",")===e.sort().join(","));e&&(e=f&&c.seq==f&&c.level==d,(!f&&c.combo==g||e)&&k._callbacks[a].splice(l,1),E.push(c))}}return E}function c(a,b,c,f){k.stopCallback(b,
b.target||b.srcElement,c,f)||!1!==a(b,c)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?b.stopPropagation():b.cancelBubble=!0)}function e(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=z(a);b&&("keyup"==a.type&&y===b?y=!1:k.handleKey(b,F(a),a))}function m(a,g,t,f){function h(c){return function(){x=c;++p[a];clearTimeout(q);q=setTimeout(b,1E3)}}function l(g){c(t,g,a);"keyup"!==f&&(y=z(g));setTimeout(b,10)}for(var d=p[a]=0;d<g.length;++d){var e=d+1===g.length?l:h(f||
A(g[d+1]).action);n(g[d],e,f,a,d)}}function n(a,b,c,f,d){k._directMap[a+":"+c]=b;a=a.replace(/\s+/g," ");var e=a.split(" ");1<e.length?m(a,e,b,c):(c=A(a,c),k._callbacks[c.key]=k._callbacks[c.key]||[],g(c.key,c.modifiers,{type:c.action},f,a,d),k._callbacks[c.key][f?"unshift":"push"]({callback:b,modifiers:c.modifiers,action:c.action,seq:f,level:d,combo:a}))}var k=this;a=a||u;if(!(k instanceof d))return new d(a);k.target=a;k._callbacks={};k._directMap={};var p={},q,y=!1,r=!1,x=!1;k._handleKey=function(a,
d,e){var f=g(a,d,e),h;d={};var k=0,l=!1;for(h=0;h<f.length;++h)f[h].seq&&(k=Math.max(k,f[h].level));for(h=0;h<f.length;++h)f[h].seq?f[h].level==k&&(l=!0,d[f[h].seq]=1,c(f[h].callback,e,f[h].combo,f[h].seq)):l||c(f[h].callback,e,f[h].combo);f="keypress"==e.type&&r;e.type!=x||w(a)||f||b(d);r=l&&"keydown"==e.type};k._bindMultiple=function(a,b,c){for(var d=0;d<a.length;++d)n(a[d],b,c)};v(a,"keypress",e);v(a,"keydown",e);v(a,"keyup",e)}if(q){var n={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",
18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},r={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},C={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},B={option:"alt",command:"meta","return":"enter",
escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},p;for(c=1;20>c;++c)n[111+c]="f"+c;for(c=0;9>=c;++c)n[c+96]=c.toString();d.prototype.bind=function(a,b,c){a=a instanceof Array?a:[a];this._bindMultiple.call(this,a,b,c);return this};d.prototype.unbind=function(a,b){return this.bind.call(this,a,function(){},b)};d.prototype.trigger=function(a,b){if(this._directMap[a+":"+b])this._directMap[a+":"+b]({},a);return this};d.prototype.reset=function(){this._callbacks={};
this._directMap={};return this};d.prototype.stopCallback=function(a,b){if(-1<(" "+b.className+" ").indexOf(" mousetrap ")||D(b,this.target))return!1;if("composedPath"in a&&"function"===typeof a.composedPath){var c=a.composedPath()[0];c!==a.target&&(b=c)}return"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable};d.prototype.handleKey=function(){return this._handleKey.apply(this,arguments)};d.addKeycodes=function(a){for(var b in a)a.hasOwnProperty(b)&&(n[b]=a[b]);p=null};
d.init=function(){var a=d(u),b;for(b in a)"_"!==b.charAt(0)&&(d[b]=function(b){return function(){return a[b].apply(a,arguments)}}(b))};d.init();q.Mousetrap=d;"undefined"!==typeof module&&module.exports&&(module.exports=d);"function"===typeof define&&define.amd&&define(function(){return d})}})("undefined"!==typeof window?window:null,"undefined"!==typeof window?document:null);
;var Signal = signals.Signal;;function ab(a,b){
    return (a % b + b) % b;
}
function inArray(el,arr){
    return (arr.indexOf(el) != -1);
}
function filter (arr1,arr2){
    var result = [];
    for (var i = 0; i < arr1.length; i++) {
        if(arr2.indexOf(arr1[i]) != -1) result.push(arr1[i]);
    };
    return result;
};

function range(a,b){
  return Math.round(Math.random()*(b-a)+a);
}

function arrRemoveArr(arr1,arr2){
    var toRem = [];
    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
            if(arr1[i] == arr2[j]){
                toRem.push(arr1[i]);
            }
        };
    };
    for (var i = 0; i < toRem.length; i++) {
        removeEl(toRem[i],arr2);
    };
};
function removeEl(el,arr){
    for (var i = 0; i < arr.length; i++) {
        if(arr[i] == el){
            arr.splice(i,1);
        }
    };
}

function rgbToHex(r, g, b) {
    return ab(r,256)*0x010000+ab(g,256)*0x000100+ab(b,256)*0x000001;
}


function rgbToHexFloat(r, g, b) {
    return Math.ceil(ab(r*255,256))*0x010000+Math.ceil(ab(g*255,256))*0x000100+Math.ceil(ab(b*255,256))*0x000001;
}

var rColor = (function(){
    function rColor(r,g,b){
        this.r = r;
        this.g = g;
        this.b = b;
    }
    rColor.prototype.getHex = function() {
        return rgbToHexFloat(this.r,this.g,this.b);
    };
    rColor.prototype.clone = function() {
        return new rColor(this.r, this.g, this.b);
    };

    rColor.fromInt = function(r,g,b) {
        return new rColor(r/256,g/256,b/256)
    };
    return rColor;
})();;var Storage = (function () {
	var changed = new Signal();
	// changed.add(function(key, ov, nv){
	// 	console.log(key,'changed from',ov,'to',nv);
	// });
	return {
		get:function(key){
			return JSON.parse(localStorage.getItem(key)||null);
		},
		remove:function(key){
			localStorage.removeItem(key);
		},
		set:function(key,value){
			var oldValue = this.get(key);
			localStorage.setItem(key,JSON.stringify(value));
			changed.dispatch(key,oldValue,value);
		},
		changed:changed
	}
})();;var Score = (function () {
	var scores = {};
	var scoreSprite = undefined;
	var highScoreSprite = undefined;
	var newHighScoreSprite = undefined;
	var layer = new PIXI.DisplayObjectContainer();

	return {
		init:function(){
			scoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('yourscore'));
			scoreSprite.tint = 0x404040;
			scoreSprite.pivot.x = scoreSprite.width/2;
			scoreSprite.x = gameWidth/2;

			highScoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('highscore'));
			highScoreSprite.tint = 0x404040;
			highScoreSprite.pivot.x = highScoreSprite.width/2;
			highScoreSprite.x = gameWidth/2;

			highScoreSprite.y = 50;

			newHighScoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('new_highscore'));
			newHighScoreSprite.tint = 0x404040;
			newHighScoreSprite.pivot.x = newHighScoreSprite.width/2;
			newHighScoreSprite.x = gameWidth/2;

			newHighScoreSprite.y = 100;

			layer.pivot.x = gameWidth/2;
			layer.pivot.y = gameHeight/2;

			layer.x = gameWidth/2;
			layer.y = gameHeight/2;


			layer.addChild(scoreSprite);
			layer.addChild(highScoreSprite);
			layer.addChild(newHighScoreSprite);
			basestage.addChild(layer);
			layer.visible = false;
			scores = Storage.get('scores') || {
				total:0,
				zen:{
					score:0,
					highScore:0
				},
				mondo:{
					score:0,
					highScore:0
				},
				dharma:{
					score:0,
					highScore:0
				},
				koan:{
					score:0,
					highScore:0
				}
			};
		},
		update:function(){
			Storage.set('scores',scores);
		},
		showAnimation:function(){

		},
		createDummy:function(type){
			var scObj = {
				score:0,
				highscore:0
			};
			scores[type] = scObj;
			return scObj;
		},
		setScore:function(type,score){
			var scObj = scores[type] || this.createDummy(type);
			scObj.score = score;
			this.update();
		},
		getScore:function(type){
			var scObj = scores[type] || this.createDummy(type);
			return scores[type].score || 0;
		},
		getTotal:function(){
			return scores.total || 0;
		},
		getHighScore:function(type){
			var scObj = scores[type] || this.createDummy(type);
			return scObj.highScore || 0;
		},
		addScore:function(type,score){
			var scObj = scores[type] || this.createDummy(type);
			scores.total += score;
			scObj.score += score;
			this.update();
			return scObj.score;
		},
		updateHighScore:function(type){
			var scObj = scores[type] || this.createDummy(type);
			if(scObj.score > scObj.highScore){
				scObj.highScore = scObj.score;
			}
			this.update();
			return scObj.highScore;
		}
	};
})();;/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * @author Richard Davey http://www.photonstorm.com @photonstorm
 */

/**
* @class CustomPixiShader
* @constructor
*/
PIXI.CustomPixiShader = function(gl)
{
    this._UID = PIXI._UID++;
    
    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
    * @property {any} program - The WebGL program.
    */
    this.program = null;

    /**
    * @property {array} fragmentSrc - The fragment shader.
    */
    this.fragmentSrc = [
        'precision lowp float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D uSampler;',
        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
        '}'
    ];

    /**
    * @property {number} textureCount - A local texture counter for multi-texture shaders.
    */
    this.textureCount = 0;

    this.attributes = [];

    this.init();
};

/**
* Initialises the shader
* @method init
*
*/
PIXI.CustomPixiShader.prototype.init = function()
{
    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc || PIXI.CustomPixiShader.defaultVertexSrc, this.fragmentSrc);
    
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.uSampler = gl.getUniformLocation(program, 'uSampler');
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.dimensions = gl.getUniformLocation(program, 'dimensions');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
    // this.colorAttribute = gl.getAttribLocation(program, 'aColor');


    // Begin worst hack eva //

    // WHY??? ONLY on my chrome pixel the line above returns -1 when using filters?
    // maybe its something to do with the current state of the gl context.
    // Im convinced this is a bug in the chrome browser as there is NO reason why this should be returning -1 especially as it only manifests on my chrome pixel
    // If theres any webGL people that know why could happen please help :)
    // if(this.colorAttribute === -1)
    // {
    //     this.colorAttribute = 2;
    // }
    if(this.aTextureCoord === -1){
        this.aTextureCoord = 1;
    }

    // this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];
    this.attributes = [this.aVertexPosition, this.aTextureCoord];

    // End worst hack eva //

    // add those custom shaders!
    for (var key in this.uniforms)
    {
        // get the uniform locations..
        this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
    }

    this.initUniforms();

    this.program = program;
};

/**
* Initialises the shader uniform values.
* Uniforms are specified in the GLSL_ES Specification: http://www.khronos.org/registry/webgl/specs/latest/1.0/
* http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf
*
* @method initUniforms
*/
PIXI.CustomPixiShader.prototype.initUniforms = function()
{
    this.textureCount = 1;
    var gl = this.gl;
    var uniform;

    for (var key in this.uniforms)
    {
        uniform = this.uniforms[key];

        var type = uniform.type;

        if (type === 'sampler2D')
        {
            uniform._init = false;

            if (uniform.value !== null)
            {
                this.initSampler2D(uniform);
            }
        }
        else if (type === 'mat2' || type === 'mat3' || type === 'mat4')
        {
            //  These require special handling
            uniform.glMatrix = true;
            uniform.glValueLength = 1;

            if (type === 'mat2')
            {
                uniform.glFunc = gl.uniformMatrix2fv;
            }
            else if (type === 'mat3')
            {
                uniform.glFunc = gl.uniformMatrix3fv;
            }
            else if (type === 'mat4')
            {
                uniform.glFunc = gl.uniformMatrix4fv;
            }
        }
        else
        {
            //  GL function reference
            uniform.glFunc = gl['uniform' + type];

            if (type === '2f' || type === '2i')
            {
                uniform.glValueLength = 2;
            }
            else if (type === '3f' || type === '3i')
            {
                uniform.glValueLength = 3;
            }
            else if (type === '4f' || type === '4i')
            {
                uniform.glValueLength = 4;
            }
            else
            {
                uniform.glValueLength = 1;
            }
        }
    }

};

/**
* Initialises a Sampler2D uniform (which may only be available later on after initUniforms once the texture has loaded)
*
* @method initSampler2D
*/
PIXI.CustomPixiShader.prototype.initSampler2D = function(uniform)
{
    if (!uniform.value || !uniform.value.baseTexture || !uniform.value.baseTexture.hasLoaded)
    {
        return;
    }

    var gl = this.gl;

    gl.activeTexture(gl['TEXTURE' + this.textureCount]);
    gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id]);
    
    //  Extended texture data
    if (uniform.textureData)
    {
        var data = uniform.textureData;

        // GLTexture = mag linear, min linear_mipmap_linear, wrap repeat + gl.generateMipmap(gl.TEXTURE_2D);
        // GLTextureLinear = mag/min linear, wrap clamp
        // GLTextureNearestRepeat = mag/min NEAREST, wrap repeat
        // GLTextureNearest = mag/min nearest, wrap clamp
        // AudioTexture = whatever + luminance + width 512, height 2, border 0
        // KeyTexture = whatever + luminance + width 256, height 2, border 0

        //  magFilter can be: gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR or gl.NEAREST
        //  wrapS/T can be: gl.CLAMP_TO_EDGE or gl.REPEAT

        var magFilter = (data.magFilter) ? data.magFilter : gl.LINEAR;
        var minFilter = (data.minFilter) ? data.minFilter : gl.LINEAR;
        var wrapS = (data.wrapS) ? data.wrapS : gl.CLAMP_TO_EDGE;
        var wrapT = (data.wrapT) ? data.wrapT : gl.CLAMP_TO_EDGE;
        var format = (data.luminance) ? gl.LUMINANCE : gl.RGBA;

        if (data.repeat)
        {
            wrapS = gl.REPEAT;
            wrapT = gl.REPEAT;
        }

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!data.flipY);

        if (data.width)
        {
            var width = (data.width) ? data.width : 512;
            var height = (data.height) ? data.height : 2;
            var border = (data.border) ? data.border : 0;

            // void texImage2D(GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLint border, GLenum format, GLenum type, ArrayBufferView? pixels);
            gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, border, format, gl.UNSIGNED_BYTE, null);
        }
        else
        {
            //  void texImage2D(GLenum target, GLint level, GLenum internalformat, GLenum format, GLenum type, ImageData? pixels);
            gl.texImage2D(gl.TEXTURE_2D, 0, format, gl.RGBA, gl.UNSIGNED_BYTE, uniform.value.baseTexture.source);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    }

    gl.uniform1i(uniform.uniformLocation, this.textureCount);

    uniform._init = true;

    this.textureCount++;

};

/**
* Updates the shader uniform values.
*
* @method syncUniforms
*/
PIXI.CustomPixiShader.prototype.syncUniforms = function()
{
    // console.log('syncUniforms');
    this.textureCount = 1;
    var uniform;
    var gl = this.gl;

    //  This would probably be faster in an array and it would guarantee key order
    for (var key in this.uniforms)
    {
        uniform = this.uniforms[key];

        if (uniform.glValueLength === 1)
        {
            if (uniform.glMatrix === true)
            {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.transpose, uniform.value);
            }
            else
            {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value);
            }
        }
        else if (uniform.glValueLength === 2)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y);
        }
        else if (uniform.glValueLength === 3)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z);
        }
        else if (uniform.glValueLength === 4)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w);
        }
        else if (uniform.type === 'sampler2D')
        {
            if (uniform._init)
            {
                gl.activeTexture(gl['TEXTURE' + this.textureCount]);
                gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture( uniform.value.baseTexture, gl));
                gl.uniform1i(uniform.uniformLocation, this.textureCount);
                this.textureCount++;
            }
            else
            {
                this.initSampler2D(uniform);
            }
        }
    }

};

/**
* Destroys the shader
* @method destroy
*/
PIXI.CustomPixiShader.prototype.destroy = function()
{
    this.gl.deleteProgram( this.program );
    this.uniforms = null;
    this.gl = null;

    this.attributes = null;
};

/**
* The Default Vertex shader source
* @property defaultVertexSrc
* @type String
*/
PIXI.CustomPixiShader.defaultVertexSrc = [
    'attribute vec2 aVertexPosition;',
    'attribute vec2 aTextureCoord;',
    'attribute vec2 aColor;',

    'uniform vec2 projectionVector;',
    'uniform vec2 offsetVector;',

    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',

    'const vec2 center = vec2(-1.0, 1.0);',

    'void main(void) {',
    '   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);',
    '   vTextureCoord = aTextureCoord;',
    '   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;',
    '   vColor = vec4(color * aColor.x, aColor.x);',
    '}'
];
;/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


PIXI.BlendShader = function(gl,tex1,tex2)
{
    this._UID = PIXI._UID++;
    
    this.gl = gl;
    window.gl = this.gl;
    /**
    * @property {any} program - The WebGL program.
    */
    this.program = null;
    this.texture1 = tex1;
    this.texture2 = tex2;
    this.shader = new PIXI.CustomPixiShader(gl);
    // this.shader.attributes = [this.shader.aVertexPosition, this.shader.aTextureCoord];
    // this.shader.attributes = [this.shader.aVertexPosition];
    /**
     * @property {array} fragmentSrc - The fragment shader.
     */
    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D uSampler1;',
        'uniform sampler2D uSampler2;',
        'const vec4 color = vec4(0.5, 0.5,1.0,1.0);',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler1,vTextureCoord.xy)*texture2D(uSampler2,vTextureCoord.xy);',
        '}'
    ];

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D uSampler1;',
        'uniform sampler2D uSampler2;',
        'void main(void) {',
            'vec4 color1 = texture2D(uSampler1, vTextureCoord.xy);',
            'vec4 color2 = texture2D(uSampler2, vTextureCoord.xy);',
            'vec4 outColor = vec4(color1.rgb / (1.0 - color2.rgb), color1.a);',
            'gl_FragColor = mix(color1, outColor, color2.a);',
       '}'
    ];

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D uSampler1;',
        'uniform sampler2D uSampler2;',
        'void main(void) {',
            'vec4 inColor = texture2D(uSampler1, vTextureCoord.xy);',
            'vec4 overlay = texture2D(uSampler2, vTextureCoord.xy);',
            'vec4 outColor = vec4(0.0 ,0.0 ,0.0, inColor.a);',
            'float factor = 3.0;',
            'float borderFactor = 2.5;',
            'if (overlay.a <= 0.00001)',
            '{',
                'gl_FragColor = inColor;',
                'return;',
            '}',

            // 'if (inColor.r > 0.5)',
            // '{',
            //     'outColor.r = (1.0 - (1.0 - 2.0 * (inColor.r - 0.5)) * (1.0 - overlay.r));',
            // '}',
            // 'else',
            // '{   ',
                'outColor.rgb = ((2.0 * inColor.rgb) * overlay.rgb)*factor;',
            // '}',

            // 'if (inColor.g > 0.5)',
            // '{',
            //     'outColor.g = (1.0 - (1.0 - 2.0 * (inColor.g - 0.5)) * (1.0 - overlay.g));',
            // '}',
            // 'else',
            // '{   ',
                // 'outColor.g = ((2.0 * inColor.g) * overlay.g)*factor;',
            // '}',

            // 'if (inColor.b > 0.5)',
            // '{',
            //     'outColor.b = (1.0 - (1.0 - 2.0 * (inColor.b - 0.5)) * (1.0 - overlay.b));',
            // '}',
            // 'else',
            // '{   ',
                // 'outColor.b = ((2.0 * inColor.b) * overlay.b)*factor;',
            // '}',
            // 'outColor *= factor;',
            // 'gl_FragColor = mix(outColor, inColor,1.0 - overlay.a);',
            // 'outColor *= factor;',
            'gl_FragColor = mix(outColor, inColor,1.0 - overlay.a*borderFactor);',
            // 'gl_FragColor = mix(color1, outColor, color2.a);',
       '}'
    ];

//     void main()
// {
//     vec4 inColor = v_vColour * texture2D(gm_BaseTexture, v_vTexcoord);
//     vec4 outColor = vec4(0.0, 0.0, 0.0, inColor.a);
//     vec4 overlay = texture2D(texOverlay, v_vTexcoord);
      
//     if (inColor.r > 0.5)
//     {
//         outColor.r = (1.0 - (1.0 - 2.0 * (inColor.r - 0.5)) * (1.0 - overlay.r));
//     }
//     else
//     {   
//         outColor.r = ((2.0 * inColor.r) * overlay.r);
//     }

//     if (inColor.g > 0.5)
//     {
//         outColor.g = (1.0 - (1.0 - 2.0 * (inColor.g - 0.5)) * (1.0 - overlay.g));
//     }
//     else
//     {   
//         outColor.g = ((2.0 * inColor.g) * overlay.g);
//     }

//     if (inColor.b > 0.5)
//     {
//         outColor.b = (1.0 - (1.0 - 2.0 * (inColor.b - 0.5)) * (1.0 - overlay.b));
//     }
//     else
//     {   
//         outColor.b = ((2.0 * inColor.b) * overlay.b);
//     }
//     gl_FragColor = mix(outColor, inColor,1.0 - overlay.a);
// }

    //     vec4 inColor = v_vColour * texture2D(gm_BaseTexture, v_vTexcoord);
    // vec4 blend = texture2D(texColorDodge, v_vTexcoord);
    // vec4 outColor = vec4(inColor.rgb / (1.0 - blend.rgb), inColor.a);
    // gl_FragColor = mix(outColor, inColor, 1.0 - blend.a);

     /**
    * @property {array} fragmentSrc - The fragment shader.
    */
    this.vertexSrc  = [
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aTextureCoord;',
        // 'attribute vec2 aColor;',
        // 'uniform mat3 translationMatrix;',
        // 'uniform vec2 projectionVector;',
        // 'uniform vec2 offsetVector;',
        // 'uniform float alpha;',
        // 'uniform vec3 tint;',
        'varying vec2 vTextureCoord;',
        // 'varying vec4 vColor;',

        'void main(void) {',
        // '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
        // '   v -= offsetVector.xyx;',
        // '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);',
        '   gl_Position = vec4( aVertexPosition.xy , 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
       // '   vColor = aColor * vec4(tint * alpha, alpha);',
        '}'
    ];

    this.shader.vertexSrc = this.vertexSrc;
    this.shader.fragmentSrc = this.fragmentSrc;



    this.shader.uniforms = {
        uSampler1: {type: 'sampler2D', value: this.texture1},
        uSampler2: {type: 'sampler2D', value: this.texture2},
        // translationMatrix: {type: 'mat3'},
        // projectionVector: {type: 'vec2'},
        // offsetVector: {type: 'vec2'},
        // vTextureCoord: {type: 'vec2'},
    }
    this.shader.init();
    // this.init();
    this.shader.syncUniforms();
    return this.shader;
};
;/**
 * @author Mat Groves http://matgroves.com/
 */

 /**
 * 
 * @class Strip
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} The texture to use
 * @param width {Number} the width 
 * @param height {Number} the height
 * 
 */
PIXI.Strip = function(texture)
{
    PIXI.DisplayObjectContainer.call( this );
    
    this.texture = texture;

    // set up the main bits..



    this.segs = 64;
    this.ringsNum = 8;

    // this.segs = 8;
    // this.ringsNum = 64;

    // this.segs = 6;
    // this.ringsNum = 4;
    
    var RN = this.ringsNum;
    var rad = 20*8;
    // var rad = 20*6;
    // var rad = 20*4;//gear 2
    // var rad = 20*10;

    this.verticesNum = (this.segs+1)*2;
    this.verticies = new PIXI.Float32Array( this.verticesNum*RN*2 );
    this.uvs = new PIXI.Float32Array( this.verticesNum*RN*2 );
    this.indices = new PIXI.Uint16Array( this.verticesNum*RN );
    this.colors = new PIXI.Float32Array( this.verticesNum*RN*2 );
    
    var v = this.verticies;
    var uvs = this.uvs;
    var ind = this.indices;
    var segs = this.segs;
    var vn = 0;
    var indn = 0;
    for (var j = 0; j < RN; j++) {
        var innRadiusFac = j/RN
        var outRadiusFac = (j+1)/RN
        for (var i = 0; i <= segs; i++) {
            var x = Math.sin(Math.PI*2/segs*i + Math.PI*2/segs*0.5)*rad*outRadiusFac;
            var y = Math.cos(Math.PI*2/segs*i + Math.PI*2/segs*0.5)*rad*outRadiusFac;
            v[vn]=x;
            uvs[vn]=i/segs;
            vn++;

            v[vn]=y;
            uvs[vn]=outRadiusFac;
            vn++;

            ind[indn] = indn;
            indn++;


            var x = Math.sin(Math.PI*2/segs*i + Math.PI*2/segs*0.5)*rad*innRadiusFac;
            var y = Math.cos(Math.PI*2/segs*i + Math.PI*2/segs*0.5)*rad*innRadiusFac;
            v[vn]=x;
            uvs[vn]=i/segs;
            vn++;

            v[vn]=y;
            uvs[vn]=innRadiusFac;
            vn++;

            ind[indn] = indn;
            indn++;
        };
    };
    this.blendMode = PIXI.blendModes.NORMAL;
    this.dirty = true;
};

// constructor
PIXI.Strip.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Strip.prototype.constructor = PIXI.Strip;

PIXI.Strip.prototype._renderWebGL = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(!this.visible || this.alpha <= 0)return;
    // render triangle strip..

    renderSession.spriteBatch.stop();

    // init! init!
    if(!this._vertexBuffer)this._initWebGL(renderSession);
    


    renderSession.shaderManager.setShader(renderSession.shaderManager.stripShader);
    // renderSession.shaderManager.setShader(this.testShader);

    this._renderStrip(renderSession);

    ///renderSession.shaderManager.activateDefaultShader();

    renderSession.spriteBatch.start();

    //TODO check culling  
};

PIXI.Strip.prototype._initWebGL = function(renderSession)
{
    // build the strip!
    var gl = renderSession.gl;  


    this.testShader = new PIXI.PixiShader(renderSession.gl);
    this.testShader.fragmentSrc = [
            'precision lowp float;',
            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',
            'uniform sampler2D uSampler;',
            'void main(void) {',
            '   gl_FragColor = vec4(vTextureCoord.x,vTextureCoord.y,1,1) ;',
            // '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
            '}'
        ];
    this.testShader.init();

    
    this._vertexBuffer = gl.createBuffer();
    this._indexBuffer = gl.createBuffer();
    this._uvBuffer = gl.createBuffer();
    this._colorBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,  this.uvs, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
};

PIXI.Strip.prototype._renderStrip = function(renderSession)
{
    var gl = renderSession.gl;
    var projection = renderSession.projection,
        offset = renderSession.offset,
        shader = renderSession.shaderManager.stripShader;

    // gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mat4Real);

    renderSession.blendModeManager.setBlendMode(this.blendMode);
    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.ZERO,gl.ONE);
    // var curr = renderSession.blendModeManager.currentBlendMode;
    // renderSession.blendModeManager.setBlendMode(this.blendMode);
    // gl.blendFunc(gl.DST_ALPHA, gl.DST_ALPHA);
    // console.log(curr,renderSession.blendModeManager.currentBlendMode);
    // console.log(this.blendMode);
    
    // PIXI.WebGLBlendModeManager.setBlendMode(this.blendMode);

    // set uniforms
    gl.uniformMatrix3fv(shader.translationMatrix, false, this.worldTransform.toArray(true));
    gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
    gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);
    gl.uniform1f(shader.alpha, 1);

    if(!this.dirty)
    {
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticies);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        
        // update the uvs
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
            
        gl.activeTexture(gl.TEXTURE0);
         // bind the current texture
        gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture(this.texture.baseTexture, gl));
    
        // dont need to upload!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    
    
    }
    else
    {

        this.dirty = false;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        
        // update the uvs
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
            
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture(this.texture.baseTexture, gl));
    
        // dont need to upload!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        
    }
    //console.log(gl.TRIANGLE_STRIP)
    //
    //
    // console.log(this.verticesNum);
    // var segsNumber = this.segs*2
    for (var i = 0; i < this.ringsNum; i++) {
        // gl.drawElements(gl.TRIANGLE_STRIP, this.segs*2, gl.UNSIGNED_SHORT, i*this.segs*2);
        gl.drawElements(gl.TRIANGLE_STRIP, this.verticesNum, gl.UNSIGNED_SHORT, this.verticesNum*2*i);
    };
};

/*
 * Sets the texture that the Strip will use 
 *
 * @method setTexture
 * @param texture {Texture} the texture that will be used
 * @private
 */

/*
PIXI.Strip.prototype.setTexture = function(texture)
{
    //TODO SET THE TEXTURES
    //TODO VISIBILITY

    // stop current texture
    this.texture = texture;
    this.width   = texture.frame.width;
    this.height  = texture.frame.height;
    this.updateFrame = true;
};
*/

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */

PIXI.Strip.prototype.onTextureUpdate = function()
{
    this.updateFrame = true;
};;/**
 * @author Mat Groves http://matgroves.com/
 */

 /**
 * 
 * @class Quad
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} The texture to use
 * @param width {Number} the width 
 * @param height {Number} the height
 * 
 */
PIXI.Quad = function(texture1,texture2)
{
    PIXI.DisplayObjectContainer.call( this );
    
    this.texture1 = texture1;
    this.texture2 = texture2;

    // set up the main bits..

    this.verticies = new PIXI.Float32Array( 4*2 );
    this.uvs = new PIXI.Float32Array( 4*2 );
    this.indices = new PIXI.Uint16Array( 4 );
    this.colors = new PIXI.Float32Array( 4*2 );
    
    var v = this.verticies;
    var uvs = this.uvs;
    var ind = this.indices;

    v[0] = -1;
    v[1] = -1;

    v[2] = 1;
    v[3] = -1;

    v[4] = -1;
    v[5] = 1;

    v[6] = 1;
    v[7] = 1;


    uvs[0] = 0;
    uvs[1] = 1;

    uvs[2] = 1;
    uvs[3] = 1;

    uvs[4] = 0;
    uvs[5] = 0;

    uvs[6] = 1;
    uvs[7] = 0;

    ind[0] = 0;
    ind[1] = 1;
    ind[2] = 2;
    ind[3] = 3;


    // for (var i = 0; i < this.colors.length; i++) {
    //     this.colors[i] = 1;
    // };

    this.blendMode = PIXI.blendModes.NORMAL;
    this.dirty = true;
};

// constructor
PIXI.Quad.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Quad.prototype.constructor = PIXI.Quad;

PIXI.Quad.prototype.update = function(){
    if(this.quadShader){
        this.quadShader.syncUniforms();
    }
}
PIXI.Quad.prototype._renderWebGL = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(!this.visible || this.alpha <= 0)return;
    // render triangle strip..

    renderSession.spriteBatch.stop();

    // init! init!
    if(!this._vertexBuffer)this._initWebGL(renderSession);
    


    // renderSession.shaderManager.setShader(renderSession.shaderManager.stripShader);
    renderSession.shaderManager.setShader(this.quadShader);

    this._renderQuad(renderSession);

    ///renderSession.shaderManager.activateDefaultShader();

    renderSession.spriteBatch.start();

    //TODO check culling  
};

PIXI.Quad.prototype._initWebGL = function(renderSession)
{
    // build the strip!
    var gl = renderSession.gl;  


    this.quadShader = new PIXI.BlendShader(gl,this.texture1,this.texture2);

    
    this._vertexBuffer = gl.createBuffer();
    this._indexBuffer = gl.createBuffer();
    this._uvBuffer = gl.createBuffer();
    // this._colorBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,  this.uvs, gl.STATIC_DRAW);

    // gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
};

PIXI.Quad.prototype._renderQuad = function(renderSession)
{
    var gl = renderSession.gl;
    var projection = renderSession.projection,
        offset = renderSession.offset,
        shader = this.quadShader;
        // shader = renderSession.shaderManager.stripShader;

    // gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mat4Real);

    // renderSession.blendModeManager.setBlendMode(this.blendMode);
    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.ZERO,gl.ONE);
    // var curr = renderSession.blendModeManager.currentBlendMode;
    // renderSession.blendModeManager.setBlendMode(this.blendMode);
    // gl.blendFunc(gl.DST_ALPHA, gl.DST_ALPHA);
    // console.log(curr,renderSession.blendModeManager.currentBlendMode);
    // console.log(this.blendMode);
    
    // PIXI.WebGLBlendModeManager.setBlendMode(this.blendMode);

    // set uniforms
    // gl.uniformMatrix3fv(shader.translationMatrix, false, this.worldTransform.toArray(true));
    // gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
    // gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);
    // gl.uniform1f(shader.alpha, 1);

    if(!this.dirty)
    {
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticies);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        
        // update the uvs
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

        // gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
        // gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, 0, 0);
            
        // gl.activeTexture(gl.TEXTURE0);
         // bind the current texture
        // gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture(this.texture.baseTexture, gl));
    
        // dont need to upload!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    
    
    }
    else
    {

        this.dirty = false;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        
        // // update the uvs
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
        // console.log(shader.aTextureCoord);
        // gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
        // gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, 0, 0);

        // gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture(this.texture.baseTexture, gl));
    
        // // dont need to upload!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        
    }
    
    gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);
};

/*
 * Sets the texture that the Quad will use 
 *
 * @method setTexture
 * @param texture {Texture} the texture that will be used
 * @private
 */

/*
PIXI.Quad.prototype.setTexture = function(texture)
{
    //TODO SET THE TEXTURES
    //TODO VISIBILITY

    // stop current texture
    this.texture = texture;
    this.width   = texture.frame.width;
    this.height  = texture.frame.height;
    this.updateFrame = true;
};
*/

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */

PIXI.Quad.prototype.onTextureUpdate = function()
{
    this.updateFrame = true;
};;var Deadline = (function(){
	var color = 0x404040;
	var objs = [];
    function Deadline(){
        this.fired = new Signal();
        this.canceled = new Signal();
        this.DOC = new PIXI.DisplayObjectContainer();
    	this.graphics = new PIXI.Graphics();
        this.graphicsbg = new PIXI.Graphics();
    	objs.push(this);
    }
    Deadline.prototype = {
    	init:function(game){
    		this.animtween;
            this.alpha = 1;
    		this.game = game;
    		this.layer = game.deadlineLayer;
            
            this.graphicsbg.beginFill(0x000000);
            this.graphicsbg.drawRect(0, 0, this.game.num*20, this.game.height*20);
            this.graphicsbg.endFill();
            this.graphicsbg.alpha = 0.3;
            this.graphicsbg.pivot.y = this.game.height*20;

            this.graphics.beginFill(color);
            this.graphics.drawRect(0, this.game.height*20, this.game.num*20, 2);
            this.graphics.endFill();
            this.graphics.alpha = 2;
            this.graphics.pivot.y = this.game.height*20;
            // this.DOC.addChild(this.graphicsbg);

            this.DOC.addChild(this.graphicsbg);
            this.DOC.addChild(this.graphics);
            this.layer.addChild(this.DOC);
            this.DOC.y = 0;
            this.animy = 0;
            // this.graphics.cacheAsBitmap = true;
            // this.graphicsbg.cacheAsBitmap = true;
            rendered.add(this.update.bind(this));
            this.reset(true);
    	},

    	reset:function(){
    		if(this.animtween){
    			this.animtween.kill();
    		}
			this.animtween = TweenLite.to(this,0.5,{
                animy:0,
                alpha:-0.5,
				// ease:Elastic.easeOut,
    			onComplete:this.canceled.dispatch
    		});
    	},
        start:function(time){
            if(this.animtween){
                this.animtween.kill();
            }
            this.animtween = TweenLite.to(this,time,{
                animy:this.game.height*20,
                alpha:0.8,
                onComplete:this.fired.dispatch
            });
        },
    	update:function(){
    		this.DOC.y = this.animy-5;
            this.DOC.alpha = this.alpha;
    	},
        pause:function(){
            if(this.animtween){
                this.animtween.pause();
            }
        },
        resume:function(){
            if(this.animtween){
                this.animtween.resume();
            }
        }
    };
    Deadline.update = function(){
    	for (var i = 0; i < objs.length; i++) {
    		objs[i].update();
    	};
    };
    return Deadline
})();

;var Background = (function(){
	var blackColor = {
		main: 	rColor.fromInt(90,90,90),
		sec: 	rColor.fromInt(120,120,120)
	}
	var colors = [
		{
			main: 	rColor.fromInt(123, 223, 67),
			sec: 	rColor.fromInt(240, 251, 253)
		},
		{
			main: 	rColor.fromInt(26, 109, 255),
			sec: 	rColor.fromInt(22, 245, 255)
		},
		{
			main: 	rColor.fromInt(229, 64, 40),
			sec: 	rColor.fromInt(241, 141, 5)
		},
	]

	// new colors
	var colors = [
		{
			name: 	'green',
			main: 	rColor.fromInt(92, 197, 85),
			sec: 	rColor.fromInt(232, 241, 248)
		},
		{
			name:   'cold grey',
			main: 	rColor.fromInt(133, 110, 180),
			sec: 	rColor.fromInt(250, 244, 245)
		},
		{
			name: 	'cold dark blue',
			main: 	rColor.fromInt(76, 56, 176),
			sec: 	rColor.fromInt(245, 252, 242)
		},
		{
			name: 	'cold red',
			main: 	rColor.fromInt(215, 98, 75),
			sec: 	rColor.fromInt(227, 167, 187)
		},
		{
			name: 	'cold coffee',
			main: 	rColor.fromInt(210, 132, 80),
			sec: 	rColor.fromInt(243, 252, 242)
		},
		{
			name: 	'cold choco',
			main: 	rColor.fromInt(179, 164, 111),
			sec: 	rColor.fromInt(251, 243, 248)
		},
		{
			name: 	'cold blue',
			main: 	rColor.fromInt(92, 110, 198),
			sec: 	rColor.fromInt(227, 167, 187)
		},
		{
			name: 	'cold cyan',
			main: 	rColor.fromInt(90, 173, 200),
			sec: 	rColor.fromInt(249, 243, 251)
		},
		{
			name: 	'cold magent',
			main: 	rColor.fromInt(160, 98, 192),
			sec: 	rColor.fromInt(251, 245, 243)
		},
		{
			name: 	'cold green',
			main: 	rColor.fromInt(83, 207, 130),
			sec: 	rColor.fromInt(242, 243, 252)
		},
	]

	cur = 0;
	var mainColor = colors[0].main.clone();
	var secColor = colors[0].sec.clone();

	function Particle(layer){
		this.layer = layer;
		this.flare = new PIXI.Sprite.fromFrame('bokeh.png');
		this.delay = Math.random()*5;
		this.creating();
		rendered.add(this.update.bind(this));
	}
	Particle.prototype = {
		creating:function(){
			var ParticlesContainerWidth = gameWidth;
			var ParticlesContainerHeight = gameHeight;
			if(ParticlesContainerWidth > 300){
				ParticlesContainerWidth = 300;
			}
			this.color = (Math.random()>0.5)?secColor:mainColor;
			var blur = (Math.random()>0.5);
			if(blur){
				this.flare.setTexture(PIXI.Texture.fromFrame('bokeh-blur.png'));
			} else {
				this.flare.setTexture(PIXI.Texture.fromFrame('bokeh.png'));
			}
			this.layer.addChild(this.flare);
			this.duration = Math.random()*2+0.5;
			// this.duration = 1;
			this.direction = {x:Math.random()-0.5,y:Math.random()-0.5};
			this.flare.alpha = 0;
			this.flare.rotation = Math.random()*Math.PI*2;
			this.flare.tint = (Math.random()>0.5)?this.color.getHex():this.color.getHex();
			this.flare.pivot.x = this.flare.width/2;
			this.flare.pivot.y = this.flare.height/2;

			this.scale = Math.random()+0.2;
			if(blur){
				this.scale = Math.random()*2+0.2;
			}

			// this.scale = Math.random()/2+0.1;
			// if(blur){
			// 	this.scale = Math.random()+0.1;
			// }

			this.flare.scale.set(this.scale);

			this.flare.x = Math.random()*ParticlesContainerWidth-ParticlesContainerWidth/2 + gameWidth/2;
			this.flare.y = Math.random()*ParticlesContainerHeight-ParticlesContainerHeight/2 + gameHeight/2;
			this.alpha = Math.random()*0.2+0.4;
			// this.alpha = 1;

			TweenLite.to(this.flare,this.duration,{
				delay:this.delay,
				alpha:this.alpha,
				onComplete:this.anim.bind(this)
			});

			TweenLite.to(this.flare,this.duration*6,{
				x:this.flare.x + this.direction.x*300,
				y:this.flare.y + this.direction.y*300,
			});

			this.delay = 0;
		},
		update:function(){
			this.flare.tint = (Math.random()>0.5)?this.color.getHex():this.color.getHex();
		},
		fading:function(){
			TweenLite.to(this.flare,this.duration*3,{
				alpha:0,
				onComplete:this.creating.bind(this)
			});
		},
		anim:function(){
			TweenLite.to(this.flare,this.duration,{
				alpha:this.alpha,
				onComplete:this.fading.bind(this)
			});
		},
		moveOutside:function(){
			TweenLite.killTweensOf(this.flare);
			var oldPos = new Victor(this.flare.x,this.flare.y);
			var direction = oldPos.subtract(new Victor(gameWidth/2,gameHeight/2)).norm();
			this.delay = Math.random()*5;
			TweenLite.to(this.flare,Math.random()*1.5+0.5,{
				alpha:0,
				x:this.flare.x + direction.x*300,
				y:this.flare.y + direction.y*300,
				onComplete:this.creating.bind(this)
			});
		}
	}

	function Background(){
		this.particles = [];
		this.layer = new PIXI.DisplayObjectContainer();
		this.layer.scale.set(1/2);
	}
	Background.prototype = {
		init:function(){
			//CENTER
			var flare = new PIXI.Sprite.fromFrame('bokeh-blur.png');
			flare.pivot.x = flare.width/2;
			flare.pivot.y = flare.height/2;
			flare.x = gameWidth/2;
			flare.y = gameHeight/2;
			flare.alpha = 1;
			flare.tint = mainColor.getHex();
			flare.scale.x = 4;
			flare.scale.y = 8;
			// flare.scale.x = 2;
			// flare.scale.y = 4;
			this.layer.addChild(flare);
			this.bottomFlare = flare;

			//TOP
			var flare = new PIXI.Sprite.fromFrame('bokeh-blur.png');
			flare.pivot.x = flare.width/2;
			flare.pivot.y = flare.height/2;
			flare.x = gameWidth/2;
			flare.y = 0;
			flare.tint = mainColor.getHex();
			flare.alpha = 1;
			flare.scale.x = 6;
			flare.scale.y = 5;
			this.layer.addChild(flare);
			this.topFlare = flare;

			//BOTTOM
			var flare = new PIXI.Sprite.fromFrame('bokeh-blur.png');
			flare.pivot.x = flare.width/2;
			flare.pivot.y = flare.height/2;
			flare.x = gameWidth/2;
			flare.y = gameHeight-50;
			flare.alpha = 0.6;
			flare.tint = mainColor.getHex();
			flare.scale.x = 8;
			flare.scale.y = 2;
			this.layer.addChild(flare);
			this.mainFlare = flare;


			for (var i = 0; i < 40; i++) {
				this.particles.push(new Particle(this.layer));
			};
			rendered.add(this.update.bind(this));
		},
		grayscale:function(){
			this.mainColorTo = blackColor.main;
			this.secColorTo = blackColor.sec;
			TweenLite.to(mainColor,0.3,{
				r:this.mainColorTo.r,
				g:this.mainColorTo.g,
				b:this.mainColorTo.b
			});
			TweenLite.to(secColor,0.3,{
				r:this.secColorTo.r,
				g:this.secColorTo.g,
				b:this.secColorTo.b,
				onComplete:function(){
					setTimeout(this.updateColor.bind(this),2000);
				}.bind(this)
			});
		},
		updateColor:function(){
			this.mainColorTo = colors[cur].main;
			this.secColorTo = colors[cur].sec;
			TweenLite.to(mainColor,1,{
				r:this.mainColorTo.r,
				g:this.mainColorTo.g,
				b:this.mainColorTo.b
			});
			TweenLite.to(secColor,1,{
				r:this.secColorTo.r,
				g:this.secColorTo.g,
				b:this.secColorTo.b
			});
		},
		changeColor:function(name){

			if(name){
				for (var i = 0; i < colors.length; i++) {
					if(colors[i].name == name){
						// console.log('finded ',name);
						cur = i;
						this.updateColor();
						return;
					}
				};
			}

			nc = Math.ceil(Math.random()*colors.length)%colors.length;
			while(nc == cur){
				nc = Math.ceil(Math.random()*colors.length)%colors.length;
			}
			cur = nc;
			this.updateColor();
		},
		update:function(){
			this.topFlare.tint = mainColor.getHex();
			this.bottomFlare.tint = mainColor.getHex();
			this.mainFlare.tint = mainColor.getHex();
		},
		removeParticles:function(){
			for (var i = 0; i < this.particles.length; i++) {
				this.particles[i].moveOutside();
			};
		}
	}
	return Background;
})();;var LockedSprite = (function(){
	function LockedSprite(){
		this.layer = new PIXI.DisplayObjectContainer();

		this.lockedSprite =  new PIXI.Sprite.fromFrame('locked');
		this.lockedSprite.anchor.x = this.lockedSprite.anchor.y = 0.5;
		this.lockedSprite.tint = 0x404040;

		this.layer.addChild(this.lockedSprite);
		this.layer.visible = false;
	}
	LockedSprite.prototype = {
		show:function(){
			this.layer.visible = true;
		},
		hide:function(){
			this.layer.visible = false;
		},
		unlock:function(){
			this.lockedSprite.setTexture(PIXI.Texture.fromFrame('unlocked'));
			var flare = new FlareEffect().show(this.layer);
			flare.layer.y = -15;
			flare.layer.x = -15;
			flare.layer.scale.set(1.3);
			TweenLite.to(flare.layer,1,{
				delay:0.1,
				y: 50,
			});

			TweenLite.to(this.lockedSprite,1,{
				delay:0.1,
				y: 50,
				alpha: 0,
				rotation: Math.PI/4
			});
		}
	}
	return LockedSprite;
})();

var baseIcon = (function(){
	function baseIcon(image,menu){
		this.menu = menu;
		this.layer = menu.IconsLayer;
		this.logo = new PIXI.Sprite.fromFrame(image);
		this.logo.pivot.x = this.logo.width/2;
		this.logo.pivot.y = this.logo.height/2;
		this.logo.x = gameWidth/2;
		this.logo.y = gameHeight/2;
		this.logo.tint = 0x404040;
		this.logo.visible = false;

		this.score = new ScoreLine();
		this.lockedSprite = new LockedSprite();
		this.lockedSprite.layer.x = gameWidth/2 + 55;
		this.lockedSprite.layer.y = gameHeight/2 - 60;

		this.score.layer.x = gameWidth/2;
		this.score.layer.y = 20;

		this.layer.addChild(this.logo);
		this.layer.addChild(this.lockedSprite.layer);
		this.layer.addChild(this.score.layer);
		this.onhide = this.onHide.bind(this);
	}
	baseIcon.prototype = {
		show:function(dir){
			// console.log('show',this);
			// TweenLite.killTweensOf(this.logo);
			// TweenLite.killTweensOf(this.logo.scale);
			this.score.show();

			if(this.hideAnim){
				this.hideAnim.kill();
			}
			if(this.hideAnimScale){
				this.hideAnimScale.kill();
			}
			if(this.locked){
				this.lockedSprite.show();
			}


			this.logo.visible = true;
			this.logo.alpha = 0;
			this.logo.scale.x = 1;
			this.logo.scale.y = 1;

			if(dir == undefined){
				dir = 1;
			}
			this.logo.y = gameHeight/2-50;

			// this.logo.y += 10;
			if(this.showAnim){
				this.showAnim.restart();
			} else {
				this.showAnim = TweenLite.to(this.logo,0.3,{
					alpha:1,
					y:gameHeight/2
				});
			}
		},
		update:function(){

		},
		setLocked:function(){
			this.locked = true;
		},
		setUnlocked:function(){
			this.locked = false;
			this.lockedSprite.unlock();
		},
		hide:function(dir){
			this.lockedSprite.hide();
			this.score.hide();
			if(this.showAnim){
				this.showAnim.kill();
			}
			// TweenLite.killTweensOf(this.logo);
			// TweenLite.killTweensOf(this.logo.scale);

			if(dir == undefined){
				dir = 1;
			}

			if(this.hideAnim){
				this.hideAnim.restart();
			} else {
				this.hideAnim = TweenLite.to(this.logo,0.2,{
					alpha:0,
					y:this.logo.y + 50
				});
			}


			if(this.hideAnimScale){
				this.hideAnimScale.restart();
			} else {
				this.hideAnimScale = TweenLite.to(this.logo.scale,0.2,{
					x:0.7,
					y:0.7,
					onComplete:this.onhide
				});
			}
			// console.log('hide');
		},
		onHide:function(){
			this.logo.visible = false;
		},
		select:function(){
			
		}
	}
	return baseIcon;
})();
var n = 0;
var Icons = {
	Zen:(function() {
		var _super = baseIcon.prototype;
		var Zen = function(menu){
			baseIcon.call(this,'zen.png',menu);
		};
		Zen.prototype = Object.create(_super);
		var p = Zen.prototype;
		p.select = function(){
			states.open(states.states.zen);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			this.update();
			background.changeColor('cold green');
		}
		p.update = function(){
			this.score.set(Score.getHighScore('zen'));
		}
		return Zen;
	})(),
	Koan:(function() {
		var _super = baseIcon.prototype;
		var Koan = function(menu){
			baseIcon.call(this,'koan.png',menu);
			this.needScore = 50000;
			if(!Storage.get('koan_unlocked')){
				this.setLocked();
			}
		};
		Koan.prototype = Object.create(_super);
		var p = Koan.prototype;
		p.select = function(){
			if(this.locked){
				states.open(states.states.levelBlocked,{needScore:this.needScore});
				return;
			}
			states.open(states.states.koan);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			this.update();
			background.changeColor('cold blue');
			if(this.locked && Score.getTotal() >= this.needScore){
				this.setUnlocked();
				Storage.set('koan_unlocked',true);
			}
		}
		p.update = function(){
			this.score.set(Score.getHighScore('koan'));
		}
		return Koan;
	})(),
	Mondo:(function() {
		var _super = baseIcon.prototype;
		var Mondo = function(menu){
			baseIcon.call(this,'mondo.png',menu);
			this.needScore = 200000;
			// this.needScore = 0;
			if(!Storage.get('mondo_unlocked')){
				this.setLocked();
			}
		};
		Mondo.prototype = Object.create(_super);
		var p = Mondo.prototype;
		p.select = function(){
			if(this.locked){
				states.open(states.states.levelBlocked,{needScore:this.needScore});
				return;
			}
			states.open(states.states.mondo);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			this.update();
			background.changeColor('cold coffee');
			if(this.locked && Score.getTotal() >= this.needScore){
				Storage.set('mondo_unlocked',true);
				this.setUnlocked();
			}
		}
		p.update = function(){
			this.score.set(Score.getHighScore('mondo'));
		}
		return Mondo;
	})(),
	Dharma:(function() {
		var _super = baseIcon.prototype;
		var Dharma = function(menu){
			baseIcon.call(this,'dharma.png',menu);
			this.needScore = 500000;
			// this.needScore = 0;
			if(!Storage.get('dharma_unlocked')){
				this.setLocked();
			}
		};
		Dharma.prototype = Object.create(_super);
		var p = Dharma.prototype;
		p.select = function(){
			if(this.locked){
				states.open(states.states.levelBlocked,{needScore:this.needScore});
				return;
			}
			states.open(states.states.dharma);
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			this.update();
			background.changeColor('cold magent');
			if(this.locked && Score.getTotal() >= this.needScore){
				Storage.set('dharma_unlocked',true);
				this.setUnlocked();
			}
		}
		p.update = function(){
			this.score.set(Score.getHighScore('dharma'));
		}
		return Dharma;
	})(),
	Resume:(function() {
		var _super = baseIcon.prototype;
		var Resume = function(menu){
			baseIcon.call(this,'resume',menu);
		};
		Resume.prototype = Object.create(_super);
		var p = Resume.prototype;
		p.select = function(){
			if(this.saved_data){
				console.log(this.saved_data);
				states.open(states.states[this.saved_data.type],{data:this.saved_data});
			}
		}
		p.show = function(dir){
			_super.show.call(this,dir);
			this.update();
			background.changeColor('cold magent');
		}
		p.update = function(){
			this.saved_data = Storage.get('last_game')||false;
			this.score.set(this.saved_data.score);
		}
		return Resume;
	})()
};
var LevelBlocked = (function () {
	function LevelBlocked(){
		this.layer = new PIXI.DisplayObjectContainer();
		this.layer.x = gameWidth/2;
		this.layer.y = gameHeight/2;
		this.layer.pivot.x = gameWidth/2;
		this.layer.pivot.y = gameHeight/2;
		this.info = new PIXI.Sprite.fromFrame('blocked-level');
		this.info.tint = 0x404040;
		this.info.x = gameWidth/2;
		this.info.y = gameHeight/2;
		this.info.pivot.x = this.info.width/2;
		this.info.pivot.y = this.info.height/2;

		this.scoreLine = new ScoreLine();
		this.scoreLine.layer.x = gameWidth/2;
		this.scoreLine.layer.y = 30;


		this.scoreLineNeed = new ScoreLine();
		this.scoreLineNeed.layer.x = gameWidth/2;
		this.scoreLineNeed.layer.y = gameHeight/2-25-5;
		this.scoreLineNeed.layer.scale.set(1.9);

		// this.needScoreText = new PIXI.BitmapText('0', {font: "40px Comfortaa", align: "right"});
		// this.needScoreText.x = gameWidth/2 - this.needScoreText.width/2;
		// this.needScoreText.y = gameHeight/2-25-10;

		this.binding = TouchInput.tapped.add(this.processTouch.bind(this), null, 1);
		this.binding.active = false;

		this.layer.addChild(this.info);
		// this.layer.addChild(this.needScoreText);
		this.layer.addChild(this.scoreLine.layer);
		this.layer.addChild(this.scoreLineNeed.layer);
		basestage.addChild(this.layer);
	};	
	LevelBlocked.prototype = {
		init:function(options){
			this.options = options || {};

			var needScore = this.options.needScore || 150000;
			// this.needScoreText.setText(needScore.toString());
			// this.needScoreText.x = gameWidth/2 - this.needScoreText.width/2;	

			this.scoreLine.set(Score.getTotal());
			this.scoreLineNeed.set(needScore);

			this.layer.visible = false;
			this.binding.active = false;

			// this.renderedBinding = rendered.add(this.updateScorePos.bind(this));
			// this.renderedBinding.active = false;
		},
		processTouch:function(){
			states.back();
			return false;
		},
		// updateScorePos:function(){
		// 	this.needScoreText.x = gameWidth/2 - this.needScoreText.width/2;
		// },
		close:function(){
			this.scoreLine.hide();
			this.scoreLineNeed.hide();
			TouchInput.enabled = true;
			this.binding.active = false;
			// this.renderedBinding.active = false;
			// this.layer.visible = false;
			this.animateOut();
		},
		open:function(){
			this.scoreLine.show();
			this.scoreLineNeed.show();
			// this.renderedBinding.active = true;
			TouchInput.enabled = false;
			this.layer.visible = true;
			this.binding.active = true;
			this.animate();
		},
		animate:function(){
			// this.layer.x = gameWidth/2;
			// this.layer.y = gameHeight/2;
			// this.layer.pivot.x = gameWidth/2;
			// this.layer.pivot.y = gameHeight/2;
			
			
			this.layer.scale.x = this.layer.scale.y = 0.6;
			TweenLite.killTweensOf(this.layer.scale);
			TweenLite.to(this.layer.scale,0.9,{
				x:1,
				y:1,
				ease:Elastic.easeOut
			});
		},
		animateOut:function(){
			TweenLite.killTweensOf(this.layer.scale);
			TweenLite.to(this.layer.scale,0.1,{
				x:0,
				y:0,
				onComplete:function(){
					this.layer.visible = false;
				}.bind(this),
			});
		}
	}

	var instance = false;
	LevelBlocked.create = function(){
		if(instance){
			// console.log('return created');
			return instance;
		}
		instance = new LevelBlocked();
		return instance;
	}
	return LevelBlocked;
})();
;var ScoreLine = (function () {
	function ScoreLine(){
		this.layer = new PIXI.DisplayObjectContainer();
		this.scoreText = new PIXI.BitmapText('', {font: "25px Comfortaa", align: "right"});
		this.scoreText.alpha = 0.9;
		this.scoreText.x = 22;
		this.scoreText.y = 0;
		this.layer.addChild(this.scoreText);

		this.scoreIcon = new PIXI.Sprite.fromFrame('star');
		this.scoreIcon.tint = 0x404040;
		this.scoreIcon.scale.set(0.7);
		this.scoreIcon.x = 0;
		this.scoreIcon.y = 0;
		this.layer.addChild(this.scoreIcon);

		this.renderedBinding = rendered.add(this.update.bind(this));
		this.renderedBinding.active = false;
		this.layer.visible = false;
	}
	ScoreLine.prototype = {
		set:function(num){
			if(!num){
				this.scoreText.visible = false;
				this.scoreIcon.visible = false;
			} else {
				this.scoreText.visible = true;
				this.scoreIcon.visible = true;

				this.scoreText.setText(num.toString());
				this.update();
			}
		},
		show:function(){
			this.layer.visible = true;
			this.renderedBinding.active = true;
			this.update();
		},
		hide:function(){
			this.layer.visible = false;
			this.renderedBinding.active = false;
		},
		update:function(){
			this.layer.pivot.x = this.layer.width/2/this.layer.scale.x;
			this.layer.pivot.y = 25/2/this.layer.scale.y;
		}
	}
	return ScoreLine;
})();
;var CheckBox = (function(){
	function CheckBox(enabled){
		this.sprite = new PIXI.Sprite.fromFrame(enabled?'on':'off');
		this.sprite.pivot.x = this.sprite.width/2;
		this.sprite.pivot.y = this.sprite.height/2;
		this.sprite.tint = 0x404040;
		this.enabled = enabled;
	}
	CheckBox.prototype = {
		toggle:function(){
			this.enabled = !this.enabled;
			this.sprite.setTexture(PIXI.Texture.fromFrame(this.enabled?'on':'off'));
			this.animate();
		},
		animate:function(){
			this.sprite.scale.x = this.sprite.scale.y = 0.0;
			TweenLite.killTweensOf(this.sprite.scale);
			TweenLite.to(this.sprite.scale,0.7,{
				x:1,
				y:1,
				ease:Elastic.easeOut
			});
		}
	}

	return CheckBox;
})();

var SettingsOption = (function(){
	function SettingsOption(name,enabled){
		this.layer = new PIXI.DisplayObjectContainer();
		this.name = name;
		this.sprite = new PIXI.Sprite.fromFrame(this.name);
		this.layer.pivot.x = gameWidth/2;
		this.layer.pivot.y = this.sprite.height/2;
		this.sprite.x = gameWidth/2 - 220/2;
		this.sprite.tint = 0x404040;
		this.checkbox = new CheckBox(enabled||false);
		this.checkbox.sprite.x = this.sprite.x + 200;
		this.checkbox.sprite.y = this.sprite.height/2-3;
		this.layer.addChild(this.sprite);
		this.layer.addChild(this.checkbox.sprite);
		this.layer.visible = false;
	}
	SettingsOption.prototype = {
		toggle:function(){
			this.checkbox.toggle();
			console.log('set',this.name,this.checkbox.enabled)
			Storage.set(this.name,this.checkbox.enabled);
			this.animate();
            Sound.play('move');
            Vibrate(20);


            var flare = new FlareEffect()
			flare.layer.x = this.sprite.x;
			flare.layer.y = this.sprite.y + this.sprite.height-10;
			flare.layer.scale.set(3);
			flare.slideRight(this.layer,160,0.3);
		},
		animate:function(){
			// this.layer.scale.y = 2;
			// TweenLite.killTweensOf(this.layer.scale);
			// TweenLite.to(this.layer.scale,1,{
			// 	// x:1,
			// 	y:1,
			// 	ease:Elastic.easeOut
			// });
		},
		show:function(delay){
			this.layer.visible = false;
			this.layer.scale.x = this.layer.scale.y = 0.1;
			TweenLite.killTweensOf(this.layer.scale);
			TweenLite.to(this.layer.scale,1,{
				x:1,
				y:1,
				delay:delay,
				onStart:function(){
					this.layer.visible = true;
					// console.log(this);
				}.bind(this),
				ease:Elastic.easeOut
			});
		},
		getBounds:function(){
			var rect = this.layer.getBounds();
			rect.y = gameHeight - rect.y - rect.height;
			return rect;
		}
	}

	return SettingsOption;
})();

var SettingIcon = (function(){
	function SettingIcon(){

	}
	SettingIcon.prototype = {
		init:function(settings){
			this.backIcon = new PIXI.Sprite.fromFrame('settings');
			this.backIcon.tint = 0x404040;
			this.backIcon.x = gameWidth-this.backIcon.width;
			this.backIcon.y = 3;
			this.bindingIcon = TouchInput.tapped.add(this.toggleSettings.bind(this), null, 2);
			basestage.addChild(this.backIcon);
		},
		toggleSettings:function(touch){

			var rect = this.backIcon.getBounds();
			rect.y = gameHeight - rect.y - rect.height;

			if(rect.contains(touch.x,touch.y)){
				if(states.current instanceof states.states.settings){
					states.back();
				} else {
					states.open(states.states.settings);
				}
				Sound.play('move');
				return false;
			}
		}
	}
	return SettingIcon;
})();



var BackIcon = (function(){
	function BackIcon(){

	}
	BackIcon.prototype = {
		init:function(settings){
			this.backIcon = new PIXI.Sprite.fromFrame('settings');
			this.backIcon.tint = 0x404040;
			this.backIcon.x = 0;
			this.backIcon.alpha = 0;
			this.bindingIcon = TouchInput.tapped.add(this.toggleSettings.bind(this), null, 3);
			basestage.addChild(this.backIcon);
		},
		toggleSettings:function(touch){
			var rect = this.backIcon.getBounds();
			rect.y = gameHeight - rect.y - rect.height;

			if(rect.contains(touch.x,touch.y)){
				states.back();
				return false;
			}
		}
	}
	return BackIcon;
})();


var Settings = (function () {
	function Settings(){
		this.layer = new PIXI.DisplayObjectContainer();
		this.music = new SettingsOption('music-opt',Storage.get('music-opt'));
		// this.sound = new SettingsOption('sound-opt',Storage.get('sound-opt'));
		this.vibro = new SettingsOption('vibro-opt',Storage.get('vibro-opt'));
		this.binding = TouchInput.tapped.add(this.processTouch.bind(this), null, 1);
		this.binding.active = false;
		basestage.addChild(this.layer);
	};	
	Settings.prototype = {
		init:function(){
			var padding = 20;
			this.layer.visible = false;
	        // this.backIcon.x = gameWidth-this.backIcon.width;
			// this.backIcon.alpha = 0.5;

			this.music.layer.y = -55;
			this.layer.addChild(this.music.layer);

			// this.sound.layer.y = 0;
			// this.layer.addChild(this.sound.layer);

			this.vibro.layer.y = 55;
			this.layer.addChild(this.vibro.layer);

			this.binding.active = false;
			this.showed = false;
		},
		processTouch:function(touch){
			if(this.music.getBounds().contains(touch.x,touch.y)){
				this.music.toggle();
			}
			// if(this.sound.getBounds().contains(touch.x,touch.y)){
			// 	this.sound.toggle();
			// }
			if(this.vibro.getBounds().contains(touch.x,touch.y)){
				this.vibro.toggle();
			}
			// if(touch.y <= 55){
			// 	if(touch.x >= this.backIcon.x){
			// 		TouchInput.back.dispatch();
			// 	}
				return false;
			// }
		},
		toggle:function(){
			if(this.showed){
				// this.close();
				states.back();
			} else {
				states.open(states.states.settings);
				// this.open();
			}
		},
		close:function(){
			TouchInput.enabled = true;
			this.binding.active = false;
			this.animateOut();
			// states.current.open();
		},
		open:function(){
			TouchInput.enabled = false;
			this.layer.visible = true;
			this.binding.active = true;
			this.showed = true;
			// states.current.close();
			this.animate();
		},
		animate:function(){
			this.layer.scale.x = this.layer.scale.y = 0.6;
			this.layer.x = gameWidth/2;
			this.layer.y = gameHeight/2;
			// TweenLite.killTweensOf(this.layer);
			TweenLite.killTweensOf(this.layer.scale);
			TweenLite.to(this.layer.scale,0.9,{
				x:1,
				y:1,
				ease:Elastic.easeOut
			});
			this.music.show(0);
			// this.sound.show(0.05);
			this.vibro.show(0.10);
		},
		animateOut:function(){
			// this.layer.scale.x = this.layer.scale.y = 0.6;
			this.showed = false;

			TweenLite.killTweensOf(this.layer.scale);
			TweenLite.to(this.layer.scale,0.1,{
				x:0,
				y:0,
				onComplete:function(){
					this.layer.visible = false;
				}.bind(this),
				// ease:Elastic.easeOut
			});

			// TweenLite.killTweensOf(this.layer);
			// TweenLite.to(this.layer,0.9,{
			// 	y:gameHeight*2,
			// 	// ease:Easin.easeOut
			// });
			// this.music.show(0.2);
			// this.sound.show(0.3);
			// this.vibro.show(0.4);
		}
	}

	var instance = false;
	Settings.create = function(){
		if(instance){
			console.log('return created');
			return instance;
		}
		instance = new Settings();
		return instance;
	}
	return Settings;
})();
;var MainMenu = (function () {
	function MainMenu(){
		this.IconsLayer = new PIXI.DisplayObjectContainer();
		this.MenuStates = [
			new Icons.Zen(this),
			new Icons.Koan(this),
			new Icons.Mondo(this),
			new Icons.Dharma(this),
		]
		window.a = this.MenuStates;
		this.state = 0;
		this.rtx = new PIXI.RenderTexture(24*20, 140);
		this.ringStage = new PIXI.Stage(0x000000);
		this.bg = new PIXI.Graphics();
		this.ringLayer = new PIXI.DisplayObjectContainer();
		this.layer = new PIXI.DisplayObjectContainer();
		this.ring = new PIXI.Strip(this.rtx);
	}
	MainMenu.prototype = {
		init:function(){

			if(this.inited){
				// console.log('already inited');	
				return
			}


	        this.bg.beginFill(0x000000);
	        this.bg.alpha = 0.3;
	        this.bg.drawRect(0, 120-5, 24*20, 2);
	        this.bg.endFill();


	        this.bg.beginFill(0x000000);
	        this.bg.alpha = 0.1;
	        this.bg.drawRect(0, 0, 24*20, 100);
	        this.bg.endFill();



			this.ring.x = gameWidth/2;
			this.ring.y = gameHeight/2;
			this.ring.alpha = 1;


			this.ringStage.addChild(this.ringLayer);
			this.ringLayer.addChild(this.bg);
			this.layer.addChild(this.ring);
			this.layer.addChild(this.IconsLayer);

			this.nextSprite = new PIXI.Sprite.fromFrame('next');
			this.prevSprite = new PIXI.Sprite.fromFrame('prev');
			this.prevSprite.tint = 0x606060;
			this.nextSprite.tint = 0x606060;
			this.nextSprite.y = this.prevSprite.y = gameHeight/2 - this.prevSprite.height/2;
			this.prevSprite.x = gameWidth/2 - 130 - this.prevSprite.width;
			this.nextSprite.x = gameWidth/2 + 130;

			this.layer.addChild(this.nextSprite);
			this.layer.addChild(this.prevSprite);

			this.layer.pivot.x = gameWidth/2;
			this.layer.pivot.y = gameHeight/2;

			this.layer.x = gameWidth/2;
			this.layer.y = gameHeight/2;

			// var logo = new PIXI.Sprite.fromFrame('logo.png');
			// logo.pivot.x = logo.width/2;
			// logo.pivot.y = logo.height/2;
			// logo.x = gameWidth/2;
			// logo.y = gameHeight/2;
			// logo.tint = 0x404040;
			// this.layer.addChild(logo);

			

			this.renderedBinding = rendered.add(this.render.bind(this));
			this.tappedBinding = TouchInput.tapped.add(this.select.bind(this));
			this.turnedCVBinding = TouchInput.turnedCV.add(this.next.bind(this));
			this.turnedCCVBinding = TouchInput.turnedCCV.add(this.prev.bind(this));

			this.renderedBinding.active = false;
			this.tappedBinding.active = false;
			this.turnedCVBinding.active = false;
			this.turnedCCVBinding.active = false;


			// Mousetrap.bind('down', function(){
			// 	states.open(states.states.menu);
			// }.bind(this));
			// TouchInput.back.add(function(){states.back(); return false;});

			basestage.addChild(this.layer);
			this.set(this.MenuStates[this.state]);
			this.inited = true;
		},
		next:function(){
			var l = this.MenuStates.length;
			this.set( this.MenuStates[((++this.state%l)+l)%l],1 );

            Sound.play('move');


            var flare = new FlareEffect()
			flare.layer.x = this.prevSprite.x+this.prevSprite.width;
			flare.layer.y = this.prevSprite.y+this.prevSprite.height/2;
			flare.layer.scale.set(2);
			flare.slideLeft(this.layer,this.prevSprite.width,0.3);


		},
		prev:function(){
			var l = this.MenuStates.length;
			this.set( this.MenuStates[((--this.state%l)+l)%l],-1 );
            Sound.play('move');

            var flare = new FlareEffect()
			flare.layer.x = this.nextSprite.x;
			flare.layer.y = this.nextSprite.y+this.nextSprite.height/2;
			flare.layer.scale.set(2);
			flare.slideRight(this.layer,this.nextSprite.width,0.3);
		},
		select:function(){
			if(this.cur){
				this.cur.select();
			}
			Sound.play('place');
			return false;
		},
		set:function(state,dir){
            Vibrate(20);
			// console.log(dir);
			if(this.cur == state){
				this.cur.update();
				return;	
			} 
			if(this.cur){
				this.cur.hide(dir);
			}
			this.cur = state;
			this.cur.show(dir);
			this.cur.update();
		},
		close:function(){
			this.renderedBinding.active = false;
			this.tappedBinding.active = false;
			this.turnedCVBinding.active = false;
			this.turnedCCVBinding.active = false;
			// this.layer.visible = false;
			// this.ring.visible = false;
			if(this.showAnimScale){
				this.showAnimScale.kill();
			}

			if(this.hideAnim){
				this.hideAnim.restart();
			} else {
				this.hideAnim = TweenLite.to(this.layer.scale,0.2,{
					x:0,
					y:0,
					onComplete:function(){
						this.layer.visible = false;
						this.ring.visible = false;
					}.bind(this)
				});	
			}

		},
		open:function(){
			this.renderedBinding.active = true;
			this.tappedBinding.active = true;
			this.turnedCVBinding.active = true;
			this.turnedCCVBinding.active = true;
			this.ring.visible = true;
			this.layer.visible = true;
			background.changeColor('cold blue');



			if(Storage.get('last_game')){
				console.log('last_game exists');
				if(! (this.MenuStates[0] instanceof Icons.Resume) ){
					this.MenuStates.splice(0,0,new Icons.Resume(this));
					console.log('create Resume');
				}
			} else {
				console.log('last_game NOT exists');
			}
			if(this.MenuStates[0] instanceof Icons.Resume){
				this.set(this.MenuStates[0]);
			}

			// this.layer.y = gameHeight/2 + 50;
			this.layer.y = gameHeight/2;
			this.layer.scale.x = 0.4;
			this.layer.scale.y = 0.4;

			// this.layer.scale.x = -1;
			// this.layer.scale.y = -6;

			// if(this.showAnim){
			// 	this.showAnim.restart();
			// } else {
			// 	this.showAnim = TweenLite.to(this.layer,1,{
			// 		y:gameHeight/2,
			// 		ease:Elastic.easeOut
			// 	});
			// }

			if(this.hideAnim){
				this.hideAnim.kill();
			}
			
			if(this.showAnimScale){
				this.showAnimScale.restart();
			} else {
				this.showAnimScale = TweenLite.to(this.layer.scale,1,{
					x:1,
					y:1,
					ease:Elastic.easeOut
				});				
			}
			console.log('open',this.cur);




            var flare = new FlareEffect()
			flare.layer.x = gameWidth/2;
			flare.layer.y = gameHeight/2;
			flare.layer.scale.set(3);
			flare.slideLeft(this.layer,100,0.3);


            var flare = new FlareEffect()
			flare.layer.x = gameWidth/2;
			flare.layer.y = gameHeight/2;
			flare.layer.scale.set(3);
			flare.slideRight(this.layer,100,0.3);


			this.cur.update();
		},
		render:function(){
		    this.rtx.clear();
		    this.rtx.render(this.ringStage);
		}
	}
	var instance = false;
	MainMenu.create = function(){
		
		if(instance){
			// console.log('return created');
			return instance;
		}
		instance = new MainMenu();
		return instance;
	}
	return MainMenu;
})();
;var TitleScreen = (function () {
	function TitleScreen(){
		this.rtx = new PIXI.RenderTexture(24*20, 140);
		this.ringStage = new PIXI.Stage(0x000000);
		this.bg = new PIXI.Graphics();
		this.ringLayer = new PIXI.DisplayObjectContainer();
		this.layer = new PIXI.DisplayObjectContainer();
		this.ring = new PIXI.Strip(this.rtx);
		this.logo = new PIXI.Sprite.fromFrame('logo');
		this.flare = new PIXI.Sprite.fromFrame('flare');
	}
	TitleScreen.prototype = {
		init:function(){
			if(this.inited){
				return
			}
	        this.bg.beginFill(0x000000);
	        this.bg.alpha = 0.3;
	        this.bg.drawRect(0, 120-5, 24*20, 2);
	        this.bg.endFill();

	        this.bg.beginFill(0x000000);
	        this.bg.alpha = 0.1;
	        this.bg.drawRect(0, 0, 24*20, 100);
	        this.bg.endFill();

			this.ring.x = gameWidth/2;
			this.ring.y = gameHeight/2;
			this.ring.alpha = 1;

			this.ringStage.addChild(this.ringLayer);
			this.ringLayer.addChild(this.bg);
			this.layer.addChild(this.ring);
			this.layer.addChild(this.logo);
			// this.layer.addChild(this.flare);
			this.layer.pivot.x = gameWidth/2;
			this.layer.pivot.y = gameHeight/2;

			this.layer.x = gameWidth/2;
			this.layer.y = gameHeight/2;


			this.logo.x = gameWidth/2;
			this.logo.y = gameHeight/2;

			this.logo.pivot.x = this.logo.width/2;
			this.logo.pivot.y = this.logo.height/2;
			this.logo.alpha = 0.6;



			// this.flare.pivot.x = this.flare.width/2;
			// this.flare.pivot.y = this.flare.height/2;
			this.flare.anchor.x = 0.5;
			this.flare.anchor.y = 0.5;


			this.renderedBinding = rendered.add(this.render.bind(this));

			this.renderedBinding.active = false;

			TouchInput.back.add(function(){states.back()});
			this.tappedBinding = TouchInput.tapped.add(this.tap.bind(this));
			this.tappedBinding.active = false;
			basestage.addChild(this.layer);
			this.inited = true;
		},
		tap:function(){
			states.open(states.states.menu);
			return false;
		},
		close:function(){
			this.renderedBinding.active = false;
			this.tappedBinding.active = false;
			if(this.showAnimScale){
				this.showAnimScale.kill();
			}

			if(this.hideAnim){
				this.hideAnim.restart();
			} else {
				this.hideAnim = TweenLite.to(this.layer.scale,0.2,{
					x:0,
					y:0,
					onComplete:function(){
						this.layer.visible = false;
						this.ring.visible = false;
					}.bind(this)
				});	
			}

		},
		open:function(){


			this.flare.scale.set(2);
			this.flare.x = gameWidth/2-25;
			this.flare.y = gameHeight/2-20;


			this.flare.alpha = 0;
			TweenLite.to(this.flare,0.3,{
				alpha:1
			});
			TweenLite.to(this.flare,0.5,{
				x:gameWidth/2-5
			});
			TweenLite.to(this.flare,0.3,{
				delay:0.4,
				alpha:0
			});

			// TweenLite.to(this.flare,0.3,{
			// 	alpha:0.7
			// });
			// TweenLite.to(this.flare,1,{
			// 	y:gameHeight/2+20
			// });
			// TweenLite.to(this.flare,0.3,{
			// 	delay:1,
			// 	alpha:0
			// });


            var flare = new FlareEffect()
			// flare.layer.x = gameWidth/2-25;
			flare.layer.x = gameWidth/2-50;
			// flare.layer.y = gameHeight/2-20;
			flare.layer.y = gameHeight/2+20;
			flare.layer.scale.set(2);
			flare.slideRight(this.layer,120,2);


			this.renderedBinding.active = true;
			this.tappedBinding.active = true;

			this.ring.visible = true;
			this.layer.visible = true;
			background.changeColor('cold blue');

			this.layer.y = gameHeight/2;
			this.layer.scale.x = 0.4;
			this.layer.scale.y = 0.4;

			if(this.hideAnim){
				this.hideAnim.kill();
			}
			
			if(this.showAnimScale){
				this.showAnimScale.restart();
			} else {
				this.showAnimScale = TweenLite.to(this.layer.scale,1,{
					x:1,
					y:1,
					ease:Elastic.easeOut
				});				
			}
		},
		render:function(){
		    this.rtx.clear();
		    this.rtx.render(this.ringStage);
		}
	}
	var instance = false;
	TitleScreen.create = function(){
		if(instance){
			return instance;
		}
		instance = new TitleScreen();
		return instance;
	}
	return TitleScreen;
})();
;var States = (function () {
	function States(){
		this.states = {
			title: 			TitleScreen,
			menu: 			MainMenu,
			mondo: 			Mondo,
			zen: 			Zen,
			koan: 			Koan,
			dharma: 		Dharma,
			settings:   	Settings,
			levelBlocked: 	LevelBlocked,
		}
		this.current;
		this.history = [];
	}
	States.prototype = {
		openGame:function(type,options){
			console.log('openGame');
			this.current = type.create();
			this.current.init(options);
			this.current.open();
		},
		open:function(type,options){
			if(type != this.current){
				Vibrate(20);
				if(this.current){
					this.current.close();
					this.history.push({state:this.current,options:this.current.options});
				}
				// console.log(type,type.prototype,type.create);
				if(type.prototype && type.prototype.isGameType){
					this.openGame(type,options);
					return;
				}
				if(typeof type == 'function'){
					if(type.create){
						this.current = type.create();
					} else {
						this.current = new type();
					}
				} else {
					this.current = type;
				}
				this.current.init(options);
				this.current.open();
			}
		},
		backOpen:function(type,options){
			if(type == this.current) return;
			
			this.current.close();
			if(typeof type == 'function'){
				if(type.create){
					this.current = type.create();
					this.current.init(options);
				} else {
					this.current = new type();
					this.current.init(options);
				}
			} else {
				this.current = type;
			}
			// type.init(options);

			type.open();
		},
		back:function(){
			Vibrate(20);
			var historyState = this.history.pop();
			if(historyState){
				var state = historyState.state;
				var options = historyState.options;
				// this.current.close();
				// this.open(state,options);
				// state.init(options);
				this.backOpen(state,options);
				
				// this.current = state;
			}
		}
	}
	return States;
})();;var NewLevelEffect = (function(){
	function NewLevelEffect(num){
		this.layer = new PIXI.DisplayObjectContainer();
		this.newLevelSprite = new PIXI.Sprite.fromFrame('new_level');
		this.newLevelSprite.anchor.x = 0.5;
		this.newLevelSprite.anchor.y = 0.5;
		this.newLevelSprite.y = 60;
		this.newLevelSprite.tint = 0x707070;

		this.bg = new PIXI.Sprite.fromFrame('bokeh-blur.png');
		this.bg.anchor.x = 0.5;
		this.bg.anchor.y = 0.5;
		this.bg.width = gameWidth*2;
		this.bg.y = 20;
		this.bg.height = 250;
		this.bg.alpha = 1.2;
		this.bg.tint = 0x000000;

		// this.flare = new PIXI.Sprite.fromFrame('flare');
		// this.flare.anchor.x = this.flare.anchor.y = 0.5;


		this.levelText = new PIXI.BitmapText(num.toString(), {font: "60px Comfortaa", align: "right"});
		this.levelText.pivot.x = this.levelText.width/2;
		this.levelText.pivot.y = this.levelText.height/2;
		this.levelText.y = 0;
		this.levelText.x = 5;

		// this.flare.x = this.levelText.x - this.levelText.width/2;
		// this.flare.y = this.levelText.height/2-10;

		this.layer.x = gameWidth/2;
		this.layer.y = gameHeight/2;
		this.layer.addChild(this.bg);
		this.layer.addChild(this.newLevelSprite);
		this.layer.addChild(this.levelText);
		// this.layer.addChild(this.flare);
		this.binding = TouchInput.tapped.add(this.hide.bind(this), null, 1);
		this.binding.active = false;
	}
	NewLevelEffect.prototype = {
		show:function(container){
			this.binding.active = true;
			container.addChild(this.layer);

			this.layer.y = gameHeight/2-60;
			this.layer.alpha = 0;
			TweenLite.to(this.layer,0.2,{
				alpha:1,
			});

			// this.flare.alpha = 0;
			// TweenLite.to(this.flare,0.2,{
			// 	alpha:1
			// });

			// TweenLite.to(this.flare,0.8,{
			// 	alpha:0,
			// 	delay:0.5
			// });

			// TweenLite.to(this.flare,1,{
			// 	x:this.levelText.x + this.levelText.width/3,
			// });

			TweenLite.to(this.layer,1.3,{
				y:gameHeight/2-30,
				onComplete:this.hide.bind(this),
				// ease:Elastic.easeOut,
			});


            var flare = new FlareEffect()

			flare.layer.x = this.levelText.x - this.levelText.width/2;
			flare.layer.y = this.levelText.height/2-10;

			flare.slideRight(this.layer,this.levelText.width-this.levelText.width/4,2);

		},
		hide:function(){
			this.binding.active = false;
			TweenLite.to(this.layer,1,{
				y:gameHeight/2,
				alpha:-1,
				onComplete:function(){
					if(this.layer.parent){
						this.layer.parent.removeChild(this.layer);
						this.layer.removeStageReference();
					}
					// this.layer.visible = false;
				}.bind(this)
			});
		}
	}
	return NewLevelEffect;
})();
;var FlareEffect = (function(){
	function FlareEffect(){
		this.layer = new PIXI.DisplayObjectContainer();
		this.flare = new PIXI.Sprite.fromFrame('flare');
		this.flare.anchor.x = this.flare.anchor.y = 0.5;
		this.layer.addChild(this.flare);
	}
	FlareEffect.prototype = {
		show:function(container,time){
			this.time = time||1;
			container.addChild(this.layer);
			this.layer.alpha = 0;
			TweenLite.to(this.layer,this.time/2,{
				alpha:1,
				onComplete:this.hide.bind(this)
			});
			return this;
		},
		slideRight:function(container,pixels,time){
			this.time = time||1;
			this.show(container,this.time);

			TweenLite.to(this.layer,this.time,{
				x: this.layer.x + pixels,
			});
			return this;
		},
		slideLeft:function(container,pixels,time){
			this.time = time||1;
			this.show(container,this.time);

			TweenLite.to(this.layer,this.time,{
				x: this.layer.x - pixels,
			});
			return this;
		},
		hide:function(){
			TweenLite.to(this.layer,this.time,{
				alpha:0,
				onComplete:function(){
					if(this.layer.parent){
						this.layer.parent.removeChild(this.layer);
						this.layer.removeStageReference();
					}
				}.bind(this)
			});
		}
	}
	return FlareEffect;
})();
;var GameClass = (function(){
	var CurrentScore = function(game){
		this.game = game;
		this.layer = new PIXI.DisplayObjectContainer();
		this.layer.x = gameWidth/2;
		this.layer.y = gameHeight/2;


		this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame('bokeh-blur.png'));
		this.bg.tint = 0x000000;
		this.bg.alpha = 3;
		this.bg.pivot.x = this.bg.width/2;
		this.bg.pivot.y = this.bg.height/2;
		this.bg.width = 300;
		this.bg.height = 300;


		this.layer.addChild(this.bg);

		this.scoreLayer = new PIXI.DisplayObjectContainer();
		this.scoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('yourscore'));
		this.scoreSprite.pivot.x = this.scoreSprite.width/2;
		this.scoreSprite.tint = 0x606060;
        this.scoreLayer.addChild(this.scoreSprite);

		this.scoreText = new PIXI.BitmapText('', {font: "40px Comfortaa", align: "right"});
        this.scoreText.alpha = 0.9;
		this.scoreText.x = - this.scoreText.width/2 + 5;
		this.scoreText.y = 30;
        this.scoreLayer.addChild(this.scoreText);



		this.highScoreLayer = new PIXI.DisplayObjectContainer();
		this.highScoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('highscore'));
		this.highScoreSprite.pivot.x = this.highScoreSprite.width/2;
		this.highScoreSprite.tint = 0x606060;
        this.highScoreLayer.addChild(this.highScoreSprite);

		this.highScoreText = new PIXI.BitmapText('', {font: "40px Comfortaa", align: "right"});
        this.highScoreText.alpha = 0.9;
		this.highScoreText.x = - this.highScoreText.width/2 + 5;
		this.highScoreText.y = 30;
        this.highScoreLayer.addChild(this.highScoreText);



		this.newHighScoreLayer = new PIXI.DisplayObjectContainer();
		this.newHighScoreSprite = new PIXI.Sprite(PIXI.Texture.fromFrame('new_highscore'));
		this.newHighScoreSprite.pivot.x = this.newHighScoreSprite.width/2;
		this.newHighScoreSprite.tint = 0x606060;
        this.newHighScoreLayer.addChild(this.newHighScoreSprite);


        this.scoreLayer.y = -50;
        this.highScoreLayer.y = 30;
        this.newHighScoreLayer.y = -gameHeight/2+30;

        this.layer.addChild(this.scoreLayer);
        this.layer.addChild(this.highScoreLayer);
        this.layer.addChild(this.newHighScoreLayer);


        this.layer.visible = false;

		this.binding = TouchInput.tapped.add(this.processTouch.bind(this), null, 1);
		this.binding.active = false;

		this.renderedBinding = rendered.add(this.updateScorePos.bind(this));
		this.renderedBinding.active = false;
	}
	CurrentScore.prototype = {
		processTouch:function(){
			this.hide();
			return false;
		},
		show:function(){
			// console.log("SHOW!");
			// this.game.close();
			this.renderedBinding.active = true;
			this.binding.active = true;
        	this.layer.visible = true;
        	this.newHighScoreLayer.visible = false;
        	var score = Score.getScore(this.game.type);
        	var highscore = Score.getHighScore(this.game.type);

        	if(score > highscore){
    			this.newHighScoreLayer.visible = true;

	            var flare = new FlareEffect()
				flare.layer.x = -this.newHighScoreSprite.width/2;
				flare.layer.y = this.newHighScoreSprite.height-15;
				flare.layer.scale.set(2.5);
				flare.slideRight(this.newHighScoreLayer,this.newHighScoreSprite.width,2);



	            var flare = new FlareEffect()
				flare.layer.x = -this.newHighScoreSprite.width/2+this.newHighScoreSprite.width;
				flare.layer.y = this.newHighScoreSprite.height-35;
				// flare.layer.scale.set(1);
				flare.slideLeft(this.newHighScoreLayer,this.newHighScoreSprite.width,2);
    		}


	   		//var flare = new FlareEffect()
				// flare.layer.x = -this.newHighScoreSprite.width/2;
				// flare.layer.y = this.newHighScoreSprite.height-15;
				// flare.layer.scale.set(0.6);
				// flare.slideRight(this.newHighScoreLayer,this.newHighScoreSprite.width,0.6);
        	// }

			this.scoreText.setText(score.toString());
	        // this.scoreText.alpha = 0.9;

			this.highScoreText.setText(highscore.toString());
	        // this.highScoreText.alpha = 0.9;

			// this.scoreLayer.visible = true;
			// this.scoreLayer.scale.x = this.scoreLayer.scale.y = 0;
			// TweenLite.killTweensOf(this.scoreLayer.scale);
			// TweenLite.to(this.scoreLayer.scale,0.7,{
			// 	x:1,
			// 	y:1,
			// 	ease:Elastic.easeOut
			// });		
		},
		updateScorePos:function(){
			this.scoreText.x = - this.scoreText.width/2 + 5;
			this.highScoreText.x = - this.highScoreText.width/2 + 5;
		},
		hide:function(){
			this.renderedBinding.active = false;
			this.binding.active = false;
        	this.layer.visible = false;
        	this.game.resume();
			this.game.newBlocks();
        	// this.game.open();
			// TweenLite.killTweensOf(this.scoreLayer.scale);
			// TweenLite.to(this.scoreLayer.scale,0.3,{
			// 	x:0,
			// 	y:0,
			// 	onComplete:function(){
			// 		this.scoreLayer.visible = false;
			// 	}.bind(this)
			// });
		}
	}

	function GameClass(){
		this.levelNum = 0;
		this.levelSettings = {};
		this.num = 24;
		this.height = 6;
		this.type = 'none';
		this.blocks = new Blocks(this);
		this.stage = GameClass.stage;
		this.blockLayer = new PIXI.DisplayObjectContainer();
		this.blockPopLayer = new PIXI.DisplayObjectContainer();
		this.levelEdgeLayer = new PIXI.DisplayObjectContainer();
		this.deadlineLayer = new PIXI.DisplayObjectContainer();
		this.layer = new PIXI.DisplayObjectContainer();
		this.rtx = new PIXI.RenderTexture(this.num*20, (this.height+1)*20);
		this.blackBorder = new PIXI.Graphics();
		this.levelEdge = new PIXI.Graphics();
		this.ring = new PIXI.Strip(this.rtx);
	}
	GameClass.stage = new PIXI.Stage(0x000000);
	GameClass.prototype = {
		levels:[],
		isGameType:true,
		initialization:function(){
		},
		newGame:function(){
			console.log('NEW GAME');
			this.setScore(0);
			this.loadLevel(0);
			new NewLevelEffect(1).show(this.layer);
		},
		loadLevelSettings:function(settings){
			if(!settings) return;
			this.levelSettings = settings;
			console.log('loadLevelSettings',settings);
		},
		loadLevel:function(level){
			if(level){
				new NewLevelEffect(level+1).show(this.layer);
			}
			console.log('load level',level,this.levels[level]);
			this.loadLevelSettings(this.levels[level]);
		},
		init:function(options){
			// Score.setScore(this.type,0);
			while(this.stage.children.length){
				this.stage.removeChildren(0,1);
			}
			if(!this.inited){
				this.solvedRings = 0;
				this.ringAnimScale = 1;
				this.adder = this.createAdder();
		        this.blackBorder.beginFill(0x000000);
		        this.blackBorder.alpha = 0.3;
		        this.blackBorder.drawRect(0, this.height*20-5, this.num*20, 2);
		        this.blackBorder.endFill();


		        this.levelEdge.beginFill(0x000000);
		        this.levelEdge.alpha = 0.1;
		        this.levelEdge.drawRect(0, (this.height-4)*20-5, this.num*20, 2);
		        this.levelEdge.endFill();

				this.ring.x = gameWidth/2;
				this.ring.y = gameHeight/2;
				this.ring.alpha = 1;

				this.currentScore = new CurrentScore(this);

		        this.blockPopLayer.addChild(this.blackBorder);
		        this.levelEdgeLayer.addChild(this.levelEdge);
				this.layer.addChild(this.ring)
				basestage.addChild(this.layer);

				this.renderedBinding = rendered.add(this.render.bind(this));
				this.tappedBinding = TouchInput.tapped.add(this.adder.moveUp.bind(this.adder));
				this.turnedCVBinding = TouchInput.turnedCV.add(this.adder.move.bind(this.adder,-1));
				this.turnedCCVBinding = TouchInput.turnedCCV.add(this.adder.move.bind(this.adder,1));

				this.scoreText = new PIXI.BitmapText('', {font: "25px Comfortaa", align: "right"});
		        this.scoreText.alpha = 0.9;
				this.scoreText.x = 25;
				this.scoreText.y = 3;
		        this.layer.addChild(this.scoreText);

				this.scoreIcon = new PIXI.Sprite.fromFrame('star');
		        this.scoreIcon.tint = 0x404040;
		        this.scoreIcon.scale.set(0.7);
				this.scoreIcon.x = 3;
				this.scoreIcon.y = 3;
		        this.layer.addChild(this.scoreIcon);


		        this.layer.addChild(this.currentScore.layer);

				this.renderedBinding.active = false;
				this.tappedBinding.active = false;
				this.turnedCVBinding.active = false;
				this.turnedCCVBinding.active = false;
				this.updateScore();
				this.initialization();
			};
			if(options){
				this.load(options);
			} else {
				this.newGame();
			}
			this.stage.addChild(this.blockLayer);
			this.stage.addChild(this.blockPopLayer);
			this.stage.addChild(this.levelEdgeLayer);
			this.stage.addChild(this.deadlineLayer);
			this.inited = true;
		},
		customSave:function(data){

		},
		customLoad:function(data){

		},
		load:function(options){
			var data = options.data;
			console.log('LOAD GAME',data);
			this.levelSettings = data.levelSettings;
			this.levelNum = data.level;
			this.loadLevel(this.levelNum);
			this.adder.load(data.adder);
			this.blocks.load(data.blocks);
			this.setScore(data.score);
			this.check();
			console.log('loaded');
			this.customLoad(data);
		},
		save:function(){
			var data = {
				adder:this.adder.save(),
				blocks:this.blocks.save(),
				type:this.type,
				level:this.levelNum,
				levelSettings:this.levelSettings,
				score:Score.getScore(this.type),
			};
			this.customSave(data);
			Storage.set('last_game',data);
		},
		pause:function(){
			if(this.deadline){
				this.deadline.pause();
			}

			if(this.adder){
				this.adder.hide();
			}

			if(this.centerNumText){
				this.centerNumText.visible = false;
			}
		},
		resume:function(){
			if(this.deadline){
				this.deadline.resume();
			}

			if(this.adder){
				this.adder.show();
			}

			if(this.centerNumText){
				this.centerNumText.visible = true;
			}
		},
		addLevelBulk:function(){
			var blobSplat = new PIXI.Sprite.fromFrame('bokeh.png');
			blobSplat.pivot.x = blobSplat.width/2;
			blobSplat.pivot.y = blobSplat.height/2;
			blobSplat.x = 5;
			blobSplat.y = 15;
			blobSplat.tint = 0x000000;
			// blobSplat.tint = 0xFFFFFF;
			blobSplat.alpha = 0.5;
			blobSplat.width = 60;
			blobSplat.height = 60;

			basestage.addChild(blobSplat);

			TweenLite.to(blobSplat,1,{
				alpha:0.03,
				width:700,
				height:700,
				onComplete:function(){
					basestage.removeChild(blobSplat)
				}
			});
		},
		close:function(){
			this.renderedBinding.active = false;
			this.tappedBinding.active = false;
			this.turnedCVBinding.active = false;
			this.turnedCCVBinding.active = false;
			this.layer.visible = false;
			if(this.onClose){
				this.onClose();
			}
			this.save();
		},
		open:function(){
			this.renderedBinding.active = true;
			this.tappedBinding.active = true;
			this.turnedCVBinding.active = true;
			this.turnedCCVBinding.active = true;
			this.layer.visible = true;





            var flare = new FlareEffect()
			flare.layer.x = gameWidth/2;
			flare.layer.y = gameHeight/2;
			flare.layer.scale.set(3);
			flare.slideLeft(this.layer,100,0.3);


            var flare = new FlareEffect()
			flare.layer.x = gameWidth/2;
			flare.layer.y = gameHeight/2;
			flare.layer.scale.set(3);
			flare.slideRight(this.layer,100,0.3);
			
			if(this.onOpen){
				this.onOpen();
			}
		},
		bulk:function(){
			TweenLite.killTweensOf(this);
			TweenLite.to(this,0.1,{
				ringAnimScale:.95,
			})
			TweenLite.to(this,2,{
				ringAnimScale:1,
				delay:0.1,
				ease:Elastic.easeOut
			})
		},
		createCenterNum:function(){
			// this.centerNumText = new PIXI.BitmapText("0", {font: "60px Comfortaa", align: "right"});
			this.centerNumText = new PIXI.BitmapText("0", {font: "50px Comfortaa", align: "right"});
			this.centerNumText.alpha = 0.9;
			// this.centerNumText.alpha = 0;
	        this.layer.addChild(this.centerNumText);
		},
		setCenterNum:function(num){
			if(this.centerNumText){
				if(this.centerNumText.text){
					console.log(parseInt(this.centerNumText.text),num);
					if(parseInt(this.centerNumText.text) > num){
			            var flare = new FlareEffect()
						flare.layer.x = this.centerNumText.x-this.centerNumText.width/4;
						flare.layer.y = this.centerNumText.y+this.centerNumText.height-5;
						flare.layer.scale.set(2);
						flare.slideRight(this.layer,this.centerNumText.width,1);
					}
				}
				this.centerNumText.setText(num.toString());
				this.bulkText();

			}
		},
		bulkText:function(){
			if(this.centerNumText){
				TweenLite.killTweensOf(this.centerNumText);
				TweenLite.to(this.centerNumText.scale,0.1,{
					x:1.25,
					y:1.25,
				})
				TweenLite.to(this.centerNumText.scale,3,{
					x:1,
					y:1,
					delay:0.1,
					ease:Elastic.easeOut
				})
			}
		},
		resonance:function(){
			TweenLite.killTweensOf(this);
			TweenLite.to(this,0.05,{
				ringAnimScale:1.06,
			})
			TweenLite.to(this,1,{
				ringAnimScale:1,
				delay:.05,
				ease:Elastic.easeOut
			})
		},
		added:function(){
            this.bulk();
            Sound.play('place');

            Vibrate(40);
            this.addScore(50);
	        this.save();
        	this.newBlocks();
		},
		setScore:function(score){
			console.log('set score to',score);
			Score.setScore(this.type,score);
			this.updateScore();
		},
		addScore:function(score){
			var addedScore = score;
			if(this.levelSettings.multipler){
				addedScore *= this.levelSettings.multipler;
			}
			Score.addScore(this.type,addedScore);
			this.updateScore();

            
            var flare = new FlareEffect()
			flare.layer.y = this.scoreText.y+20;
			flare.layer.x = this.scoreText.x;
			flare.layer.scale.set( 0.6 + score/550);
			flare.slideRight(this.layer,35,Math.min(0.5+score/3000,1));

		},
		ringSolved:function(){
			this.solvedRings++
			Sound.play('complete');
			this.addScore(500);
			Vibrate(60);
			this.check();
		},
		updateScore:function(){
			var scoreText = Score.getScore(this.type).toString();
			this.scoreIcon.visible = true;
			if(Score.getScore(this.type) == 0){
				this.scoreIcon.visible = false;
				scoreText = '';
			}
			this.scoreText.setText(scoreText);
		},
		gameover:function(){
			console.log("GAMEOVER");
			TweenLite.killTweensOf(this);
			this.blocks.clear();
			TweenLite.to(this,0.1,{
				ringAnimScale:1.5,
			})
			TweenLite.to(this,2,{
				ringAnimScale:1,
				delay:.1,
				ease:Elastic.easeOut
			});
			background.removeParticles();
			background.grayscale();
            Sound.play('death');
			this.currentScore.show();
			this.pause();
			this.adder.clear();
			Score.updateHighScore(this.type);
            this.setScore(0);
            Vibrate(260);
            this.levelNum = 0;
            this.loadLevel(this.levelNum);
			Storage.remove('last_game');
		},
		render:function(){
			if(this.centerNumText){
		        this.centerNumText.position.x = gameWidth/2 - this.centerNumText.width/2+ this.centerNumText.text.length*1.5+5;
				if(this.centerNumText.text == '0'){
		        	this.centerNumText.position.x = gameWidth/2 + 10 - this.centerNumText.width/2;
				}
		        this.centerNumText.position.y = gameHeight/2 - this.centerNumText.height/2;;
			}


			this.blocks.update();
		    this.rtx.clear();
		    this.rtx.render(this.stage);
		    this.ring.scale.x = this.ringAnimScale;
		    this.ring.scale.y = this.ringAnimScale;


		},
		createAdder:function(){
			var adder = new NewBlocks(3);
			adder.init(this);
			return adder;
		},
		createBlock:function(x,y){
			var block = new Block(x,y);
			block.init(this);
			return block;
		},
		getHoleIfExists:function(){
			var holes = [];
            for (var i = 0; i < 24; i++) {
                if(!this.blocks.find(i,5)){
                	holes.push(i);
                }
            };
            if(!holes.length) return false;

            var hole = [];
            var holeStart = holes[0];
            // console.log(holeStart);
            var nextI = 1;
            var prevI = 1;
            var next = ab(holeStart+nextI,this.num);
            var prev = ab(holeStart-prevI,this.num);
            hole.push(holes[0]);
            while(inArray(prev,holes) && !inArray(prev,hole)){
            	// console.log('add prev',prev);
            	hole.push(prev);
            	prevI++;
            	prev = ab(holeStart-prevI,this.num);
            }
            while(inArray(next,holes) && !inArray(next,hole)){
            	// console.log('add next',next);
            	hole.push(next);
            	nextI++;
            	next = ab(holeStart+nextI,this.num);
            	// console.log('search',next);
            }
            // console.log(hole,holes);

            if(hole.length != holes.length) return false;
            return hole;
		},
		getMaxHeight:function(){
			var maxheight = 0;
            for (var i = 0; i < 24; i++) {
	            for (var h = 0; h < 6; h++) {
	                if(this.blocks.find(i,h)){
	                	maxheight = Math.max(-(h-6),maxheight);
	                }
	            };
            };
            return maxheight;
		},
		check:function(){
            var completed = true;
            for (var i = 0; i < 24; i++) {
                if(!this.blocks.find(i,5)) completed = false;
            };

            // check to flashing
            for (var i = 0; i < 24; i++) {
                if(this.blocks.find(i,2)){
                    for (var j = 0; j < 10; j++) {
                        var bl = this.blocks.find(i,j);
                        if(bl){
                            bl.flash();
                        }
                    };
                } else {
                    for (var j = 0; j < 10; j++) {
                        var bl = this.blocks.find(i,j);
                        if(bl){
                            bl.removeFlash();
                        }
                    };
                }
            };


            if(completed){
                for (var i = 0; i < 24; i++) {
                    this.blocks.find(i,5).remove();
                };
                this.ringSolved();
            }
            var gameover = false;
            for (var n = 0; n < this.blocks.gameobjects.length; n++) {
                if(this.blocks.gameobjects[n].y < this.height-4){
                    gameover = true
                }
            };
            if(gameover) this.gameover();
        }
	}
	
	return GameClass;
})();;var Zen = (function () {
	var _super = GameClass.prototype;

	function Zen(){
		GameClass.call(this);
		this.type = 'zen';
		// this.deadlineLayer = new PIXI.DisplayObjectContainer();
	}
	Zen.prototype = Object.create(_super);
	var p = Zen.prototype;
	p.levels = [
		{
			color:'cold green',
			rings:1,
			groupsMax:1,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:1,
		},
		{
			color:'cold blue',
			rings:3,
			groupsMax:2,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:2,
		},
		{
			color:'cold red',
			rings:5,
			groupsMax:2,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:3,
		},
		{
			color:'cold coffee',
			rings:5,
			groupsMax:3,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:4,
		},
		{
			color:'cold choco',
			rings:5,
			groupsMax:5,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:5,
		},
		{
			color:'cold cyan',
			rings:5,
			groupsMax:4,
			groupsMin:2,
			blocksMax:5,
			blocksMin:2,
			multipler:6,
		},
		{
			color:'cold magent',
			rings:5,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		}
	];

	p.initialization = function(options){
		_super.initialization.call(this,options);
		this.newBlocks();
		this.createCenterNum();
	    this.layer.addChild(this.currentScore.layer);
	}
	p.loadLevelSettings = function(settings){
		_super.loadLevelSettings.call(this,settings);
		console.log('loadLevelSettings');
		if(!settings){
			this.levelSettings.multipler++;
			background.changeColor();
		} else {
			background.changeColor(this.levelSettings.color);
		}
		this.rings = this.levelSettings.rings;
		this.setCenterNum(this.levelSettings.rings);
	}
	p.newGame = function(){
		_super.newGame.call(this);
		this.blocks.clearAll();
		this.newBlocks();
	}
	p.customLoad = function(data){
		this.rings = data.rings;
		this.setCenterNum(this.rings);
	}
	p.customSave = function(data){
		data.rings = this.rings;
	}
	p.newBlocks = function(){
		console.log('newBlocks settings',this.levelSettings);
		if(this.levelSettings){
			var s = this.levelSettings;
     		this.adder.create(s.groupsMin,s.groupsMax,s.blocksMin,s.blocksMax);
		} else {
			this.adder.create(1,3,2,7);
		}
	},
	p.ringSolved = function(){
		_super.ringSolved.call(this);
		this.rings--;
		if(this.rings == 0){
			this.levelNum++;
			this.loadLevel(this.levelNum);
		}
		this.setCenterNum(this.rings);
		this.bulkText();
	}
	var instance = false;
	Zen.create = function(options){
		var options = options || {};
		if(instance){
			console.log('return created');
			return instance;
		}
		instance = new Zen();
		return instance;
	}
	return Zen;
})();;var Koan = (function () {
	var _super = GameClass.prototype;
	function Koan(){
		GameClass.call(this);
		this.type = 'koan';
	}
	Koan.prototype = Object.create(_super);
	var p = Koan.prototype;
	p.levels = [
		{
			color:'cold grey',
			heightMin:4,
			heightMax:3,
			chance:30,
			groupsMax:1,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:1,
		},
		{
			color:'cold green',
			heightMin:4,
			heightMax:3,
			chance:50,
			groupsMax:2,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:2,
		},
		{
			color:'cold blue',
			heightMin:4,
			heightMax:2,
			chance:50,
			groupsMax:2,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:3,
		},
		{
			color:'cold cyan',
			heightMin:3,
			heightMax:2,
			chance:30,
			groupsMax:3,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:4,
		},
		{
			color:'cold green',
			heightMin:3,
			heightMax:2,
			chance:60,
			groupsMax:5,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:5,
		},
		{
			color:'cold dark blue',
			heightMin:3,
			heightMax:1,
			chance:40,
			groupsMax:4,
			groupsMin:2,
			blocksMax:5,
			blocksMin:2,
			multipler:6,
		},
		{
			color:'cold coffee',
			heightMin:3,
			heightMax:1,
			chance:60,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold red',
			heightMin:2,
			heightMax:1,
			chance:40,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold coffee',
			heightMin:2,
			heightMax:1,
			chance:60,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold dark blue',
			heightMin:2,
			heightMax:1,
			chance:70,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold red',
			heightMin:2,
			heightMax:1,
			chance:70,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		}
	];

	p.initialization = function(options){
		_super.initialization.call(this,options);
		this.newBlocks();
		this.createCenterNum();
	    this.layer.addChild(this.currentScore.layer);
	}
	p.loadLevelSettings = function(settings){
		_super.loadLevelSettings.call(this,settings);
		console.log('loadLevelSettings');
		if(!settings){
			this.levelSettings.height = 4;
			this.levelSettings.multipler++;
			background.changeColor();
		} else {
			background.changeColor(this.levelSettings.color);
		}
		this.createBlocks();
	}
	p.newGame = function(){
		_super.newGame.call(this);
		this.blocks.clearAll();
		this.createBlocks();
		this.newBlocks();
	}
	p.newBlocks = function(){
		var s = {
			groupsMin:2,
			groupsMax:4,
			blocksMin:2,
			blocksMax:5
		};
		if(this.levelSettings){
			s = this.levelSettings;
		}
		console.log('newBlocks settings',this.levelSettings);
		var hole = this.getHoleIfExists();
		if(hole && hole.length < 6){
			console.log('create HOLE!');
			this.adder.createByArr(hole);
		} else {
			if(this.getMaxHeight() == 1){
        		this.adder.create(1,1,2,5);
			} else {
        		// this.adder.create(1,4,2,5);
        		this.adder.create(
        			s.groupsMin,
					s.groupsMax,
					s.blocksMin,
					s.blocksMax
				);
			}
		}
	}
	p.check = function(){
		_super.check.call(this);
		this.setCenterNum(this.blocks.gameobjects.length);
	}
	p.createBlocks = function(){		
		var s = {
			heightMin:3,
			heightMax:4,
			chance:30
		};
		if(this.levelSettings){
			s = this.levelSettings;
		}
		var blocks = [];
		for (var i = 0; i < 24; i++) {
			if(Math.random() < (s.chance/100) ){
				// var height = Math.round(Math.random()*2+2)+1;
				var delta = s.heightMax-s.heightMin;
				var height = s.heightMin + Math.round(Math.random()*delta)+1;
				// var height = Math.floor(0)+1;
				for (var h = 5; h > height; h--) {
					blocks.push({
						x:i,
						y:h
					});
				};
			}
		};
		this.blocks.load(blocks);
		this.check();
	}
	p.ringSolved =function(){
		_super.ringSolved.call(this);
		this.setCenterNum(this.blocks.gameobjects.length);
		this.bulkText();

		if(this.blocks.gameobjects.length == 0){
			this.levelNum++;
			this.loadLevel(this.levelNum);
		}
	}
	p.added = function(){
		_super.added.call(this);
		this.setCenterNum(this.blocks.gameobjects.length);
	}
	var instance = false;
	Koan.create = function(options){
		var options = options || {};
		if(instance){
			console.log('return created');
			return instance;
		}
		instance = new Koan();
		return instance;
	}
	return Koan;
})();;var Mondo = (function () {
	var _super = Zen.prototype;
	function Mondo(){
		Zen.call(this);
		this.type = 'mondo';
		this.deadline = this.createDeadline();
	}
	Mondo.prototype = Object.create(_super);
	var p = Mondo.prototype;
	p.levels = [
		{
			color:'cold red',
			rings:1,
			deadline:6,
			groupsMax:1,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:1,
		},
		{
			color:'cold blue',
			rings:3,
			deadline:5,
			groupsMax:2,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:2,
		},
		{
			color:'cold magent',
			rings:5,
			deadline:4,
			groupsMax:2,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:3,
		},
		{
			color:'cold cyan',
			rings:5,
			deadline:3,
			groupsMax:3,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:4,
		},
		{
			color:'cold coffee',
			rings:5,
			deadline:2.5,
			groupsMax:5,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:5,
		},
		{
			color:'cocold choco',
			rings:5,
			deadline:2,
			groupsMax:4,
			groupsMin:2,
			blocksMax:5,
			blocksMin:2,
			multipler:6,
		},
		{
			color:'cold red',
			rings:5,
			deadline:1.5,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		}
	];
	p.createDeadline = function(){
		var dl = new Deadline();
		dl.init(this);
		dl.fired.add(this.onDeadline.bind(this));
		dl.canceled.add(this.startDeadLine.bind(this));
		return dl;
	}
	p.added = function(){
		_super.added.call(this);
        this.resetDeadline();
	}
	p.resetDeadline = function(){
		this.deadline.reset();
	}
	p.startDeadLine = function(){
		this.deadline.start(this.levelSettings.deadline);
	}
	p.onDeadline = function(){
	    this.adder.moveUp();
	    this.resetDeadline();
	}
	p.onOpen = function(){
		console.log('onOpen');
		this.deadline.resume();
	}
	p.onClose = function(){
		this.deadline.pause();
	}
	var instance = false;
	Mondo.create = function(options){
		var options = options || {};
		if(instance){
			console.log('return created');
			return instance;
		}
		instance = new Mondo();
		return instance;
	}
	return Mondo;
})();;var Dharma = (function () {
	var _super = Koan.prototype;
	function Dharma(){
		Koan.call(this);
		this.type = 'dharma';
		this.deadline = this.createDeadline();
	}
	Dharma.prototype = Object.create(_super);
	var p = Dharma.prototype;
	var instance = false;
	p.levels = [
		{
			color:'green',
			heightMin:4,
			heightMax:3,
			chance:30,
			deadline:6,
			groupsMax:1,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:1,
		},
		{
			color:'cold choco',
			heightMin:4,
			heightMax:3,
			chance:50,
			deadline:5,
			groupsMax:2,
			groupsMin:1,
			blocksMax:7,
			blocksMin:4,
			multipler:2,
		},
		{
			color:'cold magent',
			heightMin:4,
			heightMax:2,
			chance:50,
			deadline:4.5,
			groupsMax:2,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:3,
		},
		{
			color:'cold red',
			heightMin:3,
			heightMax:2,
			chance:30,
			deadline:4,
			groupsMax:3,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:4,
		},
		{
			color:'cold coffee',
			heightMin:3,
			heightMax:2,
			chance:60,
			deadline:3.5,
			groupsMax:5,
			groupsMin:2,
			blocksMax:4,
			blocksMin:2,
			multipler:5,
		},
		{
			color:'cold grey',
			heightMin:3,
			heightMax:1,
			chance:40,
			deadline:3,
			groupsMax:4,
			groupsMin:2,
			blocksMax:5,
			blocksMin:2,
			multipler:6,
		},
		{
			color:'cold magent',
			heightMin:3,
			heightMax:1,
			chance:60,
			deadline:2.5,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold green',
			heightMin:2,
			heightMax:1,
			chance:40,
			deadline:2.5,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold coffee',
			heightMin:2,
			heightMax:1,
			chance:60,
			deadline:2,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold grey',
			heightMin:2,
			heightMax:1,
			chance:70,
			deadline:2,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		},
		{
			color:'cold red',
			heightMin:2,
			heightMax:1,
			chance:70,
			deadline:2,
			groupsMax:6,
			groupsMin:2,
			blocksMax:3,
			blocksMin:2,
			multipler:7,
		}
	];

	p.createDeadline = function(){
		var dl = new Deadline();
		dl.init(this);
		dl.fired.add(this.onDeadline.bind(this));
		dl.canceled.add(this.startDeadLine.bind(this));
		return dl;
	}
	p.added = function(){
		_super.added.call(this);
        this.resetDeadline();
	}
	p.resetDeadline = function(){
		this.deadline.reset();
	}
	p.startDeadLine = function(){
		this.deadline.start(this.levelSettings.deadline);
	}
	p.onDeadline = function(){
	    this.adder.moveUp();
	    this.resetDeadline();
	}
	p.onOpen = function(){
		console.log('onOpen');
		this.deadline.resume();
	}
	p.onClose = function(){
		this.deadline.pause();
	}

	Dharma.create = function(options){
		var options = options || {};
		if(instance){
			console.log('return created');
			return instance;
		}
		instance = new Dharma();
		return instance;
	}
	return Dharma;
})();;var BlockBorders = (function () {
	var BlockSize = 20;
	var width = 1.5;
	function BlockBorders(block){
		// this.DOC = new PIXI.DisplayObjectContainer();
		this.gr = new PIXI.Graphics();
		block.DOC.addChild(this.gr);
		this.block = block;
		// this.draw();
	}
	BlockBorders.prototype = {
		draw:function(){
			var nb = this.block.getTypeNeibhoorsBinary();
			// this.gr.clear();
			// this.gr.beginFill(0xffffff);
			// if(nb & 1) this.gr.drawRect(0,0,BlockSize,width);
			// if(nb & 2) this.gr.drawRect(BlockSize-width,0,width,BlockSize);
			// if(nb & 4) this.gr.drawRect(0,BlockSize-width,BlockSize,width);
			// if(nb & 8) this.gr.drawRect(0,0,width,BlockSize);
			// this.gr.endFill();
		}
	}
	return BlockBorders;
})();;var Blocks = (function(){
    function Blocks(game){
        this.game = game;
        this.objects = [];
        this.gameobjects = [];
    }
    Blocks.prototype = {
        update:function(){
            for (var i = 0; i < this.objects.length; i++) {
                this.objects[i].update();
            };
        },
        clear:function(){
            var toRemove = []
            for (var i = 0; i < this.gameobjects.length; i++) {
                toRemove.push(this.gameobjects[i]);
            };
            for (var i = 0; i < toRemove.length; i++) {
                toRemove[i].remove();
            };
        },
        find:function(x,y){
            for (var i = 0; i < this.gameobjects.length; i++) {
                if(this.gameobjects[i].x == ab(x,this.gameobjects[i].game.num) && 
                   this.gameobjects[i].y == y) 
                   return this.gameobjects[i];
            };
            return false;
        },
        destroy:function(block){
            for (var i = 0; i < this.objects.length; i++) {
                if(this.objects[i] == block){
                    this.objects.splice(i,1);
                }
            };
        },
        load:function(data){
            this.clearAll();
            for (var i = 0; i < data.length; i++) {
                var bl = this.game.createBlock(data[i].x,data[i].y);
                bl.add();
            };
        },
        save:function(){
            var toSave = [];
            for (var i = 0; i < this.gameobjects.length; i++) {
                var bl = this.gameobjects[i];
                toSave.push({x:bl.x,y:bl.y});
            };
            return toSave;
        },
        clearAll:function(){
            var toRemove = []
            for (var i = 0; i < this.gameobjects.length; i++) {
                toRemove.push(this.gameobjects[i]);
            };
            for (var i = 0; i < toRemove.length; i++) {
                toRemove[i].destroy();
                this.destroy(toRemove[i]);
                this.remove(toRemove[i]);
            };
        },
        remove:function(block){
            for (var i = 0; i < this.gameobjects.length; i++) {
                if(this.gameobjects[i] == block){
                    this.gameobjects.splice(i,1);
                }
            };
        }
    };
    return Blocks;
})();;var Block = (function(){
    var BlockSize = 20;
    var FALL_TIMEOUT = 0.6;
    var MOVE_TIMEOUT = 0.2;
    function Block(x,y){
        this.falling = false;
        this.x = x;
        this.y = y;
        this.animx = this.x;
        this.animy = this.y;
        this.DOC = new PIXI.DisplayObjectContainer();
        // this.graphics = new PIXI.Graphics();
        this.sprite = new PIXI.Sprite.fromFrame('block');
        this.sprite.width = BlockSize;
        // this.sprite.tint = 0x424242;
        this.sprite.height = BlockSize;

        this.fakeGraphics = new PIXI.Sprite.fromFrame('block');
        this.fakeGraphics.width = BlockSize;
        this.fakeGraphics.height = BlockSize;
        this.fakeGraphics.pivot.x = this.fakeGraphics.width/2;
        this.fakeGraphics.pivot.y = this.fakeGraphics.height/2;
        this.flashgraphics = new PIXI.Sprite.fromFrame('block');
        this.flashgraphics.width = BlockSize;
        this.flashgraphics.height = BlockSize;
        // this.flashgraphics.pivot.x = this.flashgraphics.width/2;
        // this.flashgraphics.pivot.y = this.flashgraphics.height/2;
        this.flashgraphics.visible = false;
        this.flashgraphics.tint = 0x000000;
        // this.DOC.addChild(this.graphics);
        this.fakeGraphics.visible = false;
        this.DOC.addChild(this.sprite);
        this.DOC.addChild(this.flashgraphics);
        // this.DOC.addChild(this.fakeGraphics);
        this.DOC.pivot.x = BlockSize/2;
        this.DOC.pivot.y = BlockSize/2;
        // this.fakeGraphics = new PIXI.Graphics();
    }
    Block.prototype = {
        init:function(game){
            this.game = game;
            this.blocks = game.blocks;
            this.maxx = this.game.num;

            var borderWidth = 2;
            // function drawBlock(gr,color,bcolor,borderWidth){
            //     gr.beginFill(bcolor);
            //     gr.drawRect(0, 0, BlockSize, BlockSize);
            //     gr.endFill();
            //     gr.beginFill(color);
            //     gr.drawRect(0, borderWidth, BlockSize, BlockSize-borderWidth);   
            //     gr.endFill();
            // }
            // this.graphics.clear();

            // this.flashgraphics.visible = false;
            // this.flashgraphics.beginFill(0x000000);
            // this.flashgraphics.drawRect(0,0, BlockSize, BlockSize);
            // this.flashgraphics.endFill();

            // drawBlock(this.graphics,0x424242,0x353535,borderWidth);


            this.x = ab(this.x,this.game.num);
            this.y = this.y;
            this.animx = this.x;
            this.animfx = this.x;
            this.animy = this.y;
            this.layer = this.game.blockLayer;
            this.show();
            this.blocks.objects.push(this);
            this.update();
        },
        hide:function(){
            this.layer.removeChild(this.DOC);
            this.layer.removeChild(this.fakeGraphics);
        },
        show:function(){
            this.layer.addChild(this.DOC);
            // this.layer.addChild(this.DOC);
            this.layer.addChild(this.fakeGraphics);
        },
        flashing:function(){
            if(this.flashingAnim){
                this.flashingAnim.kill();
            }
            this.flashgraphics.alpha = 1;
            this.flashingAnim = TweenLite.to(this.flashgraphics,0.2,{
                alpha:0.1,
                onComplete:this.flashing.bind(this)
            });
        },
        flash:function(){
            this.flashgraphics.visible = true;
            if(!this.isFlashing){
                this.flashing();
                this.isFlashing = true;
            }
        },
        removeFlash:function(){
            this.isFlashing = false;
            this.flashgraphics.visible = false;
            if(this.flashingAnim){
                this.flashingAnim.kill();
            }
        },
        setText:function(str){
        },
        add:function(){
            this.added = true;
            this.blocks.gameobjects.push(this);
        },
        move:function(x,y){
            if(this.moveXanim) this.moveXanim.kill();
            if(this.moveXFanim) this.moveXFanim.kill();
            if(this.moveYanim) this.moveYanim.kill();
            
            var fall = (y>this.y)?true:false;
            var raise = (this.y>y)?true:false;
            var dist = Math.abs(y-this.y);
            var nx = ab(x,this.game.num);
            var oldX = this.x;
            this.y = y;
            this.x = nx;
            this.animx = oldX;
            this.moveXanim = TweenLite.to(this,MOVE_TIMEOUT,{
                animx:this.x
            });            

            var fakeblockseen = false;
            if(oldX == 0 && this.x == this.game.num-1){
                // console.log("YAY!");
                this.moveXanim.kill();
                this.animx = this.game.num;
                this.animfx = 0;
                this.moveXanim = TweenLite.to(this,MOVE_TIMEOUT,{
                    animx:this.x
                });

                this.moveXFanim = TweenLite.to(this,MOVE_TIMEOUT,{
                    animfx:-1
                });
                fakeblockseen = true;
            }
            if(oldX == this.game.num-1 && this.x == 0){
                this.moveXanim.kill();
                this.animfx = oldX;
                this.animx = -1;
                this.moveXanim = TweenLite.to(this,MOVE_TIMEOUT,{
                    animx:this.x
                });
                this.moveXFanim = TweenLite.to(this,MOVE_TIMEOUT,{
                    animfx:oldX+1
                });
                fakeblockseen = true;
            }
            if(fakeblockseen){
                this.fakeGraphics.visible = true;
            } else {
                this.fakeGraphics.visible = false;
            }
             
            if(fall){
                this.moveYanim = TweenLite.to(this,FALL_TIMEOUT,{
                    animy:this.y,
                    ease: Bounce.easeOut
                })
                // setTimeout(Block.check,FALL_TIMEOUT*1000);
            } 
            if(raise) {
                this.moveYanim = TweenLite.to(this,0.3,{
                    animy:this.y,
                    // ease: Elastic.easeOut
                    onComplete:this.game.check.bind(this.game)
                });
                // setTimeout(Block.check,0.3*1000);
            }
        },
        destroy:function(){
            for (var i = 0; i < this.layer.children.length; i++) {
                if(this.layer.children[i] == this.DOC){
                    this.layer.removeChildAt(i);
                }
            };
            this.blocks.remove(this);
        },
        remove:function(){
            var findedBlock = this.blocks.find(this.x,this.y-1);
            if(findedBlock){
                findedBlock.moveDown();
            }

            TweenLite.to(this,0.8,{
                animy:this.animy + 5,
            });

            TweenLite.to(this.DOC.scale,0.6,{
                y:0,
                onComplete:function(){
                    // this.graphics.clear();
                    this.destroy();
                    this.blocks.destroy(this);
                }.bind(this)
            });
            this.removeFlash();
            this.blocks.remove(this);
        },
        moveDown:function(){
            var findedBlock = this.blocks.find(this.x,this.y-1);
            if(findedBlock){
                findedBlock.moveDown();
                this.falling = true;
            } else {
                this.falling = false;
            }

            var findedBlock = this.blocks.find(this.x,this.y+1);
            while(!findedBlock){
                this.y++;
                findedBlock = this.blocks.find(this.x,this.y+1);
            }
            this.move(this.x,this.y+1);
        },
        moveUp:function(){
            var findedBlock = this.blocks.find(this.x,this.y-1);
            // console.log(this.x,this.y-1);
            if(findedBlock){
                findedBlock.moveUp();
            }
            this.move(this.x,this.y-1);
        },
        update:function(){
            this.DOC.x = this.animx*BlockSize + BlockSize/2;
            this.DOC.y = this.animy*BlockSize + BlockSize/2-4;

            this.fakeGraphics.x = this.animfx*BlockSize + BlockSize/2;
            this.fakeGraphics.y = this.animy*BlockSize + BlockSize/2-4;
        }
    }
    return Block;
})();;var NewBlocks = (function(){
    function NewBlocks(num){
        this.num = num;
        this.type = 0;
        this.blocks = [];
        this.x = 0;
        this.y = 10;
    }


    function ab(a,b){
        return (a % b + b) % b;
    }
    function find(x){
        for (var i = 0; i < this.blocks.length; i++) {
            if(this.blocks[i].x == ab(x,this.game.num)){
                return this.blocks[i];
            }
        };
        return false;
    };

    NewBlocks.prototype = {
        init:function(game){
            this.game = game;
            this.y = game.height;
            this.num = game.num;
            this.blocks = [];
        },
        create:function(groupsMin,groupsMax,blocksMin,blocksMax){
            this.clear();
            count = 1;
            var s = 0;
            for (var j = 0; j < range(groupsMin,groupsMax); j++) {
                var secN = range(blocksMin,blocksMax);
                for (var i = 0; i < secN; i++) {
                    var nx = this.x+i+s;
                    if(!find.call(this,nx)){
                        this.blocks.push(this.game.createBlock(nx,this.y));
                    }
                };
                s += secN + 3+Math.floor(Math.random()*12);
            };
        },
        createByArr:function(array){
            // this.clear();
            this.blocks = [];
            for (var i = 0; i < array.length; i++) {
                this.blocks.push(this.game.createBlock(array[i],this.y));
            };
        },
        clear:function(){
            for (var i = 0; i < this.blocks.length; i++) {
                var bl = this.blocks[i];
                bl.destroy();
            };
            this.blocks = [];
        },
        save:function(){
            var data = [];
            for (var i = 0; i < this.blocks.length; i++) {
                data.push({x:this.blocks[i].x,y:this.blocks[i].y});
            };
            return data;
        },
        load:function(data){
            this.clear();
            for (var i = 0; i < data.length; i++) {  
                this.blocks.push(this.game.createBlock(data[i].x,data[i].y));
            };
        },
        move:function(delta){
            this.x+=delta;
            for (var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].move(this.blocks[i].x+delta,this.y);
            };
            Sound.play('move');
            Vibrate(10);
        },
        show:function(){
            
        },
        hide:function(){
            
        },
        moveUp:function(){
            var time = Date.now();
            if(this.lastTime == undefined){
                this.lastTime = 0;
            }
            if(time > this.lastTime + 100){  
                for (var i = 0; i < this.blocks.length; i++) {
                    var bl = this.blocks[i];
                    bl.add();
                    bl.moveUp();
                };
                this.x += Math.floor(Math.random()*24);
                this.blocks = [];
                this.game.added();
                this.lastTime = time;
            }
            // try{
            //     throw new Error();
            // } catch(e){
            //     console.log(e.stack);
            // }
        },
        update:function(){
        }
    }
    return NewBlocks;
})();


;var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;

// localStorage.clear();
// var gameWidth = 360;
// var gameHeight = 480;

// var gameWidth = 320;
// var gameHeight = 320;
// gameWidth /= 1.8;;
// gameWidth = (360/2)/320*360;
// gameHeight = (360/2)/320*480;


var stats = new Stats();
stats.setMode(1); // 0: fps, 1: ms

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.bottom = '0px';


var PixelRatio = window.devicePixelRatio;
var rendered = new Signal();

var basestage = new PIXI.Stage(0x202020);
var renderer = PIXI.autoDetectRenderer(gameWidth,gameHeight);
var renderTexture = new PIXI.RenderTexture(gameWidth, gameHeight);
var backgroundTexture = new PIXI.RenderTexture(gameWidth/2, gameHeight/2);
var stage = new PIXI.Stage(0x000000);
var bgStage = new PIXI.Stage(0x000000);


PIXI.blendModesWebGL[PIXI.blendModes.OVERLAY] = [renderer.gl.DST_ALPHA,renderer.gl.DST_COLOR];
document.body.appendChild(renderer.view);

// document.body.appendChild( stats.domElement );



var background = new Background;
bgStage.addChild(background.layer);
// bgStage.addChild(background.layerDebug);

// var topMenu = new TopMenu();

var states = new States();


if(Storage.get('music-opt') == null){
	Storage.set('music-opt',true);
}
if(Storage.get('sound-opt') == null){
	Storage.set('sound-opt',true);
}
if(Storage.get('vibro-opt') == null){
	Storage.set('vibro-opt',true);
}


var settingsIcon = new SettingIcon();
var backIcon = new BackIcon();
// var settings = new Settings();
// Locale-aware asset loading. Original 1.1.4 used tizen.systeminfo.getPropertyValue('LOCALE');
// on web we use navigator.language ('ru-RU', 'en-US', etc.) — same logic, different source.
var spriteSheet = (navigator.language || 'en').toLowerCase().indexOf('ru') === 0
	? 'spriteSheet.json'
	: 'spriteSheet_en.json';

var aloader = new PIXI.AssetLoader([spriteSheet, 'font/Comfortaa.fnt']);
aloader.addEventListener('onComplete',function(){
	background.init();
	TouchInput.init();
	Score.init();
	Sound.init();
	// topMenu.init();
	settingsIcon.init();
	backIcon.init();



	states.open(states.states.title);
	// settings.init();

	quad.update();
	// if(window.location.href.match(/mothgames.ru/) || window.location.href.match(/home\/roman/)){
		animate();
	// }
	// setInterval(animate,1000/10);

},false)
aloader.load();

var time = Date.now();
var quad = new PIXI.Quad(backgroundTexture,renderTexture);
stage.addChild(quad);
function animate() {
    stats.end();
    stats.begin();
	rendered.dispatch();
    requestAnimFrame( animate );

    backgroundTexture.clear();
    backgroundTexture.render(bgStage);

    renderTexture.clear();
    renderTexture.render(basestage);
    renderer.render(stage);
}

// Letterbox the canvas to fit the viewport, preserving the load-time aspect ratio.
// Game internals render at the original gameWidth/gameHeight; CSS scales the canvas.
// Game-object positions are baked at construction time (136 gameWidth/Height refs
// across 12 files) — re-laying out in place would be a refactor; letterbox is the
// pragmatic visual fit for an archive build.
function fitCanvas(){
    var aspect = gameWidth / gameHeight;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var fitByWidth = w / aspect <= h;
    var cssW = Math.floor(fitByWidth ? w : h * aspect);
    var cssH = Math.floor(fitByWidth ? w / aspect : h);
    renderer.view.style.width  = cssW + 'px';
    renderer.view.style.height = cssH + 'px';
}
window.addEventListener('resize', fitCanvas);
fitCanvas();

;var Sound = (function () {
	var moveSnd,
		placeSnd,
		deathSnd,
		completeSnd,
		musicSnd,
		sounds;
	
	var Sound = {
		init:function(){
			// moveSnd = new buzz.sound( "sounds/move", {
			//     formats: [ "ogg" ],
			//     preload: true
			// });

			// placeSnd = new buzz.sound( "sounds/place", {
			//     formats: [ "ogg" ],
			//     preload: true
			// });

			// deathSnd = new buzz.sound( "sounds/death", {
			//     formats: [ "ogg" ],
			//     preload: true
			// });

			// completeSnd = new buzz.sound( "sounds/complete", {
			//     formats: [ "ogg" ],
			//     preload: true
			// });

			// Music & SFX disabled: the original 2014 build shipped licensed audio
			// (PremiumBeat) that isn't redistributable in this public source repo.
			// All audio-related init, wheel-volume, M-mute, and focus/blur handlers
			// are commented out to avoid 404s on sounds/music.ogg and runtime errors
			// on undefined musicSnd. To re-enable when you have a CC0 track:
			//   1. drop the file at sounds/music.ogg
			//   2. uncomment the block below
			//
			// var savedVolume = Storage.get('music-volume');
			// var volume = (savedVolume == null) ? 50 : savedVolume;
			// musicSnd = new buzz.sound( "sounds/music", {
			//     formats: [ "ogg" ],
			//     preload: true,
			//     loop: true,
			//     volume: volume
			// });
			// var startMusic = function(){
			//     if(Storage.get('music-opt')){ musicSnd.play(); }
			//     document.removeEventListener('touchstart', startMusic);
			//     document.removeEventListener('mousedown', startMusic);
			//     document.removeEventListener('keydown', startMusic);
			// };
			// document.addEventListener('touchstart', startMusic);
			// document.addEventListener('mousedown', startMusic);
			// document.addEventListener('keydown', startMusic);
			// document.addEventListener('wheel', function(e){
			//     var v = musicSnd.getVolume();
			//     v = Math.max(0, Math.min(100, v + (e.deltaY < 0 ? 5 : -5)));
			//     musicSnd.setVolume(v);
			//     Storage.set('music-volume', v);
			//     e.preventDefault();
			// }, {passive: false});
			// Mousetrap.bind('m', function(){
			//     Storage.set('music-opt', !Storage.get('music-opt'));
			//     return false;
			// });
			// Storage.changed.add(function(key,oldValue,enabled){
			//     if(key == 'music-opt'){
			//         if(enabled){ musicSnd.unmute(); musicSnd.play(); }
			//         else { musicSnd.pause(); musicSnd.mute(); }
			//     }
			// });
			// sounds = {
			// 	'move':moveSnd,
			// 	'place':placeSnd,
			// 	'complete':completeSnd,
			// 	'death':deathSnd,
			// 	// 'music':musicSnd,
			// }
		},
		play:function(name){
			// if(name == 'move'){
			// 	new buzz.sound( "/sounds/move", {
			// 	    formats: [ "mp3" ]
			// 	}).play();
			// 	return;
			// }

			// new buzz.sound( "/sounds/move", {
			//     formats: [ "ogg" ],
			//     preload: true,
			//     autoplay: true,
			// });
			// if(Storage.get('sound-opt')){
			// 	if(sounds[name]){
			// 		sounds[name].stop();
			// 		sounds[name].play();
			// 	}
			// }
		}
	}

	// window.addEventListener('focus', function(){
	//     if(Storage.get('music-opt')){ musicSnd.play(); }
	// });
	// window.addEventListener('blur', function(){
	//     musicSnd.stop();
	// });
	return Sound;
})();;var Vibrate = (function () {
	// enable vibration support
	navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
	var enabled = false;
	if (navigator.vibrate) {
		enabled = true;
	}
	// enabled = false;
	var Vibrate = function(ms){
		if(Storage.get('vibro-opt') && enabled){
			navigator.vibrate(ms);
		}
	}

	// Vibrate.init();
	return Vibrate;
})();;var TouchInput = (function(){
	var lastVec;
	var lastCenterVec;
	var blob;
	var touchBlob;
	var blobSplat;
	var blobSplatAnim;
	var moveStart = false
	var touch = new Victor(gameWidth/2,gameHeight/2);
	var lasttouch = touch.clone();
	var startVec = touch.clone();
	var lastDir = new Victor(0,0);
	var touched = false;
	var gameRect = new PIXI.Rectangle(0,0,gameWidth,gameHeight);
	var lastTouchTime = 0;
	var TOUCH_DELAY = 30;
	TouchInput = {
		enabled:true,
		fingerControlPhases:0,
		tapped:new Signal(),
		back:new Signal(),
		turnedCV:new Signal(),
		turnedCCV:new Signal(),
		init:function(){
			blob = new PIXI.Sprite.fromFrame('bokeh.png');
			blob.pivot.x = blob.width/2;
			blob.pivot.y = blob.height/2;
			blob.x = gameWidth/2;
			blob.y = gameHeight/2;
			blob.tint = 0x000000;
			blob.alpha = 0.1;
			blob.visible = false;

			touchBlob = new PIXI.Sprite.fromFrame('bokeh.png');
			touchBlob.pivot.x = touchBlob.width/2;
			touchBlob.pivot.y = touchBlob.height/2;
			touchBlob.x = gameWidth/2;
			touchBlob.y = gameHeight/2;
			touchBlob.width = 80;
			touchBlob.height = 80;
			touchBlob.alpha = 0.2;
			touchBlob.tint = 0x000000;
			touchBlob.visible = false;
			basestage.addChild(blob);
			basestage.addChild(touchBlob);

			this.initEvents();

			rendered.add(this.update.bind(this));
		},
		update:function(){
			if(!this.enabled) return;
			var moved = false;
			// console.log('update call');
			var posx = blob.x-touch.x;
			var posy = blob.y-touch.y;
			var vec = new Victor(posx,posy);

			touchBlob.x = touch.x;
			touchBlob.y = touch.y;
			if(!lastVec){
				lastVec = vec;
			}
			var deltaStart = touch.clone().subtract(startVec);
			var deltaVec = new Victor(lastVec.x,lastVec.y).subtract(vec);
			var deltaTouchVec = lasttouch.clone().subtract(touch);
			var deltaAng = deltaVec.angleDeg();
			var blobVec = new Victor(blob.x,blob.y);
			var directionVec = blobVec.clone().subtract(touch);
			var direction = directionVec.clone().norm();
			var directionLength = directionVec.length();
			var centerDistance = new Victor(gameWidth/2,gameHeight/2).distance(blobVec);
			var maxSize = 120;
			var percentDis = (centerDistance/gameHeight)*1.8;
			var radiusMod = maxSize - (percentDis)*maxSize + 10;
			var radiusMod = 30;
			var newPos = touch.clone().add(directionVec.norm().multiply({x:radiusMod,y:radiusMod}));
			blob.width = radiusMod*2;
			blob.height = radiusMod*2;
			blob.x += (newPos.x - blob.x)*0.2;
			blob.y += (newPos.y - blob.y)*0.2;
			if(moveStart){
				touchBlob.visible = true;
				blob.visible = true;
			}

			// var dir = lasttouch.clone().subtract(touch).norm();
			var dir = vec.clone().subtract(touch).norm();
			if(moveStart && deltaTouchVec.length() > 20){
				// for (var i = 0; i < deltaTouchVec.length()-20; i+=20) {
					// var deltaTouchVecUpdate = lasttouch.clone().subtract(touch);
					// console.log('call');
					// var CV = dir.clone().cross(lastDir);
					var CV = vec.clone().norm().cross(lastVec.norm());
						
					var LControl = (Math.abs(CV) < 0.1);
					// if(LControl){
					// }
					if(this.linearControl){
						LControl = true;
						if(Math.abs(CV) > 0.3){
							this.fingerControlPhases--;
							if(this.fingerControlPhases < -5){
								this.fingerControlPhases = -5;
								// console.log(this.fingerControlPhases);
								LControl = false;
								this.linearControl = false;
							}
						}
					}
					// LControl = true;
					if(LControl){
						this.linearControl = true; // finger circle
						var centerVec = new Victor(gameWidth/2 - touch.x, gameHeight/2 - touch.y);
						var CV = (centerVec.clone().norm().cross(lastCenterVec.norm()) < 0);
						lastCenterVec = centerVec;
						if(CV){
							TouchInput.turnedCV.dispatch();

						} else {
							TouchInput.turnedCCV.dispatch();
						}
						moved = true;
						// addBlob();
					} else {

						this.fingerControlPhases++;
						if(this.fingerControlPhases > 5){
							this.fingerControlPhases = 5;
						}
						// console.log(this.fingerControlPhases);

						// this.linearControl = false;
						// console.log(Math.abs(CV));


						if(!lastVec){
							lastVec = vec;
						}
						var isCV = (CV < 0);
						if(isCV){
							TouchInput.turnedCV.dispatch();
						} else {
							TouchInput.turnedCCV.dispatch();
						}
						moved = true;
						addBlob();
					}
					// if(moved){
					// 	TouchInput.update();
					// }
					lastVec = vec;
					lastDir = dir;
					lasttouch = touch.clone();
				// };
			}

			if(!moveStart && deltaStart.length() > 10){
				blob.alpha = 0.1;
				moveStart = true;
				lasttouch = touch.clone();
				this.fingerControlPhases = 0;
				lastDir = dir;
				lastVec = vec;
				lastCenterVec = new Victor(gameWidth/2 - touch.x, gameHeight/2 - touch.y);
			}
		},
		initEvents:function(){
			document.addEventListener('mousemove',onmousemove,false);
			document.addEventListener('mousedown',onmousedown,false);
			document.addEventListener('mouseup',onmouseup,false);	

			document.addEventListener('touchmove',ontouchmove,false);
			document.addEventListener('touchstart',ontouchstart,false);
			document.addEventListener('touchend',ontouchend,false);	
			Mousetrap.bind(['left', 'a'], function(){ TouchInput.turnedCCV.dispatch(); return false; });
			Mousetrap.bind(['right', 'd'], function(){ TouchInput.turnedCV.dispatch(); return false; });
			Mousetrap.bind(['up', 'w', 'space', 'enter'], function(){
				TouchInput.tapped.dispatch(new Victor(gameWidth/2, gameHeight/2));
				return false;
			});
			Mousetrap.bind(['down', 's', 'esc', 'backspace'], function(){ TouchInput.back.dispatch(); return false; });
		}
	};

	// Canvas is CSS-letterboxed but renders at fixed gameWidth × gameHeight.
	// Convert page coords (mouse/touch event) into the canvas's internal coordinate space.
	function pageToCanvas(pageX, pageY){
		var rect = renderer.view.getBoundingClientRect();
		var sx = gameWidth  / rect.width;
		var sy = gameHeight / rect.height;
		return new Victor((pageX - rect.left) * sx, (pageY - rect.top) * sy);
	}

	function addBlob(){
		var blobSplat = new PIXI.Sprite.fromFrame('bokeh.png');
		blobSplat.pivot.x = blobSplat.width/2;
		blobSplat.pivot.y = blobSplat.height/2;
		blobSplat.x = touch.x;
		blobSplat.y = touch.y;
		blobSplat.tint = 0x000000;
		blobSplat.alpha = 0.3;
		blobSplat.width = 60;
		blobSplat.height = 60;

		basestage.addChild(blobSplat);

		TweenLite.to(blobSplat,0.3,{
			alpha:0.03,
			width:200,
			height:200,
			onComplete:function(){
				basestage.removeChild(blobSplat)
			}
		});
	}

	function onmousedown(e){
		lastTouchTime = Date.now();
		touched = true;
		moveStart = false;
		touch = pageToCanvas(e.pageX, e.pageY);
		startVec = touch.clone();
	}

	function onmouseup(e){
		touched = false;
		if(moveStart == false){

			if(gameRect.contains(touch.x,touch.y)){
				
			// if(touch.y < 50){
			// 	TouchInput.back.dispatch();
			// } else {
				if(Date.now() - lastTouchTime > TOUCH_DELAY){
					TouchInput.tapped.dispatch(touch);
				}
			// }
			}
		}
		touch = new Victor(gameWidth/2,gameHeight/2);
		startVec = touch.clone();
		moveStart = false;
		touchBlob.visible = false
		blob.visible = false;
		blob.alpha = 0.1;
	}

	function onmousemove(e){
		if(touched){
			var p = pageToCanvas(e.pageX, e.pageY);
			if(gameRect.contains(p.x, p.y)){
				touch = p;
				TouchInput.update();
			}
		}
	}

	function ontouchstart(e){
		lastTouchTime = Date.now();
		touch = pageToCanvas(e.touches[0].pageX, e.touches[0].pageY);
		startVec = touch.clone();
		moveStart = false;
	}

	function ontouchend(e){
		if(moveStart == false){

			if(gameRect.contains(touch.x,touch.y)){
				
			// if(touch.y < 50){
			// 	TouchInput.back.dispatch();
			// } else {
				if(Date.now() - lastTouchTime > TOUCH_DELAY){
					TouchInput.tapped.dispatch(touch);
				}
				// TouchInput.tapped.dispatch(touch);
			// }
			}
			// if(touch.y < 50){
			// 	TouchInput.back.dispatch();
			// } else {
				// TouchInput.tapped.dispatch(touch);
			// }
		}
		touch = new Victor(gameWidth/2,gameHeight/2);
		startVec = touch.clone();
		moveStart = false;
		touchBlob.visible = false
		blob.visible = false;
		blob.alpha = 0.1;
	}

	function ontouchmove(e){
		var p = pageToCanvas(e.touches[0].pageX, e.touches[0].pageY);
		if(gameRect.contains(p.x, p.y)){
			touch = p;
		}
	}
	// TouchInput.tapped.add(function(){
	// 	console.log('tapped');
	// });

	// TouchInput.turnedCV.add(function(){
	// 	console.log('turnedCV');
	// });

	// TouchInput.turnedCCV.add(function(){
	// 	console.log('turnedCCV');
	// });
	return TouchInput;
})();
