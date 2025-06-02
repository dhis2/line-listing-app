import { getDimensionMetadataFields } from '../modules/visualization.js'

const dimensionFields = () =>
    'dimension,dimensionType,filter,program[id],programStage[id],optionSet[id],valueType,legendSet[id],repetition,items[dimensionItem~rename(id)]'

export const VISUALIZATION_QUERY = {
    eventVisualization: {
        resource: 'eventVisualizations',
        id: ({ id }) => id,
        // TODO: check if this list is what we need/want (copied from old ER)
        params: ({ nameProp }) => ({
            fields: [
                '*',
                `columns[${dimensionFields}]`,
                `rows[${dimensionFields}]`,
                `filters[${dimensionFields}]`,
                `program[id,programType,${nameProp}~rename(name),displayEnrollmentDateLabel,displayIncidentDateLabel,displayIncidentDate,programStages[id,displayName~rename(name),repeatable]]`,
                'programStage[id,displayName~rename(name),displayExecutionDateLabel,displayDueDateLabel,hideDueDate,repeatable]',
                `programDimensions[id,${nameProp}~rename(name),enrollmentDateLabel,incidentDateLabel,programType,displayIncidentDate,displayEnrollmentDateLabel,displayIncidentDateLabel,programStages[id,${nameProp}~rename(name),repeatable,hideDueDate,displayExecutionDateLabel,displayDueDateLabel]]`,
                'access',
                'href',
                ...getDimensionMetadataFields(),
                'dataElementDimensions[legendSet[id,name],dataElement[id,name]]',
                'legend[set[id,displayName],strategy,style,showKey]',
                'trackedEntityType[id,displayName~rename(name)]',
                '!interpretations',
                '!userGroupAccesses',
                '!publicAccess',
                '!displayDescription',
                '!rewindRelativePeriods',
                '!userOrganisationUnit',
                '!userOrganisationUnitChildren',
                '!userOrganisationUnitGrandChildren',
                '!externalAccess',
                '!relativePeriods',
                '!columnDimensions',
                '!rowDimensions',
                '!filterDimensions',
                '!organisationUnitGroups',
                '!itemOrganisationUnitGroups',
                '!indicators',
                '!dataElements',
                '!dataElementOperands',
                '!dataElementGroups',
                '!dataSets',
                '!periods',
                '!organisationUnitLevels',
                '!organisationUnits',
                '!user',
            ],
        }),
    },
}

const VISUALIZATION_NAME_DESC_QUERY = {
    eventVisNameDesc: {
        resource: 'eventVisualizations',
        id: ({ id }) => id,
        params: {
            fields: 'name,displayName,description,displayDescription',
        },
    },
}

const VISUALIZATION_SUBSCRIBERS_QUERY = {
    eventVisualizationSubscribers: {
        resource: 'eventVisualizations',
        id: ({ id }) => id,
        params: {
            fields: ['subscribers'],
        },
    },
}

export const apiFetchVisualization = ({ engine, id, nameProp }) =>
    engine.query(VISUALIZATION_QUERY, {
        variables: { id, nameProp },
    })

export const apiFetchVisualizationNameDesc = ({ engine, id }) =>
    engine
        .query(VISUALIZATION_NAME_DESC_QUERY, {
            variables: { id },
        })
        .then(({ eventVisNameDesc }) => eventVisNameDesc)

export const apiFetchVisualizationSubscribers = ({ engine, id }) =>
    engine
        .query(VISUALIZATION_SUBSCRIBERS_QUERY, {
            variables: { id },
        })
        .then(
            ({ eventVisualizationSubscribers }) => eventVisualizationSubscribers
        )
