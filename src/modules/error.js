import i18n from '@dhis2/d2-i18n'
import { DataError, EmptyBox, GenericError } from '../assets/ErrorIcons.jsx'

const visualizationError = (icon, title, description) => ({
    icon,
    title,
    description,
})

export const genericClientError = () =>
    visualizationError(
        GenericError,
        genericErrorTitle,
        i18n.t('There is a problem with this visualization.')
    )

export const genericServerError = () =>
    visualizationError(
        GenericError,
        genericErrorTitle,
        i18n.t('There was a problem getting the data from the server.')
    )

export const emptyResponseError = () =>
    visualizationError(
        EmptyBox,
        i18n.t('No data available'),
        i18n.t(
            'The selected dimensions didn’t return any data. There may be no data, or you may not have access to it.'
        )
    )

export const visualizationNotFoundError = () =>
    visualizationError(
        GenericError,
        i18n.t('Visualization not found'),
        i18n.t(
            'The visualization you are trying to view could not be found, the ID could be incorrect or it could have been deleted.'
        )
    )

export const noEntityTypeError = () =>
    visualizationError(
        EmptyBox,
        i18n.t('No tracked entity type selected'),
        i18n.t('Choose a type from the Input sidebar.')
    )

export const noProgramError = () =>
    visualizationError(
        EmptyBox,
        i18n.t('No program selected'),
        i18n.t('Choose a program from the Input sidebar.')
    )

export const noColumnsError = () =>
    visualizationError(
        EmptyBox,
        i18n.t('Columns is empty'),
        i18n.t('Add at least one item to Columns.')
    )

export const noOrgUnitError = () =>
    visualizationError(
        DataError,
        i18n.t('No organisation unit selected'),
        i18n.t(
            'Make sure to add the organisation unit dimension with at least one selection to the layout.'
        )
    )

export const indicatorError = () =>
    visualizationError(
        DataError,
        genericErrorTitle,
        i18n.t("There's a problem with at least one selected indicator")
    )

export const dataAccessError = () =>
    visualizationError(
        DataError,
        i18n.t('Restricted access'),
        i18n.t(
            'You don’t have access to the data in this visualization. Contact a system administrator.'
        )
    )

export const orgUnitAccessError = () =>
    visualizationError(
        DataError,
        i18n.t('Restricted access'),
        i18n.t(
            'You don’t have access to one or more of the chosen organisation units.'
        )
    )

export const eventAccessError = () =>
    visualizationError(
        DataError,
        i18n.t('Restricted access'),
        i18n.t(
            'You don’t have access to event analytics. Contact a system administrator.'
        )
    )

export const analyticsGenerationError = () =>
    visualizationError(
        GenericError,
        i18n.t('Something went wrong'),
        i18n.t(
            "There's a problem with the generated analytics. Contact a system administrator."
        )
    )

export const analyticsRequestError = () =>
    visualizationError(
        GenericError,
        i18n.t('Something went wrong'),
        i18n.t("There's a syntax problem with the analytics request.")
    )

export const getAlertTypeByStatusCode = (statusCode) =>
    String(statusCode).match(/50\d/) ? 'error' : 'warning'

export const genericErrorTitle = i18n.t('Something went wrong')

export const isVisualizationError = (error) =>
    error.icon && error.title && error.description
