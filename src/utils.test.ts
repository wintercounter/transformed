// @ts-nocheck

import { constructParsers } from '@/utils'

describe('utils', () => {
    describe('constructParsers', () => {
        it('can construct 2 arrays', () => {
            expect(constructParsers([1, 2], [3, 4])).toStrictEqual([1, 2, 3, 4])
        })
        it('can handle empty existing', () => {
            expect(constructParsers([], [3, 4])).toStrictEqual([3, 4])
        })
        it('can handle empty existing and empty parsers', () => {
            expect(constructParsers([], [])).toStrictEqual([])
        })
        it('can handle prepend', () => {
            expect(constructParsers([1, 2], ['...', 3, 4])).toStrictEqual([1, 2, 3, 4])
        })
        it('can handle append', () => {
            expect(constructParsers([1, 2], [3, 4, '...'])).toStrictEqual([3, 4, 1, 2])
        })
        it('can handle insert in the middle', () => {
            expect(constructParsers([1, 2], [3, '...', 4])).toStrictEqual([3, 1, 2, 4])
        })
    })
})
