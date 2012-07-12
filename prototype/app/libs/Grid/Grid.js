(function (RLD, $) {
  RLD['Grid'] = (function () {
    
    function Grid() {
      this.$editor = $();
      this.init.apply(this, arguments);
    }
    
    Grid.prototype.init = function () {
      
    };
    
    Grid.prototype.build = function () {
      return this.$editor;
    }
    
    return Grid;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));