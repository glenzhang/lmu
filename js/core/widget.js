/// <reference path="lmu.js" />
/**
 * @file 定义了创建lmu组件的方法
 * @import core/lmu.js
 */

(function () {  

    LMU.UI.Base = new LMU.Class();

    LMU.UI.Base.include({
        eventNamespace: ".LMUEVENT",
        destroy: function () {
            // to be improved
            $("a,button,input").off(this.eventNamespace);
        }
    });

    LMU.UI.prop("define", function (name, protypes, superclass) {
        if (typeof superclass != "function") {
            superclass = this.Base;
        }

        protypes = protypes || {};

        // syntactic sugar
        LMU.UI.prop(name, new LMU.Class(superclass), true).include(protypes);
    });

}(LMU.namespace("LMU.UI")));