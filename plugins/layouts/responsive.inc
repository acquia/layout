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

  // Form section used to support the local system.
  $form['layout_responsive_add'] = array(
    '#type' => 'fieldset',
    '#title' => t('Add a region'),
  );

  // Build a list of unused regions to provide to the user.
  $default_regions = layout_region_load_all();
  $unused_regions = array();
  foreach ($default_regions as $region) {
    if (!isset($layout_settings['regions'][$region->machine_name])) {
      $unused_regions[$region->machine_name] = $region->label;
    }
  }

  $form['layout_responsive_add']['existing_region'] = array(
    '#title' => t('Region label'),
    '#type' => 'select',
    '#options' => $unused_regions,
    '#empty_value' => '',
    '#empty_option' => t('- New region -'),
  );
  $form['layout_responsive_add']['label'] = array(
    '#title' => t('New region label'),
    '#type' => 'textfield',
    '#size' => 30,
    '#states' => array(
      'visible' => array(
        'select[name="layout_settings[layout_responsive_add][existing_region]"]' => array('value' => ''),
      ),
    ),
  );
  $form['layout_responsive_add']['machine_name'] = array(
    '#title' => t('New region machine name'),
    '#type' => 'machine_name',
    '#maxlength' => 32,
    '#machine_name' => array(
      'exists' => 'layout_region_load',
      'source' => array('layout_settings', 'layout_responsive_add', 'label'),
    ),
    '#required' => FALSE,
  );
  $form['layout_responsive_add']['button'] = array(
    '#type' => 'button',
    '#value' => t('Add region')
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

      // Enforce machine name format for security/interoperability.
      list($machine_name, $label) = explode(':', trim($region_info));
      if (!is_numeric($machine_name) && preg_match('!^([a-z0-9_-])+$!', $machine_name)) {

        // Save region for this layout.
        $layout_settings['regions'][$machine_name] = $label;

        // Save region in common regions list in case it is a new layout
        // that we did not know before or the region label was updated.
        $region = (object) array(
          'machine_name' => $machine_name,
          'label' => $label,
        );
        layout_region_save($region);
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
    // Initialize default layout options with regions we know about and three
    // most common breakpoints.
    $default_regions = layout_region_load_all();
    $settings = array(
      'regions' => array(),
      'breakpoints' => array(320 => 'Smartphone', 768 => 'Tablet', 960 => 'Standard'),
    );
    foreach ($default_regions as $region) {
      if (!$region->custom) {
        $settings['regions'][$region->machine_name] = $region->label;
      }
    }

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

  $default_regions = layout_region_load_all();
  drupal_add_js(array('responsiveLayout' => array('settings' => $settings, 'defaultRegions' => $default_regions)), 'setting');

  drupal_add_library('system', 'ui.sortable');

  // This is filled in on the client side.
  return '<div class="panels-responsive-admin"></div>';
}
