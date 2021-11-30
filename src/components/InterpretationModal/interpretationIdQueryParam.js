import { parse, stringify } from 'query-string'
import history from '../../modules/history.js'

const options = { parseBooleans: true }

const useInterpretationQueryParams = () => {
    const { interpretationId, initialFocus } = parse(
        history.location.search,
        options
    )

    return { interpretationId, initialFocus }
}

const removeInterpretationQueryParams = () => {
    const parsed = parse(history.location.search, options)
    // Keep all other query params in tact
    const parsedWithoutInterpretationId = Object.entries(parsed).reduce(
        (acc, [key, value]) => {
            if (key !== 'interpretationId' && key !== 'initialFocus') {
                acc[key] = value
            }
            return acc
        },
        {}
    )
    const search = stringify(parsedWithoutInterpretationId)

    history.push({
        ...history.location,
        search,
    })
}

export { useInterpretationQueryParams, removeInterpretationQueryParams }
