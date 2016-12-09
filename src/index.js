import '../extjs/resources/css/ext-all-gray.css';
import './css/style.css';
import './css/meringue.css';
import 'd2-analysis/css/ui/GridHeaders.css';

import arrayTo from 'd2-utilizr/lib/arrayTo';

import { api, pivot, manager, config, ui, init, override, ux } from 'd2-analysis';

import { Layout } from './api/Layout';

import { AggregateLayoutWindow } from './ui/AggregateLayoutWindow';
import { QueryLayoutWindow } from './ui/QueryLayoutWindow';
import { AggregateOptionsWindow } from './ui/AggregateOptionsWindow';
import { QueryOptionsWindow } from './ui/QueryOptionsWindow';
import { DownloadButtonItems } from './ui/DownloadButtonItems';
import { DataTypeToolbar } from './ui/DataTypeToolbar';

// override
override.extOverrides();

// extend
api.Layout = Layout;

// references
var refs = {
    api,
    pivot
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

    // ui config
var uiConfig = new config.UiConfig();
refs.uiConfig = uiConfig;

    // app manager
var appManager = new manager.AppManager();
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

    // sessionstorage manager
var sessionStorageManager = new manager.SessionStorageManager(refs);
refs.sessionStorageManager = sessionStorageManager;

    // ui manager
var uiManager = new manager.UiManager(refs);
refs.uiManager = uiManager;

    // instance manager
var instanceManager = new manager.InstanceManager(refs);
refs.instanceManager = instanceManager;

    // table manager
var tableManager = new manager.TableManager(refs);
refs.tableManager = tableManager;

// dependencies

    // instance manager
uiManager.setInstanceManager(instanceManager);

    // i18n manager
dimensionConfig.setI18nManager(i18nManager);
optionConfig.setI18nManager(i18nManager);
periodConfig.setI18nManager(i18nManager);
uiManager.setI18nManager(i18nManager);

    // static
appManager.applyTo([].concat(arrayTo(api), arrayTo(pivot)));
instanceManager.applyTo(arrayTo(api));
uiManager.applyTo(arrayTo(api));
dimensionConfig.applyTo(arrayTo(pivot));
optionConfig.applyTo([].concat(arrayTo(api), arrayTo(pivot)));

    // init ux
Object.keys(ux).forEach(key => ux[key](refs));

// requests
var manifestReq = $.ajax({
    url: 'manifest.webapp',
    dataType: 'text',
    headers: {
        'Accept': 'text/plain; charset=utf-8'
    }
});

var systemInfoUrl = '/system/info.json';
var systemSettingsUrl = '/systemSettings.json?key=keyCalendar&key=keyDateFormat&key=keyAnalysisRelativePeriod&key=keyHideUnapprovedDataInAnalytics&key=keyAnalysisDigitGroupSeparator';
var userAccountUrl = '/api/me/user-account.json';

var systemInfoReq;
var systemSettingsReq;
var userAccountReq;

manifestReq.done(function(text) {
    appManager.manifest = JSON.parse(text);
    appManager.env = process.env.NODE_ENV;
    appManager.setAuth();
    systemInfoReq = $.getJSON(appManager.getApiPath() + systemInfoUrl);

systemInfoReq.done(function(systemInfo) {
    appManager.systemInfo = systemInfo;
    appManager.path = systemInfo.contextPath;
    systemSettingsReq = $.getJSON(appManager.getApiPath() + systemSettingsUrl);

systemSettingsReq.done(function(systemSettings) {
    appManager.systemSettings = systemSettings;
    userAccountReq = $.getJSON(appManager.getPath() + userAccountUrl);

userAccountReq.done(function(userAccount) {
    appManager.userAccount = userAccount;
    calendarManager.setBaseUrl(appManager.getPath());
    calendarManager.setDateFormat(appManager.getDateFormat());
    calendarManager.init(appManager.systemSettings.keyCalendar);

requestManager.add(new api.Request(init.i18nInit(refs)));
requestManager.add(new api.Request(init.authViewUnapprovedDataInit(refs)));
requestManager.add(new api.Request(init.rootNodesInit(refs)));
requestManager.add(new api.Request(init.organisationUnitLevelsInit(refs)));
requestManager.add(new api.Request(init.legendSetsInit(refs)));
requestManager.add(new api.Request(init.dimensionsInit(refs, ['filter=dimensionType:eq:ORGANISATION_UNIT_GROUP_SET'])));
requestManager.add(new api.Request(init.dataApprovalLevelsInit(refs)));

requestManager.set(initialize);
requestManager.run();

});});});});

function initialize() {

    var i18n = i18nManager.get();

    // ui config
    uiConfig.checkout('tracker');

    // app manager
    appManager.appName = 'Event Reports';
    appManager.sessionName = 'eventreport';

    // instance manager
    instanceManager.apiResource = 'eventReport';
    instanceManager.apiEndpoint = 'eventReports';
    instanceManager.apiModule = 'dhis-web-event-reports';
    instanceManager.dataStatisticsEventType = 'EVENT_REPORT_VIEW';

    instanceManager.setFn(function(layout) {
        var sortingId = layout.sorting ? layout.sorting.id : null,
            table;

        // get table
        var getTable = function() {
            var response = layout.getResponse();
            var colAxis = new pivot.TableAxis(layout, response, 'col');
            var rowAxis = new pivot.TableAxis(layout, response, 'row');
            return new pivot.Table(layout, response, colAxis, rowAxis);
        };

        // pre-sort if id
        if (sortingId && sortingId !== 'total') {
            layout.sort();
        }

        // table
        table = getTable();

        // sort if total
        if (sortingId && sortingId === 'total') {
            layout.sort(table);
            table = getTable();
        }

        // render
        uiManager.update(table.html);

        // events
        tableManager.setColumnHeaderMouseHandlers(layout, table);
        tableManager.setValueMouseHandlers(layout, table);

        // mask
        uiManager.unmask();

        // statistics
        instanceManager.postDataStatistics();
    });

    // ui manager
    uiManager.disableRightClick();

    uiManager.enableConfirmUnload();

    uiManager.setIntroHtml(function() {
        return '<div class="ns-viewport-text" style="padding:20px">' +
            '<h3>' + i18nManager.get('example1') + '</h3>' +
            '<div>- ' + i18nManager.get('example2') + '</div>' +
            '<div>- ' + i18nManager.get('example3') + '</div>' +
            '<div>- ' + i18nManager.get('example4') + '</div>' +
            '<h3 style="padding-top:20px">' + i18nManager.get('example5') + '</h3>' +
            '<div>- ' + i18nManager.get('example6') + '</div>' +
            '<div>- ' + i18nManager.get('example7') + '</div>' +
            '<div>- ' + i18nManager.get('example8') + '</div>' +
            '</div>';
    }());

    // windows
    uiManager.reg(AggregateLayoutWindow(refs), 'aggregateLayoutWindow').hide();

    uiManager.reg(QueryLayoutWindow(refs), 'queryLayoutWindow').hide();

    uiManager.reg(AggregateOptionsWindow(refs), 'aggregateOptionsWindow').hide();

    uiManager.reg(QueryOptionsWindow(refs), 'queryOptionsWindow').hide();

    uiManager.reg(ui.FavoriteWindow(refs), 'favoriteWindow').hide();

    // viewport
    var northRegion = uiManager.reg(ui.NorthRegion(refs), 'northRegion');

    var eastRegion = uiManager.reg(ui.EastRegion(refs), 'eastRegion');

    var dataTypeToolbar = uiManager.reg(DataTypeToolbar(refs), 'dataTypeToolbar');

    var defaultIntegrationButton = uiManager.reg(ui.IntegrationButton(refs, {
        isDefaultButton: true,
        btnText: i18n.table,
        btnIconCls: 'ns-button-icon-table'
    }), 'defaultIntegrationButton');

    var chartIntegrationButton = ui.IntegrationButton(refs, {
        objectName: 'chart',
        moduleName: 'dhis-web-visualizer',
        btnIconCls: 'ns-button-icon-chart',
        btnText: i18n.chart,
        menuItem1Text: i18n.go_to_charts,
        menuItem2Text: i18n.open_this_table_as_chart,
        menuItem3Text: i18n.open_last_chart
    });

    var mapIntegrationButton = ui.IntegrationButton(refs, {
        objectName: 'map',
        moduleName: 'dhis-web-mapping',
        btnIconCls: 'ns-button-icon-map',
        btnText: i18n.map,
        menuItem1Text: i18n.go_to_maps,
        menuItem2Text: i18n.open_this_table_as_map,
        menuItem3Text: i18n.open_last_map
    });

    // viewport
    uiManager.reg(ui.Viewport(refs, {
        northRegion: northRegion,
        eastRegion: eastRegion,
        westRegionItems: ui.WestRegionTrackerItems(refs),
        dataTypeToolbar: dataTypeToolbar,
        integrationButtons: [
            defaultIntegrationButton,
            chartIntegrationButton,
            mapIntegrationButton
        ],
        DownloadButtonItems: DownloadButtonItems
    }), 'viewport');
}

global.refs = refs;
