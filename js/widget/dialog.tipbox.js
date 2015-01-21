///<reference path="../core/lmu.js" />
///<reference path="../core/widget.js" />
///<reference path="../widget/dialog.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file dialog.tipbox.js
 * @import vendors/jquery/jquery.js, core/fmu.js, core/widget.js, widget/dialog.js
 */

LMU.UI.Dialog.hookPlugin({
    "modal": function (options) {
        var modalTemplate = new StringBuilder();
        modalTemplate.append("<div class='lmu-dl-wrap lmu-dl-scale lmu-dl-modal-wrap'>")
            .append("<div class='lmu-dl-content'></div>")
            .append("</div>");

        this.$dialog = $(modalTemplate.toString()).appendTo("body");
    },

    "alert": function () {
        var alertTemplate = new StringBuilder();
        alertTemplate.append("<section class='lmu-dl-wrap lmu-dl-alert-wrap'>")
            .append("<div class='lmu-dl-content'>alert</div>")
            .append("<div class='lmu-dl-btns'>")
            .append("<button class='J_lmu_dl_close'>确定</button>")
            .append("</div>")
            .append("</section>");

        this.$dialog = $(alertTemplate.toString()).appendTo("body");
    },

    "confirm": function () {
        var confirmTemplate = new StringBuilder();
        confirmTemplate.append("<section class='lmu-dl-wrap lmu-dl-alert-wrap lmu-dl-confirm-wrap'>")
            .append("<div class='lmu-dl-content'>confirm</div>")
            .append("<div class='lmu-dl-btns'>")
            .append("<button class='J_lmu_dl_close'>取消</button><button class='J_lmu_dl_confirmed'>确定</button>")
            .append("</div>")
            .append("</section>");
        
        this.confirmHandler = $.noop;

        this.$dialog = $(confirmTemplate.toString()).appendTo("body");

        this.$dialog.on('click{0}'.format(this.eventNamespace), '.J_lmu_dl_confirmed', this.proxy(function (ev) {
            var $this = $(ev.target);
            $this.attr("disabled", true);
            this.close();
            this.confirmHandler();
            $this.removeAttr("disabled");
        }));
    }
});
