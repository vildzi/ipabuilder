# IpaBuilder

Build an ipa from an xcode project. This does not require having a developer account ($100 / yr).  
This only supports macos at the moment (xcode command line tools).

## Installation

IpaBuilder requires you to have xcode installed (xcodebuild cli).  
Once you have installed xcode, clone the repo and copy the binary (buildipa) to /usr/local/bin, then you can use `buildipa` from any directory.  
Or use [NPM](https://npmjs.com) / [YARN](https://yarnpkg.com)  
NPM: `npm i -g ipabuilder`  
YARN: `yarn global add ipabuilder`

## Usage

`buildipa project_dir output_dir`  
If you get an error while building the xcode project, it is most likely due to invalid configurations on the xcode project. Open xcode and change the Bundle Identifier and Team on the project settings. If this doesn't work or you get any other errors, open a github issue.


## TODO

- Sign with provisioning profile
- Install to device?
