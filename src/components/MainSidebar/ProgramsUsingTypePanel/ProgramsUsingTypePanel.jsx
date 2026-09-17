import i18n from '@dhis2/d2-i18n'
import { CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetDataSource } from '../../../actions/ui.js'
import { acAddMetadata } from '../../../actions/metadata.js'
import { OUTPUT_TYPE_EVENT } from '../../../modules/visualization.js'
import {
    getProgramAsMetadata,
    getDynamicTimeDimensionsMetadata,
} from '../../../modules/metadata.js'
import { sGetUiEntityTypeId } from '../../../reducers/ui.js'
import { useDebounce } from '../../../modules/utils.js'
import { useProgramsUsingType } from './useProgramsUsingType.js'
import styles from './ProgramsUsingTypePanel.module.css'

const ProgramsUsingTypePanel = ({
    visible,
    searchTerm: externalSearchTerm,
}) => {
    const dispatch = useDispatch()
    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)
    const debouncedSearchTerm = useDebounce(externalSearchTerm || '')

    const { loading, fetching, error, programs } = useProgramsUsingType({
        visible,
        entityTypeId: selectedEntityTypeId,
        searchTerm: debouncedSearchTerm,
    })

    const handleProgramClick = (program) => {
        // Prepare all metadata including time dimensions (without specific stage)
        const allMetadata = {
            ...getProgramAsMetadata(program),
            ...getDynamicTimeDimensionsMetadata(
                program,
                undefined, // No stage required - show all dimensions
                OUTPUT_TYPE_EVENT
            ),
        }

        // Set data source (this will handle the switch from tracked entity type to program)
        dispatch(
            tSetDataSource({
                type: 'PROGRAM',
                id: program.id,
                programType: program.programType,
                stage: undefined, // No stage auto-selection
                metadata: allMetadata,
            })
        )

        // Add metadata AFTER setting data source (after clearing)
        dispatch(acAddMetadata(allMetadata))
    }

    if (!visible) {
        return null
    }

    if (loading) {
        return (
            <div className={styles.loaderWrap}>
                <CircularLoader small />
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.errorWrap}>
                <NoticeBox error title={i18n.t("Couldn't load programs")}>
                    {error?.message ||
                        i18n.t(
                            'There was a problem loading the programs. Try again, or contact your system administrator.'
                        )}
                </NoticeBox>
            </div>
        )
    }

    if (!loading && !fetching && !programs?.length) {
        return (
            <div className={styles.noResults}>
                {debouncedSearchTerm
                    ? i18n.t('No results')
                    : i18n.t('No programs found')}
            </div>
        )
    }

    return (
        <div className={styles.scrollbox}>
            <div className={styles.list}>
                {programs.map((program) => (
                    <button
                        key={program.id}
                        className={styles.programItem}
                        onClick={() => handleProgramClick(program)}
                        data-test={`program-item-${program.id}`}
                    >
                        {program.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

ProgramsUsingTypePanel.propTypes = {
    searchTerm: PropTypes.string,
    visible: PropTypes.bool,
}

export { ProgramsUsingTypePanel }
