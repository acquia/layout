(function (RLD, $) {

  RLD['Utils'] = {};
  /**
   * Keymanager
   */
  RLD['Utils'].keyManager = function (event) {
    if ($.inArray(event.keyCode, event.data.keys) > -1 && typeof event.data.callback === 'function') {
      var args = arguments;
      event.data.callback.apply(this, arguments);
    }
  };
}(ResponsiveLayoutDesigner, jQuery));