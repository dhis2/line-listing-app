import {
    analyzeDimensionsInLayout,
    validateEventButton,
    validateEnrollmentButton,
    validateTrackedEntityButton,
    validateButtons,
} from '../buttonValidation.js'
import {
    PROGRAM_TYPE_WITH_REGISTRATION,
    PROGRAM_TYPE_WITHOUT_REGISTRATION,
} from '../programTypes.js'

describe('analyzeDimensionsInLayout', () => {
    it('returns empty analysis for null layout', () => {
        const result = analyzeDimensionsInLayout(null, {})

        expect(result).toEqual({
            dimensionCount: 0,
            uniquePrograms: new Set(),
            uniqueStages: new Set(),
            programTypes: new Set(),
            hasDimensions: false,
            hasMixedProgramTypes: false,
        })
    })

    it('returns empty analysis for layout with no dimensions', () => {
        const layout = {
            columns: [],
            filters: [],
        }

        const result = analyzeDimensionsInLayout(layout, {})

        expect(result.dimensionCount).toBe(0)
        expect(result.uniquePrograms.size).toBe(0)
        expect(result.uniqueStages.size).toBe(0)
        expect(result.programTypes.size).toBe(0)
        expect(result.hasDimensions).toBe(false)
        expect(result.hasMixedProgramTypes).toBe(false)
    })

    it('identifies single program and single stage from metadata', () => {
        const layout = {
            columns: ['stageId1.dimension1', 'stageId1.dimension2'],
            filters: ['stageId1.dimension3'],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Program 1',
                programType: PROGRAM_TYPE_WITHOUT_REGISTRATION,
                programStages: [{ id: 'stageId1', name: 'Stage 1' }],
            },
        }

        const result = analyzeDimensionsInLayout(layout, metadata)

        expect(result.dimensionCount).toBe(3)
        expect(result.uniqueStages.size).toBe(1)
        expect(result.uniqueStages.has('stageId1')).toBe(true)
        expect(result.uniquePrograms.size).toBe(1)
        expect(result.uniquePrograms.has('programId1')).toBe(true)
        expect(result.programTypes.size).toBe(1)
        expect(result.programTypes.has(PROGRAM_TYPE_WITHOUT_REGISTRATION)).toBe(
            true
        )
        expect(result.hasDimensions).toBe(true)
        expect(result.hasMixedProgramTypes).toBe(false)
    })

    it('identifies multiple program stages from same program', () => {
        const layout = {
            columns: ['stageId1.dimension1', 'stageId2.dimension2'],
            filters: ['stageId3.dimension3'],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Program 1',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [
                    { id: 'stageId1', name: 'Stage 1' },
                    { id: 'stageId2', name: 'Stage 2' },
                    { id: 'stageId3', name: 'Stage 3' },
                ],
            },
        }

        const result = analyzeDimensionsInLayout(layout, metadata)

        expect(result.dimensionCount).toBe(3)
        expect(result.uniqueStages.size).toBe(3)
        expect(result.uniqueStages.has('stageId1')).toBe(true)
        expect(result.uniqueStages.has('stageId2')).toBe(true)
        expect(result.uniqueStages.has('stageId3')).toBe(true)
        expect(result.uniquePrograms.size).toBe(1)
        expect(result.uniquePrograms.has('programId1')).toBe(true)
        expect(result.programTypes.size).toBe(1)
        expect(result.programTypes.has(PROGRAM_TYPE_WITH_REGISTRATION)).toBe(
            true
        )
        expect(result.hasMixedProgramTypes).toBe(false)
    })

    it('identifies multiple programs from 2-part dimension IDs using metadata', () => {
        const layout = {
            columns: ['stageId1.dimension1', 'stageId2.dimension2'],
            filters: ['stageId3.dimension3'],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Program 1',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [
                    { id: 'stageId1', name: 'Stage 1' },
                    { id: 'stageId3', name: 'Stage 3' },
                ],
            },
            programId2: {
                id: 'programId2',
                name: 'Program 2',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [{ id: 'stageId2', name: 'Stage 2' }],
            },
        }

        const result = analyzeDimensionsInLayout(layout, metadata)

        expect(result.dimensionCount).toBe(3)
        expect(result.uniquePrograms.size).toBe(2)
        expect(result.uniquePrograms.has('programId1')).toBe(true)
        expect(result.uniquePrograms.has('programId2')).toBe(true)
        expect(result.uniqueStages.size).toBe(3)
        expect(result.programTypes.size).toBe(1)
        expect(result.programTypes.has(PROGRAM_TYPE_WITH_REGISTRATION)).toBe(
            true
        )
        expect(result.hasMixedProgramTypes).toBe(false)
    })

    it('detects mixed program types (WITH_REGISTRATION and WITHOUT_REGISTRATION)', () => {
        const layout = {
            columns: ['stageId1.dimension1', 'stageId2.dimension2'],
            filters: [],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Program 1',
                programType: PROGRAM_TYPE_WITHOUT_REGISTRATION,
                programStages: [{ id: 'stageId1', name: 'Stage 1' }],
            },
            programId2: {
                id: 'programId2',
                name: 'Program 2',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [{ id: 'stageId2', name: 'Stage 2' }],
            },
        }

        const result = analyzeDimensionsInLayout(layout, metadata)

        expect(result.dimensionCount).toBe(2)
        expect(result.uniquePrograms.size).toBe(2)
        expect(result.programTypes.size).toBe(2)
        expect(result.programTypes.has(PROGRAM_TYPE_WITH_REGISTRATION)).toBe(
            true
        )
        expect(result.programTypes.has(PROGRAM_TYPE_WITHOUT_REGISTRATION)).toBe(
            true
        )
        expect(result.hasMixedProgramTypes).toBe(true)
    })

    it('identifies multiple programs for tracked entity format dimensions', () => {
        const layout = {
            columns: [
                'programId1.stageId1.dimension1',
                'programId2.stageId2.dimension2',
            ],
            filters: ['programId1.stageId3.dimension3'],
        }

        const result = analyzeDimensionsInLayout(layout, {})

        expect(result.dimensionCount).toBe(3)
        expect(result.uniquePrograms.size).toBe(2)
        expect(result.uniquePrograms.has('programId1')).toBe(true)
        expect(result.uniquePrograms.has('programId2')).toBe(true)
        expect(result.uniqueStages.size).toBe(3)
    })

    it('handles dimensions without program or stage info', () => {
        const layout = {
            columns: ['ou', 'pe', 'stageId1.dimension1'],
            filters: [],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Program 1',
                programStages: [{ id: 'stageId1', name: 'Stage 1' }],
            },
        }

        const result = analyzeDimensionsInLayout(layout, metadata)

        expect(result.dimensionCount).toBe(3)
        expect(result.uniqueStages.size).toBe(1)
        expect(result.uniquePrograms.size).toBe(1)
        expect(result.hasDimensions).toBe(true)
    })
})

