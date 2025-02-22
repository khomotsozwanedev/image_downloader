# Image Downloader Script

[![codecov](https://codecov.io/gh/khomotsozwanedev/image_downloader/graph/badge.svg?token=2cQ5ZRr3xb)](https://codecov.io/gh/khomotsozwanedev/image_downloader)

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
[![Code Coverage](https://img.shields.io/badge/Coverage-10%25-brightgreen)](https://example.com/coverage)
[![Passing Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)](https://example.com/tests)

**Author:** Khomotso Zwane

**Version:** 1.0.11

**License:** Apache License 2.0


## GH Documentation
- [https://khomotsozwanedev.github.io/image_downloader/docs/](https://khomotsozwanedev.github.io/image_downloader/docs/)

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
*   Service Account key 

## Installation

1.  `git clone <repository_url>`
2.  `cd <repository_directory>`
3.  add the service account to /src/images/keys/
4.  name the key file.json
5.  npm install
6. npm run build
7.  Ensure `./dist/index.js` exists (build Node.js app if needed).

## Usage

```bash
./prepare.sh [OPTIONS]
```

## Options:

--url <URL>        : The base URL for downloading a single image. Required unless --isPaginated or --isStorageBucket is used.
                     (e.g., --url https://example.com/image.jpg) 🔗

--storageBucketUri <GCS_URI> : The Google Cloud Storage (GCS) URI for downloading images from a bucket. Required if --isStorageBucket is used.
                                (e.g., --storageBucketUri gs://your-bucket-name/path/to/images/) ☁️

--isPaginated      : Flag indicating that the URL provided is for a paginated list of images.
                     Use with --paginatedUrl and --url. 📄

--isStorageBucket  : Flag indicating that images should be downloaded from a Google Cloud Storage bucket.
                     Use with --storageBucketUri. ☁️

--paginatedUrl <URL> : The base URL for paginated image lists. Required if --isPaginated is used, and --isStorageBucket is not used.
                       (e.g., --paginatedUrl https://example.com/images?page=) 📄

--directoryPath <PATH> : The local directory to save downloaded images. Defaults to $HOME/downloader.
                         (e.g., --directoryPath /path/to/save/images) 📁

--help             : Display this help message and usage instructions. ❓

--version          : Display the script's version number. ℹ️


#### Examples:

Display help: 
- ./prepare.sh --help

Display version: 
- ./prepare.sh --version

Download a single image: 
- ./prepare.sh --url https://example.com/image.png --directoryPath /workspaces/image_downloader/images (Use a real image URL)

Download images from a paginated list: 
- ./prepare.sh --url https://example.com/images --paginatedUrl https://example.com/images?page= --directoryPath /workspaces/image_downloader/images (Replace with your actual URLs and pagination scheme)

Download images from a google storage bucket list: 
- ./prepare.sh -- isStorageBucket true -- storageBucketUri gs://bucket-name  --directoryPath /workspaces/image_downloader/images (Replace with your actual URLs and pagination scheme)

## Contributing 🤝

Contributions are welcome! Please open an issue or submit a pull request.

## Issues 🐛

Please report any issues on the [GitHub Issues page](https://github.com/khomotsozwanedev/image_downloader/issues)

## TODO 📝

* [x] Include more detailed Node.js code snippets in the README. ✅
* [x] Add unit tests for the shell script and the Node.js app. ✅
* [x] Implement progress reporting during downloads. ✅
* [ ] Add more robust error handling in the shell script.
* [ ] Consider adding support for different image formats.