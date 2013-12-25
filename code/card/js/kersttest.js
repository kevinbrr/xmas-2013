/* * Copyright 2013 Boris Smus. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function RapidSoundsSample(context) {
  var ctx = this;
  var loader = new BufferLoader(
		  context,
		  ['./audiofiles/stille1.wav', 	 //0
		   './audiofiles/stille2.wav',	 //1
		   './audiofiles/stille3.wav',	 //2
		   './audiofiles/hohoho.wav',	 //3
		   './audiofiles/nom-c-02.wav',	 //4	   
		   './audiofiles/nom-d-03.wav',  //5
           
		   ], 
		 
		  onLoaded		  
  );

  function onLoaded(buffers) {
    ctx.buffers = buffers;  
    
  };

  loader.load();

  this.isCompressed = true;  

}

RapidSoundsSample.prototype.playSound = function(type) {
	var source1 = this.makeSource(this.buffers[type]);
	source1.start(0);
}
RapidSoundsSample.prototype.stopSound = function(type) {
	var source1 = this.makeSource(this.buffers[type]);
	source1.stop(0);
}

RapidSoundsSample.prototype.shootRound = function(type, rounds, interval, random, random2) {
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

RapidSoundsSample.prototype.makeSource = function(buffer) {
  var source = context.createBufferSource();
  var gain = context.createGainNode();
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
};

RapidSoundsSample.prototype.toggleCompressor = function() {
  this.isCompressed = !this.isCompressed;
}