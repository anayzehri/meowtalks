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


recordBtn.addEventListener("click", startRecording);


function startRecording() {
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
    setTimeout(startAnalysis, 2000);
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
}

function displayCatFact() {
  const randomIndex = Math.floor(Math.random() * CAT_FACTS.length);
  catFactDiv.textContent = "Fun Cat Fact: " + CAT_FACTS[randomIndex];
  catFactDiv.classList.add("show");
}

function drawWaveform(){
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    canvasCtx.fillStyle = '#457b9d';
    let x = 0;
    const amplitude = waveformCanvas.height/2
    const frequency = 0.05; // Adjust to get different speeds
    const  offset = amplitude;

    function animate() {
    canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
        canvasCtx.beginPath();
        for (let i = 0; i < waveformCanvas.width; i++) {
            const y = amplitude * Math.sin((x + i)*frequency) + offset;
             canvasCtx.lineTo(i,y);
        }
        canvasCtx.stroke();
        x+=1.2
        animationFrameId = requestAnimationFrame(animate);

    }
    animate();
}