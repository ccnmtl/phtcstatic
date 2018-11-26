LogicModel.Scenario = Backbone.Model.extend({
});

LogicModel.ScenarioCollection = Backbone.Collection.extend({
    model: LogicModel.Scenario
});


LogicModel.NUMBER_OF_ROWS_TOTAL = 9;
LogicModel.NUMBER_OF_ROWS_INITIAL = 4;

LogicModel.Phase = Backbone.Model.extend({
});

LogicModel.PhaseCollection = Backbone.Collection.extend({
    model: LogicModel.Phase
});

LogicModel.Column = Backbone.Model.extend({
    initialize: function(attributes) {
        this.set({
            values: new Array(LogicModel.NUMBER_OF_ROWS_TOTAL),
            colors: new Array(LogicModel.NUMBER_OF_ROWS_TOTAL)
        });
    },
    incrementColor: function(rowIdx) {
        let colorIdx = this.get('colors')[rowIdx] || 0;
        this.get('colors')[rowIdx] = (colorIdx + 1) % 6;
        this.trigger('change:colors');
    },
    setValue(rowIdx, value) {
        this.get('values')[rowIdx] = value;
        this.trigger('change:values');
    },
    getValue(rowIdx) {
        return this.get('values')[rowIdx];
    },
    hasValue() {
        const values = this.get('values');
        for (var i = 0; i < values.length; i++) {
            if (values[i] && values[i].length > 0) {
                return true;
            }
        }
        return false;
    }
});

LogicModel.ColumnCollection = Backbone.Collection.extend({
    model: LogicModel.Column,
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