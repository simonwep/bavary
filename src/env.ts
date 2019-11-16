declare const VERSION: string;

// Current version
export const ENV_VERSION = typeof VERSION === 'undefined' ? 'unknown' : VERSION;
