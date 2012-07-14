// Set up the application once the DOM is ready.
$(document).ready(function (event) {
  // Attach a BreakPoint editor
  var editor = new ResponsiveLayoutDesigner({'root': '#responsive-layout-designer'});
  editor.start();
});