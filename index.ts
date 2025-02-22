import Downloader from "./src/downloader";

const filePath = "/assets/keys/file.json";

/**
 * Parses command-line arguments and initiates the download process.
 */
async function main() {
    // Parse command-line arguments
    const args = process.argv.slice(2);
    const params: { [key: string]: string | boolean } = {};

    args.forEach(arg => {
        const [key, value] = arg.split("=");
        params[key] = value === "true" ? true : (value === "false" ? false : value);
    });

    // Extract parameters, handling potential undefined values
    const url: string | undefined = params.url as string | undefined;
    const isPaginated : boolean | undefined = params.isPaginated as boolean | undefined;
    const isStorageBucket : boolean | undefined = params.isPaginated as boolean | undefined;
    const storageBucketUri: string | undefined = params.storageBucketUri as string | undefined;
    const paginatedUrl: string | undefined = params.paginatedUrl as string | undefined;
    const directoryPath: string | undefined = params.directoryPath as string | undefined;

    console.log("🚀 Downloader app started! 🌟");
    console.log("URL:", url ?? "Not provided"); // Use nullish coalescing for cleaner output
    console.log("isPaginated:", isPaginated ?? false); // Default to false if not provided
    console.log("paginatedUrl:", paginatedUrl ?? "Not provided");
    console.log("directoryPath:", directoryPath ?? "/images"); // Default to /images if not provided
    console.log("isStorageBucket:", isStorageBucket ?? false); // Default to /images if not provided
    console.log("storageBucketUri:", storageBucketUri ?? "Not provided");

    console.log("Downloader is running");

    try {
        // Create a Downloader instance, providing the directory path (or default)
        const downloadClient = new Downloader(directoryPath || "/images", filePath || "");

        if(!isStorageBucket){

            // Conditional download logic based on isPaginated flag
            if (isPaginated) {
                // Paginated download
                if (!paginatedUrl) {
                    throw new Error("Paginated URL is required when --isPaginated is true.");
                }
                await downloadClient.downloadPaginatedFiles(paginatedUrl);
            }else {
                // Single URL download
                if (!url) {
                    throw new Error("URL is required when --isPaginated is false.");
                }
                await downloadClient.downloadFile(url);
            }

        }else{
            if(!storageBucketUri){
                throw new Error("Storage Bucket URL is required when --storageBucketUrl is true.");
            }
            
            await downloadClient.downloadStorageBucketFiles(storageBucketUri);
        }

        console.log("Download process completed successfully."); // Indicate success
        process.exit(0); // Exit with success code

    } catch (error) {
        console.error("Error in main:", error);
        process.exit(1); // Exit with error code
    }
}

main();