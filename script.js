const TRANSLATION_MESSAGES = {
    hungry: {
        meow1: { text: "My bowl is tragically empty!", confidence: 85, frequencyRange: [200, 400], intensity: 0.7, duration: 0.5 },
        meow2: { text: "Feed me, I'm wasting away!", confidence: 70, frequencyRange: [250, 450], intensity: 0.8, duration: 0.8 },
        meow3: { text: "Is that food? For me?", confidence: 60, frequencyRange: [300, 500], intensity: 0.5, duration: 0.3 },
        meow4: { text: "I'm famished! Where is my dinner?", confidence: 90, frequencyRange: [350, 550], intensity: 0.9, duration: 0.7 },
        meow5: { text: "A little nibble? Please?", confidence: 50, frequencyRange: [300, 500], intensity: 0.4, duration: 0.6 },
    },
    affection: {
        purr1: { text: "you may pet me.", confidence: 90, frequencyRange: [25, 150], intensity: 0.3, duration: 2 },
        purr2: { text: "tolerate your affection.", confidence: 75, frequencyRange: [50, 120], intensity: 0.4, duration: 1.5 },
        purr3: { text: "Head scratches are acceptable.", confidence: 65, frequencyRange: [60, 130], intensity: 0.5, duration: 1.2 },
        purr4: { text: "More chin rubs please?", confidence: 80, frequencyRange: [30, 100], intensity: 0.4, duration: 1.3 },
        purr5: { text: "you may sit near me.", confidence: 50, frequencyRange: [70, 140], intensity: 0.3, duration: 1.1 },
    },
    play: {
        meow1: { text: "red dot! Engage!", confidence: 80, frequencyRange: [500, 700], intensity: 0.7, duration: 0.5 },
        meow2: { text: "toy mouse is my enemy!", confidence: 70, frequencyRange: [600, 800], intensity: 0.6, duration: 0.7 },
        meow3: { text: "Play with me!", confidence: 60, frequencyRange: [550, 750], intensity: 0.8, duration: 0.6 },
        meow4: { text: "zooming around!", confidence: 90, frequencyRange: [650, 850], intensity: 0.9, duration: 0.4 },
        meow5: { text: "I must catch the stringy thing!", confidence: 80, frequencyRange: [450, 650], intensity: 0.7, duration: 0.5 },
    },
    demand: {
        meow1: { text: "Open the door!", confidence: 95, frequencyRange: [800, 1000], intensity: 0.9, duration: 0.5 },
        meow2: { text: "I require attention!", confidence: 80, frequencyRange: [900, 1100], intensity: 0.8, duration: 0.7 },
        meow3: { text: "Why is this door closed?!", confidence: 65, frequencyRange: [700, 900], intensity: 0.7, duration: 0.6 },
        meow4: { text: "waiting for my request to be fulfilled!", confidence: 90, frequencyRange: [850, 1050], intensity: 0.9, duration: 0.8 },
        meow5: { text: "I said OPEN it!", confidence: 90, frequencyRange: [750, 950], intensity: 0.9, duration: 0.4 },
    },
    warning: {
        hiss1: { text: "Back away slowly.", confidence: 90, frequencyRange: [1000, 1200], intensity: 0.9, duration: 0.3 },
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
const visualCanvas = document.getElementById("visualCanvas");
const visualCtx = visualCanvas.getContext('2d');
const settingsBtn = document.getElementById('settingsBtn');
const settingsOverlay = document.getElementById('settings');
const closeSettingsBtn = document.getElementById('closeSettings');
const uiThemeSelect = document.getElementById('uiTheme');
const container = document.querySelector('.container');

let listeningMessageIndex = 0;
let listeningInterval;
let animationFrameId;
// audio variables
let audioStream;
let audioContext;
let analyser;
let dataArray;
let uiTheme = localStorage.getItem('uiTheme') || 'calm'; // Load theme from storage or default

// Apply theme on initial load
applyTheme(uiTheme);
recordBtn.addEventListener("click", startRecording);
settingsBtn.addEventListener('click', openSettings);
closeSettingsBtn.addEventListener('click', closeSettings);
uiThemeSelect.value = uiTheme
uiThemeSelect.addEventListener('change', handleThemeChange)
function handleThemeChange(e) {
  const selectedTheme = e.target.value;
  localStorage.setItem('uiTheme',selectedTheme)
  applyTheme(selectedTheme);
}
function openSettings() {
    settingsOverlay.classList.remove('hidden');
}

function closeSettings() {
    settingsOverlay.classList.add('hidden');
}

function applyTheme(theme) {
    switch (theme) {
         case 'vibrant':
            container.style.backgroundColor = "#ffd700";
           visualCanvas.style.borderColor ="#000000"
            waveformCanvas.style.borderColor = "#000000"
            recordBtn.style.backgroundColor ="#ff69b4"
            recordBtn.style.color = "#000000"
          settingsBtn.style.backgroundColor ="#ff69b4"
              settingsBtn.style.color = "#000000"
             break;

        case 'abstract':
            container.style.backgroundColor = "#6053c4";
             visualCanvas.style.borderColor ="#ffffff"
                waveformCanvas.style.borderColor = "#ffffff"
             recordBtn.style.backgroundColor ="#d98cb6"
              recordBtn.style.color = "#ffffff"
             settingsBtn.style.backgroundColor ="#d98cb6"
              settingsBtn.style.color = "#ffffff"

            break;
           case 'calm':
        default:
            container.style.backgroundColor = "#ffffff";
             visualCanvas.style.borderColor ="#ddd"
              waveformCanvas.style.borderColor = "#ddd"
            recordBtn.style.backgroundColor ="#4caf50"
            recordBtn.style.color = "#ffffff"
            settingsBtn.style.backgroundColor ="#6870f2"
                settingsBtn.style.color = "#ffffff"

    }
}

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
    visualCanvas.classList.add("active");
     visualCanvas.width = visualCanvas.offsetWidth;
     visualCanvas.height = visualCanvas.offsetHeight
        startVisuals();
    setTimeout(stopRecording, 2000);

}
function stopRecording() {
    recordBtn.classList.remove("recording");
      waveformCanvas.classList.remove("active");
    analysisMessageDiv.classList.remove("show");
       visualCanvas.classList.remove("active");
    cancelAnimationFrame(animationFrameId);
     visualCtx.clearRect(0, 0, visualCanvas.width, visualCanvas.height);
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
  const audioIntensity = calculateAudioIntensity(); // Get the average audio data
  const assembledPhrase = assembleDynamicPhrase(audioIntensity);
  translationOutput.textContent = assembledPhrase;
  confidenceLevelDiv.textContent = `Mood Level: ${Math.round(audioIntensity * 100)}%`; // Display intensity
  translationOutput.classList.add("show");
  confidenceLevelDiv.classList.add("show");
  speakTranslation(assembledPhrase, audioIntensity); // Pass in the audio intensity to manipulate sound

}
function calculateAudioIntensity() {
  analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (const amplitude of dataArray) {
        sum += Math.abs(amplitude - 128);
    }
    return sum / (dataArray.length * 128);
}

function assembleDynamicPhrase(intensity) {
  const categories = Object.keys(TRANSLATION_MESSAGES).filter(key => key !== 'default');
  const numberOfParts = Math.max(1, Math.min(3, Math.round(intensity * 3))); // Adjust as needed for your desired mix
  const parts = [];
  for (let i = 0; i < numberOfParts; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const messages = Object.values(TRANSLATION_MESSAGES[randomCategory]);
      if(messages && messages.length > 0){
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          parts.push(randomMessage.text);
      }

    }
    return parts.join(' ');
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
// Text to Speech function with audio manipulation
function speakTranslation(text, intensity) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1 + (intensity * 0.5);  // Control speed
    utterance.pitch = 1 + (intensity * 0.5); // Control pitch
    speechSynthesis.speak(utterance);
}
function startVisuals() {
  let shapeSize = 10;
  let shapeColor = 'white';
  let rotationSpeed = 0.01;
  let angle = 0;

    function animateVisuals() {
    analyser.getByteFrequencyData(dataArray);
    const averageFrequency = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const audioIntensity = calculateAudioIntensity();
        const selectedContext = contextSelect && contextSelect.value ? contextSelect.value : 'default';
        visualCtx.clearRect(0, 0, visualCanvas.width, visualCanvas.height);
      visualCtx.save();
       // Center the rotation point
    visualCtx.translate(visualCanvas.width / 2, visualCanvas.height / 2);
    visualCtx.rotate(angle);
      visualCtx.translate(-visualCanvas.width / 2, -visualCanvas.height / 2);
     // Draw visual elements based on context and theme
       switch (uiTheme) {
        case 'vibrant':
            shapeColor = `hsl(${averageFrequency}, 100%, 50%)`;
            shapeSize = 20 + (audioIntensity * 50);
            rotationSpeed = 0.005 + (audioIntensity * 0.02);
               drawVibrantPattern(visualCtx, shapeSize, shapeColor,visualCanvas.width, visualCanvas.height);
                break;
        case 'abstract':
             shapeColor =  `rgb(${Math.round(255 - (audioIntensity*255))}, ${Math.round(100 + (audioIntensity * 155))}, ${Math.round(100 + (audioIntensity * 155))})`;
            shapeSize = 10 + (audioIntensity * 50);
            rotationSpeed = 0.01 + (audioIntensity * 0.03);
            drawAbstractPattern(visualCtx, shapeSize, shapeColor,visualCanvas.width, visualCanvas.height, audioIntensity)
                break;
        case 'calm':
        default:
            shapeColor = 'rgba(255,255,255,'+ (0.5 + (audioIntensity * 0.5)) + ')';
           shapeSize = 10 + (audioIntensity * 30);
           rotationSpeed = 0.005 + (audioIntensity * 0.01);
            drawCalmPattern(visualCtx, shapeSize, shapeColor,visualCanvas.width, visualCanvas.height)
           break;
    }
     angle += rotationSpeed;
     visualCtx.restore();
        animationFrameId = requestAnimationFrame(animateVisuals);
    }

     animateVisuals();
}

function drawCalmPattern(ctx, shapeSize, shapeColor,canvasWidth, canvasHeight) {
      const centerX = canvasWidth / 2;
     const centerY = canvasHeight / 2;

    ctx.fillStyle = shapeColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, shapeSize, 0, 2 * Math.PI);
     ctx.fill();
}

function drawAbstractPattern(ctx, shapeSize, shapeColor,canvasWidth, canvasHeight, audioIntensity) {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

   ctx.fillStyle = shapeColor
    const numPoints = 5;
      const startAngle = Math.PI / 2;  // start at the top
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        const angle = startAngle + (i * 2 * Math.PI / numPoints)
        const x = centerX + Math.cos(angle) * (shapeSize + (audioIntensity*50));
        const y = centerY + Math.sin(angle) * (shapeSize + (audioIntensity*50));
       ctx.lineTo(x, y)

    }
      ctx.closePath()
        ctx.fill();
}

function drawVibrantPattern(ctx, shapeSize, shapeColor,canvasWidth, canvasHeight) {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const gridSize = Math.min(canvasWidth, canvasHeight) / 5
    ctx.fillStyle = shapeColor;
  for(let x = 0; x < canvasWidth; x += gridSize){
    for(let y = 0; y < canvasHeight; y+= gridSize){
        ctx.fillRect(x,y, shapeSize, shapeSize)
    }
  }
        }
