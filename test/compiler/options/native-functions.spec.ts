import {expect}  from 'chai';
import {compile} from '../../../src';

describe('[OPTION] Functions', () => {

    it('Should resolve and execute a custom-function', () => {
        const parse = compile(`
            entry [object: '(' count([(0 - 9)+], 'size') ')']
        `, {
            functions: {
                count({node}, value, prop): boolean {

                    if (node.type !== 'object') {
                        throw new Error('count can only be used within objects.');
                    }

                    if (!value || typeof value !== 'string') {
                        throw new Error('Group not matched or not a string.');
                    }

                    if (typeof prop !== 'string') {
                        throw new Error('Second argument must be a string.');
                    }

                    if (value.length > 2) {
                        node.value[prop] = value.length;
                    }

                    return value.length > 2;
                }
            }
        });

        expect(parse('(1234)')).to.deep.equal({size: 4});
        expect(parse('(1234567890)')).to.deep.equal({size: 10});
        expect(parse('(12)')).to.deep.equal(null);
    });

    it('Should resolve variables used as argument', () => {
        const parse = compile(`
            entry [object:
                def chars = [(a - z)+]
                count($chars, size, $foo)
            ]
        `, {
            functions: {
                count({node}, chars, prop, foo): boolean {

                    if (node.type !== 'object') {
                        throw new Error('count can only be used within objects.');
                    } else if (foo !== null) {
                        throw new Error('Foo should be null.');
                    }

                    if (chars && typeof chars === 'string' && typeof prop === 'string' && prop.length) {
                        node.value[prop] = chars.length;
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

    it('Should throw an error if a function is not defined', () => {
        const parse = compile(`
            entry [count([(0 - 9)+])]
        `);

        expect(() => parse('(12)')).to.throw();
    });

    it('Should forward errors', () => {
        const parse = compile(`
            entry [throwError()]
        `, {
            functions: {
                throwError(): boolean {
                    throw new Error('Error');
                }
            }
        });

        expect(() => parse('')).to.throw();
    });
});
