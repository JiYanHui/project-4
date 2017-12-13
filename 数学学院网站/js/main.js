// vim: ts=4 sw=4 et ai
(function () {
    $(document).on("scroll.laf", function () {
        if ($(document).scrollTop() >=
            $("#top-bar .place-holder-for-min").offset().top +
            $("#top-bar .place-holder-for-min").height() -
            $("#top-bar-min .bg").height()) {
            if (! $("#top-bar-min").hasClass("fixed")) {
                $("#top-bar-min").addClass("fixed");
                var target = {}
                target["padding-left"] = $("#top-bar-min > ul > li.mark").css("padding-left");
                target["padding-right"] = $("#top-bar-min > ul > li.mark").css("padding-right");
                target["width"] = $("#top-bar-min > ul > li.mark").css("width");
                $("#top-bar-min > ul > li.mark")
                    .css("padding-left", "0px")
                    .css("padding-right", "0px")
                    .css("width", "0px")
                    .css("display", "list-item")
                    .animate(target, 300, "swing", function () {
                        $("#top-bar-min > ul > li.mark")
                            .css("padding-left", "")
                            .css("padding-right", "")
                            .css("width", "");
                    });
                $("#top-bar-min > .bg").fadeIn(200);
            }
        } else {
            if ($("#top-bar-min").hasClass("fixed")) {
                $("#top-bar-min")
                    .removeClass("fixed")
                $("#top-bar-min > .bg")
                    .css("display", "");
                $("#top-bar-min > ul > li.mark")
                    .animate({
                        "padding-left": "0px",
                        "padding-right": "0px",
                        "width": "0px"
                    }, 200, "swing", function () {
                        $(this)
                            .css("display", "")
                            .css("padding-left", "")
                            .css("padding-right", "")
                            .css("width", "");
                    });
            }
        }
    });
})();

(function () {
    function setupOmegaSymbol () {
        var rndSym = ["sym-o", "sym-a", "sym-i"];
        $("#top-bar .omega > ." + rndSym[parseInt(rndSym.length * Math.random())])
            .css("display", "inline")
            .css("visibility", "hidden");
        $(document).on("mathjaxready.laf-omega", function () {
            $("#top-bar .omega > *").css("visibility", "");
        })
    }

    function setupNavBar () {
        $("#top-bar-min > ul").on("click.laf", "li", function (e) {
            if ($(e.target).is(":not(a)")) {
                window.location = $(e.target).find("a").attr("href");
                e.preventDefault();
            }
        })
    }

    function setupFolds () {
        $("div.fold").each(function () {
            var title = $(this).children().first().detach(),
                contents = $(this).contents(),
                ccontainer;
            $(this)
                .append(title)
                .append(ccontainer = $('<div/>')
                    .addClass("contents")
                    .append(contents));
            var hidden;
            if (! $(this).hasClass("expanded-fold")) {
                ccontainer.hide();
                hidden = true;
            }
            title.on('click.laf-fold', function () {
                if (hidden) {
                    ccontainer.show(200);
                    ccontainer.addClass("expanded-fold");
                } else {
                    ccontainer.hide(100);
                    ccontainer.removeClass("expanded-fold");
                }
                hidden = !hidden;
            })
        });
    }

    function setupSlide () {
        var
            indexes = {};
        document.originalTitle = document.title;
        $("div.slidebox").each(function (slideboxIndex) {
            var
                slides = $(this).find("div.slide").detach();
            $(this).children().remove();
            var
                labels = $("<div/>").appendTo(this),
                content = $("<div/>").appendTo(this),
                stateFree = $(this).hasClass("state-free-slidebox");
            slides.each(function (index) {
                var id = $(this).attr("id").substring(6);
                $(this).data("title", $(this).children().first().appendTo(labels).text());
                if (window.location.hash === "#" + id ||
                    (index === 0 && (window.location.hash === "#" || window.location.hash == ""))) {
                    content.css("margin-left", - index + "00%");
                    if (! stateFree)
                    //document.title = $(this).data("title") + " - " + document.originalTitle;
                        if (window.history !== undefined) {
                            window.history.replaceState({"slide": id}, document.title, window.location.href);
                        }
                }
                indexes[id] = index;
            });
            content
                .css("width", slides.length + "00%")
                .append(slides.css("width", 100 / slides.length + "%"))
                .append('<div style="clear: both"></div>');
        });

        // function for switching slide
        window.slide = function (id, push) {
            if (push === undefined) {
                push = true;
            }
            if (typeof id === "number") {
                index = id;
            } else {
                index = indexes[id];
            }
            var target = $("#slide-" + id),
                stateFree = target.closest("div.slidebox").hasClass("state-free-slidebox");
            if (! stateFree) {
                //document.title = target.data("title") + " - " + document.originalTitle;
            }
            target.parent().animate({
                "marginLeft": - index + "00%"
            }, 300);
            if (! stateFree && push && window.history !== undefined) {
                history.pushState({"slide": id}, document.title, window.location.pathname + '#' + id);
            }
        };
        $(window).on("popstate.laf-slide", function (e) {
            if (e.originalEvent.state !== null) {
                slide(e.originalEvent.state["slide"], false);
            }
        });
    }

    $(document).ready(function () {
        setupOmegaSymbol();
        setupNavBar();
        setupFolds();
        setupSlide();
    });

})();