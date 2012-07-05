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
 * Merge the main responsive plugin with a layout to create a sub plugin.
 *
 * This is used for both layout_responsive_get_sublayout and
 * layout_responsive_get_sublayouts.
 */
function layout_responsive_merge_plugin($plugin, $layout) {
  $plugin['name'] = 'responsive:' . $layout->name;
  $plugin['category'] = !empty($layout->category) ? check_plain($layout->category) : t('Miscellaneous');
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
    $default_settings = array(
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
    $settings += $default_settings;

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
  // @todo implement DOM order and wrapper rendering.
  return 'Your responsive layout rendered.';
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

  layout_responsive_merge_default_settings($settings, $layout);

  drupal_add_js($layout['path'] . '/responsive-admin.js');
  $ajaxURLs = array(
    'regions' => url($handler->get_url('layout', 'regions'), array('absolute' => TRUE)),
  );
  drupal_add_js(array('responsiveLayout' => array('settings' => $settings, 'ajaxURLs' => $ajaxURLs)), 'setting');

  // This is filled in on the client side.
  return '<div class="panels-responsive-admin"></a>';
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
    if (!is_numeric($key) && preg_match('!^([a-z0-9-])+$!', $key)) {
      $settings['regions'][$key] = $label;
    }
  }

  // Save our new state.
  panels_edit_cache_set($handler->cache);

  $handler->commands = array('ok');
}
