export interface InputObject {}

export type Whatever = string | [] | object | Map<any, any> | Set<any>

export type GeneralOutputHandler = (
    generated: Whatever,
    input: Whatever,
    prop: string,
    inputObject: InputObject,
    transformedFn: TransformedFn
) => Whatever

export interface OutputTransformer {
    (
        generated: Whatever,
        input: Whatever,
        prop: string,
        inputObject: InputObject,
        transformedFn: TransformedFn
    ): Whatever
    defaultOutput: () => Whatever
    unsupportedHandler?: GeneralOutputHandler
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

export type PropsKeys = string[]
export type PropsMaps = null | {
    [key: string]: unknown
}
export type PropsParsers = Parser[]
export type Prop = [PropsKeys] | [PropsKeys, PropsMaps] | [PropsKeys, PropsMaps, PropsParsers]
export type Props = Prop[]

export interface TransformedFn {
    (InputObject): Whatever
    registry: Map<string, Definition>
    outputTransformer: Partial<OutputTransformer>
    options: Partial<Options>
    setOptions(options: Partial<Options>): TransformedFn
    setOutputTransformer(outputTransformer: OutputTransformer): TransformedFn
    setProps(props: Props): TransformedFn
    toValue(prop: string, value: unknown)
}

export interface Parser {
    (
        input: unknown,
        prop: string,
        transformedFn: TransformedFn,
        inputObject?: InputObject,
        definition?: Definition
    ): unknown
}
