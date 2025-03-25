jQuery.noConflict();
(function ($) {
    $(document).ready(function () {
        /* Check Url if there have any ID*/
        var trigger = '', hash_link = window.location.hash;
        if (hash_link.includes("oxi-tabs-trigger-")) {
            var explode = hash_link.split("-"), parent = explode[3], child = explode[4];
            console.log(parent);
            console.log(child);

            OxiTabsEqualHeight(parent, child);
            OxiTabsController(parent, child);
        } else {
            $('[class*=oxi-tabs-wrapper-]').each(function () {
                var This = $(this), id = This.attr('id'), explode = id.split("-"), parent = explode[3];
                OxiTabsEqualHeight(parent, child);
                OxiTabsController(parent);
            });
        }
        /* Check any btn click for confirm event for tabs*/
        $(document).on('click tap touchstart', '[id^="oxi-tabs-trigger-"]', function (e) {
            e.preventDefault();
            var wrapper = $(this).attr('id'), explode = wrapper.split("-"), parent = explode[3], child = explode[4];
            OxiTabsController(parent, child);
        });


        $('a[href*="#oxi-tabs-trigger-"]').click(function (e) {
            e.preventDefault();
            var wrapper = $(this).attr('href'), explode = wrapper.split("-"), parent = explode[3], child = explode[4];

            OxiTabsController(parent, child);
        });



        /* Tabs Header Hover  Data Confirmation*/
        $(".oxi-tabs-hover-event .oxi-tabs-header-li").hover(function () {
            var link = $(this).data("link");
            if (typeof link !== typeof undefined && link !== false && $(".shortcode-addons-template-body").length === 0) {
                var target = '_self';
                if (link.target === 'yes') {
                    var target = ", '_blank'";
                }
                window.open("" + link.url + "", "" + target + "");
            } else {
                var t = $(this).attr('ref'), explode = t.split("-"), parent = explode[3], child = explode[4];
                OxiTabsController(parent, child);
            }
        });





        /* Tabs Header Click Data Confirmation*/
        $(document).on('click tap touchstart', '.oxi-tabs-click-event .oxi-tabs-header-li', function () {


            var link = $(this).data("link");
            if (typeof link !== typeof undefined && link !== false && $(".shortcode-addons-template-body").length === 0) {
                var target = '_self';
                if (link.target === 'yes') {
                    var target = ", '_blank'";
                }
                window.open("" + link.url + "", "" + target + "");
            } else {
                var t = $(this).attr('ref'), explode = t.split("-"), parent = explode[3], child = explode[4];
                OxiTabsController(parent, child);


            }
        });
        function OxiTabsController(p = '', c = '') {
            var cls = '#oxi-tabs-wrapper-' + p + " .oxi-tabs-ultimate-style";
            var title = '#oxi-tabs-wrapper-' + p + " .oxi-tabs-ultimate-style .oxi-tabs-ultimate-header-" + p + " .oxi-tabs-header-li";
            var mtitle = '#oxi-tabs-wrapper-' + p + " .oxi-tabs-ultimate-style .oxi-tabs-ultimate-header-" + p + " .oxi-tabs-body-header";
            var content = '#oxi-tabs-wrapper-' + p + " .oxi-tabs-ultimate-style .oxi-tabs-body-" + p;
            var j = $(cls).data('oxi-tabs'), parent = p, child = c;

            if (c === '') {
                if (window.matchMedia('screen and (max-width: 993px)').matches) {
                    var current = $(title + j.initial).eq(0).nextAll().length;
                    var t = $(title + j.initial).attr('ref'), explode = t.split("-"), parent = explode[3], child = explode[4];

                    if (current == 0) {
                        $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent).hide();
                    } else {
                        $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent).show();
                    }

                    $('.oxi-tabs-ultimate-header-desktop.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).nextAll().hide();
                    $('.oxi-tabs-ultimate-header-desktop.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).show();
                    $('.oxi-tabs-ultimate-header-desktop.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).prevAll().show();
                    $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).hide();
                    $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).prevAll().hide();
                    $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).nextAll().show();
                } else {
                    $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent).hide();
                }
                $(title + j.initial).addClass("active");
                $(mtitle + j.initial).addClass("active");
                $(content + j.initial).addClass("active");
            } else {
                var header = '.oxi-tabs-header-li-' + p + '-' + c,
                    contentbody = '#oxi-tabs-body-' + p + '-' + c;
                if ($(header).hasClass('active')) {
                    if (j.trigger === '1' && j.type !== 'oxi-tabs-hover-event') {

                        if (window.matchMedia('screen and (max-width: 993px)').matches) {

                            var childid = parseInt(child, 10), current = $('.oxi-tabs-ultimate-header-desktop.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).eq(0).nextAll().length;


                            if (current == 0) {
                                $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent).hide();
                            } else {
                                $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent).show();
                            }

                            $('.oxi-tabs-ultimate-header-desktop.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).nextAll().hide();
                            $('.oxi-tabs-ultimate-header-desktop.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).show();
                            $('.oxi-tabs-ultimate-header-desktop.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).prevAll().show();
                            $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).hide();
                            $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).prevAll().hide();
                            $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).nextAll().show();

                        } else {
                            $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent).hide();
                        }

                        $(header).removeClass("active");
                        $(contentbody).removeClass(j.animation).toggleClass("active");

                    }
                    return false;
                } else {

                    if (window.matchMedia('screen and (max-width: 993px)').matches) {

                        var childid = parseInt(child, 10), current = $('.oxi-tabs-ultimate-header-desktop.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).eq(0).nextAll().length;


                        if (current == 0) {
                            $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent).hide();
                        } else {
                            $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent).show();
                        }

                        $('.oxi-tabs-ultimate-header-desktop.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).nextAll().hide();
                        $('.oxi-tabs-ultimate-header-desktop.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).show();
                        $('.oxi-tabs-ultimate-header-desktop.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).prevAll().show();
                        $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).hide();
                        $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).prevAll().hide();
                        $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent + ' .oxi-tabs-header-li-' + parent + '-' + child).nextAll().show();

                    } else {
                        $('.oxi-tabs-ultimate-header-tab.oxi-tabs-ultimate-header-' + parent).hide();
                    }
                    $(title).removeClass("active");
                    $(header).addClass("active");
                    $(content).removeClass(j.animation).removeClass("active");
                    $(contentbody).addClass(j.animation).addClass("active");
                }
            }
        }

        function OxiTabsEqualHeight(p = '', c = '') {
            var cls = '#oxi-tabs-wrapper-' + p + " .oxi-tabs-ultimate-style", tabs = cls + ' .oxi-tabs-body-tabs', j = $(cls).data('oxi-tabs'), w = $(window).width();
            $(tabs).css({ height: '' });
            if (w > 993 && j.lap === 'yes') {
                var highestBox = 0;
                $(tabs).each(function () {
                    if ($(this).height() > highestBox) {
                        highestBox = $(this).height();

                    }
                });
                $(tabs).height(highestBox);
            } else if (w < 994 && w > 768 && j.tab === 'yes') {
                var highestBox = 0;
                $(tabs).each(function () {
                    if ($(this).height() > highestBox) {
                        highestBox = $(this).height();

                    }
                });
                $(tabs).height(highestBox);
            } else if (w < 769 && j.mob === 'yes') {
                var highestBox = 0;
                $(tabs).each(function () {
                    if ($(this).height() > highestBox) {
                        highestBox = $(this).height();

                    }
                });
                $(tabs).height(highestBox);
            }
        }

        if ($("#oxi-addons-iframe-background-color").length) {
            var value = $('#oxi-addons-iframe-background-color').val();
            $('.shortcode-addons-template-body').css('background', value);
        }






    }
    );
})(jQuery);