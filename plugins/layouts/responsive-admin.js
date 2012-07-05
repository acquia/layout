(function ($) {

Drupal.responsiveLayout = Drupal.responsiveLayout || {};

Drupal.behaviors.responsiveLayoutAdmin = {
  attach: function(context) {
    Drupal.responsiveLayout.regionsEditor();
  }
}

Drupal.responsiveLayout.regionsEditor = function() {
  $('.panels-responsive-admin').append('<fieldset><label for="panels-responsive-new-region-name">New region machine name</label><input id="panels-responsive-new-region-name"><label for="panels-responsive-new-region-label">New region label</label><input id="panels-responsive-new-region-label"><button id="panels-responsive-add">Add regions</button></fieldset>');
  $('.panels-responsive-admin').append('<div class="panels-responsive-admin-regions"></div>');
  for (key in Drupal.settings.responsiveLayout.settings.regions) {
    $('.panels-responsive-admin-regions').append('<div class="region region-' + key + '"><span class="drag-icon">&#8597;</span>' + Drupal.settings.responsiveLayout.settings.regions[key] + '<span class="close-icon">X</span></div>');
    $('.panels-responsive-admin-regions .region-' + key).data('region-key', key);
    $('.panels-responsive-admin-regions .region-' + key).data('region-label', Drupal.settings.responsiveLayout.settings.regions[key]);
  }
  $('.panels-responsive-admin').append('<button id="panels-responsive-save">Save regions</button>');

  // Initialize sortable widget.
  $('.panels-responsive-admin-regions').sortable({
      // Make a placeholder visible when dragging.
      placeholder: "ui-state-highlight",
  });
  $('.panels-responsive-admin-regions').disableSelection();

  $('.panels-responsive-admin-regions .region .close-icon').click(Drupal.responsiveLayout.regionRemove);
  $('#panels-responsive-save').click(Drupal.responsiveLayout.regionsSave);
  $('#panels-responsive-add').click(Drupal.responsiveLayout.regionAdd);
  //$('#panels-responsive-regions-save').click(Drupal.responsiveLayout.regionsSave);
}

Drupal.responsiveLayout.regionRemove = function() {
  // Slide up the region when the close button is clicked. This will hide it
  // from view and will make it not being saved later.
  $(this).parent().slideUp();
}

Drupal.responsiveLayout.regionsSave = function() {
  var regionList = {};
  // Look at the visible regions only and gather theire region keys.
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
  return false;
}

Drupal.responsiveLayout.regionAdd = function() {
  var key = $('#panels-responsive-new-region-name').val();
  var label = $('#panels-responsive-new-region-label').val();
  $('.panels-responsive-admin-regions').prepend('<div class="region region-' + key + '"><span class="drag-icon">&#8597;</span>' + label + '<span class="close-icon">X</span></div>');
  $('.panels-responsive-admin-regions .region-' + key).data('region-key', key);
  $('.panels-responsive-admin-regions .region-' + key).data('region-label', label);
  return false;
}

})(jQuery);
