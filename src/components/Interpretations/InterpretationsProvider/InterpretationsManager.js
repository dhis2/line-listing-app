export class InterpretationsManager {
    constructor(dataEngine, currentUser) {
        if (!dataEngine || !currentUser) {
            throw new Error(
                'Initialised InterpretationsManager without dataEngine or currentUser'
            )
        }
        this.query = dataEngine.query.bind(dataEngine)
        this.mutate = dataEngine.mutate.bind(dataEngine)
        this.currentUser = currentUser
        this.visualizationId = null
        this.interpretationId = null
        this.interpretations = new Map()
        this.activeInterpretationId = null
        this.interpretationsListObservers = new Set()
        this.interpretationObservers = new Map()
    }

    getInterpretationsArray() {
        // New interpretations should show at the top of the list
        // But when we add things to a Map they are inserted at the end
        // We therefore sort them by creation date
        return Array.from(this.interpretations.values()).sort(
            (a, b) => new Date(b.created) - new Date(a.created)
        )
    }

    getInterpretation(id) {
        const interpretation = this.interpretations.get(id)
        if (!interpretation) {
            throw new Error(`Could not get interpretation with id ${id}`)
        }
        return interpretation
    }

    getCurrentUser() {
        return this.currentUser
    }

    getActiveInterpretation() {
        const activeInterpretation = this.interpretations.get(
            this.activeInterpretationId
        )
        if (!activeInterpretation) {
            throw new Error('There currently is no active interpretation')
        }
        return activeInterpretation
    }

    subscribeToInterpretationsListUpdates(callback) {
        this.interpretationsListObservers.add(callback)

        // return cleanup function for useEffect hooks
        return () => {
            this.interpretationsListObservers.delete(callback)
        }
    }

    subscribeToInterpretationUpdates(id, callback) {
        // create callback Set if needed on the fly
        if (!this.interpretationObservers.has(id)) {
            this.interpretationObservers.set(id, new Set())
        }

        this.interpretationObservers.get(id).add(callback)

        // return cleanup function for useEffect hooks
        return () => {
            this.interpretationObservers.get(id).delete(callback)
        }
    }

    notifyInterpretationsListObservers() {
        const interpretationsArray = this.getInterpretationsArray()

        for (const callback of this.interpretationsListObservers) {
            callback(interpretationsArray)
        }
    }

    notifyInterpretationObservers(id) {
        const callbacks = this.interpretationObservers.get(id)
        if (callbacks) {
            for (const callback of callbacks) {
                callback(this.getInterpretation(id))
            }
        }
    }

    clearActiveInterpretation() {
        this.activeInterpretationId = null
    }

    clearInterpretations() {
        this.clearActiveInterpretation()
        this.interpretationsListObservers.clear()
        this.interpretationObservers.clear()
        this.interpretations.clear()
    }

    async fetchInterpretationDetails(id) {
        const interpretation = await this.query({
            resource: 'interpretations',
            id,
            params: {
                fields: [
                    'access[write,manage]',
                    'comments[id,text,created,createdBy[id,displayName]]',
                    'created',
                    'createdBy[id,displayName]',
                    'id',
                    'likedBy',
                    'likes',
                    'text',
                ],
            },
        })
        return interpretation
    }

    async loadActiveInterpretation(id) {
        const interpretation = await this.fetchInterpretationDetails(id)
        this.interpretations.set(id, interpretation)
        this.activeInterpretationId = id
        return this.getActiveInterpretation()
    }

    async loadInterpretationsForVisualization(type, id) {
        const { interpretations } = await this.query({
            resource: 'interpretations',
            params: {
                fields: [
                    'access[write,manage]',
                    'comments[id]',
                    'created',
                    'createdBy[id,displayName]',
                    'id',
                    'likedBy[id]',
                    'likes',
                    'text',
                ],
                filter: `${type}.id:eq:${id}`,
                paging: false,
            },
        })
        this.interpretations.clear()
        this.interpretationsListObservers.clear()
        this.interpretationObservers.clear()
        for (const interpretation of interpretations) {
            this.interpretations.set(interpretation.id, interpretation)
        }
        return interpretations
    }

    async createInterpretation({ type, id, text, onComplete }) {
        await this.mutate(
            {
                resource: `interpretations/${type}/${id}`,
                type: 'create',
                data: text,
            },
            { onComplete }
        )
        const interpretation = await this.fetchInterpretationDetails(id)
        this.interpretations.set(interpretation.id, interpretation)
        this.notifyInterpretationsListObservers()
        return interpretation
    }

    async deleteInterpretation({ id, onComplete, onError }) {
        await this.mutate(
            {
                resource: 'interpretations',
                id,
                type: 'delete',
            },
            { onComplete, onError }
        )
        // This happens when deleting the interpretation from the modal
        if (id === this.getActiveInterpretation().id) {
            this.clearActiveInterpretation()
        }
        this.interpretations.delete(id)
        this.notifyInterpretationsListObservers()
        return null
    }

    async updateInterpretationText({ id, text, onComplete, onError }) {
        await this.mutate(
            {
                resource: 'interpretations',
                type: 'update',
                partial: false,
                id,
                data: text,
            },
            { onComplete, onError }
        )
        const updatedInterpretation = {
            ...this.getInterpretation(id),
            text,
        }
        this.interpretations.set(id, updatedInterpretation)
        this.notifyInterpretationObservers(id)
        return updatedInterpretation
    }

    async toggleInterpretationLike(id) {
        const interpretation = this.getInterpretation(id)
        const isLikedByCurrentUser = interpretation.likedBy.some(
            (likedBy) => likedBy.id === this.currentUser.id
        )
        await this.mutate({
            resource: `interpretations/${id}/like`,
            type: isLikedByCurrentUser ? 'delete' : 'create',
        })
        const updatedInterpretation = {
            ...interpretation,
            likedBy: isLikedByCurrentUser
                ? interpretation.likedBy.filter(
                      (lb) => lb.id !== this.currentUser.id
                  )
                : interpretation.likedBy.concat({
                      id: this.currentUser.id,
                  }),
        }
        this.interpretations.set(id, updatedInterpretation)
        this.notifyInterpretationObservers(id)
        return updatedInterpretation
    }

    async addCommentToActiveInterpretation({ text, onComplete }) {
        const { id } = this.getActiveInterpretation()
        await this.mutate(
            {
                resource: `interpretations/${id}/comments`,
                type: 'create',
                data: text,
            },
            { onComplete }
        )
        const interpretation = await this.fetchInterpretationDetails(id)
        this.interpretations.set(id, interpretation)
        this.notifyInterpretationObservers(id)
        return interpretation
    }

    async deleteCommentFromActiveInterpretation(id) {
        const activeInterpretation = this.getActiveInterpretation()
        await this.mutate({
            resource: 'interpretations',
            id: `${activeInterpretation.id}/comments/${id}`,
            type: 'delete',
        })
        const updatedInterpretation = {
            ...activeInterpretation,
            comments: activeInterpretation.comments.filter(
                ({ id: commentId }) => commentId !== id
            ),
        }
        this.interpretations.set(activeInterpretation.id, updatedInterpretation)
        this.notifyInterpretationObservers(activeInterpretation.id)
        return updatedInterpretation
    }

    async updateCommentForActiveInterpretation({ id, text, onComplete }) {
        const activeInterpretation = this.getActiveInterpretation()
        this.mutate(
            {
                resource: `interpretations/${activeInterpretation.id}/comments/${id}`,
                type: 'update',
                partial: false,
                data: text,
            },
            { onComplete }
        )
        const updatedInterpretation = {
            ...activeInterpretation,
            comments: activeInterpretation.comments.map((comment) =>
                comment.id === id ? { ...comment, text } : comment
            ),
        }
        this.interpretations.set(activeInterpretation.id, updatedInterpretation)
        return updatedInterpretation
    }
}
