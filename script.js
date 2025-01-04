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
let isRecording = false; // toggle state for recording
let audioStream;
let audioContext;
let analyser;
let dataArray;
let lastTranslation = ""; // To stop repeating the same translation
let isSpeaking = false;
let speechQueue = [];


recordBtn.addEventListener("click", toggleRecording);


async function toggleRecording() {
    isRecording = !isRecording; // Toggle the recording state
    recordBtn.classList.toggle("recording", isRecording);
    waveformCanvas.classList.toggle("active",isRecording);
    if (isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
        listeningIndicator.classList.add("listening");
        translationOutput.classList.remove("show");
        catFactDiv.classList.remove("show");
        analysisMessageDiv.classList.remove("show");
        confidenceLevelDiv.classList.remove("show");
          listeningMessageIndex = 0;
        listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
          listeningInterval = setInterval(cycleListeningMessages, 800);
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Audio stream retrieved");
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const source = audioContext.createMediaStreamSource(audioStream);
        source.connect(analyser);
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
      
        analysisMessageDiv.textContent = ANALYSIS_MESSAGES[0];
        analysisMessageDiv.classList.add("show");
        drawWaveform();
         // Start the analysis loop
         animateAnalysis();


    } catch (error) {
        console.error("Error getting audio:", error);
        translationOutput.textContent = "Could not get access to your microphone. Check permissions.";
        translationOutput.classList.add("show");
        stopRecording();
    }
}

function stopRecording() {
    clearInterval(listeningInterval);
    listeningIndicator.classList.remove("listening");
    listeningIndicator.textContent = "";
    analysisMessageDiv.classList.remove("show");
  cancelAnimationFrame(animationFrameId);
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
    }
    // Reset last translation so next translation will output.
    lastTranslation = "";
}

function cycleListeningMessages() {
    listeningMessageIndex = (listeningMessageIndex + 1) % LISTENING_MESSAGES.length;
    listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
}

function displayTranslation(translation, confidence) {
  if (translation !== lastTranslation){
        translationOutput.textContent = translation;
        confidenceLevelDiv.textContent = `Confidence: ${confidence}%`;
        translationOutput.classList.add("show");
        confidenceLevelDiv.classList.add("show");
        speakTranslation(translation); // Speak the translation
        lastTranslation = translation;

  }

}

function displayCatFact() {
    const randomIndex = Math.floor(Math.random() * CAT_FACTS.length);
    catFactDiv.textContent = "Fun Cat Fact: " + CAT_FACTS[randomIndex];
    catFactDiv.classList.add("show");
}

function drawWaveform() {
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
     function animate() {
        if(!isRecording){
            return
        }
            analyser.getByteFrequencyData(dataArray);
            canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
            const barWidth = (waveformCanvas.width/ dataArray.length)*2.5;
            let x =0;

            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i]/255) * (waveformCanvas.height/1.2);
                canvasCtx.fillStyle = 'rgb(255,255,255)'
                canvasCtx.fillRect(x, waveformCanvas.height-barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        animationFrameId = requestAnimationFrame(animate);
    }
   animate();
}


function analyzeAudio(){
    analyser.getByteFrequencyData(dataArray);
      // ***Placeholder Audio analysis and translation logic ***
    // Replace this with actual audio processing
    if (Math.random() < 0.7) {
        const selectedContext = contextSelect.value;
        const translations = TRANSLATION_MESSAGES[selectedContext] || TRANSLATION_MESSAGES.default;
        const meowTypes = Object.keys(translations);
        const randomMeowType = meowTypes[Math.floor(Math.random() * meowTypes.length)];
        const [translation, confidence] = translations[randomMeowType];
        displayTranslation(translation, confidence);
        if (Math.random() < 0.2) {
            displayCatFact();
        }
    } else {
        if (lastTranslation != 'No cat detected. Try again.'){
            displayTranslation("No cat detected. Try again.", 100)

        }
    }
}
function animateAnalysis() {
    if(!isRecording) return
    analyzeAudio();
    animationFrameId = requestAnimationFrame(animateAnalysis)

}


