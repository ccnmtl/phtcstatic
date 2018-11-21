LogicModel.Column = Backbone.Model.extend({
    initialize: function(attributes) {
        this.set({
            values: new Array(LogicModel.NUMBER_OF_ROWS_TOTAL),
            colors: new Array(LogicModel.NUMBER_OF_ROWS_TOTAL),
            total: 0
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
            maxRows: this.state.get('maxRows'),
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
        this.state.setPhase(1);
        this.state.set('currentRows', this.state.get('initialRows'));
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

