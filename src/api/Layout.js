import isArray from 'd2-utilizr/lib/isArray';
import isBoolean from 'd2-utilizr/lib/isBoolean';
import isEmpty from 'd2-utilizr/lib/isEmpty';
import isNumber from 'd2-utilizr/lib/isNumber';
import isNumeric from 'd2-utilizr/lib/isNumeric';
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';

import { Record, Layout as d2aLayout } from 'd2-analysis';

export var Layout = function(refs, c, applyConfig, forceApplyConfig) {
    var t = this;

    c = isObject(c) ? c : {};

    // inherit
    Object.assign(t, new d2aLayout(refs, c, applyConfig));

    // program
    t.program = isObject(c.program) ? c.program : null;
    t.programStage = isObject(c.programStage) ? c.programStage : null;

    // data type
    t.dataType = isString(c.dataType) ? c.dataType : null;

    // options
    t.showColTotals = isBoolean(c.colTotals) ? c.colTotals : (isBoolean(c.showColTotals) ? c.showColTotals : true);
    t.showRowTotals = isBoolean(c.rowTotals) ? c.rowTotals : (isBoolean(c.showRowTotals) ? c.showRowTotals : true);
    t.showColSubTotals = isBoolean(c.colSubTotals) ? c.colSubTotals : (isBoolean(c.showColSubTotals) ? c.showColSubTotals : true);
    t.showRowSubTotals = isBoolean(c.rowSubTotals) ? c.rowSubTotals : (isBoolean(c.showRowSubTotals) ? c.showRowSubTotals : true);
    t.showDimensionLabels = isBoolean(c.showDimensionLabels) ? c.showDimensionLabels : (isBoolean(c.showDimensionLabels) ? c.showDimensionLabels : true);
    t.showDataItemPrefix = isBoolean(c.showDataItemPrefix) ? c.showDataItemPrefix : (isBoolean(c.showDataItemPrefix) ? c.showDataItemPrefix : true);
    t.hideEmptyRows = isBoolean(c.hideEmptyRows) ? c.hideEmptyRows : false;
    t.hideNaData = isBoolean(c.hideNaData) ? c.hideNaData : false;
    t.collapseDataDimensions = isBoolean(c.collapseDataDimensions) ? c.collapseDataDimensions : false;
    t.outputType = isString(c.outputType) ? c.outputType : refs.optionConfig.getOutputType('event').id;

    t.completedOnly = isBoolean(c.completedOnly) ? c.completedOnly : false;
    t.showHierarchy = isBoolean(c.showHierarchy) ? c.showHierarchy : false;

    t.displayDensity = isString(c.displayDensity) && !isEmpty(c.displayDensity) ? c.displayDensity : refs.optionConfig.getDisplayDensity('normal').id;
    t.fontSize = isString(c.fontSize) && !isEmpty(c.fontSize) ? c.fontSize : refs.optionConfig.getFontSize('normal').id;
    t.digitGroupSeparator = isString(c.digitGroupSeparator) && !isEmpty(c.digitGroupSeparator) ? c.digitGroupSeparator : refs.optionConfig.getDigitGroupSeparator('space').id;
    t.legendSet = isObject(c.legendSet) ? c.legendSet : null;

    // value, aggregation type
    if (isObject(c.value) && isString(c.value.id)) {
        t.value = c.value;

        if (isString(c.aggregationType)) {
            t.aggregationType = c.aggregationType;
        }
    }

    // paging
    if (isObject(c.paging) && isNumeric(c.paging.pageSize) && isNumeric(c.paging.page)) {
        t.paging = c.paging;
    }

    // graph map
    t.parentGraphMap = isObject(c.parentGraphMap) ? c.parentGraphMap : null;

    // report table
    t.reportingPeriod = isObject(c.reportParams) && isBoolean(c.reportParams.paramReportingPeriod) ? c.reportParams.paramReportingPeriod : (isBoolean(c.reportingPeriod) ? c.reportingPeriod : false);
    t.organisationUnit =  isObject(c.reportParams) && isBoolean(c.reportParams.paramOrganisationUnit) ? c.reportParams.paramOrganisationUnit : (isBoolean(c.organisationUnit) ? c.organisationUnit : false);
    t.parentOrganisationUnit = isObject(c.reportParams) && isBoolean(c.reportParams.paramParentOrganisationUnit) ? c.reportParams.paramParentOrganisationUnit : (isBoolean(c.parentOrganisationUnit) ? c.parentOrganisationUnit : false);

    // force apply
    Object.assign(t, forceApplyConfig);

    t.getRefs = function() {
        return refs;
    };
};

Layout.prototype = d2aLayout.prototype;

