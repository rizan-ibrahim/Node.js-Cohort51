export default {
  presets: [
    "@babel/preset-env", // Transpiles modern JavaScript to compatible version
  ],
  plugins: [
    "@babel/plugin-transform-runtime", // Optimizes runtime helpers for ES modules
  ],
};