function speakTranslation(text) {
    if (isSpeaking){
        speechSynthesis.cancel() // Clear queue of other speech
       isSpeaking = false;

    }

        const utterance = new SpeechSynthesisUtterance(text);

       utterance.onstart = () => isSpeaking = true
       utterance.onend = () => isSpeaking = false;
       utterance.onerror = () => isSpeaking = false;

    speechSynthesis.speak(utterance);

}const TRANSLATION_MESSAGES = {
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
let isRecording = false; // toggle state for recording
let audioStream;
let audioContext;
let analyser;
let dataArray;
let lastTranslation = ""; // To stop repeating the same translation
let isSpeaking = false;
let speechQueue = [];


recordBtn.addEventListener("click", toggleRecording);


async function toggleRecording() {
    isRecording = !isRecording; // Toggle the recording state
    recordBtn.classList.toggle("recording", isRecording);
    waveformCanvas.classList.toggle("active",isRecording);
    if (isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
        listeningIndicator.classList.add("listening");
        translationOutput.classList.remove("show");
        catFactDiv.classList.remove("show");
        analysisMessageDiv.classList.remove("show");
        confidenceLevelDiv.classList.remove("show");
          listeningMessageIndex = 0;
        listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
          listeningInterval = setInterval(cycleListeningMessages, 800);
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Audio stream retrieved");
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const source = audioContext.createMediaStreamSource(audioStream);
        source.connect(analyser);
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
      
        analysisMessageDiv.textContent = ANALYSIS_MESSAGES[0];
        analysisMessageDiv.classList.add("show");
        drawWaveform();
         // Start the analysis loop
         animateAnalysis();


    } catch (error) {
        console.error("Error getting audio:", error);
        translationOutput.textContent = "Could not get access to your microphone. Check permissions.";
        translationOutput.classList.add("show");
        stopRecording();
    }
}

function stopRecording() {
    clearInterval(listeningInterval);
    listeningIndicator.classList.remove("listening");
    listeningIndicator.textContent = "";
    analysisMessageDiv.classList.remove("show");
  cancelAnimationFrame(animationFrameId);
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
    }
    // Reset last translation so next translation will output.
    lastTranslation = "";
}

function cycleListeningMessages() {
    listeningMessageIndex = (listeningMessageIndex + 1) % LISTENING_MESSAGES.length;
    listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
}

function displayTranslation(translation, confidence) {
  if (translation !== lastTranslation){
        translationOutput.textContent = translation;
        confidenceLevelDiv.textContent = `Confidence: ${confidence}%`;
        translationOutput.classList.add("show");
        confidenceLevelDiv.classList.add("show");
        speakTranslation(translation); // Speak the translation
        lastTranslation = translation;

  }

}

function displayCatFact() {
    const randomIndex = Math.floor(Math.random() * CAT_FACTS.length);
    catFactDiv.textContent = "Fun Cat Fact: " + CAT_FACTS[randomIndex];
    catFactDiv.classList.add("show");
}

function drawWaveform() {
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
     function animate() {
        if(!isRecording){
            return
        }
            analyser.getByteFrequencyData(dataArray);
            canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
            const barWidth = (waveformCanvas.width/ dataArray.length)*2.5;
            let x =0;

            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i]/255) * (waveformCanvas.height/1.2);
                canvasCtx.fillStyle = 'rgb(255,255,255)'
                canvasCtx.fillRect(x, waveformCanvas.height-barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        animationFrameId = requestAnimationFrame(animate);
    }
   animate();
}


function analyzeAudio(){
    analyser.getByteFrequencyData(dataArray);
      // ***Placeholder Audio analysis and translation logic ***
    // Replace this with actual audio processing
    if (Math.random() < 0.7) {
        const selectedContext = contextSelect.value;
        const translations = TRANSLATION_MESSAGES[selectedContext] || TRANSLATION_MESSAGES.default;
        const meowTypes = Object.keys(translations);
        const randomMeowType = meowTypes[Math.floor(Math.random() * meowTypes.length)];
        const [translation, confidence] = translations[randomMeowType];
        displayTranslation(translation, confidence);
        if (Math.random() < 0.2) {
            displayCatFact();
        }
    } else {
        if (lastTranslation != 'No cat detected. Try again.'){
            displayTranslation("No cat detected. Try again.", 100)

        }
    }
}
function animateAnalysis() {
    if(!isRecording) return
    analyzeAudio();
    animationFrameId = requestAnimationFrame(animateAnalysis)

}


