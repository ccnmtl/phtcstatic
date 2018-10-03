/* global alert: true */
jQuery(document).ready(function() {
    jQuery('a.moretoggle').click(function(evt) {
        evt.preventDefault();
        var $elt = jQuery(evt.currentTarget);
        var $answer = $elt.nextAll('.toggleable');
        if ($answer.is(':visible')) {
            $elt.html('Show answer &#62;&#62;');
            $answer.hide();
        } else {
            $elt.html('Hide answer &#62;&#62;');
            $answer.show();
        }
        return false;
    });

    jQuery('.atlasti .btn-submit-section').click(function(evt) {
        evt.preventDefault();
        var $parent = jQuery(evt.currentTarget).parent();

        if ($parent.prev().find('input').val().trim().length < 1) {
            alert('Please complete your answer before continuing.');
        } else {
            $parent.next().show();
        }
        return false;
    });
});