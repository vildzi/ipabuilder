# IpaBuilder

Build an ipa from an xcode project. This does not require having a developer account ($100 / yr).  
This only supports macos at the moment but will gain linux and windows support soon-ish

## Installation

IpaBuilder requires you to have xcode installed (xcodebuild cli).  
Once you have installed xcode, clone the repo and copy the binary (buildipa) to /usr/local/bin, then you can use `buildipa` from any directory.  
Or use [NPM](npmjs.com) / [YARN](https://yarnpkg.com)  
NPM: `npm i -g ipabuilder`  
YARN: `yarn global add ipabuilder`

## Usage

`buildipa project_dir output_dir`