var playing = false;

var SatanSample = {
};
SatanSample.play = function() {
  function playSound(buffer, time) {	 
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
    gain.connect(context.destination);
    if (!source.start)
      source.start = source.noteOn;
      source.playbackRate.value = 1 - Math.random() ;	
      source.start(time);
  }
  var nom = BUFFERS.nom;
  var nomnom = BUFFERS.nomnom;
  playSound(nomnom,0);  
};

//hohoho when angels appear
var AngelSample = {
};
AngelSample.play = function() {
  function playSound(buffer, time) {
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
    gain.connect(context.destination);
    if (!source.start)
      source.start = source.noteOn;
       source.playbackRate.value = 1 + Math.random() * 1
      source.start(time);
  }
  var hohoho = BUFFERS.hohoho;  
  playSound(hohoho,0);  
};
var AngelSampleStart = {	
};
AngelSampleStart.play = function() {
    var source;
    var gain;
  function playSound(buffer, time) {
    source = context.createBufferSource();
    if (typeof context.createGain !== undefined) {
        gain = context.createGain();    
    }
    else if (typeof context.createGrainNode !== undefined) {
        gain = context.createGainNode();    
    }
    else {
        console.error("Unable to create gain");
        return;
    }
    gain.gain.value = 0.3;
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(context.destination);
	  
    if (!source.start) 	
      source.start = source.noteOn;
      source.playbackRate.value = 1 + Math.random() * 1    
      source.start(time);    
  }
  var play = BUFFERS.play;
  var stille = BUFFERS.stille; 
  var nacht = BUFFERS.nacht;
  var hohoho = BUFFERS.hohoho;
  playSound(hohoho,0);
  playSound(hohoho,0);
  playSound(hohoho,0);
	
  
};
var CrossfadeSample = {playing:false};

CrossfadeSample.play = function() {
  // Create two sources.
  this.ctl1 = createSource(BUFFERS.stille);
  this.ctl2 = createSource(BUFFERS.nacht);
  // Mute the second source.
  this.ctl1.gainNode.gain.value = 0.3;
 this.ctl2.gainNode.gain.value = 0.3;
  this.ctl1.source.playbackRate.value = 1 + Math.random() * 1
   this.ctl2.source.playbackRate.value = 1 + Math.random() * 1
  // Start playback in a loop
  if (!this.ctl1.source.start) {
    this.ctl1.source.noteOn(0);
    this.ctl2.source.noteOn(0);
  } else {
    this.ctl1.source.start(0);
    this.ctl2.source.start(0);
  }

  function createSource(buffer) {
    var source = context.createBufferSource();
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    source.buffer = buffer;
    // Turn on looping
    source.loop = true;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(context.destination);

    return {
      source: source,
      gainNode: gainNode
    };
  }
};

CrossfadeSample.stop = function() {
  if (!this.ctl1.source.stop) {
    this.ctl1.source.noteOff(0);
    this.ctl2.source.noteOff(0);
  } else {
    this.ctl1.source.stop(0);
    this.ctl2.source.stop(0);
  }
};

// Fades between 0 (all source 1) and 1 (all source 2)
CrossfadeSample.crossfade = function(element) {
  var x = parseInt(element.value) / parseInt(element.max);
  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(x * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
  this.ctl1.gainNode.gain.value = gain1;
  this.ctl2.gainNode.gain.value = gain2;
};

CrossfadeSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};