function speakTranslation(text) {
    if (isSpeaking){
        speechSynthesis.cancel() // Clear queue of other speech
       isSpeaking = false;

    }

        const utterance = new SpeechSynthesisUtterance(text);

       utterance.onstart = () => isSpeaking = true
       utterance.onend = () => isSpeaking = false;
       utterance.onerror = () => isSpeaking = false;

    speechSynthesis.speak(utterance);

}const TRANSLATION_MESSAGES = {
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
let isRecording = false; // toggle state for recording
let audioStream;
let audioContext;
let analyser;
let dataArray;
let lastTranslation = ""; // To stop repeating the same translation
let isSpeaking = false;
let speechQueue = [];


recordBtn.addEventListener("click", toggleRecording);


async function toggleRecording() {
    isRecording = !isRecording; // Toggle the recording state
    recordBtn.classList.toggle("recording", isRecording);
    waveformCanvas.classList.toggle("active",isRecording);
    if (isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
        listeningIndicator.classList.add("listening");
        translationOutput.classList.remove("show");
        catFactDiv.classList.remove("show");
        analysisMessageDiv.classList.remove("show");
        confidenceLevelDiv.classList.remove("show");
          listeningMessageIndex = 0;
        listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
          listeningInterval = setInterval(cycleListeningMessages, 800);
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Audio stream retrieved");
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const source = audioContext.createMediaStreamSource(audioStream);
        source.connect(analyser);
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
      
        analysisMessageDiv.textContent = ANALYSIS_MESSAGES[0];
        analysisMessageDiv.classList.add("show");
        drawWaveform();
         // Start the analysis loop
         animateAnalysis();


    } catch (error) {
        console.error("Error getting audio:", error);
        translationOutput.textContent = "Could not get access to your microphone. Check permissions.";
        translationOutput.classList.add("show");
        stopRecording();
    }
}

function stopRecording() {
    clearInterval(listeningInterval);
    listeningIndicator.classList.remove("listening");
    listeningIndicator.textContent = "";
    analysisMessageDiv.classList.remove("show");
  cancelAnimationFrame(animationFrameId);
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
    }
    // Reset last translation so next translation will output.
    lastTranslation = "";
}

function cycleListeningMessages() {
    listeningMessageIndex = (listeningMessageIndex + 1) % LISTENING_MESSAGES.length;
    listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
}

function displayTranslation(translation, confidence) {
  if (translation !== lastTranslation){
        translationOutput.textContent = translation;
        confidenceLevelDiv.textContent = `Confidence: ${confidence}%`;
        translationOutput.classList.add("show");
        confidenceLevelDiv.classList.add("show");
        speakTranslation(translation); // Speak the translation
        lastTranslation = translation;

  }

}

function displayCatFact() {
    const randomIndex = Math.floor(Math.random() * CAT_FACTS.length);
    catFactDiv.textContent = "Fun Cat Fact: " + CAT_FACTS[randomIndex];
    catFactDiv.classList.add("show");
}

function drawWaveform() {
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
     function animate() {
        if(!isRecording){
            return
        }
            analyser.getByteFrequencyData(dataArray);
            canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
            const barWidth = (waveformCanvas.width/ dataArray.length)*2.5;
            let x =0;

            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i]/255) * (waveformCanvas.height/1.2);
                canvasCtx.fillStyle = 'rgb(255,255,255)'
                canvasCtx.fillRect(x, waveformCanvas.height-barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        animationFrameId = requestAnimationFrame(animate);
    }
   animate();
}


function analyzeAudio(){
    analyser.getByteFrequencyData(dataArray);
      // ***Placeholder Audio analysis and translation logic ***
    // Replace this with actual audio processing
    if (Math.random() < 0.7) {
        const selectedContext = contextSelect.value;
        const translations = TRANSLATION_MESSAGES[selectedContext] || TRANSLATION_MESSAGES.default;
        const meowTypes = Object.keys(translations);
        const randomMeowType = meowTypes[Math.floor(Math.random() * meowTypes.length)];
        const [translation, confidence] = translations[randomMeowType];
        displayTranslation(translation, confidence);
        if (Math.random() < 0.2) {
            displayCatFact();
        }
    } else {
        if (lastTranslation != 'No cat detected. Try again.'){
            displayTranslation("No cat detected. Try again.", 100)

        }
    }
}
function animateAnalysis() {
    if(!isRecording) return
    analyzeAudio();
    animationFrameId = requestAnimationFrame(animateAnalysis)

}


