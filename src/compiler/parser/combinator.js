const serialize = require('../tools/serialize');

module.exports = (stream, decl, scope, result) => {
    const delcaration = require('./declaration');
    stream.stash();

    switch (decl.sign) {
        case '|': {

            // Match one of the items
            const decs = decl.value;
            for (let i = 0; i < decs.length; i++) {
                if (delcaration(stream, decs[i], scope, result)) {
                    stream.recycle();

                    // Serialize remaining types
                    serialize(decs.slice(i), result.obj);
                    return true;
                }
            }

            break;
        }
        case '&': {
            const cpy = [...decl.value];

            // Match items ignoring the order
            for (let i = 0; i < cpy.length; i++) {
                if (delcaration(stream, cpy[i], scope, result)) {
                    stream.recycle();
                    cpy.splice(i, 1);
                    i = -1;
                }
            }

            // Every item needs to be matched
            if (!cpy.length) {
                return true;
            }

            // Serialize remaining types
            serialize(cpy, result.obj);
            break;
        }
    }

    stream.pop();
    return null;
};
