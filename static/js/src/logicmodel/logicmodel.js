/* exported LogicModel */
LogicModel.getTemplate = function(selector) {
    var html = jQuery(selector).html();
    html = html.replace(/&lt;/g, '<');
    return _.template(html);
};

LogicModel.Phase = Backbone.Model.extend({
});

LogicModel.PhaseCollection = Backbone.Collection.extend({
    model: LogicModel.Phase
});

LogicModel.ActivityState = Backbone.Model.extend({
    defaults: {
        phaseIdx: 0,
        phases: new LogicModel.PhaseCollection()
    },
    getCurrentPhase: function() {
        const idx = this.get('phaseIdx');
        return this.get('phases').at(idx);
    },
    setPhase: function(idx) {
        this.set('phaseIdx', idx);
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
        return this.get('phaseIdx') < this.get('phases').count();
    }
});

const LogicModelView = Backbone.View.extend({
    events: {
        'click .print_scenario': 'printScenarioTable',
        //'click .add_a_row_button': 'addARow',
        'click .wipe-table-confirm-button': 'wipeTable',
    },
    initialize: function(options) {
        _.bindAll(this ,
            'render' ,
            // 'onAddColumn',
            //'onAddScenario',
            'getData',
            //'addARow',
            //'adjustRows',
            //'checkEmptyBoxes',
            //'wipeTableValues',
            //'wipeTable',
            'beforeLeavePage'
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

        jQuery('li.next a').on('click', this.beforeLeavePage);
        jQuery('li.previous a').on('click', this.beforeLeavePage);
    },
    getData: function() {
        var self = this;
        jQuery.ajax({
            type: 'GET',
            url: LogicModel.baseUrl + 'json/logicmodel.json',
            dataType: 'json',
            success: function(json, textStatus, xhr) {
                //self.columns.add(json.columns);
                //self.setUpColors(json.colors);
                self.state.get('phases').add(json.game_phases);
                //self.columns_in_each_phase = json.columns_in_each_phase;
                //self.setUpPhases();
                //self.adjustRows();
            }
        });
    },
    render: function() {
        const ctx = {
            'phase': this.state.getCurrentPhase().toJSON()
        };
        let html = this.progressTemplate(ctx);
        this.$el.find('.activity-progress').html(html);
    },
    beforeLeavePage: function(event) {
        if (!this.state.complete()) {
            if(!confirm('You have not completed the activity. ' +
                'Are you sure you want to leave?')) {
                return false;
            }
        }
        return true;
    }

/**
    wipeTableValues: function() {
        this.$el.find('.text_box').value('');
        this.columns.each(function(a) {
            var box_models = a.get('boxModels');
            for (var i=0; i < box_models.length; i++)  {
                box_models[i].set({'contents': ''});
                box_models[i].set({'color_int': 0});
                box_models[i].trigger('setColor');
            }
        });
    },

    wipeTable: function() {
        var self = this;
        self.wipeTableValues();

        self.current_phase = 1;
        self.current_number_of_rows = this.initialRows;
        self.adjustRows();
        self.paintPhase();
    },

    checkEmptyBoxes: function() {
        var self = this;
        self.ok_to_proceed = false;0;
        var number_of_empty_active_columns = 0;
        self.columns.each(function(a) {
            var column_is_active = a.get('active');
            var box_models = a.get('boxModels');
            if (column_is_active) {
                var column_is_empty = true;
                for (var i=0; i < box_models.length; i++)  {
                    if (box_models[i].get('contents').length > 0) {
                        column_is_empty = false;
                    }
                }
                if (column_is_empty) {
                    number_of_empty_active_columns =
                        number_of_empty_active_columns + 1;
                    return;
                }
            }
        });

        jQuery('.done-button').hide();
        if (number_of_empty_active_columns  === 0) {
            if (self.current_phase != self.phases.length - 1) {
                jQuery('.active_column').last()
                    .find('.done-button').show();
                jQuery('.active_column').last()
                    .find('.done-button').addClass('active');
                self.ok_to_proceed = true;
            }
        }
        else {
            jQuery('.active_column').last()
                .find('.done-button').show();
            jQuery('.active_column').last()
                .find('.done-button').removeClass('active');
            self.ok_to_proceed = false;
        }
    },
    setUpColors: function(colors) {
        var self = this;
        self.colors = { colors: colors };
        self.columns.each(function(a) {
            var box_models = a.get('boxModels');
            for (var i=0;i<box_models.length;i++)  {
                box_models[i].set({colors: colors, color_int: -1});
                box_models[i].trigger('nextColor');
            }
        });
    },

    addARow: function() {
        var self = this;
        self.current_number_of_rows = self.current_number_of_rows + 1;
        self.adjustRows();
        if (self.current_number_of_rows === LogicModel.NUMBER_OF_ROWS_TOTAL) {
            jQuery('.add_a_row_button').hide();
        }
    },

    adjustRows: function() {
        var self = this;
        self.columns.each(function(c) {
            var box_models = c.get('boxModels');
            for (var i=0;i<box_models.length;i++)  {
                if (box_models[i].get('row') <= self.current_number_of_rows) {
                    box_models[i].trigger('showBox');
                }
                else {
                    box_models[i].trigger('hideBox');
                }
            }
        });
    },
    paintPhase: function() {
        var self = this;
        var phase_info = self.currentPhaseInfo();
        var active_columns_for_this_phase =
            self.columns_in_each_phase[phase_info.id];
        self.columns.each(function(col) {
            if (active_columns_for_this_phase !== undefined) {
                var whether_active = (
                    active_columns_for_this_phase.indexOf(col.id) != -1);
                col.set({active: whether_active});
            }
            // default is true, btw.
        });
        self.columns.each(function(a) {a.trigger('turnOnActiveBoxes');});
        // set the #phase_container span so that
        // the CSS can properly paint this phase of the game.
        jQuery('#phase_container').attr('class', phase_info.css_classes);
        jQuery('.logic-model-game-phase-name').html(phase_info.name);
        // Need to break this to be compliant
        jQuery('.logic-model-game-phase-instructions').html(
            phase_info.instructions
        );
        jQuery('#stepHeaderTitle').toggleClass('switch-it switch-it2');

        if (self.current_phase === 0) {
            jQuery('.previous_phase').hide();
            jQuery('li.previous').show();
            jQuery('li.next').show();
            jQuery('.scenario-list-stage').show();
            jQuery('.scenario-step-stage').hide();
            self.ok_to_proceed = true;
        } else {
            jQuery('li.previous').show();
            jQuery('li.next').show();
            jQuery('.previous_phase').show();
            jQuery('.scenario-list-stage').hide();
            jQuery('.scenario-step-stage').show();
        }

        jQuery('.activity-progress .step').removeClass('current');

        var currentstep = '.step' + self.current_phase;
        jQuery(currentstep).addClass('current');

        // unhide the last active donebutton on the page:
        jQuery('.done-button').removeClass('visible');

        // unhide the last active donebutton on the page:
        jQuery('.add_a_row_button').removeClass('visible');
        jQuery('.active_column').first()
            .find('.add_a_row_button').addClass('visible');

        if (self.current_phase !== 0) {
            self.checkEmptyBoxes();
        }

        if (self.current_phase == self.phases.length - 1) {
            jQuery('.show_expert_logic_model_link_div')
                .show()
                .addClass('highlight-answerkey');
        } else {
            jQuery('.show_expert_logic_model_link_div')
                .hide()
                .removeClass('highlight-answerkey');
        }
    },
    onAddColumn: function(column) {
        var self = this;
        var view = new LogicModel.ColumnView({
            model: column
        });
        view.parentView = self;

        view.boxes.bind('checkEmptyBoxes', self.checkEmptyBoxes);
        jQuery('div.logic-model-columns').append(view.el);
    },
**/
});

jQuery(document).ready(function() {
    new LogicModelView({
        el: 'div.logic-model-container'
    });
});