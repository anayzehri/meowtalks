const TRANSLATION_MESSAGES = {
    hungry: {
        meow1: { text: "My bowl is tragically empty!", confidence: 85, frequencyRange: [200, 400], intensity: 0.7, duration: 0.5 },
        meow2: { text: "Feed me, I'm wasting away!", confidence: 70, frequencyRange: [250, 450], intensity: 0.8, duration: 0.8 },
        meow3: { text: "Is that food? For me?", confidence: 60, frequencyRange: [300, 500], intensity: 0.5, duration: 0.3 },
        meow4: { text: "I'm famished! Where is my dinner?", confidence: 90, frequencyRange: [350, 550], intensity: 0.9, duration: 0.7 },
        meow5: { text: "A little nibble? Please?", confidence: 50, frequencyRange: [300, 500], intensity: 0.4, duration: 0.6 },
    },
    affection: {
        purr1: { text: "Purrrr... you may pet me.", confidence: 90, frequencyRange: [25, 150], intensity: 0.3, duration: 2 },
        purr2: { text: "I tolerate your affection.", confidence: 75, frequencyRange: [50, 120], intensity: 0.4, duration: 1.5 },
        purr3: { text: "Head scratches are... acceptable.", confidence: 65, frequencyRange: [60, 130], intensity: 0.5, duration: 1.2 },
        purr4: { text: "More chin rubs... please?", confidence: 80, frequencyRange: [30, 100], intensity: 0.4, duration: 1.3 },
        purr5: { text: "I suppose you may sit near me.", confidence: 50, frequencyRange: [70, 140], intensity: 0.3, duration: 1.1 },
    },
    play: {
        meow1: { text: "The red dot! Engage!", confidence: 80, frequencyRange: [500, 700], intensity: 0.7, duration: 0.5 },
        meow2: { text: "This toy mouse is my mortal enemy!", confidence: 70, frequencyRange: [600, 800], intensity: 0.6, duration: 0.7 },
        meow3: { text: "Play with me, human!", confidence: 60, frequencyRange: [550, 750], intensity: 0.8, duration: 0.6 },
        meow4: { text: "Time for some zooming around!", confidence: 90, frequencyRange: [650, 850], intensity: 0.9, duration: 0.4 },
        meow5: { text: "I must catch the stringy thing!", confidence: 80, frequencyRange: [450, 650], intensity: 0.7, duration: 0.5 },
    },
    demand: {
        meow1: { text: "Open the door, minion!", confidence: 95, frequencyRange: [800, 1000], intensity: 0.9, duration: 0.5 },
        meow2: { text: "I require your immediate attention!", confidence: 80, frequencyRange: [900, 1100], intensity: 0.8, duration: 0.7 },
        meow3: { text: "Why is this door closed?!", confidence: 65, frequencyRange: [700, 900], intensity: 0.7, duration: 0.6 },
        meow4: { text: "I'm waiting for my request to be fulfilled!", confidence: 90, frequencyRange: [850, 1050], intensity: 0.9, duration: 0.8 },
        meow5: { text: "Hey, I said OPEN it!", confidence: 90, frequencyRange: [750, 950], intensity: 0.9, duration: 0.4 },
    },
    warning: {
        hiss1: { text: "Hssss! Back away slowly.", confidence: 90, frequencyRange: [1000, 1200], intensity: 0.9, duration: 0.3 },
        hiss2: { text: "I am displeased.", confidence: 80, frequencyRange: [900, 1100], intensity: 0.8, duration: 0.5 },
        hiss3: { text: "That is MY spot!", confidence: 70, frequencyRange: [1100, 1300], intensity: 0.7, duration: 0.6 },
        hiss4: { text: "You dare come closer?", confidence: 85, frequencyRange: [1050, 1250], intensity: 0.85, duration: 0.4 },
        hiss5: { text: "Leave me alone!!", confidence: 95, frequencyRange: [950, 1150], intensity: 0.95, duration: 0.4 }
    },
    default: {
        meow1: { text: "Mrow? (Context unclear)", confidence: 50, frequencyRange: [400, 600], intensity: 0.4, duration: 0.4 },
    },
};

const CAT_FACTS = [
    "A cat's purr vibrates at a frequency of 25 to 150 Hertz and can aid in healing.",
    "Cats can make over 100 different vocalizations and use meows to communicate with humans, not other cats.",
    "The average cat sleeps around 12-16 hours per day, conserving energy for hunting.",
    "Cats have a third eyelid that helps to keep their eyes moist and protected.",
    "A cat can jump up to six times its height, thanks to its powerful leg muscles.",
    "Cats can rotate their ears 180 degrees, allowing them to locate sounds with precision.",
    "Cats have a special reflective layer behind their retinas called the tapetum lucidum which helps them see in low light conditions.",
    "The nose print of a cat is unique, much like a human fingerprint.",
    "Cats use their whiskers to navigate and sense changes in the environment.",
    "Domestic cats have been living alongside humans for over 9,500 years.",
    "Some cats have a genetic mutation that causes them to be born with extra toes, known as polydactyly.",
    "Cats often knead when they're happy, a behavior that stems from kittenhood when they knead their mother's belly to stimulate milk production.",
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
