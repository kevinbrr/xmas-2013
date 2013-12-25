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
 * Maps a number that falls between one range (origin) to another range (target)
 */
function mapNumber (number, originMin, originMax, targetMin, targetMax) {
    return (number-originMin)/(originMax-originMin)*(targetMax-targetMin)+targetMin;
}

/**
 * Transformation function to increase a (progressive) number up to a maximum 
 * and decrease it to zero
 */
function swing (number, max) {
    return (number%(max*2)<max) ? number%max : max-number%max;
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

function drawAngels (numberOfAngels, layerAngels)
{
    for (var i=0; i<numberOfAngels; i++) {
        var imgAngel = angelFactory.createNodeFromIndex(i%6);
        if (imgAngel) {
            layerAngels.add(imgAngel);
        }
       // sample.playSound(3);
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
    }),
    initialAngels = 8,
    maxAngels = 20;
  

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
        imgSatan.targetAngel = false;
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
    stage.on('click', function () 
    {
    	
        // check if angels are hit 
        var hitObject = layerAngels.getIntersection(hitPointMark.getAbsolutePosition());
        if (hitObject && hitObject.shape) {
        	
            var angelGroup = hitObject.shape.parent,
            imgAngel = hitObject.shape,
            imgBar = angelGroup.find('.imgBar');
            imgBar.show();
            angelGroup.data = {isHit: true};
            if (layerAngels.getChildren().length < maxAngels) {
                // clone multiple angels
                for (var i=0; i<2; i++) {
                    var newAngel = angelFactory.createRandomNode();
                    layerAngels.add(newAngel);
                  
                    // play sound at new angel: hohoho bufferList[3]
                    // sample.shootRound(0, 1, 1, 0, 1);
                    //sample.playSound(0);
                }
            }
        }

        // check if game over text is hit
        var hitText = layerText.getIntersection(hitPointMark.getAbsolutePosition());
        if (hitText && hitText.shape) {
            var bg = hitText.shape.parent.find('.bg')[0],
                rotateRight = getRandomInt(0, 1);
            
            bg.setFill('#000');

            //sample.playSound(3);
            var startY = groupText.getY();
            var textAnim = new Kinetic.Animation(function (frame) {
                if (groupText.getY() > stage.getHeight()) {
                    textAnim.stop();                    
                    bg.setFill('#fff');
                    groupText.hide();
                    groupText.setRotationDeg(0);
                    groupText.setPosition({
                        x: stage.getWidth()/2, y: 150
                    });
                    gameOver = false;              
                    drawAngels(initialAngels, layerAngels);
                    
                    return;
                }

                if (rotateRight) {
                    groupText.setRotationDeg((frame.time*360/800)%360);
                }
                else {
                    groupText.setRotationDeg(-((frame.time*360/800)%360));
                }
                groupText.setY(startY+frame.time*stage.getHeight()/1000);
            },
            layerText);
            textAnim.start();           
        }
        
    });

    // draw angels
    var layerAngels = new Kinetic.Layer();
    //drawAngels(initialAngels, layerAngels);

    // create text layer for game over text
    var layerText = new Kinetic.Layer(),
        groupText = new Kinetic.Group({
            x: stage.getWidth()/2,
            y: 150
        }),
        textEnd = new Kinetic.Text({
            name: 'label',
            x: 0,
            y: 0,
            text: 'Play',
            fontFamily: 'Calibri',
            fontSize: 30,
            fill: 'black'
          }),
        bgText = new Kinetic.Rect({
            name: 'bg',
            x: 0,
            y: 0,
            fill: '#fff',
            width: textEnd.getWidth(),
            height: textEnd.getHeight()
        });
    
    groupText.setOffset({
        x: textEnd.getWidth()/2,
        y: textEnd.getHeight()/2
    });
    
    //groupText.hide();
    
    groupText.add(bgText);
    groupText.add(textEnd); 
    layerText.add(groupText);

    // add layers to stage
    stage.add(layerBg);
    stage.add(layerSatan);
    stage.add(layerAngels);
    stage.add(layerText);
    stage.add(layerFoolishness);

    // animate angels
    var amplitude = 1,
        period = 2000,
        centerX = stage.getWidth()/2,
        centerY = stage.getHeight()/2,
        rotationSpan = 22.5,
        fallenAngels = [],
        gameOver = true;

    var anim = new Kinetic.Animation(function (frame) {
        var time = frame.time,
            timeDiff = frame.timeDiff,
            frameRate = frame.frameRate,
            kids = layerAngels.getChildren();

        if (kids.length-fallenAngels.length < 1 && !gameOver) {
            gameOver = true;
            groupText.show();
			textEnd.setText("Enjoy the silence");
			bgText.setWidth(textEnd.getWidth());
			bgText.setHeight(textEnd.getHeight());
			groupText.setOffset({
				x: textEnd.getWidth()/2,
				y: textEnd.getHeight()/2
			});
            layerText.draw();
        }

        kids.each(function (node, index) {
            var x = node.getX(),
                y = node.getY();

            // fallen angel animation
            if (node.data != undefined && node.data.isHit) 
            {
                if (node.data.isFalling == undefined) {
                    node.data.isFalling = true;
                    node.data.rotateRight = getRandomInt(0, 1);
                    node.data.stopY = getRandomInt(450, 550);
                }
                if (y >= node.data.stopY && !node.data.isFallen) {
                    node.data.isFalling = false;
                    node.data.isFallen = true;
                    fallenAngels.push(node);
                }
                if (node.data.isFalling) {
                    if (node.data.rotateRight) {
                        node.setRotationDeg((node.getRotationDeg()+10)%360);
                    }
                    else {
                        node.setRotationDeg((node.getRotationDeg()-10)%360);
                    }
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
        imgSatan.setRotationDeg(
            mapNumber(
                swing(frame.time, 800),
                0, 800,
                -(rotationSpan/2), rotationSpan/2
            )
            // use this for a more natural, eased rotation
            // mapNumber(
            //     Math.sin(frame.time*Math.PI/800), 
            //     -1, 1, 
            //     -(rotationSpan/2), rotationSpan/2
            // )
        );

        if (fallenAngels.length > 0 || imgSatan.targetAngel) {
            var satanRight = imgSatan.getX()+imgSatan.getWidth()/2;
            var satanLeft = imgSatan.getX()-imgSatan.getWidth()/2;

            if (!imgSatan.targetAngel) {
                imgSatan.targetAngel = fallenAngels.shift();
                imgSatan.targetAngelPosition = imgSatan.getX() < imgSatan.targetAngel.getX() 
                    ? 'right' : 'left';
            }
            else {
                if (imgSatan.targetAngelPosition == 'right'
                    && satanRight < imgSatan.targetAngel.getX()) {
                    imgSatan.setX(imgSatan.getX()+5);
                }
                else if (imgSatan.targetAngelPosition == 'left'
                    && satanLeft > imgSatan.targetAngel.getX()) {
                    imgSatan.setX(imgSatan.getX()-5);   
                }
                else {
                    imgSatan.targetAngel.remove();
                    //play omnomnom Satan: bufferList[5]
                    sample.shootRound(5, 1, 1, 0, 0);
                   
                    imgSatan.targetAngel = false;
                }
            }
        }

    }, [layerAngels, layerSatan]);
    anim.start();
}

/**
 * Do audio stuff
 */
var audio = new $.Audio();
var sample = new audio.Sample();

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