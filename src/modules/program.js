export const getProgramFromVisualisation = (vis) => {
    return {
        id: vis.program?.id,
        stage: vis.programStage?.id,
    }
}
