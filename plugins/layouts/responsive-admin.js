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
/**
 * Respond to app updates.  This is generic so we don't have to
 * a callback for each event we'd like to track during prototyping.
 */
function ResponsiveLayoutDesignerEventHandler (event) {
  var i;
  // Log the event type.
  log(event.type, 'info');
  var args = Array.prototype.slice.call(arguments);
  // Print the args as well.
  for (i = 0; i < args.length; i++) {
    log(args[i], 'dir');
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
  // Add a wrapper to contain the regions.
  $('.panels-responsive-admin').append('<div class="panels-responsive-admin-regions"></div>');

  // For each region in the configuration, add the required markup.
  var regions = Drupal.responsiveLayout.getRegionList();
  // Build a BreakPoint editor
  this.editor = new ResponsiveLayoutDesigner({
    'regions': regions,
    /* A layout is a series of overrides on a basic RegionList. */
    'steps': [
      {
        'label': 'Phone',
        'machine_name': 'small',
        'breakpoint': '0',
        'grid': 'gridpak_3',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 1
          },
          {
            'machine_name': 'header_b',
            'columns': 2
          },
          {
            'machine_name': 'subheader_a',
            'columns': 1
          },
          {
            'machine_name': 'subheader_b',
            'columns': 1
          },
          {
            'machine_name': 'subheader_c',
            'columns': 1
          }
        ]
      },
      {
        'label': 'Phone Landscape',
        'machine_name': 'landscape',
        'breakpoint': '320',
        'grid': 'gridpak_6',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4
          },
          {
            'machine_name': 'header_b',
            'columns': 2
          }
        ]
      },
      {
        'label': 'Tablet',
        'machine_name': 'tablet',
        'breakpoint': '720',
        'grid': 'gridpak_10',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4
          },
          {
            'machine_name': 'header_b',
            'columns': 4
          },
          {
            'machine_name': 'header_c',
            'columns': 2
          }
        ]
      },
      {
        'label': 'Desktop',
        'machine_name': 'desktop',
        'breakpoint': '940',
        'grid': 'gridpak_12',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4
          },
          {
            'machine_name': 'header_b',
            'columns': 4
          },
          {
            'machine_name': 'header_c',
            'columns': 4
          },
          {
            'machine_name': 'sidebar_a',
            'columns': 2
          },
          {
            'machine_name': 'body',
            'columns': 8
          },
          {
            'machine_name': 'sidebar_b',
            'columns': 2
          }
        ]
      }
    ],
    'grids': [
      {
        'machine_name': 'gridpak_3',
        'columns': 3,
        'classes': [
          'rld-container-3'
        ]
      },
      {
        'machine_name': 'gridpak_6',
        'columns': 6,
        'classes': [
          'rld-container-6'
        ]
      },
      {
        'machine_name': 'gridpak_10',
        'columns': 10,
        'classes': [
          'rld-container-10'
        ]
      },
      {
        'machine_name': 'gridpak_12',
        'columns': 12,
        'classes': [
          'rld-container-12'
        ]
      }
    ]
  });
  // var save = $.proxy(this.save, this);
  // Register event listeners.
  this.editor.registerEventListener({
    'regionOrderUpdated': ResponsiveLayoutDesignerEventHandler,
    'layoutSaved': ResponsiveLayoutDesignerEventHandler,
    'regionRemoved': ResponsiveLayoutDesignerEventHandler,
    'regionAdded': ResponsiveLayoutDesignerEventHandler,
    'regionResized': ResponsiveLayoutDesignerEventHandler,
    'regionResizing': ResponsiveLayoutDesignerEventHandler,
    'regionResizeStarted': ResponsiveLayoutDesignerEventHandler
  });
  // Insert the editor in the DOM.
  this.editor.build().appendTo('#responsive-layout-designer');
  // Save a reference to the editor to the DOM for development.
  window.RLDEditor = this.editor;
  // Intervene on form submit to get data from the app into the page.
  // @todo this form ID seems really generic. We need something more specific.
  var that = this;
  // $('#ctools-export-ui-edit-item-form').bind('submit', {'responsiveLayout': that}, Drupal.responsiveLayout.save);
}

/**
 * Responds to the ResponsiveLayoutDesigner's 'layoutSaved' event.
 */
Drupal.responsiveLayout.save = function (event) {
  var layoutManager = event.data.responsiveLayout.editor.save();
  var regionList = layoutManager.info('regionList');
  var regions = regionList.info('items');
  var regionText = event.data.responsiveLayout.setRegionList(regions);
  // Set the new region textfield value on the form elements.
  var $hiddenText = $(this).find('#edit-layout-settings-layout-responsive-regions');
  var value = $hiddenText.val();
  $hiddenText.val(regionText);
  value = $hiddenText.val();
  return true;
};

