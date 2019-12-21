/**
 * Convert param path to entry path
 */
export const convert = (path: string): string => path ? `/${path}` : '/'