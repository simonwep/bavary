const optional = require('../tools/optional');
const expect = require('../tools/expect');
const maybe = require('../tools/maybe');
const check = require('../tools/check');
const declaration = require('./declaration');

module.exports = maybe(stream => {

    // It may be a block
    if (!optional(stream, 'punc', '{')) {
        return null;
    }

    // Parse declarations
    const declarations = [];

    while (!check(stream, 'punc', '}')) {
        declarations.push(declaration(stream));
    }

    expect(stream, 'punc', '}');
    return {
        type: 'block',
        value: declarations
    };
});
