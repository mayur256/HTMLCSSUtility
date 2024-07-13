(async () => {
    // const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(d => d.kind === 'audioinput')
    populateAudioDD(audioDevices)

    function populateAudioDD(devices) {
        const dd = document.getElementById("audio-devices");
        let options = "";
        for (const ad of devices) {
            options += `<option value="${ad.deviceId}">${ad.label}</option>`;
        }

        dd.innerHTML = options;
    }
})()