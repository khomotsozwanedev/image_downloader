import { ImageDto } from "./image.dto";

/**
 * Interface representing the structure of a paginated API endpoint response.
 * This interface defines the data returned by an API endpoint that supports pagination
 * for retrieving a list of images.
 */
export interface PaginatedEndpointDto {

    /**
     * An array of ImageDto objects representing the images on the current page.
     */
    images: Array<ImageDto>;

    /**
     * The URL for the next page of results.  This may be `null` or `undefined` if there are no more pages.
     */
    next: string;

    /**
     * The page number of the next page of results.  This may be `null` or `undefined` if there are no more pages.
     * Often, APIs will provide either `next` or `nextPage`, but not always both.
     */
    nextPage: number;

    /**
     * The total number of images in the  page.  This is what the code will loop through
     */
    count: number;
}