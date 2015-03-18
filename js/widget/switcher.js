///<reference path="../core/lmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file dialog
 * @import vendors/jquery/jquery-2.1.1.js, core/lmu.js, core/widget.js
 */

LMU.UI.define("Switcher", {
    init: function () {
        this.parent = null;
        this.$checkboxEle = "";
        this.children = [];
        this.style = "";
        this.onCallback = $.noop;
        this.offCallback = $.noop;
    },

    setup: function () {
        var $checkboxEle = this.$checkboxEle;
        var style = this.style != "" ? "-{0}".format(this.style) : "";
        var $parent = $('<a class="lmu-switcher{0} J_lmu_switcher" href="javascript:void(0);"><i></i></a>'.format(style));
        this.onClass = "lmu-switcher{0}-on".format(style);
        this.offClass = "lmu-switcher{0}-off".format(style);

        if ($checkboxEle.attr("data-checked") == "1") {
            $parent.addClass(this.onClass);
            this.onCallback();
        } else {
            $parent.addClass(this.offClass);
            this.offCallback();
        }

        $checkboxEle.replaceWith($parent);
        $parent.append($checkboxEle.hide());

        // retrieve parent node
        $parent = $checkboxEle.parents(".J_lmu_switcher");

        // global $parent variant
        this.$parent = $parent;

        $parent.on("click", this.proxy(function (ev) {
            if (!$parent.hasClass(this.onClass)) {
                this.checkedSelf();
                this.onCallback();
            } else {
                this.unCheckedSelf();
                this.offCallback();
            }
        }));

        this._checkedParent();
    },

    addToParent: function () {
        var p = this.parent;
        p && p.children.push(this);
    },

    removeFromParent: function () {
        var p = this.parent;
        p && p.children.splice(p.children.indexOf(this), 1);
    },

    checkedSelf: function () {
        this.$parent.removeClass(this.offClass).addClass(this.onClass);
        this.$checkboxEle.attr("data-checked", "1");
        this._checkedParent();
        this._checkedChildren();
    },

    unCheckedSelf: function () {
        this.$parent.removeClass(this.onClass).addClass(this.offClass);
        this.$checkboxEle.removeAttr("data-checked");

        this._unCheckedParent();
        this._unCheckedChildren();
    },

    _checkedParent: function () {
        var p = this.parent;

        if (p && this._checkAll(p)) {
            p.$checkboxEle.attr("data-checked", "1");
            p.$parent.removeClass(this.offClass).addClass(this.onClass);
            p.onCallback();

            this._checkedParent.call(p);
        }
    },

    _unCheckedParent: function () {
        var p = this.parent;
        if (p) {
            p.$checkboxEle.removeAttr("checked");
            p.$parent.removeClass(this.onClass).addClass(this.offClass);
            p.offCallback();
            this._unCheckedParent.call(p);
        }
    },

    _unCheckedChildren: function () {
        for (var i = 0, children = this.children, len = children.length; i < len; i++) {
            var child = children[i];
            child.$parent.removeClass(this.onClass).addClass(this.offClass)
            child.$checkboxEle.removeAttr("data-checked");

            if (child.children.length) {
                this._unCheckedChildren.call(child);
            }
        }
    },

    _checkedChildren: function () {
        for (var i = 0, children = this.children, len = children.length; i < len; i++) {
            var child = children[i];
            child.$parent.removeClass(this.offClass).addClass(this.onClass)
            child.$checkboxEle.attr("data-checked", "1");

            if (child.children.length) {
                this._checkedChildren.call(child);
            }
        }
    },

    _checkAll: function (parent) {
        var returnVal = true;

        for (var i = 0, children = parent.children, len = children.length; i < len; i++) {
            var $childrenCheckbox = children[i].$checkboxEle;

            if (!$childrenCheckbox.attr("data-checked")) {
                returnVal = false;
                break;
            }
        }

        return returnVal;
    }
});
