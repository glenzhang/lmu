// 1. native object extension
// 2. LMU namespace
Function.prototype.method = function (name, fn) {
    if (typeof this.prototype[name] == "undefined") this.prototype[name] = fn;
};

!String.prototype.trim && String.method("trim", function () {
    // " hello world! ".trim() -> "hello world!"
    return this.replace(/^\s+|\s+$/g, '');
});

!Function.prototype.bind && Function.method("bind", function (oThis) {
    if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
});

String.method("format", function () {
    //"welcome to {0}, {1}!".format("Fanli", "dude") -> welcome to Fanli, dude!
    for (var s = this, i = 0; i < arguments.length; ++i) {
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    }
    return s;
});

var StringBuilder = function () {
    // var sb = new StringBuilder();
    // sb.append("hello").append(" ").append("world!").toString();
    // output "hello world!"
    this.strings = new Array();
}

StringBuilder.prototype = {
    constructor: StringBuilder,
    append: function (str) {
        this.strings.push(str);
        return this;
    },
    toString: function () {
        return this.strings.join("");
    }
};

var LMU = {
    namespace: function () {
        var a = arguments,
            o = null,
            i, j, d, rt;
        for (i = 0; i < a.length; ++i) {
            d = a[i].split(".");
            rt = d[0];

            if (typeof window[rt] == "undefined") {
                window[rt] = {
                    prop: function (k, v, c) {
                        if (!this[k]) {
                            this[k] = v;
                        }
                        return !c ? this : this[k];
                    }
                };
            }
            o = window[rt];
            for (j = 1; j < d.length; ++j) {
                o[d[j]] = o[d[j]] || {};
                o = o[d[j]];
                o.prop = function (k, v, c) {
                    if (!this[k]) {
                        this[k] = v;
                    }

                    return !c ? this : this[k];
                };
            }
        }

        return o;
    },

    Class: function (parent) {
        var klass = function () {
            this.init.apply(this, arguments);
        };

        if (parent) {
            var subclass = function () {};
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass();
        }

        if (!klass.prototype.init) {
            klass.prototype.init = function () {};
        }

        klass.fn = klass.prototype;
        klass.fn.parent = klass;

        // static method
        klass.extend = function (obj) {
            var extended = obj.extended;
            for (var i in obj) {
                klass[i] = obj[i];
            }

            if (extended) {
                extended(klass);
            }
        };

        // instance method
        klass.include = function (obj) {
            var included = obj.included;

            for (var i in obj) {
                klass.fn[i] = obj[i];
            }

            if (included) {
                included(klass);
            }
        };

        klass.proxy = function (func) {
            var self = this;

            return (function () {
                return func.apply(self, arguments);
            });
        };

        klass.fn.proxy = klass.proxy;

        klass.hookPlugin = function (pgobj) {
            if (Object.prototype.toString.call(pgobj) === "[object Object]") {
                for (var k in pgobj) {
                    if (pgobj.hasOwnProperty(k)) {
                        klass.fn[k] = pgobj[k];
                    }
                }
            }
        };

        return klass;
    },

    prop: function (k, v, c) {
        if (!this[k]) {
            this[k] = v;
        }
        return !c ? this : this[k];
    }
};
