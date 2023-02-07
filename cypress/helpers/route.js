const getRouteFromHash = (hash) => hash.slice(hash.lastIndexOf('/') + 1)

export const expectRouteToBeEmpty = () =>
    cy
        .location()
        .should((loc) => expect(getRouteFromHash(loc.hash)).to.have.length(0))

export const expectRouteToEqual = (id) =>
    cy
        .location()
        .should((loc) => expect(getRouteFromHash(loc.hash)).to.equal(id))