Layout.prototype.clone = function() {
    var t = this,
        refs = this.getRefs();

    var { Layout } = refs.api;

    var layout = new Layout(refs, JSON.parse(JSON.stringify(t)));

    layout.setResponse(t.getResponse());
    layout.setAccess(t.getAccess());
    layout.setDataDimensionItems(t.getDataDimensionItems());

    return layout;
};

Layout.prototype.getDataTypeUrl = function() {
    var t = this,
        refs = t.getRefs();

    var { dimensionConfig } = refs;

    var url = dimensionConfig.dataTypeUrl[this.dataType];

    return url || '';
};

Layout.prototype.getProgramUrl = function() {
    return isObject(this.program) ? ('/' + this.program.id) : '';
};

// dep 1

Layout.prototype.req = function(source, format, isSorted, isTableLayout, isFilterAsDimension) {
    var t = this,
        refs = this.getRefs();

    var { Request } = refs.api;

    var { optionConfig, appManager, instanceManager, dimensionConfig } = refs;

    var request = new Request(refs);

    var defAggTypeId = optionConfig.getAggregationType('def').id,
        displayProperty = this.displayProperty || appManager.getAnalyticsDisplayProperty();

    source = source || instanceManager.analyticsEndpoint + this.getDataTypeUrl() + this.getProgramUrl();

    // dimensions
    this.getDimensions(false, isSorted).forEach(function(dimension) {
        request.add(dimension.url(isSorted));
    });

    // filters
    if (this.filters) {
        this.filters.forEach(function(dimension) {
            var isFilter = !(isFilterAsDimension && dimension.isRequired());

            request.add(dimension.url(isSorted, null, isFilter));
        });
    }

    // stage
    if (isObject(this.programStage)) {
        request.add('stage=' + this.programStage.id);
    }

    // display property
    request.add('displayProperty=' + displayProperty.toUpperCase());

    // normal request only
    if (!isTableLayout) {

        // hierarchy
        if (this.showHierarchy) {
            request.add('hierarchyMeta=true');
        }

        // completed only
        if (this.completedOnly) {
            request.add('completedOnly=true');
        }

        // aggregation type
        if (isString(this.outputType)) {
            request.add('outputType=' + this.outputType);
        }

        // limit, sortOrder
        if (isNumber(this.topLimit) && this.dataType === dimensionConfig.dataType['aggregated_values']) {
            request.add('limit=' + this.topLimit);

            var sortOrder = isNumber(this.sortOrder) ? this.sortOrder : 1;

            request.add('sortOrder=' + (sortOrder < 0 ? 'ASC' : 'DESC'));
        }

        // value, aggregrationType
        if (this.value) {
            request.add('value=' + (isString(this.value) ? this.value : isObject(this.value) ? this.value.id : null));

            if (isString(this.aggregationType)) {
                request.add('aggregationType=' + this.aggregationType);
            }
        }

        // collapse data items
        if (this.collapseDataDimensions) {
            request.add('collapseDataDimensions=true');
        }

        // dates
        if (isString(this.startDate) && isString(this.endDate)) {
            request.add('startDate=' + this.startDate);
            request.add('endDate=' + this.endDate);
        }

        // user org unit
        if (isArray(this.userOrgUnit) && this.userOrgUnit.length) {
            request.add(this.getUserOrgUnitUrl());
        }

        // relative period date
        if (this.relativePeriodDate) {
            request.add('relativePeriodDate=' + this.relativePeriodDate);
        }

        // sorting
        if (isObject(this.sorting) && this.dataType === dimensionConfig.dataType['individual_cases']) {
            if (isString(this.sorting.direction) && isString(this.sorting.id)) {
                request.add(this.sorting.direction.toLowerCase() + '=' + this.sorting.id);
            }
        }

        // paging
        if (this.dataType === dimensionConfig.dataType['individual_cases']) {
            var paging = this.paging || {};

            request.add('pageSize=' + (paging.pageSize || 100));
            request.add('page=' + (paging.page || 1));
        }
    }

    // relative orgunits / user
    if (this.hasRecordIds(appManager.userIdDestroyCacheKeys, true)) {
        request.add('user=' + appManager.userAccount.id);
    }

    // base
    request.setBaseUrl(this.getRequestPath(source, format));

    return request;
};

// dep 2

Layout.prototype.data = function(source, format) {
    var t = this,
        refs = this.getRefs();

    var uiManager = refs.uiManager;

    var request = t.req(source, format);

    request.setType(t.getDefaultFormat());

    request.setError(function(r) {

        // 409
        if (isObject(r) && r.status == 409) {
            uiManager.unmask();

            if (isString(r.responseText)) {
                uiManager.alert(JSON.parse(r.responseText));
            }
        }
    });

    return request.run();
};
