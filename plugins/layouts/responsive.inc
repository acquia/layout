<?php

/**
 * @file
 * Responsive layout builder for Panels.
 */

$plugin = array(
  'title' => t('Responsive'),
  'category' => t('Builders'),
  'icon' => 'responsive.png',
  'theme' => 'layout_responsive',
  'admin theme' => 'layout_responsive_admin',
  'css' => 'responsive.css',
  'admin css' => 'responsive-admin.css',
  'regions function' => 'layout_responsive_panels',
  'settings form' => 'layout_responsive_settings_form',
  'settings submit' => 'layout_responsive_settings_form_submit',

  // Reusable layout Builder specific directives.
  'builder' => TRUE,
  'builder tab title' => 'Add responsive layout',

  // Sublayout code almost exactly copied from flexible layouts.
  'get child' => 'layout_responsive_get_sublayout',
  'get children' => 'layout_responsive_get_sublayouts',

  // Define ajax callbacks.
  'ajax' => array(
    'regions' => 'layout_ajax_responsive_edit_regions',
  ),
);

/**
 * Form callback. Add our form elements for data interchange.
 */
function layout_responsive_settings_form($display, $layout, $layout_settings) {
  $form = array();
  layout_responsive_merge_default_settings($layout_settings, $layout);
  $regions_text = '';
  foreach ($layout_settings['regions'] as $machine_name => $label) {
    $regions_text .= $machine_name . ':' . $label . "\n";
  }
  $form['layout_responsive_regions'] = array(
    '#type' => 'textarea',
    '#title' => t('Regions in order of appearance'),
    '#default_value' => $regions_text,
  );
  return $form;
}

/**
 * Form submission. Process the changes to the layout.
 */
function layout_responsive_settings_form_submit(&$layout_settings, $display, $layout, $old_layout_settings) {
  // Get region list and overwrite the whole settings array. This will later
  // be saved by Panels to the display layout settings.
  $region_list = explode("\n", $layout_settings['layout_responsive_regions']);
  $layout_settings = array('regions' => array());

  foreach ($region_list as $region_info) {
    $region_info = trim($region_info);
    if (!empty($region_info)) {
      list($key, $label) = explode(':', trim($region_info));
      // Ensure key is a machine name. For security.
      if (!is_numeric($key) && preg_match('!^([a-z0-9_-])+$!', $key)) {
        $layout_settings['regions'][$key] = $label;
      }
    }
  }
}

/**
 * Merge the main responsive plugin with a layout to create a sub plugin.
 *
 * This is used for both layout_responsive_get_sublayout and
 * layout_responsive_get_sublayouts.
 */
function layout_responsive_merge_plugin($plugin, $layout) {
  $plugin['name'] = 'responsive:' . $layout->name;
  $plugin['category'] = !empty($layout->category) ? check_plain($layout->category) : t('Responsive');
  $plugin['title'] = check_plain($layout->admin_title);
  $plugin['description'] = check_plain($layout->admin_description);
  $plugin['layout'] = $layout;
  $plugin['builder'] = FALSE;
  $plugin['builder tab title'] = NULL;
  return $plugin;
}

/**
 * Callback to provide a single stored responsive layout.
 */
function layout_responsive_get_sublayout($plugin, $layout_name, $sublayout_name) {
  // Do not worry about caching; Panels is handling that for us.
  ctools_include('export');
  $item = ctools_export_crud_load('panels_layout', $sublayout_name);
  if ($item) {
    return layout_responsive_merge_plugin($plugin, $item);
  }
}

/**
 * Callback to provide all stored responsive layouts.
 */
function layout_responsive_get_sublayouts($plugin, $layout_name) {
  $layouts[$layout_name] = $plugin;
  ctools_include('export');
  $items = ctools_export_load_object('panels_layout', 'conditions', array('plugin' => 'responsive'));
  foreach ($items as $name => $item) {
    $layouts['responsive:' . $name] = layout_responsive_merge_plugin($plugin, $item);
  }

  return $layouts;
}

/**
 * Return the actual list of regions for this responsive panel.
 */
function layout_responsive_panels($display, $settings, $layout) {
  $items = array();
  layout_responsive_merge_default_settings($settings, $layout);
  return $settings['regions'];
}

/**
 * Merge current settings with defualt settings.
 */
