Cypress.Commands.add('getBySel', (selector, ...args) =>
    cy.get(`[data-test="${selector}"]`, ...args)
)

Cypress.Commands.add('getBySelLike', (selector, ...args) =>
    cy.get(`[data-test*="${selector}"]`, ...args)
)

Cypress.Commands.add(
    'findBySel',
    {
        prevSubject: true,
    },
    (subject, selector, ...args) =>
        cy.wrap(subject).find(`[data-test="${selector}"]`, ...args)
)

Cypress.Commands.add(
    'findBySelLike',
    {
        prevSubject: true,
    },
    (subject, selector, ...args) =>
        cy.wrap(subject).find(`[data-test*="${selector}"]`, ...args)
)

Cypress.Commands.add(
    'containsExact',
    {
        prevSubject: 'optional',
    },
    (subject, selector) =>
        cy.wrap(subject).contains(
            new RegExp(
                `^${selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, //eslint-disable-line no-useless-escape
                'gm'
            )
        )
)

Cypress.Commands.add(
    'closePopper',
    {
        prevSubject: true,
    },
    (subject) =>
        cy
            .wrap(subject)
            .closest('[data-test=dhis2-uicore-layer]')
            .click('topLeft')
)

const getDocumentScroll = () => {
    if (document.scrollingElement) {
        const { scrollTop, scrollLeft } = document.scrollingElement

        return {
            x: scrollTop,
            y: scrollLeft,
        }
    }

    return {
        x: 0,
        y: 0,
    }
}

/* eslint-disable max-params, cypress/no-unnecessary-waiting */
Cypress.Commands.add(
    'mouseMoveTo',
    {
        prevSubject: 'element',
    },
    (subject, x, y) => {
        console.log('jj move to x,y', x, y)
        cy.wrap(subject, { log: false })
            .then((subject) => {
                const initialRect = subject.get(0).getBoundingClientRect()
                const windowScroll = getDocumentScroll()

                return [subject, initialRect, windowScroll]
            })
            .then(([subject, initialRect, initialWindowScroll]) => {
                cy.wrap(subject)
                    .trigger('mousedown', { force: true })
                    .trigger('mousemove', {
                        force: true,
                        clientX: Math.floor(x - 100),
                        clientY: Math.floor(y - 100),
                    })
                    .trigger('mousemove', {
                        force: true,
                        clientX: Math.floor(x),
                        clientY: Math.floor(y),
                    })
                    .wait(100)
                    .trigger('mouseup', { force: true })
                    .wait(250)
                    .then((subject) => {
                        const finalRect = subject.get(0).getBoundingClientRect()
                        const windowScroll = getDocumentScroll()
                        const windowScrollDelta = {
                            x: windowScroll.x - initialWindowScroll.x,
                            y: windowScroll.y - initialWindowScroll.y,
                        }

                        const delta = {
                            x: Math.round(
                                finalRect.left -
                                    initialRect.left -
                                    windowScrollDelta.x
                            ),
                            y: Math.round(
                                finalRect.top -
                                    initialRect.top -
                                    windowScrollDelta.y
                            ),
                        }

                        return [subject, { initialRect, finalRect, delta }]
                    })
            })
    }
)

Cypress.Commands.add(
    'mouseMoveBy',
    {
        prevSubject: 'element',
    },
    (subject, x, y) => {
        console.log('jj move by x,y', x, y)
        cy.wrap(subject, { log: false })
            .then((subject) => {
                const initialRect = subject.get(0).getBoundingClientRect()
                const windowScroll = getDocumentScroll()

                return [subject, initialRect, windowScroll]
            })
            .then(([subject, initialRect, initialWindowScroll]) => {
                console.log('jj initialRect', initialRect)

                cy.wrap(subject)
                    .trigger('mousedown', { force: true })
                    .trigger('mousemove', {
                        force: true,
                        clientX: Math.floor(
                            initialRect.left + initialRect.width / 2 + x / 2
                        ),
                        clientY: Math.floor(
                            initialRect.top + initialRect.height / 2 + y / 2
                        ),
                    })
                    .trigger('mousemove', {
                        force: true,
                        clientX: Math.floor(
                            initialRect.left + initialRect.width / 2 + x
                        ),
                        clientY: Math.floor(
                            initialRect.top + initialRect.height / 2 + y
                        ),
                    })
                    .wait(100)
                    .trigger('mouseup', { force: true })
                    .wait(250)
                    .then((subject) => {
                        const finalRect = subject.get(0).getBoundingClientRect()
                        const windowScroll = getDocumentScroll()
                        const windowScrollDelta = {
                            x: windowScroll.x - initialWindowScroll.x,
                            y: windowScroll.y - initialWindowScroll.y,
                        }

                        const delta = {
                            x: Math.round(
                                finalRect.left -
                                    initialRect.left -
                                    windowScrollDelta.x
                            ),
                            y: Math.round(
                                finalRect.top -
                                    initialRect.top -
                                    windowScrollDelta.y
                            ),
                        }

                        return [subject, { initialRect, finalRect, delta }]
                    })
            })
    }
)

/* eslint-enable max-params, cypress/no-unnecessary-waiting */
