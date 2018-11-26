LogicModel.Scenario = Backbone.Model.extend({
    defaults: {
        'selected': false
    }
});

LogicModel.ScenarioCollection = Backbone.Collection.extend({
    model: LogicModel.Scenario
});

LogicModel.ScenarioView = Backbone.View.extend({
    events: {
        'click .try_this_scenario': 'chooseScenario',
        'click .change_scenario_confirm': 'clearScenario'
    },
    selectedScenario: null,
    initialize: function(options, render) {
        _.bindAll(this, 'render', 'getData',
            'addScenario', 'clearScenario', 'chooseScenario');

        this.state = options.state;

        this.template = LogicModel.getTemplate('#logic-model-scenario');
        this.scenarios = new LogicModel.ScenarioCollection();
        this.scenarios.on('add', this.addScenario);
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
    addScenario: function(scenario) {
        scenario.on('change:selected', this.render);
    },
    chooseScenario: function(evt) {
        const id = jQuery(evt.currentTarget).attr('data-id');
        this.selectedScenario = this.scenarios.get(id);
        this.selectedScenario.set('selected', true);
        this.state.incrementPhase();
    },
    clearScenario: function(evt) {
        let model = this.selectedScenario;
        this.selectedScenario = null;
        model.set('selected', false);
        this.state.setScenarioPhase();
    },
    render: function() {
        const selected = this.selectedScenario ?
            this.selectedScenario.toJSON() : null;

        const ctx = {
            selectedScenario: selected,
            scenarios: this.scenarios.toJSON(),
        };
        this.$el.html(this.template(ctx));
    },
});