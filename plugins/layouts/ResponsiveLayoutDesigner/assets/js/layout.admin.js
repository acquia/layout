// Set up the application once the DOM is ready.
(function ($) {
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

  // Build a BreakPoint editor
  var editor = new ResponsiveLayoutDesigner({
    'regions': [
      {
        'machine_name': 'header_a',
        'label': 'Header A'
      },
      {
        'machine_name': 'header_b',
        'label': "Header B"
      },
      {
        'machine_name': 'header_c',
        'label': 'Header C'
      },
      {
        'machine_name': 'navigation',
        'label': 'Navigation'
      },
      {
        'machine_name': 'sidebar_a',
        'label': 'Sidebar A'
      },
      {
        'machine_name': 'body',
        'label': 'Body'
      },
      {
        'machine_name': 'sidebar_b',
        'label': 'Sidebar B'
      },
      {
        'machine_name': 'footer_a',
        'label': 'Footer A'
      },
      {
        'machine_name': 'footer_b',
        'label': 'Footer B'
      },
      {
        'machine_name': 'footer_c',
        'label': 'Footer C'
      }
    ],
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
          },
          {
            'machine_name': 'header_b',
            'columns': 2
          },
          {
            'machine_name': 'header_c',
            'columns': 2
          },
          {
            'machine_name': 'navigation',
            'columns': 1
          }
        ]
      },
      {
        'label': 'Phone Landscape',
        'machine_name': 'landscape',
        'breakpoint': '320',
        'grid': 'gridpak_6',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4
          },
          {
            'machine_name': 'header_b',
            'columns': 2
          }
        ]
      },
      {
        'label': 'Tablet',
        'machine_name': 'tablet',
        'breakpoint': '720',
        'grid': 'gridpak_10',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4
          },
          {
            'machine_name': 'header_b',
            'columns': 4
          },
          {
            'machine_name': 'header_c',
            'columns': 2
          }
        ]
      },
      {
        'label': 'Desktop',
        'machine_name': 'desktop',
        'breakpoint': '940',
        'grid': 'gridpak_12',
        'regions':[
          {
            'machine_name': 'header_a',
            'columns': 4
          },
          {
            'machine_name': 'header_b',
            'columns': 4
          },
          {
            'machine_name': 'header_c',
            'columns': 4
          },
          {
            'machine_name': 'sidebar_a',
            'columns': 2
          },
          {
            'machine_name': 'body',
            'columns': 8
          },
          {
            'machine_name': 'sidebar_b',
            'columns': 2
          }
        ]
      }
    ],
    'grids': [
      {
        'machine_name': 'gridpak_3',
        'columns': 3,
        'classes': [
          'rld-container-3'
        ]
      },
      {
        'machine_name': 'gridpak_6',
        'columns': 6,
        'classes': [
          'rld-container-6'
        ]
      },
      {
        'machine_name': 'gridpak_10',
        'columns': 10,
        'classes': [
          'rld-container-10'
        ]
      },
      {
        'machine_name': 'gridpak_12',
        'columns': 12,
        'classes': [
          'rld-container-12'
        ]
      }
    ]
  });
  // Register event listeners.
  editor.registerEventListener({
    'regionOrderUpdated': ResponsiveLayoutDesignerEventHandler,
    'layoutSaved': ResponsiveLayoutDesignerEventHandler,
    'regionRemoved': ResponsiveLayoutDesignerEventHandler,
    'regionAdded': ResponsiveLayoutDesignerEventHandler,
    'regionResized': ResponsiveLayoutDesignerEventHandler,
    'regionResizing': ResponsiveLayoutDesignerEventHandler,
    'regionResizeStarted': ResponsiveLayoutDesignerEventHandler
  });
  // Insert the editor in the DOM.
  editor.build().appendTo('#responsive-layout-designer');
  window.RLDEditor = editor;
});
}(jQuery));