import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tSetUiEntityType } from '../../../actions/ui.js'
import { sGetMetadataById } from '../../../reducers/metadata.js'
import { sGetUiEntityTypeId } from '../../../reducers/ui.js'
import styles from './ProgramSelect.module.css'

const query = {
    programs: {
        resource: 'trackedEntityTypes',
        params: () => ({
            fields: ['id', 'displayName~rename(name)'],
            paging: false,
            filter: 'access.data.read:eq:true',
        }),
    },
}

const TypeSelect = () => {
    const dispatch = useDispatch()
    const selectedTypeId = useSelector(sGetUiEntityTypeId)
    const { fetching, error, data, refetch, called } = useDataQuery(query, {
        lazy: true,
    })

    const types = data?.programs.trackedEntityTypes

    const selectedType = useSelector((state) =>
        sGetMetadataById(state, selectedTypeId)
    )

    const setSelectedTypeId = (typeId) => {
        if (typeId !== selectedTypeId) {
            const type = types?.find(({ id }) => id === typeId)
            dispatch(tSetUiEntityType({ type }))
        }
    }

    useEffect(() => {
        if (!called) {
            refetch()
        }
    }, [called, refetch])

    if (error && !fetching) {
        return (
            <div className={styles.section}>
                <NoticeBox error title={i18n.t('Could not load types')}>
                    {error?.message ||
                        i18n.t(
                            "The types couldn't be retrieved. Try again or contact your system administrator."
                        )}
                </NoticeBox>
            </div>
        )
    }

    return (
        <div className={styles.rows}>
            <div className={styles.columns}>
                <div className={styles.stretch}>
                    <SingleSelect
                        dense
                        selected={selectedType?.id || ''}
                        onChange={({ selected }) => setSelectedTypeId(selected)}
                        placeholder={i18n.t('Choose a type')}
                        maxHeight="max(60vh, 460px)"
                        dataTest="type-select"
                        filterable
                        noMatchText={i18n.t('No types found')}
                        loading={fetching}
                    >
                        {(fetching || !types) && selectedType?.id && (
                            <SingleSelectOption
                                key={selectedType?.id}
                                label={selectedType?.name}
                                value={selectedType?.id}
                            />
                        )}
                        {!fetching &&
                            types?.map(({ id, name }) => (
                                <SingleSelectOption
                                    key={id}
                                    label={name}
                                    value={id}
                                />
                            ))}
                    </SingleSelect>
                </div>
            </div>
        </div>
    )
}

TypeSelect.propTypes = {}

export { TypeSelect }
