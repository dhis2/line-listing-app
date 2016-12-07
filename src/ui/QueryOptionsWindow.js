import {isString, isNumber, isBoolean, isObject} from 'd2-utilizr';

export var QueryOptionsWindow;

QueryOptionsWindow = function(c) {
    var t = this,

        appManager = c.appManager,
        uiManager = c.uiManager,
        instanceManager = c.instanceManager,
        i18n = c.i18nManager.get(),
        optionConfig = c.optionConfig;

    var completedOnly,
        digitGroupSeparator,
        displayDensity,
        fontSize,

        data,
        style,
        parameters,

        comboboxWidth = 280,
        comboBottomMargin = 1,
        checkboxBottomMargin = 2,
        window;

    completedOnly = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.include_only_completed_events_only,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px',
    });

    displayDensity = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:' + comboBottomMargin + 'px',
        width: comboboxWidth,
        labelWidth: 130,
        fieldLabel: i18n.display_density,
        labelStyle: 'color:#333',
        queryMode: 'local',
        valueField: 'id',
        editable: false,
        value: finalsStyleConf.normal,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'text'],
            data: [
                {id: finalsStyleConf.compact, text: i18n.compact},
                {id: finalsStyleConf.normal, text: i18n.normal},
                {id: finalsStyleConf.comfortable, text: i18n.comfortable}
            ]
        })
    });

    fontSize = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:' + comboBottomMargin + 'px',
        width: comboboxWidth,
        labelWidth: 130,
        fieldLabel: i18n.font_size,
        labelStyle: 'color:#333',
        queryMode: 'local',
        valueField: 'id',
        editable: false,
        value: finalsStyleConf.normal,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'text'],
            data: [
                {id: finalsStyleConf.large, text: i18n.large},
                {id: finalsStyleConf.normal, text: i18n.normal},
                {id: finalsStyleConf.small, text: i18n.small_}
            ]
        })
    });

    digitGroupSeparator = Ext.create('Ext.form.field.ComboBox', {
        labelStyle: 'color:#333',
        cls: 'ns-combo',
        style: 'margin-bottom:0',
        width: comboboxWidth,
        labelWidth: 130,
        fieldLabel: i18n.digit_group_separator,
        queryMode: 'local',
        valueField: 'id',
        editable: false,
        value: finalsStyleConf.space,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'text'],
            data: [
                {id: finalsStyleConf.none, text: i18n.none},
                {id: finalsStyleConf.space, text: i18n.space},
                {id: finalsStyleConf.comma, text: i18n.comma}
            ]
        })
    });

    data = {
        bodyStyle: 'border:0 none',
        style: 'margin-left:14px',
        items: [
            completedOnly
        ]
    };

    style = {
        bodyStyle: 'border:0 none',
        style: 'margin-left:14px',
        items: [
            displayDensity,
            fontSize,
            digitGroupSeparator
        ]
    };

    window = Ext.create('Ext.window.Window', {
        title: i18n.table_options,
        bodyStyle: 'background-color:#fff; padding:3px',
        closeAction: 'hide',
        autoShow: true,
        modal: true,
        resizable: false,
        hideOnBlur: true,
        getOptions: function() {
            return {
                showColTotals: true,
                showColSubTotals: true,
                showRowTotals: false,
                showRowSubTotals: false,
                showDimensionLabels: true,
                showHierarchy: false,
                hideEmptyRows: false,
                hideNaData: false,
                completedOnly: completedOnly.getValue(),
                sortOrder: 0,
                topLimit: 0,
                displayDensity: displayDensity.getValue(),
                fontSize: fontSize.getValue(),
                digitGroupSeparator: digitGroupSeparator.getValue()
                //legendSet: {id: legendSet.getValue()}
            };
        },
        setOptions: function(layout) {
            completedOnly.setValue(isBoolean(layout.completedOnly) ? layout.completedOnly : false);
            displayDensity.setValue(isString(layout.displayDensity) ? layout.displayDensity : finalsStyleConf.normal);
            fontSize.setValue(isString(layout.fontSize) ? layout.fontSize : finalsStyleConf.normal);
            digitGroupSeparator.setValue(isString(layout.digitGroupSeparator) ? layout.digitGroupSeparator : finalsStyleConf.space);
        },
        items: [
            {
                bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
                style: 'margin-top:4px; margin-bottom:6px; margin-left:5px',
                html: i18n.data
            },
            data,
            {
                bodyStyle: 'border:0 none; padding:7px'
            },
            {
                bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
                style: 'margin-top:2px; margin-bottom:6px; margin-left:3px',
                html: i18n.style
            },
            style
        ],
        bbar: [
            '->',
            {
                text: i18n.hide,
                handler: function() {
                    window.hide();
                }
            },
            {
                text: '<b>' + i18n.update + '</b>',
                handler: function() {
                    var config = ns.core.web.report.getLayoutConfig();
                        //layout = ns.core.api.layout.Layout(config);

                    if (!config) {
                        return;
                    }

                    // keep sorting
                    if (ns.app.layout && ns.app.layout.sorting) {
                        config.sorting = Ext.clone(ns.app.layout.sorting);
                    }

                    window.hide();

                    ns.core.web.report.getData(config, false);
                }
            }
        ],
        listeners: {
            show: function(w) {
                if (uiManager.get('optionsButton').rendered) {
                    ns.core.web.window.setAnchorPosition(w, uiManager.get('optionsButton'));

                    if (!w.hasHideOnBlurHandler) {
                        ns.core.web.window.addHideOnBlurHandler(w);
                    }
                }

                // cmp
                w.completedOnly = completedOnly;
                w.displayDensity = displayDensity;
                w.fontSize = fontSize;
                w.digitGroupSeparator = digitGroupSeparator;
            }
        }
    });

    return window;
};
