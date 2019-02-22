import { get } from 'node-cmd';
import 'colors';
import { promisify } from 'util';
import { platform } from 'os';
import dirExists from 'directory-exists';
import fs from 'fs';

const dir = process.argv[2];
const dirOut = process.argv[3];
const run = promisify(get);

if (platform() !== 'darwin') {
  console.log(`${'err'.red} Only macOS is currently supported.`);
  process.exit();
}

if (!dir || !dirOut) {
  console.log('Usage: buildipa <project dir> <output dir>');
  process.exit();
}

(async () => {
  if (!await dirExists(dir)) {
    console.log(`${'err'.red} The specified project directory does not exist.`);
    process.exit();
  }
  if (!await dirExists(dirOut)) {
    console.log(`${'info'.blue} The specified output directory does not exist. Creating output directory...`);
    fs.mkdirSync(dirOut);
  }
  console.log(`${'info'.blue} Building xcode project...`);
  if (await run('type -p xcodebuild') === 'xcodebuild not found') {
    console.log(`${'err'.red} Please install xcode and try again.`);
    process.exit();
  }
  const dirFiles = await run(`cd ${dir} && ls`);
  if (!dirFiles.includes('.xcodeproj')) {
    console.log(`${'err'.red} No .xcodeproj was found in the given project directory.`);
    process.exit();
  }
  await run(`cd ${dir} && xcodebuild`);
  console.log(`${'complete'.green} Finished building xcode project!`);
  console.log(`${'info'.blue} Building ipa...`);
  await run(`cd ${dir}/build && mkdir Payload`);
  const files = await run(`cd ${dir}/build/Release-iphoneos && ls`);
  const file = files.match(/(.+)\.app\s/g)[0];
  await run(`cd ${dir}/build && cp -R Release-iphoneos/${file.split('.').shift()}.app Payload`);
  await run(`cd ${dir}/build && zip -r Payload.zip Payload`);
  await run(`cd ${dir}/build && mv Payload.zip ${file.split('.').shift()}.ipa`);
  await run(`cp ${dir}/build/${file.split('.').shift()}.ipa ${dirOut}`);
  console.log(`${'complete'.green} Finished building ipa!`);
  console.log(`${'info'.blue} Cleaning up...`);
  await run(`cd ${dir} && rm -rf build`);
  console.log(`${'complete'.green} Finished cleaning up!`);
})();
