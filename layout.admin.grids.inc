<?php

/**
 * @file
 * Responsive layout builder tool administration interface for grids.
 */

/**
 * Administration page for the grid list.
 */
function layout_admin_grids() {
  drupal_set_title(t('Responsive grids'));
  $grids = layout_get_grids();
  return drupal_get_form('layout_admin_grids_form', $grids);
}

/**
 * Form callback to generate basic grid editor.
 *
 * @see layout_admin_grids_form_submit()
 */
function layout_admin_grids_form($form, $form_state, $grids) {
  $form = array();
  $form['breakpoints'] = array(
    '#type' => 'container',
    '#tree' => TRUE,
  );
  foreach ($grids as $index => $grid) {
    $form['breakpoints'][$index] = array(
      '#type' => 'fieldset',
      '#title' => $grid['width'] . ' (' . $grid['label'] . ')',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
    );
    $form['breakpoints'][$index] += layout_admin_grids_form_element($grid);
    $form['breakpoints'][$index] += array(
      'remove' => array(
        '#type' => 'checkbox',
        '#title' => t('Remove breakpoint'),
      ),
    );
  }

  $form['new_breakpoint'] = array(
    '#type' => 'fieldset',
    '#title' => t('Add new breakpoint'),
    '#tree' => TRUE,
  );
  $form['new_breakpoint'] += layout_admin_grids_form_element();

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Save grids',
  );
  return $form;
}

/**
 * Form component for one breakpoint/grid configuration.
 */
function layout_admin_grids_form_element($grid = array()) {
  $form = array();
  $form['label'] = array(
    '#type' => 'textfield',
    '#title' => t('Breakpoint label'),
    '#description' => t("Examples: smartphone, tablet, desktop"),
    '#default_value' => @$grid['label']
  );
  $form['width'] = array(
    '#type' => 'textfield',
    '#title' => t('Breakpoint'),
    '#description' => t("Width point where this grid is applied."),
    '#default_value' => @$grid['width']
  );
  $form['css'] = array(
    '#type' => 'textarea',
    '#title' => t('Grid CSS'),
    '#description' => t("CSS to describe the grid applied to this breakpoint."),
    '#default_value' => @$grid['css']
  );
  return $form;
}

/**
 * Form submission function for layout_admin_grids_form().
 *
 * @see layout_admin_grids_form()
 */
function layout_admin_grids_form_submit($form, $form_state) {
  $new_grids = array();
  if (isset($form_state['values']['breakpoints'])) {
    $new_grids = $form_state['values']['breakpoints'];
  }
  if (!empty($form_state['values']['new_breakpoint']['width'])) {
    $new_grids[] = $form_state['values']['new_breakpoint'];
  }

  // Remove any grids that have the remove checkbox checked
  $grids = array();
  foreach ($new_grids as $index => $grid) {
    if (empty($grid['remove'])) {
      $grids[] = $grid;
    }
  }

  // Sort the grids by width.
  usort($grids, 'layout_admin_grids_sort');

  // Save grids.
  layout_set_grids(array_values($grids));

  drupal_set_message(t('Saved all grid changes.'));
}

/**
 * Sort the grids in ascending order by their width.
 */
function layout_admin_grids_sort($a, $b) {
  // Cast the width to int. Whether it provided as px or em, the cast should
  // result in a relevant number. It will not sort mixed em/px numbers properly
  // but that sounds like a broken setup. Not desigining for that.
  if ((int) $a['width'] == (int) $b['width']) {
    return 0;
  }
  return ((int) $a['width'] < (int) $b['width']) ? -1 : 1;
}
