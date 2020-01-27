import {maybe}                from '../../tools/maybe';
import {UseStatement}         from '../../types';
import {parseDefineStatement} from './define';

export const parseUseStatement = maybe<UseStatement>(stream => {
    return {
        ...parseDefineStatement(stream),
        type: 'use'
    } as UseStatement;
});