function layout_responsive_merge_default_settings(&$settings, &$layout) {
  // This indicates that this is a layout that they used the checkbox
  // on. The layout is still 'flexible' but it's actually pointing
  // to another stored one and we have to load it.
  if (!empty($settings['layout'])) {
    $layout = panels_get_layout('responsive:' . $settings['layout']);
  }

  if (!empty($layout['layout'])) {
    $settings = $layout['layout']->settings;
    if ($settings) {
      return $settings;
    }
  }

  if (empty($settings)) {
    $settings = array(
      'regions' => array(
        'header-a' => 'Header A',
        'header-b' => 'Header B',
        'header-c' => 'Header C',
        'subheader-a' => 'Subheader A',
        'subheader-b' => 'Subheader B',
        'subheader-c' => 'Subheader C',
        'navigation' => 'Navigation',
        'title' => 'Title',
        'body' => 'Body',
        'sidebar-a' => 'Sidebar A',
        'sidebar-b' => 'Sidebar B',
        'sidebar-c' => 'Sidebar C',
        'footer-a' => 'Footer A',
        'footer-b' => 'Footer B',
        'footer-c' => 'Footer C'
      ),
      'breakpoints' => array(320 => 'Smartphone', 768 => 'Tablet', 960 => 'Standard'),
    );

    // A layout is a region key => grid class map.
    // @todo make nesting possible.
    $default_layout = array();
    foreach($settings['regions'] as $key => $name) {
      // @todo figure out the proper grid class.
      $default_layout[$key] = 'grid-full';
    }

    // Save list of regions related to their grid classes in each layout.
    foreach($settings['breakpoints'] as $px => $name) {
      if (!isset($settings['layouts'][$px])) {
        // If this layout is not there, apply the
        $settings['layouts'][$px] = $default_layout;
      }
    }
  }

  return $settings;
}

/**
 * Draw the responsive layout.
 */
function theme_layout_responsive($vars) {
  $css_id = $vars['css_id'];
  $content = $vars['content'];
  $settings = $vars['settings'];
  $display = $vars['display'];
  $layout = $vars['layout'];
  $handler = $vars['renderer'];

  layout_responsive_merge_default_settings($settings, $layout);

  // Just return the regions ordered as configured.
  $output = join('', $content);
  return '<div class="panel-responsive">' . $output . '</div>';
}

/**
 * Draw the responsive layout admin interface.
 */
function theme_layout_responsive_admin($vars) {
  $css_id = $vars['css_id'];
  $content = $vars['content'];
  $settings = $vars['settings'];
  $display = $vars['display'];
  $layout = $vars['layout'];
  $handler = $vars['renderer'];

  // We never draw stored responsive layouts in admin mode; they must be edited
  // from the stored layout UI at that point. This can happen if the layout is
  // displayed in an admin context, but not to administer the layout per say but
  // to administer other thigns on top of the layout, such as rearranging panes
  // when switching layouts or when adding new panes.
  if (!empty($layout['layout'])) {
    return theme_layout_responsive(array('css_id' => $css_id, 'content' => $content, 'settings' => $settings, 'display' => $display, 'layout' => $layout, 'renderer' => $handler));
  }

  layout_responsive_merge_default_settings($settings, $layout);

  drupal_add_js($layout['path'] . '/responsive-admin.js');
  $ajaxURLs = array(
    'regions' => url($handler->get_url('layout', 'regions'), array('absolute' => TRUE)),
  );
  drupal_add_js(array('responsiveLayout' => array('settings' => $settings, 'ajaxURLs' => $ajaxURLs)), 'setting');
  drupal_add_library('system', 'ui.sortable');

  // This is filled in on the client side.
  return '<div class="panels-responsive-admin"></div>';
}

/**
 * AJAX responder to store udpated region list.
 */
function layout_ajax_responsive_edit_regions($handler) {
  ctools_include('ajax');
  $settings = &$handler->display->layout_settings;
  layout_responsive_merge_default_settings($settings, $handler->plugins['layout']);

  $settings['regions'] = array();
  foreach ($_POST['regions'] as $key => $label) {
    // Ensure key is a machine name. For security.
    if (!is_numeric($key) && preg_match('!^([a-z0-9_-])+$!', $key)) {
      $settings['regions'][$key] = $label;
    }
  }

  // Save our new state.
  panels_edit_cache_set($handler->cache);

  $handler->commands = array('ok');
}
