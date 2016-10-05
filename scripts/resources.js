var IonicAppLib = require('ionic-app-lib');
var IonicResources = IonicAppLib.resources;
console.log(IonicResources.Settings);

Object.assign(IonicResources.Settings, {
  apiUrl: 'http://res.ionic.io',
  apiUploadPath: '/api/v1/upload',
  apiTransformPath: '/api/v1/transform',
  resourceDir: 'res',
  iconDir: 'icon',
  splashDir: 'splash',
  iconSourceFile: 'icon',
  splashSourceFile: 'splash',
  sourceExtensions: ['psd', 'ai', 'png'],
  supportedPlatforms: ['android', 'ios', 'wp8'],
  configFile: 'config.xml',
  generateThrottle: 4,
  defaultMaxIconSize: 96,
  cacheImages: true
});

IonicResources.generate(process.cwd(), {})
  .catch((err) => console.log(err));
