# MT-ImgPano

Panoroma viewer for image.

## Usage

#### #include js

```
<script src="../assets/js/imgPano.js"></script>
```

#### #config & init

```
var imgPano = new InstaImgPano({
    src:'../assets/images/campus.png',
    fov:105,
    render:'webGL' // css3d||webGL
},{
    onError: function (msg) {

    },
    onUpdate: function () {

    }
});

imgPano.init();
```