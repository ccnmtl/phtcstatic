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
});