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
    $form['regions'][$region->machine_name] = array(
      'label' => array(
        '#type' => 'markup',
        '#markup' => check_plain($region->label),
      ),
      'machine_name' => array(
        '#type' => 'markup',
        '#markup' => check_plain($region->machine_name),
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
    array('colspan' => 2, 'data' => t('Operations')),
  );

  $rows = array();
  foreach (element_children($form['regions']) as $machine_name) {
    $row = array(
      drupal_render($form['regions'][$machine_name]['label']) . ' (' . drupal_render($form['regions'][$machine_name]['machine_name']) . ')',
      drupal_render($form['regions'][$machine_name]['default']),
      drupal_render($form['regions'][$machine_name]['weight']),
      l(t('edit'), 'admin/appearance/layouts/regions/' . $machine_name . '/edit'),
      l(t('delete'), 'admin/appearance/layouts/regions/' . $machine_name . '/delete'),
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
    'admin/appearance/layouts',
    t('Deleting a region will remove it from future layouts. Existing layouts where the region appears might add the region back when edited.'),
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
  $form_state['redirect'] = 'admin/appearance/layouts';
}

// == Region editing and addition =============================================

/**
 * Region editing and addition form.
 *
 * @see layout_admin_region_edit_form_submit()
 */
function layout_admin_region_edit_form($form, $form_state, $region = NULL) {
  $form['label'] = array(
    '#title' => t('Region label'),
    '#description' => t('Name of the region visible in the layout editor.'),
    '#type' => 'textfield',
    '#default_value' => isset($region->label) ? $region->label : '',
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
    '#default_value' => isset($region->machine_name) ? $region->machine_name : '',
  );
  $form['default'] = array(
    '#title' => t('In default layout'),
    '#description' => t('If checked, the region will appear in the default layout when editing new layouts. This setting will not affect existing layouts.'),
    '#type' => 'checkbox',
    '#default_value' => isset($region->custom) ? !$region->custom : 0,
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
  $form_state['redirect'] = 'admin/appearance/layouts';
}