describe('validateEventButton', () => {
    it('disables when no dimensions', () => {
        const analysis = {
            dimensionCount: 0,
            uniquePrograms: new Set(),
            uniqueStages: new Set(),
            hasDimensions: false,
            hasMixedProgramTypes: false,
        }

        const result = validateEventButton(analysis)

        expect(result.disabled).toBe(true)
        expect(result.reason).toBe('No dimensions in layout')
    })

    it('enables for single stage', () => {
        const analysis = {
            dimensionCount: 3,
            uniquePrograms: new Set(['programId1']),
            uniqueStages: new Set(['stageId1']),
            hasDimensions: true,
            hasMixedProgramTypes: false,
        }

        const result = validateEventButton(analysis)

        expect(result.disabled).toBe(false)
        expect(result.reason).toBeUndefined()
    })

    it('disables for multiple stages', () => {
        const analysis = {
            dimensionCount: 3,
            uniquePrograms: new Set(['programId1']),
            uniqueStages: new Set(['stageId1', 'stageId2']),
            hasDimensions: true,
            hasMixedProgramTypes: false,
        }

        const result = validateEventButton(analysis)

        expect(result.disabled).toBe(true)
        expect(result.reason).toBe('Multiple program stages present in layout')
    })

    it('disables for multiple programs', () => {
        const analysis = {
            dimensionCount: 3,
            uniquePrograms: new Set(['programId1', 'programId2']),
            uniqueStages: new Set(['stageId1']),
            hasDimensions: true,
            hasMixedProgramTypes: false,
        }

        const result = validateEventButton(analysis)

        expect(result.disabled).toBe(true)
        expect(result.reason).toBe('Multiple programs present in layout')
    })

    it('enables when no stage or program info (main dimensions only)', () => {
        const analysis = {
            dimensionCount: 2,
            uniquePrograms: new Set(),
            uniqueStages: new Set(),
            hasDimensions: true,
            hasMixedProgramTypes: false,
        }

        const result = validateEventButton(analysis)

        expect(result.disabled).toBe(false)
    })

    it('disables when mixed program types are present', () => {
        const analysis = {
            dimensionCount: 3,
            uniquePrograms: new Set(['programId1', 'programId2']),
            uniqueStages: new Set(['stageId1', 'stageId2']),
            hasDimensions: true,
            hasMixedProgramTypes: true,
        }

        const result = validateEventButton(analysis)

        expect(result.disabled).toBe(true)
        expect(result.reason).toBe(
            'Cannot combine programs with and without registration'
        )
    })
})

