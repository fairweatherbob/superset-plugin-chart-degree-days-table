"use strict";

exports.__esModule = true;
exports.default = exports.QueryMode = exports.PAGE_SIZE_OPTIONS = void 0;

var _core = require("@superset-ui/core");

var _chartControls = require("@superset-ui/chart-controls");

/* eslint-disable camelcase */

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// import React from 'react';
const PAGE_SIZE_OPTIONS = (0, _chartControls.formatSelectOptions)([[0, (0, _core.t)('page_size.all')], 10, 20, 50, 100, 200]);
exports.PAGE_SIZE_OPTIONS = PAGE_SIZE_OPTIONS;
let QueryMode;
exports.QueryMode = QueryMode;

(function (QueryMode) {
  QueryMode["aggregate"] = "aggregate";
  QueryMode["raw"] = "raw";
})(QueryMode || (exports.QueryMode = QueryMode = {}));

function getQueryMode(controls) {
  return 'aggregate';
  /*
  // const mode = controls?.query_mode?.value;
  const mode = 'aggregate';
  if (mode === QueryMode.aggregate || mode === QueryMode.raw) {
    return mode as QueryMode;
  }
  const rawColumns = controls?.all_columns?.value;
  const hasRawColumns = rawColumns && (rawColumns as string[])?.length > 0;
  return hasRawColumns ? QueryMode.raw : QueryMode.aggregate;
  */
}
/**
 * Visibility check
 */


function isQueryMode(mode) {
  return ({
    controls
  }) => {
    return getQueryMode(controls) === mode;
  };
}

const isAggMode = isQueryMode(QueryMode.aggregate);
const ddType = {
  type: 'RadioButtonControl',
  label: (0, _core.t)('Degree Day Type'),
  default: 'hdd',
  options: [{
    label: 'HDD',
    value: 'hdd'
  }, {
    label: 'CDD',
    value: 'cdd'
  }]
};
const config = {
  controlPanelSections: [{
    label: (0, _core.t)('Degree Day Type'),
    expanded: true,
    controlSetRows: [[{
      name: 'dd_type',
      config: ddType
    }], [{
      name: 'groupby',
      override: {
        visibility: isAggMode
      }
    }], [{
      name: 'metrics',
      override: {
        validators: [],
        visibility: isAggMode
      }
    }], [{
      name: 'timeseries_limit_metric',
      override: {
        visibility: isAggMode
      }
    }], ['row_limit'], [{
      name: 'order_desc',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Sort Descending'),
        default: true,
        description: (0, _core.t)('Whether to sort descending or ascending'),
        visibility: isAggMode
      }
    }], ['adhoc_filters']]
  }, {
    label: (0, _core.t)('Options'),
    expanded: true,
    controlSetRows: [[{
      name: 'table_timestamp_format',
      config: {
        type: 'SelectControl',
        freeForm: true,
        label: (0, _core.t)('Table Timestamp Format'),
        default: _core.smartDateFormatter.id,
        renderTrigger: true,
        validators: [_core.validateNonEmpty],
        clearable: false,
        choices: _chartControls.D3_TIME_FORMAT_OPTIONS,
        description: (0, _core.t)('Timestamp Format')
      }
    }], [{
      name: 'page_length',
      config: {
        type: 'SelectControl',
        freeForm: true,
        renderTrigger: true,
        label: (0, _core.t)('Page Length'),
        default: null,
        choices: PAGE_SIZE_OPTIONS,
        description: (0, _core.t)('Rows per page, 0 means no pagination')
      }
    }, null], [{
      name: 'include_search',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Search Box'),
        renderTrigger: true,
        default: false,
        description: (0, _core.t)('Whether to include a client-side search box')
      }
    }, {
      name: 'table_filter',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Emit Filter Events'),
        renderTrigger: true,
        default: false,
        description: (0, _core.t)('Whether to apply filter to dashboards when table cells are clicked')
      }
    }], [{
      name: 'align_pn',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Align +/-'),
        renderTrigger: true,
        default: false,
        description: (0, _core.t)('Whether to align the background chart for +/- values')
      }
    }, {
      name: 'color_pn',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Color +/-'),
        renderTrigger: true,
        default: true,
        description: (0, _core.t)('Whether to color +/- values')
      }
    }], [{
      name: 'show_cell_bars',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show Cell Bars'),
        renderTrigger: true,
        default: true,
        description: (0, _core.t)('Enable to display bar chart background elements in table columns')
      }
    }, null]]
  }],
  sectionOverrides: {
    druidTimeSeries: {
      controlSetRows: [['granularity', 'druid_time_origin'], ['time_range']]
    },
    sqlaTimeSeries: {
      controlSetRows: [['granularity_sqla', 'time_grain_sqla'], ['time_range']]
    }
  }
};
var _default = config;
exports.default = _default;