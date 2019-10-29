const combinator = require('./combinator');
const string = require('./string');
const type = require('./type');

module.exports = (stream, decl, map, result = {obj: {}, str: '', pure: true}) => {
    stream.stash();

    switch (decl.type) {
        case 'combinator': {

            if (!combinator(stream, decl, map, result)) {
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
        case 'type': {

            if (!type(stream, decl, map, result)) {
                stream.pop();
                return false;
            }

            break;
        }
        case 'group': {
            const res = require('./group')(stream, decl, map, result);

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
        }
    }

    stream.recycle();
    return true;
};
