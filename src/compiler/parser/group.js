const multiplier = require('./multiplier');
const string = require('./string');
const type = require('./type');

module.exports = multiplier((stream, group, map, obj = {}) => {
    let pure = true;
    let str = '';

    stream.stash();
    const decs = group.value;
    for (let i = 0; i < decs.length; i++) {
        const next = (i < decs.length - 1) ? decs[i + 1] : null;
        const decl = decs[i];
        let passed = false;

        // Parse declaration
        switch (decl.type) {
            case 'string': {
                const res = string(stream, decl);

                if (typeof res === 'string') {
                    str += res;
                    passed = true;
                }

                break;
            }
            case 'type': {
                const res = type(stream, decl, map, obj);

                if (res) {
                    if (decl.tag) {
                        pure = false;
                        obj[decl.tag] = res;
                    } else if (Array.isArray(res)) {
                        str += res.join('');
                    } else if (typeof res === 'string') {
                        str += res;
                    } else {
                        break;
                    }

                    passed = true;
                } else if (!decl.multiplier || (decl.multiplier.type === 'one-infinity')) {
                    stream.pop();
                    return null;
                }

                break;
            }
            case 'group': {
                const res = require('./group')(stream, decl, map, obj);

                if (res) {
                    if (decl.tag) {
                        pure = false;
                        obj[decl.tag] = res;
                    } else if (Array.isArray(res)) {
                        str += res.join('');
                    } else if (typeof res === 'string') {
                        str += res;
                    } else {
                        stream.recycle();
                        return res;
                    }

                    passed = true;
                }

                break;
            }
            default: {
                continue;
            }
        }

        // If the type couldn't be parsed, check if it's optional trough a combinator.
        if (!passed && next && next.type !== 'combinator') {
            stream.pop();
            return null;
        } else if (passed && next && next.type === 'combinator') {
            break;
        }
    }

    stream.recycle();
    return pure ? str || null : obj;
});
