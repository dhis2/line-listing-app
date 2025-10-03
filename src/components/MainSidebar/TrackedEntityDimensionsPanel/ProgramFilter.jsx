import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acAddMetadata } from '../../../actions/metadata.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../../modules/userSettings.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { sGetUiEntityTypeId } from '../../../reducers/ui.js'
import styles from '../ProgramDimensionsPanel/ProgramSelect.module.css'

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

    return (
        <div className={styles.rows}>
            <div className={styles.columns}>
                <div className={styles.stretch}>
                    {error && !fetching ? (
                        <div className={styles.section}>
                            <NoticeBox
                                error
                                title={i18n.t('Could not load programs')}
                            >
                                {error?.message ||
                                    i18n.t(
                                        "The programs couldn't be retrieved. Try again or contact your system administrator."
                                    )}
                            </NoticeBox>
                        </div>
                    ) : (
                        <div className={styles.dropdownWrapper}>
                            <SingleSelect
                                dense
                                selected={selectedProgramId || ''}
                                onChange={({ selected }) => {
                                    setSelectedProgramId(selected)
                                    dispatch(
                                        acAddMetadata({
                                            [selected]: programs.find(
                                                (p) => p.id === selected
                                            ),
                                        })
                                    )
                                }}
                                placeholder={i18n.t('Filter by program usage')}
                                maxHeight="max(60vh, 460px)"
                                dataTest="tet-dimensions-program-select"
                                filterable
                                noMatchText={i18n.t('No programs found')}
                                prefix={selectedProgramId && i18n.t('Program')}
                                clearable
                                clearText={i18n.t('Clear')}
                                loading={fetching}
                            >
                            {(fetching || !programs) && selectedProgram?.id && (
                                <SingleSelectOption
                                    key={selectedProgram?.id}
                                    label={selectedProgram?.name}
                                    value={selectedProgram?.id}
                                />
                            )}
                            {!fetching &&
                                programs?.map(({ id, name }) => (
                                    <SingleSelectOption
                                        key={id}
                                        label={name}
                                        value={id}
                                    />
                                ))}
                            </SingleSelect>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

ProgramFilter.propTypes = {
    setSelectedProgramId: PropTypes.func.isRequired,
    selectedProgramId: PropTypes.string,
}

export { ProgramFilter }
