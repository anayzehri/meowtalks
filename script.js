const TRANSLATION_MESSAGES = {
    hungry: {
        meow1: { text: "Likely indicating hunger. Is their food bowl empty or are they anticipating a meal?", confidence: 85, frequencyRange: [200, 400], intensity: 0.7, duration: 0.5, bodyLanguageHint: "May rub against your legs or lead you to the food bowl." },
        meow2: { text: "Stronger indication of hunger. Consider the time of day and their feeding schedule.", confidence: 70, frequencyRange: [250, 450], intensity: 0.8, duration: 0.8, bodyLanguageHint: "May be more persistent and vocal." },
        meow3: { text: "Possibly a demand for food. Evaluate if you've recently fed them or if they are seeking attention in this context.", confidence: 60, frequencyRange: [300, 500], intensity: 0.5, duration: 0.3, bodyLanguageHint: "May stare intently at you or the food area." },
        meow4: { text: "High probability of hunger. Ensure they have access to fresh water as well.", confidence: 90, frequencyRange: [350, 550], intensity: 0.9, duration: 0.7, bodyLanguageHint: "May vocalize near their food storage or usual feeding spot." },
        meow5: { text: "Could be a plea for a treat or a small snack. Be mindful of overfeeding.", confidence: 50, frequencyRange: [300, 500], intensity: 0.4, duration: 0.6, bodyLanguageHint: "May look expectantly at you." },
    },
    affection: {
        purr1: { text: "Expressing contentment and seeking social interaction. This is a good sign!", confidence: 90, frequencyRange: [25, 150], intensity: 0.3, duration: 2, bodyLanguageHint: "Often accompanied by rubbing, kneading, or slow blinks." },
        purr2: { text: "Enjoying the attention. Continue with gentle petting if they seem receptive.", confidence: 75, frequencyRange: [50, 120], intensity: 0.4, duration: 1.5, bodyLanguageHint: "Ears are likely forward, and their body may be relaxed." },
        purr3: { text: "Appreciating the interaction. Observe their body language for signs of overstimulation.", confidence: 65, frequencyRange: [60, 130], intensity: 0.5, duration: 1.2, bodyLanguageHint: "Tail is usually still or gently swaying." },
        purr4: { text: "Likely enjoying chin or head scratches, areas where they can't groom themselves easily.", confidence: 80, frequencyRange: [30, 100], intensity: 0.4, duration: 1.3, bodyLanguageHint: "May lean into your touch." },
        purr5: { text: "Feeling comfortable in your presence. This indicates a level of trust.", confidence: 50, frequencyRange: [70, 140], intensity: 0.3, duration: 1.1, bodyLanguageHint: "May be relaxed and even dozing off." },
    },
    play: {
        meow1: { text: "Excited and ready to play! Offer an appropriate toy.", confidence: 80, frequencyRange: [500, 700], intensity: 0.7, duration: 0.5, bodyLanguageHint: "Pupils may be dilated, and they might be in a play crouch." },
        meow2: { text: "Engaged in play. Ensure the play is appropriate and not aggressive.", confidence: 70, frequencyRange: [600, 800], intensity: 0.6, duration: 0.7, bodyLanguageHint: "May pounce, chase, or bat at toys." },
        meow3: { text: "Seeking interaction through play. This is important for their physical and mental well-being.", confidence: 60, frequencyRange: [550, 750], intensity: 0.8, duration: 0.6, bodyLanguageHint: "May bring you a toy or tap your leg." },
        meow4: { text: "Expressing energy and a desire for physical activity. Provide opportunities for exercise.", confidence: 90, frequencyRange: [650, 850], intensity: 0.9, duration: 0.4, bodyLanguageHint: "May exhibit zoomies or playful swats." },
        meow5: { text: "Focused on a 'prey' object. Allow them to engage in natural hunting behaviors.", confidence: 80, frequencyRange: [450, 650], intensity: 0.7, duration: 0.5, bodyLanguageHint: "May stalk, chase, or bat at a toy or object." },
    },
    demand: {
        meow1: { text: "Strongly requesting access or attention. Consider what they might want at this location.", confidence: 95, frequencyRange: [800, 1000], intensity: 0.9, duration: 0.5, bodyLanguageHint: "May scratch at the door or look back at you expectantly." },
        meow2: { text: "Seeking your immediate attention. Try to understand the context – are they bored, anxious, or needing something?", confidence: 80, frequencyRange: [900, 1100], intensity: 0.8, duration: 0.7, bodyLanguageHint: "May weave through your legs or meow persistently." },
        meow3: { text: "Expressing frustration or impatience. Assess the situation to understand the cause of their demand.", confidence: 65, frequencyRange: [700, 900], intensity: 0.7, duration: 0.6, bodyLanguageHint: "May have a tense posture or flicking tail." },
        meow4: { text: "Persistently seeking something. Be careful not to inadvertently reinforce unwanted demanding behaviors.", confidence: 90, frequencyRange: [850, 1050], intensity: 0.9, duration: 0.8, bodyLanguageHint: "May vocalize loudly and frequently." },
        meow5: { text: "A very insistent demand. If this is unusual, consider if there's an urgent need (e.g., needing the litter box).", confidence: 90, frequencyRange: [750, 950], intensity: 0.9, duration: 0.4, bodyLanguageHint: "May display agitated behavior." },
    },
    warning: {
        hiss1: { text: "Clear sign of fear, aggression, or defensiveness. Give them space immediately.", confidence: 90, frequencyRange: [1000, 1200], intensity: 0.9, duration: 0.3, bodyLanguageHint: "Ears flattened, back arched, fur standing on end." },
        hiss2: { text: "Expressing displeasure and a desire for the interaction to stop. Withdraw your attention.", confidence: 80, frequencyRange: [900, 1100], intensity: 0.8, duration: 0.5, bodyLanguageHint: "May be accompanied by growling or showing teeth." },
        hiss3: { text: "Protecting their territory or resources. Identify and address potential stressors.", confidence: 70, frequencyRange: [1100, 1300], intensity: 0.7, duration: 0.6, bodyLanguageHint: "May stare intensely at the perceived threat." },
        hiss4: { text: "Feeling threatened. Avoid further interaction and allow them to calm down.", confidence: 85, frequencyRange: [1050, 1250], intensity: 0.85, duration: 0.4, bodyLanguageHint: "Body may be tense and low to the ground." },
        hiss5: { text: "Extremely agitated and likely to act defensively. Do not approach.", confidence: 95, frequencyRange: [950, 1150], intensity: 0.95, duration: 0.4, bodyLanguageHint: "May be crouched and ready to strike or flee." }
    },
    default: {
        meow1: { text: "General communication. The meaning is unclear without more context. Observe their surroundings and body language.", confidence: 50, frequencyRange: [400, 600], intensity: 0.4, duration: 0.4, bodyLanguageHint: "Pay attention to their posture, ear position, and tail movements." },
    },
};

