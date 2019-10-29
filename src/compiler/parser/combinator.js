module.exports = (stream, decl, map, result) => {
    const delcaration = require('./declaration');
    stream.stash();

    switch (decl.sign) {
        case '|': {

            for (const val of decl.values) { // TODO: Rename to value
                if (delcaration(stream, val, map, result)) {
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
