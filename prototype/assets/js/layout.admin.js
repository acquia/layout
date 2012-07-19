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
    'steps': {
      'small': {
        'name': 'Phone Portrait',
        'breakpoint': '0',
        'grid': '2',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4,
            'push': 2
          }
        ]
      },
      'landscape': {
        'name': 'Phone Landscape',
        'breakpoint': '320',
        'grid': '2',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4,
            'push': 2
          }
        ]
      },
      'tablet': {
        'name': 'Tablet',
        'breakpoint': '480',
        'grid': '2',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4,
            'push': 2
          }
        ]
      },
      'desktop': {
        'name': 'Desktop',
        'breakpoint': '800',
        'grid': '2',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4,
            'push': 2
          }
        ]
      }
    },
    'grids': {
      '1': {
        'scope': 'columns-1'
      },
      '2': {
        'scope': 'columns-2'
      },
      '8': {
        'scope': 'columns-8'
      },
      '12': {
        'scope': 'columns-12'
      },
      '16': {
        'scope': 'columns-18'
      },
      '24': {
        'scope': 'columns-24'
      }
    }
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
