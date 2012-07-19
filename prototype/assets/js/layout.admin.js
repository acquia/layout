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
    'regionOrderUpdated': updateRegionList,
    'regionClosed': closeRegion
  });
  // Insert the editor in the DOM.
  editor.build().appendTo('#responsive-layout-designer');
});
