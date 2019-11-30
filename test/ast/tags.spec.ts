import {failAll} from './tools';

describe('[AST] Tags', () => {

    failAll([
        '<abc> = ["A"#]',
        '<abc> = []+#abc'
    ]);
});
