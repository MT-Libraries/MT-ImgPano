/**
 *
 * mobileDetector.
 *
 * @project     localhost_panoplayer
 * @datetime    14:39 - 25/07/2015
 * @author      Thonatos.Yang <thonatos.yang@gmail.com>
 * @copyright   Thonatos.Yang <https://www.thonatos.com>
 *
 */

var mobileDetector = function () {

    var that = this;

    this._device = {
        android: false,
        ios: false,
        windows: false,
        any: false,
        blackberry: false
    };

    (function () {
        that._device.android = /Android/i.test(navigator.userAgent);
        that._device.ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        that._device.windows = /IEMobile/i.test(navigator.userAgent);
        that._device.blackberry = /BlackBerry/i.test(navigator.userAgent);
        that._device.any = that._device.ios || that._device.android || that._device.windows || that._device.blackberry;

    })();

    return {
        android: that._device.android,
        ios: that._device.ios,
        windows: that._device.windows,
        blackberry: that._device.blackberry,
        any: that._device.any
    };
};

exports.mobileDetector = mobileDetector;