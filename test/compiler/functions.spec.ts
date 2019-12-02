import {expect}  from 'chai';
import {compile} from '../../src/core';

describe('[COM] Functions', () => {

    it('Should resolve and execute a custom-function', () => {
        const parse = compile(`
            entry ['(' count([(0 - 9)+], 'size') ')']
        `, {
            functions: {
                count({setProperty, setString}, value, prop): boolean {
                    if (!value || typeof value !== 'string') {
                        throw new Error('Group not matched or not a string.');
                    }

                    if (typeof prop !== 'string') {
                        throw new Error('Second argument must be a string.');
                    }

                    if (value.length > 8) {
                        setString(value);
                    } else {
                        setProperty(prop, value.length);
                    }

                    return value.length > 2;
                }
            }
        });

        expect(parse('(1234)')).to.deep.equal({size: 4});
        expect(parse('(1234567890)')).to.deep.equal('1234567890)');
        expect(parse('(12)')).to.deep.equal(null);
    });

    it('Should throw an error if setString is used on a result-object', () => {
        const parse = compile(`
            <char> = [(a - z)]
            entry [
                <char#c>
                count([(0 - 9)+])
            ]
        `, {
            functions: {
                count({setString}): boolean {
                    setString('Hello World');
                    return true;
                }
            }
        });

        expect(() => parse('a123')).to.throw();
    });

    it('Should resolve tags used as argument', () => {
        const parse = compile(`
            <char> = [(a - z)+]
            entry [
                <char#chars>
                count(#chars, 'size', #wow)
            ]
        `, {
            functions: {
                count({setProperty}, chars, prop, nullRef): boolean {
                    if (nullRef !== null) {
                        return false;
                    }

                    if (chars && typeof chars === 'string' && typeof prop === 'string' && prop.length) {
                        setProperty(prop, chars.length);
                        return true;
                    }

                    return false;
                }
            }
        });

        expect(parse('abcde')).to.deep.equal({
            chars: 'abcde',
            size: 5
        });
    });

    it('Should accept a reference as argument', () => {
        const parse = compile(`
            <num> = [(0 - 9)+]
            entry [ number(<num>, 'num') ]
        `, {
            functions: {
                number({setProperty}, val, tag): boolean {
                    if (!tag || typeof tag !== 'string') {
                        throw new Error('Tag missing or not a string.');
                    } else if (!val) {
                        return false;
                    }

                    const res = Number(val);
                    if (Number.isNaN(res)) {
                        return false;
                    }

                    setProperty(tag, res);
                    return true;
                }
            }
        });

        expect(parse('123')).to.deep.equal({num: 123});
        expect(parse('abc')).to.equal(null);
    });

    it('Should throw an error if function is undefined', () => {
        const parse = compile(`
            entry [count([(0 - 9)+])]
        `);

        expect(() => parse('(12)')).to.throw();
    });
});
