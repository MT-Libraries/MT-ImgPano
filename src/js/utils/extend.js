/**
 *
 * extend.
 *
 * @project     imgPano
 * @datetime    23:21 - 15/11/5
 * @author      Thonatos.Yang <thonatos.yang@gmail.com>
 * @copyright   Thonatos.Yang <https://www.thonatos.com>
 *
 */


/**
 *
 * extend.
 *
 * @project     localhost_panoplayer
 * @datetime    15:16 - 27/07/2015
 * @author      Thonatos.Yang <thonatos.yang@gmail.com>
 * @copyright   Thonatos.Yang <https://www.thonatos.com>
 *
 */

exports.extend = function (source, target) {

    if (target) {
        for (var key in target) {
            if (key in source) {
                source[key] = target[key];
            }
        }
    }

    return source;
};