function speakTranslation(text) {
    if (isSpeaking){
        speechSynthesis.cancel() // Clear queue of other speech
       isSpeaking = false;

    }

        const utterance = new SpeechSynthesisUtterance(text);

       utterance.onstart = () => isSpeaking = true
       utterance.onend = () => isSpeaking = false;
       utterance.onerror = () => isSpeaking = false;

    speechSynthesis.speak(utterance);

}const TRANSLATION_MESSAGES = {
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
let isRecording = false; // toggle state for recording
let audioStream;
let audioContext;
let analyser;
let dataArray;
let lastTranslation = ""; // To stop repeating the same translation
let isSpeaking = false;
let speechQueue = [];


recordBtn.addEventListener("click", toggleRecording);


async function toggleRecording() {
    isRecording = !isRecording; // Toggle the recording state
    recordBtn.classList.toggle("recording", isRecording);
    waveformCanvas.classList.toggle("active",isRecording);
    if (isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
        listeningIndicator.classList.add("listening");
        translationOutput.classList.remove("show");
        catFactDiv.classList.remove("show");
        analysisMessageDiv.classList.remove("show");
        confidenceLevelDiv.classList.remove("show");
          listeningMessageIndex = 0;
        listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
          listeningInterval = setInterval(cycleListeningMessages, 800);
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Audio stream retrieved");
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const source = audioContext.createMediaStreamSource(audioStream);
        source.connect(analyser);
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
      
        analysisMessageDiv.textContent = ANALYSIS_MESSAGES[0];
        analysisMessageDiv.classList.add("show");
        drawWaveform();
         // Start the analysis loop
         animateAnalysis();


    } catch (error) {
        console.error("Error getting audio:", error);
        translationOutput.textContent = "Could not get access to your microphone. Check permissions.";
        translationOutput.classList.add("show");
        stopRecording();
    }
}

function stopRecording() {
    clearInterval(listeningInterval);
    listeningIndicator.classList.remove("listening");
    listeningIndicator.textContent = "";
    analysisMessageDiv.classList.remove("show");
  cancelAnimationFrame(animationFrameId);
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
    }
    // Reset last translation so next translation will output.
    lastTranslation = "";
}

function cycleListeningMessages() {
    listeningMessageIndex = (listeningMessageIndex + 1) % LISTENING_MESSAGES.length;
    listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
}

function displayTranslation(translation, confidence) {
  if (translation !== lastTranslation){
        translationOutput.textContent = translation;
        confidenceLevelDiv.textContent = `Confidence: ${confidence}%`;
        translationOutput.classList.add("show");
        confidenceLevelDiv.classList.add("show");
        speakTranslation(translation); // Speak the translation
        lastTranslation = translation;

  }

}

function displayCatFact() {
    const randomIndex = Math.floor(Math.random() * CAT_FACTS.length);
    catFactDiv.textContent = "Fun Cat Fact: " + CAT_FACTS[randomIndex];
    catFactDiv.classList.add("show");
}

function drawWaveform() {
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
     function animate() {
        if(!isRecording){
            return
        }
            analyser.getByteFrequencyData(dataArray);
            canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
            const barWidth = (waveformCanvas.width/ dataArray.length)*2.5;
            let x =0;

            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i]/255) * (waveformCanvas.height/1.2);
                canvasCtx.fillStyle = 'rgb(255,255,255)'
                canvasCtx.fillRect(x, waveformCanvas.height-barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        animationFrameId = requestAnimationFrame(animate);
    }
   animate();
}


function analyzeAudio(){
    analyser.getByteFrequencyData(dataArray);
      // ***Placeholder Audio analysis and translation logic ***
    // Replace this with actual audio processing
    if (Math.random() < 0.7) {
        const selectedContext = contextSelect.value;
        const translations = TRANSLATION_MESSAGES[selectedContext] || TRANSLATION_MESSAGES.default;
        const meowTypes = Object.keys(translations);
        const randomMeowType = meowTypes[Math.floor(Math.random() * meowTypes.length)];
        const [translation, confidence] = translations[randomMeowType];
        displayTranslation(translation, confidence);
        if (Math.random() < 0.2) {
            displayCatFact();
        }
    } else {
        if (lastTranslation != 'No cat detected. Try again.'){
            displayTranslation("No cat detected. Try again.", 100)

        }
    }
}
function animateAnalysis() {
    if(!isRecording) return
    analyzeAudio();
    animationFrameId = requestAnimationFrame(animateAnalysis)

}


