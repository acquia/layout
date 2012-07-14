(function (window, $) {
  var RLD = (function(){
    
    function ResponsiveLayoutDesigner() {
      this.options = {};
      this.layouts = {};
      this.layoutTemplate = {};
      this.regions = {};
      this.composites = {};
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    
    ResponsiveLayoutDesigner.prototype.init = function (options) {
      // Merge in user options.
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
      // Define a template for layouts.
      this.layoutTemplate = {
        'name': 'Default',
        'machine_name': 'default',
        'regions': [],
        'grid': {}
      };
      // Prep the composites.
      this.compositeLayouts();
      // Create the application root node.
      this.$editor = $('<div>', {
        'class': 'responsive-layout-designer'
      });
      // Instansiate Editors.
      this.compositeManager = new RLD.CompositeManager();
      this.stepEditor = new RLD.StepEditor();
      this.layoutEditor = new RLD.LayoutEditor();
      this.gridEditor = new RLD.GridEditor();
    };
    
    ResponsiveLayoutDesigner.prototype.start = function () {
      var layouts = this.layouts;
      var regionSet = new RLD.RegionSet({
        'regions': this.regions
      });
      var i, step, layout, grid;
      // Create obects for each composite.
      for (i = 0; i < layouts.length; i++) {
        step = new RLD.Step(layouts[i].step);
        layout = new RLD.Layout(layouts[i].layout);
        grid = new RLD.Grid(layouts[i].grid);
        // Save the composition elements into a unit.
        this.compositeManager.registerComposite(regionSet, step, layout, grid);
      }
      
      // Build the compositeManager and attach it to the DOM.
      this.compositeManager.build().appendTo(this.$editor);
    };
    
    ResponsiveLayoutDesigner.prototype.build = function () {
      return this.$editor;
    };
    
    ResponsiveLayoutDesigner.prototype.compositeLayouts = function () {
      var layout;
      for (layout in this.layouts) {
        if (this.layouts.hasOwnProperty(layout)) {
          
        }
      }
    };
    
    ResponsiveLayoutDesigner.prototype.registerEventHandler = function (event, handler) {
      
    };
    
    ResponsiveLayoutDesigner.prototype.registerEventListener = function () {
    
    };
    
    return ResponsiveLayoutDesigner;
    
  }());
  
  // Expose ResponsiveLayoutDesigner to the global object
  return (window.ResponsiveLayoutDesigner = RLD);
}(window, jQuery));
