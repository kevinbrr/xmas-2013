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
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    
    // draw mister foolishness
    var layerFoolishness = new Kinetic.Layer();
    var imgFoolishness = new Kinetic.Image({
        x: 0,
        y: 0,
        image: loadedImages.foolishness,
        width:  134,
        height: 309
    });
    layerFoolishness.setAbsolutePosition(300, 200);
    layerFoolishness.add(imgFoolishness);

    // make mister foolishness move
    stage.on('mousemove', function() {
        var mousePos = stage.getPointerPosition();
        var x = mousePos.x-(imgFoolishness.getWidth()/2);
        var y = mousePos.y-(imgFoolishness.getHeight()/2);
        
        imgFoolishness.setAbsolutePosition(x, y);
        layerFoolishness.batchDraw();
    });

    // draw angel
    var layerAngels = new Kinetic.Layer();
    for (var i=0; i<5; i++) {
        var imgAngel = new Kinetic.Image({
            x: getRandomInt(0, 700),
            y: getRandomInt(0, 150),
            image: loadedImages.angel,
            width: 140,
            height: 108
        });
        layerAngels.add(imgAngel);
    }

    // add layers to stage
    stage.add(layerBg);
    stage.add(layerAngels);
    stage.add(layerFoolishness);

    // animate angels
    var amplitude = 1;
    var period = 2000;
    var centerX = stage.getWidth() / 2;
    var centerY = stage.getHeight() / 2;

    var anim = new Kinetic.Animation(function (frame) {
        var time = frame.time,
            timeDiff = frame.timeDiff,
            frameRate = frame.frameRate;

        var kids = layerAngels.getChildren();
        kids.each(function (node, index) {
            // original formula: amplitude * Math.sin(frame.time * 2 * Math.PI / period)
            var offset = amplitude * Math.sin(frame.time * (index+1) * Math.PI / period);
            node.setAbsolutePosition(
                node.getX() + offset,
                node.getY() - offset
            );
        });
    }, layerAngels);
    anim.start();
}

/**
 * Preload images
 */
var loadedImages = {};
loadImages(
    {
        bg: 'img/bg.jpg',
        foolishness: 'img/foolishness.png',
        angel: 'img/angel.png'
    },
    function (images) {
        loadedImages = images
        draw();
    }
);