///<reference path="../core/lmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file dialog
 * @import vendors/jquery/jquery.js, core/lmu.js, core/widget.js, widget/dialog.js
 */

LMU.UI.define("Spinner", {  

    init: function () {
        this.$container = "";
        this.min = 1;
        this.max = 100000;
        this.useDefaultTip = true;
        this.biggerThanMaxHandler = $.noop;
        this.smallerThanMinHandler = $.noop;
        this.name = "";
        this.plusHanlder = $.noop;
        this.subtractHandler = $.noop;
    },

    setup: function () {
        var $container = this.$container;

        if (!$container) {
            return;
        }
        var name = this.name;
        var domString = new StringBuilder();
        var subtractClass = "J_lmu_spinner_subtract";
        var numberClass = "J_lmu_spinner_number";
        var plusClass = "J_lmu_spinner_plus";

        domString.append('<div class="lmu-spinner"><i class="subtract-icon {0}"></i>'.format(subtractClass))
                    .append('<input readonly="readonly" type="text" {0} class="number {1}" value="{2}"/>'.format(name ? "name={0}".format(name) :"", numberClass, this.min))
                 .append('<i class="plus-icon {0}"></i></div>'.format(plusClass));

        $container.append(domString.toString());

        this.$subtractBtn = $container.find(".{0}".format(subtractClass));
        this.$plusBtn = $container.find(".{0}".format(plusClass));
        this.$number = $container.find(".{0}".format(numberClass));

        this.$plusBtn.on("touchend", this.proxy(function () {
            this._pulsClickHandler();
        }));

        this.$subtractBtn.on("touchend", this.proxy(function () {
            this._subtractClickHandler();
        }));

        this.$number.on("focusout", this.proxy(function () {
            this._focusoutHandler();
        }));

        this.tipDialog = new LMU.UI.Dialog();
        this.tipDialog.render = "alert";
        this.tipDialog.setup();
    },

    restore: function () {
        this.$number.val(this.min);
    },

    setVal: function (val) {
        this.$number.val(val);
    },

    getVal: function () {
        return $.trim(this.$number.val());
    },

    _pulsClickHandler: function () {
        var currentVal = $.trim(this.$number.val());
        var max = this.max;
        var afterPlus = parseInt(currentVal) + 1;

        if (afterPlus <= max) {
            this.$number.val(afterPlus);
            this.plusHanlder();
        } else {
            if (this.useDefaultTip) {
                this.tipDialog.getContent().html("已经是最大值啦");
                this.tipDialog.load();
            }

            this.biggerThanMaxHandler();
        }
    },

    _subtractClickHandler: function () {
        var currentVal = $.trim(this.$number.val());
        var min = this.min;
        var afterSubtract = parseInt(currentVal) - 1;

        if (afterSubtract >= min) {
            this.$number.val(afterSubtract);
            this.subtractHandler();
        } else {
            if (this.useDefaultTip) {
                this.tipDialog.getContent().html("已经是最小值啦");
                this.tipDialog.load();
            }
            this.smallerThanMinHandler();
        }
    },

    _focusoutHandler: function () {
        var currentVal = $.trim(this.$number.val());
        var min = parseInt(this.min);
        var max = parseInt(this.max);

        if (currentVal < min) {
            this.$number.val(min);
        }

        if (currentVal > max) {
            this.$number.val(max);
        }
    }
});