describe('validateEnrollmentButton', () => {
    it('disables when no dimensions', () => {
        const analysis = {
            dimensionCount: 0,
            uniquePrograms: new Set(),
            uniqueStages: new Set(),
            hasDimensions: false,
            hasMixedProgramTypes: false,
        }

        const result = validateEnrollmentButton(analysis)

        expect(result.disabled).toBe(true)
        expect(result.reason).toBe('No dimensions in layout')
    })

    it('enables for single program with multiple stages', () => {
        const analysis = {
            dimensionCount: 3,
            uniquePrograms: new Set(['programId1']),
            uniqueStages: new Set(['stageId1', 'stageId2']),
            hasDimensions: true,
            hasMixedProgramTypes: false,
        }

        const result = validateEnrollmentButton(analysis)

        expect(result.disabled).toBe(false)
        expect(result.reason).toBeUndefined()
    })

    it('disables for multiple programs', () => {
        const analysis = {
            dimensionCount: 3,
            uniquePrograms: new Set(['programId1', 'programId2']),
            uniqueStages: new Set(['stageId1', 'stageId2']),
            hasDimensions: true,
            hasMixedProgramTypes: false,
        }

        const result = validateEnrollmentButton(analysis)

        expect(result.disabled).toBe(true)
        expect(result.reason).toBe('Multiple programs present in layout')
    })

    it('enables when no program info (main dimensions only)', () => {
        const analysis = {
            dimensionCount: 2,
            uniquePrograms: new Set(),
            uniqueStages: new Set(),
            hasDimensions: true,
            hasMixedProgramTypes: false,
        }

        const result = validateEnrollmentButton(analysis)

        expect(result.disabled).toBe(false)
    })

    it('disables when mixed program types are present', () => {
        const analysis = {
            dimensionCount: 3,
            uniquePrograms: new Set(['programId1', 'programId2']),
            uniqueStages: new Set(['stageId1', 'stageId2']),
            hasDimensions: true,
            hasMixedProgramTypes: true,
        }

        const result = validateEnrollmentButton(analysis)

        expect(result.disabled).toBe(true)
        expect(result.reason).toBe(
            'Cannot combine programs with and without registration'
        )
    })
})

