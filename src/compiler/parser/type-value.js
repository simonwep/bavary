const group = require('./group');
const block = require('./block');

module.exports = (stream, decl, scope, result) => {
    switch (decl.type) {
        case 'group': {
            return group(stream, decl, scope, result);
        }
        case 'block': {
            return block(stream, decl, scope);
        }
        default: {
            throw `Unknown declaration type: ${decl.type}`;
        }
    }
};
