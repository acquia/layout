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
        'label': 'Phone Portrait',
        'machine_name': 'small',
        'breakpoint': '0',
        'grid': 'gridpak_2',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4,
            'push': 2
          }
        ]
      },
      {
        'label': 'Phone Landscape',
        'machine_name': 'landscape',
        'breakpoint': '320',
        'grid': 'gridpak_8',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4,
            'push': 2
          }
        ]
      },
      {
        'label': 'Tablet',
        'machine_name': 'tablet',
        'breakpoint': '480',
        'grid': 'gridpak_8',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4,
            'push': 2
          }
        ]
      },
      {
        'label': 'Desktop',
        'machine_name': 'desktop',
        'breakpoint': '800',
        'grid': 'gridpak_18',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4,
            'push': 2
          }
        ]
      }
    ],
    'grids': [
      {
        'machine_name': 'gridpak_1',
        'columns': 1,
        'gutter': '1%',
        'padding': '0.5%' 
      },
      {
        'machine_name': 'gridpak_2',
        'columns': 2,
        'gutter': '1%',
        'padding': '0.5%'
      },
      {
        'machine_name': 'gridpak_8',
        'columns': 8,
        'gutter': '1%',
        'padding': '0.5%'
      },
      {
        'machine_name': 'gridpak_12',
        'columns': 12,
        'gutter': '1%',
        'padding': '0.5%'
      },
      {
        'machine_name': 'gridpak_18',
        'columns': 18,
        'gutter': '1%',
        'padding': '0.5%'
      },
      {
        'machine_name': 'gridpak_24',
        'columns': 24,
        'gutter': '1%',
        'padding': '0.5%'
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
});
