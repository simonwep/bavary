/**
 * Checks wheneveer the given char-sequence represents a valid hex value
 * @param str
 */
export const isValidHex = (str: string): boolean => {

    for (const char of str) {

        // Check if character is out of range
        if (char < '0' || (char > '9' && char < 'A') || (char > 'F' && char < 'a') || char > 'f') {
            return false;
        }
    }

    return true;
};
