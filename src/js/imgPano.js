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

    var ImgPano = function (option,bundleInterface) {

        var obj = {};
        var _protected = {};
        var _interface = bundleInterface || {};

        // Config
        var defaultOptions = {
            src:'',
            fov:105
        };

        var currentOptions = extend(defaultOptions,option);

        // Protected
        _protected.prepare = function () {

            window.THREE = THREE;
            window.Hammer = HAMMER;

            return detector.webgl && detector.canvas;
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

                camera = new THREE.PerspectiveCamera(currentOptions.fov, window.innerWidth / window.innerHeight, 1, 10000);

                scene = new THREE.Scene();
                scene.add(mesh);

                renderer = new THREE.WebGLRenderer({antialias: true,precision:'highp',alpha:true});
                //renderer = new THREE.CSS3DRenderer();
                //renderer = new THREE.CanvasRenderer({antialias: true,precision:'highp',alpha:true});
                renderer.setSize(window.innerWidth,window.innerHeight);

                // DOM CONTAINER
                document.getElementById('canvas').appendChild(renderer.domElement);

                controls = new orbitControls( camera, renderer.domElement,true);


            }

            function onResize(){
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth,window.innerHeight);
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
            _protected.prepare();
            _protected.create();
        };

        return obj;

    };

    window[exportName] = ImgPano;

})(window,document,'ImgPano');