const CAT_FACTS = [
    "A cat's purr vibrates at a frequency of 25 to 150 Hertz, which research suggests can promote tissue regeneration and healing.",
    "Cats primarily use meows to communicate with humans. They communicate with other cats mainly through scent, body language, and hisses/growls.",
    "The average cat sleeps around 12-16 hours per day. This is a natural behavior related to their predatory instincts.",
    "Cats have a third eyelid (nictitating membrane) that helps keep their eyes moist and protected. Its visibility can sometimes indicate health issues.",
    "A cat can jump up to six times its height. This impressive ability is due to their strong leg muscles and flexible spine.",
    "Cats can rotate their ears 180 degrees, allowing them to pinpoint the source of sounds with great accuracy.",
    "The tapetum lucidum, a reflective layer behind a cat's retina, enhances their night vision.",
    "A cat's nose print is unique, just like a human fingerprint.",
    "Whiskers (vibrissae) are crucial for a cat's spatial awareness, helping them navigate tight spaces and sense changes in air currents.",
    "The domestication of cats is believed to have started around 9,500 years ago, likely due to their ability to control rodent populations.",
    "Polydactyly, the condition of having extra toes, is a genetic trait found in some cat populations.",
    "Kneading, a behavior often displayed by happy cats, is thought to be a remnant of kittenhood when they knead their mother to stimulate milk flow. It can also be a way to mark territory with scent glands in their paws.",
];
const LISTENING_MESSAGES = [
    "Listening intently...",
    "Analyzing feline vocalizations...",
    "Tuning into cat frequencies...",
    "Processing meows and purrs...",
    "Detecting subtle vocal nuances...",
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

// Aura Element
const mainElement = document.querySelector('main');
let auraShape;

let listeningMessageIndex = 0;
let listeningInterval;
let animationFrameId;
// audio variables
let audioStream;
let audioContext;
let analyser;
let dataArray;
let isRecording = false;
let currentContext = 'default';
let audioIntensity = 0;

recordBtn.addEventListener("click", toggleRecording);
contextSelect.addEventListener('change', handleContextChange)
function handleContextChange(e) {
    currentContext = e.target.value;
}

async function toggleRecording() {
    if(!isRecording){
         startRecording();
    }
    else {
        stopRecording()
    }

}

async function startRecording() {
     isRecording = true;
    recordBtn.classList.add("recording");
    listeningIndicator.classList.add("listening");
    translationOutput.classList.remove("show");
    catFactDiv.classList.remove("show");
    analysisMessageDiv.classList.remove("show");
    confidenceLevelDiv.classList.remove("show");
    waveformCanvas.classList.remove("active");
    analysisMessageDiv.classList.remove("animate")
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
     analysisMessageDiv.classList.add("show");
     analysisMessageDiv.textContent = ANALYSIS_MESSAGES[0];
    analysisMessageDiv.classList.add("animate");
    waveformCanvas.classList.add("active");
      drawWaveform(); // Start drawing the waveform
        if(!auraShape){
         createAura() // create the aura element
        }

    setTimeout(stopRecording, 2000);

}
function stopRecording() {
     isRecording = false;
    recordBtn.classList.remove("recording");
    waveformCanvas.classList.remove("active");
    analysisMessageDiv.classList.remove("show");
     analysisMessageDiv.classList.remove("animate")
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
        translationOutput.textContent = "No clear cat vocalization detected. Try again, ensuring the microphone is close to your cat.";
        translationOutput.classList.add("show");
    }
     removeAura()
}

