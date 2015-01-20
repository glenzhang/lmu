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
        var content = (options && options.content) || "操作成功" ;
        if (options && options.autoClose) {
            this.autoClose = options.autoClose;
        }
        
        this.$dialog = $("<div class='lmu-dl-wrap lmu-dl-scale lmu-dl-modal-wrap'><div class='lmu-dl-content'>{0}</div></div>".format(content)).appendTo("body");
        this._updatePosition();
    }
});