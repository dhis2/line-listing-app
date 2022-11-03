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

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

function getDocumentScroll() {
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
    'pointerMoveBy',
    {
        prevSubject: 'element',
    },
    (subject, x, y, options) => {
        console.log('x,y', x, y)
        cy.wrap(subject, { log: false })
            .then((subject) => {
                const initialRect = subject.get(0).getBoundingClientRect()
                const windowScroll = getDocumentScroll()

                return [subject, initialRect, windowScroll]
            })
            .then(([subject, initialRect, initialWindowScroll]) => {
                console.log('subject', subject)
                console.log('initialRect', initialRect)
                console.log('initialWindowScroll', initialWindowScroll)
                cy.wrap(subject)
                    .trigger('pointerdown', { force: true })
                    .wait(options?.delay || 0, { log: Boolean(options?.delay) })
                    .trigger('pointermove', {
                        force: true,
                        clientX: Math.floor(
                            initialRect.left + initialRect.width / 2 + x / 2
                        ),
                        clientY: Math.floor(
                            initialRect.top + initialRect.height / 2 + y / 2
                        ),
                    })
                    .trigger('pointermove', {
                        force: true,
                        clientX: Math.floor(
                            initialRect.left + initialRect.width / 2 + x
                        ),
                        clientY: Math.floor(
                            initialRect.top + initialRect.height / 2 + y
                        ),
                    })
                    .wait(100)
                    .trigger('pointerup', { force: true })
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
    'dragElement',
    {
        prevSubject: 'true',
    },
    (subject, x, y) => {
        Cypress.log({
            name: 'dragElement',
        })
        cy.wrap(subject)
            .trigger('mousedown', { button: 0 }, { force: true })
            .wait(1000)
            .trigger('mousemove', x, y, {
                force: true,
            })
            .wait(100)
        // .trigger('pointermove', {
        //     force: true,
        //     clientX: Math.floor(x),
        //     clientY: Math.floor(y),
        // })
        cy.wrap(subject).trigger('mouseup', { force: true })
    }
)

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
    (subject, x, y, options) => {
        console.log('mouse x,y', x, y)
        cy.wrap(subject, { log: false })
            .then((subject) => {
                const initialRect = subject.get(0).getBoundingClientRect()
                const windowScroll = getDocumentScroll()

                return [subject, initialRect, windowScroll]
            })
            .then(([subject, initialRect, initialWindowScroll]) => {
                console.log('jj initialRect', initialRect)
                console.log(
                    'jj move to client',
                    Math.floor(
                        initialRect.left + initialRect.width / 2 + x / 2
                    ),
                    Math.floor(initialRect.top + initialRect.height / 2 + y / 2)
                )

                console.log(
                    'jj move to clientX part 2',
                    Math.floor(initialRect.left + initialRect.width / 2 + x),
                    Math.floor(initialRect.top + initialRect.height / 2 + y)
                )
                cy.wrap(subject)
                    .trigger('mousedown', { force: true })
                    .wait(options?.delay || 0, { log: Boolean(options?.delay) })
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

// Cypress.Commands.add('findItemById', (id) => {
//     return cy.get(`[data-id="${id}"]`)
// })

// Cypress.Commands.add('getIndexForItem', (id) => {
//     return cy
//         .get(`[data-id="${id}"]`)
//         .invoke('attr', 'data-index')
//         .then((index) => {
//             return index ? parseInt(index, 10) : -1
//         })
// })

// Cypress.Commands.add('visitStory', (id) => {
//     return cy.visit(`/iframe.html?id=${id}`, { log: false })
// })

// const Keys = {
//     Space: ' ',
// }

// Cypress.Commands.add(
//     'keyboardMoveBy',
//     {
//         prevSubject: 'element',
//     },
//     (subject, times, direction: string) => {
//         const arrowKey = `{${direction}arrow}`

//         Cypress.log({
//             $el: subject,
//             name: 'Move',
//         })

//         cy.wrap(subject, { log: false })
//             .focus({ log: false })
//             .type(Keys.Space, {
//                 delay: 150,
//                 scrollBehavior: false,
//                 force: true,
//                 log: false,
//             })
//             .closest('body')
//             .type(arrowKey.repeat(times), {
//                 scrollBehavior: false,
//                 delay: 150,
//                 force: true,
//             })
//             .wait(150)
//             .type(Keys.Space, {
//                 force: true,
//                 scrollBehavior: false,
//             })
//             .wait(250)
//     }
// )