function cycleListeningMessages() {
    listeningMessageIndex = (listeningMessageIndex + 1) % LISTENING_MESSAGES.length;
    listeningIndicator.textContent = LISTENING_MESSAGES[listeningMessageIndex];
}

function displayTranslation() {
     audioIntensity = calculateAudioIntensity(); // Get the average audio data
  const translation = getTranslationBasedOnContextAndIntensity(currentContext, audioIntensity);
  translationOutput.textContent = translation.text;
  confidenceLevelDiv.textContent = `Likelihood: ${translation.confidence}%  ${translation.bodyLanguageHint ? 'Hint: ' + translation.bodyLanguageHint : ''}`; // Display confidence and body language hint
  translationOutput.classList.add("show");
  confidenceLevelDiv.classList.add("show");
  speakTranslation(translation.text, audioIntensity); // Pass in the audio intensity to manipulate sound
    animateAura(audioIntensity, currentContext);
}

function calculateAudioIntensity() {
  analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (const amplitude of dataArray) {
        sum += Math.abs(amplitude - 128);
    }
    return sum / (dataArray.length * 128);
}

function getTranslationBasedOnContextAndIntensity(context, intensity) {
    const messages = TRANSLATION_MESSAGES[context];
    if (!messages) {
        return TRANSLATION_MESSAGES.default.meow1; // Fallback
    }

    // Sort messages by confidence (you could also incorporate frequency/duration analysis here for more accuracy)
    const sortedMessages = Object.values(messages).sort((a, b) => b.confidence - a.confidence);

    // Select a translation based on intensity (you can adjust these thresholds)
    if (intensity > 0.75) {
        return sortedMessages[0]; // High intensity, likely the most confident message
    } else if (intensity > 0.4) {
        return sortedMessages[1] || sortedMessages[0]; // Medium intensity
    } else {
        return sortedMessages[2] || sortedMessages[1] || sortedMessages[0]; // Lower intensity
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
// ----- Aura Element Functionality ----------
function createAura() {
  auraShape = document.createElement('div')
  auraShape.classList.add("aura-shape", "circle") //default class
  mainElement.appendChild(auraShape)

}
function animateAura(intensity, context) {
    if(!auraShape) return;
    // Determine shape based on context
     let shapeClass = 'circle';
    switch (context) {
         case 'hungry':
             shapeClass = 'square';
             break;
        case 'affection':
             shapeClass = 'circle';
             break;
        case 'play':
              shapeClass = 'star';
             break;
        case 'demand':
            shapeClass = 'triangle';
            break;
        case 'warning':
             shapeClass = 'triangle';
           break;
    }
     auraShape.classList.remove("circle","square","star","triangle");
    auraShape.classList.add('aura-shape', shapeClass);

  //Animate based on intensity
     auraShape.style.transform = `translate(-50%, -50%) scale(${1 + (intensity * 0.4)})`; // scale up on audio
  auraShape.style.opacity = 0.2 + (intensity*0.8);
    auraShape.style.animation = 'pulse 1s'; //set animation for a brief time.
      setTimeout(() => {
        auraShape.style.animation = '';
    }, 1000);

}
function removeAura(){
  if(auraShape) {
      mainElement.removeChild(auraShape);
      auraShape = null
  }

}
