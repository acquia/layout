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
  // Add a tiny form section to allow for inline region addition.
  $('.panels-responsive-admin').append('<fieldset><label for="panels-responsive-new-region-name">New region machine name</label><input id="panels-responsive-new-region-name" class="form-text"><label for="panels-responsive-new-region-label">New region label</label><input id="panels-responsive-new-region-label" class="form-text"><button id="panels-responsive-add">Add region</button></fieldset>');

  // Add a wrapper to contain the regions.
  $('.panels-responsive-admin').append('<div class="panels-responsive-admin-regions"></div>');

  // For each region in the configuration, add the required markup.
  for (key in Drupal.responsiveLayout.regionsList()) {
    Drupal.responsiveLayout.regionAddtoDom('append', key, Drupal.settings.responsiveLayout.settings.regions[key], false);
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
  $('#panels-responsive-add').click(Drupal.responsiveLayout.regionAdd);
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
  // Look at the visible regions only and gather their region keys.
  var regionsDom = $('.panels-responsive-admin-regions .region:visible');
  $(regionsDom).each(function (key, value) {
    var regionKey = $(value).data('region-key');
    regionsText += regionKey + ':' + $(value).data('region-label') + "\n";
  });
  $('#edit-layout-settings-layout-responsive-regions').val(regionsText);
}

Drupal.responsiveLayout.regionAdd = function() {
  // Get the name and label from the input fields.
  var key = $('#panels-responsive-new-region-name').val();
  $('#panels-responsive-new-region-name').val('');
  var label = $('#panels-responsive-new-region-label').val();
  $('#panels-responsive-new-region-label').val('');
  Drupal.responsiveLayout.regionAddtoDom('prepend', key, label, true);
  Drupal.responsiveLayout.regionsSave();
  return false;
}

Drupal.responsiveLayout.regionAddtoDom = function(placement, key, label, animate) {
  // Add region related markup and data.
  var regions = $('.panels-responsive-admin-regions');
  var markup = '<div class="region region-' + key + '"' + (animate ? ' style="display: none;"' : '') + '"><span class="drag-icon">&#8597;</span>' + label + '<span class="close-icon">X</span></div>';
  if (placement == 'prepend') {
    $(regions).prepend(markup);
  }
  else {
    $(regions).append(markup);
  }
  var region = $(regions).find('.region-' + key);
  $(region).data('region-key', key).data('region-label', label);
  $(region).find('.close-icon').click(Drupal.responsiveLayout.regionRemove);
  if (animate) {
    $(region).slideDown();
  }
}

})(jQuery);
