/* exported LogicModel */
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
        _.bindAll(this, 'addColumn', 'addRow', 'getData', 'help', 'clear',
            'render', 'renderTools', 'update', 'next', 'prev', 'flavor',
            'color');

        this.state = options.state;
        this.state.bind('change', this.render);

        this.template = LogicModel.getTemplate('#logic-model-table');
        this.helpTemplate = LogicModel.getTemplate('#logic-model-help-box');
        this.toolsTemplate = LogicModel.getTemplate('#logic-model-tools');

        this.columns = new LogicModel.ColumnCollection();
        this.columns.on('add', this.addColumn);
        this.getData();
    },
    addColumn: function(column) {
        column.on('change:values', this.renderTools);
        column.on('change:colors', this.render);
    },
    addRow: function(evt) {
        const rows = this.state.get('currentRows');
        this.state.set('currentRows', rows + 1);
    },
    flavor: function() {
        const flavors = this.state.getCurrentPhase().get('flavors');
        const flavor = flavors[flavors.length - 1];
        return flavor;
    },
    getData: function() {
        var self = this;
        $.getJSON(LogicModel.baseUrl + 'json/columns.json',
            function(json, textStatus, xhr) {
                self.colors = json.colors;
                self.initialColumns = json.columns;
                self.columns.add(json.columns);
            }
        );
    },
    render: function() {
        if (this.state.isScenarioPhase()) {
            this.columns.reset();
            this.columns.add(this.initialColumns);
        }

        const ctx = {
            phase: this.state.getCurrentPhase().toJSON(),
            rows: this.state.get('currentRows'),
            flavor: this.flavor(),
            columns: this.columns.toJSON(),
            colors: this.colors
        };

        const html = this.template(ctx);
        this.$el.html(html);
        this.renderTools();
    },
    renderTools: function() {
        const ctx = {
            phase: this.state.getCurrentPhase().toJSON(),
            flavor: this.flavor(),
            rows: this.state.get('currentRows'),
            maxRows: LogicModel.NUMBER_OF_ROWS_TOTAL,
            content: {
                first: this.columns.at(0).hasValue(),
                middle: this.columns.at(1).hasValue() &&
                        this.columns.at(2).hasValue() &&
                        this.columns.at(3).hasValue() &&
                        this.columns.at(4).hasValue(),
                last: this.columns.at(5).hasValue()
            }
        };

        const html = this.toolsTemplate(ctx);
        this.$el.find('.tools').html(html);
    },
    help: function(evt) {
        const columnIdx = $(evt.currentTarget).attr('data-column');
        const column = this.columns.at(columnIdx);

        const html = this.helpTemplate(column.toJSON());
        $('.help_box').html(html);
        $('.help_box .modal').modal();
    },
    update: function(evt) {
        const columnIdx = $(evt.currentTarget).attr('data-column');
        const rowIdx =  $(evt.currentTarget).attr('data-row');
        const column = this.columns.at(columnIdx);
        column.setValue(parseInt(rowIdx, 10), $(evt.currentTarget).val());
    },
    clear: function(evt) {
        this.columns.reset();
        this.columns.add(this.initialColumns);
        this.state.setTablePhase();
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
        const column = this.columns.at(columnIdx);
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