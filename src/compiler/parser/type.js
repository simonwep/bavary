const multiplier = require('./multiplier');

module.exports = multiplier((stream, decl, map) => {
    const {value} = decl;

    // Lookup parser
    if (!map.has(value)) {
        throw `Cannot resolve ${value}`;
    }

    // Parse
    const body = map.get(value);
    return require('./group')(stream, body, map);
});
