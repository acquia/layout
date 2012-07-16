(function (RLD, $) {
  // Temp location.
  RLD['RegionSet'] = (function () {

    function RegionSet() {
      this.options = {};
      this.regionItems = [];
      this.listeners = [];
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    
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
    
    RegionSet.prototype.build = function () {
      return this.$editor;
    };
    
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
    
    RegionSet.prototype.update = function (regionSet) {
      this.regionItems = regionSet;
      this.callListeners('regionOrderUpdated', this);
    };
    
    RegionSet.prototype.callListeners = function (type) {
      var i;
      for (i = 0; i < this.listeners.length; i++) {
        this.listeners[i].apply(this, Array.prototype.shift.call(arguments));
      } 
      
    }

    return RegionSet;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));