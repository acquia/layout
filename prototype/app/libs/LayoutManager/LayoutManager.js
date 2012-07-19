(function (RLD, $) {
  /**
   * LayoutManager editor provides functionality to display, add and remove
   * layout representations across arbitrary, user-defined breakpoint limits.
   */
  RLD['LayoutManager'] = (function build() {
  
    var options = {};
    var plugin = 'LayoutManager';
    
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
    LayoutManager.prototype.setup = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
      this.stepManager = new RLD.StepManager();
      this.layouts = new RLD.LayoutList();
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
      this.$editor = $('<div>', {
        'class': 'rld-layout-manager'
      })
      .append(
        $('<div>', {
          'class': 'rld-controls'
        })
        .append(
          $('<button>', {
            'class': 'save',
            'text': 'Save layouts'
          })
        )
      )
      .append(
        this.$stepSelector
        .append(
          this.stepManager.build(this.$steps, this.$layouts)
        )
      );
      /*this.$editor
      .delegate('button.save', 'click.ResponsiveLayoutDesigner', {'type': 'save'}, this.update); */
      // The editor is built and ready to be attached.
      return this.$editor;
    };
    /**
     * A layout is a set of regions, in the context of a step, laid out on a grid.
     */
    LayoutManager.prototype.registerLayout = function (step, regionList, gridSet) {
      var index;
      var grid = gridSet.getItem(step.grid);
      var layout = new RLD.Layout({
        'step': step, 
        'regionList': regionList,
        'grid': grid
      });
      this.layouts.addItem(layout);
      // Update Managers
      this.stepManager.addStep({'step': step, 'layout': layout});
    };
    
    return LayoutManager;
    
  }());

}(ResponsiveLayoutDesigner, jQuery));