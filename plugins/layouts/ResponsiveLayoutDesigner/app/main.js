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
        this.$editor = $('<div>', {});
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
        if (value !== undefined) {
          this[property] = value;
          return;
        }
        if (property in this) {
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
       *
       */
      InitClass.prototype.snapshot = function (index) {
        var snapshot = {};
        var prop;
        for (prop in this) {
          if (this.hasOwnProperty(prop)) {
            snapshot[prop] = this[prop];
          }
        }
        return snapshot;
      };
      /**
       * Pushes a supplied function into the list of functions.
       */
      InitClass.prototype.registerEventListener = function (event, handler) {
        var handlers = {};
        var e, fn;
        // Deal with event/handlers pass in an object.
        if (typeof event === 'string') {
          handlers[event] = handler;
        }
        else {
          handlers = event;
        }
        for (e in handlers) {
          if (handlers.hasOwnProperty(e)) {
            fn = handlers[e];
            if (e in this.listeners) {
              this.listeners[e].push(fn);
              return;
            }
            // This is the first time this event has a listener registerd against it.
            this.listeners[e] = [fn];   
          }
        }
      };  
      /**
       *
       */
      InitClass.prototype.clearEventListeners = function () {
        this.listeners = []; 
      }; 
      /**
       * Iterate through the callbacks and invoke them.
       */
      InitClass.prototype.triggerEvent = function (event) {
        var args =  Array.prototype.slice.call(arguments);
        var i, listeners, e, type;
        if (typeof event === 'object') {
          type = event.type;
        }
        else {
          type = event;
          // Create a jQuery Event for consistency and shift it into the arguments.
          e = $.Event(type);
          // Unshift in the original target for reference if this event bubbles.
          e.target = this;
          args.shift();
          args.unshift(e);
        }
        if (type in this.listeners) {
          listeners = this.listeners[type];
          // Call the listeners.
          for (i = 0; i < listeners.length; i++) {
            if (typeof listeners[i] === 'function') {
              listeners[i].apply(this, args);
            }
          } 
        }
      };
      /**
       * Essentially an event pass-through.
       */
      InitClass.prototype.eventBroadcaster = function () {
        this.triggerEvent.apply(this, arguments);
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
    ResponsiveLayoutDesigner.prototype.setup = function () {
      // Merge in user options.
      var regionList,stepList, gridList;
      // Create the application root node.
      this.$editor = $('<div>', {
        'class': 'rld-application'
      });
      // Instansiate the LayoutManager.
      // this.regions is a simple object. The RegionList provides methods to
      // manipulate this simple set.
      if ('regions' in this) {
        regionList = new RLD.RegionList({
          'regions': this.regions
        });
        delete this.regions;
      }
      else {
        this.log('[RLD | ' + plugin + '] No regions provided.');
      }
      if ('steps' in this) {
        stepList = new RLD.StepList({
          'steps': this.steps
        });
        delete this.steps;
      }
      else {
        this.log('[RLD | ' + plugin + '] No steps provided.');
      }
      if ('grids' in this) {
        gridList = new RLD.GridList({
          'grids': this.grids
        });
        delete this.grids;
      }
      else {
        this.log('[RLD | ' + plugin + '] No grids provided.');
      }
      // Create a layout manager.
      this.layoutManager = new RLD.LayoutManager({
        'stepList': stepList,
        'regionList': regionList,
        'gridList': gridList
      });
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
          this.layoutManager.registerEventListener(e, listeners[e]);
        }
      }
    };

    ResponsiveLayoutDesigner.prototype.save = function () {
      return this.layoutManager;
    };

    return ResponsiveLayoutDesigner;
    
  }());
  
  // Expose ResponsiveLayoutDesigner to the global object
  return (window.ResponsiveLayoutDesigner = RLD);
}(window, jQuery));
/**
 * supplantClass() jQuery plugin
 *
 * Adds the replacement class string to each element.
 *
 * If a class or classes contain the needle, they are removed from the element.
 */
(function ($) {
	// Add the plugin as a property of the jQuery fn object.
	$.fn['supplantClass'] = function (needle, replacement) {
	  return this.each(function (index, element) {
      var $this = $(this);
      var cl = [];
      // Get an array of classes the excludes any that contain the needle.
      var classes = $this.attr('class').split(' ');
      for (var i = 0; i < classes.length; i++) {
        if (classes[i].indexOf(needle) === -1) {
          cl.push(classes[i]);
        }
      }
      // Push the replacement in all cases.
      $.merge(cl, replacement.split(' '));
      // Create a string and assign it to the object.
      $this.removeAttr('class').addClass(cl.join(' '));
    });
	};
}(jQuery));
