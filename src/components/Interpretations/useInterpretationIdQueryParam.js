import { parse } from 'query-string'
import history from '../../modules/history'

const useInterpretationIdQueryParam = visualization => {
    const { interpretationId } = parse(history.location.search)
    const isValidId =
        interpretationId &&
        Array.isArray(visualization.interpretations) &&
        visualization.interpretations.length > 0 &&
        visualization.interpretations.some(({ id }) => id === interpretationId)

    return isValidId ? interpretationId : null
}

export { useInterpretationIdQueryParam }
