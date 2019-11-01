const declaration = require('./declaration');
const multiplier = require('./multiplier');

module.exports = multiplier((stream, decl, scope, result = {obj: {}, str: '', pure: true}) => {
    stream.stash();

    for (const dec of decl.value) {

        // Parse declaration
        if (!declaration(stream, dec, scope, result)) {
            stream.pop();
            return null;
        }
    }

    stream.recycle();
    return result.pure ? result.str : result.obj;
});
