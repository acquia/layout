(function (RLD, $) {
  /**
   * CompositeManager editor provides functionality to display, add and remove
   * layout representations across arbitrary, user-defined breakpoint limits.
   */
  RLD['CompositeManager'] = (function build() {
    
    function CompositeManager() {
      this.options = {
        'ui': {
          'class-layout': 'rld-stepmanager',
          'class-layout-tabs': 'rld-steps',
          'class-layout-content': 'rld-layouts'
        }
      };
      // Ui components.
      this.$editor = $('<div>', {});
      this.$stepManager = $();
      this.$steps = $();
      this.$layouts = $();
      this.$controls = $();
      this.listeners = {
        'breakpointAdded': []
      };
      this.composites = {};
      // Setup
      this.init.apply(this, arguments);
    }
    /**
     * Integrate instantiation options.
     */
    CompositeManager.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
      // Assemble the editor managers and containers.
      this.$stepManager = $('<div>', {
        'class': this.options.ui['class-layout']
      });
      this.$steps = $('<ul>', {
        'class': this.options.ui['class-layout-tabs']
      });
      this.$layouts = $('<div>', {
        'class': this.options.ui['class-layout-content']
      });
      // Spin up the managers.
      this.stepManager = new RLD.StepManager();
    };
    /**
     *
     */
    CompositeManager.prototype.build = function () {
      // Assemble the editor fraemwork.
      this.$editor
      .addClass('rld-breakpointeditor')
      .append($('<div>', {
          'class': 'rld-controls'
        })
        .append($('<button>', {
          text: 'Configure breakpoints'
        }))
      )
      .append(this.$stepManager
        .append(this.stepManager.build(this.$steps, this.$layouts))
      );
      // Store the important elements of the editor as jQuery references.
      this.$controls = this.$editor.find('.controls');
      // The editor is built and ready to be attached.
      return this.$editor;
    };
    /**
     *
     */
    CompositeManager.prototype.getEditor = function () {
      return this.$editor;
    };
    /**
     *
     */
    CompositeManager.prototype.registerComposite = function (RegionSet, Step, Layout, Grid) {
      var regions = RegionSet.info('regionItems');
      var index;
      // A layout is the inflection of a region set and a grid. This means that a layout has no meaning
      // without a list of regions to place and without a grid to define where to place them.
      Layout.inflect(RegionSet.info('regionItems'), Grid);
      index = Number(Step.info('breakpoint'));
      // index = Step.info('index');
      this.composites[index] = {
        regions: RegionSet,
        step: Step,
        layout: Layout,
        grid: Grid
      };
      // Update Managers
      this.stepManager.addStep(this.composites[index]);
    };
    /**
     *
     */
    CompositeManager.prototype.launchStepEditor = function () {
      var $dialog = this.dialog;
      $dialog.append(this.stepEditor.getEditor());
      $dialog.dialog({
        autoOpen: false,
        modal: true,
        open: function() {},
        close: function() {
          $(this).dialog('destroy').removeAttr('style');
        }
      })
    };
    /**
     *
     */
    CompositeManager.prototype.registerEventListener = function (event, fn) {
      if (typeof event === 'string' && event in this.listeners && typeof fn === 'function') {
        this.listeners[event].push({
          callback: fn
        });
      }
    };
    
    return CompositeManager;
    
  }());

}(ResponsiveLayoutDesigner, jQuery));