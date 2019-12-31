import {failAll} from './tools';

describe('[AST] Tags', () => {

    failAll([
        '<abc> = ["A"#]',
        '<abc> = [<hello #oho>]',
        '<abc> = []+#abc'
    ]);
});
