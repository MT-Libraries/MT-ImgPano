/**
 *
 * orbitControls.
 *
 * @project     localhost_panoplayer
 * @datetime    14:55 - 28/07/2015
 * @author      Thonatos.Yang <thonatos.yang@gmail.com>
 * @copyright   Thonatos.Yang <https://www.thonatos.com>
 *
 */

exports.orbitControls = function (object, domElement, mobile) {

    // Event

    this.object = object;
    this.mobile = mobile;
    this.enabled = true;
    this.domElement = (domElement !== undefined) ? domElement : document;
    this.object.target = new THREE.Vector3(0, 0, 0);

    var scope = this;

    var fov = 200 / 3,
        lon = 0,
        lat = 0,
        onPointerDownLon = 0,
        onPointerDownLat = 0,
        onPointerDownPointerX = 0,
        onPointerDownPointerY = 0,
        phi = 0,
        theta = 0,
        distance = 300,
        isUserInteracting = false;

    var initScale = 1;
    var targetScale = 1;
    
    var mc = new Hammer(scope.domElement);

    mc.add(new Hammer.Pan({threshold: 0, pointers: 0, domEvents: true}));
    mc.add(new Hammer.Pinch({threshold: 0})).recognizeWith([mc.get('pan')]);



    // FOR MOBILE DEVICE

    function onPinch(ev) {

        if (ev.type == 'pinchstart') {
            initScale = targetScale || 1;
        }

        initScale = ev.scale > 1 ? ev.scale : (ev.scale - 1);

        //mtlog(ev.type + ' ' + ' ' + distance + initScale);
        distance -= initScale * 50;

        distance = Math.max(200, Math.min(distance, 1200));

        //mtlog(distance);
        scope.object.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 10000);
        // render();
    }

    function onPanStart(ev) {

        isUserInteracting = true;

        onPointerDownPointerX = ev.center.x;
        onPointerDownPointerY = ev.center.y;

        onPointerDownLon = lon;
        onPointerDownLat = lat;
    }

    function onPanEnd(ev) {
        isUserInteracting = false;
    }

    function onPanMove(ev) {

        if (isUserInteracting) {

            lon = onPointerDownLon + (ev.center.x - onPointerDownPointerX) * 0.8;
            lat = onPointerDownLat - (ev.center.y - onPointerDownPointerY) * 0.2;

            if (typeof ev.stopPropagation === "function") {
                ev.stopPropagation();
            }
        }
    }

    // FOR DESKTOP DEVICE

    function onDocumentMouseDown(event) {

        event.preventDefault();
        isUserInteracting = true;

        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

    }

    function onDocumentMouseMove(event) {

        if (isUserInteracting) {

            lon = onPointerDownLon + (event.clientX - onPointerDownPointerX) * 0.1;
            lat = onPointerDownLat - (event.clientY - onPointerDownPointerY) * 0.1;

        }
    }

    function onDocumentMouseUp(event) {

        isUserInteracting = false;

    }

    function onDocumentMouseWheel(event) {

        // WebKit
        if (event.wheelDeltaY) {
            distance -= event.wheelDeltaY * 0.5;

            // Opera / Explorer 9
        } else if (event.wheelDelta) {
            distance -= event.wheelDelta * 0.5;

            // Firefox
        } else if (event.detail) {
            distance += event.detail * 10;

        }

        distance = Math.max(300, Math.min(distance, 2100));

        //mtlog(distance);
        scope.object.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 10000);
    }

    this.connect = function () {

        if (scope.mobile) {
            mc.on("pinchstart pinchmove", onPinch);
            mc.on("panstart", onPanStart);
            mc.on("panmove", onPanMove);
            mc.on("panend", onPanEnd);
        } else {
            // document event
            document.addEventListener('mousedown', onDocumentMouseDown, false);
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.addEventListener('mouseup', onDocumentMouseUp, false);
            document.addEventListener('mousewheel', onDocumentMouseWheel, false);
            document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);

        }
    };

    this.disconnect = function () {

        if (scope.mobile) {

            mc.off("pinchstart pinchmove", onPinch);
            mc.off("panstart", onPanStart);
            mc.off("panmove", onPanMove);
            mc.off("panend", onPanEnd);

        } else {

            document.removeEventListener('mousedown', onDocumentMouseDown, false);
            document.removeEventListener('mousemove', onDocumentMouseMove, false);
            document.removeEventListener('mouseup', onDocumentMouseUp, false);
            document.removeEventListener('mousewheel', onDocumentMouseWheel, false);
            document.removeEventListener('DOMMouseScroll', onDocumentMouseWheel, false);

        }

        scope.enabled = false;

    };

    this.update = function () {

        if (!scope.enabled) return;

        lat = Math.max(-90, Math.min(90, lat));
        phi = THREE.Math.degToRad(lat);
        theta = THREE.Math.degToRad(lon);

        scope.object.position.x = distance * Math.sin(theta) * Math.cos(phi);
        scope.object.position.y = distance * Math.sin(phi);
        scope.object.position.z = distance * Math.cos(phi) * Math.cos(theta);

        scope.object.lookAt(scope.object.target);
    };

    this.connect();

};

