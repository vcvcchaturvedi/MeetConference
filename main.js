/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';
let recordedBlobs;

 function ConcatenateBlobs (blobs, type, callback) {
        var buffers = [];

        var index = 0;

        function readAsArrayBuffer() {
            if (!blobs[index]) {
                return concatenateBuffers();
            }
            var reader = new FileReader();
            reader.onload = function(event) {
                buffers.push(event.target.result);
                index++;
                readAsArrayBuffer();
            };
            reader.readAsArrayBuffer(blobs[index]);
        }

        readAsArrayBuffer();

        function concatenateBuffers() {
            var byteLength = 0;
            buffers.forEach(function(buffer) {
                byteLength += buffer.byteLength;
            });
            
            var tmp = new Uint16Array(byteLength);
            var lastOffset = 0;
            buffers.forEach(function(buffer,i,buffers) {
			   // if(i!=buffers.length-1)
				//buffer.slice(0,buffer.length-3);
                // BYTES_PER_ELEMENT == 2 for Uint16Array
                var reusableByteLength = buffer.byteLength;
                if (reusableByteLength % 2 != 0) {
                    buffer = buffer.slice(0, reusableByteLength - 1)
                }
                tmp.set(new Uint16Array(buffer), lastOffset);
                lastOffset += reusableByteLength;
            });

            var blob = new Blob([tmp.buffer], {
                type: type
            });

            callback(blob);
        }
    }

const recordButton = document.querySelector('button#record');
const downloadButton = document.querySelector('button#download');

recordButton.addEventListener('click', () => {
	
  if (recordButton.textContent === 'Start Recording') {
	  
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Start Recording';
    
    downloadButton.disabled = false;
  }
});


downloadButton.addEventListener('click', () => {
  //const blob = new Blob(recordedBlobs, {type: 'video/mp4'});//recordedBlobs.reduce((a,b)=>new Blob([a,b], {type: 'video/webm'}));
  //ConcatenateBlobs(recordedBlobs, 'video/webm', function(resultingBlob) {
 
    //POST_to_Server(resultingBlob);
    let urls=[];
    // or preview locally
	for(let i=0;i<recordedBlobs.length;i++)
	{
    let url = window.URL.createObjectURL(recordedBlobs[i]);
	urls.push(url);
	}
	/*let a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'recording.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
	}*/
	/*let finalFiles=[];
	let args=[];
	console.log('processing1...');
	let files=[];
	for(let i=0;i<urls.length;i++)
	{
		
		let fileReader1 = new FileReader();
        fileReader1.onload = function() {
			finalFiles.push({index: i,data: fileReader1.result});
			if(finalFiles.length==urls.length){
				for(let i=0;i<urls.length;i++)
	{
		let data;
		finalFiles.forEach(function(x){
			if(x.index==i)
				data=x.data;
		});
		let temp={
			data: new Uint8Array(data),
			name: 'file'+i
		};
		files.push(temp);
	}
	for(let i=0;i<urls.length;i++)
	{
	let str1="-i";
		args.push(str1);
		args.push(files[i].name);
		
		//args.push("-vp9");
	}*/
	//args.push("-c");
	
	//args.push("-c:v");
	

		//args.push("mpeg4");
		//args.push("-an");
		
	//args.push('-filter_complex "[0:v:0] 1:v:0]concat=n=2:v=1[outv]" -map "[outv]"');
	//args.push("final.mp4");
	//var blob = URL.createObjectURL(new Blob([]);
	let result=urls;//ffmpeg_run({arguments: args,files: files});
	result.forEach(function(file){
	let a = document.createElement('a');
  a.style.display = 'none';
  //let blob = new Blob(file);
  //let src = window.URL.createObjectURL(blob);
  a.href = file;
  a.download = 'recording.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(file);
  }, 100);
	});
  
			}
			//fileReader1.readAsArrayBuffer(recordedBlobs[i]);
		);
		
		
	
	
	
  
	

 /* const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'recording.mp4';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);*/
//});

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
	  
	recordedBlobs.push(event.data);
	
  }
}

function startRecording() {
	
  recordedBlobs = [];
  let options = {mimeType: 'video/webm'};
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported`);
    options = {mimeType: 'video/mp4'};                                //mp4 is not supported perhaps!
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = {mimeType: 'video/webm;codecs=vp8,opus'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = {mimeType: ''};
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    alert('Exception while creating MediaRecorder:'+ e);
    //errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
 
  downloadButton.disabled = true;
  mediaRecorder.onstop = (event) => {
	    try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    alert('Exception while creating MediaRecorder:'+ e);
    //errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
	 // console.log('hi');
	  
	/*if(downloadButton.disabled==true)
	{
		
		mediaRecorder.start();
		alert('no prevent default!');
		 try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    alert('Exception while creating MediaRecorder:'+ e);
    //errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }
console.log('new mediaRecorder created...');
mediaRecorder.ondataavailable = handleDataAvailable;
  
  console.log('MediaRecorder started', mediaRecorder);
  //mediaRecorder.start();
	}*/
	//else{
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
	//}
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}
