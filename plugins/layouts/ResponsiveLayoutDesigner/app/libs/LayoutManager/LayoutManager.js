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
      this.activeLayoutStep;
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
      // Instantiate classes.
      this.stepManager = new RLD.StepManager();
      this.layoutList = new RLD.LayoutList();
      // Define topics that will pass-through.
      this.topic('regionOrderUpdated');
      this.topic('layoutSaved');
      this.topic('regionAdded');
      this.topic('regionRemoved');
      this.topic('regionResized');
      this.topic('regionResizing');
      this.topic('regionResizeStarted');
      // Transfer pass-through subscriptions.
      this.transferSubscriptions([
        this.stepManager,
        this.regionList,
        this.layoutList
      ]);
      // Register for events on the stepManager.
      fn = $.proxy(this.switchStep, this);
      this.stepManager.topic('stepActivated').subscribe(fn);
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
        this.registerLayoutStep(steps[i]);
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
      return this.$editor;
    };
    /**
     * A layout is a set of regions, in the context of a step, laid out on a grid.
     */
    LayoutManager.prototype.registerLayoutStep = function (step) {
      // Add the Layout to the LayoutList.
      var fn = $.proxy(this.eventBroadcaster, this);
      // Add the LayoutSteps to the LayoutList.
      this.layoutList.addItem({
        'step': step,
        'regionList': this.regionList,
        'grid': this.gridList.getItem(step.grid.info('machine_name'))
      });
      // Add the Step to the StepManager.
      this.stepManager.addItem(step);
    };
    /**
     *
     */
    LayoutManager.prototype.switchStep = function (event, step) {
      var args = arguments;
      var activeStep = this.stepManager.info('activeStep');
      var id = activeStep.info('breakpoint');
      var $screen = this.$layouts.find('.rld-screen');
      var $layout = $('<div>', {
        'class': 'rld-layout'
      });
      var i, layout, grid, gridColumns, gridClasses;
      // Clear out the current screen.
      $screen.children('.rld-layout').hide(0, function () {
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
            .addClass('rld-container-' + gridColumns)
            .append(this.buildAddRegionButton('top'))
            .append(this.buildGridOverlay(gridColumns))
            .append(layout.build())
            .append(this.buildAddRegionButton('bottom'))
          );
        }
      }
      this.topic('stepActivated').publish(step);
    };
    
    LayoutManager.prototype.buildGridOverlay = function (columns) {
      var $overlay = $('<div>', {
        'class': 'rld-grid-overlay clearfix'
      });
      var cols = Number(columns);
      var fn;
      while (cols) {
        $overlay.append(
          $('<div>', {
            'class': 'rld-span_1 rld-col rld-grid-col'
          })
        );
        cols -= 1;
      }
      fn = $.proxy(this.expandGridOverlay, $overlay);
      $overlay
      .bind('mousedown.ResponsiveLayoutDesigner', fn);
      fn = $.proxy(this.contractGridOverlay, $overlay);
      $overlay
      .bind('mouseup.ResponsiveLayoutDesigner', fn);
      
      return $overlay;
    };
    /**
     *
     */
    LayoutManager.prototype.expandGridOverlay = function (event) {
      var $overlay = this;
      var height = $overlay.parent().innerHeight();
      $overlay.animate({
        height: height,
        'opacity': 0.4545
      })
      .css({
        'z-index': 100
      });
      
    };
    /**
     *
     */
    LayoutManager.prototype.contractGridOverlay = function (event) {
      var $overlay = this;
      var height = $overlay.parent().innerHeight();
      $overlay.animate({
        height: 0,
        'opacity': 1
      })
      .css({
        'z-index': 0
      });
    };
    /**
     *
     */
    LayoutManager.prototype.buildAddRegionButton = function (location) {
      var handler = $.proxy(this.addRegion, this);
      var $controls = $('<div>', {
        'class': 'rld-layoutstep-controls' + ' ' + location
      })
      .append(
        $('<button>', {
          'text': 'Add new region'
        })
        .bind('click', {'location': location, 'manager': this}, handler)
      );
      return $controls;
    };
    /**
     *
     */
    LayoutManager.prototype.addRegion = function (event) {
      event.preventDefault();
      var regionList = this.regionList;
      this.regionList.insertItem({
        'machine_name': 'some-new-region',
        'label': 'My new region'
      });
    };
    /**
     *
     */
    LayoutManager.prototype.getActiveLayoutStep = function () {
    
    };
    return LayoutManager;
    
  }());

}(ResponsiveLayoutDesigner, jQuery));