function speakTranslation(text) {
    if (isSpeaking){
        speechSynthesis.cancel() // Clear queue of other speech
       isSpeaking = false;

    }

        const utterance = new SpeechSynthesisUtterance(text);

       utterance.onstart = () => isSpeaking = true
       utterance.onend = () => isSpeaking = false;
       utterance.onerror = () => isSpeaking = false;

    speechSynthesis.speak(utterance);

}const TRANSLATION_MESSAGES = {
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
let isRecording = false; // toggle state for recording
let audioStream;
let audioContext;
let analyser;
let dataArray;
let lastTranslation = ""; // To stop repeating the same translation
let isSpeaking = false;
let speechQueue = [];


recordBtn.addEventListener("click", toggleRecording);


async function toggleRecording() {
    isRecording = !isRecording; // Toggle the recording state
    recordBtn.classList.toggle("recording", isRecording);
    waveformCanvas.classList.toggle("active",isRecording);
    if (isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
        listeningIndicator.classList.add("listening");
        translationOutput.classList.remove("show");
        catFactDiv.classList.remove("show");
        analysisMessageDiv.classList.remove("show");
        confidenceLevelDiv.classList.remove("show");
          listeningMessageIndex = 0;
        listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
          listeningInterval = setInterval(cycleListeningMessages, 800);
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Audio stream retrieved");
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const source = audioContext.createMediaStreamSource(audioStream);
        source.connect(analyser);
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
      
        analysisMessageDiv.textContent = ANALYSIS_MESSAGES[0];
        analysisMessageDiv.classList.add("show");
        drawWaveform();
         // Start the analysis loop
         animateAnalysis();


    } catch (error) {
        console.error("Error getting audio:", error);
        translationOutput.textContent = "Could not get access to your microphone. Check permissions.";
        translationOutput.classList.add("show");
        stopRecording();
    }
}

function stopRecording() {
    clearInterval(listeningInterval);
    listeningIndicator.classList.remove("listening");
    listeningIndicator.textContent = "";
    analysisMessageDiv.classList.remove("show");
  cancelAnimationFrame(animationFrameId);
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
    }
    // Reset last translation so next translation will output.
    lastTranslation = "";
}

function cycleListeningMessages() {
    listeningMessageIndex = (listeningMessageIndex + 1) % LISTENING_MESSAGES.length;
    listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
}

function displayTranslation(translation, confidence) {
  if (translation !== lastTranslation){
        translationOutput.textContent = translation;
        confidenceLevelDiv.textContent = `Confidence: ${confidence}%`;
        translationOutput.classList.add("show");
        confidenceLevelDiv.classList.add("show");
        speakTranslation(translation); // Speak the translation
        lastTranslation = translation;

  }

}

function displayCatFact() {
    const randomIndex = Math.floor(Math.random() * CAT_FACTS.length);
    catFactDiv.textContent = "Fun Cat Fact: " + CAT_FACTS[randomIndex];
    catFactDiv.classList.add("show");
}

function drawWaveform() {
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
     function animate() {
        if(!isRecording){
            return
        }
            analyser.getByteFrequencyData(dataArray);
            canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
            const barWidth = (waveformCanvas.width/ dataArray.length)*2.5;
            let x =0;

            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i]/255) * (waveformCanvas.height/1.2);
                canvasCtx.fillStyle = 'rgb(255,255,255)'
                canvasCtx.fillRect(x, waveformCanvas.height-barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        animationFrameId = requestAnimationFrame(animate);
    }
   animate();
}


function analyzeAudio(){
    analyser.getByteFrequencyData(dataArray);
      // ***Placeholder Audio analysis and translation logic ***
    // Replace this with actual audio processing
    if (Math.random() < 0.7) {
        const selectedContext = contextSelect.value;
        const translations = TRANSLATION_MESSAGES[selectedContext] || TRANSLATION_MESSAGES.default;
        const meowTypes = Object.keys(translations);
        const randomMeowType = meowTypes[Math.floor(Math.random() * meowTypes.length)];
        const [translation, confidence] = translations[randomMeowType];
        displayTranslation(translation, confidence);
        if (Math.random() < 0.2) {
            displayCatFact();
        }
    } else {
        if (lastTranslation != 'No cat detected. Try again.'){
            displayTranslation("No cat detected. Try again.", 100)

        }
    }
}
function animateAnalysis() {
    if(!isRecording) return
    analyzeAudio();
    animationFrameId = requestAnimationFrame(animateAnalysis)

}


function speakTranslation(text) {
    if (isSpeaking){
        speechSynthesis.cancel() // Clear queue of other speech
       isSpeaking = false;

    }

        const utterance = new SpeechSynthesisUtterance(text);

       utterance.onstart = () => isSpeaking = true
       utterance.onend = () => isSpeaking = false;
       utterance.onerror = () => isSpeaking = false;

    speechSynthesis.speak(utterance);

}
