LogicModel.Box = Backbone.Model.extend({
    defaults: {
        'contents': '',
        'active': true
    },
    aboutMe: function() {
    }
});

LogicModel.BoxCollection = Backbone.Collection.extend({
    model: LogicModel.Box
});

LogicModel.BoxView = Backbone.View.extend({
    className: 'backbone_box_div',
    events: {
        'change .text_box': 'onBoxEdited',
        'blur .text_box': 'onBoxEdited',
        'keyup .text_box': 'onBoxEdited',
        'click .switch_color': 'nextColor'
    },
    initialize: function(options, render) {
        var self = this;
        _.bindAll(self,
            'render',
            'hasText',
            'makeActive',
            'makeInactive',
            'setColor',
            'nextColor',
            'showBox',
            'hideBox',
            'onBoxEdited'
        );

        self.model.bind('destroy', self.unrender);
        self.model.bind('makeActive', self.makeActive);
        self.model.bind('makeInactive', self.makeInactive);
        self.model.bind('nextColor', self.nextColor);
        self.model.bind('setColor', self.setColor);
        self.model.bind('showBox', self.showBox);
        self.model.bind('hideBox', self.hideBox);
        self.model.bind('render', self.render);
        self.model.bind('onBoxEdited', self.onBoxEdited);

        self.template = LogicModel.getTemplate('#logic-model-box');
        var ctx = self.model.toJSON();
        // eslint-disable-next-line no-unsafe-innerhtml/no-unsafe-innerhtml
        self.el.innerHTML = self.template(ctx);
        self.render();

        self.$el.data('view', this);
    },
    findBox: function(el) {
        return jQuery(el).closest('.backbone_box_div').data('view');
    },
    showBox: function() {
        var self = this;
        var jel = self.$el;
        jel.removeClass('hidden_box');
    },
    hideBox: function() {
        var self = this;
        var jel = self.$el;
        jel.addClass('hidden_box');
    },
    hasText: function() {
        var self = this;
        if (jQuery(self.el).find('.text_box').val().length > 0) {
            return true;
        }
        return false;
    },
    setColor: function() {
        var self = this;
        var the_colors = self.model.get('colors');
        var color_int = self.model.get('color_int');
        var color = '#' + the_colors[color_int % the_colors.length];
        jQuery(self.el).find('.cell').css('background-color', color);

        jQuery(self.el).find('.text_box').css('color', color);
        jQuery(self.el).find('.cell').css('border-color', color);
    },
    nextColor: function() {
        var self = this;
        self.model.set({color_int: self.model.get('color_int') + 1 });
        self.setColor();
    },
    onBoxEdited: function() {
        var self = this;
        self.model.set({'contents': self.$el.find('.text_box').val()});
        self.model.trigger('checkEmptyBoxes');
        self.render();
    },
    render: function() {
        var self = this;

        if (self.model.get('active') === false) {
            jQuery(this.el).addClass('inactive_box');
            jQuery(this.el).find('.text_box').attr({'disabled': true});
        } else {
            jQuery(this.el).removeClass('inactive_box');
            jQuery(this.el).find('.text_box').attr({'disabled': false});
        }
        return this;
    },
    makeActive: function() {
        var self = this;
        self.model.set({active: true});
    },
    makeInactive: function() {
        this.model.set({active: false});
    }
});
