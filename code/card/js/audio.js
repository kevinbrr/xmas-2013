;(function ($) {

    $.Audio = function () 
    {
        var _audio = this;
        this.context = null;

        this.playSound = function (buffer, time) 
        {
            var source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.context.destination);
            source.start(time);
        }

        this.loadSounds = function (obj, soundMap, callback) 
        {
            // Array-ify
            var names = [];
            var paths = [];
            for (var name in soundMap) {
              var path = soundMap[name];
              names.push(name);
              paths.push(path);
            }
            bufferLoader = new this.BufferLoader(this.context, paths, function(bufferList) {
              for (var i = 0; i < bufferList.length; i++) {
                var buffer = bufferList[i];
                var name = names[i];
                obj[name] = buffer;
              }
              if (callback) {
                callback();
              }
            });
            bufferLoader.load();
        }

        this.BufferLoader = function(context, urlList, callback) 
        {
            this.context = context;
            this.urlList = urlList;
            this.onload = callback;
            this.bufferList = new Array();
            this.loadCount = 0;

            this.loadBuffer = function(url, index) 
            {
                // Load buffer asynchronously
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";

                var loader = this;

                request.onload = function() {
                    // Asynchronously decode the audio file data in request.response
                    loader.context.decodeAudioData(
                        request.response,
                        function(buffer) {
                          if (!buffer) {
                            alert('error decoding file data: ' + url);
                            return;
                          }
                          loader.bufferList[index] = buffer;
                          if (++loader.loadCount == loader.urlList.length)
                            loader.onload(loader.bufferList);
                        },
                        function(error) {
                          console.error('decodeAudioData error', error);
                        }
                    );
                }

                request.onerror = function() {
                    console.error('BufferLoader: XHR error');
                }

                request.send();
            }

            this.load = function() 
            {
                for (var i=0; i < this.urlList.length; ++i) {
                    this.loadBuffer(this.urlList[i], i);
                }
            };
        }

        this.Sample = function ()
        {
            this.buffers = null;
            var _sample = this,
                context = _audio.context,
                loader = new _audio.BufferLoader(
                    _audio.context,
                    [
                        'audiofiles/stille1.wav',   //0
                        'audiofiles/stille2.wav',   //1
                        'audiofiles/stille3.wav',   //2
                        'audiofiles/hohoho.wav',    //3
                        'audiofiles/nom-c-02.wav',  //4       
                        'audiofiles/nom-d-03.wav',  //5
                    ],
                    function onLoaded (p_buffers) {
                        _sample.buffers = p_buffers;
                    }
                );

            loader.load();

            this.isCompressed = true;

            this.playSound = function (type) {
                var source1 = this.makeSource(this.buffers[type]);
                source1.start(0);
            }

            this.stopSound = function (type) {
                var source1 = this.makeSource(this.buffers[type]);
                source1.stop(0);
            }

            this.shootRound = function (type, rounds, interval, random, random2) {
              if (typeof random == 'undefined') {
                random = 0;
              }
              var time = context.currentTime;
              // Make multiple sources using the same buffer and play in quick succession.
              for (var i = 0; i < rounds; i++) {
                var source = this.makeSource(this.buffers[type]);
                source.playbackRate.value = 1 + Math.random() * random2;
                source.start(time + i * interval + Math.random() * random);
              }
            }

            this.makeSource = function (buffer) {
                var source = context.createBufferSource();
                if (typeof context.createGain !== undefined) {
                    var gain = context.createGain();    
                }
                else if (typeof context.createGrainNode !== undefined) {
                    var gain = context.createGainNode();    
                }
                else {
                    console.error("Unable to create gain");
                    return;
                }

                gain.gain.value = 0.2;
                source.buffer = buffer;
                source.connect(gain);
                if (this.isCompressed) {
                    var compressor = context.createDynamicsCompressor();
                    compressor.threshold.value = 10;
                    compressor.ratio.value = 20;
                    compressor.reduction.value = -20;
                    gain.connect(compressor);
                    compressor.connect(context.destination);
                } else {
                    gain.connect(context.destination);
                }
                return source;
            }

            this.toggleCompressor = function () {
                this.isCompressed = !this.isCompressed;
            }
        }

        this.init = function () 
        {
            // Start off by initializing a new context.
            if (typeof AudioContext !== "undefined") {
                this.context = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
                this.context = new webkitAudioContext();
            } else {
                //throw new Error('AudioContext not supported. :(');
                console.log("No sound :(");
            }

            // shim layer with setTimeout fallback
            window.requestAnimFrame = (function() {
                return window.requestAnimationFrame 
                || window.webkitRequestAnimationFrame 
                || window.mozRequestAnimationFrame    
                || window.oRequestAnimationFrame      
                || window.msRequestAnimationFrame     
                || function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
            })();
        }

        this.init();
    }

}(jQuery));