if (require.main) {
    define = function (moduleName, demands, valueGenerator) {
        var imported = [];

        for (var i = demands.length; i--;) {
            imported.unshift(require("./" + demands[i]));
        }

        module.exports = valueGenerator.apply(this, imported);
    }
}

define('events', ['arrayUtils'], function (arrayUtils) {
    return {
        addHandler: function (event, callback) {
            if (!this._callbacks) {
                this._callbacks = {};
            }

            if (!this._callbacks[event]) {
                this._callbacks[event] = [];
            }

            this._callbacks[event].push(callback);
        },

        removeHandler: function (event, callback) {
            if (callback && this._callbacks && this._callbacks[event]) {
                arrayUtils.exclude(this._callbacks[event], callback);
            }

            if (this._triggerQueue && this._triggerQueue.length) {
                arrayUtils.exclude(this._triggerQueue, callback);
            }
        },

        loop: function (event, callback) {
            if (!this._selfCallbacks) {
                this._selfCallbacks = {};
            }

            this._selfCallbacks[event] = callback;
        },

        unloop: function(event) {
            if (this._selfCallbacks && this._selfCallbacks[event]) {
                this._selfCallbacks[event] = null;
            }
        },

        removeAllHandlers: function (event) {
            if (!event) {
                this._callbacks = null;
                this._selfCallbacks = null;
                this._triggerQueue = null;
            } else {
                if (this._callbacks && this._callbacks[event]) {
                    if (this._triggerQueue && this._triggerQueue.length && this._callbacks[event]) {
                        for (var index = this._callbacks[event].length; index--;) {
                            arrayUtils.exclude(this._triggerQueue, this._callbacks[event][index]);
                        }
                    }
                    this._callbacks[event] = null;
                }

                if (this._selfCallbacks && this._selfCallbacks[event]) {
                    this._selfCallbacks[event] = null;
                }
            }
        },

        trigger: function (event, param1, param2, noLoop, noHandlers) {
            if (this.dead) {
                _.log("DEAD TRIGGER: " + event);
                return;
            }

            if (!noLoop && this._selfCallbacks && this._selfCallbacks[event]) {
                this._selfCallbacks[event].call(this, param1, param2);
            }

            if (noHandlers || !this._callbacks || !this._callbacks[event] || !this._callbacks[event].length) {
                return;
            }

            //TODO vd do not push callbacks if queue empty?
            this._triggerQueue = this._triggerQueue || [];
            this._triggerQueue.push.apply(this._triggerQueue, this._callbacks[event]);

            var handler;
            while (this._triggerQueue && (handler = this._triggerQueue.shift())) { //TODO vd do not iterate if triggerQueue is not empty(it is already executing)
                handler(param1, param2);
            }
        }
    };
});