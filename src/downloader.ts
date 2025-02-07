import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';

import { ImageDto, PaginatedEndpointDto } from './dto';

export default class Downloader {

    private fileDirectory: string;

    constructor(fileDirectory: string) {
        this.fileDirectory = fileDirectory;

        // Create the directory if it doesn't exist.  Good practice to do this in the constructor.
        fs.mkdirSync(this.fileDirectory, { recursive: true }); // Synchronous for constructor.
    }

    /**
     * Downloads a file from a given URL.
     * @param imageUrl The URL of the file to download.
     * @returns A Promise that resolves when the download is complete.
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
     * Downloads files from a paginated API endpoint.
     * @param paginatedPath The URL of the paginated API endpoint.
     * @returns A Promise that resolves when all downloads are complete.
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
     * @param imageUrl The URL.
     * @returns The filename.
     * @throws Error if the URL is invalid.
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
     * @param imageUrl The image URL (used to get the filename).
     * @returns The generated file path.
     */
    private generateFilePath(imageUrl: string): string {
        const filename = this.extractNameFromPath(imageUrl);
        return path.join(this.fileDirectory, `${moment().format("X")}-${filename}`); // Use path.join
    }

    /**
     * Saves the file from the response stream to the specified file path.
     * @param response The AxiosResponse object.
     * @param filePath The path to save the file to.
     * @returns A Promise that resolves when the file is saved.
     */
    private async saveFile(response: AxiosResponse, filePath: string): Promise<void> {  // Make saveFile async
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        let downloadedBytes = 0;
        const totalBytes = parseInt(response.headers['content-length'] || '0', 10); 

        return new Promise<void>((resolve, reject) => {
            
            response.data.on('data', (chunk) => { // Listen for data chunks
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