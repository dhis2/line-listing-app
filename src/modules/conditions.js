export const parseConditionsStringToArray = conditionsString =>
    conditionsString?.match(/[^:]+:[^:]+/g) || conditionsString || []

export const parseConditionsArrayToString = conditionsArray =>
    conditionsArray.join(':')
