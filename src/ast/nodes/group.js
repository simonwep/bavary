const surrounded = require('../tools/surrounded');
const combine = require('../tools/combine');
const check = require('../tools/check');
const combinator = require('./combinator');

module.exports = surrounded('[', ']', stream => {
    const values = [];

    const parsers = combine(
        require('./group'),
        require('./string')
    );

    while (!check(stream, 'punc', ']')) {
        const value = parsers(stream);
        const com = combinator(stream);

        if (!value) {
            return null;
        }

        values.push(value);
        if (com) {
            values.push(com);
        }
    }

    return {
        type: 'group',
        value: values
    };
});
