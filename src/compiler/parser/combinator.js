module.exports = (stream, decl, scope, result) => {
    const delcaration = require('./declaration');
    stream.stash();

    switch (decl.sign) {
        case '|': {

            for (const val of decl.value) {
                if (delcaration(stream, val, scope, result)) {
                    stream.recycle();
                    return true;
                }
            }

            break;
        }
    }

    stream.pop();
    return null;
};
