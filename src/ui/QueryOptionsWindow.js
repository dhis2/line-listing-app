import {isString, isNumber, isBoolean, isObject} from 'd2-utilizr';

export var QueryOptionsWindow;

QueryOptionsWindow = function(c) {
    var t = this,

        appManager = c.appManager,
        uiManager = c.uiManager,
        instanceManager = c.instanceManager,
        i18n = c.i18nManager.get(),
        optionConfig = c.optionConfig;

    var comboboxWidth = 280,
        comboBottomMargin = 1,
        checkboxBottomMargin = 2;

    var completedOnly = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.include_only_completed_events_only,
        style: 'margin-bottom:' + checkboxBottomMargin + 'px',
    });

    var displayDensity = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:' + comboBottomMargin + 'px',
        width: comboboxWidth,
        labelWidth: 130,
        fieldLabel: i18n.display_density,
        labelStyle: 'color:#333',
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        value: optionConfig.getDisplayDensity('normal').id,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'index'],
            data: optionConfig.getDisplayDensityRecords()
        })
    });

    var fontSize = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo',
        style: 'margin-bottom:' + comboBottomMargin + 'px',
        width: comboboxWidth,
        labelWidth: 130,
        fieldLabel: i18n.font_size,
        labelStyle: 'color:#333',
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        value: optionConfig.getFontSize('normal').id,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'index'],
            data: optionConfig.getFontSizeRecords()
        })
    });

    var digitGroupSeparator = Ext.create('Ext.form.field.ComboBox', {
        labelStyle: 'color:#333',
        cls: 'ns-combo',
        style: 'margin-bottom:0',
        width: comboboxWidth,
        labelWidth: 130,
        fieldLabel: i18n.digit_group_separator,
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        value: optionConfig.getDigitGroupSeparator('space').id,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'index'],
            data: optionConfig.getDigitGroupSeparatorRecords()
        })
    });

    var data = {
        bodyStyle: 'border:0 none',
        style: 'margin-left:14px',
        items: [
            completedOnly
        ]
    };

    var style = {
        bodyStyle: 'border:0 none',
        style: 'margin-left:14px',
        items: [
            displayDensity,
            fontSize,
            digitGroupSeparator
        ]
    };

    var window = Ext.create('Ext.window.Window', {
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
            displayDensity.setValue(isString(layout.displayDensity) ? layout.displayDensity : optionConfig.getDisplayDensity('normal').id);
            fontSize.setValue(isString(layout.fontSize) ? layout.fontSize : optionConfig.getFontSize('normal').id);
            digitGroupSeparator.setValue(isString(layout.digitGroupSeparator) ? layout.digitGroupSeparator : optionConfig.getDisplayDensity('space').id);
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
                    window.hide();

                    instanceManager.getReport();
                }
            }
        ],
        listeners: {
            show: function(w) {
                var optionsButton = uiManager.get('optionsButton') || {};

                if (optionsButton.rendered) {
                    c.uiManager.setAnchorPosition(w, optionsButton);

                    if (!w.hasHideOnBlurHandler) {
                        c.uiManager.addHideOnBlurHandler(w);
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
