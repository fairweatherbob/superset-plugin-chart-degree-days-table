"use strict";

exports.__esModule = true;
exports.default = DegreeDaysTable;

var _react = _interopRequireWildcard(require("react"));

var _core = require("@superset-ui/core");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _templateObject() {
  const data = _taggedTemplateLiteralLoose(["\n  padding: ", "px;\n  border-radius: ", "px;\n  height: ", ";\n  width: ", ";\n  h3 {\n    /* You can use your props to control CSS! */\n    font-size: ", ";\n    font-weight: ", ";\n  }\n  table td.dd-val { text-align: center; }\n  td.dd-none { background-color: #e5e3e4; }\n  td.cdd-low { background-color: #a4c6fd; }\n  td.cdd-mild { background-color: #6891f7; }\n  td.cdd-high { background-color: #1a02c3; }\n  td.cdd-vhigh { background-color: #080066; }\n  td.hdd-low { background-color: #facfd0; }\n  td.hdd-mild { background-color: #f78f92; }\n  td.hdd-high { background-color: #f50809; }\n  td.hdd-vhigh { background-color: #a70000; }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled
// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts
// background-color: ${({ theme }) => theme.colors.secondary.light2};
const Styles = _core.styled.div(_templateObject(), ({
  theme
}) => theme.gridUnit * 4, ({
  theme
}) => theme.gridUnit * 2, ({
  height
}) => height, ({
  width
}) => width, ({
  theme,
  headerFontSize
}) => theme.typography.sizes[headerFontSize], ({
  theme,
  boldText
}) => theme.typography.weights[boldText ? 'bold' : 'normal']);

function tableBuilder(data, ddType) {
  // leave blank left cell for geo label
  let output = "<table class='table table-striped table-condensed' style='table-layout:fixed;'><thead><tr>";

  for (let i = 0; i < data[0].length; i++) {
    output += "<th>" + data[0][i] + "</th>";
  }

  output += "</tr></thead><tbody>";

  for (const rowKey in data[1]) {
    output += "<tr><td>" + rowKey + "</td>";

    for (let n = 0; n < data[1][rowKey].length; n++) {
      // test value and use proper style
      let classes = ['dd-val'];
      const ddVal = data[1][rowKey][n];
      if (ddVal == 0) classes.push('dd-none');else if (ddVal <= 10) classes.push(ddType + '-low');else if (ddVal <= 20) classes.push(ddType + '-mild');else if (ddVal <= 25) classes.push(ddType + '-high');else classes.push(ddType + '-vhigh');
      output += "<td class='" + classes.join(' ') + "'>" + ddVal + "</td>";
    }

    output += "</tr>";
  }

  output += "</tbody></table>";
  return output;
}
/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */


function DegreeDaysTable(props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const {
    data,
    height,
    width,
    ddType
  } = props;
  const rootElem = (0, _react.createRef)(); // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.

  (0, _react.useEffect)(() => {
    const root = rootElem.current;
    console.log('Plugin element', root);
  });
  console.log('Plugin props', props);
  const tableHTML = tableBuilder(data, ddType);
  const outerDivStyle = {
    height,
    overflow: "auto"
  }; // <pre>${JSON.stringify(data, null, 2)}</pre>
  // <h3>{props.headerText}</h3>

  return /*#__PURE__*/_react.default.createElement(Styles, {
    ref: rootElem,
    boldText: props.boldText,
    headerFontSize: props.headerFontSize,
    height: height,
    width: width
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: outerDivStyle,
    dangerouslySetInnerHTML: {
      __html: tableHTML
    }
  }));
}