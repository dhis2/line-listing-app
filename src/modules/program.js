export const getProgramFromVisualisation = (vis) => {
    return {
        id: vis.program?.id,
        stageId: vis.programStage?.id,
    }
}
