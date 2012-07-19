(function (RLD, $) {
  // Temp location.
  RLD['RegionList'] = (function () {

    function RegionList() {
      this.options = {};
      this.items = [];
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    RegionList.prototype = new RLD.InitClass();
    /**
     *
     */
    RegionList.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
      // Format the regions.
      this.processList(this.regions);
    };
    /**
     *
     */
    RegionList.prototype.build = function () {
      return this.$editor;
    };
    /**
     *
     */
    RegionList.prototype.info = function (property, value) {      
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
     RegionList.prototype.processList = function (items) {
      var item;
      for (item in items) {
        if (items.hasOwnProperty(item)) {
          this.items.push(new RLD.Region({
            'name': items[item],
            'machine_name': item
          }));
        }
      }
    };
    /**
     *
     */
    RegionList.prototype.update = function (regionSet) {
      this.regionItems = regionSet;
      this.triggerEvent('regionOrderUpdated', this);
    };

    return RegionList;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
