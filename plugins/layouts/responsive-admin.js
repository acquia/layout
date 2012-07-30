(function ($, ResponsiveLayoutDesigner) {

/**
 * Safe logging function.
 */
function log (message, type) {
  if ('console' in window) {
    var type = type || 'log';
    if (type in console) {
      console[type](message);
    }
  }
}

Drupal.responsiveLayout = Drupal.responsiveLayout || {};

Drupal.behaviors.responsiveLayoutAdmin = {
  attach: function(context) {
    // Initialize responsive layout editor.
    Drupal.responsiveLayout.init();
  }
}

/**
 * Initialize responsive layout editor.
 */
Drupal.responsiveLayout.init = function() {
  // Initialize region list and per-breakpoint columns.
  var regionList = [];
  var layoutConfig = $.parseJSON($('#edit-layout-settings-layout-responsive-regions').val());
  for (var regionIndex in layoutConfig.regions) {
    regionList.push({
      'machine_name': layoutConfig.regions[regionIndex].name,
      'label': layoutConfig.regions[regionIndex].admin_title,
    });
  }

  // Build a list of grids for the editor.
  var gridList = [];
  for (var gridIndex in Drupal.settings.responsiveLayout.defaultGrids) {
    gridList.push({
      'machine_name': Drupal.settings.responsiveLayout.defaultGrids[gridIndex].name,
      'columns': Drupal.settings.responsiveLayout.defaultGrids[gridIndex].columns,
      'classes': ['rld-container-' + Drupal.settings.responsiveLayout.defaultGrids[gridIndex].name],
    });
  }

  // Build a list of breakpoints for the editor.
  var breakpointList = [];
  for (var breakpointIndex in Drupal.settings.responsiveLayout.defaultBreakpoints) {
    var overrideList = [];
    var name = Drupal.settings.responsiveLayout.defaultBreakpoints[breakpointIndex].name;
    for (var overrideIndex in layoutConfig.overrides[name]) {
      overrideList.push({
        'machine_name': layoutConfig.overrides[name][overrideIndex].name,
        'columns': layoutConfig.overrides[name][overrideIndex].columns,
      });
    }
    breakpointList.push({
      'label': Drupal.settings.responsiveLayout.defaultBreakpoints[breakpointIndex].admin_title,
      'machine_name': name,
      // @todo: make sure that em/px based breakpoints work alike.
      'breakpoint': parseInt(Drupal.settings.responsiveLayout.defaultBreakpoints[breakpointIndex].width),
      'grid': Drupal.settings.responsiveLayout.defaultBreakpoints[breakpointIndex].grid_name,
      'regions': overrideList,
    });
  }

  // Instantiate a layout designer.
  this.editor = new ResponsiveLayoutDesigner({
    'regions': regionList,
    'steps': breakpointList,
    'grids': gridList,
  });

  // var save = $.proxy(this.save, this);

  // Register event listeners. Just update our representation of the layout
  // for any event for now.
  this.editor.registerEventListener({
    'regionOrderUpdated': Drupal.responsiveLayout.eventHandler,
    'layoutSaved': Drupal.responsiveLayout.eventHandler,
    'regionRemoved': Drupal.responsiveLayout.eventHandler,
    'regionAdded': Drupal.responsiveLayout.eventHandler,
    'regionResized': Drupal.responsiveLayout.eventHandler,
    'regionResizing': Drupal.responsiveLayout.eventHandler,
    'regionResizeStarted': Drupal.responsiveLayout.eventHandler
  });

  // Insert the editor in the DOM.
  this.editor.build().appendTo('#responsive-layout-designer');

  // Save a reference to the editor to the DOM for development.
  window.RLDEditor = this.editor;

  // Intervene on form submit to get data from the app into the page.
  // @todo this form ID seems really generic. We need something more specific.
  // var that = this;
  // $('#ctools-export-ui-edit-item-form').bind('submit', {'responsiveLayout': that}, Drupal.responsiveLayout.save);
}

/**
 * Respond to app updates.
 *
 * This is generic so we don't have to have a callback for each event we'd like
 * to track during prototyping.
 */
Drupal.responsiveLayout.eventHandler = function(event) {
  /*var i;
  // Log the event type.
  log(event.type, 'info');
  var args = Array.prototype.slice.call(arguments);
  // Print the args as well.
  for (i = 0; i < args.length; i++) {
    log(args[i], 'dir');
  }*/

  var layoutSettings = {'regions' : [], 'overrides': []};
  var layoutManager = Drupal.responsiveLayout.editor.save();
  var regionList = layoutManager.info('regionList');
  var regions = regionList.info('items');
  for (var i = 0; i < regions.length; i++) {
    layoutSettings.regions.push({'name': regions[i].info('machine_name'), 'admin_title': regions[i].info('label')});
  }

  var stepList = layoutManager.info('stepList');
  var steps = stepList.info('items');
  for (var i = 0; i < steps.length; i++) {
    layoutSettings.overrides[steps[i].machine_name] = [];
    if (steps[i].regionList.items.length) {
      for (var r = 0; r < steps[i].regionList.items.length; r++) {
        layoutSettings.overrides[steps[i].machine_name].push({
          'name': steps[i].regionList.items[r].machine_name,
          'columns': steps[i].regionList.items[r].columns
        });
      }
    }
  }

  // The value of the textarea is saved to the server when the whole layout is
  // saved. We do not have live AJAX communication because the interaction is
  // built with rapid changes in mind (ordering, adding new regions, resizing),
  // and we don't have a live preview needed given the useful builder view
  // itself.
  $('#edit-layout-settings-layout-responsive-regions').val($.serializeJSON(layoutSettings));
}

})(jQuery, ResponsiveLayoutDesigner);

jQuery(function($) {
    $.extend({
        serializeJSON: function(obj) {
            var t = typeof(obj);
            if(t != "object" || obj === null) {
                // simple data type
                if(t == "string") obj = '"' + obj + '"';
                return String(obj);
            } else {
                // array or object
                var json = [], arr = (obj && obj.constructor == Array);

                $.each(obj, function(k, v) {
                    t = typeof(v);
                    if(t == "string") v = '"' + v + '"';
                    else if (t == "object" & v !== null) v = $.serializeJSON(v)
                    json.push((arr ? "" : '"' + k + '":') + String(v));
                });

                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        }
    });
});