/**
 * @author Ilian Iliev
 * @since 2015-12-05
 *
 * Platform independent library for tracking via google analytics HTTP interface
 * Requires jQuery for ajax only.
 * Usage:
 *
 * ga.init({
 *     trackingId: 'UA-12345678-99',
 *     appName: 'My app',
 *     appVersion: '1.0.0.0'
 * }).trackSession(true);
 *
 * ga.trackView('main_view');
 * ga.trackEvent('Event category', 'Event action');
 */

ga = (function () {

    var
        m_version,
        m_appname,
        m_profileId,
        m_customerId,
        m_screenResolution,
        m_viewportSize,
        m_userLanguage,

        m_customMetrics = {},
        m_customDimensions = {},

        m_googleURL = 'http://www.google-analytics.com/collect',

        sessionStarted = false,
        initialized = false,
        exports = {};

    function logError(e) {
        console.error('[ga]: ' + e);
    }

    function getRandomDeviceId() {
        return 'rnd.' + Date.now();
    }

    function getDeviceLanguage() {

        var defaultLang = 'en-US';

        if (!window || !window.navigator) {
            return defaultLang;
        }

        return window.navigator.language || window.navigator.userLanguage || defaultLang;
    }

    function getDeviceResolution() {
        if (!window) {
            return '0x0';
        }
        if (window.outerWidth && window.outerHeight) {
            return window.outerWidth + 'x' + window.outerHeight;
        }
        if (window.screen) {
            return window.screen.width + 'x' + window.screen.height;
        }
    }

    var is = {
        number: function (n) {
            return (typeof n).toLowerCase() === 'number';
        },
        string: function (s) {
            return (typeof s).toLowerCase() === 'string';
        },
        undefined: function (v) {
            return (typeof v).toLowerCase() === 'undefined';
        },
        not: {
            number: function (n) {
                return !is.number(n);
            },
            string: function (s) {
                return !is.string(s);
            }
        }
    };

    function GaParams() {

        var params = {
            'v': 1,
            'tid': m_profileId,
            'an': m_appname,
            'av': m_version,
            'cid': m_customerId,
            'sr': m_screenResolution,
            'vp': m_viewportSize,
            'ul': m_userLanguage
        };

        // start session if trackSession was not called until now 
        if (!sessionStarted) {
            sessionStarted = true;
            params['sc'] = 'start';
        }

        for (var key in m_customMetrics) {
            if (m_customMetrics.hasOwnProperty(key)) {
                params['cm' + key.ToString()] = m_customMetrics[key];
            }
        }
        m_customMetrics = {};

        for (var key in m_customDimensions) {
            if (m_customDimensions.hasOwnProperty(key)) {
                params['cd' + key.ToString()] = m_customDimensions[key];
            }
        }
        m_customDimensions = {};

        return params;
    }
    
    function send(params) {
        $.ajax({
            type: 'GET',
            url: m_googleURL,
            data: params
        });
    }

    exports.init = function (opt) {

        if (is.undefined(window.jQuery)) {
            logError('ga.js requires jQuery loaded');
            return;
        }

        if (opt.trackingId && opt.appName && opt.appVersion) {
            m_profileId = opt.trackingId;
            m_appname = opt.appName;
            m_version = opt.appVersion;
        } else {
            logError('Required parameters: trackingId, appName, appVersion');
            return exports;
        }

        m_customerId = opt.deviceId || getRandomDeviceId();
        m_userLanguage = opt.userLanguage || getDeviceLanguage();

        if (is.number(opt.width) && is.number(opt.height)) {
            m_screenResolution = m_viewportSize = opt.width + 'x' + opt.height;
        } else {
            m_screenResolution = m_viewportSize = getDeviceResolution();
        }

        initialized = true;

        return exports;
    };

    exports.trackSession = function (start) {

        var params = new GaParams();
        params['sc'] = (start) ? 'start' : 'end';
        sessionStarted = true;

        send(params);
        return exports;
    };

    exports.trackView = function (viewId) {

        if (is.not.string(viewId)) {
            logError('trackView method expects first parameter to be string.');
            return exports;
        }

        var params = new GaParams();
        params['t'] = 'screenview';
        params['cd'] = viewId;

        send(params);
        return exports;
    };

    exports.trackEvent = function (category, action, label, value) {

        var params = new GaParams();
        params['t'] = 'event';

        // check required parameters
        if (is.not.string(category)) {
            logError('trackEvent method expects first parameter (category) to be string.');
            return exports;
        } else {
            params['ec'] = category;
        }

        if (is.not.string(action)) {
            logError('trackEvent method expects second parameter (action) to be string.');
            return exports;
        } else {
            params['ea'] = action;
        }

        // check optional parameters
        params['el'] = (is.string(label)) ? label : '';
        params['ev'] = (is.number(value)) ? value : 0;

        send(params);
        return exports;
    };

    exports.setCustomMetric = function (metricId, value){       
        m_customMetrics[metricId] = value;
    };
    
    exports.setCustomDimension = function (dimensionId, value){    
        m_customDimensions[dimensionId] = value;
    };

    return exports;
}());