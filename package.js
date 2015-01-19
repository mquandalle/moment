// package metadata file for Meteor.js
'use strict';

var packageName = 'mquandalle:moment';
var packageJson = JSON.parse(Npm.require("fs").readFileSync('component.json'));

Package.describe({
  name: packageName,
  summary: 'Moment.js (official): parse, validate, manipulate, and display dates - official Meteor packaging',
  version: '1.0.0', //packageJson.version,
  git: 'https://github.com/moment/moment.git'
});

Package.onUse(function (api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);
  api.export('moment');
  api.addFiles([
    'moment.js',
    'meteor/export.js'
  ]);

  // Localization
  packageJson.files.forEach(function (fileName) {
    if (! /^locale/.test(fileName))
      return;
    api.addFiles(fileName, ['client', 'server'], { isAsset: true });
  });
  api.addFiles('meteor/client.js', 'client');
  api.use(['jquery', 'tracker', 'blaze'], 'client');
  api.use('tap:i18n@1.3.0', 'client');
});

Package.onTest(function (api) {
  api.use(packageName);
  api.use('tinytest');

  api.addFiles('meteor/test.js');
});
