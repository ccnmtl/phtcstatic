function ignore(evt) {
    evt.stopPropagation();
    evt.preventDefault();
}

function choose(evt) {
    const $elt = $(evt.currentTarget);
    $elt.removeClass('btn-primary').addClass('btn-warning');

    const $card = $elt.parents('.card');
    $card.siblings().hide();

    $($elt.data('next')).fadeIn();
}

function clearStep(step) {
    $(step).find('.collapse.show').removeClass('show');
    $(step).find('.btn-warning')
        .removeClass('btn-warning').addClass('btn-primary');
    $(step).find('.card').fadeIn();
}

function chooseAgain(evt) {
    const $btn = $(evt.currentTarget);

    const thisStep = $btn.parents('.step').first();
    clearStep(thisStep);

    $(thisStep).nextAll('.step').each((idx, elt) => {
        clearStep(elt);
        $(elt).fadeOut('fast');
    });
}

function startOver(evt) {
    const $container = $('.flowchart-container');
    $container.find('.step').each((idx, elt) => {
        clearStep(elt);
        if (idx > 0) {
            $(elt).fadeOut('fast');
        }
    });

    $('html, body').animate({
        scrollTop: $('.flowchart-container').offset().top - 20
    }, 'slow');
}

jQuery(document).ready(function() {
    $('.choose-again').click(chooseAgain);
    $('.start-over').click(startOver);
    $('.btn-primary.btn-choose').click(choose);
    $('.btn-warning.btn-choose').click(ignore);
});

