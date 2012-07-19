(function (RLD, $) {
  /**
   * LayoutManager editor provides functionality to display, add and remove
   * layout representations across arbitrary, user-defined breakpoint limits.
   */
  RLD['LayoutManager'] = (function build() {
    
    function LayoutManager() {
      this.options = {
        'ui': {
          'class-layout': 'rld-stepmanager',
          'class-layout-tabs': 'rld-steps',
          'class-layout-content': 'rld-layouts'
        }
      };
      // Ui components.
      this.$editor = $();
      this.$stepSelector = $();
      this.$steps = $();
      this.$layouts = $();
      this.$controls = $();
      this.listeners = {
        'breakpointAdded': []
      };
      this.layouts = {};
      // Setup
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    LayoutManager.prototype = new RLD.InitClass();
    /**
     * Integrate instantiation options.
     */
    LayoutManager.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
      this.stepManager = new RLD.StepManager();
      // Assemble the editor managers and containers.
      this.$stepSelector = $('<div>', {
        'class': this.options.ui['class-layout']
      });
      this.$steps = $('<ul>', {
        'class': this.options.ui['class-layout-tabs']
      });
      this.$layouts = $('<div>', {
        'class': this.options.ui['class-layout-content']
      });
    };
    /**
     *
     */
    LayoutManager.prototype.build = function () {
      // Assemble the editor fraemwork.
      
      this.$editor = $('<div>', {})
      .append($('<div>', {
          'class': 'rld-controls'
        })
        .append($('<button>', {
          text: 'Configure breakpoints'
        }))
      )
      .append(
        this.$stepSelector
        .append(
          this.stepManager.build(this.$steps, this.$layouts)
        )
      );
      // Store the important elements of the editor as jQuery references.
      this.$controls = this.$editor.find('.controls');
      // The editor is built and ready to be attached.
      return this.$editor.contents();
    };
    /**
     * A layout is a set of regions, in the context of a step, laid out on a grid.
     */
    LayoutManager.prototype.registerLayout = function (step, regionSet, gridSet) {
      var index;
      var grid = gridSet.getItem(step.grid);
      var layout = new RLD.Layout({
        'step': step, 
        'regionSet': regionSet,
        'grid': grid
      });
      this.layouts[index] = layout;
      // Update Managers
      this.stepManager.addStep({'step': step, 'layout': layout});
    };
    
    return LayoutManager;
    
  }());

}(ResponsiveLayoutDesigner, jQuery));