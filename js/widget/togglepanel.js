///<reference path="../core/lmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file dialog
 * @import vendors/jquery/jquery.js, core/lmu.js, core/widget.js
 */

LMU.UI.define("TogglePanel", {
    init: function () {
        // toggle direction, up down left right
        this.direction = "up";
        this.effect = "all .3s ease-in-out";
        this.$toggleEle = "";
        this.mask = false;
        this.beforeShowCallback = $.noop;
        this.afterHideCallback = $.noop;
    },

    setup: function () {
        this.transitionCssProp = "-webkit-transition";
        this.transformCssProp = "-webkit-transform";
        this.translateX = "translateX";
        this.translateY = "translateY";
        this.translateX0 = "translateX(0)";
        this.translateX100 = "translateX(100%)";
        this.translateX_100 = "translateX(-100%)";
        this.translateY0 = "translateY(0)";
        this.translateY100 = "translateY(100%)";
        this.translateY_100 = "translateY(-100%)";

        /*
        if (this.mask) {
            this.$toggleEle.wrap("<div style='width:100%;height:100%; background:rgba(0, 0, 0, .4);'></div>");
            this.$toggleEle = this.$toggleEle.parent();
        }
        */

        if (this.mask) {
            this.$mask = $("<div style='position:fixed; left:0; top: 0; z-index: 98; display:none; width:100%;height:100%; background:rgba(0, 0, 0, .4);'></div>").appendTo("body")
        }

        this.$toggleEle.css(this.transitionCssProp, this.effect)
            .css({
                position: "fixed",
                zIndex: 99
            });

        this["_{0}_deactivate".format(this.direction)]();

        // this.deactivate();

        /*
        this.$toggleEle[0].addEventListener('webkitTransitionEnd', function (ev) {
            console.log(ev.type);
        }, false);
        */
    },

    _up_deactivate: function () {
        return this.$toggleEle.css("bottom", "0").css(this.transformCssProp, this.translateY100);
    },

    _up_activate: function () {
       return this.$toggleEle.css(this.transformCssProp, this.translateY0);
    },

    _down_deactivate: function () {
        return this.$toggleEle.css("top", "0").css(this.transformCssProp, this.translateY_100);
    },

    _down_activate: function () {
        return this.$toggleEle.css(this.transformCssProp, this.translateY0);
    },

    _left_deactivate: function () {
        return this.$toggleEle.css("left", "0").css(this.transformCssProp, this.translateX_100);
    },

    _left_activate: function () {
        return this.$toggleEle.css(this.transformCssProp, this.translateX0);
    },

    _right_deactivate: function () {
        return this.$toggleEle.css("right", "0").css(this.transformCssProp, this.translateX100);
    },

    _right_activate: function () {
        this.$toggleEle.css(this.transformCssProp, this.translateX0);
    },

    activate: function () {
        this.beforeShowCallback();
        this.$mask && this.$mask.show();
        this.$toggleEle.show();
        setTimeout(this.proxy(function () {
            this["_{0}_activate".format(this.direction)]();
        }), 0);
    },

    deactivate: function () {
        this.$mask && this.$mask.hide();
        this["_{0}_deactivate".format(this.direction)]();
        setTimeout(this.proxy(function () {
            this.$toggleEle.hide();
            this.afterHideCallback();
        }), 350);
    }
});