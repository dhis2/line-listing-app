import { apiFetchItemsByDimension, useCachedDataQuery } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Transfer, TransferOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { acAddMetadata } from '../../actions/metadata.js'
import { acSetUiItems } from '../../actions/ui.js'
import { DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY } from '../../modules/userSettings.js'
import { useDebounce, useDidUpdateEffect } from '../../modules/utils.js'
import { sGetMetadata } from '../../reducers/metadata.js'
import {
    sGetDimensionIdsFromLayout,
    sGetUiItemsByDimension,
} from '../../reducers/ui.js'
import { TransferEmptySelection } from './common/TransferEmptySelection.jsx'
import { TransferLeftHeader } from './common/TransferLeftHeader.jsx'
import { TransferRightHeader } from './common/TransferRightHeader.jsx'
import { TransferSourceEmptyPlaceholder } from './common/TransferSourceEmptyPlaceholder.jsx'
import DimensionModal from './DimensionModal.jsx'
import classes from './styles/Common.module.css'
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from './utils.js'

const DynamicDimension = ({
    onClose,
    dimension,
    isInLayout,
    setUiItems,
    selectedIds,
    addMetadata,
    metadata,
}) => {
    const { currentUser } = useCachedDataQuery()
    const [state, setState] = useState({
        searchTerm: '',
        items: [],
        loading: true,
        nextPage: 1,
    })
    const dataTest = `dynamic-dimension-${dimension.id}`
    const dataEngine = useDataEngine()
    const setSearchTerm = (searchTerm) =>
        setState((state) => ({ ...state, searchTerm }))
    const debouncedSearchTerm = useDebounce(state.searchTerm)
    const selectedItems = selectedIds.map((id) => ({
        value: id,
        label: Object.values(metadata).find((item) => item.id === id).name,
    }))

    const fetchItems = async (page) => {
        setState((state) => ({ ...state, loading: true }))
        const result = await apiFetchItemsByDimension({
            dataEngine,
            dimensionId: dimension.id,
            searchTerm: state.searchTerm,
            page,
            nameProp:
                currentUser.settings[
                    DERIVED_USER_SETTINGS_DISPLAY_NAME_PROPERTY
                ],
        })
        const newItems = result.dimensionItems?.map(
            ({ id, name, disabled }) => ({
                label: name,
                value: id,
                disabled,
            })
        )
        setState((state) => ({
            ...state,
            loading: false,
            items: page > 1 ? [...state.items, ...newItems] : newItems,
            nextPage: result.nextPage,
        }))
        /*  The following handles a very specific edge-case where the user can select all items from a 
            page and then reopen the modal. Usually Transfer triggers the onEndReached when the end of 
            the page is reached (scrolling down) or if too few items are on the left side (e.g. selecting 
            49 items from page 1, leaving only 1 item on the left side). However, due to the way Transfer 
            works, if 0 items are available, more items are fetched, but all items are already selected 
            (leaving 0 items on the left side still), the onReachedEnd won't trigger. Hence the code below:
            IF there is a next page AND some items were just fetched AND you have the same or more
            selected items than fetched items AND all fetched items are already selected -> fetch more!
        */
        if (
            result.nextPage &&
            newItems.length &&
            selectedItems.length >= newItems.length &&
            newItems.every((newItem) =>
                selectedItems.find(
                    (selectedItem) => selectedItem.value === newItem.value
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

    const selectUiItems = (selected) => {
        addMetadata(
            state.items
                .filter(
                    (item) =>
                        selected.includes(item.value) &&
                        !selectedItems.find((si) => si.value === item.value)
                )
                .reduce(
                    (acc, item) => ({
                        ...acc,
                        [item.value]: { id: item.value, name: item.label },
                    }),
                    {}
                )
        )
        setUiItems({
            dimensionId: dimension.id,
            itemIds: selected,
        })
    }

    const closeModal = () => onClose()

    const renderModalContent = () => (
        <>
            <p className={classes.paragraph}>
                {i18n.t(
                    'Show items that meet the following conditions for this data item:'
                )}
            </p>
            <div className={classes.mainSection}>
                <Transfer
                    onChange={({ selected }) => selectUiItems(selected)}
                    selected={selectedItems.map((item) => item.value)}
                    options={[...state.items, ...selectedItems]}
                    loading={state.loading}
                    loadingPicked={state.loading}
                    sourceEmptyPlaceholder={
                        <TransferSourceEmptyPlaceholder
                            loading={state.loading}
                            searchTerm={debouncedSearchTerm}
                            options={state.items}
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
            </div>
        </>
    )

    if (process.env.NODE_ENV !== 'production') {
        console.log(
            `dimensionType: ${dimension.dimensionType}, id: ${dimension.id}`
        )
    }

    return dimension ? (
        <DimensionModal
            dataTest="dynamic-dimension-modal"
            isInLayout={isInLayout}
            onClose={closeModal}
            title={dimension.name}
        >
            {renderModalContent()}
        </DimensionModal>
    ) : null
}

DynamicDimension.propTypes = {
    addMetadata: PropTypes.func.isRequired,
    dimension: PropTypes.object.isRequired,
    isInLayout: PropTypes.bool.isRequired,
    metadata: PropTypes.object.isRequired,
    selectedIds: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    setUiItems: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
    isInLayout: sGetDimensionIdsFromLayout(state).includes(
        ownProps.dimension?.id
    ),
    selectedIds: sGetUiItemsByDimension(state, ownProps.dimension?.id),
    metadata: sGetMetadata(state),
})

export default connect(mapStateToProps, {
    setUiItems: acSetUiItems,
    addMetadata: acAddMetadata,
})(DynamicDimension)
