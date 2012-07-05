(function ($) {

Drupal.responsiveLayout = Drupal.responsiveLayout || {};

Drupal.behaviors.responsiveLayoutAdmin = {
  attach: function(context) {
    Drupal.responsiveLayout.regionsEditor();
  }
}

Drupal.responsiveLayout.regionsEditor = function() {
  var editorText = '';
  for (key in Drupal.settings.responsiveLayout.settings.regions) {
    editorText += key + ': ' + Drupal.settings.responsiveLayout.settings.regions[key] + "\n";
  }
  $('.panels-responsive-admin').append('<h4>Regions</h4><textarea id="panels-responsive-regions-editor"></textarea><button id="panels-responsive-regions-save">Save regions</button>');
  $('#panels-responsive-regions-editor').val(editorText);
  $('#panels-responsive-regions-save').click(Drupal.responsiveLayout.regionsSave);
}

Drupal.responsiveLayout.regionsSave = function() {
  var regionList = {};
  var editorLines = $('#panels-responsive-regions-editor').val().split("\n");
  for (lineNo in editorLines) {
    var regionDefinition = editorLines[lineNo].split(':', 2);
    regionList[regionDefinition[0]] = $.trim(regionDefinition[1]);
  }

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
