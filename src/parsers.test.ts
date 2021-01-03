// @ts-nocheck

import transformed from '@'
import { parseMapValue } from '@/parsers'

const transform = transformed().setProps([
    [['foo'], { bar: 1 }],
    [['bool'], { [true]: 1, [false]: 0 }]
])

describe('parsers', () => {
    describe('parseMapValue', () => {
        it('from-to', () => {
            expect(parseMapValue('bar', 'foo', transform)).toBe(1)
        })

        it('true/false', () => {
            expect(parseMapValue(true, 'bool', transform)).toBe(1)
            expect(parseMapValue(false, 'bool', transform)).toBe(0)
        })
    })
})
