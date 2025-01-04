const TRANSLATION_MESSAGES = {
    hungry: {
        meow1: ["My bowl is tragically empty!", 85],
        meow2: ["Feed me, I'm wasting away!", 70],
        meow3: ["Is that food? For me?", 60],
    },
    affection: {
        purr1: ["Purrrr... you may pet me.", 90],
        purr2: ["I tolerate your affection.", 75],
        purr3: ["Head scratches are... acceptable.", 65],
    },
    play: {
        meow1: ["The red dot! Engage!", 80],
        meow2: ["This toy mouse is my mortal enemy!", 70],
        meow3: ["Play with me, human!", 60],
    },
    demand: {
        meow1: ["Open the door, minion!", 95],
        meow2: ["I require your immediate attention!", 80],
        meow3: ["Why is this door closed?!", 65],
    },
    warning: {
        hiss1: ["Hssss! Back away slowly.", 90],
        hiss2: ["I am displeased.", 80],
        hiss3: ["That is MY spot!", 70],
    },
    default: {
        meow1: ["Mrow? (Context unclear)", 50],
    },
};

const CAT_FACTS = [
    "A cat's purr vibrates at a frequency of 25 to 150 Hertz.",
    "Cats can make over 100 different vocalizations.",
];

const LISTENING_MESSAGES = [
    "Listening intently...",
    "Analyzing feline vocalizations...",
    "Tuning into cat frequencies...",
    "Processing meows and purrs...",
    "Detecting subtle purr-turbations...",
];
const ANALYSIS_MESSAGES = ["Analyzing meow...", "Decoding feline language...", "Identifying vocal patterns..."];

const recordBtn = document.getElementById("recordBtn");
const listeningIndicator = document.getElementById("listeningIndicator");
const translationOutput = document.getElementById("translationOutput");
const catFactDiv = document.getElementById("catFact");
const contextSelect = document.getElementById("context");
const confidenceLevelDiv = document.getElementById("confidenceLevel");
const analysisMessageDiv = document.getElementById("analysisMessage");
const waveformCanvas = document.getElementById("waveformCanvas");
const canvasCtx = waveformCanvas.getContext('2d');
const blogHeader = document.getElementById('blogHeader');


let listeningMessageIndex = 0;
let listeningInterval;
let animationFrameId;
// audio variables
let audioStream;
let audioContext;
let analyser;
let dataArray;

recordBtn.addEventListener("click", startRecording);


async function startRecording() {
    recordBtn.classList.add("recording");
    listeningIndicator.classList.add("listening");
    translationOutput.classList.remove("show");
    catFactDiv.classList.remove("show");
    analysisMessageDiv.classList.remove("show");
    confidenceLevelDiv.classList.remove("show");
    waveformCanvas.classList.remove("active");
    listeningMessageIndex = 0;
    listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
    listeningInterval = setInterval(cycleListeningMessages, 800);

    try {
        // Access the user's microphone
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Audio stream retrieved");
        // Create an audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // create analyser
        analyser = audioContext.createAnalyser();
        // set fft size
        analyser.fftSize = 2048;
        // Create a source node from the microphone input stream
        const source = audioContext.createMediaStreamSource(audioStream);
        // connect source to analyser
        source.connect(analyser);
        // create data array to hold the frequency data
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        // Start analysis after a delay
        setTimeout(startAnalysis, 2000);

    } catch (error) {
        console.error("Error getting audio:", error);
        translationOutput.textContent = "Could not get access to your microphone. Check permissions.";
        translationOutput.classList.add("show");
        stopRecording();
    }
}

function startAnalysis() {
    clearInterval(listeningInterval);
    listeningIndicator.classList.remove("listening");
    listeningIndicator.textContent = "";
    analysisMessageDiv.textContent = ANALYSIS_MESSAGES[0];
    analysisMessageDiv.classList.add("show");
    waveformCanvas.classList.add("active");
    drawWaveform(); // Start drawing the waveform
    setTimeout(stopRecording, 2000);

}
function stopRecording() {
    recordBtn.classList.remove("recording");
    waveformCanvas.classList.remove("active");
    analysisMessageDiv.classList.remove("show");
    cancelAnimationFrame(animationFrameId);
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height)
    // Stop audio tracks
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
    }
    if (Math.random() < 0.7) {
        displayTranslation();
        displayCatFact();
    } else {
        translationOutput.textContent = "No cat detected. Try again.";
        translationOutput.classList.add("show");
    }
}

function cycleListeningMessages() {
    listeningMessageIndex = (listeningMessageIndex + 1) % LISTENING_MESSAGES.length;
    listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
}


function displayTranslation() {
    const selectedContext = contextSelect.value;
    const translations = TRANSLATION_MESSAGES[selectedContext] || TRANSLATION_MESSAGES.default;
    const meowTypes = Object.keys(translations);
    const randomMeowType = meowTypes[Math.floor(Math.random() * meowTypes.length)];
    const [translation, confidence] = translations[randomMeowType];
    translationOutput.textContent = translation;
    confidenceLevelDiv.textContent = `Confidence: ${confidence}%`;
    translationOutput.classList.add("show");
    confidenceLevelDiv.classList.add("show");
    speakTranslation(translation); //call the speech function
}

function displayCatFact() {
    const randomIndex = Math.floor(Math.random() * CAT_FACTS.length);
    catFactDiv.textContent = "Fun Cat Fact: " + CAT_FACTS[randomIndex];
    catFactDiv.classList.add("show");
}

function drawWaveform() {
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);

    function animate() {
        analyser.getByteFrequencyData(dataArray);
        canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
        const barWidth = (waveformCanvas.width / dataArray.length) * 2.5;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * (waveformCanvas.height / 1.2);
            canvasCtx.fillStyle = 'rgb(255,255,255)'
            canvasCtx.fillRect(x, waveformCanvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }

        animationFrameId = requestAnimationFrame(animate);

    }
    animate();
}

// Text to Speech function
function speakTranslation(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    // Optional:  set voice, rate, pitch etc here - feel free to experiment
        // utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'your_preferred_voice_name') //get voices

    speechSynthesis.speak(utterance);
}
