const characterRange = require('./character-range');
const combinator = require('./combinator');
const string = require('./string');
const type = require('./type');

module.exports = (stream, decl, scope, result = {obj: {}, str: '', pure: true}) => {
    stream.stash();

    switch (decl.type) {
        case 'combinator': {

            if (!combinator(stream, decl, scope, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'string': {

            if (!string(stream, decl, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'character-range': {

            if (!characterRange(stream, decl, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'type': {

            if (!type(stream, decl, scope, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'group': {
            const res = require('./group')(stream, decl, scope, result);

            if (!res) {
                if (decl.multiplier) {
                    const {type} = decl.multiplier;

                    // Check if group need to be matched
                    if (type !== 'one-infinity') {
                        break;
                    }
                }

                stream.pop();
                return false;
            }

            break;
        }
    }

    stream.recycle();
    return true;
};
