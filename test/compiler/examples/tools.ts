import {expect}  from 'chai';
import {compile} from '../../../src';

type TestType = Array<string | [string, object]>

export default (spec: string): (tests: TestType) => void => {
    const parse = compile(spec);

    return (tests: TestType): void => {
        for (const test of tests) {
            if (Array.isArray(test)) {
                const [str, expectedResult] = test;

                it(`Should parse "${str}"`, () => {
                    expect(parse(str)).to.deep.equal(expectedResult);
                });
            } else {
                it(`Should return null for "${test}"`, () => {
                    expect(parse(test)).to.equal(null);
                });
            }
        }
    };
};
