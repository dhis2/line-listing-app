import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { InputField, Transfer, TransferOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { apiFetchOptions } from '../../../api/options.js'
import { OPERATOR_IN } from '../../../modules/conditions.js'
import { useDebounce, useDidUpdateEffect } from '../../../modules/utils.js'
import { sGetSettingsDisplayNameProperty } from '../../../reducers/settings.js'
import classes from './styles/Condition.module.css'

const LeftHeader = ({ searchTerm, setSearchTerm, dataTest }) => (
    <div className={classes.transferLeftHeader}>
        <InputField
            value={searchTerm}
            onChange={({ value }) => setSearchTerm(value)}
            placeholder={i18n.t('Filter options')}
            dataTest={`${dataTest}-filter-input-field`}
            dense
            initialFocus
            type={'search'}
        />
    </div>
)

LeftHeader.propTypes = {
    dataTest: PropTypes.string,
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func,
}

const EmptySelection = () => (
    <p className={classes.transferEmptyList}>{i18n.t('No items selected')}</p>
)
const RightHeader = () => (
    <p className={classes.transferRightHeader}>{i18n.t('Selected options')}</p>
)

const SourceEmptyPlaceholder = ({ loading, searchTerm, options, dataTest }) => {
    let message = ''
    if (!loading && !options.length && !searchTerm) {
        message = i18n.t('No options')
    } else if (!loading && !options.length && searchTerm) {
        message = i18n.t('Nothing found for "{{- searchTerm}}"', {
            searchTerm: searchTerm,
        })
    }
    return (
        message && (
            <p className={classes.transferEmptyList} data-test={dataTest}>
                {message}
            </p>
        )
    )
}

SourceEmptyPlaceholder.propTypes = {
    dataTest: PropTypes.string,
    loading: PropTypes.bool,
    options: PropTypes.array,
    searchTerm: PropTypes.string,
}

const OptionSetCondition = ({
    condition,
    optionSetId,
    onChange,
    displayNameProp,
}) => {
    const parts = condition.split(':')
    const values = parts[1] || ''
    const dataTest = 'option-set'

    // TODO: Split values by ; and fetch the name for each value from the metadata. Store name/id pair as "selectedItems"

    const onTransferChange = (input, checked) => {
        const currentValues = values.length ? values.split(';') : []
        if (checked) {
            setValues([...currentValues, input].join(';'))
        } else {
            setValues(currentValues.filter((v) => v !== input).join(';'))
        }
    }

    const setValues = (input) => {
        onChange(`${OPERATOR_IN}:${input || ''}`)
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
    const debouncedSearchTerm = useDebounce(state.searchTerm, 200)
    const fetchItems = async (page) => {
        setState((state) => ({ ...state, loading: true }))
        const result = await apiFetchOptions({
            dataEngine,
            nameProp: displayNameProp,
            page,
            optionSetId,
            searchTerm: state.searchTerm,
        })
        const newOptions = []
        result.dimensionItems?.forEach((item) => {
            newOptions.push({
                label: item.name,
                value: item.id,
                disabled: item.disabled,
                type: item.dimensionItemType,
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
            selectedItems.length >= newOptions.length &&
            newOptions.every((newOption) =>
                selectedItems.find(
                    (selectedItem) => selectedItem.value === newOption.value
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
    // const onChange2 = (newSelected) => {
    //     // FIXME: The name 'onChange' clashes with the onChange prop
    //     onSelect(
    //         newSelected.map((value) => {
    //             const matchingItem = [...state.options, ...selectedItems].find(
    //                 (item) => item.value === value
    //             )
    //             return {
    //                 value,
    //                 label: matchingItem.label,
    //                 type: matchingItem.type,
    //             }
    //         })
    //     )
    // }
    const onEndReached = () => {
        if (state.nextPage) {
            fetchItems(state.nextPage)
        }
    }

    return (
        <Transfer
            onChange={({ selected }) => onChange(selected)}
            selected={selectedItems.map((item) => item.value)}
            options={[...state.options, ...selectedItems]}
            loading={state.loading}
            loadingPicked={state.loading}
            sourceEmptyPlaceholder={
                <SourceEmptyPlaceholder
                    loading={state.loading}
                    searchTerm={debouncedSearchTerm}
                    options={state.options}
                    dataTest={`${dataTest}-empty-source`}
                />
            }
            onEndReached={onEndReached}
            leftHeader={
                <LeftHeader
                    searchTerm={state.searchTerm}
                    setSearchTerm={setSearchTerm}
                    dataTest={`${dataTest}-left-header`}
                />
            }
            //height={}
            //optionsWidth={}
            //selectedWidth={}
            selectedEmptyComponent={<EmptySelection />}
            rightHeader={<RightHeader />}
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
    condition: PropTypes.string.isRequired,
    displayNameProp: PropTypes.string.isRequired,
    optionSetId: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    displayNameProp: sGetSettingsDisplayNameProperty(state),
})

export default connect(mapStateToProps)(OptionSetCondition)
