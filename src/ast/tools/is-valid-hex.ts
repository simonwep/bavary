export const isValidHex = (chars: string): boolean => {

    for (const char of chars) {

        // Check if character is out of range
        if (char < '0' || (char > '9' && char < 'A') || (char > 'F' && char < 'a') || char > 'f') {
            return false;
        }
    }

    return true;
};
