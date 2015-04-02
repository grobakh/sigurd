var assert = require('assert');

describe("event", function () {
    var events = require('../lib/events');
    var EventObject = function () {
    };
    EventObject.prototype = events;
    EventObject.prototype.constructor = EventObject;

    describe("loop unloop", function (){
        it("test loop on rewrite", function () {
            // assign
            var invoked = false;
            var invoked1 = false;
            var context = new EventObject();
            context.loop('ping', function () {
                invoked = true;
            });

            context.loop('ping', function () {
                invoked1 = true;
            });

            context.trigger("ping");

            assert(!invoked, "invocation not done");
            assert(invoked1, "invocation 1 done");
        });

        it("test event unloop", function () {
            var invoked = false;
            var context = new EventObject();
            var handler = function () {
                invoked = true;
            };
            context.loop('ping', handler);
            context.unloop('ping');
            context.trigger('ping');
            assert(!invoked, "handler was not called after unlooping");

        });
    });

    describe("add remove handlers", function () {
        it("test event on", function () {
            // assign
            var invoked = false;
            var context = new EventObject();
            context.loop('ping', function () {
                invoked = true;
            });
            context.trigger('ping');

            assert(invoked, "invocation done");
        });

        it("test event off", function () {
            // assign
            var invoked = false;
            var context = new EventObject();
            context.loop('ping', function () {
                invoked = true;
            });

            context.removeAllHandlers('ping');
            context.trigger('ping');

            assert(!invoked, "invocation not done");
        });

        it('test event and handler', function () {
            // assign
            var invoked = false;
            var handler1 = false;
            var handler2 = false;
            var context = new EventObject();

            context.loop('ping', function () {
                invoked = true;
            });

            context.addHandler('ping', function () {
                handler1 = true;
            });

            context.addHandler('ping', function () {
                handler2 = true;
            });

            context.trigger('ping');

            assert(invoked, "invocation done");
            assert(handler1, "invocation handler 1 done");
            assert(handler2, "invocation handler 2 done");
        });

        it("test event and off handler", function () {
            // assign
            var invoked = false;
            var handler1 = false;
            var handler2 = false;
            var context = new EventObject({ counter: 10 });

            context.loop('ping', function () {
                invoked = true;
            });

            var v = function () {
                handler1 = true;
            };

            context.addHandler('ping', v);
            context.removeHandler('ping', v);

            context.trigger('ping');

            assert(invoked, "invocation done");
            assert(!handler1, "invocation handler 1 not done");
        });

        it("test event removeAllHandlers should remove all handlers from triggerQueue", function () {
            var invoked = false;
            var wasInterrupted;
            var context = new EventObject({});
            var handler = function () {
                if(!wasInterrupted)
                {
                    context.removeAllHandlers('ping');
                    wasInterrupted = true;
                    return;
                }
                invoked = true;
            };

            context.addHandler('ping', handler);
            context.addHandler('ping', handler);
            context.addHandler('ping', handler);

        });

        it("test event removeHanlder should remove all same handlers from callbacks", function () {
            var invoked = false;
            var handler = function () {
                invoked = true;
            };
            var context = new EventObject({});
            context.addHandler('ping', handler);
            context.addHandler('ping', handler);
            context.addHandler('ping', handler);
            context.removeHandler('ping', handler);
            context.trigger('ping');

            assert(!invoked, "all same handlers were removed from callbacks");

        });

        it("test event removeHanlder should remove all same handlers from triggerQueue", function () {
            var invoked = false;
            var wasInterrupted;
            var context = new EventObject({});

            var handler = function () {
                if (!wasInterrupted) {
                    context.removeHandler('ping', handler);
                    wasInterrupted = true;
                    return;
                }
                invoked = true
            };

            context.addHandler('ping', handler);
            context.addHandler('ping', handler);
            context.addHandler('ping', handler);
            context.trigger('ping');

            assert(!invoked, "all same handlers were removed from triggerQueue");
        });

        it("test event execution order of multiple triggers (with non empty triggerQueue)", function () {
            var invoked = false;
            var orderIsOk = false;
            var context = new EventObject({});

            var handler1 = function () {
                context.trigger('ping2');
                invoked = true;
            };

            var handler2 = function () {
                if (invoked) {
                    orderIsOk = true;
                }
            };

            context.addHandler('ping1', handler1);
            context.addHandler('ping2', handler2);
            context.trigger('ping');

            assert(orderIsOk, "multiple trigger calls were executed in expected order");
        });
    });
});