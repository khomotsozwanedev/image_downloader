"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageManager = void 0;
const storage_1 = require("@google-cloud/storage");
/**
 * The StorageManager class provides methods to interact with Google Cloud Storage (GCS).
 * It includes functionality to convert GCS URLs to HTTP URLs and to fetch images from a GCS bucket.
 */
class StorageManager {
    /**
     * Initializes a new instance of the StorageManager class.
     * @param {string} keyFilePath - The path to the service account key file.
     */
    constructor(keyFilePath) {
        this.storage = new storage_1.Storage({
            keyFilename: keyFilePath // Specify the key file path here
        });
    }
    /**
     * Converts a Google Cloud Storage (GCS) URI or path to a HTTP URL.
     *
     * @param {string} storageBucketImageUrl - The GCS URI or path of the image.
     * @returns {string} - The HTTP URL of the image.
     * @example
     * const httpUrl = storageManager.convertBucketUrlToUrlPath("gs://bucket-name/image.png");
     * console.log(httpUrl); // Output: https://storage.googleapis.com/bucket-name/image.png
     */
    convertBucketUrlToUrlPath(storageBucketImageUrl) {
        if (!storageBucketImageUrl.startsWith("gs://")) {
            throw new Error("Invalid GCS URI. It should start with 'gs://'.");
        }
        const bucketAndPath = storageBucketImageUrl.slice(5); // Remove 'gs://'
        return `https://storage.googleapis.com/${bucketAndPath}`;
    }
    /**
     * Fetches the URLs of images stored in the specified GCS bucket.
     *
     * @param {string} storageBucket - The name of the GCS bucket.
     * @returns {Promise<string[]>} - A promise that resolves to a list of image URLs in the specified GCS bucket.
     * @example
     * async function fetchImages() {
     *   const imageUrls = await storageManager.getStorageBucketUrls("bucket-name");
     *   console.log(imageUrls); // Output: ["gs://bucket-name/image1.png", "gs://bucket-name/image2.png", "gs://bucket-name/image3.png"]
     * }
     */
    getStorageBucketUrls(storageBucket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [files] = yield this.storage.bucket(storageBucket).getFiles();
                return files.map(file => `gs://${storageBucket}/${file.name}`);
            }
            catch (error) {
                throw new Error(`Failed to fetch files from bucket ${storageBucket}: ${error.message}`);
            }
        });
    }
}
exports.StorageManager = StorageManager;
