(async () => {
    try {
        const mediaStresm = await navigator.mediaDevices.getUserMedia({ audio: true });
    
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(d => d.kind === 'audioinput');

        // Populating the audio device dropdown
        populateAudioDD(audioDevices);

        // Initialize Audio Context analyzer
        initAudioAnalyser(mediaStresm);
    } catch (e) {
        console.log({ err: e })
        // handle error
    }

    function populateAudioDD(devices) {
        const dd = document.getElementById("audio-devices");
        let options = "";
        for (const ad of devices) {
            options += `<option value="${ad.deviceId}">${ad.label}</option>`;
        }

        dd.innerHTML = options;
    }

    async function initAudioAnalyser(audioStream) {
        // Initialize audio context
        const audioContext = new AudioContext();

        // Getting a reference to MediaStreamAudioSourceNode object
        const microphone = audioContext.createMediaStreamSource(audioStream);

        // Loading the AudioWorkletProcessor
        // from another script with addModule method
        await audioContext.audioWorklet.addModule('volume-processor.js');

        // Initialising an AudioWorkletNode representing the
        // characteristics and functionalities of the loaded
        // AudioWorkletProcessor
        const audioNode = new AudioWorkletNode(audioContext, 'vumeter');

        // Start listening to the messages sent from the AudioWorkletProcessor node
        audioNode.port.onmessage = event => {
            const v = event.data.volume * 100;
            let st = v >= 1 ? 'Speaking' : 'Silent';
            console.log(st);
        }

        // Bind the MediaStreamSourceNode to the AudioWorkletProcessor node
        // to facilitate processing of the data
        microphone.connect(audioNode).connect(audioContext.destination);

        setTimeout(() => audioContext.close(),5000)
    }
})()