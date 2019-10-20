const surrounded = require('../tools/surrounded');
const identifier = require('../tools/identifier');

module.exports = surrounded('<', '>', stream => {
    const name = identifier(stream);

    return {
        type: 'type',
        value: name
    };
});
