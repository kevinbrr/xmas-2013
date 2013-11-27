/*
 * Load images
 */
function loadImages(sources, callback) 
{
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for(var src in sources) {
        numImages++;
    }
    for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

/**
 * Draw everything
 */
function draw () 
{
    var stage = new Kinetic.Stage({
        container: 'card',
        width: 834,
        height: 596
    });

    // draw background
    var layerBg = new Kinetic.Layer();
    var imgBg = new Kinetic.Image({
        x: 0,
        y: 0,
        image: loadedImages.bg,
        width: 834,
        height: 596
    });
    layerBg.add(imgBg);
    
    var layerFoolishness = new Kinetic.Layer();
    var imgFoolishness = new Kinetic.Image({
        x: 0,
        y: 0,
        image: loadedImages.foolishness,
        width:  134,
        height: 309
    });
    layerFoolishness.add(imgFoolishness);


    stage.on('mousemove', function() {
        var mousePos = stage.getPointerPosition();
        var x = mousePos.x-(imgFoolishness.getWidth()/2);
        var y = mousePos.y-(imgFoolishness.getHeight()/2);
        
        layerFoolishness.setAbsolutePosition(x, y);
        layerFoolishness.batchDraw();
    });


    stage.add(layerBg);
    stage.add(layerFoolishness);

}

/**
 * Preload images
 */
var loadedImages = {};
loadImages(
    {
        bg: 'img/bg.jpg',
        foolishness: 'img/foolishness.png'
    },
    function (images) {
        loadedImages = images
        draw();
    }
);