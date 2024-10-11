import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  test: [ '**/test/**/*.js' ],
  lib: [ 'lib/**/*.js' ]
};

export default [
  {
    ignores: [
      'dist',
      'tmp'
    ]
  },
  ...bpmnIoPlugin.configs.browser.map(config => {
    return {
      ...config,
      files: files.lib
    };
  }),
  ...bpmnIoPlugin.configs.node.map(config => {
    return {
      ...config,
      ignores: files.lib
    };
  }),
  ...bpmnIoPlugin.configs.mocha.map(config => {
    return {
      ...config,
      files: files.test,
      rules: {
        'no-unused-vars': [ 'error', { varsIgnorePattern: 'executeTest' } ]
      }
    };
  })
];
