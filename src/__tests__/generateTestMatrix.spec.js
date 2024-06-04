const { getAllFiles, createGroups } = require('../generateTestMatrix.js')

describe('generateTestMatrix', () => {
    describe('getAllFiles', () => {
        it('should return an array of file paths', () => {
            const mockFs = require('fs')
            jest.spyOn(mockFs, 'readdirSync').mockReturnValue([
                'file1.js',
                'file2.js',
            ])
            jest.spyOn(mockFs, 'statSync').mockReturnValue({
                isDirectory: () => false,
            })

            const result = getAllFiles('fakepath')
            expect(result).toEqual(['fakepath/file1.js', 'fakepath/file2.js'])
        })
    })

    describe('createGroups', () => {
        it('should group files into the specified number of groups', () => {
            const files = ['test1.js', 'test2.js', 'test3.js']
            const groups = createGroups(files, 2)

            expect(groups.length).toBe(2)
            expect(groups[0].tests).toContain('test1.js')
            expect(groups[0].tests).toContain('test3.js')
            expect(groups[1].tests).toContain('test2.js')
        })
    })
})
