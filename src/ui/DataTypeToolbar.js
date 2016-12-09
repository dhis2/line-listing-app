export var DataTypeToolbar;

DataTypeToolbar = function(refs) {
    var uiManager = refs.uiManager,
        instaceManager = refs.instaceManager,
        dimensionConfig = refs.dimensionConfig,
        i18n = refs.i18nManager.get();

    var dataTypeButtonParamMap = {};

    var onTypeClick = function(button) {
        if (!button.pressed) {
            button.toggle();
        }

        uiManager.get('accordion').onTypeClick(dataTypeToolbar.getType());

        instaceManager.getReport();
    };

    var aggregateTypeButton = Ext.create('Ext.button.Button', {
        width: 223,
        param: dimensionConfig.dataType['aggregated_values'],
        text: '<b>' + i18n.aggregated_values + '</b><br/>' + i18n.show_aggregated_event_report,
        style: 'margin-right:1px',
        pressed: true,
        listeners: {
            mouseout: function(cmp) {
                cmp.addCls('x-btn-default-toolbar-small-over');
            }
        }
    });
    uiManager.reg(aggregateTypeButton, 'aggregateTypeButton');
    dataTypeButtonParamMap[aggregateTypeButton.param] = aggregateTypeButton;

    var caseTypeButton = Ext.create('Ext.button.Button', {
        width: 224,
        param: dimensionConfig.dataType['individual_cases'],
        text: '<b>Events</b><br/>Show individual event overview',
        style: 'margin-right:1px',
        listeners: {
            mouseout: function(cmp) {
                cmp.addCls('x-btn-default-toolbar-small-over');
            }
        }
    });
    uiManager.reg(caseTypeButton, 'caseTypeButton');
    dataTypeButtonParamMap[caseTypeButton.param] = caseTypeButton;

    var dataTypeToolbar = Ext.create('Ext.toolbar.Toolbar', {
        style: 'padding:1px; background:#fbfbfb; border:0 none',
        height: 41,
        getType: function() {
            return aggregateTypeButton.pressed ? aggregateTypeButton.param : caseTypeButton.param;
        },
        setType: function(dataType) {
            var button = dataTypeButtonParamMap[dataType];

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
            aggregateTypeButton,
            caseTypeButton
        ]
    });

    return dataTypeToolbar;
};
