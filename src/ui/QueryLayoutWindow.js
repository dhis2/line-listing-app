import arrayContains from 'd2-utilizr/lib/arrayContains';
import clone from 'd2-utilizr/lib/clone';
import isArray from 'd2-utilizr/lib/isArray';
import isString from 'd2-utilizr/lib/isString';

export var QueryLayoutWindow;

QueryLayoutWindow = function(c) {
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
        defaultWidth = 210,
        defaultHeight = 158,

        dataType = dimensionConfig.dataType['individual_cases'];

    var getStore = function(data) {
        var config = {};

        config.fields = ['id', 'name'];

        if (data) {
            config.data = data;
        }

        config.getDimensionNames = function() {
            var dimensionNames = [];

            this.each(function(r) {
                dimensionNames.push(r.data.id);
            });

            return Ext.clone(dimensionNames);
        };

        return Ext.create('Ext.data.Store', config);
    };

    var getStoreKeys = function(store) {
        var keys = [],
            items = store.data.items;

        if (items) {
            for (var i = 0; i < items.length; i++) {
                keys.push(items[i].data.id);
            }
        }

        return keys;
    };

    var dimensionStore = getStore();
    dimensionStore.reset = function(all) {
        dimensionStore.removeAll();
    };

    var colStore = getStore();

    var getCmpHeight = function() {
        var size = dimensionStore.totalCount,
            expansion = 10,
            height = defaultHeight,
            maxHeight = (uiManager.get('viewport').getHeight() - 100) / 2
            diff;

        if (size > 10) {
            diff = size - 10;
            height += (diff * expansion);
        }

        height = height > maxHeight ? maxHeight : height;

        return height;
    };

    var dimension = Ext.create('Ext.ux.form.MultiSelect', {
        cls: 'ns-toolbar-multiselect-leftright',
        width: defaultWidth - 50,
        height: defaultHeight,
        style: 'margin-right:' + margin + 'px; margin-bottom:0px',
        valueField: 'id',
        displayField: 'name',
        dragGroup: 'querylayoutDD',
        dropGroup: 'querylayoutDD',
        ddReorder: false,
        store: dimensionStore,
        tbar: {
            height: 25,
            items: {
                xtype: 'label',
                text: i18n.excluded_dimensions,
                cls: 'ns-toolbar-multiselect-leftright-label'
            }
        },
        listeners: {
            afterrender: function(ms) {
                ms.boundList.on('itemdblclick', function(view, record) {
                    ms.store.remove(record);
                    colStore.add(record);
                });

                ms.store.on('add', function() {
                    Ext.defer( function() {
                        ms.boundList.getSelectionModel().deselectAll();
                    }, 10);
                });
            }
        }
    });

    var col = Ext.create('Ext.ux.form.MultiSelect', {
        cls: 'ns-toolbar-multiselect-leftright',
        width: defaultWidth,
        height: defaultHeight,
        style: 'margin-bottom: 0px',
        valueField: 'id',
        displayField: 'name',
        dragGroup: 'querylayoutDD',
        dropGroup: 'querylayoutDD',
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
                    dimensionStore.add(record);
                });

                ms.store.on('add', function() {
                    Ext.defer( function() {
                        ms.boundList.getSelectionModel().deselectAll();
                    }, 10);
                });
            }
        }
    });

    var getSetup = function() {
        return {
            col: getStoreKeys(colStore)
        };
    };

    var addDimension = function(record, store) {
        var store = dimensionStoreMap[record.id] || store || dimensionStore;

        if (!hasDimension(record.id)) {
            store.add(record);
        }
    };

    var removeDimension = function(dataElementId) {
        var stores = [dimensionStore, colStore];

        for (var i = 0, store, index; i < stores.length; i++) {
            store = stores[i];
            index = store.findExact('id', dataElementId);

            if (index != -1) {
                store.remove(store.getAt(index));
                dimensionStoreMap[dataElementId] = store;
            }
        }
    };

    var hasDimension = function(id) {
        var stores = [colStore, dimensionStore];

        for (var i = 0, store, index; i < stores.length; i++) {
            store = stores[i];
            index = store.findExact('id', id);

            if (index != -1) {
                return true;
            }
        }

        return false;
    };

    var saveState = function(map) {
        map = map || dimensionStoreMap;

        dimensionStore.each(function(record) {
            map[record.data.id] = dimensionStore;
        });

        colStore.each(function(record) {
            map[record.data.id] = colStore;
        });

        return map;
    };

    var resetData = function() {
        var map = saveState({}),
            keys = ['pe', 'latitude', 'longitude', 'ou'];

        for (var key in map) {
            if (map.hasOwnProperty(key) && !Ext.Array.contains(keys, key)) {
                removeDimension(key);
            }
        }
    };

    var reset = function() {
        colStore.removeAll();
        dimensionStore.removeAll();

        colStore.add({id: 'pe', name: 'Event date'});
        colStore.add({id: 'ou', name: 'Organisation unit'});

        dimensionStore.add({id: 'longitude', name: 'Longitude'});
        dimensionStore.add({id: 'latitude', name: 'Latitude'});
    };

    var window = Ext.create('Ext.window.Window', {
        title: i18n.table_layout,
        layout: 'column',
        bodyStyle: 'background-color:#fff; padding:' + margin + 'px',
        closeAction: 'hide',
        autoShow: true,
        modal: true,
        resizable: false,
        getSetup: getSetup,
        dimensionStore: dimensionStore,
        dataType: dataType,
        colStore: colStore,
        addDimension: addDimension,
        removeDimension: removeDimension,
        hasDimension: hasDimension,
        saveState: saveState,
        resetData: resetData,
        reset: reset,
        getValueConfig: function() {
            return {};
        },
        hideOnBlur: true,
        items: [
            dimension,
            col
        ],
        bbar: [
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
                            window.hide();

                            instanceManager.getReport();
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
            },
            render: function() {
                reset();
            }
        }
    });

    return window;
};
