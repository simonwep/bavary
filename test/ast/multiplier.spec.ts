import {failAll} from './tools';

describe('[AST] Multipliers', () => {

    failAll([
        '<abc> = ["A" | "B"]++',
        '<abc> = ["B"]~',
        '<abc> = ["B"] +',
        '<abc> = ["A" | "B" | ["1" | "2"]{5,4}]'
    ]);
});
