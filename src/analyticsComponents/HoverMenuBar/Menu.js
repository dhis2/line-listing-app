import { colors, elevations, spacers } from '@dhis2/ui-constants'
import PropTypes from 'prop-types'
import React, { Children, cloneElement, isValidElement, useState } from 'react'

const Menu = ({
    children,
    className,
    dataTest,
    dense,
    maxHeight,
    maxWidth,
}) => {
    const [openedSubMenu, setOpenedSubMenu] = useState(null)
    const toggleSubMenu = (index) => {
        const toggleValue = index === openedSubMenu ? null : index
        setOpenedSubMenu(toggleValue)
    }
    return (
        <ul className={className} data-test={dataTest}>
            {Children.map(children, (child, index) =>
                isValidElement(child)
                    ? cloneElement(child, {
                          showSubMenu: openedSubMenu === index,
                          toggleSubMenu: toggleSubMenu.bind(this, index),
                          dense:
                              typeof child.props.dense === 'boolean'
                                  ? child.props.dense
                                  : dense,
                          hideDivider:
                              typeof child.props.hideDivider !== 'boolean' &&
                              index === 0
                                  ? true
                                  : child.props.hideDivider,
                      })
                    : child
            )}

            <style jsx>{`
                ul {
                    position: relative;
                    margin: 0;
                    padding: 0;
                    user-select: none;
                    background: ${colors.white};
                    border: 1px solid ${colors.grey200};
                    border-radius: 3px;
                    box-shadow: ${elevations.e300};
                    display: inline-block;
                    min-width: ${dense ? '128' : '180'}px;
                    max-width: ${maxWidth};
                    max-height: ${maxHeight};
                    padding: ${spacers.dp4} 0;
                    overflow: auto;
                    list-style: none;
                }
            `}</style>
        </ul>
    )
}

Menu.defaultProps = {
    dataTest: 'dhis2-analytics-hovermenubar-menu',
    maxWidth: '380px',
    maxHeight: 'auto',
}

Menu.propTypes = {
    /** Typically `MenuItem`, `MenuDivider`, and `MenuSectionHeader` */
    children: PropTypes.node,
    className: PropTypes.string,
    dataTest: PropTypes.string,
    /** Applies `dense` property to all child components unless already specified */
    dense: PropTypes.bool,
    maxHeight: PropTypes.string,
    maxWidth: PropTypes.string,
}

export { Menu }
