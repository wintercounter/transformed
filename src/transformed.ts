import { toCamelCase, compose, constructParsers } from '@/utils'
import { parseMapValue } from '@/parsers'
import { Options, OutputTransformer, Parser, Props, TransformedFn } from '@/types'

const defaultTransformer = (output, value, prop) => {
    output[prop] = value
    return output
}
defaultTransformer.defaultOutput = () => ({})
defaultTransformer.unsupportedHandler = defaultTransformer

export default function transformed(): TransformedFn {
    const registry = new Map()
    let outputTransformer: OutputTransformer = defaultTransformer
    const options: Options = {
        autoCamelCase: false,
        hasOwnPropertyCheck: false,
        toValueCache: true
    }

    // Main
    const transformedFn: TransformedFn = inputObject => {
        let output = outputTransformer.defaultOutput()

        // Iterate through each key
        // eslint-disable-next-line no-restricted-syntax
        for (const prop in inputObject) {
            if (options.hasOwnPropertyCheck && !Object.prototype.hasOwnProperty.call(prop, inputObject)) continue

            const definition = registry.get(prop)

            if (prop === 'unsupported') {
                // skip this key, it doesn't need any processing
            }
            // Found such prop, process it
            else if (definition) {
                // If input value is a function, call it first
                const inputValue =
                    'function' === typeof inputObject[prop]
                        ? inputObject[prop](prop, transformedFn, inputObject)
                        : inputObject[prop]
                // Let's call the composed handler to get our final value
                const value = definition.fn(inputValue, prop, transformedFn, inputObject, definition)

                // We don't handle undefined values
                if (value !== undefined) {
                    output = outputTransformer(output, value, prop, inputObject, transformedFn)
                }
            }
            // Handle unsupported only if key is allowed
            else if (
                inputObject.unsupported === true ||
                (Array.isArray(inputObject.unsupported) && inputObject.unsupported.includes(prop))
            ) {
                output = outputTransformer.unsupportedHandler
                    ? outputTransformer.unsupportedHandler(output, inputObject[prop], prop, inputObject, transformedFn)
                    : output
            }
        }
        return output
    }

    // Set properties
    transformedFn.registry = registry
    transformedFn.outputTransformer = outputTransformer
    transformedFn.options = options

    transformedFn.setOptions = _ => {
        Object.assign(options, _)
        return transformedFn
    }

    transformedFn.setOutputTransformer = _ => {
        if (!_ || !_.defaultOutput) throw 'Output transformer MUST have a `defaultOutput` specified!'
        outputTransformer = transformedFn.outputTransformer = _
        return transformedFn
    }

    transformedFn.setProps = _ => {
        // Let's transform object inputs first
        if (!Array.isArray(_) && typeof _ === 'object') {
            _ = Object.entries(_).reduce((acc, [key, map]) => {
                acc.push([[key], map as { [key: string]: unknown }])
                return acc
            }, [] as Props)
        }
        for (const [__keys, map = null, _parsers = [], descriptorOptions = {}] of _) {
            const existing = registry.get(__keys[0])
            const parsers: Parser[] = constructParsers(existing?.parsers, _parsers)

            // Add value map functionality if map is defined for this prop
            // Only add if parseMapValue does not exists yet, we don't want to run it twice
            const fn = compose(map && !parsers.includes(parseMapValue) ? [parseMapValue, ...parsers] : parsers)

            // Let's just use existing keys if already exists
            const _keys = existing?.keys || __keys
            const keys = options.autoCamelCase
                ? // Convert to camel case if needed
                  _keys.reduce((acc, k, i) => {
                      let cc = toCamelCase(k)
                      // Only store keys that are different when it's converted
                      if (cc !== k) {
                          if (outputTransformer.camelCaseReducer) {
                              acc = outputTransformer.camelCaseReducer(acc, cc, i)
                          } else {
                              acc.push(cc)
                          }
                      }
                      return acc
                  }, _keys)
                : _keys
            // We will save this definition for each key
            const definition = {
                keys,
                map: { ...map, ...existing?.map },
                parsers,
                toValueCache: options.toValueCache ? new Map() : null,
                fn,
                ...descriptorOptions
            }

            for (const key of keys) {
                registry.set(key, definition)
            }
        }
        return transformedFn
    }

    transformedFn.toValue = (prop, value) => {
        const definition = registry.get(prop)
        if (!definition) return value
        let result = undefined

        if (options.toValueCache && typeof value !== 'object') {
            if ((result = definition.toValueCache.get(value)) === undefined) {
                result = definition.fn(value, prop, transformedFn, undefined, definition)
                definition.toValueCache.set(value, result)
            }
        }

        return result !== undefined ? result : definition.fn(value, prop, transformedFn, undefined, definition)
    }

    transformedFn.use = fn => {
        fn(transformedFn)
        return transformedFn
    }

    return transformedFn
}
