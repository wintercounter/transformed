// @ts-nocheck

import transformed from '@'
import { parseMapValue } from '@/parsers'

const transform = transformed().setProps([
    [['foo'], { bar: 1 }]
])

describe('parsers', () => {
    describe('parseMapValue', () => {
        it('from-to', () => {
            expect(parseMapValue('bar', 'foo', transform)).toBe(1)
        })
    })
})
