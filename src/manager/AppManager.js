import stringReplaceAll from 'd2-utilizr/lib/stringReplaceAll';
import { AppManager } from 'd2-analysis';

export { AppManager };

const analysisFields = [
    'dataElementDimensions[legendSet[id,name],dataElement[id,name]]',
];

AppManager.prototype.getAnalysisFields = function() {
    return this.analysisFields ?
        this.analysisFields :
        (this.analysisFields = [].concat(
            stringReplaceAll(this.defaultAnalysisFields.join(','), '$', this.getDisplayPropertyUrl()),
            analysisFields
        ));
};
