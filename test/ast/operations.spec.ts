import {failAll} from './tools';

describe('[AST] Operations', () => {

    failAll([
        '<abc> = [push]',
        '<abc> = [def]',
        '<abc> = [rem]',
        '<abc> = [void]',
        '<abc> = [void ab]',
        '<abc> = [def s]',
        '<abc> = [throw]',
        '<abc> = [def s = ]',
        '<abc> = [def s = abc]',
    ]);
});
