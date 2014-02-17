(function($) {
    $.fn.hasVerticalScrollbar = function() {
        // This will return true, when the div has vertical scrollbar
        return this.get(0).scrollHeight > this.height();
    }
    $.fn.hasHorizontalScrollbar = function() {
        // This will return true, when the div has horizontal scrollbar
        return this.get(0).scrollWidth > this.width();
    }
})(jQuery);