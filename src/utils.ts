import { Parser } from '@/types'

/**
 * Will turn any string kebab-case into camel-case.
 *
 * @example
 * toCamelCase('dark-blue') // darkBlue
 * toCamelCase('--color-light-pink') // colorLightPink
 * toCamelCase('yellow') // yellow
 * toCamelCase(':hover') // :hover
 */
export const toCamelCase = (t: string): string => t.replace(/^-+/, '').replace(/-./g, ([, l]) => l.toUpperCase())

/**
 * Composes multiple functions into one
 */
export const compose: (parsers: Parser[]) => Parser = parsers => {
    return (value, prop, transformedFn, inputObject, definition) => {
        for (const f of parsers) {
            value = f(value, prop, transformedFn, inputObject, definition)
        }
        return value
    }
}

export const constructParsers = (existing = [], parsers): Parser[] => {
    // Let's create a copy
    parsers = [...parsers]
    const extendIndex = parsers.indexOf('...')
    if (extendIndex > -1) {
        parsers.splice(extendIndex, 1, ...existing)
    } else {
        parsers = [...existing, ...parsers]
    }
    return parsers
}
