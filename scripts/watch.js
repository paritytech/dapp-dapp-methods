// Inspired from
// https://gist.github.com/int128/e0cdec598c5b3db728ff35758abdbafd

process.env.NODE_ENV = 'development';

const fs = require('fs-extra');
const paths = require('react-scripts/config/paths');
const webpack = require('webpack');
const config = require('react-scripts/config/webpack.config.dev.js');

// removes react-dev-utils/webpackHotDevClient.js at first in the array
config.entry = config.entry.filter(
  entry => !entry.includes('webpackHotDevClient')
);
config.output.publicPath = '';
config.output.hotUpdateChunkFilename = 'hot/hot-update.js';
config.output.hotUpdateMainFilename = 'hot/hot-update.json';
paths.appBuild = 'dist/';

webpack(config).watch({}, (err, stats) => {
  if (err) {
    console.error(err);
  } else {
    copyPublicFolder();
  }
  console.error(
    stats.toString({
      chunks: false,
      colors: true
    })
  );
});

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml
  });
  fs.moveSync(`${paths.appPath}/index.html`, `${paths.appBuild}/index.html`, {
    overwrite: true
  });
  fs.copySync(`${paths.appPath}/static`, `${paths.appBuild}/static`, {
    overwrite: true
  });
  fs.removeSync(`${paths.appPath}/static`);
}
