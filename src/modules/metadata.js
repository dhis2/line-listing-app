import {
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'

const getOrganisationUnits = () => ({
    [USER_ORG_UNIT]: i18n.t('User organisation unit'),
    [USER_ORG_UNIT_CHILDREN]: i18n.t('User sub-units'),
    [USER_ORG_UNIT_GRANDCHILDREN]: i18n.t('User sub-x2-units'),
})

export default function () {
    return Object.entries({
        ...getOrganisationUnits(),
    }).reduce((obj, [key, value]) => ({ ...obj, [key]: { name: value } }), {})
}
