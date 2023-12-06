import { DIMENSION_ID_EVENT_DATE } from '../../src/modules/dimensionConstants.js'
import {
    TEST_REL_PE_LAST_YEAR,
    TEST_REL_PE_LAST_5_YEARS,
    WHO_RMNCH_TRACKER_PROGRAM,
} from '../data/index.js'
import { addConditions } from './conditions.js'
import { selectEventWithProgramDimensions } from './dimensions.js'
import { clickMenubarUpdateButton } from './menubar.js'
import { selectRelativePeriod } from './period.js'
import { goToStartPage } from './startScreen.js'

export const createAOWithOptionSet = () => {
    const eventProgram = WHO_RMNCH_TRACKER_PROGRAM

    goToStartPage()

    selectEventWithProgramDimensions({
        programName: eventProgram.programName,
        stageName: eventProgram.stageName,
        dimensions: [
            'First name',
            'Last name',
            'WHOMCH Clinical impression of pre-eclampsia',
            'WHOMCH Confirmed or suspected infection',
            'WHOMCH Pain medication given',
        ],
    })

    addConditions('First name', [
        {
            conditionName: 'exactly',
            value: 'sandra',
        },
    ])
    addConditions('Last name', [
        {
            conditionName: 'exactly',
            value: 'cook',
        },
    ])

    selectRelativePeriod({
        label: eventProgram[DIMENSION_ID_EVENT_DATE],
        period: TEST_REL_PE_LAST_YEAR,
    })

    selectRelativePeriod({
        label: eventProgram[DIMENSION_ID_EVENT_DATE],
        period: TEST_REL_PE_LAST_5_YEARS,
    })

    clickMenubarUpdateButton()
}
