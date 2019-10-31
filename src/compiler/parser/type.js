const multiplier = require('./multiplier');

module.exports = multiplier((stream, decl, map, result) => {
    const {value} = decl;

    // Lookup parser
    if (!map.has(value)) {
        throw `Cannot resolve ${value}`;
    }

    // Parse
    stream.stash();
    const body = map.get(value);
    const exec = require('./group')(stream, body, map);

    // Check if group returned smth
    if (exec !== null) {

        // Store result
        if (decl.tag) {
            result.pure = false; // Result is not anymore "just a string"
            result.obj[decl.tag] = exec; // Save tag-result TODO: Check if already declared
        } else if (Array.isArray(exec)) {
            result.str += exec.join(''); // Concat string sequences
        } else if (typeof exec === 'string') {
            result.str += exec;
        }

        stream.recycle();
        return true;
    } else if (decl.multiplier) {
        const {type} = decl.multiplier;

        // Declaration may containe a multiplier
        if (type === 'optional') {
            stream.recycle();
            return true;
        }
    }

    stream.pop();
    return false;
});
