(function ($) {

Drupal.responsiveLayout = Drupal.responsiveLayout || {};

Drupal.behaviors.responsiveLayoutAdmin = {
  attach: function(context) {
    Drupal.responsiveLayout.regionsEditorInit();
  }
}

Drupal.responsiveLayout.regionsList = function() {
  var regionList = {};
  var editorLines = $('#edit-layout-settings-layout-responsive-regions').val().split("\n");
  for (lineNo in editorLines) {
    var line = $.trim(editorLines[lineNo]);
    if (line.length) {
      var regionDefinition = editorLines[lineNo].split(':', 2);
      regionList[regionDefinition[0]] = regionDefinition[1];
    }
  }
  return regionList;
}

Drupal.responsiveLayout.regionsEditorInit = function() {
  // Add a wrapper to contain the regions.
  $('.panels-responsive-admin').append('<div class="panels-responsive-admin-regions"></div>');

  // For each region in the configuration, add the required markup.
  for (var machine_name in Drupal.responsiveLayout.regionsList()) {
    Drupal.responsiveLayout.regionAddtoDom('append', machine_name, Drupal.settings.responsiveLayout.settings.regions[machine_name], false);
  }

  // Initialize sortable widget.
  $('.panels-responsive-admin-regions').sortable({
      // Make a placeholder visible when dragging.
      placeholder: "ui-state-highlight",
      // When the dragging and dropping is done, save via AJAX.
      deactivate: Drupal.responsiveLayout.regionsSave,
  });
  // Make regular text selection disabled for the items.
  $('.panels-responsive-admin-regions').disableSelection();

  // Add handlers for removing and adding regions.
  $('.panels-responsive-admin-regions .region .close-icon').click(Drupal.responsiveLayout.regionRemove);
  $('#edit-layout-settings-layout-responsive-add-button').click(Drupal.responsiveLayout.regionAdd);
}

Drupal.responsiveLayout.regionRemove = function() {
  // Slide up the region when the close button is clicked. This will hide it
  // from view and will make it not being saved. Register the saving function
  // for when the region is already hidden.
  $(this).parent().slideUp(400, Drupal.responsiveLayout.regionsSave);
  return false;
}

Drupal.responsiveLayout.regionsSave = function() {
  var regionsText = '';
  // Look at the visible regions only and gather their machine names.
  var regionsDom = $('.panels-responsive-admin-regions .region:visible');
  $(regionsDom).each(function (machine_name, value) {
    var regionKey = $(value).data('region-machine-name');
    regionsText += regionKey + ':' + $(value).data('region-label') + "\n";
  });
  $('#edit-layout-settings-layout-responsive-regions').val(regionsText);
}

Drupal.responsiveLayout.regionAdd = function() {
  // Get the name and label from the input fields.
  var machine_name = $('#edit-layout-settings-layout-responsive-add-machine-name').val();
  var label = $('#edit-layout-settings-layout-responsive-add-label').val();
  $('#edit-layout-settings-layout-responsive-add-label').val('');
  // Trigger label change event that will clear out the machine name.
  $('#edit-layout-settings-layout-responsive-add-label').change();
  Drupal.responsiveLayout.regionAddtoDom('prepend', machine_name, label, true);
  Drupal.responsiveLayout.regionsSave();
  return false;
}

Drupal.responsiveLayout.regionAddtoDom = function(placement, machine_name, label, animate) {
  // Add region related markup and data.
  var regions = $('.panels-responsive-admin-regions');
  var markup = '<div class="region region-' + machine_name + '"' + (animate ? ' style="display: none;"' : '') + '"><span class="drag-icon">&#8597;</span>' + label + '<span class="close-icon">X</span></div>';
  if (placement == 'prepend') {
    $(regions).prepend(markup);
  }
  else {
    $(regions).append(markup);
  }
  var region = $(regions).find('.region-' + machine_name);
  $(region).data('region-machine-name', machine_name).data('region-label', label);
  $(region).find('.close-icon').click(Drupal.responsiveLayout.regionRemove);
  if (animate) {
    $(region).slideDown();
  }
}

})(jQuery);
