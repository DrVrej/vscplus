# Changelog
All notable changes to VSC+ will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.2.0 - September 20, 2026
- Applied massive performance optimization, which greatly reduces the extension's overall impact
- File size display calculations now use 1024-based units
- Added a dedicated VSC+ log output channel
- Extension settings are now ordered by item
- Simplified format button trigger setting to use a list of possible triggers rather than requiring the user to manually type it
- Added file lookup error handling for file size display
- Optimized total character counting and reduced temporary object creation
- Skip text info recalculation for the current document when the file updates without text changes
- Simplified file size pop-up display by using abbreviated byte units
- Reduced memory usage
- Greatly reduced the size of the extension
- Optimized status bar tooltip creation
- Removed unnecessary command-link trust from status bar tooltips
- Exclude web test files from published version
- Consolidated desktop and web build outputs into a single directory
- Replaced Webpack with esbuild for faster and simpler web builds
- Improved test failure logging
- Restricted TypeScript source discovery to the `src` directory
- Improved command reliability by properly returning asynchronous command operations
- Improved Marketplace publishing by running checks, avoiding activation confirmation, and skipping unnecessary runtime dependency detection
- Stopped generating unused production web source maps
- Fixed selected line counts including additional cursors with no selected text
- Fixed format button not updating when switching between editors
- Fixed file size pop-up command not working if its corresponding status bar item is disabled
- Fixed cases where file size pop-up clipboard copying not working
- Fixed unnecessarily calculating file size and text selection info when an inactive file is saved or edited
- Fixed file size unit thresholds not matching the displayed decimal calculations
- Fixed status bar item references remaining after changing extension settings causing extra memory usage

## 1.1.11 - September 17, 2026
- Greatly reduced file size
- Removed bunch of packages

## 1.1.10 - September 15, 2026
- Reduced the number of packages (Removed ~140 packages)
- Updated all packages

## 1.1.9 - July 5, 2026
- Applied various performance optimizations
- Now requires VS Code version 1.125.0 or greater
- Reduced number of files
- Updated extension information
- Updated all packages
- Fixed requiring certain developer dependencies

## 1.1.8 - November 17, 2025
- Applied unique ID for each status bar item, this will allow disabling them individually when status bar context menu is opened
- Added names for each status bar item
- Updated all required packages

## 1.1.7 - February 11, 2025
- Updated `README` file
- Updated all required packages

## 1.1.6 - September 16, 2024
- Updated all required packages

## 1.1.5 - July 23, 2023
- Updated all required packages

## 1.1.4 - June 10, 2023
- Updated to support latest version of VS Code
- Updated all required packages
- Added funding link

## 1.1.3 - December 19, 2022
- Updated extension icon to a more modern style

## 1.1.2 - December 14, 2022
- Updated all required packages

## 1.1.1 - August 3, 2022
- Updated all required packages

## 1.1.0 - February 17, 2022
- Added web version of the extension! (NOTE: Some features are limited!)
- Updated all required packages

## 1.0.3 - August 9, 2021
- Added tooltip icons for the Reload Button, Text Information Display, File Size Display
- File Size Display now displays the size in all byte sizes when hovered over it (tooltip)
- Formatting Toggle Button now displays the trigger types and current status when hovered over it (tooltip)
- Now requires VSCode version 1.59.0+ as it uses the updated StatusBarItem object with MarkdownString object support
- Updated required package versions

## 1.0.2 - June 17, 2021
- Added support for Virtual Workspaces
- Added support for Untrusted Workspaces

## 1.0.1 - June 3, 2021
- Code improvements & JSDoc support ([#2](https://github.com/DrVrej/vscplus/pull/2)) (thanks [Dragoteryx](https://github.com/Dragoteryx))
- Description updates

## 1.0.0 - June 1, 2021
- Initial Release
