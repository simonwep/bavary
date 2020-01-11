import {failAll} from './tools';

describe('[AST] Multipliers', () => {

    failAll([
        '[\'A\']{2,',
        '<abc> = ["A" | "B"]++',
        '<abc> = ["B"]~',
        '<abc> = ["B"] +',
        '<abc> = ["A" | "B" | ["1" | "2"]{5,4}]'
    ]);
});
