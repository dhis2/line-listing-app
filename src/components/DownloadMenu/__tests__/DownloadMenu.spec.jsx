import { useConfig } from '@dhis2/app-runtime'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { DOWNLOAD_TYPE_PLAIN, ID_SCHEME_UID } from '../constants.js'
import { DownloadMenu } from '../DownloadMenu.jsx'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: jest.fn(() => ({ serverVersion: { minor: 42 } })),
}))

describe('LL > DownloadMenu', () => {
    const downloadFn = jest.fn()

    it('renders the menu items', () => {
        const { getByText } = render(<DownloadMenu download={downloadFn} />)

        Array(
            'HTML',
            'HTML+CSS (.html+css)',
            'JSON',
            'XML',
            'Microsoft Excel',
            'CSV'
        ).forEach((label) => expect(getByText(label)).toBeTruthy())
    })

    it('uses the correct format for Excel in 42', async () => {
        const { getByText, findByText } = render(
            <DownloadMenu download={downloadFn} />
        )

        fireEvent.click(getByText('Microsoft Excel'))

        await findByText('ID')

        expect(getByText('ID')).toBeTruthy()

        fireEvent.click(getByText('ID'))

        expect(downloadFn).toHaveBeenCalledWith(
            DOWNLOAD_TYPE_PLAIN,
            'xlsx',
            ID_SCHEME_UID
        )
    })

    it('uses the correct format for Excel in 41', async () => {
        useConfig.mockReturnValue({ serverVersion: { minor: 41 } })

        const { getByText, findByText } = render(
            <DownloadMenu download={downloadFn} />
        )

        fireEvent.click(getByText('Microsoft Excel'))

        await findByText('ID')

        expect(getByText('ID')).toBeTruthy()

        fireEvent.click(getByText('ID'))

        expect(downloadFn).toHaveBeenCalledWith(
            DOWNLOAD_TYPE_PLAIN,
            'xls',
            ID_SCHEME_UID
        )
    })
})
