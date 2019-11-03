const serialize = require('../tools/serialize');
const declaration = require('./declaration');
const multiplier = require('./multiplier');

module.exports = multiplier((stream, decl, scope, result = {obj: {}, str: '', pure: true}) => {
    stream.stash();

    const decs = decl.value;
    for (let i = 0; i < decs.length; i++) {
        const dec = decs[i];

        // Parse declaration
        if (!declaration(stream, dec, scope, result)) {
            stream.pop();

            // Serialize remaining types
            serialize(decs.slice(i), result.obj);
            return null;
        }
    }

    stream.recycle();
    return result.pure ? result.str : result.obj;
});
