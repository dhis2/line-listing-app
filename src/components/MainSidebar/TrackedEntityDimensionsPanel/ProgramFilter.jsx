import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acAddMetadata } from '../../../actions/metadata.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { sGetUiEntityTypeId } from '../../../reducers/ui.js'
import styles from '../ProgramDimensionsPanel/ProgramDimensionsFilter.module.css'
import { IconFilter16 } from '@dhis2/ui'

const query = {
    programs: {
        resource: 'programs',
        params: ({ nameProp, selectedEntityTypeId }) => ({
            fields: ['id', `${nameProp}~rename(name)`],
            paging: false,
            filter: [
                'access.data.read:eq:true',
                `trackedEntityType.id:eq:${selectedEntityTypeId}`,
            ],
        }),
    },
}

const ProgramFilter = ({ setSelectedProgramId, selectedProgramId }) => {
    const { currentUser } = useCachedDataQuery()
    const selectedEntityTypeId = useSelector(sGetUiEntityTypeId)
    const { fetching, error, data, refetch, called } = useDataQuery(query, {
        lazy: true,
    })
    const programs = data?.programs?.programs
    const selectedProgram = useSelector((state) =>
        sGetMetadataById(state, selectedProgramId)
    )
    const dispatch = useDispatch()
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        if (!called) {
            refetch({
                nameProp:
                    currentUser.settings[
                        DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                    ],
                selectedEntityTypeId,
            })
        }
    }, [called, currentUser, refetch, selectedEntityTypeId])

    const handleFilterClick = () => {
        setShowDropdown(!showDropdown)
    }

    const handleProgramSelect = (programId) => {
        setSelectedProgramId(programId)
        if (programId) {
            dispatch(
                acAddMetadata({
                    [programId]: programs.find((p) => p.id === programId),
                })
            )
        }
        setShowDropdown(false)
    }

    const handleRemoveFilter = (e) => {
        e.stopPropagation()
        setSelectedProgramId(null)
        setShowDropdown(false)
    }

    const isFilterActive = !!selectedProgramId

    return (
        <div className={styles.container}>
            {error && !fetching ? (
                <div className={styles.filterWrapper}>
                    <NoticeBox error title={i18n.t('Could not load programs')}>
                        {error?.message ||
                            i18n.t(
                                "The programs couldn't be retrieved. Try again or contact your system administrator."
                            )}
                    </NoticeBox>
                </div>
            ) : (
                <div className={styles.filterWrapper}>
                    <div className={styles.filterButtonContainer}>
                        <button
                            className={`${styles.filterButton} ${
                                isFilterActive ? styles.filterButtonActive : ''
                            }`}
                            onClick={handleFilterClick}
                        >
                            <span className={styles.filterIcon}>
                                <IconFilter16 />
                            </span>
                            {isFilterActive ? (
                                <>
                                    <span className={styles.filterLabel}>
                                        {selectedProgram?.name}
                                    </span>
                                    <button
                                        className={styles.removeButton}
                                        onClick={handleRemoveFilter}
                                        aria-label={i18n.t('Remove filter')}
                                    >
                                        ×
                                    </button>
                                </>
                            ) : (
                                <span className={styles.filterLabel}>
                                    {i18n.t('Filter by program usage')}
                                </span>
                            )}
                        </button>

                        {showDropdown && (
                            <div className={styles.filterDropdown}>
                                <button
                                    className={styles.filterOption}
                                    onClick={() => handleProgramSelect(null)}
                                >
                                    {i18n.t('All programs')}
                                </button>
                                {programs?.map(({ id, name }) => (
                                    <button
                                        key={id}
                                        className={styles.filterOption}
                                        onClick={() => handleProgramSelect(id)}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

ProgramFilter.propTypes = {
    setSelectedProgramId: PropTypes.func.isRequired,
    selectedProgramId: PropTypes.string,
}

export { ProgramFilter }
