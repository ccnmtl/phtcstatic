LogicModel.Scenario = Backbone.Model.extend({
});

LogicModel.ScenarioCollection = Backbone.Collection.extend({
    model: LogicModel.Scenario
});

LogicModel.ScenarioView = Backbone.View.extend({
    events: {
        'click .try_this_scenario': 'chooseScenario',
        'click .change_scenario_confirm': 'clearScenario',
        'hidden.bs.collapse #scenarioInstructions': 'scenarioInfoHide',
        'shown.bs.collapse #scenarioInstructions': 'scenarioInfoShow'
    },
    initialize: function(options, render) {
        _.bindAll(this, 'render', 'getData',
            'clearScenario', 'chooseScenario',
            'scenarioInfoHide', 'scenarioInfoShow');

        this.state = options.state;
        this.state.on('change:selectedScenario', this.render);

        this.template = LogicModel.getTemplate('#logic-model-scenario');
        this.scenarios = new LogicModel.ScenarioCollection();
        this.getData();
    },
    getData: function() {
        var self = this;
        jQuery.getJSON(LogicModel.baseUrl + 'json/scenarios.json',
            function(json, textStatus, xhr) {
                self.scenarios.add(json.scenarios);
                self.render();
            }
        );
    },
    chooseScenario: function(evt) {
        const id = jQuery(evt.currentTarget).attr('data-id');
        this.state.setScenario(this.scenarios.get(id));
    },
    clearScenario: function(evt) {
        this.state.clearScenario();
    },
    render: function() {
        const scenario = this.state.get('selectedScenario');
        const selected = scenario ? scenario.toJSON() : null;

        const ctx = {
            scenarioInfo: this.state.get('scenarioInfo'),
            selectedScenario: selected,
            scenarios: this.scenarios.toJSON(),
        };
        this.$el.html(this.template(ctx));
    },
    scenarioInfoHide: function(evt) {
        this.state.set('scenarioInfo', false);
    },
    scenarioInfoShow: function(evt) {
        this.state.set('scenarioInfo', true);
    }
});