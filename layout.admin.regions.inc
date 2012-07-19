<?php

/**
 * @file
 * Responsive layout builder tool administration interface.
 */

// == Region list management ==================================================

/**
 * Administration page for the region list.
 */
function layout_admin_region_list() {
  drupal_set_title(t('Responsive layouts'));
  $regions = layout_region_load_all();
  return drupal_get_form('layout_admin_region_list_form', $regions);
}

/**
 * Form callback to generate region list overview form.
 *
 * @see layout_admin_region_list_form_submit()
 */
function layout_admin_region_list_form($form, $form_state, $regions) {
  $form = array();
  $form['regions'] = array(
    '#tree' => TRUE,
  );
  foreach ($regions as $region) {

    // Build friendly list of layouts this region is used in.
    $in_use_in_layouts = array_values(layout_get_layouts_using_region($region->machine_name));
    $layout_count = count($in_use_in_layouts);
    if ($layout_count > 4) {
      // If over 4 layouts use this region, cut the list on the third and
      // mention the rest by number.
      $in_use_in_layouts = t('@list_of_layouts and @count more', array('@list_of_layouts' => join(', ', array_slice($in_use_in_layouts, 0, 3)), '@count' => $layout_count - 3));
    }
    elseif ($layout_count == 0) {
      $in_use_in_layouts = t('- None -');
    }
    else {
      // Otherwise list all layouts.
      $in_use_in_layouts = check_plain(join(', ', $in_use_in_layouts));
    }

    $form['regions'][$region->machine_name] = array(
      'label' => array(
        '#type' => 'markup',
        '#markup' => check_plain($region->label),
      ),
      'machine_name' => array(
        '#type' => 'markup',
        '#markup' => check_plain($region->machine_name),
      ),
      'in_use_in_layouts' => array(
        '#type' => 'markup',
        '#markup' => $in_use_in_layouts,
      ),
      'weight' => array(
        '#type' => 'weight',
        '#default_value' => $region->weight,
        '#delta' => count($regions),
        '#attributes' => array(
          'class' => array('layout-region-weight'),
        ),
      ),
      'default' => array(
        '#type' => 'checkbox',
        '#default_value' => !$region->custom,
      ),
    );
  }

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Save regions',
  );
  return $form;
}

/**
 * Form submission function for layout_admin_region_list().
 *
 * @see layout_admin_region_list_form()
 */
function layout_admin_region_list_form_submit($form, $form_state) {
  $regions = layout_region_load_all();
  foreach ($regions as $region) {
    $region->weight = $form_state['values']['regions'][$region->machine_name]['weight'];
    $region->custom = (int) !$form_state['values']['regions'][$region->machine_name]['default'];
    layout_region_save($region);
  }
  drupal_set_message(t('Saved all region changes.'));
}

/**
 * Theme function for region list administration page.
 *
 * @see layout_admin_region_list_form()
 * @ingroup themeable
 */
function theme_layout_admin_region_list_form($vars) {
  $form = $vars['form'];

  $header = array(
    t('Region'),
    t('In default layout'),
    t('Weight'),
    t('In use in'),
    array('colspan' => 2, 'data' => t('Operations')),
  );

  $rows = array();
  foreach (element_children($form['regions']) as $machine_name) {
    $row = array(
      drupal_render($form['regions'][$machine_name]['label']) . ' (' . drupal_render($form['regions'][$machine_name]['machine_name']) . ')',
      drupal_render($form['regions'][$machine_name]['default']),
      drupal_render($form['regions'][$machine_name]['weight']),
      drupal_render($form['regions'][$machine_name]['in_use_in_layouts']),
      l(t('edit'), 'admin/structure/panels/layouts/regions/' . $machine_name . '/edit'),
      l(t('delete'), 'admin/structure/panels/layouts/regions/' . $machine_name . '/delete'),
    );
    $rows[] = array(
      'data' => $row,
      'class' => array('draggable'),
    );
  }

  drupal_add_tabledrag('layout-regions', 'order', 'sibling', 'layout-region-weight');

  $output = theme('table', array('header' => $header, 'rows' => $rows, 'attributes' => array('id' => 'layout-regions')));
  $output .= drupal_render_children($form);

  return $output;
}

