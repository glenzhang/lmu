///<reference path="../core/lmu.js" />
///<reference path="../extend/jquery.extend.js" />
///<reference path="../../../../libs/jquery/jquery.js" />

/**
 * @file imglazyload
 * @import core/lmu.js, vendors/jquery/jquery.js, extend/jquery.extend.js
 */

(function ($) {

    $.fn.imglazyload = function (options) {
        var settings = $.extend({
            threshold: 0,
            container: window,
            skip_invisible: true,
            data_attribute: 'original'
        }, options);

        var elements = this;
        var len = elements.length;
        var count = 0;
        var eventNamespace = '.IMGLAZYLOAD';
        var $window = $(window);

        $window.on("scroll{0} resize{0}".format(eventNamespace), function () {
            elements.each(function () {
                var $this = $(this);

                if (!$this.is(":visible")) {
                    return true;
                }

                if (!$.belowthefold($this, settings) && !$.rightoffold($this, settings)) {
                    $this.trigger("appear");
                }
            });
        });

        return this.each(function () {
            var $this = $(this);
            var imgSrc = $this.attr('src');
            var imgAttribute = $this.data(settings.data_attribute);

            if (!$this.is(":visible")) {
                return true;
            }

            function setup() {
                $this.one("appear", function () {
                    $this.attr('src', imgAttribute);
                    count++;
                    if (count >= len) {
                        $window.off(eventNamespace);
                    }
                });

                initialition();
            }

            function initialition() {
                if (!$.belowthefold($this, settings) && !$.rightoffold($this, settings)) {
                    $this.trigger("appear");
                }
            }

            setup();
        });
    };
})(jQuery);