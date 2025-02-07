/**
 * Interface representing the structure of an image data object.
 * This interface defines the properties associated with a single image.
 */
export interface ImageDto {
    /**
     * The URL of the image.
     */
    imageUrl: string;

    /**
     * The alternative text for the image.  This should provide a textual description
     * of the image for accessibility purposes.
     */
    imageAlt: string;
}