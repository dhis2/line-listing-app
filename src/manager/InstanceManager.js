import {InstanceManager} from 'd2-analysis';

export {InstanceManager};

InstanceManager.prototype.getReport = function(layout, isFavorite, skipState, forceUiState, fn) {
    var t = this,
        refs = t.getRefs();

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
        layout.data().done(function(response) {
            layout.setResponse(new Response(refs, response));

            _fn();
        });
    }
};
