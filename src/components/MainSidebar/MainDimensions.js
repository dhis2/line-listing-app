import i18n from '@dhis2/d2-i18n'
import { Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { useMainDimensions } from '../../reducers/ui.js'
import styles from './common.module.css'
import { DimensionItem } from './DimensionItem/index.js'
import { MainSidebarSection } from './MainSidebarSection.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.js'

export const MainDimensions = () => {
    const mainDimensions = useMainDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    const draggableDimensions = mainDimensions.map((dimension) => ({
        draggableId: `main-${dimension.id}`,
        ...dimension,
    }))

    return (
        <MainSidebarSection header={i18n.t('Main dimensions')}>
            {draggableDimensions.map((dimension) => (
                <Tooltip
                    content={dimension.disabledReason}
                    openDelay={200}
                    closeDelay={100}
                    key={dimension.id}
                >
                    {({ onMouseOver, onMouseOut, ref }) => (
                        <span
                            className={cx(
                                styles.span,
                                dimension.disabled && styles.notAllowed
                            )}
                            onMouseOver={() =>
                                dimension.disabled && onMouseOver()
                            }
                            onMouseOut={() =>
                                dimension.disabled && onMouseOut()
                            }
                            ref={ref}
                        >
                            <DimensionItem
                                {...dimension}
                                selected={getIsDimensionSelected(dimension.id)}
                            />
                        </span>
                    )}
                </Tooltip>
            ))}
        </MainSidebarSection>
    )
}
