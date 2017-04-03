import './css/style.css';

import objectApplyIf from 'd2-utilizr/lib/objectApplyIf';
import arrayTo from 'd2-utilizr/lib/arrayTo';

import { api, table, manager, config, init, util } from 'd2-analysis';

import { Layout } from './api/Layout';

// extend
api.Dimension = Dimension;
api.Layout = Layout;
manager.InstanceManager = InstanceManager;

// references
var refs = {
    api,
    table
};

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
appManager.apiVersion = 26;
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
    instanceManager.apiResource = 'reportTable';
    instanceManager.apiEndpoint = 'reportTables';
    instanceManager.apiModule = 'dhis-web-pivot';
    instanceManager.plugin = true;
    instanceManager.dashboard = reportTablePlugin.dashboard;
    instanceManager.applyTo(arrayTo(api));

    // table manager
    var tableManager = new manager.TableManager(instanceRefs);
    instanceRefs.tableManager = tableManager;

    // initialize
    uiManager.setInstanceManager(instanceManager);

    instanceManager.setFn(function(_layout) {
        var sortingId = _layout.sorting ? _layout.sorting.id : null,
            html = '',
            table;

        // get table
        var getTable = function() {
            var response = _layout.getResponse();
            var colAxis = new pivot.PivotTableAxis(instanceRefs, _layout, response, 'col');
            var rowAxis = new pivot.PivotTableAxis(instanceRefs, _layout, response, 'row');
            return new pivot.PivotTable(instanceRefs, _layout, response, colAxis, rowAxis, {skipTitle: true});
        };

        // pre-sort if id
        if (sortingId && sortingId !== 'total') {
            _layout.sort();
        }

        // table
        table = getTable();

        // sort if total
        if (sortingId && sortingId === 'total') {
            _layout.sort(table);
            table = getTable();
        }

        html += reportTablePlugin.showTitles ? uiManager.getTitleHtml(_layout.title || _layout.name) : '';
        html += table.html;

        uiManager.update(html, _layout.el);

        // events
        tableManager.setColumnHeaderMouseHandlers(_layout, table);

        // mask
        uiManager.unmask();
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

global.reportTablePlugin = new util.Plugin({ refs, renderFn: render });
