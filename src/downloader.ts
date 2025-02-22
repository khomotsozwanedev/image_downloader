import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import moment from 'moment';

import { ImageDto, PaginatedEndpointDto } from './dto';
import { StorageManager } from './storage_manager';

/**
 * The Downloader class provides methods to download files from URLs, Google Cloud Storage buckets, 
 * and paginated API endpoints. It handles the download process, saving files to a specified directory,
 * and supports interaction with Google Cloud Storage using a service account key file.
 */
export default class Downloader {

    private fileDirectory: string;
    private keyFilePath : string;

    /**
     * Initializes a new instance of the Downloader class.
     * @param {string} fileDirectory - The directory where downloaded files will be saved.
     * @param {string} keyFilePath - The path to the service account key file for Google Cloud Storage.
     */
    constructor(fileDirectory: string, keyFilePath : string ) {
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
    async downloadFile(imageUrl: string): Promise<void> {
        try {
            const response = await axios.get(imageUrl, { responseType: 'stream' });
            const filePath = this.generateFilePath(imageUrl);
            await this.saveFile(response, filePath); // Use await here
            console.log(`Downloaded ${imageUrl} to ${filePath}`); //Log successful download
        } catch (err) {
            console.error(`Error downloading ${imageUrl}:`, err);
            throw err; // Re-throw the error to be handled by the caller.
        }
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
    async downloadStorageBucketFiles(storageBucketUrl: string): Promise<void> {
        try {

            const storageManager = new StorageManager(this.keyFilePath);

            const storageFileList : string[] = await storageManager.getStorageBucketUrls(storageBucketUrl);

            await Promise.all(
                storageFileList.map(async (gsPath) => {
                    const imageUrl = storageManager.convertBucketUrlToUrlPath(gsPath);
                    console.log(`ImageUrl: ${imageUrl}`);

                    try{

                        const response = await axios.get(imageUrl, { responseType: 'stream' });
                        const filePath = this.generateFilePath(imageUrl);
                        await this.saveFile(response, filePath);

                        console.log(`Downloaded ${imageUrl} to ${filePath}`);

                    }catch(e){
                        throw e;
                    }

                })
            );

            console.log(`Downloaded all the storage buckets`); //Log successful download
            return;
        } catch (err) {
            console.error(`Error downloading image`, err);
            throw err; // Re-throw the error to be handled by the caller.
        }
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
    async downloadPaginatedFiles(paginatedPath: string): Promise<void> {
        try {
            const response = await axios.get(paginatedPath);
            const paginatedEndpoint = response.data as PaginatedEndpointDto;

            // Use Promise.all to download images concurrently and handle errors
            await Promise.all(
                paginatedEndpoint.images.map(async (image: ImageDto) => {
                    if (image && image.imageUrl) {
                        try {
                            await this.downloadFile(image.imageUrl); // Await the download
                            console.log(`Downloaded image from ${image.imageUrl}`);
                        } catch (downloadError) {
                            console.error(`Error downloading image from ${image.imageUrl}:`, downloadError);
                            // Decide if you want to re-throw, or continue.  Example:
                            // throw downloadError; // Uncomment to stop on individual image error
                        }
                    } else {
                        console.warn("Invalid image data encountered:", image);
                    }
                })
            );

            console.log("All paginated images downloaded.");
            return;

        } catch (err) {
            console.error(`Error in downloadPaginatedFiles:`, err);
            throw err;
        }
    }


    /**
     * Extracts the filename from a URL.
     * @param {string} imageUrl - The URL.
     * @returns {string} - The filename.
     * @throws {Error} - Throws an error if the URL is invalid.
    */
    private extractNameFromPath(imageUrl: string): string {
        try {
            const urlObj = new URL(imageUrl);
            const pathname = urlObj.pathname;
            const filename = path.basename(pathname);
            const decodedFilename = decodeURIComponent(filename);
            return decodedFilename;
        } catch (error) {
            console.error(`Error parsing URL ${imageUrl}:`, error);
            throw new Error(`Invalid URL: ${imageUrl}`);
        }
    }

    /**
     * Generates a file path with a timestamp.
     * @param {string} imageUrl - The image URL (used to get the filename).
     * @returns {string} - The generated file path.
    */
    private generateFilePath(imageUrl: string): string {
        const filename = this.extractNameFromPath(imageUrl);
        return path.join(this.fileDirectory, `${moment().format("X")}-${filename}`); // Use path.join
    }

    /**
     * Saves the file from the response stream to the specified file path.
     * @param {AxiosResponse} response - The AxiosResponse object.
     * @param {string} filePath - The path to save the file to.
     * @returns {Promise<void>} - A Promise that resolves when the file is saved.
     * @throws {Error} - Throws an error if saving the file fails.
     */
    private async saveFile(response: AxiosResponse, filePath: string): Promise<void> {  // Make saveFile async
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        let downloadedBytes = 0;
        const totalBytes = parseInt(response.headers['content-length'] || '0', 10); 

        return new Promise<void>((resolve, reject) => {
            
            response.data.on('data', (chunk : any) => { // Listen for data chunks
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
    }


}