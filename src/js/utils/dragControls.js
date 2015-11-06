/**
 *
 * customOrbitControls.
 *
 * @project     localhost_panoplayer
 * @datetime    01:13 - 30/07/2015
 * @author      Thonatos.Yang <thonatos.yang@gmail.com>
 * @copyright   Thonatos.Yang <https://www.thonatos.com>
 *
 */

exports.dragControls = function (object,domElement,mobile) {


    this.object = object;
    this.mobile = mobile;
    this.enabled = true;
    this.domElement = (domElement !== undefined) ? domElement : document;
    this.object.target = new THREE.Vector3(0, 0, 0);

    /**
     * 旋转角度计算方法
     *
     * 容器:  宽度作为X，容器高度为Y;
     * 屏幕:  水平移动距离为dX，垂直移动距离为dY;
     * 角度:  degreeX = dX/X * 180 ( |degreeX| < 360), degreeY = dY/Y * 90 ( |degreeY| < 90 );
     *
     */

    var scope = this;

    var X,Y;
    var lastPoint = {
            x:0,
            y:0
        },
        currentPoint = {
            x:0,
            y:0
        };

    var lon = 0,
        lat = 0,
        fov = 200 / 3,
        isUserInteracting = false;

    function getFov(scale){

        var newFOV = 2 * Math.atan(Math.tan((fov * Math.PI / 180) / 2) / scale) * 180 / Math.PI;

        return newFOV;
    }

    var mobileEvent = function () {

        var mc = new Hammer(scope.domElement);

        mc.add(new Hammer.Pan({ threshold: 0, pointers: 0, domEvents: true }));
        mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan')]);
        mc.on("pinchstart pinchmove", onPinch);
        mc.on("panstart", onPanStart);
        mc.on("panmove", onPanMove);
        mc.on("panend", onPanEnd);

        var initScale = 1;
        var targetScale = 1;

        function onPinch(ev) {

            if(ev.type == 'pinchstart') {
                initScale = targetScale || 1;
            }

            initScale = ev.scale > 1 ? ev.scale : (ev.scale - 1);

        }

        function onPanStart(ev) {

            isUserInteracting = true;

            lastPoint = {
                x:ev.center.x,
                y:ev.center.y
            };

        }

        function onPanEnd(ev) {
            isUserInteracting = false;
        }

        function onPanMove(ev) {

            if (isUserInteracting) {

                currentPoint = {
                    x:ev.center.x,
                    y:ev.center.y
                };

                //lon = onPointerDownLon + (ev.center.x - onPointerDownPointerX) * 0.8;
                //lat = onPointerDownLat - (ev.center.y - onPointerDownPointerY) * 0.2;

                if(typeof ev.stopPropagation === "function"){
                    ev.stopPropagation();
                }
            }
        }
    };

    var desktopEvent = function () {

        function onDocumentMouseDown(event) {

            event.preventDefault();
            isUserInteracting = true;

            lastPoint = {
                x:event.clientX,
                y:event.clientY
            };

        }

        function onDocumentMouseMove(event) {

            if (isUserInteracting) {

                //lon = onPointerDownLon + (event.clientX - onPointerDownPointerX) * 0.1;
                //lat = onPointerDownLat - (event.clientY - onPointerDownPointerY) * 0.1;

                currentPoint = {
                    x:event.clientX,
                    y:event.clientY
                };

            }
        }

        function onDocumentMouseUp(event) {

            isUserInteracting = false;
            
        }

        function onDocumentMouseWheel(event) {

            //// WebKit
            //if (event.wheelDeltaY) {
            //    distance -= event.wheelDeltaY * 0.5;
            //
            //    // Opera / Explorer 9
            //} else if (event.wheelDelta) {
            //    distance -= event.wheelDelta * 0.5;
            //
            //    // Firefox
            //} else if (event.detail) {
            //    distance += event.detail * 10;
            //
            //}
            //
            //distance = Math.max(300, Math.min(distance, 1200));
            //
            ////mtlog(distance);
            //scope.object.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 10000);
        }

        // document event
        scope.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
        scope.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        scope.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
        scope.domElement.addEventListener('mousewheel', onDocumentMouseWheel, false);
        scope.domElement.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);

    };

    this.connect = function () {
        
        X = scope.domElement.clientWidth;
        Y = scope.domElement.clientHeight;
        
        if(scope.mobile){
            mobileEvent();
        }else{
            desktopEvent();
        }
    };

    this.update = function () {

        if(!scope.enabled) return;

        var mx = (currentPoint.x - lastPoint.x)/X;
        var my = (currentPoint.y - lastPoint.y)/Y;

        console.log(mx,my);

        lon = mx * 2 * Math.PI;
        lat = Math.min(Math.max(-Math.PI / 2, my * Math.PI), Math.PI / 2);
        

        //var rotm = new THREE.Quaternion().setFromEuler(
        //    new THREE.Euler(lat, lon, 0, "YXZ"));
        //scope.object.quaternion.copy(rotm);

        scope.object.rotation.y = scope.object.rotation.y - lon;
        scope.object.rotation.x = scope.object.rotation.x + lat;
        
        lastPoint = currentPoint;

        //degreeX = dX/X * 180; //    ( |degreeX| < 360)
        //degreeY = dY/Y * 90; //    ( |degreeY| < 90 )
    };

    this.connect();


};