/* exported LogicModel */
LogicModel.getTemplate = function(selector) {
    var html = jQuery(selector).html();
    html = html.replace(/&lt;/g, '<');
    return _.template(html);
};

LogicModel.NUMBER_OF_ROWS_TOTAL = 9;
LogicModel.NUMBER_OF_ROWS_INITIAL = 4;

LogicModel.Phase = Backbone.Model.extend({
});

LogicModel.PhaseCollection = Backbone.Collection.extend({
    model: LogicModel.Phase
});

LogicModel.ActivityState = Backbone.Model.extend({
    defaults: {
        phaseIdx: 0,
        phases: new LogicModel.PhaseCollection(),
        currentRows: LogicModel.NUMBER_OF_ROWS_INITIAL,
        scenarioInfo: true,
        stepInfo: true,
        selectedScenario: null
    },
    setScenario: function(scenario) {
        this.set({
            'selectedScenario': scenario,
            'phaseIdx': this.get('phaseIdx') + 1
        });
    },
    clearScenario: function(scenario) {
        this.set({
            'selectedScenario': null,
            'phaseIdx': 0,
            'currentRows': LogicModel.NUMBER_OF_ROWS_INITIAL
        });
    },
    getCurrentPhase: function() {
        const idx = this.get('phaseIdx');
        return this.get('phases').at(idx);
    },
    isScenarioPhase: function() {
        return this.get('phaseIdx') === 0;
    },
    setScenarioPhase: function() {
        this.set('phaseIdx', 0);
        this.set('currentRows', LogicModel.NUMBER_OF_ROWS_INITIAL);
    },
    setTablePhase: function() {
        this.set('phaseIdx', 1);
        this.set('currentRows', LogicModel.NUMBER_OF_ROWS_INITIAL);
    },
    incrementPhase: function() {
        let idx = this.get('phaseIdx') + 1;
        this.set('phaseIdx', idx);
    },
    decrementPhase: function() {
        let idx = this.get('phaseIdx') - 1;
        this.set('phaseIdx', idx);
    },
    complete: function() {
        return this.get('phaseIdx') === (this.get('phases').length - 1);
    }
});

const LogicModelView = Backbone.View.extend({
    events: {
        'hidden.bs.collapse #stepInstructions': 'stepInfoHide',
        'shown.bs.collapse #stepInstructions': 'stepInfoShow'
    },
    initialize: function(options) {
        _.bindAll(this,
            'render', 'getData', 'beforeUnload',
            'stepInfoHide', 'stepInfoShow'
        );

        this.state = new LogicModel.ActivityState();
        this.state.bind('change', this.render);
        this.progressTemplate = LogicModel.getTemplate('#activity-progress');

        this.scenarioView = new LogicModel.ScenarioView({
            el: this.$el.find('.scenario-container'),
            state: this.state
        });

        this.tableView = new LogicModel.TableView({
            el: this.$el.find('.table-container'),
            state: this.state
        });
        this.getData();

        // eslint-disable-next-line
        window.addEventListener('beforeunload', this.beforeUnload);
    },
    getData: function() {
        var self = this;
        jQuery.ajax({
            type: 'GET',
            url: LogicModel.baseUrl + 'json/phases.json',
            dataType: 'json',
            success: function(json, textStatus, xhr) {
                self.state.get('phases').add(json.game_phases);
            }
        });
    },
    render: function() {
        const ctx = {
            'phase': this.state.getCurrentPhase().toJSON(),
            'stepInfo': this.state.get('stepInfo')
        };
        let html = this.progressTemplate(ctx);
        this.$el.find('.activity-progress').html(html);
    },
    beforeUnload: function(evt) {
        if (!this.state.complete()) {
            // Cancel the event as stated by the standard.
            evt.preventDefault();
            // Chrome requires returnValue to be set. No guarantee this
            // message will be displayed in any browser.
            evt.returnValue =
                'You have not completed the activity. ' +
                'Are you sure you want to leave?';
        }
    },
    stepInfoHide: function(evt) {
        this.state.set('stepInfo', false);
    },
    stepInfoShow: function(evt) {
        this.state.set('stepInfo', true);
    }
});

jQuery(document).ready(function() {
    new LogicModelView({
        el: 'div.logic-model-container'
    });
});