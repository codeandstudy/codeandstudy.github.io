(function ($) {
    "use strict";

    $(function () { // start: document ready
        /**
         * 1.0 - Ace Init Main Vars
         */
        ace.html = $('html');
        ace.body = $('body');
        ace.color = ace.html.data('theme-color');

        /**
         * 2.0 - Ace Detect Device Type
         */
        ace_detect_device_type();

        /**
         * 3.0 - Ace Init Header
         */
        ace.header.head = $('#ace-header');
        ace.header.col1 = $('#ace-head-col1');
        ace.header.col2 = $('#ace-head-col2');
        ace.header.col3 = $('#ace-head-col3');

        ace_header_init(ace.header.head, ace.header.col1, ace.header.col2, ace.header.col3);

        /**
         * 5.0 - Ace Sidebar
         */
        ace.sidebar.obj = $('#ace-sidebar');
        ace.sidebar.btn = $('#ace-sidebar-btn');

        // Open Sidebar
        ace.sidebar.btn.on('touchstart click', function () {
            ace_open_sidebar();
        });

        // Close Sidebar Through Overlay
        $(document).on('touchstart click', '.ace-sidebar-opened #ace-overlay', function (e) {
            var container = ace.sidebar.obj;

            if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                ace_close_sidebar();
            }
        });

        // Close Sidebar Using Button
        $('#ace-sidebar-close').on('click', function () {
            ace_close_sidebar();
        });

        // Sidebar Custom Scroll
        $("#ace-sidebar-inner").mCustomScrollbar({
            axis: "y",
            theme: "minimal-dark",
            autoHideScrollbar: true,
            scrollButtons: { enable: true }
        });

        /**
         * 6.0 - Ace Circle & Line Charts
         */
        if (!aceOptions.animations || ace.mobile) {
            // Circle Chart
            ace.progress.charts = $('.progress-chart .progress-bar');
            for (var i = 0; i < ace.progress.charts.length; i++) {
                var chart = $(ace.progress.charts[i]);

                ace_progress_chart(chart[0], chart.data('text'), chart.data('value'), 1);
            }

            // Line Chart
            ace.progress.lines = $('.progress-line .progress-bar');
            for (var i = 0; i < ace.progress.lines.length; i++) {
                var line = $(ace.progress.lines[i]);

                ace_progress_line(line[0], line.data('text'), line.data('value'), 1);
            }
        }

        /**
         * 8.0 - Ace Animate Elements
         */
        if (aceOptions.animations && !ace.mobile) {
            ace_appear_elems($('.ace-animate'), 150);
        }

    }); // end: document ready


    /**
     * Functions
     */

    /* Detect Device Type */
    function ace_detect_device_type() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            ace.mobile = true;
            ace.html.addClass('ace-mobile');
        } else {
            ace.mobile = false;
            ace.html.addClass('ace-desktop');
        }
    }

    /* Init Header */
    function ace_header_init(head, col1, col2, col3) {
        var col1_w = col1.find('#ace-logo').width() + 15;
        var col3_w = col3.find('#ace-sidebar-btn').width() + 15;

        if (head.hasClass('ace-head-boxed') && head.hasClass('ace-logo-out') || head.hasClass('ace-head-full') && col2.hasClass('text-center')) {
            // Header Boxed / Logo Out
            if (col1_w >= col3_w) {
                col1.width(col1_w);
                col3.width(col1_w);
            }
        } else {
            // Header Boxed / Logo In
            col1.width(col1_w);
            col3.width(col3_w);
        }
    }

    /* Ace Close Sidebar */
    function ace_open_sidebar() {
        ace.html.addClass('ace-sidebar-opened');
        ace_append_overlay();
        ace_lock_scroll();
    }

    function ace_close_sidebar() {
        ace.html.removeClass('ace-sidebar-opened');
        ace_remove_overlay();
        ace_unlock_scroll();
    }

    /* Ace Progress Circle */
    function ace_progress_chart(element, text, value, duration) {
        var circle = new ProgressBar.Circle(element, {
            color: ace.color,
            strokeWidth: 5,
            trailWidth: 0,
            text: {
                value: text,
                className: 'progress-text',
                style: {
                    top: '50%',
                    left: '50%',
                    color: '#010101',
                    position: 'absolute',
                    margin: 0,
                    padding: 0,
                    transform: {
                        prefix: true,
                        value: 'translate(-50%, -50%)'
                    }
                },
                autoStyleContainer: true,
                alignToBottom: true
            },
            svgStyle: {
                display: 'block',
                width: '100%'
            },
            duration: duration,
            easing: 'easeOut'
        });

        circle.animate(value); // Number from 0.0 to 1.0
    }

    /* Ace Progress Line */
    function ace_progress_line(element, text, value, duration) {
        var line = new ProgressBar.Line(element, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: duration,
            color: ace.color,
            trailColor: '#eee',
            trailWidth: 4,
            svgStyle: {
                width: '100%',
                height: '100%'
            },
            text: {
                value: text,
                className: 'progress-text',
                style: {
                    top: '-25px',
                    right: '0',
                    color: '#010101',
                    position: 'absolute',
                    margin: 0,
                    padding: 0,
                    transform: {
                        prefix: true,
                        value: 'translate(0, 0)'
                    }
                },
                autoStyleContainer: true
            }
        });

        line.animate(value);  // Number from 0.0 to 1.0
    }

    /* Ace Element In Viewport */
    function ace_is_elem_in_viewport(el, vpart) {
        var rect = el[0].getBoundingClientRect();

        return (
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top + vpart <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function ace_is_elems_in_viewport(elems, vpart) {
        for (var i = 0; i <elems.length; i++) {
            var item = $(elems[i]);

            if (item.hasClass('ace-animate') && ace_is_elem_in_viewport(item, vpart)) {
                item.removeClass('ace-animate').addClass('ace-animated');

                // Animate Circle Chart
                if(item.hasClass('progress-chart')) {
                    var chart = item.find('.progress-bar');
                    ace_progress_chart(chart[0], chart.data('text'), chart.data('value'), 1000);
                }

                // Animate Line Chart
                if(item.hasClass('progress-line')) {
                    var line = item.find('.progress-bar');
                    ace_progress_line(line[0], line.data('text'), line.data('value'), 1000);
                }
            }
        }
    }

    function ace_appear_elems(elems, vpart) {
        ace_is_elems_in_viewport(elems, vpart);

        $(window).scroll(function () {
            ace_is_elems_in_viewport(elems, vpart);
        });

        $(window).resize(function () {
            ace_is_elems_in_viewport(elems, vpart);
        });
    }

})(jQuery);

