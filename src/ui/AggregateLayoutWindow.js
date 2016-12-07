import arrayContains from 'd2-utilizr/lib/arrayContains';
import arrayDifference from 'd2-utilizr/lib/arrayDifference';
import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arrayPluck from 'd2-utilizr/lib/arrayPluck';
import clone from 'd2-utilizr/lib/clone';
import isArray from 'd2-utilizr/lib/isArray';
import isDefined from 'd2-utilizr/lib/isDefined';
import isString from 'd2-utilizr/lib/isString';

export var AggregateLayoutWindow;

AggregateLayoutWindow = function(c) {
    var t = this,

        uiManager = c.uiManager,
        instanceManager = c.instanceManager,
        i18n = c.i18nManager.get(),
        dimensionConfig = c.dimensionConfig,

        confData = dimensionConfig.get('data'),
        confPeriod = dimensionConfig.get('period'),
        confOrganisationUnit = dimensionConfig.get('organisationUnit'),
        confCategory = dimensionConfig.get('category'),

        dimensionStoreMap = {},
        margin = 1,
        defaultWidth = 200,
        defaultHeight = 220;

    // components

    var row,
        rowStore,
        col,
        colStore,
        fixedFilter,
        fixedFilterStore,
        filter,
        filterStore,
        onValueSelect,
        value,
        val,
        onCollapseDataDimensionsChange,
        collapseDataDimensions,
        aggregationType,

        getStore,
        getStoreKeys,
        addDimension,
        removeDimension,
        hasDimension,
        saveState,
        resetData,
        reset,
        dimensionStoreMap = {},

        dimensionPanel,
        selectPanel,
        window,

        margin = 1,
        defaultWidth = 210,
        defaultHeight = 220,
        maxHeight = (uiManager.get('viewport').getHeight() - 100) / 2,

        defaultValueId = 'default';

    getStore = function(applyConfig) {
        var config = {},
            store;

        config.fields = ['id', 'name'];

        Ext.apply(config, applyConfig);

        config.getDimensionNames = function() {
            var dimensionNames = [];

            this.each(function(r) {
                dimensionNames.push(r.data.id);
            });

            return Ext.clone(dimensionNames);
        };

        store = Ext.create('Ext.data.Store', config);

        return store;
    };

    getStoreKeys = function(store) {
        var keys = [],
            items = store.data.items;

        if (items) {
            for (var i = 0; i < items.length; i++) {
                keys.push(items[i].data.id);
            }
        }

        return keys;
    };

    colStore = getStore({name: 'colStore'});
    rowStore = getStore({name: 'rowStore'});
    fixedFilterStore = getStore({name: 'fixedFilterStore'});
    filterStore = getStore({name: 'filterStore'});
    valueStore = getStore({name: 'valueStore'});

    // store functions
    valueStore.addDefaultData = function() {
        if (!this.getById(defaultValueId)) {
            this.insert(0, {
                id: defaultValueId,
                name: i18n.number_of_events
            });
        }
    };

    fixedFilterStore.setListHeight = function() {
        var fixedFilterHeight = 26 + (this.getRange().length * 21) + 1;
        fixedFilter.setHeight(fixedFilterHeight);
        filter.setHeight(defaultHeight - fixedFilterHeight);
    };

    // gui
    col = Ext.create('Ext.ux.form.MultiSelect', {
        cls: 'ns-toolbar-multiselect-leftright',
        width: defaultWidth,
        height: defaultHeight,
        style: 'margin-bottom:' + margin + 'px',
        valueField: 'id',
        displayField: 'name',
        dragGroup: 'layoutDD',
        dropGroup: 'layoutDD',
        store: colStore,
        tbar: {
            height: 25,
            items: {
                xtype: 'label',
                text: i18n.column_dimensions,
                cls: 'ns-toolbar-multiselect-leftright-label'
            }
        },
        listeners: {
            afterrender: function(ms) {
                ms.boundList.on('itemdblclick', function(view, record) {
                    ms.store.remove(record);
                    filterStore.add(record);
                });

                ms.store.on('add', function() {
                    Ext.defer( function() {
                        ms.boundList.getSelectionModel().deselectAll();
                    }, 10);
                });
            }
        }
    });

    row = Ext.create('Ext.ux.form.MultiSelect', {
        cls: 'ns-toolbar-multiselect-leftright',
        width: defaultWidth,
        height: defaultHeight,
        style: 'margin-right:' + margin + 'px; margin-bottom:0px',
        valueField: 'id',
        displayField: 'name',
        dragGroup: 'layoutDD',
        dropGroup: 'layoutDD',
        store: rowStore,
        tbar: {
            height: 25,
            items: {
                xtype: 'label',
                text: i18n.row_dimensions,
                cls: 'ns-toolbar-multiselect-leftright-label'
            }
        },
        listeners: {
            afterrender: function(ms) {
                ms.boundList.on('itemdblclick', function(view, record) {
                    ms.store.remove(record);
                    filterStore.add(record);
                });

                ms.store.on('add', function() {
                    Ext.defer( function() {
                        ms.boundList.getSelectionModel().deselectAll();
                    }, 10);
                });
            }
        }
    });

    fixedFilter = Ext.create('Ext.ux.form.MultiSelect', {
        cls: 'ns-toolbar-multiselect-leftright ns-multiselect-fixed',
        width: defaultWidth,
        height: 26,
        style: 'margin-right:' + margin + 'px; margin-bottom:0',
        valueField: 'id',
        displayField: 'name',
        store: fixedFilterStore,
        tbar: {
            height: 25,
            items: {
                xtype: 'label',
                text: i18n.report_filter,
                cls: 'ns-toolbar-multiselect-leftright-label'
            }
        },
        listeners: {
            afterrender: function(ms) {
                ms.on('change', function() {
                    ms.boundList.getSelectionModel().deselectAll();
                });
            }
        }
    });

    filter = Ext.create('Ext.ux.form.MultiSelect', {
        cls: 'ns-toolbar-multiselect-leftright ns-multiselect-dynamic',
        width: defaultWidth,
        height: defaultHeight - 26,
        style: 'margin-right:' + margin + 'px; margin-bottom:' + margin + 'px',
        bodyStyle: 'border-top:0 none',
        valueField: 'id',
        displayField: 'name',
        dragGroup: 'layoutDD',
        dropGroup: 'layoutDD',
        store: filterStore,
        listeners: {
            afterrender: function(ms) {
                ms.store.on('add', function() {
                    Ext.defer( function() {
                        ms.boundList.getSelectionModel().deselectAll();
                    }, 10);
                });
            }
        }
    });

    aggregationType = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo h22',
        width: 80,
        height: 22,
        style: 'margin: 0',
        fieldStyle: 'height: 22px',
        queryMode: 'local',
        valueField: 'id',
        editable: false,
        disabled: true,
        value: 'COUNT',
        disabledValue: 'COUNT',
        defaultValue: 'AVERAGE',
        setDisabled: function() {
            this.setValue(this.disabledValue);
            this.disable();
        },
        setEnabled: function() {
            this.setValue(this.defaultValue);
            this.enable();
        },
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'text'],
            data: optionConfig.getAggregationTypeRecords()
        }),
        resetData: function() {
            this.setDisabled();
        }
    });

    onValueSelect = function(id) {
        id = id || value.getValue();

        if (id === defaultValueId) {
            aggregationType.setDisabled();
        }
        else {
            aggregationType.setEnabled();

            // remove ux and layout item
            if (hasDimension(id, valueStore)) {
                var uxArray = ns.app.accordion.getUxArray(id);

                for (var i = 0; i < uxArray.length; i++) {
                    uxArray[i].removeDataElement();
                }
            }
        }
    };

    value = Ext.create('Ext.form.field.ComboBox', {
        cls: 'ns-combo h24',
        width: defaultWidth - 4,
        height: 24,
        fieldStyle: 'height: 24px',
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        editable: false,
        store: valueStore,
        value: defaultValueId,
        setDefaultData: function() {
            valueStore.addDefaultData();
            this.setValue(defaultValueId);
            aggregationType.resetData();
        },
        setDefaultDataIf: function() {
            if (!value.getValue()) {
                this.setDefaultData();
            }
        },
        resetData: function() {
            valueStore.removeAll();
            this.clearValue();
            aggregationType.resetData();
        },
        listeners: {
            select: function(cb, r) {
                onValueSelect(r[0].data.id);
            }
        }
    });

    val = Ext.create('Ext.panel.Panel', {
        bodyStyle: 'padding: 1px',
        width: defaultWidth,
        height: 220,
        items: value,
        tbar: {
            height: 25,
            style: 'padding: 1px',
            items: [
                {
                    xtype: 'label',
                    height: 22,
                    style: 'padding-left: 6px; line-height: 22px',
                    text: i18n.value
                },
                '->',
                aggregationType
            ]
        }
    });

    onCollapseDataDimensionsChange = function(value) {
        toggleDataItems(value);
        toggleValueGui(value);
    };

    collapseDataDimensions = Ext.create('Ext.form.field.Checkbox', {
        boxLabel: i18n.collapse_data_dimensions,
        style: 'margin-left: 3px',
        listeners: {
            change: function(chb, value) {
                onCollapseDataDimensionsChange(value);
            }
        }
    });

    selectPanel = Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border:0 none',
        items: [
            {
                xtype: 'container',
                layout: 'column',
                bodyStyle: 'border:0 none',
                items: [
                    {
                        xtype: 'container',
                        bodyStyle: 'border:0 none',
                        items: [
                            fixedFilter,
                            filter
                        ]
                    },
                    col
                ]
            },
            {
                xtype: 'container',
                layout: 'column',
                bodyStyle: 'border:0 none',
                items: [
                    row,
                    val
                ]
            }
        ]
    });

    addDimension = function(record, store, excludedStores, force) {
        if (record.isProgramIndicator) {
            return;
        }

        store = store && force ? store : dimensionStoreMap[record.id] || store || filterStore;

        if (hasDimension(record.id, excludedStores)) {
            if (force) {
                removeDimension(record.id);
                store.add(record);
            }
        }
        else {
            if (record.id !== value.getValue()) {
                store.add(record);
            }
        }

        onCollapseDataDimensionsChange(collapseDataDimensions.getValue());
    };

    removeDimension = function(id, excludedStores) {
        var stores = arrayDifference([colStore, rowStore, filterStore, fixedFilterStore, valueStore], arrayFrom(excludedStores));

        for (var i = 0, store, index; i < stores.length; i++) {
            store = stores[i];
            index = store.findExact('id', id);

            if (index != -1) {
                store.remove(store.getAt(index));
                dimensionStoreMap[id] = store;
            }
        }
    };

    hasDimension = function(id, excludedStores) {
        var stores = arrayDifference([colStore, rowStore, filterStore, fixedFilterStore, valueStore], arrayFrom(excludedStores));

        for (var i = 0, store, index; i < stores.length; i++) {
            store = stores[i];
            index = store.findExact('id', id);

            if (index != -1) {
                return true;
            }
        }

        return false;
    };

    saveState = function(map) {
        map = map || dimensionStoreMap;

        colStore.each(function(record) {
            map[record.data.id] = colStore;
        });

        rowStore.each(function(record) {
            map[record.data.id] = rowStore;
        });

        filterStore.each(function(record) {
            map[record.data.id] = filterStore;
        });

        fixedFilterStore.each(function(record) {
            map[record.data.id] = fixedFilterStore;
        });

        //valueStore.each(function(record) {
            //map[record.data.id] = valueStore;
        //});

        return map;
    };

    resetData = function() {
        var map = saveState({}),
            keys = ['ou', 'pe', 'dates'];

        for (var key in map) {
            if (map.hasOwnProperty(key) && !arrayContains(keys, key)) {
                removeDimension(key);
            }
        }
    };

    reset = function(isAll, skipValueStore) {
        colStore.removeAll();
        rowStore.removeAll();
        fixedFilterStore.removeAll();
        filterStore.removeAll();

        if (!skipValueStore) {
            valueStore.removeAll();
            valueStore.addDefaultData();
        }

        value.clearValue();

        if (!isAll) {
            colStore.add({id: dimConf.organisationUnit.dimensionName, name: dimConf.organisationUnit.name});
            colStore.add({id: dimConf.period.dimensionName, name: dimConf.period.name});
        }

        fixedFilterStore.setListHeight();
    };

    toggleDataItems = function(param) {
        var stores = [colStore, rowStore, filterStore, fixedFilterStore],
            collapse = isObject(param) && isDefined(param.collapseDataItems) ? param.collapseDataItems : param,
            keys = ['ou', 'pe', 'dates'],
            dimensionKeys = arrayPluck(ns.core.init.dimensions || [], 'id'),
            dy = ['dy'],
            keys;

        // clear filters
        for (var i = 0, store; i < stores.length; i++) {
            stores[i].clearFilter();
        }

        // add dy if it does not exist
        if (!hasDimension('dy')) {
            addDimension({
                id: 'dy',
                dimension: 'dy',
                name: i18n.data
            }, rowStore);
        }

        // keys
        if (collapse) { // included keys
            keys = ['ou', 'pe', 'dates', 'dy'].concat(dimensionKeys);
        }
        else { // excluded keys
            keys = ['dy'];
        }

        // data items
        for (var i = 0, store, include; i < stores.length; i++) {
            store = stores[i];

            if (collapse) {
                store.filterBy(function(record, id) {
                    return arrayContains(keys, record.data.id);
                });
            }
            else {
                store.filterBy(function(record, id) {
                    return !arrayContains(keys, record.data.id);
                });
            }
        }
    };

    toggleValueGui = function(param) {
        var collapse = isObject(param) && param.collapseDataItems ? param.collapseDataItems : param;

        val.setDisabled(collapse);
    };

    window = Ext.create('Ext.window.Window', {
        title: i18n.table_layout,
        bodyStyle: 'background-color:#fff; padding:' + margin + 'px',
        closeAction: 'hide',
        autoShow: true,
        modal: true,
        resizable: false,
        dataType: dimensionConfig.dataType['aggregated_values'],
        colStore: colStore,
        rowStore: rowStore,
        fixedFilterStore: fixedFilterStore,
        filterStore: filterStore,
        valueStore: valueStore,
        value: value,
        addDimension: addDimension,
        removeDimension: removeDimension,
        hasDimension: hasDimension,
        dimensionStoreMap: dimensionStoreMap,
        saveState: saveState,
        resetData: resetData,
        reset: reset,
        onCollapseDataDimensionsChange: onCollapseDataDimensionsChange,
        collapseDataDimensions: collapseDataDimensions,
        toggleDataItems: toggleDataItems,
        toggleValueGui: toggleValueGui,
        getValueConfig: function() {
            var config = {},
                valueId = value.getValue();

            if (valueId && valueId !== defaultValueId) {
                config.value = {id: valueId};
                config.aggregationType = aggregationType.getValue();
            }

            return config;
        },
        setValueConfig: function(valueId, aggType) {
            value.setValue(valueId);
            onValueSelect();

            aggregationType.setValue(aggType);
        },
        getOptions: function() {
            return {
                collapseDataDimensions: collapseDataDimensions.getValue()
            };
        },
        hideOnBlur: true,
        items: selectPanel,
        bbar: [
            collapseDataDimensions,
            '->',
            {
                text: i18n.hide,
                listeners: {
                    added: function(b) {
                        b.on('click', function() {
                            window.hide();
                        });
                    }
                }
            },
            {
                text: '<b>' + i18n.update + '</b>',
                listeners: {
                    added: function(b) {
                        b.on('click', function() {
                            instanceManager.getReport();

                            window.hide();
                        });
                    }
                }
            }
        ],
        listeners: {
            show: function(w) {
                var layoutButton = uiManager.get('layoutButton') || {};

                if (layoutButton.rendered) {
                    c.uiManager.setAnchorPosition(w, layoutButton);

                    if (!w.hasHideOnBlurHandler) {
                        c.uiManager.addHideOnBlurHandler(w);
                    }
                }

                // value
                value.setDefaultDataIf();
            },
            render: function() {
                reset();

                fixedFilterStore.on('add', function() {
                    this.setListHeight();
                });
                fixedFilterStore.on('remove', function() {
                    this.setListHeight();
                });
            }
        }
    });

    return window;
};
