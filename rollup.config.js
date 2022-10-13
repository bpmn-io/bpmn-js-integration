import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'vendor/bpmn.js',
  output: {
    file: 'dist/bpmn.js',
    format: 'umd',
    name: 'BpmnJS'
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
};
