import './css/style.css';

import objectApplyIf from 'd2-utilizr/lib/objectApplyIf';
import arrayTo from 'd2-utilizr/lib/arrayTo';

import { api, table, manager, config, init, util } from 'd2-analysis';

import { Dimension } from './api/Dimension';
import { Layout } from './api/Layout';
import { InstanceManager } from './manager/InstanceManager';

// extend
api.Dimension = Dimension;
api.Layout = Layout;
manager.InstanceManager = InstanceManager;

// references
var refs = {
    api,
    init,
    table
};

// inits
var inits = [
    init.legendSetsInit,
    init.dimensionsInit,
    // init.optionSetsInit
];

// dimension config
var dimensionConfig = new config.DimensionConfig();
refs.dimensionConfig = dimensionConfig;

// option config
var optionConfig = new config.OptionConfig();
refs.optionConfig = optionConfig;

// period config
var periodConfig = new config.PeriodConfig();
refs.periodConfig = periodConfig;

// app manager
var appManager = new manager.AppManager(refs);
appManager.sessionName = 'eventreport';
appManager.apiVersion = 29;
refs.appManager = appManager;

// calendar manager
var calendarManager = new manager.CalendarManager(refs);
refs.calendarManager = calendarManager;

// request manager
var requestManager = new manager.RequestManager(refs);
refs.requestManager = requestManager;

// i18n manager
var i18nManager = new manager.I18nManager(refs);
refs.i18nManager = i18nManager;

// session storage manager
var sessionStorageManager = new manager.SessionStorageManager(refs);
refs.sessionStorageManager = sessionStorageManager;

// indexed db manager
// var indexedDbManager = new manager.IndexedDbManager(refs);
// refs.indexedDbManager = indexedDbManager;

// dependencies
dimensionConfig.setI18nManager(i18nManager);
dimensionConfig.init();
optionConfig.setI18nManager(i18nManager);
optionConfig.init();
periodConfig.setI18nManager(i18nManager);
periodConfig.init();

appManager.applyTo([].concat(arrayTo(api), arrayTo(table)));
dimensionConfig.applyTo(arrayTo(table));
optionConfig.applyTo([].concat(arrayTo(api), arrayTo(table)));

// plugin
function render(plugin, layout) {
    var instanceRefs = Object.assign({}, refs);

    // ui manager
    var uiManager = new manager.UiManager(instanceRefs);
    instanceRefs.uiManager = uiManager;
    uiManager.applyTo([].concat(arrayTo(api), arrayTo(table)));

    // instance manager
    var instanceManager = new manager.InstanceManager(instanceRefs);
    instanceRefs.instanceManager = instanceManager;
    instanceManager.apiResource = 'eventReport';
    instanceManager.apiEndpoint = 'eventReports';
    instanceManager.apiModule = 'dhis-web-event-reports';
    instanceManager.plugin = true;
    instanceManager.dashboard = eventReportPlugin.dashboard;
    instanceManager.applyTo(arrayTo(api));

    // table manager
    var tableManager = new manager.TableManager(instanceRefs);
    instanceRefs.tableManager = tableManager;

    // initialize
    uiManager.setInstanceManager(instanceManager);

    instanceManager.setFn(function(_layout) {
        var sortingId = _layout.sorting ? _layout.sorting.id : null,
            tableObject;

        var getHtml = function(title, _tableObject) {
            return (eventReportPlugin.showTitles ? uiManager.getTitleHtml(title) : '') + tableObject.html;
        };

        var createPivotTable = function(__layout) {

            // get table
            var getTable = function() {
                var _response = __layout.getResponse();
                var colAxis = new table.PivotTableAxis(instanceRefs, __layout, _response, 'col');
                var rowAxis = new table.PivotTableAxis(instanceRefs, __layout, _response, 'row');
                return new table.PivotTable(instanceRefs, __layout, _response, colAxis, rowAxis, {skipTitle: true});
            };

            // pre-sort if id
            if (sortingId && sortingId !== 'total') {
                __layout.sort();
            }

            // table
            tableObject = getTable();

            // sort if total
            if (sortingId && sortingId === 'total') {
                __layout.sort(tableObject);
                tableObject = getTable();
            }

            var html = getHtml(__layout.title || __layout.name, tableObject);

            uiManager.update(html, __layout.el);

            // events
            tableManager.setColumnHeaderMouseHandlers(__layout, tableObject);

            // mask
            uiManager.unmask();
        };

        var createEventDataTable = function(__layout) {
            var _response = __layout.getResponse();
            var statusBar = uiManager.get('statusBar');

            tableObject = new table.EventDataTable(refs, __layout, _response);

            if (tableObject) {

                var html = getHtml(__layout.title || __layout.name, tableObject);

                // render
                uiManager.update(tableObject.html, __layout.el);

                __layout.sorting = layout.sorting;
                __layout.setResponse(null);

                // events
                tableManager.setColumnHeaderMouseHandlers(__layout, tableObject);

                if (statusBar) {
                    statusBar.setStatus(__layout, _response);
                }

                // mask
                uiManager.unmask();
            }
        };

        if (_layout.dataType === dimensionConfig.dataType['aggregated_values']) {
            createPivotTable(_layout);
        }
        else if (_layout.dataType === dimensionConfig.dataType['individual_cases']) {
            createEventDataTable(_layout);
        }
    });

    if (plugin.loadingIndicator) {
        uiManager.renderLoadingIndicator(layout.el);
    }

    if (layout.id) {
        instanceManager.getById(layout.id, function(_layout) {
            _layout = new api.Layout(instanceRefs, objectApplyIf(layout, _layout));

            instanceManager.getReport(_layout);
        });
    }
    else {
        instanceManager.getReport(new api.Layout(instanceRefs, layout));
    }
};

global.eventReportPlugin = new util.Plugin({ refs, inits, renderFn: render, type: 'EVENT_REPORT' });
