import { InstanceManager } from 'd2-analysis';

export { InstanceManager };

InstanceManager.prototype.getReport = function(layout, isFavorite, skipState, forceUiState, fn) {
    var t = this,
        refs = t.getRefs();

    var { indexedDbManager } = refs;

    var { Response } = refs.api;

    var _fn = function() {
        if (!skipState) {
            t.setState(layout, isFavorite, false, forceUiState);
        }

        (fn || t.getFn())(layout);
    };

    // layout
    if (!layout) {
        layout = t.getLayout();

        if (!layout) {
            return;
        }
    }

    t.uiManager.mask();

    // response
    var response = layout.getResponse();

    // fn
    if (response) {
       _fn();
    }
    else {
        layout.data().done(function(res) {
            var optionSetIds = res.headers.filter(h => !!h.optionSet).map(h => h.optionSet);

            var fn = function() {
                layout.setResponse(new Response(refs, res));

                _fn();
            };

            // init
            if (optionSetIds.length) {
                indexedDbManager.getOptionSets(optionSetIds, fn);
            }
            else {
                fn();
            }
        });
    }
};
