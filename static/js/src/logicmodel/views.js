/* exported LogicModel */
/* global readSession, writeSession */

LogicModel.getTemplate = function(selector) {
    var html = jQuery(selector).html();
    html = html.replace(/&lt;/g, '<');
    return _.template(html);
};

LogicModel.ScenarioView = Backbone.View.extend({
    events: {
        'click .try_this_scenario': 'chooseScenario',
        'click .change_scenario_confirm': 'clearScenario',
        'hidden.bs.collapse #scenarioInstructions': 'scenarioInfoHide',
        'shown.bs.collapse #scenarioInstructions': 'scenarioInfoShow'
    },
    initialize: function(options, render) {
        _.bindAll(this, 'render',
            'clearScenario', 'chooseScenario',
            'scenarioInfoHide', 'scenarioInfoShow');

        this.state = options.state;
        this.state.on('change:scenarioIdx', this.render);
        this.state.on('change:scenarios', this.render);

        this.template = LogicModel.getTemplate('#logic-model-scenario');
    },
    chooseScenario: function(evt) {
        const idx = jQuery(evt.currentTarget).attr('data-idx');
        this.state.setScenario(idx);
    },
    clearScenario: function(evt) {
        this.state.clearScenario();
    },
    render: function() {
        const ctx = this.state.toJSON();
        this.$el.html(this.template(ctx));
    },
    scenarioInfoHide: function(evt) {
        this.state.set('scenarioInfo', false);
    },
    scenarioInfoShow: function(evt) {
        this.state.set('scenarioInfo', true);
    }
});


LogicModel.TableView = Backbone.View.extend({
    events: {
        'click .column-header img': 'help',
        'keyup .column-entry textarea': 'update',
        'click .clear-table-confirm': 'clear',
        'click .print_scenario': 'print',
        'click .next-phase': 'next',
        'click .previous-phase': 'prev',
        'click .btn-add-row': 'addRow',
        'click .switch_color': 'color'
    },
    initialize: function(options, render) {
        _.bindAll(this, 'changeColumns', 'addRow', 'help', 'clear', 'color',
            'render', 'renderTools', 'update', 'next', 'prev');

        this.state = options.state;
        this.state.on('change:phaseIdx', this.render);
        this.state.on('change:currentRows', this.render);
        this.state.on('change:selectedIdx', this.render);
        this.state.on('change:columns', this.changeColumns);

        this.template = LogicModel.getTemplate('#logic-model-table');
        this.helpTemplate = LogicModel.getTemplate('#logic-model-help-box');
        this.toolsTemplate = LogicModel.getTemplate('#logic-model-tools');
    },
    changeColumns: function() {
        const self = this;
        this.state.get('columns').forEach(function(column) {
            column.on('change:values', self.renderTools);
            column.on('change:colors', self.render);
        });
        this.render();
    },
    addRow: function(evt) {
        const rows = this.state.get('currentRows');
        this.state.set('currentRows', rows + 1);
    },
    render: function() {
        const html = this.template(this.state.toJSON());
        this.$el.html(html);
        this.renderTools();
    },
    renderTools: function() {
        const html = this.toolsTemplate(this.state.toJSON());
        this.$el.find('.tools').html(html);
    },
    help: function(evt) {
        const columnIdx = $(evt.currentTarget).attr('data-column');
        const column = this.state.get('columns').at(columnIdx);

        const html = this.helpTemplate(column.toJSON());
        $('.help_box').html(html);
        $('.help_box .modal').modal();
    },
    update: function(evt) {
        const columnIdx = $(evt.currentTarget).attr('data-column');
        const rowIdx =  $(evt.currentTarget).attr('data-row');
        const column = this.state.get('columns').at(columnIdx);
        column.setValue(parseInt(rowIdx, 10), $(evt.currentTarget).val());
    },
    clear: function(evt) {
        this.state.clearTable();
        this.render();
    },
    print: function(evt) {
        window.print();
    },
    next: function(evt) {
        this.state.incrementPhase();
    },
    prev: function(evt) {
        this.state.decrementPhase();
    },
    color: function(evt) {
        const columnIdx = $(evt.currentTarget).attr('data-column');
        const rowIdx =  $(evt.currentTarget).attr('data-row');
        const column = this.state.get('columns').at(columnIdx);
        column.incrementColor(parseInt(rowIdx, 10));
    }
});

const LogicModelView = Backbone.View.extend({
    events: {
        'hidden.bs.collapse #stepInstructions': 'stepInfoHide',
        'shown.bs.collapse #stepInstructions': 'stepInfoShow'
    },
    initialize: function(options) {
        _.bindAll(this,
            'render', 'changeColumns', 'getData',
            'stepInfoHide', 'stepInfoShow', 'writeSession'
        );

        this.sessionData = readSession('buildinglogicmodels');

        this.state = new LogicModel.ActivityState();
        this.state.on('change', this.render);
        this.state.on('change:columns', this.changeColumns);
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
    },
    changeColumns: function() {
        const self = this;
        this.state.get('columns').forEach(function(column) {
            column.on('change:values', self.writeSession);
            column.on('change:colors', self.writeSession);
        });
    },
    getData: function() {
        var self = this;
        jQuery.ajax({
            type: 'GET',
            url: LogicModel.baseUrl + 'json/logicmodel.json',
            dataType: 'json',
            success: function(json, textStatus, xhr) {
                self.state.set({
                    'colors': json.colors,
                    'phases':
                        new LogicModel.PhaseCollection(json.game_phases),
                    'scenarios':
                        new LogicModel.ScenarioCollection(json.scenarios),
                    'columns': new LogicModel.ColumnCollection(json.columns)
                });

                if (self.sessionData) {
                    self.state.fromSession(self.sessionData);
                }
            }
        });
    },
    render: function() {
        this.writeSession();
        const ctx = {
            'phase': this.state.getCurrentPhase().toJSON(),
            'stepInfo': this.state.get('stepInfo')
        };
        let html = this.progressTemplate(ctx);
        this.$el.find('.activity-progress').html(html);
    },
    stepInfoHide: function(evt) {
        this.state.set('stepInfo', false);
    },
    stepInfoShow: function(evt) {
        this.state.set('stepInfo', true);
    },
    writeSession: function() {
        writeSession('buildinglogicmodels', this.state.toSession());
    }
});

jQuery(document).ready(function() {
    new LogicModelView({
        el: 'div.logic-model-container'
    });
});