describe('validateTrackedEntityButton', () => {
    it('disables when no dimensions', () => {
        const analysis = {
            dimensionCount: 0,
            uniquePrograms: new Set(),
            uniqueStages: new Set(),
            hasDimensions: false,
            hasMixedProgramTypes: false,
        }

        const result = validateTrackedEntityButton(analysis, true)

        expect(result.disabled).toBe(true)
        expect(result.reason).toBe('No dimensions in layout')
    })

    it('disables when tracked entity not supported', () => {
        const analysis = {
            dimensionCount: 3,
            uniquePrograms: new Set(['programId1']),
            uniqueStages: new Set(['stageId1']),
            hasDimensions: true,
            hasMixedProgramTypes: false,
        }

        const result = validateTrackedEntityButton(analysis, false)

        expect(result.disabled).toBe(true)
        expect(result.reason).toBe(
            'Data source does not support tracked entities'
        )
    })

    it('enables for single program with multiple stages when supported', () => {
        const analysis = {
            dimensionCount: 3,
            uniquePrograms: new Set(['programId1']),
            uniqueStages: new Set(['stageId1', 'stageId2']),
            hasDimensions: true,
            hasMixedProgramTypes: false,
        }

        const result = validateTrackedEntityButton(analysis, true)

        expect(result.disabled).toBe(false)
        expect(result.reason).toBeUndefined()
    })

    it('enables for multiple programs when supported', () => {
        const analysis = {
            dimensionCount: 3,
            uniquePrograms: new Set(['programId1', 'programId2']),
            uniqueStages: new Set(['stageId1', 'stageId2']),
            hasDimensions: true,
            hasMixedProgramTypes: false,
        }

        const result = validateTrackedEntityButton(analysis, true)

        // Tracked entities can span multiple programs
        expect(result.disabled).toBe(false)
        expect(result.reason).toBeUndefined()
    })

    it('disables when mixed program types are present', () => {
        const analysis = {
            dimensionCount: 3,
            uniquePrograms: new Set(['programId1', 'programId2']),
            uniqueStages: new Set(['stageId1', 'stageId2']),
            hasDimensions: true,
            hasMixedProgramTypes: true,
        }

        const result = validateTrackedEntityButton(analysis, true)

        expect(result.disabled).toBe(true)
        expect(result.reason).toBe(
            'Cannot combine programs with and without registration'
        )
    })
})

