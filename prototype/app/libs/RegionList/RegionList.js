(function (RLD, $) {
  // Temp location.
  RLD['RegionList'] = (function () {
  
    var options = {};
    var plugin = 'RegionList';

    function RegionList() {
      this.items = [];
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     *
     * Options passed into the constructor are assigned as
     * properties of the instance.
     */
    RegionList.prototype = new RLD.InitClass();
    /**
     * Called by the InitClass prototype.
     */
    RegionList.prototype.setup = function () {
      // Format the regions.
      if ('regions' in this) {
        this.processList(this.regions);
        delete this.regions;
      }
      else {
        this.log('[RLD | RegionList] The RegionList instance has no Regions at setup.');
      }
    };
    /**
     *
     */
     RegionList.prototype.processList = function (items) {
      var item;
      for (item in items) {
        if (items.hasOwnProperty(item)) {
          this.items.push(new RLD.Region({
            'label': items[item],
            'machine_name': item
          }));
        }
      }
    };
    /**
     *
     */
    RegionList.prototype.update = function (type, list) {
      this.items = type;
      this.triggerEvent('regionOrderUpdated', this);
    };

    return RegionList;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
