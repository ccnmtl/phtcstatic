/* global STATIC_URL: true */

LogicModel.Scenario = Backbone.Model.extend({

});

LogicModel.ScenarioCollection = Backbone.Collection.extend({
    model: LogicModel.Scenario
});

LogicModel.ScenarioView = Backbone.View.extend({
    className: 'backbone_scenario_div',
    events: {
        'click .try_this_scenario': 'chooseMe'
    },
    initialize: function(options, render) {
        this.template = LogicModel.getTemplate('#logic-model-scenario');

        // eslint-disable-next-line no-unsafe-innerhtml/no-unsafe-innerhtml
        this.el.innerHTML = this.template(this.model.toJSON());
    },
    chooseMe: function() {
        jQuery('.scenario_instructions').html(this.model.get('instructions'));
        jQuery('.scenario_title_2').html(this.model.get('title'));
        var href = LogicModel.baseUrl + 'pdf/' + this.model.get('answer_key');
        jQuery('.show_expert_logic_model_link').attr('href', href);
        jQuery('.scenario-step-stage .accordion-body').css('height','auto');

        this.LogicModelView.goToNextPhase();
    }
});