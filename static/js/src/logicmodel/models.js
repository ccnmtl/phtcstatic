LogicModel.NUMBER_OF_ROWS_TOTAL = 9;
LogicModel.NUMBER_OF_ROWS_INITIAL = 4;

LogicModel.Scenario = Backbone.Model.extend({
});

LogicModel.ScenarioCollection = Backbone.Collection.extend({
    model: LogicModel.Scenario
});

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
    },
    clear: function() {
        this.set('values', new Array(LogicModel.NUMBER_OF_ROWS_TOTAL));
        this.set('colors', new Array(LogicModel.NUMBER_OF_ROWS_TOTAL));
    }
});

LogicModel.ColumnCollection = Backbone.Collection.extend({
    model: LogicModel.Column,
    toSession: function() {
        var results = [];
        this.forEach(function(column) {
            results.push({
                'values': column.get('values'),
                'colors': column.get('colors')
            });
        });
        return results;
    },
    fromSession: function(json) {
        for (var i = 0; i < json.length; i++) {
            let column = this.at(i);
            column.set('values', json[i].values);
            column.set('colors', json[i].colors);
        }
    },
    clear: function() {
        this.forEach(function(column) {
            column.clear();
        });
    }
});

LogicModel.ActivityState = Backbone.Model.extend({
    defaults: {
        colors: null,
        columns: null,
        phases: null,
        phaseIdx: 0,
        scenarios: null,
        scenarioInfo: true,
        stepInfo: true,
        scenarioIdx: null,
        currentRows: LogicModel.NUMBER_OF_ROWS_INITIAL,
    },
    setScenario: function(scenarioIdx) {
        this.set({
            'scenarioIdx': scenarioIdx,
            'phaseIdx': this.get('phaseIdx') + 1
        });
    },
    clearScenario: function() {
        this.set({
            'scenarioIdx': null,
            'phaseIdx': 0,
            'currentRows': LogicModel.NUMBER_OF_ROWS_INITIAL
        });
        this.get('columns').clear();
    },
    getCurrentPhase: function() {
        const idx = this.get('phaseIdx');
        return this.get('phases').at(idx);
    },
    clearTable: function() {
        this.set({
            'phaseIdx': 1,
            'currentRows': LogicModel.NUMBER_OF_ROWS_INITIAL
        });

        this.get('columns').clear();
    },
    flavor: function() {
        const flavors = this.getCurrentPhase().get('flavors');
        return flavors[flavors.length - 1];
    },
    incrementPhase: function() {
        this.set('phaseIdx', this.get('phaseIdx') + 1);
    },
    decrementPhase: function() {
        this.set('phaseIdx', this.get('phaseIdx') - 1);
    },
    complete: function() {
        return this.get('phaseIdx') === (this.get('phases').length - 1);
    },
    fromSession: function(str) {
        const json = JSON.parse(str);
        this.set({
            phaseIdx: json.phaseIdx,
            scenarioInfo: json.scenarioInfo,
            stepInfo: json.stepInfo,
            currentRows: json.currentRows,
            scenarioIdx: json.scenarioIdx
        });
        this.get('columns').fromSession(json.columns);
    },
    toSession: function() {
        return JSON.stringify({
            phaseIdx: this.get('phaseIdx'),
            columns: this.get('columns').toSession(),
            scenarioInfo: this.get('scenarioInfo'),
            stepInfo: this.get('stepInfo'),
            currentRows: this.get('currentRows'),
            scenarioIdx: this.get('scenarioIdx')
        });
    },
    toJSON: function() {
        const columns = this.get('columns');

        return {
            colors: this.get('colors'),
            flavor: this.flavor(),
            phases: this.get('phases').toJSON(),
            phase: this.getCurrentPhase().toJSON(),
            scenarios: this.get('scenarios').toJSON(),
            scenarioIdx: this.get('scenarioIdx'),
            columns: columns.toJSON(),
            scenarioInfo: this.get('scenarioInfo'),
            stepInfo: this.get('stepInfo'),
            currentRows: this.get('currentRows'),
            maxRows: LogicModel.NUMBER_OF_ROWS_TOTAL,
            content: {
                first: columns.at(0).hasValue(),
                middle: columns.at(1).hasValue() &&
                        columns.at(2).hasValue() &&
                        columns.at(3).hasValue() &&
                        columns.at(4).hasValue(),
                last: columns.at(5).hasValue()
            }
        };
    }
});