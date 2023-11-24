import { Analytics } from '@dhis2/analytics'
import { useConfig, useDataEngine } from '@dhis2/app-runtime'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { validateLineListLayout } from '../../modules/layoutValidation.js'
import { isAoWithTimeDimension } from '../../modules/timeDimensions.js'
import { OUTPUT_TYPE_EVENT } from '../../modules/visualization.js'
import { sGetCurrent } from '../../reducers/current.js'
import {
    getAnalyticsEndpoint,
    getAdaptedVisualization,
} from '../Visualization/useAnalyticsData.js'
import {
    DOWNLOAD_TYPE_PLAIN,
    ID_SCHEME_NAME,
    DOWNLOAD_TYPE_TABLE,
    FILE_FORMAT_HTML_CSS,
    FILE_FORMAT_CSV,
    FILE_FORMAT_XLS,
} from './constants.js'

const useDownload = (relativePeriodDate) => {
    const current = useSelector(sGetCurrent)
    const { baseUrl } = useConfig()
    const dataEngine = useDataEngine()
    const analyticsEngine = Analytics.getAnalytics(dataEngine)

    const download = useCallback(
        (type, format, idScheme) => {
            if (!current) {
                return false
            }

            let req = new analyticsEngine.request()
            let target = '_top'

            const { adaptedVisualization, headers, parameters } =
                getAdaptedVisualization(current)
            const path = `${getAnalyticsEndpoint(current.outputType)}/query`

            switch (type) {
                case DOWNLOAD_TYPE_TABLE:
                    req = req
                        .fromVisualization(adaptedVisualization)
                        .withProgram(current.program.id)
                        .withOutputType(current.outputType)
                        .withPath(path)
                        .withFormat(format)
                        .withTableLayout()
                        .withColumns(
                            current.columns
                                .filter((column) => column.dimension !== 'dy')
                                .map((column) => column.dimension)
                                .join(';')
                        )
                        .withRows(
                            current.rows
                                .filter((row) => row.dimension !== 'dy')
                                .map((row) => row.dimension)
                                .join(';')
                        )
                        .withParameters({
                            ...parameters,
                            headers,
                            dataIdScheme: ID_SCHEME_NAME,
                            paging: false,
                        }) // only for LL

                    // not sorted (see old ER)
                    //TODO
                    //displayPropertyName
                    //completedOnly (from options)
                    //hideEmptyColumns (from options)
                    //hideEmptyRows (from options)
                    //showHierarchy (from options)
                    //startDate
                    //endDate
                    target = format === FILE_FORMAT_HTML_CSS ? '_blank' : '_top'

                    break
                case DOWNLOAD_TYPE_PLAIN:
                    req = req
                        // Perhaps the 2nd arg `passFilterAsDimension` should be false for the advanced submenu?
                        .fromVisualization(adaptedVisualization, true)
                        .withProgram(current.program.id)
                        .withOutputType(current.outputType)
                        .withPath(path)
                        .withFormat(format)
                        .withParameters({
                            ...parameters,
                            headers,
                            paging: false,
                        })

                    // fix option set option names
                    if (idScheme === ID_SCHEME_NAME) {
                        req = req.withParameters({
                            dataIdScheme: idScheme,
                        })
                    } else {
                        req = req.withOutputIdScheme(idScheme)
                    }

                    // TODO options
                    // startDate
                    // endDate
                    // displayProperty
                    // completedOnly
                    // hierarchyMeta (from options)
                    // outputType
                    // programStatus
                    // eventStatus
                    // limit
                    // sortOrder
                    // value
                    // aggregationType
                    // timeField
                    // orgUnitField
                    // collapsedDataDimensions
                    // useOrgUnit (URL)
                    // relativePeriodDate
                    target = [FILE_FORMAT_CSV, FILE_FORMAT_XLS].includes(format)
                        ? '_top'
                        : '_blank'
                    break
            }

            // TODO add common parameters
            // if there are for both event/enrollment and PT/LL

            if (current.outputType === OUTPUT_TYPE_EVENT) {
                req = req.withStage(current.programStage?.id)
            }

            if (relativePeriodDate && isAoWithTimeDimension(current)) {
                req = req.withRelativePeriodDate(relativePeriodDate)
            }

            const url = new URL(
                `${baseUrl}/api/${req.buildUrl()}`,
                `${window.location.origin}${window.location.pathname}`
            )

            Object.entries(req.buildQuery()).forEach(([key, value]) =>
                url.searchParams.append(key, value)
            )

            window.open(url, target)
        },
        [current, relativePeriodDate, analyticsEngine, baseUrl]
    )

    return {
        isDownloadDisabled: !validateLineListLayout(current, { dryRun: true }),
        download,
    }
}

export { useDownload }
