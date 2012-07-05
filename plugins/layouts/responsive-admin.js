(function ($) {

Drupal.responsiveLayout = Drupal.responsiveLayout || {};

Drupal.behaviors.responsiveLayoutAdmin = {
  attach: function(context) {
    Drupal.responsiveLayout.regionsEditorInit();
  }
}

Drupal.responsiveLayout.regionsEditorInit = function() {
  // Add a tiny form section to allow for inline region addition.
  $('.panels-responsive-admin').append('<fieldset><label for="panels-responsive-new-region-name">New region machine name</label><input id="panels-responsive-new-region-name"><label for="panels-responsive-new-region-label">New region label</label><input id="panels-responsive-new-region-label"><button id="panels-responsive-add">Add region</button></fieldset>');

  // Add a wrapper to contain the regions.
  $('.panels-responsive-admin').append('<div class="panels-responsive-admin-regions"></div>');

  // For each region in the configuration, add the required markup.
  for (key in Drupal.settings.responsiveLayout.settings.regions) {
    Drupal.responsiveLayout.regionAddtoDom('append', key, Drupal.settings.responsiveLayout.settings.regions[key]);
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
  var regionList = {};
  // Look at the visible regions only and gather their region keys.
  var regionsDom = $('.panels-responsive-admin-regions .region:visible');
  $(regionsDom).each(function (key, value) {
    var regionKey = $(value).data('region-key');
    regionList[regionKey] = $(value).data('region-label');
  });

  var element_settings = {
    url: Drupal.settings.responsiveLayout.ajaxURLs.regions,
    event: 'UpdateResponsiveRegions',
    keypress: false,
    // No throbber at all.
    progress: { 'type': 'none' }
  };
  Drupal.ajax['panels-responsive-regions-ajax'] = new Drupal.ajax('panels-responsive-regions-ajax', $('.panels-responsive-admin').get(0), element_settings);
  Drupal.ajax['panels-responsive-regions-ajax'].options.data = {
    'regions': regionList,
  };
  $('.panels-responsive-admin').trigger('UpdateResponsiveRegions');
}

Drupal.responsiveLayout.regionAdd = function() {
  // Get the name and label from the input fields.
  var key = $('#panels-responsive-new-region-name').val();
  var label = $('#panels-responsive-new-region-label').val();
  Drupal.responsiveLayout.regionAddtoDom('prepend', key, label);
  Drupal.responsiveLayout.regionsSave();
  return false;
}

Drupal.responsiveLayout.regionAddtoDom = function(placement, key, label) {
  // Add region related markup and data.
  var markup = '<div class="region region-' + key + '"><span class="drag-icon">&#8597;</span>' + label + '<span class="close-icon">X</span></div>';
  if (placement == 'prepend') {
    $('.panels-responsive-admin-regions').prepend(markup);
  }
  else {
    $('.panels-responsive-admin-regions').append(markup);
  }
  $('.panels-responsive-admin-regions .region-' + key).data('region-key', key);
  $('.panels-responsive-admin-regions .region-' + key).data('region-label', label);
}

})(jQuery);
