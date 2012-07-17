(function (window, $) {
  var RLD = (function(){
    /**
     * Extend jQuery to smooth out version differences.
     */
    $.Event.prototype.getDelegator = function () {
      if ('delegateTarget' in this) {
        return this.delegateTarget;
      }
      if ('liveFired' in this) {
        return this.liveFired;
      }
      return null;
    };
    /**
     * Create the InitClass object that all other objects will extend.
     */
    var InitClass = (function () {
      function InitClass() {
        this.listeners = {};
      }
      /**
       * Safe logging function.
       */
      InitClass.prototype.log = function (message, type) {
        if ('console' in window) {
          var type = type || 'log';
          if (type in console) {
            console[type](message);
          }
        }
      };
      /**
       *
       */
      InitClass.prototype.init = function () {};
      /**
       *
       */
      InitClass.prototype.info = function () {};
      /**
       *
       */
      InitClass.prototype.build = function () {};
      /**
       * Pushes a supplied function into the list of functions.
       */
      InitClass.prototype.registerEventListener = function (event, handler) {
        if (event in this.listeners) {
          this.listeners[event].push(handler);
          return;
        }
        // This is the first time this event has a listener registerd against it.
        this.listeners[event] = [handler];
      };    
      /**
       * Iterate through the callbacks and invoke them.
       */
      InitClass.prototype.triggerEvent = function (event) {
        var i, listeners, e, args;
        if (event in this.listeners) {
          listeners = this.listeners[event];
          // Create a jQuery Event for consistency and shift it into the arguments.
          e = $.Event(event);
          args = Array.prototype.slice.call(arguments);
          args.shift();
          args.unshift(e);
          // Call the listeners.
          for (i = 0; i < listeners.length; i++) {
            listeners[i].apply(this, args);
          } 
        }
      };
      
      return InitClass;
    }());
    /**
     * The ResponsiveLayoutDesigner is a facade for a set of sub-systems that manage
     * the configuration of a responsive layout through a browser.
     */
    function ResponsiveLayoutDesigner() {
      this.options = {};
      this.layouts = {};
      this.layoutTemplate = {};
      this.regions = {};
      this.composites = {};
      this.regionSet;
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the RLD with the InitClass.
     */
    ResponsiveLayoutDesigner.prototype = new InitClass();
    /**
     * Provide the InitClass for all other Classes to extend.
     */
    ResponsiveLayoutDesigner.InitClass = InitClass;
    /**
     * Implement the init() interface.
     */
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
        'class': 'rld-wrapper'
      });
      // Instansiate Editors.
      this.compositeManager = new RLD.CompositeManager();
      this.stepEditor = new RLD.StepEditor();
      this.layoutEditor = new RLD.LayoutEditor();
      this.gridEditor = new RLD.GridEditor();
    };
    /**
     *
     */
    ResponsiveLayoutDesigner.prototype.start = function () {
      var layouts = this.layouts;
      // this.regions is a simple object. The RegionSet provides methods to
      // manipulate this simple set.
      this.regionSet = new RLD.RegionSet({
        'regions': this.regions
      });
      var i, step, layout, grid;
      // Create obects for each composite.
      for (i = 0; i < layouts.length; i++) {
        step = new RLD.Step(layouts[i].step);
        layout = new RLD.Layout(layouts[i].layout);
        grid = new RLD.Grid(layouts[i].grid);
        // Save the composition elements into a unit.
        this.compositeManager.registerComposite(this.regionSet, step, layout, grid);
      }
      
      // Build the compositeManager and attach it to the DOM.
      this.compositeManager.build().appendTo(this.$editor);
    };
    /**
     *
     */
    ResponsiveLayoutDesigner.prototype.build = function () {
      return this.$editor;
    };
    /**
     *
     */
    ResponsiveLayoutDesigner.prototype.compositeLayouts = function () {
      var layout;
      for (layout in this.layouts) {
        if (this.layouts.hasOwnProperty(layout)) {
          
        }
      }
    };
    /**
     * Override the InitClass registerEventListener function.
     *
     * Push event listeners to the appropriate object to handle the callbacks.
     *
     * The ResponsiveLayoutDesigner is a facade for these sub-systems.
     */
    ResponsiveLayoutDesigner.prototype.registerEventListener = function (event, handler) {
      var e, listeners;
      // Accept both an object of listeners or a single event/handler combo.
      if (typeof event !== 'object') {
        listeners = {};
        listeners[event] = handler;
      }
      else {
        listeners = event;
      }
      // Loop through the listeners and register them.
      for (e in listeners) {
        if (listeners.hasOwnProperty(e)) {
          switch (e) {
          case 'regionOrderUpdated':
            this.regionSet.registerEventListener(e, listeners[e]);
            break;
          default:
            break;
          }
        }
      }
    };

    return ResponsiveLayoutDesigner;
    
  }());
  
  // Expose ResponsiveLayoutDesigner to the global object
  return (window.ResponsiveLayoutDesigner = RLD);
}(window, jQuery));
