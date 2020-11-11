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
import React, { useEffect, createRef } from 'react';
import { styled } from '@superset-ui/core';
import { DegreeDaysTableProps, DegreeDaysTableStylesProps } from './types';

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

// background-color: ${({ theme }) => theme.colors.secondary.light2};
const Styles = styled.div<DegreeDaysTableStylesProps>`
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  h3 {
    /* You can use your props to control CSS! */
    font-size: ${({ theme, headerFontSize }) => theme.typography.sizes[headerFontSize]};
    font-weight: ${({ theme, boldText }) => theme.typography.weights[boldText ? 'bold' : 'normal']};
  }
  table td.dd-val { text-align: center; }
  td.dd-none { background-color: #e5e3e4; }
  td.cdd-low { background-color: #a4c6fd; }
  td.cdd-mild { background-color: #6891f7; }
  td.cdd-high { background-color: #1a02c3; }
  td.cdd-vhigh { background-color: #080066; }
  td.hdd-low { background-color: #facfd0; }
  td.hdd-mild { background-color: #f78f92; }
  td.hdd-high { background-color: #f50809; }
  td.hdd-vhigh { background-color: #a70000; }
`;

function tableBuilder(data: any[], ddType: string) {
  // leave blank left cell for geo label
  let output = "<table class='table table-striped table-condensed' style='table-layout:fixed;'><thead><tr>";
  for(let i = 0; i < data[0].length; i++) {
    output += "<th>"+data[0][i]+"</th>";
  }
  output += "</tr></thead><tbody>";
  for(const rowKey in data[1]) {
    output += "<tr><td>" + rowKey + "</td>";
    for(let n = 0; n < data[1][rowKey].length; n++){
      // test value and use proper style
      let classes = ['dd-val'];
      const ddVal = data[1][rowKey][n];
      if(ddVal == 0)
        classes.push('dd-none');
      else if(ddVal <= 10)
        classes.push(ddType+'-low');
      else if(ddVal <= 20)
        classes.push(ddType+'-mild');
      else if(ddVal <= 25)
        classes.push(ddType+'-high');
      else
        classes.push(ddType+'-vhigh');

      output += "<td class='"+classes.join(' ')+"'>" + ddVal + "</td>";
    }
    output += "</tr>";
  }
  output += "</tbody></table>"
  return output;
}

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function DegreeDaysTable(props: DegreeDaysTableProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width, ddType } = props;

  const rootElem = createRef<HTMLDivElement>();

  // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    const root = rootElem.current as HTMLElement;
    console.log('Plugin element', root);
  });

  console.log('Plugin props', props);
  const tableHTML = tableBuilder(data, ddType);
  const outerDivStyle = {
    height,
    overflow: "auto",
  };
  // <pre>${JSON.stringify(data, null, 2)}</pre>
  // <h3>{props.headerText}</h3>
  return (
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      height={height}
      width={width}
    >
      <div style={outerDivStyle} dangerouslySetInnerHTML={{__html: tableHTML}} />
    </Styles>
  );
}
