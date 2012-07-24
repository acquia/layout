(function ($) {

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
  for (var machineName in regions) {
    Drupal.responsiveLayout.regionAddtoDOM('append', machineName, regions[machineName], false);
  }

  // Initialize sortable widget.
  $('.panels-responsive-admin-regions').sortable({
      // Make a placeholder visible when dragging.
      placeholder: "ui-state-highlight",
      // When the dragging and dropping is done, save updated region
      // list in our local list.
      deactivate: Drupal.responsiveLayout.setRegionList,
  });

  // Bind click handler for interactive region addition.
  $('#edit-layout-settings-layout-responsive-add-button').click(Drupal.responsiveLayout.regionAdd);
}

/**
 * Returned parsed list of regions based on values in textarea.
 */
Drupal.responsiveLayout.getRegionList = function() {
  var regionList = {};
  var editorLines = $('#edit-layout-settings-layout-responsive-regions').val().split("\n");
  for (lineNo in editorLines) {
    var line = editorLines[lineNo];
    if (line.length) {
      // Regions are represented as 'machne_name:Human readable label'.
      var regionDefinition = line.split('; ', 3);
      regionList[regionDefinition[0]] = {'label': regionDefinition[1], 'classes': regionDefinition[2]};
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
Drupal.responsiveLayout.setRegionList = function() {
  var regionsText = '';
  // Look at the visible regions only and gather their machine names.
  var regionsDom = $('.panels-responsive-admin-regions .region:visible');
  $(regionsDom).each(function (index, value) {
    var machineName = $(value).data('region-machine-name');
    regionsText += machineName + '; ' + $(value).data('region-label') + '; ' + $(value).find('input').val() + "\n";
  });
  $('#edit-layout-settings-layout-responsive-regions').val(regionsText);
}


/**
 * Event handler for region remove icon.
 */
Drupal.responsiveLayout.regionRemove = function() {
  // Get machine name and label and add it to the list of regions to add (back).
  var machineName = $(this).parent().data('region-machine-name');
  var label = $(this).parent().data('region-label');
  $('#edit-layout-settings-layout-responsive-add-existing-region').append(new Option(label, machineName));

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
    // An existing region was selected. Get label from there.
    var label = $(regionSelected).text();
    var machineName = $(regionSelected).attr('value');

    // Remove this region from the region select list, trigger change event.
    $(regionSelected).remove();
    $('#edit-layout-settings-layout-responsive-add-existing-region :first').attr('selected', true);
    $('#edit-layout-settings-layout-responsive-add-existing-region').change();
  }
  else {
    // Get the name and label from the input fields.
    var machineName = $('#edit-layout-settings-layout-responsive-add-machine-name').val();
    var label = $('#edit-layout-settings-layout-responsive-add-label').val();

    // Clear label input and trigger change event that will clear out the machine
    // name too due to the behavior in machine-name.js.
    $('#edit-layout-settings-layout-responsive-add-label').val('').change();
  }

  // Add new region if details were provided.
  if (machineName.length && label.length) {
    // Actually add the region to the DOM.
    Drupal.responsiveLayout.regionAddtoDOM('prepend', machineName, {'label': label, 'classes': ''}, true);
    // Save the new region list/order in our local list.
    Drupal.responsiveLayout.setRegionList();
  }

  // Stop click event from propagating.
  return false;
}

/**
 * Add region to the DOM, attach metadata and animate.
 */
Drupal.responsiveLayout.regionAddtoDOM = function(placement, machineName, data, animate) {

  // Add region related markup. Hide by default if revealing with animation.
  var regions = $('.panels-responsive-admin-regions');
  var markup = '<div class="region region-' + machineName + '"' + (animate ? ' style="display: none;"' : '') + '"><span class="drag-icon">&#8597;</span>' + data.label + '<input type="text" placeholder="classnames" value="' + data.classes + '" /><span class="remove-icon">X</span></div>';

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
  var region = $(regions).find('.region-' + machineName);
  $(region).data('region-machine-name', machineName).data('region-label', data.label);
  $(region).find('.remove-icon').click(Drupal.responsiveLayout.regionRemove);
  $(region).find('input').change(Drupal.responsiveLayout.setRegionList);

  // Animate the region showing up if needed.
  if (animate) {
    $(region).slideDown();
  }
}

})(jQuery);
