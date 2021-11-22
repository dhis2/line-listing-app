import { parse, stringify } from 'query-string'
import history from '../../modules/history.js'

const useInterpretationIdQueryParam = () => {
    const { interpretationId } = parse(history.location.search)

    return interpretationId || null
}

const removeInterpretationIdQueryParam = () => {
    const parsed = parse(history.location.search)
    // Keep all other query params in tact
    const parsedWithoutInterpretationId = Object.entries(parsed).reduce(
        (acc, [key, value]) => {
            if (key !== 'interpretationId') {
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

export { useInterpretationIdQueryParam, removeInterpretationIdQueryParam }
