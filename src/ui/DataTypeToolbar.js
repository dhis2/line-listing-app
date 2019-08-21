export var DataTypeToolbar;

DataTypeToolbar = function(refs) {
    var uiManager = refs.uiManager,
        i18nManager = refs.i18nManager,
        dimensionConfig = refs.dimensionConfig,
        optionConfig = refs.optionConfig;

    var i18n = i18nManager.get();

    var DATA_TYPE_ID = 'dataType'
    var OUTPUT_TYPE_ID = 'outputType'

    var DATA_TYPE_PIVOT_ID = dimensionConfig.dataType['aggregated_values'];
    var DATA_TYPE_LIST_ID = dimensionConfig.dataType['individual_cases'];

    var OUTPUT_TYPE_EVENT_ID = optionConfig.getOutputType('event').id;
    var OUTPUT_TYPE_ENROLLMENT_ID = optionConfig.getOutputType('enrollment').id;

    var comboBoxWidth = 224;

    var scrollbarWidth = uiManager.getScrollbarSize().width;

    var onDataTypeSelect = function(value) {
        uiManager.get('accordion').onDataTypeSelect &&
        uiManager.get('accordion').onDataTypeSelect(value || dataType.getValue());
    };

    var onOutputTypeSelect = function(value) {
        uiManager.get('accordion').onOutputTypeSelect &&
        uiManager.get('accordion').onOutputTypeSelect(value || outputType.getValue());
    };

    var getCombobox = function(data, value, propName, labelText, onSelect) {
        return Ext.create('Ext.form.field.ComboBox', {
            editable: false,
            valueField: 'id',
            displayField: 'name',
            fieldLabel: labelText,
            labelAlign: 'top',
            labelCls: 'ns-form-item-label-top bold',
            labelSeparator: '',
            queryMode: 'local',
            lastQuery: '',
            width: comboBoxWidth + (scrollbarWidth / 2),
            listConfig: { loadMask: false },
            style: 'margin:1px 1px 1px 0; padding-bottom:1px;',
            value: value,
            propName: propName,
            store: {
                fields: ['id', 'name'],
                data: data,
            },
            listeners: {
                select: onSelect,
            },
        });
    };

    var dataType = getCombobox([
        { id: DATA_TYPE_PIVOT_ID, name: i18n.pivot_table },
        { id: DATA_TYPE_LIST_ID, name: i18n.line_list },
    ], DATA_TYPE_PIVOT_ID, DATA_TYPE_ID, i18n.table_style, cmp => onDataTypeSelect(cmp.getValue()));

    uiManager.reg(dataType, 'dataType');

    var outputType = getCombobox([
        { id: OUTPUT_TYPE_EVENT_ID, name: i18n.event },
        { id: OUTPUT_TYPE_ENROLLMENT_ID, name: i18n.enrollment },
    ], OUTPUT_TYPE_EVENT_ID, OUTPUT_TYPE_ID, i18n.output_type, cmp => onOutputTypeSelect(cmp.getValue()));

    uiManager.reg(outputType, 'outputType');

    var dataTypeToolbar = Ext.create('Ext.container.Container', {
        layout: 'column',
        style: 'padding:3px 1px 0; border-top:1px solid #d0d0d0; border-bottom:1px solid #d0d0d0; background-color: #f6f6f6',
        getDataType: function() {
            return dataType.getValue();
        },
        setDataType: function(type) {
            if (!type) {
                dataType.reset();
            } else {
                dataType.setValue(type);
            }
        },
        getOutputType: function() {
            return outputType.getValue();
        },
        setOutputType: function(type) {
            if (!type) {
                outputType.reset();
            } else {
                outputType.setValue(type);
            }
        },
        items: [
            dataType,
            outputType
        ],
        cmp: {
            dataType: dataType,
            outputType: outputType,
        }
    });

    return dataTypeToolbar;
};
