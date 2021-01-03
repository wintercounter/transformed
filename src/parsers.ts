import { Parser } from '@/types'

export const parseMapValue: Parser = (input, prop, transformedFn) => {
    return transformedFn.registry.get(prop)?.map?.[input as string] ?? input
}
