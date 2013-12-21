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
    
    // draw satan
    var layerSatan = new Kinetic.Layer(),
        imgSatan = new Kinetic.Image({
            x: 110,
            y: 400,
            image: loadedImages.satan,
            width: 239,
            height: 185
        }),
        offsetLeft = imgSatan.getWidth()/2,
        offsetTop = imgSatan.getHeight()-35;
    layerSatan.add(imgSatan);

    // set offset, so we have a centered rotation point
    imgSatan.setOffset(offsetLeft, offsetTop);
    imgSatan.setPosition(imgSatan.getX()+offsetLeft, imgSatan.getY()+offsetTop);
    
    // draw mister foolishness
    var layerFoolishness = new Kinetic.Layer();
    var imgFoolishness = new Kinetic.Image({
        x: 0,
        y: 0,
        image: loadedImages.foolishness,
        width:  134,
        height: 309
    });
    var hitPointMark = new Kinetic.Circle({
        x: 0,
        y: 0,
        radius: 5,
        fill: 'red'
    });
    layerFoolishness.setAbsolutePosition(300, 200);
    layerFoolishness.add(imgFoolishness);
    layerFoolishness.add(hitPointMark);

    // make mister foolishness move
    stage.on('mousemove', function() {
        var mousePos = stage.getPointerPosition();
        var x = mousePos.x-(imgFoolishness.getWidth()/2);
        var y = mousePos.y-(imgFoolishness.getHeight()/2);
        
        imgFoolishness.setAbsolutePosition(x, y);
        hitPointMark.setAbsolutePosition(x+10, y+53);
        layerFoolishness.batchDraw();
    });

    // listen for click events
    stage.on('click', function () { 
        var hitObject = layerAngels.getIntersection(hitPointMark.getAbsolutePosition());
        hitObject.shape.data = {censured: true}
    
        for (var i=0; i<2; i++) {
            layerAngels.add(
                hitObject.shape.clone({
                    x: getRandomInt(0, 700),
                    y: getRandomInt(0, 150)    
                })
            );
        }
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
    stage.add(layerSatan);
    stage.add(layerFoolishness);
    

    // animate angels
    var amplitude = 1,
        period = 2000,
        centerX = stage.getWidth()/2,
        centerY = stage.getHeight()/2,
        rotation = 0,
        rotateDirection = 1,
        rotationSpan = 22.5,
        rotationSpeed = 0.75;

    var anim = new Kinetic.Animation(function (frame) {
        var time = frame.time,
            timeDiff = frame.timeDiff,
            frameRate = frame.frameRate;

        var kids = layerAngels.getChildren();
        kids.each(function (node, index) {
            // original formula: amplitude * Math.sin(frame.time * 2 * Math.PI / period)
            var offset = amplitude * Math.sin(frame.time * (index+1) * Math.PI / period);
            var x = node.getX() + offset;
            var y = node.getY() + offset;

            if (index%2) {
                x = node.getX() - offset;
                y = node.getY() + offset;
            }
            else if (index%3) {
                x = node.getX() - offset;
                y = node.getY() - offset;
            }
            else if (index%4) {
                x = node.getX() + offset;
                y = node.getY() - offset;
            }

            // if (node.data != undefined) {
            //     console.log(node.data);
            // }

            node.setAbsolutePosition(x, y);
        });

        // rotate satan
        rotation = (rotation+rotationSpeed)%360;        
        var a = rotation%rotationSpan;

        if (a==0)                       rotateDirection = rotateDirection == 0 ? 1 : 0;
        if (rotateDirection == 0)       newRotation = a-(rotationSpan/2);
        else if (rotateDirection == 1)  newRotation = rotationSpan-a-(rotationSpan/2);    

        imgSatan.setRotationDeg(newRotation);

    }, [layerAngels, layerSatan]);
    anim.start();

    var rotation = 0;
    var direction = 1;

    for (var i=0; i<540; i++) 
    {
        
    }
}

/**
 * Preload images
 */
var loadedImages = {};
loadImages(
    {
        bg: 'img/bg.jpg',
        foolishness: 'img/foolishness.png',
        angel: 'img/angel.png',
        satan: 'img/satan.png'
    },
    function (images) {
        loadedImages = images
        draw();
    }
);