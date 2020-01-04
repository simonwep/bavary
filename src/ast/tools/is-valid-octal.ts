/**
 * Checks wheneveer the given char-sequence represents a valid hex value
 * @param str
 */
export const isValidOctal = (str: string): boolean => {

    for (const char of str) {

        // Check if character is out of range
        if (char < '0' || char > '7') {
            return false;
        }
    }

    return true;
};
