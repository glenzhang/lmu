///<reference path="../../../../libs/jquery/jquery.js" />
///<reference path="../core/lmu.js" />

/**
 * @file dialog
 * @import core/lmu.js
 */
(function (LDO) {

    var publisher = {
        subscribers: {
            any: []
        },

        subscribe: function (fn, type) {
            type = type || "any";

            if (typeof this.subscribers[type] === "undefined") {
                this.subscribers[type] = [];
            }

            this.subscribers[type].push(fn);
        },

        unsubscribe: function (fn, type) {
            this.visitSubscribers("unsubscribe", fn, type);
        },

        publish: function (publication, type) {
            this.visitSubscribers("publish", publication, type);
        },

        visitSubscribers: function (action, arg, type) {
            var pubtype = type || "any";
            var subscribers = this.subscribers[pubtype] || [];
            var len = subscribers.length;

            for (var i = 0; i < len; ++i) {
                if (action == "publish") {
                    subscribers[i](arg);
                } else {
                    if (subscribers[i] === arg) {
                        subscribers.splice(i, 1);
                    }
                }
            }
        }
    };

    LDO.prop("makePublisher", function (o) {
        for (var i in publisher) {
            if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
                o[i] = publisher[i]
            }
        }

        o.subscribers = {
            any: []
        };
        return o;
    });

}(LMU.namespace("LMU.DP.Observer")));