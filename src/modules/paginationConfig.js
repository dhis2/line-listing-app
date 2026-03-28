// Card type constants for pagination configuration
export const CARD_TYPE_TRACKED_ENTITY = 'TRACKED_ENTITY'
export const CARD_TYPE_ENROLLMENT = 'ENROLLMENT'
export const CARD_TYPE_STAGE = 'STAGE'
export const CARD_TYPE_EVENT = 'EVENT'
export const CARD_TYPE_METADATA = 'METADATA'
export const CARD_TYPE_PROGRAM_INDICATORS = 'PROGRAM_INDICATORS'
export const CARD_TYPE_OTHER = 'OTHER'

// LocalStorage key
export const PAGINATION_STORAGE_KEY = 'dhis2.line-listing.paginationConfig'

// Default page sizes for each card type
export const DEFAULT_PAGE_SIZES = {
    [CARD_TYPE_TRACKED_ENTITY]: 5,
    [CARD_TYPE_ENROLLMENT]: 10,
    [CARD_TYPE_STAGE]: 10,
    [CARD_TYPE_EVENT]: 10,
    [CARD_TYPE_METADATA]: 10,
    [CARD_TYPE_PROGRAM_INDICATORS]: 10,
    [CARD_TYPE_OTHER]: 10,
}

// Card type labels for display in the settings modal
export const CARD_TYPE_LABELS = {
    [CARD_TYPE_TRACKED_ENTITY]: 'Tracked Entity / Person',
    [CARD_TYPE_ENROLLMENT]: 'Enrollment',
    [CARD_TYPE_STAGE]: 'Stage',
    [CARD_TYPE_EVENT]: 'Event',
    [CARD_TYPE_METADATA]: 'Metadata',
    [CARD_TYPE_PROGRAM_INDICATORS]: 'Program Indicators',
    [CARD_TYPE_OTHER]: 'Other',
}

/**
 * Get pagination config from localStorage
 * @returns {Object} Pagination config merged with defaults
 */
export const getPaginationConfigFromStorage = () => {
    try {
        const stored = window.localStorage.getItem(PAGINATION_STORAGE_KEY)
        if (stored) {
            const parsed = JSON.parse(stored)
            // Merge with defaults to ensure all keys exist
            return { ...DEFAULT_PAGE_SIZES, ...parsed }
        }
    } catch (e) {
        console.warn('Failed to parse pagination config from localStorage:', e)
    }
    return { ...DEFAULT_PAGE_SIZES }
}

/**
 * Save pagination config to localStorage
 * @param {Object} config - The pagination config to save
 */
export const setPaginationConfigToStorage = (config) => {
    try {
        window.localStorage.setItem(
            PAGINATION_STORAGE_KEY,
            JSON.stringify(config)
        )
    } catch (e) {
        console.warn('Failed to save pagination config to localStorage:', e)
    }
}

/**
 * Get page size for a specific card type
 * @param {Object} config - The pagination config object
 * @param {string} cardType - The card type constant
 * @returns {number} The page size for the card type
 */
export const getPageSizeForCard = (config, cardType) => {
    return config?.[cardType] ?? DEFAULT_PAGE_SIZES[cardType] ?? 25
}

/**
 * Validate a page size value
 * @param {number} value - The value to validate
 * @returns {number} A valid page size (between 1 and 100)
 */
export const validatePageSize = (value) => {
    const num = parseInt(value, 10)
    if (isNaN(num) || num < 1) return 1
    if (num > 100) return 100
    return num
}
