"use strict";

var _nodeCmd = require("node-cmd");

require("colors");

var _util = require("util");

var _os = require("os");

var _directoryExists = _interopRequireDefault(require("directory-exists"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dir = process.argv[2];
var dirOut = process.argv[3];
var run = (0, _util.promisify)(_nodeCmd.get);

if ((0, _os.platform)() !== 'darwin') {
  console.log("".concat('err'.red, " Only macOS is currently supported."));
  process.exit();
}

if (!dir || !dirOut) {
  console.log('Usage: buildipa <project dir> <output dir>');
  process.exit();
}

(async function () {
  if (!(await (0, _directoryExists["default"])(dir))) {
    console.log("".concat('err'.red, " The specified project directory does not exist."));
    process.exit();
  }

  if (!(await (0, _directoryExists["default"])(dirOut))) {
    console.log("".concat('info'.blue, " The specified output directory does not exist. Creating output directory..."));
    await run("mkdir ".concat(dirOut));
  }

  console.log("".concat('info'.blue, " Building xcode project..."));

  if ((await run('type -p xcodebuild')) === 'xcodebuild not found') {
    console.log("".concat('err'.red, " Please install xcode and try again."));
    process.exit();
  }

  var dirFiles = await run("cd ".concat(dir, " && ls"));

  if (!dirFiles.includes('.xcodeproj')) {
    console.log("".concat('err'.red, " No .xcodeproj was found in the given project directory."));
    process.exit();
  }

  await run("cd ".concat(dir, " && xcodebuild"));
  console.log("".concat('complete'.green, " Finished building xcode project!"));
  console.log("".concat('info'.blue, " Building ipa..."));
  await run("cd ".concat(dir, "/build && mkdir Payload"));
  var files = await run("cd ".concat(dir, "/build/Release-iphoneos && ls"));
  var file = files.match(/(.+)\.app\s/g)[0];
  await run("cd ".concat(dir, "/build && cp -R Release-iphoneos/").concat(file.split('.').shift(), ".app Payload"));
  await run("cd ".concat(dir, "/build && zip -r Payload.zip Payload"));
  await run("cd ".concat(dir, "/build && mv Payload.zip ").concat(file.split('.').shift(), ".ipa"));
  await run("cp ".concat(dir, "/build/").concat(file.split('.').shift(), ".ipa ").concat(dirOut));
  console.log("".concat('complete'.green, " Finished building ipa!"));
  console.log("".concat('info'.blue, " Cleaning up..."));
  await run("cd ".concat(dir, " && rm -rf build"));
  console.log("".concat('complete'.green, " Finished cleaning up!"));
})();