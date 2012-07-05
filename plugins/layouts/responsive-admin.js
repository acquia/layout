(function ($) {

Drupal.responsiveLayout = Drupal.responsiveLayout || {};

Drupal.behaviors.responsiveLayoutAdmin = {
  attach: function(context) {
    Drupal.responsiveLayout.regionsEditor();
  }
}

Drupal.responsiveLayout.regionsEditor = function() {
  $('.panels-responsive-admin').append('<button id="panels-responsive-save">Save regions</button>');
  for (key in Drupal.settings.responsiveLayout.settings.regions) {
    $('.panels-responsive-admin').append('<div class="region region-' + key + '"><span class="drag-icon">&#8597;</span>' + Drupal.settings.responsiveLayout.settings.regions[key] + '<span class="close-icon">X</span></div>');
    $('.panels-responsive-admin .region-' + key).data('region-key', key);
  }

  // Initialize sortable widget.
  $('.panels-responsive-admin').sortable({
      // Make a placeholder visible when dragging.
      placeholder: "ui-state-highlight",
  });
  $('.panels-responsive-admin').disableSelection();

  $('.panels-responsive-admin .region .close-icon').click(Drupal.responsiveLayout.regionRemove);
  $('#panels-responsive-save').click(Drupal.responsiveLayout.regionsSave);
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
  var regionsDom = $('.panels-responsive-admin .region:visible');
  $(regionsDom).each(function (key, value) {
    var regionKey = $(value).data('region-key');
    regionList[regionKey] = Drupal.settings.responsiveLayout.settings.regions[regionKey];
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

})(jQuery);
