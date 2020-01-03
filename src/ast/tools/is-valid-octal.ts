export const isValidOctal = (chars: string): boolean => {

    for (const char of chars) {

        // Check if character is out of range
        if (char < '0' || char > '7') {
            return false;
        }
    }

    return true;
};
