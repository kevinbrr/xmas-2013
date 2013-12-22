/**
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
 * Helper methods for creating angels
 */
var angelFactory = {
    angels: [{
        img: 'angel0',
        width: 140,
        height: 108,
        barPosition: {x: 64, y: 45}
    },
    {
        img: 'angel1',
        width: 131,
        height: 70,
        barPosition: {x: 43, y: 38}
    },
    {
        img: 'angel2',
        width: 159,
        height: 94,
        barPosition: {x: 55, y: 40}
    },
    {
        img: 'angel3',
        width: 129,
        height: 83,
        barPosition: {x: 53, y: 56}
    },
    {
        img: 'angel4',
        width: 139,
        height: 114,
        barPosition: {x: 53, y: 47}
    },
    {
        img: 'angel5',
        width: 134,
        height: 113,
        barPosition: {x: 68, y: 51}
    }],
    createRandomNode: function () {
        return this.createNodeFromIndex(
            getRandomInt(0, this.angels.length-1)
        );
    },
    createNodeFromIndex: function (i) {
        if (i >= this.angels.length) {
            return false;
        }
        var angelSpecs = this.angels[i],
            offset = {x: angelSpecs.width/2, y: angelSpecs.height/2},
            angelGroup = new Kinetic.Group({
                x: offset.x+getRandomInt(0, 700),
                y: offset.y+getRandomInt(0, 150),
                width: angelSpecs.width,
                height: angelSpecs.height,
                offset: offset
            }),
            angelImg = new Kinetic.Image({
                name: 'imgAngel',
                x: 0,
                y: 0,
                image: loadedImages[angelSpecs.img],
            }),
            barImg = new Kinetic.Image({
                name: 'imgBar',
                x: angelSpecs.barPosition.x,
                y: angelSpecs.barPosition.y,
                image: loadedImages['baropaq'],
            });
        
        barImg.hide();

        angelGroup.add(angelImg);
        angelGroup.add(barImg);
        
        return angelGroup;
    }
};

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
    var layerFoolishness = new Kinetic.Layer(),
        imgFoolishness = new Kinetic.Image({
            x: 0,
            y: 0,
            image: loadedImages.foolishness,
            width:  134,
            height: 309
        }),
        hitPointMark = new Kinetic.Circle({
            x: 0,
            y: 0,
            radius: 5,
            fill: 'red',
            opacity: 0
        }),
        censorBar = new Kinetic.Image({
            x: 0,
            y: 0,
            image: loadedImages.bartrans,
            width: 31,
            height: 12
        });
    layerFoolishness.setAbsolutePosition(300, 200);
    layerFoolishness.add(imgFoolishness);
    layerFoolishness.add(censorBar);
    layerFoolishness.add(hitPointMark);

    // make mister foolishness move
    stage.on('mousemove', function() {
        var mousePos = stage.getPointerPosition();
        var x = mousePos.x-(imgFoolishness.getWidth()/2);
        var y = mousePos.y-(imgFoolishness.getHeight()/2);
        
        imgFoolishness.setAbsolutePosition(x, y);
        hitPointMark.setAbsolutePosition(x+10, y+53);
        censorBar.setAbsolutePosition(x-5, y+47);
        layerFoolishness.batchDraw();
    });

    // listen for click events
    stage.on('click', function () { 
        var hitObject = layerAngels.getIntersection(hitPointMark.getAbsolutePosition()),
            angelGroup = hitObject.shape.parent,
            imgAngel = hitObject.shape,
            imgBar = angelGroup.find('.imgBar');

        imgBar.show();

        angelGroup.data = {isHit: true};

        // clone multiple angels
        for (var i=0; i<2; i++) {
            var newAngel = angelFactory.createRandomNode();
            layerAngels.add(newAngel);
        }
    });

    // draw angel
    var layerAngels = new Kinetic.Layer();
    for (var i=0; i<8; i++) {
       var imgAngel = angelFactory.createNodeFromIndex(i%6);
        if (imgAngel) {
            layerAngels.add(imgAngel);
        }
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
            var x = node.getX(),
                y = node.getY();

            // fallen angel animation
            if (node.data != undefined && node.data.isHit) 
            {
                if (node.data.isFalling == undefined) {
                    node.data.isFalling = true;
                    node.data.stopY = getRandomInt(450, 550);
                }
                if (y >= node.data.stopY) {
                    node.data.isFalling = false;
                    node.data.isFallen = true;
                }

                if (node.data.isFalling) {
                    node.setRotationDeg((node.getRotationDeg()+10)%360);
                    y += 10;
                }
            }
            // flying angel animation
            else {
                // original formula: amplitude * Math.sin(frame.time * 2 * Math.PI / period)
                var offset = amplitude * Math.sin(frame.time * (index+1) * Math.PI / period);
                x = node.getX() + offset;
                y = node.getY() + offset;

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
            }

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
}

/**
 * Preload images
 */
var loadedImages = {};
loadImages(
    {
        bg: 'img/bg.jpg',
        foolishness: 'img/foolishness.png',
        angel0: 'img/angel0.png',
        angel1: 'img/angel1.png',
        angel2: 'img/angel2.png',
        angel3: 'img/angel3.png',
        angel4: 'img/angel4.png',
        angel5: 'img/angel5.png',
        satan: 'img/satan.png',
        bartrans: 'img/censorbar-transparent.png',
        baropaq: 'img/censorbar-opaque.jpg'
    },
    function (images) {
        loadedImages = images;
        draw();
    }
);