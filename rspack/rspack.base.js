const dotenv = require("dotenv");
const path = require("path");

// --------------------------------------------------------------------
// Find the project and workspace directories
const projectRoot = __dirname;
// const workspaceRoot = path.resolve(projectRoot, "../..");

// ------------------------------- Env -------------------------------
// replace accordingly './.env' with the path of your .env file
dotenv.config({
  path: path.join(projectRoot, "..", ".env"),
});

console.log(path.join(projectRoot, "..", ".env"));

// ------------------------------- Rspack -------------------------------
/** @type {import('@rspack/cli').Configuration} */
const config = {
  context: projectRoot,
  target: "node",
  entry: {
    index: [path.resolve(projectRoot, "..", "./src/server.ts")],
  },
  output: {
    path: path.resolve(projectRoot, "..", "./build"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    tsConfig: path.resolve(projectRoot, "..", "./tsconfig.json"),
  },
  stats: "errors-only",
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
              decorators: true,
            },
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  externalsType: "commonjs",
  externalsPresets: { node: true },
  externals: [],
  plugins: [],
};

module.exports = config;
