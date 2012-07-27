(function (RLD, $) {
  // Temp location.
  RLD['RegionList'] = (function () {

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
      var fn = $.proxy(this.eventBroadcaster, this);
      var i, item, region;
      for (i = 0; i < items.length; i++) {
        item = items[i];
        region = new RLD.Region({
          'label': ('label' in item) ? item['label'] : 'No label',
          'machine_name': ('machine_name' in item) ? item['machine_name'] : 'no_machine_name',
          'classes': ('classes' in item) ? item['classes'] : [],
          'columns': ('columns' in item) ? item['columns'] : null
        });
        region.registerEventListener({
          'regionAdded': fn,
          'regionRemoved': fn,
          'regionResizing': fn,
          'regionResizeStarted': fn,
          'regionResized': fn
        });
        // Add the new region to the list.
        this.items.push(region);
      }
    };
    /**
     *
     */
    RegionList.prototype.update = function (type, list) {
      this.items = type;
    };

    return RegionList;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
