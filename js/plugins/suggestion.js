///<reference path="../core/lmu.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file suggestion
 * @import core/lmu.js, vendors/jquery/jquery.js
 */

(function ($) {

    $.fn.suggestion = function (options) {
        var settings = $.extend(true, {}, {
            // 源
            source: [],
            // 搜索结果的最大值
            limit: 10,
            delay: 10,
            // 搜索完成
            complete: $.noop,
            resultClass: "lmu-suggestion-result",
            select: $.noop,
            offset: {
                x: 0,
                y: 0,
                w: 0
            }
        }, options);

        var source = settings.source;
        var resultClass = settings.resultClass;
        var settingsOffset = settings.offset;
        var $result = $(".{0}".format(resultClass));
        var isLocalSearch = $.isArray(source);
        var timeId;
        var $input;
        var cachedVal;

        return this.each(applyBehavior);

        function applyBehavior() {
            if ($result.length == 0) {
                $result = $("<div class='{0}'></div>".format(resultClass)).appendTo("body");
            }

            $result.on("click", ".J_lmu_suggestion_item a", function (ev) {
                ev.preventDefault();
                var text = $(this).text();
                $input.val(text);
                $result.hide();
                settings.select(text);
            });

            $input = $(this).on("keyup.suggestion", keyupHandler);

            $input.on("focusout.suggestion", function () {
                if ($result.is(":visible")) {
                    setTimeout(function () {
                        $result.hide();
                        cachedVal = $.trim($input.val());
                    }, 250);
                }
            });

            $input.on("focusin.suggestion", function () {
                if ($.trim($input.val()) == cachedVal) {
                    $result.show();
                }
            });

            adjustResultPosition();
        }

        function keyupHandler() {
            var val = $.trim($input.val());
            timeId && clearTimeout(timeId);
            if (val) {
                timeId = setTimeout(function () {
                    search(val);
                }, settings.delay);
            } else {
                flush();
            }
        }

        function search(val) {
            if (isLocalSearch) {
                filterSource(val, source);
            } else {
                getRemoteSource(val);
            }
        }

        function getRemoteSource(val) {
            $.getJSON(source, {
                k: val
            }, function (res) {
                if (res.status == 1) {
                    filterSource(val, res.data.source || []);
                }
            });
        }

        function filterSource(val, source) {
            var len;
            var result;
            var resultString;

            source = source || [];
            len = source.length;

            if (len == 0) {
                return;
            }

            result = [];
            resultString = new StringBuilder();

            $.each(source, function (idx, item) {
                if (item.text.indexOf(val) > -1 && result.length < 10) {
                    result.push(item);
                }
            });

            if (result.length > 0) {
                settings.complete(result);
                resultString.append("<ul>");
                $.each(result, function (idx, item) {
                    resultString.append("<li class='lmu-suggestion-item J_lmu_suggestion_item'><a href='{0}'>{1}</a></li>".format(item.value, item.text));
                });

                resultString.append("</ul>");

                flush();

                $result.append(resultString.toString()).show();
            } else {
                flush();
            }

        }

        function adjustResultPosition() {
            var inputOffset = $input.offset();

            $result.css({
                left: inputOffset.left + settingsOffset.x + "px",
                top: inputOffset.top + settingsOffset.y + $input.height() + "px",
                width: $input.width() + settingsOffset.w + "px"
            });
        }

        function flush() {
            $result.html('').hide();
        }
    };

})(jQuery);
