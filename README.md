## @superset-ui/plugin-chart-degree-days-table



This plugin provides Degree Days Table for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import DegreeDaysTableChartPlugin from '@superset-ui/plugin-chart-degree-days-table';

new DegreeDaysTableChartPlugin()
  .configure({ key: 'degree-days-table' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-degree-days-table) for more details.

```js
<SuperChart
  chartType="degree-days-table"
  width={600}
  height={600}
  formData={...}
  queryData={{
    data: {...},
  }}
/>
```

### File structure generated

```
├── package.json
├── README.md
├── tsconfig.json
├── src
│   ├── DegreeDaysTable.tsx
│   ├── images
│   │   └── thumbnail.png
│   ├── index.ts
│   ├── plugin
│   │   ├── buildQuery.ts
│   │   ├── controlPanel.ts
│   │   ├── index.ts
│   │   └── transformProps.ts
│   └── types.ts
├── test
│   └── index.test.ts
└── types
    └── external.d.ts
```