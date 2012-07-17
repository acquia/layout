// Set up the application once the DOM is ready.
$(document).ready(function (event) {

  /**
   * Safe logging function.
   */
  function log (message, type) {
    if ('console' in window) {
      var type = type || 'log';
      if (type in console) {
        console[type](message);
      }
    }
  }
  /**
   * Respond to Region List updates.
   */
  function updateRegionList (event, RegionSet) {
    log(event, 'dir');
    log(RegionSet, 'dir');
  }
  /**
   * Respond to Close Region action.
   */
  function closeRegion (event, Region) {
    log(event, 'dir');
    log(Region, 'dir');
  }

  // Attach a BreakPoint editor
  var editor = new ResponsiveLayoutDesigner({
    'regions': {
      'body': "Body",
      'footer_a': "Footer A",
      'footer_b': "Footer B",
      'footer_c': "Footer C",
      'header_a': "Header A",
      'header_b': "Header B",
      'header_c': "Header C",
      'navigation': "Navigation",
      'sidebar_a': "Sidebar A",
      'sidebar_b': "Sidebar B",
      'sidebar_c': "Sidebar C",
      'subheader_a': "Subheader A",
      'subheader_b': "Subheader B",
      'subheader_c': "Subheader C",
      'title': "Title"
    },
    /* A layout is a series of overrides on a basic RegionSet. */
    'layouts': [
      {
        'name': 'Default',
        'machine-name': 'default',
        'step': {
          'breakpoint': '0',
          'label': 'small'
        },
        'layout': {
        },
        'grid': {}
      },
      {
        'name': 'default',
        'machine-name': 'default',
        'step': {
          'breakpoint': '28em',
          'label': 'landscape'
        },
        'layout': {},
        'grid': {}
      },
      {
        'name': 'default',
        'machine-name': 'default',
        'step': {
          'breakpoint': '41em',
          'label': 'tablet'
        },
        'layout': {},
        'grid': {}
      },
      {
        'name': 'default',
        'machine-name': 'default',
        'step': {
          'breakpoint': '56em',
          'label': 'desktop'
        },
        'layout': {},
        'grid': {}
      },
      {
        'name': 'default',
        'machine-name': 'default',
        'step': {
          'breakpoint': '64em',
          'label': 'large'
        },
        'layout': {},
        'grid': {}
      }
    ]
  });
  // Start the responsive layout editor.
  editor.start();
  // Register event listeners.
  editor.registerEventListener({
    'regionOrderUpdated': updateRegionList,
    'regionClosed': closeRegion
  });
  // Insert the editor in the DOM.
  editor.build().appendTo('#responsive-layout-designer');
});
