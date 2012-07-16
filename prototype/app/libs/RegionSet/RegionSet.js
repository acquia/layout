(function (RLD, $) {
  // Temp location.
  RLD['RegionSet'] = (function () {

    function RegionSet() {
      this.options = {};
      this.regionItems = [];
      this.listeners = {};
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     *
     */
    RegionSet.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
      // Format the regions.
      this.processRegionList(this.regions);
    };
    /**
     *
     */
    RegionSet.prototype.build = function () {
      return this.$editor;
    };
    /**
     *
     */
    RegionSet.prototype.info = function (property, value) {      
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
     RegionSet.prototype.processRegionList = function (regions) {
      var index = 0;
      var region;
      for (region in regions) {
        if (regions.hasOwnProperty(region)) {
          this.regionItems.push(new RLD.Region({
            'name': regions[region],
            'machine_name': region,
            'weight': index
          }));
          index += 1;
        }
      }
    };
    /**
     *
     */
    RegionSet.prototype.update = function (regionSet) {
      this.regionItems = regionSet;
      this.callListeners('regionOrderUpdated', this);
    };
    /**
     *
     */
    RegionSet.prototype.registerEventListener = function (event, handler) {
      if (event in this.listeners) {
        this.listeners[event].push(handler);
        return;
      }
      // This is the first time this event has a listener registerd against it.
      this.listeners[event] = [handler];
    };
    /**
     * Invoke registered listeners.
     */
    RegionSet.prototype.callListeners = function (event) {
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

    return RegionSet;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));