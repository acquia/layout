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
   * Respond to app updates.  This is generic so we don't have to 
   * a callback for each event we'd like to track during prototyping.
   */
  function ResponsiveLayoutDesignerEventHandler (event) {
    var i;
    // Log the event type.
    log(event.type, 'info');
    var args = Array.prototype.slice.call(arguments);
    // Print the args as well.
    for (i = 0; i < args.length; i++) {
      log(args[i], 'dir');
    }
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
    /* A layout is a series of overrides on a basic RegionList. */
    'steps': [
      {
        'label': 'Phone',
        'machine_name': 'small',
        'breakpoint': '0',
        'grid': 'gridpak_3',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 1
          }
        ]
      },
      {
        'label': 'Phone Landscape',
        'machine_name': 'landscape',
        'breakpoint': '240',
        'grid': 'gridpak_6',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4
          }
        ]
      },
      {
        'label': 'Tablet',
        'machine_name': 'tablet',
        'breakpoint': '320',
        'grid': 'gridpak_10',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4
          }
        ]
      },
      {
        'label': 'Desktop',
        'machine_name': 'desktop',
        'breakpoint': '720',
        'grid': 'gridpak_12',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 6
          }
        ]
      }
    ],
    'grids': [
      {
        'machine_name': 'gridpak_3',
        'columns': 3
      },
      {
        'machine_name': 'gridpak_6',
        'columns': 6
      },
      {
        'machine_name': 'gridpak_10',
        'columns': 10
      },
      {
        'machine_name': 'gridpak_12',
        'columns': 12
      }
    ]
  });
  // Register event listeners.
  editor.registerEventListener({
    'regionOrderUpdated': ResponsiveLayoutDesignerEventHandler,
    'regionClosed': ResponsiveLayoutDesignerEventHandler,
    'layoutSaved': ResponsiveLayoutDesignerEventHandler
  });
  // Insert the editor in the DOM.
  editor.build().appendTo('#responsive-layout-designer');
  window.RLDEditor = editor;
});
