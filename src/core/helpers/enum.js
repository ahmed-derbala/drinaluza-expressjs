export const createEnum = (...keys) => Object.fromEntries(keys.map((key) => [key, key]))
