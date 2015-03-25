///<reference path="../core/lmu.js" />
///<reference path="../vendors/jquery/jquery.js" />

/**
 * @file slidescreen
 * @import core/lmu.js, vendors/jquery/jquery.js
 */

(function ($) { 
    $.fn.slidescreen = function (options) {
        var settings = $.extend({
            innerSelector: ".J_screen_inner",
            nextBtnSelector: ".J_go_to_next",
            pageSelector: "section",
            triggers: false,
            triggersWrapCls: "slidescreen-triggers",
            callback: $.noop,
            currentPageClass: "currentpage",
            currentTriggerClass: "current"
        }, options);

        return this.each(function () {
            var $documet = $(document);
            var $this = $(this);
            var $inner = $this.find(settings.innerSelector);
            var $pages = $this.find(settings.pageSelector);
            var triggers = settings.triggers;
            var triggersWrapCls = settings.triggersWrapCls;
            var callback = settings.callback;

            var currentPageClass = settings.currentPageClass;
            var currentTriggerClass = settings.currentTriggerClass;
            var draggingClass = "lmu-drag";

            var curPage = 0;
            var pageWidth = 0, pageHeight = 0;
            var startX = 0, startY = 0, margin = 0;
            var scrollPrevent = false, movePrevent = false, touchDown = false;

            function setup() {
                initPage();
                addEventLister();
            }

            function addEventLister() {
                $documet.on("touchstart", settings.innerSelector, function (e) {
                    e = e.originalEvent.changedTouches[0];
                    onStart(e);
                    $inner.addClass(draggingClass);
                })
                .on("touchmove", settings.innerSelector, function (e) {
                    onMove(e.originalEvent.changedTouches[0], e.originalEvent);
                })
                .on("touchend", settings.innerSelector, function (e) {
                    onEnd(e.originalEvent.changedTouches[0]);
                    $inner.removeClass(draggingClass);
                });

                $inner[0].addEventListener('webkitTransitionEnd', function (ev) {
                    $pages.removeClass(currentPageClass);
                    $pages.eq(curPage).addClass(currentPageClass);
                    callback(curPage + 1);

                    if (triggers) {
                        var $t = $this.find(".{0} li".format(triggersWrapCls));
                        $t.removeClass(currentTriggerClass);
                        $t.eq(curPage).addClass(currentTriggerClass);
                    }

                }, false);

                $documet.on("click", settings.nextBtnSelector, function () {
                    nextPage();
                });
            }

            function initPage() {
                pageWidth = $(window).width();
                pageHeight = $this.height();

                $pages.css({
                    "width": pageWidth + "px",
                    "height": pageHeight + "px"
                });

                animatePage(curPage);

                if (triggers) {
                    createTriggers();
                }
            }

            function createTriggers() {
                var triggerStringBuilder = new StringBuilder();

                triggerStringBuilder.append('<ul class="{0}">'.format(triggersWrapCls));
                for (var i = 0; i < $pages.length; i++) {
                    triggerStringBuilder.append('<li {0}>{1}</li>'.format(i == 0 ? "class='{0}'".format(currentTriggerClass) : "", i + 1));
                }
                triggerStringBuilder.append('</ul>');

                $(triggerStringBuilder.toString()).appendTo($this).find("li").on("click", function () {
                    animatePage($(this).index());
                });
            }

            function onStart(e) {
                if (movePrevent == true) {
                    event.preventDefault();
                    return false;
                }

                scrollPrevent = false;
                touchDown = true;

                startX = e.pageX;
                startY = e.pageY;

                margin = $inner.css("-webkit-transform");
                margin = margin.replace("matrix(", "");
                margin = margin.replace(")", "");
                margin = margin.split(",");
                margin = parseInt(margin[5]);
            }

            function onMove(e, oe) {
                if (movePrevent == true || touchDown != true) {
                    event.preventDefault();
                    return false;
                }

                event.preventDefault();

                if (scrollPrevent == false && e.pageY != startY) {
                    var temp = margin + e.pageY - startY;
                    $inner.css("-webkit-transform", "matrix(1, 0, 0, 1, 0, " + temp + ")");
                }
            }

            function onEnd(e) {
                if (movePrevent == true) {
                    event.preventDefault();
                    return false;
                }

                touchDown = false;

                if (scrollPrevent == false) {
                    // Ì§Æðµã£¬Ò³ÃæÎ»ÖÃ
                    endX = e.pageX;
                    endY = e.pageY;

                    // swip ÊÂ¼þÄ¬ÈÏ´óÓÚ50px²Å»á´¥·¢£¬Ð¡ÓÚÕâ¸ö¾Í½«Ò³Ãæ¹é»Ø
                    if (Math.abs(endY - startY) <= 50) {
                        animatePage(curPage);
                    }
                    else {
                        if (endY > startY) {
                            prevPage();
                        }
                        else {
                            nextPage();
                        }
                    }
                }
            }

            function prevPage() {
                animatePage(curPage - 1);
            }

            function nextPage() {
                animatePage(curPage + 1);
            }

            function animatePage(newPage) {
                if (newPage < 0) { newPage = 0; }
                if (newPage > $pages.length - 1) { newPage = $pages.length - 1; }
                curPage = newPage;
                $inner.css("-webkit-transform", "matrix(1, 0, 0, 1, 0, " + (newPage * (-pageHeight)) + ")");
            };

            $.fn.slidescreen.moveTo = function (newPage) {
                animatePage(newPage);
            };

            setup();
        });
    };
})(jQuery);