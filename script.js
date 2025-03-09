const waves = document.querySelectorAll(".wave");
const startButton = document.getElementById("start-btn");

startButton.addEventListener("click", () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      microphone.connect(analyser);

      function animateWave() {
        analyser.getByteFrequencyData(dataArray);
        dataArray.forEach((value, index) => {
          const scale = (value / 255) * 2;

          if (waves[index]) {
            waves[index].style.transform = `scale(${0.5 + scale})`;
            waves[index].style.opacity = 0.3 + scale * 0.7;
          }
        });
        requestAnimationFrame(animateWave);
      }
      animateWave();
    })

    .catch((err) => {
      alert("Microphone access is required for audio visualization.");
      console.error("Microphone access error:", err);
    });
});

recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript
    .trim()
    .toLowerCase();
  console.log("Recognized text:", transcript);
  if (transcript === "hello") {
    const speech = new SpeechSynthesisUtterance("Hello sir");
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  }
};

stopButton.addEventListener("click", () => {
  recognition.stop();
  waves.forEach((wave) => (wave.style.animationPlayState = "paused"));
});

recognition.onerror = (event) =>
  console.error("Error occurred in recognition:", event.error);
