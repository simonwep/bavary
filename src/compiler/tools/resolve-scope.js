/**
 * Builds a new scope and resolves all exports
 * @param decs Declarations
 * @param parent Optional inherited scope
 * @param interceptor Optional interceptor for each declaration
 */
module.exports = (decs, parent, interceptor) => {
    const map = new Map(parent !== null ? [...parent] : null);

    for (const dec of decs) {
        const {name, value, type} = dec;

        // Each declaration can only one get once defined
        if (map.has(name)) {
            throw `Type "${name}" has been already declared.`;
        } else if (type === 'declaration') {

            // Call interceptor if defined
            if (typeof interceptor === 'function') {
                interceptor(dec);
            }

            // Check if declaration isn't anonym
            if (name !== null) {
                map.set(name, value);
            }
        } else {
            throw `Unknown type "${type}"`;
        }
    }

    return map;
};
