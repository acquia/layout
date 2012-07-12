(function (window, $) {
  var RLD = (function(){
    
    function ResponsiveLayoutDesigner() {
      this.options = {
        'root': 'body',
        'composites': [{
          'name': 'default',
          'machine-name': 'default',
          'step': {
            'breakpoint': 0,
            'label': 'small'
          },
          'layout': null,
          'grid': null
        },
        {
          'name': 'default',
          'machine-name': 'default',
          'step': {
            'breakpoint': 320,
            'label': 'landscape'
          },
          'layout': null,
          'grid': null
        }]
      };
      this.$root = $();
      this.compositeManager = new RLD.CompositeManager();
      this.stepEditor = new RLD.StepEditor();
      this.layoutEditor = new RLD.LayoutEditor();
      this.gridEditor = new RLD.GridEditor();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    
    ResponsiveLayoutDesigner.prototype.init = function (options) {
      this.options = $.extend({}, this.options, options);
      this.$root = $(this.options.root);
      this.composites = this.options.composites;
    };
    
    ResponsiveLayoutDesigner.prototype.start = function () {
      var composites = this.options.composites;
      var i, index, step, layout, grid, $editor;
      // Create the application root node.
      var $designer = $('<div>', {
        'class': 'responsive-layout-designer'
      })
      .appendTo(this.$root);
      // Create obects for each composite.
      for (i = 0; i < composites.length; i++) {
        step = new RLD.Step(composites[i].step);
        layout = new RLD.Layout(composites[i].layout);
        grid = new RLD.Grid(composites[i].grid);
        index = step.getBreakPoint();
        // Save the composition elements into a unit.
        this.compositeManager.registerComposite(index, step, layout, grid);
      }
      
      // Build the compositeManager and attach it to the DOM.
      this.compositeManager.build().appendTo($designer);
    };
    
    ResponsiveLayoutDesigner.prototype.registerEventHandler = function (event, handler) {
      
    }
    
    ResponsiveLayoutDesigner.prototype.registerEventListener = function () {
    
    }
    
    return ResponsiveLayoutDesigner;
    
  }());
  
  // Expose ResponsiveLayoutDesigner to the global object
  return (window.ResponsiveLayoutDesigner = RLD);
}(window, jQuery));
