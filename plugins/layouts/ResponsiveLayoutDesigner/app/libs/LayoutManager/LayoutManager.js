(function (RLD, $) {
  /**
   * LayoutManager editor provides functionality to display, add and remove
   * layout representations across arbitrary, user-defined breakpoint limits.
   */
  RLD['LayoutManager'] = (function build() {

    var plugin = 'LayoutManager';
    
    function LayoutManager() {
      // Ui components.
      this.options = {
        'ui': {
          'class-layout': 'rld-stepmanager',
          'class-layout-tabs': 'rld-steps',
          'class-layout-content': 'rld-layouts'
        }
      };
      this.$editor = $();
      this.$stepSelector = $();
      this.$steps = $();
      this.$layouts = $();
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
    LayoutManager.prototype.setup = function () {
      var fn, steps;
      this.stepManager = new RLD.StepManager();
      this.layoutList = new RLD.LayoutList();
      // Register for events on the StepManager.
      fn = $.proxy(this.switchStep, this);
      this.stepManager.registerEventListener({
        'stepActivated': fn
      });
      // Register for events on the LayoutList.
      // The broadcaster just pipes events through.
      fn = $.proxy(this.eventBroadcaster, this);
      this.layoutList.registerEventListener({
        'layoutSaved': fn,
        'regionOrderUpdated': fn,
        'regionRemoved': fn,
        'regionAdded': fn,
        'regionResized': fn,
        'regionResizing': fn,
        'regionResizeStarted': fn
      });
      // Assemble the editor managers and containers.
      this.$stepSelector = $('<div>', {
        'class': this.ui['class-layout']
      });
      this.$steps = $('<ul>', {
        'class': this.ui['class-layout-tabs']
      });
      this.$layouts = $('<div>', {
        'class': this.ui['class-layout-content']
      });
      // Register Layouts into the layoutList
      // For every step we'll register a layout.
      steps = this.stepList.info('items');
      // Create obects for each composite.
      for (i = 0; i < steps.length; i++) {
        // Save the composition elements into a unit.
        this.registerLayout(steps[i]);
      }
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
          this.stepManager.build(this.$steps)
        )
      )
      .append(
        this.$layouts
        .append(
          $('<div>', {
            'class': 'rld-screen clearfix',
          })
        )
      );
      /*this.$editor
      .delegate('button.save', 'click.ResponsiveLayoutDesigner', {'type': 'save'}, this.update); */
      // The editor is built and ready to be attached.
      this.switchStep();
      return this.$editor;
    };
    /**
     * A layout is a set of regions, in the context of a step, laid out on a grid.
     */
    LayoutManager.prototype.registerLayout = function (step, gridList) {
      // Add the Layout to the LayoutList.
      var fn = $.proxy(this.eventBroadcaster, this);
      this.layoutList.addItem({
        'step': step,
        'regionList': this.regionList,
        'grid': this.gridList.getItem(step.grid)
      });
      // Add the Step to the StepManager.
      this.stepManager.addItem(step);
    };
    /**
     *
     */
    LayoutManager.prototype.switchStep = function (event) {
      var activeStep = this.stepManager.info('activeStep');
      var id = activeStep.info('breakpoint');
      var $screen = this.$layouts.find('.rld-screen');
      var $layout = $('<div>', {
        'class': 'rld-layout'
      });
      var i, layout, grid, gridColumns, gridClasses;
      // Clear out the current screen.
      $screen.children('.rld-layout').slideUp(80, function () {
        $(this).remove();
      });
      // Get the active step and layout.
      for (i = 0; i < this.layoutList.info('items').length; i++) {
        layout = this.layoutList.info('items')[i];
        if (layout.step.info('machine_name') === activeStep.info('machine_name')) {
          grid = layout.info('grid');
          gridColumns = grid.info('columns');
          gridClasses = grid.info('classes') || [];
          if (gridClasses.length > 0) {
            $screen.addClass();
          }
          $screen.animate({
            width: layout.step.info('size')
          });
          // Append the frame to the screen.
          $screen
          .append(
            $layout
            .empty()
            .addClass(gridClasses.join(' '))
            .append(this.buildGridOverlay(gridColumns))
            .append(layout.build())
          );
        }
      }
    };
    
    LayoutManager.prototype.buildGridOverlay = function (columns) {
      var $overlay = $('<div>', {
        'class': 'rld-grid-overlay clearfix rld-container-' + columns,
      });
      var cols = Number(columns);
      var i;
      while (cols) {
        $overlay.append(
          $('<div>', {
            'class': 'rld-span_1 rld-col rld-grid-col'
          })
        );
        cols -= 1;
      }
      
      
      return $overlay;
    };

    return LayoutManager;
    
  }());

}(ResponsiveLayoutDesigner, jQuery));