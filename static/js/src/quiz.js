/* global alert: true */

function isFormComplete($form) {
    var valid = true;

    var children = $form.find('input,textarea,select');
    jQuery.each(children, function() {
        if (valid && jQuery(this).is(':visible')) {
            if (this.tagName === 'INPUT' && this.type === 'text' ||
                    this.tagName === 'TEXTAREA') {
                valid = jQuery(this).val().trim().length > 0;
            }

            if (this.tagName === 'SELECT') {
                var value = jQuery(this).val();
                valid = value !== undefined && value.length > 0 &&
                    jQuery(this).val().trim() !== '-----';
            }

            if (this.type === 'checkbox' || this.type === 'radio') {
                // one in the group needs to be checked
                var selector =
                    'input[name=' + jQuery(this).attr('name') + ']';
                valid = jQuery(selector).is(':checked');
            }
        }
    });

    if (!valid) {
        alert('Please answer all questions before continuing.');
    }

    return valid;
}


jQuery(document).ready(function() {
    jQuery('a.moretoggle').click(function(evt) {
        evt.preventDefault();
        var $elt = jQuery(evt.currentTarget);
        var $answer = $elt.nextAll('.toggleable');
        if ($answer.is(':visible')) {
            $elt.html('Show answer <i class="fas fa-angle-double-right"></i>');
            $answer.hide();
        } else {
            $elt.html('Hide answer <i class="fas fa-angle-double-right"></i>');
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
        jQuery(evt.currentTarget).hide();
        return false;
    });

    jQuery('.atlasti .btn-submit-coding-exercise').click(function(evt) {
        evt.preventDefault();

        var $form = jQuery(evt.currentTarget).parents('form');
        if (!isFormComplete($form)) {
            return false;
        }

        jQuery($form).find('input:checked').each(function(evt) {
            var value = jQuery(this).val();
            jQuery(this).parent().siblings('td.your-answer').html(value);
        });
        jQuery($form).find('td.td-ui').hide();
        jQuery($form).find('td.your-answer,td.our-answer').show();
        jQuery(evt.currentTarget).parent().next().show();
        jQuery(evt.currentTarget).hide();
        return false;
    });

});