module.exports = (stream, decl, scope, result) => {
    const delcaration = require('./declaration');
    stream.stash();

    switch (decl.sign) {
        case '|': {

            // Match one of the items
            for (const val of decl.value) {
                if (delcaration(stream, val, scope, result)) {
                    stream.recycle();
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

            break;
        }
    }

    stream.pop();
    return null;
};