// == Region deletion =========================================================

/**
 * Page callback for region deletion.
 */
function layout_admin_region_delete($region) {
  // Set nice page title.
  drupal_set_title(t('Delete region @region', array('@region' => $region->label)));

  // Check if the region is used in any of our responsive layouts.
  $layouts = layout_get_layouts_using_region($region->machine_name);
  if (count($layouts)) {
    // If any layouts use this region, inform the user.
    $layout_list = array();
    foreach ($layouts as $name => $title) {
      $layout_list[] = l($title, 'admin/structure/panels/layouts/list/'. $name . '/edit');
    }
    drupal_set_message(t('<p>The region %region cannot be deleted because it is in use in the following layouts:</p>!layouts<p>To enable deletion of the region, either remove it from the layouts where it appears or delete them.</p>', array('%region' => $region->label, '!layouts' => theme('item_list', array('items' => $layout_list)))), 'warning');
    return '';
  }
  else {
    return drupal_get_form('layout_admin_region_delete_form', $region);
  }
}

/**
 * Form to delete a region from the common region list.
 *
 * @see layout_admin_region_delete_form_submit()
 */
function layout_admin_region_delete_form($form, $form_state, $region) {
  $form['region'] = array(
    '#type' => 'value',
    '#value' => $region,
  );
  return confirm_form(
    $form,
    t('Are you sure you want to delete the %region region?', array('%region' => $region->label)),
    'admin/structure/panels/layouts/regions',
    t('Deleting a region will make it unavailable for future layouts.'),
    t('Delete'),
    t('Cancel')
  );
}

/**
 * Form submission function to delete a region from the common region list.
 *
 * @see layout_admin_region_delete_form()
 */
function layout_admin_region_delete_form_submit($form, &$form_state) {
  layout_region_delete($form_state['values']['region']->machine_name);
  drupal_set_message(t('Region %region deleted.', array('%region' => $form_state['values']['region']->label)));
  $form_state['redirect'] = 'admin/structure/panels/layouts/regions';
}

// == Region editing and addition =============================================

/**
 * Page callback for region addition and editing.
 */
function layout_admin_region_edit($region = NULL) {
  if (empty($region)) {
    drupal_set_title(t('Add region'));
    $region = (object) array('label' => '', 'machine_name' => '', 'weight' => 0, 'custom' => 1);
  }
  else {
    drupal_set_title(t('Edit region @region', array('@region' => $region->label)));
  }
  return drupal_get_form('layout_admin_region_edit_form', $region);
}

/**
 * Region editing and addition form.
 *
 * @see layout_admin_region_edit_form_submit()
 */
function layout_admin_region_edit_form($form, $form_state, $region) {
  $form['label'] = array(
    '#title' => t('Region label'),
    '#description' => t('Name of the region visible in the layout editor.'),
    '#type' => 'textfield',
    '#default_value' => $region->label,
    '#required' => TRUE,
  );
  $form['machine_name'] = array(
    '#title' => t('Region machine name'),
    '#type' => 'machine_name',
    '#maxlength' => 32,
    '#machine_name' => array(
      'exists' => 'layout_region_load',
      'source' => array('label'),
    ),
    '#default_value' => $region->machine_name,
    '#description' => t('The region machine name is used to identify the region in layouts, when assigning panes and to apply CSS classes to the region.'),
  );
  $form['default'] = array(
    '#title' => t('In default layout'),
    '#description' => t('If checked, the region will appear in the default layout when editing new layouts. This setting will not affect existing layouts.'),
    '#type' => 'checkbox',
    '#default_value' => !$region->custom,
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save region'),
  );
  return $form;
}

/**
 * Submission handler for region editing and addition form.
 *
 * @see layout_admin_region_edit_form()
 */
function layout_admin_region_edit_form_submit($form, &$form_state) {
  $region = (object) array(
    'machine_name' => $form_state['values']['machine_name'],
    'label' => $form_state['values']['label'],
    'custom' => (int) !$form_state['values']['default'],
  );
  layout_region_save($region);
  drupal_set_message(t('Region %region saved.', array('%region' => $form_state['values']['label'])));
  $form_state['redirect'] = 'admin/structure/panels/layouts/regions';
}