describe('validateButtons', () => {
    it('validates all buttons correctly for empty layout', () => {
        const layout = {
            columns: [],
            filters: [],
        }

        const result = validateButtons(layout, {}, true)

        expect(result.event.disabled).toBe(true)
        expect(result.enrollment.disabled).toBe(true)
        expect(result.trackedEntity.disabled).toBe(true)
    })

    it('validates all buttons correctly for single stage layout', () => {
        const layout = {
            columns: ['stageId1.dimension1', 'stageId1.dimension2'],
            filters: ['ou'],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Program 1',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [{ id: 'stageId1', name: 'Stage 1' }],
            },
        }

        const result = validateButtons(layout, metadata, true)

        expect(result.event.disabled).toBe(false)
        expect(result.enrollment.disabled).toBe(false)
        expect(result.trackedEntity.disabled).toBe(false)
    })

    it('validates all buttons correctly for multiple stages from same program', () => {
        const layout = {
            columns: ['stageId1.dimension1', 'stageId2.dimension2'],
            filters: ['ou'],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Program 1',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [
                    { id: 'stageId1', name: 'Stage 1' },
                    { id: 'stageId2', name: 'Stage 2' },
                ],
            },
        }

        const result = validateButtons(layout, metadata, true)

        expect(result.event.disabled).toBe(true)
        expect(result.event.reason).toBe(
            'Multiple program stages present in layout'
        )
        expect(result.enrollment.disabled).toBe(false)
        expect(result.trackedEntity.disabled).toBe(false)
    })

    it('validates all buttons correctly for multiple programs (3-part IDs)', () => {
        const layout = {
            columns: [
                'programId1.stageId1.dimension1',
                'programId2.stageId2.dimension2',
            ],
            filters: [],
        }

        const result = validateButtons(layout, {}, true)

        expect(result.event.disabled).toBe(true)
        expect(result.event.reason).toBe('Multiple programs present in layout')
        expect(result.enrollment.disabled).toBe(true)
        expect(result.enrollment.reason).toBe(
            'Multiple programs present in layout'
        )
        // Tracked entity should be enabled - can span multiple programs
        expect(result.trackedEntity.disabled).toBe(false)
    })

    it('validates all buttons correctly for multiple programs (2-part IDs)', () => {
        const layout = {
            columns: ['stageId1.dimension1', 'stageId2.dimension2'],
            filters: [],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Program 1',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [{ id: 'stageId1', name: 'Stage 1' }],
            },
            programId2: {
                id: 'programId2',
                name: 'Program 2',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [{ id: 'stageId2', name: 'Stage 2' }],
            },
        }

        const result = validateButtons(layout, metadata, true)

        expect(result.event.disabled).toBe(true)
        expect(result.event.reason).toBe('Multiple programs present in layout')
        expect(result.enrollment.disabled).toBe(true)
        expect(result.enrollment.reason).toBe(
            'Multiple programs present in layout'
        )
        // Tracked entity should be enabled - can span multiple programs
        expect(result.trackedEntity.disabled).toBe(false)
    })

    it('validates tracked entity button as disabled when not supported', () => {
        const layout = {
            columns: ['stageId1.dimension1'],
            filters: [],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Program 1',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [{ id: 'stageId1', name: 'Stage 1' }],
            },
        }

        const result = validateButtons(layout, metadata, false)

        expect(result.event.disabled).toBe(false)
        expect(result.enrollment.disabled).toBe(false)
        expect(result.trackedEntity.disabled).toBe(true)
        expect(result.trackedEntity.reason).toBe(
            'Data source does not support tracked entities'
        )
    })

    it('includes dimension analysis in result', () => {
        const layout = {
            columns: ['stageId1.dimension1', 'stageId2.dimension2'],
            filters: [],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Program 1',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [
                    { id: 'stageId1', name: 'Stage 1' },
                    { id: 'stageId2', name: 'Stage 2' },
                ],
            },
        }

        const result = validateButtons(layout, metadata, true)

        expect(result.dimensionAnalysis).toBeDefined()
        expect(result.dimensionAnalysis.dimensionCount).toBe(2)
        expect(result.dimensionAnalysis.uniqueStages.size).toBe(2)
    })

    it('correctly parses 2-part dimension IDs using metadata to detect programs', () => {
        // This test validates the bug fix: dimensions like 'stage1.dimension1'
        // from multiple stages of the SAME program should allow enrollment/TE
        const layout = {
            columns: ['stage1.dimension1', 'stage2.dimension2'],
            filters: [],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Program 1',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [
                    { id: 'stage1', name: 'Stage 1' },
                    { id: 'stage2', name: 'Stage 2' },
                ],
            },
        }

        const result = validateButtons(layout, metadata, true)

        // Should identify 2 stages from 1 program
        expect(result.dimensionAnalysis.uniqueStages.size).toBe(2)
        expect(result.dimensionAnalysis.uniquePrograms.size).toBe(1)

        // Event button should be disabled (multiple stages)
        expect(result.event.disabled).toBe(true)
        expect(result.event.reason).toBe(
            'Multiple program stages present in layout'
        )

        // Enrollment button should be enabled (only one program)
        expect(result.enrollment.disabled).toBe(false)

        // Tracked entity button should be enabled (only one program)
        expect(result.trackedEntity.disabled).toBe(false)
    })

    it('disables all buttons when mixed program types are present', () => {
        const layout = {
            columns: ['stageId1.dimension1', 'stageId2.dimension2'],
            filters: ['ou'],
        }
        const metadata = {
            programId1: {
                id: 'programId1',
                name: 'Event Program',
                programType: PROGRAM_TYPE_WITHOUT_REGISTRATION,
                programStages: [{ id: 'stageId1', name: 'Stage 1' }],
            },
            programId2: {
                id: 'programId2',
                name: 'Tracker Program',
                programType: PROGRAM_TYPE_WITH_REGISTRATION,
                programStages: [{ id: 'stageId2', name: 'Stage 2' }],
            },
        }

        const result = validateButtons(layout, metadata, true)

        // All buttons should be disabled with the mixed program types reason
        expect(result.event.disabled).toBe(true)
        expect(result.event.reason).toBe(
            'Cannot combine programs with and without registration'
        )
        expect(result.enrollment.disabled).toBe(true)
        expect(result.enrollment.reason).toBe(
            'Cannot combine programs with and without registration'
        )
        expect(result.trackedEntity.disabled).toBe(true)
        expect(result.trackedEntity.reason).toBe(
            'Cannot combine programs with and without registration'
        )

        // Dimension analysis should detect mixed program types
        expect(result.dimensionAnalysis.hasMixedProgramTypes).toBe(true)
        expect(result.dimensionAnalysis.programTypes.size).toBe(2)
    })
})
