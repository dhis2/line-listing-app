export var TypeToolbar;

// WIP

TypeToolbar = function(refs) {
    var uiManager = refs.uiManager,
    var instaceManager = refs.instaceManager;

    var onTypeClick = function(button) {
        if (!button.pressed) {
            button.toggle();
        }

        uiManager.get('accordion').onTypeClick(typeToolbar.getType());

        instaceManager.getReport();
    };

    var aggregateButton = Ext.create('Ext.button.Button', {
        width: 223,
        param: finalsDataTypeConf.aggregated_values,
        text: '<b>Aggregated values</b><br/>Show aggregated event report',
        style: 'margin-right:1px',
        pressed: true,
        listeners: {
            mouseout: function(cmp) {
                cmp.addCls('x-btn-default-toolbar-small-over');
            }
        }
    });
    paramButtonMap[aggregateButton.param] = aggregateButton;

    var caseButton = Ext.create('Ext.button.Button', {
        width: 224,
        param: finalsDataTypeConf.individual_cases,
        text: '<b>Events</b><br/>Show individual event overview',
        style: 'margin-right:1px',
        listeners: {
            mouseout: function(cmp) {
                cmp.addCls('x-btn-default-toolbar-small-over');
            }
        }
    });
    paramButtonMap[caseButton.param] = caseButton;

    var typeToolbar = Ext.create('Ext.toolbar.Toolbar', {
        style: 'padding:1px; background:#fbfbfb; border:0 none',
        height: 41,
        getType: function() {
            return aggregateButton.pressed ? aggregateButton.param : caseButton.param;
        },
        setType: function(dataType) {
            var button = paramButtonMap[dataType];

            if (button) {
                button.toggle(true);
            }
        },
        defaults: {
            height: 40,
            toggleGroup: 'mode',
            cls: 'x-btn-default-toolbar-small-over',
            handler: function(b) {
                onTypeClick(b);
            }
        },
        items: [
            aggregateButton,
            caseButton
        ],
        listeners: {
            added: function() {
                ns.app.typeToolbar = this;
            }
        }
    });

    return typeToolbar;
};
