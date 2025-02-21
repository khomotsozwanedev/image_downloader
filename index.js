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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const downloader_1 = __importDefault(require("./src/downloader"));
const filePath = "./keys/file.json";
/**
 * Parses command-line arguments and initiates the download process.
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Parse command-line arguments
        const args = process.argv.slice(2);
        const params = {};
        args.forEach(arg => {
            const [key, value] = arg.split("=");
            params[key] = value === "true" ? true : (value === "false" ? false : value);
        });
        // Extract parameters, handling potential undefined values
        const url = params.url;
        const isPaginated = params.isPaginated;
        const isStorageBucket = params.isPaginated;
        const storageBucketUrl = params.storageBucketUrl;
        const paginatedUrl = params.paginatedUrl;
        const directoryPath = params.directoryPath;
        console.log("🚀 Downloader app started! 🌟");
        console.log("URL:", url !== null && url !== void 0 ? url : "Not provided"); // Use nullish coalescing for cleaner output
        console.log("isPaginated:", isPaginated !== null && isPaginated !== void 0 ? isPaginated : false); // Default to false if not provided
        console.log("paginatedUrl:", paginatedUrl !== null && paginatedUrl !== void 0 ? paginatedUrl : "Not provided");
        console.log("directoryPath:", directoryPath !== null && directoryPath !== void 0 ? directoryPath : "/images"); // Default to /images if not provided
        console.log("storageBucket:", isStorageBucket !== null && isStorageBucket !== void 0 ? isStorageBucket : false); // Default to /images if not provided
        console.log("storageBucketUrl:", storageBucketUrl !== null && storageBucketUrl !== void 0 ? storageBucketUrl : "Not provided");
        console.log("Downloader is running");
        try {
            // Create a Downloader instance, providing the directory path (or default)
            const downloadClient = new downloader_1.default(directoryPath || "/images", filePath || "");
            if (!isStorageBucket) {
                // Conditional download logic based on isPaginated flag
                if (isPaginated) {
                    // Paginated download
                    if (!paginatedUrl) {
                        throw new Error("Paginated URL is required when --isPaginated is true.");
                    }
                    yield downloadClient.downloadPaginatedFiles(paginatedUrl);
                }
                else {
                    // Single URL download
                    if (!url) {
                        throw new Error("URL is required when --isPaginated is false.");
                    }
                    yield downloadClient.downloadFile(url);
                }
            }
            else {
                if (!storageBucketUrl) {
                    throw new Error("Storage Bucket URL is required when --storageBucketUrl is true.");
                }
                yield downloadClient.downloadStorageBucketFiles(storageBucketUrl);
            }
            console.log("Download process completed successfully."); // Indicate success
            process.exit(0); // Exit with success code
        }
        catch (error) {
            console.error("Error in main:", error);
            process.exit(1); // Exit with error code
        }
    });
}
main();
