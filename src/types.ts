export interface InputObject {}

export type Whatever = string | [] | object | Map<any, any> | Set<any>

export interface OutputTransformer {
    (
        generated: Whatever,
        value: unknown,
        prop: string,
        inputObject: InputObject,
        transformedFn: TransformedFn
    ): Whatever
    defaultOutput: () => Whatever
    unsupportedHandler?: (
        generated: Whatever,
        value: unknown,
        prop: string,
        inputObject: InputObject,
        transformedFn: TransformedFn
    ) => Whatever
    camelCaseReducer?(acc: string[], cc: string, i: number): string[]
}

export interface Definition {
    key: string
    keys: string[]
    map: { [key: string]: unknown }
    parsers: []
    fn: []
}

export interface Options {
    autoCamelCase: boolean
    hasOwnPropertyCheck: false
    [key: string]: unknown
}

export type Props = [string[], null | { [key: string]: unknown } | undefined, Parser[] | undefined][]

export interface TransformedFn {
    (InputObject): Whatever
    registry: Map<string, Definition>
    outputTransformer: OutputTransformer
    options: Partial<Options>
    setOptions(options: Partial<Options>): TransformedFn
    setOutputTransformer(outputTransformer: OutputTransformer): TransformedFn
    setProps(props: Props): TransformedFn
    toValue(prop: string, value: unknown)
}

export declare type Parser = (
    value: unknown,
    prop: string,
    transformedFn: TransformedFn,
    inputObject: InputObject,
    definition: Definition
) => unknown
