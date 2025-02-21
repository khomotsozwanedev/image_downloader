"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const moment_1 = __importDefault(require("moment"));
const storage_manager_1 = require("./storage_manager");
/**
 * The Downloader class provides methods to download files from URLs, Google Cloud Storage buckets,
 * and paginated API endpoints. It handles the download process, saving files to a specified directory,
 * and supports interaction with Google Cloud Storage using a service account key file.
 */
class Downloader {
    /**
     * Initializes a new instance of the Downloader class.
     * @param {string} fileDirectory - The directory where downloaded files will be saved.
     * @param {string} keyFilePath - The path to the service account key file for Google Cloud Storage.
     */
    constructor(fileDirectory, keyFilePath) {
        this.fileDirectory = fileDirectory;
        this.keyFilePath = keyFilePath;
        // Create the directory if it doesn't exist.  Good practice to do this in the constructor.
        fs.mkdirSync(this.fileDirectory, { recursive: true }); // Synchronous for constructor.
    }
    /**
     * Downloads a file from a given URL.
     * @param {string} imageUrl - The URL of the file to download.
     * @returns {Promise<void>} - A Promise that resolves when the download is complete.
     * @throws {Error} - Throws an error if the download fails.
     */
    downloadFile(imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(imageUrl, { responseType: 'stream' });
                const filePath = this.generateFilePath(imageUrl);
                yield this.saveFile(response, filePath); // Use await here
                console.log(`Downloaded ${imageUrl} to ${filePath}`); //Log successful download
            }
            catch (err) {
                console.error(`Error downloading ${imageUrl}:`, err);
                throw err; // Re-throw the error to be handled by the caller.
            }
        });
    }
    /**
     * Downloads all files from a given storage URL.
     * @param {string} storageBucketUrl - The URL of the storage bucket.
     * @returns {Promise<void>} - A Promise that resolves when the download is complete.
     * @throws {Error} - Throws an error if the download fails.
     * @example
     * Example usage:
     * ```ts
     * await downloader.downloadStorageBucketFiles('gs://some-bucket');
     * ```
     */
    downloadStorageBucketFiles(storageBucketUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storageManager = new storage_manager_1.StorageManager(this.keyFilePath);
                const storageFileList = yield storageManager.getStorageBucketUrls(storageBucketUrl);
                yield Promise.all(storageFileList.map((gsPath) => __awaiter(this, void 0, void 0, function* () {
                    const imageUrl = storageManager.convertBucketUrlToUrlPath(gsPath);
                    console.log(`ImageUrl: ${imageUrl}`);
                    try {
                        const response = yield axios_1.default.get(imageUrl, { responseType: 'stream' });
                        const filePath = this.generateFilePath(imageUrl);
                        yield this.saveFile(response, filePath);
                        console.log(`Downloaded ${imageUrl} to ${filePath}`);
                    }
                    catch (e) {
                        throw e;
                    }
                })));
                console.log(`Downloaded all the storage buckets`); //Log successful download
                return;
            }
            catch (err) {
                console.error(`Error downloading image`, err);
                throw err; // Re-throw the error to be handled by the caller.
            }
        });
    }
    /**
     * Downloads files from a paginated API endpoint.
     * @param {string} paginatedPath - The URL of the paginated API endpoint.
     * @returns {Promise<void>} - A Promise that resolves when all downloads are complete.
     * @throws {Error} - Throws an error if the download fails.
     * @example
     * Example usage:
     * ```ts
     * await downloader.downloadPaginatedFiles('https://api.example.com/paginated-endpoint');
     * ```
     */
    downloadPaginatedFiles(paginatedPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(paginatedPath);
                const paginatedEndpoint = response.data;
                // Use Promise.all to download images concurrently and handle errors
                yield Promise.all(paginatedEndpoint.images.map((image) => __awaiter(this, void 0, void 0, function* () {
                    if (image && image.imageUrl) {
                        try {
                            yield this.downloadFile(image.imageUrl); // Await the download
                            console.log(`Downloaded image from ${image.imageUrl}`);
                        }
                        catch (downloadError) {
                            console.error(`Error downloading image from ${image.imageUrl}:`, downloadError);
                            // Decide if you want to re-throw, or continue.  Example:
                            // throw downloadError; // Uncomment to stop on individual image error
                        }
                    }
                    else {
                        console.warn("Invalid image data encountered:", image);
                    }
                })));
                console.log("All paginated images downloaded.");
                return;
            }
            catch (err) {
                console.error(`Error in downloadPaginatedFiles:`, err);
                throw err;
            }
        });
    }
    /**
     * Extracts the filename from a URL.
     * @param {string} imageUrl - The URL.
     * @returns {string} - The filename.
     * @throws {Error} - Throws an error if the URL is invalid.
    */
    extractNameFromPath(imageUrl) {
        try {
            const urlObj = new URL(imageUrl);
            const pathname = urlObj.pathname;
            const filename = path.basename(pathname);
            const decodedFilename = decodeURIComponent(filename);
            return decodedFilename;
        }
        catch (error) {
            console.error(`Error parsing URL ${imageUrl}:`, error);
            throw new Error(`Invalid URL: ${imageUrl}`);
        }
    }
    /**
     * Generates a file path with a timestamp.
     * @param {string} imageUrl - The image URL (used to get the filename).
     * @returns {string} - The generated file path.
    */
    generateFilePath(imageUrl) {
        const filename = this.extractNameFromPath(imageUrl);
        return path.join(this.fileDirectory, `${(0, moment_1.default)().format("X")}-${filename}`); // Use path.join
    }
    /**
     * Saves the file from the response stream to the specified file path.
     * @param {AxiosResponse} response - The AxiosResponse object.
     * @param {string} filePath - The path to save the file to.
     * @returns {Promise<void>} - A Promise that resolves when the file is saved.
     * @throws {Error} - Throws an error if saving the file fails.
     */
    saveFile(response, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            let downloadedBytes = 0;
            const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
            return new Promise((resolve, reject) => {
                response.data.on('data', (chunk) => {
                    downloadedBytes += chunk.length;
                    const progress = totalBytes ? Math.round((downloadedBytes / totalBytes) * 100) : 'N/A'; // Calculate progress
                    console.log(`Download Progress: ${progress}%`); // Print progress
                });
                writer.on('finish', () => {
                    console.log(`Download Complete: ${filePath}`); // Final success message
                    resolve(); // Resolve the promise
                });
                writer.on('error', (err) => {
                    console.error(`Error saving file ${filePath}:`, err);
                    reject(err); // Reject with the error
                });
            });
        });
    }
}
exports.default = Downloader;
