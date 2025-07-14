/**
 * Strips HTML from a string and formats it for plain text, with special handling for WhatsApp.
 * - Converts <p> tags to newlines.
 * - Converts <strong> tags to *bold* for WhatsApp.
 * - Removes all other HTML tags.
 * - Decodes HTML entities like &nbsp;.
 *
 * @param html The input HTML string.
 * @returns A plain text string formatted for WhatsApp.
 */
export function stripHtmlToText(html: string): string {
    if (!html) return '';

    return (
        html
            // Convert <p> tags to newlines for structure
            .replace(/<p>/gi, '')
            .replace(/<\/p>/gi, '\n')
            
            // Convert <strong> tags to WhatsApp bold
            .replace(/<strong>/gi, '*')
            .replace(/<\/strong>/gi, '*')
            
            // Remove any other HTML tags
            .replace(/<[^>]+>/g, '')
            
            // Decode common HTML entities
            .replace(/&nbsp;/g, ' ')
            
            // Trim whitespace from the start and end of the result
            .trim()
    );
} 