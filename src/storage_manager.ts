import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import * as fs from 'fs';


/**
 * The StorageManager class provides methods to interact with Google Cloud Storage (GCS).
 * It includes functionality to convert GCS URLs to HTTP URLs and to fetch images from a GCS bucket.
 */
export class StorageManager {
    
    private storage: Storage;

    /**
     * Initializes a new instance of the StorageManager class.
     * @param {string} keyFilePath - The path to the service account key file.
     */
    constructor() {

        const filePath = path.join(__dirname, "..", "assets", "keys", "key.json");

        this.storage = new Storage({
            keyFilename: filePath // Specify the key file path here
        });

        //console.log(this.storage);
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
    convertBucketUrlToUrlPath(storageBucketImageUrl: string): string {
        if (!storageBucketImageUrl.startsWith("gs://")) {
            throw new Error("Invalid GCS URI. It should start with 'gs://'.");
        }
        const bucketAndPath = storageBucketImageUrl.slice(5); // Remove 'gs://'
        console.log(`bucketPath: ${bucketAndPath}`);
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
    async getStorageBucketUrls(storageBucket: string): Promise<string[]> {
        try {
            const [files] = await this.storage.bucket(storageBucket).getFiles();
            return files.map(file => `${storageBucket}/${file.name}`);
        } catch (error : any) {
            throw new Error(`Failed to fetch files from bucket ${storageBucket}: ${error.message}`);
        }
    }
}