/**
 * Returned parsed list of regions based on values in textarea.
 */
Drupal.responsiveLayout.getRegionList = function() {
  var regionList = [];
  var editorLines = $('#edit-layout-settings-layout-responsive-regions').val().split("\n");
  var lineNo, line;
  for (lineNo in editorLines) {
    line = editorLines[lineNo];
    if (line.length) {
      // Regions are represented as 'name;classes'.
      var regionDefinition = line.split('; ', 3);
      regionList.push({
        'machine_name': regionDefinition[0],
        'label': regionDefinition[1],
        'classes': regionDefinition[2]
      });
    }
  }
  return regionList;
}

/**
 * Save region list to local textarea that is used for server communication.
 *
 * The value of the textarea is saved to the server when the whole layout is
 * saved. We do not have live AJAX communication because the interaction is
 * built with rapid changes in mind (ordering, adding new regions, resizing),
 * and we don't have a live preview needed given the useful builder view
 * itself.
 */
Drupal.responsiveLayout.setRegionList = function(regions) {
  var regionsText = '';
  for (var i = 0; i < regions.length; i++) {
    regionsText += regions[i].info('machine_name') + '; ' + regions[i].info('label') + '; ' + regions[i].info('classes') + "\n";
  }
  return regionsText;
}


/**
 * Event handler for region remove icon.
 */
Drupal.responsiveLayout.regionRemove = function() {
  // Get machine name and admin title and add it to the list of regions to add (back).
  var name = $(this).parent().data('region-name');
  var adminTitle = $(this).parent().data('region-admin-title');
  $('#edit-layout-settings-layout-responsive-add-existing-region').append(new Option(adminTitle, name));

  // Slide up the region when the remove icon is clicked. This will hide it
  // from view and will make it not being saved. Register the saving function
  // for when the region is already hidden.
  $(this).parent().slideUp(400, Drupal.responsiveLayout.setRegionList);

  // Stop click event from propagating.
  return false;
}

/**
 * Add new region to the DOM based on form input and save it in our local list.
 */
Drupal.responsiveLayout.regionAdd = function() {
  // Look at the existing regions select list.
  var regionSelected = $('#edit-layout-settings-layout-responsive-add-existing-region :selected');
  if ($(regionSelected).attr('value').length) {
    // An existing region was selected. Get admin title from there.
    var adminTitle = $(regionSelected).text();
    var name = $(regionSelected).attr('value');

    // Remove this region from the region select list, trigger change event.
    $(regionSelected).remove();
    $('#edit-layout-settings-layout-responsive-add-existing-region :first').attr('selected', true);
    $('#edit-layout-settings-layout-responsive-add-existing-region').change();
  }
  else {
    // Get the name and admin title from the input fields.
    var name = $('#edit-layout-settings-layout-responsive-add-name').val();
    var adminTitle = $('#edit-layout-settings-layout-responsive-add-admin-title').val();

    // Clear admin title input and trigger change event that will clear out the
    // machine name too due to the behavior in machine-name.js.
    $('#edit-layout-settings-layout-responsive-add-admin-title').val('').change();
  }

  // Add new region if details were provided.
  if (name.length && adminTitle.length) {
    // Actually add the region to the DOM.
    Drupal.responsiveLayout.regionAddtoDOM('prepend', name, {'adminTitle': adminTitle, 'classes': ''}, true);
    // Save the new region list/order in our local list.
    Drupal.responsiveLayout.setRegionList();
  }

  // Stop click event from propagating.
  return false;
}

/**
 * Add region to the DOM, attach metadata and animate.
 */
Drupal.responsiveLayout.regionAddtoDOM = function(placement, name, data, animate) {

  // Add region related markup. Hide by default if revealing with animation.
  var regions = $('.panels-responsive-admin-regions');
  var markup = '<div class="region region-' + name + '"' + (animate ? ' style="display: none;"' : '') + '"><span class="drag-icon">&#8597;</span>' + data.adminTitle + '<input type="text" placeholder="classnames" value="' + data.classes + '" /><span class="remove-icon">X</span></div>';

  // When used interactively, we prepend to the list since that is more
  // visible. When used as an API function in initialization, we append in
  // order of intended appearance.
  if (placement == 'prepend') {
    $(regions).prepend(markup);
  }
  else {
    $(regions).append(markup);
  }

  // Add metadata to the region and attach remove icon event.
  var region = $(regions).find('.region-' + name);
  $(region).data('region-name', name).data('region-admin-title', data.adminTitle);
  $(region).find('.remove-icon').click(Drupal.responsiveLayout.regionRemove);
  $(region).find('input').change(Drupal.responsiveLayout.setRegionList);

  // Animate the region showing up if needed.
  if (animate) {
    $(region).slideDown();
  }
}

})(jQuery, ResponsiveLayoutDesigner);
