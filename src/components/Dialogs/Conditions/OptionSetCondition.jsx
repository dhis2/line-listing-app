import { useDataEngine } from '@dhis2/app-runtime'
import { Transfer, TransferOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { acAddMetadata } from '../../../actions/metadata.js'
import { apiFetchOptions } from '../../../api/options.js'
import { OPERATOR_IN } from '../../../modules/conditions.js'
import { useDebounce, useDidUpdateEffect } from '../../../modules/utils.js'
import { sGetMetadata } from '../../../reducers/metadata.js'
import { TransferEmptySelection } from '../common/TransferEmptySelection.jsx'
import { TransferLeftHeader } from '../common/TransferLeftHeader.jsx'
import { TransferRightHeader } from '../common/TransferRightHeader.jsx'
import { TransferSourceEmptyPlaceholder } from '../common/TransferSourceEmptyPlaceholder.jsx'
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from '../utils.js'

const OptionSetCondition = ({
    condition,
    optionSetId,
    onChange,
    metadata,
    addMetadata,
}) => {
    const parts = condition.split(':')
    const values = parts[1]?.length ? parts[1].split(';') : []
    const selectedOptions = values.map((code) => ({
        code,
        name:
            Object.values(metadata).find((item) => item.code === code)?.name ||
            code,
    }))
    const dataTest = 'option-set'

    const setValues = (selected) => {
        addMetadata({
            // update options in the optionSet metadata used for the lookup of the correct
            // name from code (options for different option sets have the same code)
            [optionSetId]: {
                ...metadata[optionSetId],
                options: selected.map((soCode) =>
                    state.options.find(({ code }) => code === soCode)
                ),
            },
        })

        onChange(`${OPERATOR_IN}:${selected.join(';') || ''}`)
    }

    const [state, setState] = useState({
        searchTerm: '',
        options: [],
        loading: true,
        nextPage: 1,
    })
    const dataEngine = useDataEngine()
    const setSearchTerm = (searchTerm) =>
        setState((state) => ({ ...state, searchTerm }))
    const debouncedSearchTerm = useDebounce(state.searchTerm)
    const fetchItems = async (page) => {
        setState((state) => ({ ...state, loading: true }))
        const result = await apiFetchOptions({
            dataEngine,
            page,
            optionSetId,
            searchTerm: state.searchTerm,
        })
        const newOptions = []
        result.options?.forEach((item) => {
            newOptions.push({
                name: item.name,
                code: item.code,
                id: item.id,
            })
        })
        setState((state) => ({
            ...state,
            loading: false,
            options: page > 1 ? [...state.options, ...newOptions] : newOptions,
            nextPage: result.nextPage,
        }))
        /*  The following handles a very specific edge-case where the user can select all items from a 
            page and then reopen the modal. Usually Transfer triggers the onEndReached when the end of 
            the page is reached (scrolling down) or if too few items are on the left side (e.g. selecting 
            49 items from page 1, leaving only 1 item on the left side). However, due to the way Transfer 
            works, if 0 items are available, more items are fetched, but all items are already selected 
            (leaving 0 items on the left side still), the onReachedEnd won't trigger. Hence the code below:
            IF there is a next page AND some options were just fetched AND you have the same or more
            selected items than fetched items AND all fetched items are already selected -> fetch more!
        */
        if (
            result.nextPage &&
            newOptions.length &&
            selectedOptions.length >= newOptions.length &&
            newOptions.every((newOption) =>
                selectedOptions.find(
                    (selectedItem) => selectedItem.code === newOption.code
                )
            )
        ) {
            fetchItems(result.nextPage)
        }
    }

    useDidUpdateEffect(() => {
        setState((state) => ({
            ...state,
            loading: true,
            nextPage: 1,
        }))
        fetchItems(1)
    }, [debouncedSearchTerm, state.filter])

    const onEndReached = () => {
        if (state.nextPage) {
            fetchItems(state.nextPage)
        }
    }

    return (
        <Transfer
            onChange={({ selected }) => setValues(selected)}
            selected={selectedOptions.map((option) => option.code)}
            options={[...state.options, ...selectedOptions].map((option) => ({
                value: option.code,
                label: option.name,
            }))}
            loading={state.loading}
            loadingPicked={state.loading}
            sourceEmptyPlaceholder={
                <TransferSourceEmptyPlaceholder
                    loading={state.loading}
                    searchTerm={debouncedSearchTerm}
                    options={state.options}
                    dataTest={`${dataTest}-empty-source`}
                />
            }
            onEndReached={onEndReached}
            leftHeader={
                <TransferLeftHeader
                    searchTerm={state.searchTerm}
                    setSearchTerm={setSearchTerm}
                    dataTest={`${dataTest}-left-header`}
                />
            }
            height={TRANSFER_HEIGHT}
            optionsWidth={TRANSFER_OPTIONS_WIDTH}
            selectedWidth={TRANSFER_SELECTED_WIDTH}
            selectedEmptyComponent={<TransferEmptySelection />}
            rightHeader={<TransferRightHeader />}
            renderOption={(props) => (
                <TransferOption
                    {...props}
                    dataTest={`${dataTest}-transfer-option`}
                />
            )}
            dataTest={`${dataTest}-transfer`}
        />
    )
}

OptionSetCondition.propTypes = {
    addMetadata: PropTypes.func.isRequired,
    condition: PropTypes.string.isRequired,
    metadata: PropTypes.object.isRequired,
    optionSetId: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    metadata: sGetMetadata(state),
})

export default connect(mapStateToProps, { addMetadata: acAddMetadata })(
    OptionSetCondition
)
