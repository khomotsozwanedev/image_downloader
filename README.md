# Image Downloader Script

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
[![Code Coverage](https://img.shields.io/badge/Coverage-10%25-brightgreen)](https://example.com/coverage)
[![Passing Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)](https://example.com/tests)

**Author:** Khomotso Zwane

**Version:** 0.0.1

**License:** Apache License 2.0

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Script Explanation](#script-explanation)
- [Node.js App Integration](#nodejs-app-integration)
- [Logging](#logging)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license-1)

## Description

Bash script wrapping a Node.js app for image downloading from single or paginated URLs.

## Features

*   Single URL Download
*   Paginated Download
*   Directory Management
*   Logging
*   Error Handling
*   Help and Version Information

## Prerequisites

*   Bash
*   Node.js and npm
*   Node.js app (`./dist/index.js`)

## Installation

1.  `git clone <repository_url>`
2.  `cd <repository_directory>`
3.  npm install
4. npm run build
5.  Ensure `./dist/index.js` exists (build Node.js app if needed).

## Usage

```bash
./prepare.sh [OPTIONS]
```

### Options:
-- url <URL>: The base URL for downloads (required if isPaginated is not used). 🔗

-- isPaginated: Flag indicating paginated downloads. 📄

-- paginatedUrl <URL>: URL for paginated downloads (required if --isPaginated is used). 🔗

-- directoryPath <PATH>: Directory to save downloads (default: $HOME/downloader). 📁

-- help: Display this help message. ❓

-- version: Display script version. ℹ️


#### Examples:

Display help: 
- ./prepare.sh --help

Display version: 
- ./prepare.sh --version

Download a single image: 
- ./prepare.sh --url https://example.com/image.png --directoryPath /workspaces/image_downloader/images (Use a real image URL)

Download images from a paginated list: 
- ./prepare.sh --url https://example.com/images --paginatedUrl https://example.com/images?page= --directoryPath /workspaces/image_downloader/images (Replace with your actual URLs and pagination scheme)

## Contributing 🤝

Contributions are welcome! Please open an issue or submit a pull request.

## Issues 🐛

Please report any issues on the [GitHub Issues page](https://github.com/khomotsozwanedev/image_downloader/issues)

## TODO 📝

*   Add more robust error handling in the shell script.
*   Include more detailed Node.js code snippets in the README.
*   Add unit tests for the shell script and the Node.js app.
*   Implement progress reporting during downloads.
*   Consider adding support for different image formats.