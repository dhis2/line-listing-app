import i18n from '@dhis2/d2-i18n'
import {
    DataError,
    EmptyBox,
    GenericError,
    PeriodError,
} from '../assets/ErrorIcons.js'
export class VisualizationError {
    constructor(icon, title, description) {
        this.icon = icon
        this.title = title
        this.description = description
    }
}

export class GenericClientError extends VisualizationError {
    constructor() {
        super(
            GenericError,
            genericErrorTitle,
            i18n.t('There is a problem with this visualization.')
        )
    }
}

export class GenericServerError extends VisualizationError {
    constructor() {
        super(
            GenericError,
            genericErrorTitle,
            i18n.t('There was a problem getting the data from the server.')
        )
    }
}

export class EmptyResponseError extends VisualizationError {
    constructor() {
        super(
            EmptyBox,
            i18n.t('No data available'),
            i18n.t(
                'The selected dimensions didn’t return any data. There may be no data, or you may not have access to it.'
            )
        )
    }
}

export class VisualizationNotFoundError extends VisualizationError {
    constructor() {
        super(
            GenericError,
            i18n.t('Visualization not found'),
            i18n.t(
                'The visualization you are trying to view could not be found, the ID could be incorrect or it could have been deleted.'
            )
        )
    }
}

export class NoProgramError extends VisualizationError {
    constructor() {
        super(
            EmptyBox,
            i18n.t('No program selected'),
            i18n.t('Choose a program from the Program Dimensions sidebar.')
        )
    }
}

export class NoColumnsError extends VisualizationError {
    constructor() {
        super(
            EmptyBox,
            i18n.t('Columns is empty'),
            i18n.t('Add at least one item to Columns.')
        )
    }
}

export class NoOrgUnitError extends VisualizationError {
    constructor() {
        super(
            DataError,
            i18n.t('No organisation unit selected'),
            i18n.t('Add at least one organisation unit to the layout.')
        )
    }
}

export class NoPeriodError extends VisualizationError {
    constructor() {
        super(
            PeriodError,
            i18n.t('No time dimension selected'),
            i18n.t('Add at least one time dimension to the layout.')
        )
    }
}

export const getAlertTypeByStatusCode = (statusCode) =>
    String(statusCode).match(/50\d/) ? 'error' : 'warning'
export const genericErrorTitle = i18n.t('Something went wrong')
