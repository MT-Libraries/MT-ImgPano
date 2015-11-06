/**
 *
 * imgPano.
 *
 * @project     imgPano
 * @datetime    21:25 - 15/11/5
 * @author      Thonatos.Yang <thonatos.yang@gmail.com>
 * @copyright   Thonatos.Yang <https://www.thonatos.com>
 *
 */

(function (window, document, exportName) {

    var THREE = require('./vendors/three');
    var HAMMER = require('./vendors/hammer');

    var extend = require('./utils/extend').extend;
    var detector = require('./utils/detector').detector;
    var mobileDetector = require('./utils/mobileDetector').mobileDetector();

    var ImgPano = function (option,bundleInterface) {

        var obj = {};
        var _protected = {};
        var _interface = bundleInterface || undefined;

        // Config
        var defaultOptions = {
            containerId: '',
            src:'',
            fov:105,
            mobile: mobileDetector.any,
            render: detector.webgl ? 'webGL' : 'canvas'
        };

        var currentOptions = extend(defaultOptions, option);

        //检查当前浏览器环境是否支持配置要求
        _protected.preCheck = function(opt) {
            var msg = {};
            msg.isok = true;
            if(!detector.webgl && !detector.canvas) {
                msg.isok = false;
                msg.msg = 'this device may not support webgl & canvas';
            } 
            if (!detector.webgl && opt.render === 'webGl') {
                msg.isok = false;
                msg.msg = 'this device may not support webgl';
            }
            if (!detector.canvas && opt.render === 'canvas') {
                msg.isok = false;
                msg.msg = 'this device may not support canvas';
            }
            if(!opt.containerId) {
                msg.isok = false;
                msg.msg = 'container DOM element ID is required!';
            }
            return msg;
        }

        // Protected
        _protected.prepare = function () {

            window.THREE = THREE;
            window.Hammer = HAMMER;

        };

        _protected.create = function () {

            var canvas,
                texture,
                img,
                geometry,
                material,
                mesh,
                camera,
                scene,
                renderer,
                controls;


            var orbitControls = require('./utils/orbitControls').orbitControls;
            var containerEle = document.getElementById(currentOptions.containerId);
            function initPano() {

                // DOM - IMG
                img = new Image();
                img.onload = function() {
                    texture.needsUpdate = true;
                };
                img.src = currentOptions.src;

                // TEXTURE
                texture = new THREE.Texture(img);
                texture.minFilter = THREE.LinearFilter;

                // THREE.JS OBJECT
                geometry = new THREE.SphereGeometry(1000, 96, 48);
                geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

                material = new THREE.MeshBasicMaterial({
                    map: texture
                });

                mesh = new THREE.Mesh(geometry, material);
                //mesh.scale.x = 1;

                camera = new THREE.PerspectiveCamera(currentOptions.fov, containerEle.clientWidth / containerEle.clientHeight, 1, 10000); 

                scene = new THREE.Scene();
                scene.add(mesh);
                if(currentOptions.render === 'webGL') {
                    renderer = new THREE.WebGLRenderer({antialias: true,precision:'highp',alpha:true});
                }
                if(currentOptions.render === 'CSS33D') {
                    renderer = new THREE.CSS3DRenderer({antialias: true,precision:'highp',alpha:true});
                }
                if(currentOptions.render === 'canvas') {
                    renderer = new THREE.CanvasRenderer({antialias: true,precision:'highp',alpha:true});
                }

                renderer.setSize(containerEle.clientWidth,containerEle.clientHeight);

                // DOM CONTAINER
                containerEle.appendChild(renderer.domElement);

                controls = new orbitControls( camera, renderer.domElement, currentOptions.mobile); //true 为移动设备


            }

            function onResize(){
                camera.aspect = containerEle.clientWidth / containerEle.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(containerEle.clientWidth,containerEle.clientHeight);
            }

            function animate() {

                requestAnimationFrame(animate);
                controls.update();
                render();

            }

            function render() {
                renderer.render(scene, camera);
            }

            initPano();
            animate();
            window.addEventListener('resize',onResize,false);
        };

        obj.init = function () {
            var checkMsg = _protected.preCheck(currentOptions);
            if(checkMsg.isok) {
                _protected.prepare();
                _protected.create();
                _interface && _interface.onUpdate();
            } else {
                if(_interface && _interface.onError) {
                    _interface.onError(checkMsg);
                } else {
                    console.error(checkMsg);
                }
            }
        };

        return obj;

    };

    window[exportName] = ImgPano;

})(window,document,'ImgPano');


