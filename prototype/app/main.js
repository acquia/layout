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

      var plugin = 'InitClass';

      function InitClass() {
        this.$editor = $();
        this.listeners = {};
        this.items = [];
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
      InitClass.prototype.init = function (opts) {
        var prop;
        var options = ('options' in this) ? this.options : {};
        options = $.extend({}, options, opts);
        for (prop in options) {
          if (options.hasOwnProperty(prop)) {
            this[prop] = options[prop];
          }
        }
        // Delete the options.
        if ('options' in this) {
          delete this.options;
        }
        // Call the object's setup method.
        this.setup.apply(this);
      };
      /**
       *
       */
      InitClass.prototype.setup = function () {};
      /**
       *
       */
      InitClass.prototype.info = function (property, value) {      
        if (property in this) {
          if (value !== undefined) {
            this[property] = value;
            return;
          }
          return this[property];
        }
        return;
      };
      /**
       *
       */
      InitClass.prototype.build = function (options) {
        return this.$editor;
      };
      /**
       *
       */
      InitClass.prototype.addItem = function (item) {
        this.items.push(item);
      };
      /**
       *
       */
      InitClass.prototype.getItem = function (index) {
        var i;
        for (i = 0; i < this.items.length; i++) {
          for (property in this.items[i]) {
            if ('machine_name' in this.items[i] && this.items[i]['machine_name'] === index) {
                return this.items[i];
            }
          }
        }
        this.log('[RLD | ' + plugin + '] Item not found in this set.', 'info');
        return null;
      };
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
      var options = {};
      var plugin = 'ResponsiveLayoutDesigner';
      this.steps = {};
      this.regions = {};
      this.grids = {};
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
    ResponsiveLayoutDesigner.prototype.setup = function (options) {
      // Merge in user options.
      var arg = arguments;
      var i, steps;
      // Create the application root node.
      this.$editor = $('<div>', {
        'class': 'rld-application'
      });
      // Instansiate Editors.
      this.layoutManager = new RLD.LayoutManager();
      // this.regions is a simple object. The RegionList provides methods to
      // manipulate this simple set.
      if ('regions' in this) {
        this.regionList = new RLD.RegionList({
          'regions': this.regions
        });
        delete this.regions;
      }
      else {
        this.log('[RLD | ' + plugin + '] No regions provided.');
      }
      if ('steps' in this) {
        this.stepSet = new RLD.StepList({
          'steps': this.steps
        });
        delete this.steps;
      }
      else {
        this.log('[RLD | ' + plugin + '] No steps provided.');
      }
      if ('grids' in this) {
        this.gridSet = new RLD.GridList({
          'grids': this.grids
        });
        delete this.grids;
      }
      else {
        this.log('[RLD | ' + plugin + '] No grids provided.');
      }
      // For every step we'll register a layout.
      steps = this.stepSet.info('items');
      // Create obects for each composite.
      for (i = 0; i < steps.length; i++) {
        // Save the composition elements into a unit.
        this.layoutManager.registerLayout(steps[i], this.regionList, this.gridSet);
      }
    };
    /**
     * Generate a view of the class instance.
     *
     * Returns a DOM fragment.
     */
    ResponsiveLayoutDesigner.prototype.build = function () {
      // Build the layoutManager and attach it to the $editor.
      this.layoutManager.build().appendTo(this.$editor);
      return this.$editor;
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
          case 'regionClosed':
            this.regionList.registerEventListener(e, listeners[e]);
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
