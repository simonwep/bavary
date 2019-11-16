import chalk from 'chalk';
import path  from 'path';

export function createPathString(file: string): string {
    return chalk`{cyan ${path.basename(file)}} {reset (in ${path.dirname(file)})}`;
}
