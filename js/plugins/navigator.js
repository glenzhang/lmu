///<reference path="../core/lmu.js" />
///<reference path="../vendors/jquery/jquery-2.1.1.js" />
///<reference path="../vendors/iscroll/iscroll-lite-v5.js" />

/**
 * @file navigator
 * @import core/lmu.js, vendors/jquery/jquery.js, vendors/iscroll/iscroll-lite-v5.js
 */

(function ($) {
    $.extend({
        navigator: function (options) {

            var settings = $.extend(true, {}, {
                wrapperSelector: "#J_lmu_navigator_wrapper",
                $scroller: $("#J_lmu_navigator_scroller")
            }, options);

            var $scroller = settings.$scroller;
            var myScroll;
            var $lis = $scroller.find("li");
            var $firstLi = $lis.eq(0);

            // rest sroller的宽度，方便水平滚动是实际宽度，必须在实例化ISCROLL之前
            $scroller.width(($lis.eq(0).width() + parseInt($lis.eq(0).css("margin-left")) + parseInt($lis.eq(0).css("margin-right"))) * $lis.length);

            myScroll = new IScroll(settings.wrapperSelector, {
                scrollX: true,
                scrollY: false,
                eventPassthrough: "vertical"
            });
        }
    });

}(jQuery));
