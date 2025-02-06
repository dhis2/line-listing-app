import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconFolder16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { MenuItem } from './MenuItem/index.js'
import {
    YOUR_DIMENSIONS_RESOURCE,
    YOUR_DIMENSIONS_FILTER,
} from './YourDimensionsPanel/useYourDimensions.js'

const query = {
    dimensions: {
        resource: YOUR_DIMENSIONS_RESOURCE,
        params: {
            page: 1,
            pageSize: 1,
            fields: 'id',
            filter: YOUR_DIMENSIONS_FILTER,
        },
    },
}

export const YourDimensionsMenuItem = ({ selected, count, onClick }) => {
    const { data } = useDataQuery(query)

    return data?.dimensions.dimensions?.length ? (
        <MenuItem
            icon={<IconFolder16 />}
            label={i18n.t('Your dimensions')}
            onClick={onClick}
            selected={selected}
            count={count}
        />
    ) : null
}

YourDimensionsMenuItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
    selected: PropTypes.bool,
}
