// @ts-nocheck

import transformed from '@'

const stringConcatOutputTransformer = (output, input, prop) => output + input + prop
stringConcatOutputTransformer.defaultOutput = () => ''

describe('transformed', () => {
    describe('instance', () => {
        it('can create', () => {
            const instance = transformed()
            expect(typeof instance).toBe('function')
        })
        it('has correct APIs', () => {
            const instance = transformed()
            expect(instance).toHaveProperty(
                'registry',
                'outputTransformer',
                'options',
                'setOptions',
                'setOutputTransformer',
                'setProps',
                'toValue'
            )
        })
        it(`will return empty object by default`, () => {
            const instance = transformed()
            expect(Object.keys(instance()).length).toBe(0)
        })
        it(`.setOptions can set options`, () => {
            const instance = transformed().setOptions({ foo: 'bar', autoCamelCase: true })
            expect(instance.options).toStrictEqual({
                autoCamelCase: true,
                hasOwnPropertyCheck: false,
                foo: 'bar',
                toValueCache: true
            })
        })
        it(`.setProps can set props => simple prop`, () => {
            const instance = transformed().setProps([[['foo']]])
            expect(instance({ foo: 11 })).toStrictEqual({ foo: 11 })
        })
        it(`.setOutputTransformer can set output transformer => simple prop`, () => {
            const instance = transformed()
                .setProps([[['foo']]])
                .setOutputTransformer(stringConcatOutputTransformer)
            expect(instance({ foo: 11 })).toBe('11foo')
        })
        it(`.toValue can return generated value`, () => {
            const instance = transformed().setProps([[['foo']]])
            expect(instance.toValue('foo', 11)).toBe(11)
        })
        it(`"autoCamelCase" option can automatically generate camelCased version of a dash based prop`, () => {
            const instance = transformed()
                .setOptions({ autoCamelCase: true })
                .setProps([[['foo-bar']]])
            expect(instance.toValue('fooBar', 11)).toBe(11)
        })
        it(`will ignore non-existing props by default`, () => {
            const instance = transformed()
            expect(instance({ foo: 10 })).toStrictEqual({})
        })
        it(`will "let through" unsupported props if "unsupported: true"`, () => {
            const instance = transformed()
            expect(instance({ foo: 10, bar: 11, unsupported: true })).toStrictEqual({ foo: 10, bar: 11 })
        })
        it(`will "let through" unsupported prop if it's specified as array`, () => {
            const instance = transformed()
            expect(instance({ foo: 10, bar: 11, unsupported: ['foo'] })).toStrictEqual({ foo: 10 })
        })
        it(`can handle value maps`, () => {
            const instance = transformed().setProps([[['foo'], { 10: 20 }]])
            expect(instance({ foo: 10 })).toStrictEqual({ foo: 20 })
        })
        it(`can handle object based value maps`, () => {
            const instance = transformed().setProps({ foo: { 10: 20 } })
            expect(instance({ foo: 10 })).toStrictEqual({ foo: 20 })
        })
        it(`can re-configure maps using object based value maps`, () => {
            const instance = transformed()
                .setProps([[['foo'], { 10: 20 }]])
                .setProps({ foo: { 100: 200 } })
            // Order is important, we want to see if old values working also after setting new
            expect(instance({ foo: 100 })).toStrictEqual({ foo: 200 })
            expect(instance({ foo: 10 })).toStrictEqual({ foo: 20 })
        })
        it(`can handle a custom handler`, () => {
            const instance = transformed().setProps([[['foo'], null, [input => input * 2]]])
            expect(instance({ foo: 10 })).toStrictEqual({ foo: 20 })
        })
        it(`can handle multiple custom handlers`, () => {
            const instance = transformed().setProps([[['foo'], null, [input => input * 2, input => input * 2]]])
            expect(instance({ foo: 10 })).toStrictEqual({ foo: 40 })
        })
    })
})
