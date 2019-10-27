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
    stream.stash();
    if (decl.multiplier) {
        const {type, value} = decl.multiplier;

        switch (type) {
            case 'zero-infinity': {
                stream.recycle();
                return parseAll();
            }
            case 'one-infinity': {
                const values = parseAll();

                if (!values.length) {
                    stream.pop();
                    return null;
                }

                stream.recycle();
                return values;
            }
            case 'range': {
                const {start, end} = value;
                const values = parseAll();

                if (values.length < start || values.length > end) {
                    stream.pop();
                    return null;
                }

                stream.recycle();
                return values;
            }
            case 'optional': {
                const res = parse();

                if (!res) {
                    stream.pop();
                }

                return res;
            }
        }
    }

    stream.recycle();
    return parse();
};
