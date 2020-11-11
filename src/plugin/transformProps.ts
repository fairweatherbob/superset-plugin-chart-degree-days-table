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
// import memoizeOne from 'memoize-one';
import {
  DataRecord,
  // ChartProps,
  TimeseriesDataRecord,
  getTimeFormatter,
  smartDateFormatter,
  getTimeFormatterForGranularity,
  TimeFormatter,
} from '@superset-ui/core';
import DateWithFormatter from '../utils/DateWithFormatter';
import { DegreeDaysTableProps } from '../types';

const TIME_COLUMN = '__timestamp';

/*
function isTimeColumn(key: string) {
  return key === TIME_COLUMN;
}
*/

function getDateFormat(props: DegreeDaysTableProps) {
  const {
    datasource: { columnFormats },
    formData: {
      tableTimestampFormat,
      timeGrainSqla: granularity,
    },
  } = props;
  const format = columnFormats?.[TIME_COLUMN];
  const timeFormat = format || tableTimestampFormat;
  let formatter;
  if (timeFormat === smartDateFormatter.id) {
    formatter = getTimeFormatterForGranularity(granularity);
  } else {
    formatter = getTimeFormatter(timeFormat);
  }
  return formatter;
}

/*
  this is terrible but golly datetime formating in here is ultra
  complicated. Ain't nobody got time for that.
*/
function reallyLazyDateRangeFormatFix(dwithf : DateWithFormatter) {
  const datesArr = dwithf.toString().split(" — ");
  const dateObj = new Date(datesArr[0]);
  return (dateObj.getMonth()+1) + "/" + dateObj.getDate();
}

const processDataRecords = (data: DataRecord[] | undefined, dateFormatter: TimeFormatter, groupby: any[]) => {
  if (!data || !data[0]) {
    return data || [];
  }

  /*
    structure:
    [
      ["", Month:#colspan, Month2:#colspan],
      ["",Date1, Date2, Date3],
      [
        ["DMA1",HDD val, val, val...],
        ["DMA2",HDD val, val, val...],
    ]
  ]
  */
  // let monthHeaders = [];
  let dateHeaders: any[] = [];
  let dataRowsObj: any = {};

  // add labels for agg cols in first row
  dateHeaders.unshift(groupby.join(", "));
  for(let x = 0; x < data.length; x++) {
    if(!data[x] || data[x] == null) {
      continue;
    }
    const rawDate = data[x][TIME_COLUMN];
    const formattedDate = new DateWithFormatter(rawDate, { formatter: dateFormatter as TimeFormatter });
    dateHeaders.push(reallyLazyDateRangeFormatFix(formattedDate));
    /*
    Object.entries(data[x]).forEach(item => {
      if(!(item[0] in dataRowsObj))
        dataRowsObj[item[0]] = [];
      dataRowsObj[item[0]].push(item[1]);
    });
    */
    for(const key in data[x]){
      if(key == TIME_COLUMN)
        continue;
      if(!(key in dataRowsObj))
        dataRowsObj[key] = [];
      dataRowsObj[key].push(data[x][key]);
    }
  }
  return [
    dateHeaders,
    dataRowsObj,
  ];
};

export default function transformProps(chartProps: DegreeDaysTableProps) {
  /**
   * This function is called after a successful response has been
   * received from the chart data endpoint, and is used to transform
   * the incoming data prior to being sent to the Visualization.
   *
   * The transformProps function is also quite useful to return
   * additional/modified props to your data viz component. The formData
   * can also be accessed from your DegreeDaysTable.tsx file, but
   * doing supplying custom props here is often handy for integrating third
   * party libraries that rely on specific props.
   *
   * A description of properties in `chartProps`:
   * - `height`, `width`: the height/width of the DOM element in which
   *   the chart is located
   * - `formData`: the chart data request payload that was sent to the
   *   backend.
   * - `queryData`: the chart data response payload that was received
   *   from the backend. Some notable properties of `queryData`:
   *   - `data`: an array with data, each row with an object mapping
   *     the column/alias to its value. Example:
   *     `[{ col1: 'abc', metric1: 10 }, { col1: 'xyz', metric1: 20 }]`
   *   - `rowcount`: the number of rows in `data`
   *   - `query`: the query that was issued.
   *
   * Please note: the transformProps function gets cached when the
   * application loads. When making changes to the `transformProps`
   * function during development with hot reloading, changes won't
   * be seen until restarting the development server.
   */
  const {
    width,
    height,
    formData,
    queryData
  } = chartProps;

  const { boldText, headerFontSize, groupby, ddType } = formData;
  let { headerText } = formData;
  const dateFormatter = getDateFormat(chartProps);
  const data = processDataRecords(queryData.data as TimeseriesDataRecord[], dateFormatter, groupby);

  console.log('queryData in TProps:', queryData);
  console.log('formData via TransformProps.ts', formData);

  if(!headerText) {
    const { timeRange } = formData;
    headerText = "HDD by " + groupby.join(', ') + " for " + timeRange;
  }

  return {
    width,
    height,
    data,
    // and now your control data, manipulated as needed, and passed through as props!
    boldText,
    headerFontSize,
    headerText,
    ddType,
  };
}
