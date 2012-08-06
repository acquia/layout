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
      // Define topics that will pass-through.
      this.topic('regionOrderUpdated');
      this.topic('regionAdded');
      this.topic('regionRemoved');
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
    RegionList.prototype.processList = function (items, location) {
      var newSet = [];
      var i, item, region;
      for (i = 0; i < items.length; i++) {
        item = items[i];
        // Check if this item is already an item.
        if ('init' in item && typeof item['init'] === 'function') {
          region = item;
        }
        else {
          region = new RLD.Region({
            'label': ('label' in item) ? item['label'] : 'No label',
            'machine_name': ('machine_name' in item) ? item['machine_name'] : 'no_machine_name',
            'classes': ('classes' in item) ? item['classes'] : [],
            'columns': ('columns' in item) ? item['columns'] : null
          });
        };
        // Add the new region to the list.
        this.items[(location !== undefined && location === 'top') ? 'unshift' : 'push'](region);
        newSet.push(region);
      }
      // Transfer pass-through subscriptions.
      this.transferSubscriptions(this.items);
      // Return the items that were added.
      return newSet;
    };
    /**
     * @todo, this method needs better argument type handling. It could
     * be either an array or an object.
     */
    RegionList.prototype.addItem = function (item, location) {
      return this.processList([item], location)
    };
    /**
     * @todo, this method needs better argument type handling. It could
     * be either an array or an object.
     */
    RegionList.prototype.insertItem = function (item, location) {
      var newItems = this.addItem(item, location);
      this.topic('regionAdded').publish(this.items, newItems, location);
    };
    /**
     *
     */
    RegionList.prototype.removeItem = function (index) {
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
