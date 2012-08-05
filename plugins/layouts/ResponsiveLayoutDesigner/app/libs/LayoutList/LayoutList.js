(function (RLD, $) {
  // Temp location.
  RLD['LayoutList'] = (function () {

    var plugin = 'LayoutList';

    function LayoutList() {
      this.items = [];
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    LayoutList.prototype = new RLD.InitClass();
    /**
     *
     */
    LayoutList.prototype.setup = function () {
      // Process list items.
      if ('layouts' in this) {
        this.processList(this.layouts);
        delete this.layouts;
      }
      else {
        this.log('[RLD | ' + plugin + '] The list has no items at setup.');
      }
      // Define topics that will pass-through.
      this.topic('regionOrderUpdated');
      this.topic('layoutSaved');
      this.topic('regionAdded');
      this.topic('regionRemoved');
      this.topic('regionResized');
      this.topic('regionResizing');
      this.topic('regionResizeStarted');
    };
    /**
     *
     */
    LayoutList.prototype.processList = function (items) {
      // The broadcaster just pipes events through.
      var fn = $.proxy(this.eventBroadcaster, this);
      var handlers = {};
      var i, layoutStep, listener;
      // Get a list of the listeners to register on each Layout.
      var listener;
      for (listener in this.listeners) {
        if (this.listeners.hasOwnProperty(listener)) {
          handlers[listener] = fn;
        }
      }
      // Create obects for each composite.
      for (i = 0; i < items.length; i++) {
        // Save the layout elements into a unit.
        layoutStep = new RLD.LayoutStep({
          'regionList': items[i].regionList,
          'step': items[i].step,
          'grid': items[i].grid
        });
        this.items.push(layoutStep);
      }
      // Transfer pass-through subscriptions.
      this.transferSubscriptions(this.items);
    };
    /**
     *
     */
    LayoutList.prototype.addItem = function (layout) {
      this.processList([layout]);
    }
    /**
     *
     */
    LayoutList.prototype.update = function (type, list) {
      this.items = list;
    };

    return LayoutList;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
