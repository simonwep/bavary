module.exports = fn => (stream, decl, map, ...rest) => {
    const parse = () => fn(stream, decl, map, ...rest);
    const parseAll = () => {
        const values = [];

        for (let res; (res = parse());) {
            values.push(res);
        }

        return values;
    };

    // Check if there's a multiplier
    if (decl.multiplier) {
        const {type, value} = decl.multiplier;

        switch (type) {
            case 'zero-infinity': {
                return parseAll();
            }
            case 'one-infinity': {
                const values = parseAll();

                if (!values.length) {
                    return null;
                }

                return values;
            }
            case 'range': {
                const {start, end} = value;
                const values = parseAll();

                if (values.length < start || values.length > end) {
                    return null;
                }

                return values;
            }
        }
    }

    return parse();
};
