import arrayContains from 'd2-utilizr/lib/arrayContains';
import arrayUnique from 'd2-utilizr/lib/arrayUnique';
import isString from 'd2-utilizr/lib/isString';
import isBoolean from 'd2-utilizr/lib/isBoolean';
import isObject from 'd2-utilizr/lib/isObject';
import isEmpty from 'd2-utilizr/lib/isEmpty';

import { Dimension as d2aDimension } from 'd2-analysis';

export var Dimension = function(refs, c, applyConfig, forceApplyConfig) {
    var t = this;

    var _ignoreUrlDimensions = ['dy', 'longitude', 'latitude'];

    c = isObject(c) ? c : {};

    // inherit
    Object.assign(t, new d2aDimension(refs, c, applyConfig));

    // props
    if (isString(c.filter)) {
        t.filter = c.filter;
    }

    if (isString(c.name)) {
        t.name = c.name;
    }

    if (isObject(c.legendSet)) {
        t.legendSet = c.legendSet;
    }

    // force apply
    Object.assign(t, forceApplyConfig);

    t.getIgnoreUrlDimensions = function() {
        return _ignoreUrlDimensions;
    };

    t.getRefs = function() {
        return refs;
    };
};

Dimension.prototype = d2aDimension.prototype;

Dimension.prototype.isIgnoreDimension = function() {
    return arrayContains(this.getIgnoreUrlDimensions(), this.dimension);
};

// dep 1

Dimension.prototype.url = function(isSorted, response, isFilter) {
    if (this.isIgnoreDimension()) {
        return '';
    }

    var url = (isFilter ? 'filter' : 'dimension') + '=' + this.dimension,
        records = arrayUnique(this.getRecordIds(isSorted, response, true));

    url += records.length ? (':' + records.join(';')) : '';

    if (isObject(this.legendSet)) {
        url += '-' + this.legendSet.id;
    }
    else if (isString(this.filter)) {
        url += ':' + this.filter;
    }

    return url;
};
