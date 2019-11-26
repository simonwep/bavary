/**
 * Removes an item fron an array and returns true if the given item was found
 * @param arr
 * @param item
 */
export function removeFromArray<T>(arr: Array<T>, item: T): boolean {
    const index = arr.indexOf(item);

    if (~index) {
        arr.splice(index, 1);
        return true;
    }

    return false;
}
