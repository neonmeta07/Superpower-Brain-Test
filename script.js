// Audio Context Setup
let audioContext;
let audioInitialized = false;
const ambientSound = document.getElementById('ambient-sound');
const buttonSound = document.getElementById('button-sound');
const alertSound = document.getElementById('alert-sound');
const completeSound = document.getElementById('complete-sound');

// Initialize audio on user interaction
function initAudio() {
    if (!audioInitialized) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        ambientSound.volume = 0.3;
        buttonSound.volume = 0.5;
        alertSound.volume = 0.6;
        completeSound.volume = 0.5;
        ambientSound.play();
        audioInitialized = true;
    }
}

// Parallax Effect
function handleParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed');
            const yPos = -(scrollY * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Quiz Data
const quizQuestions = [
    {
        question: "When faced with an unexpected crisis, you typically:",
        answers: [
            "Analyze all available data before making a decision",
            "Trust your instincts and act quickly",
            "Consult with others to get different perspectives",
            "Look for creative solutions others might miss"
        ]
    },
    {
        question: "Which ability would you find most useful in daily life?",
        answers: [
            "Predicting likely outcomes of different choices",
            "Influencing others' emotions and thoughts",
            "Manipulating physical objects with your mind",
            "Perceiving patterns invisible to most people"
        ]
    },
    {
        question: "In a team setting, you naturally take on the role of:",
        answers: [
            "The strategist who plans several steps ahead",
            "The mediator who resolves conflicts",
            "The innovator who proposes unconventional ideas",
            "The executor who gets things done efficiently"
        ]
    },
    {
        question: "Your dreams are often characterized by:",
        answers: [
            "Vivid colors and impossible physics",
            "Revisiting past events with new perspectives",
            "Solving complex problems or puzzles",
            "Interacting with strange entities or forces"
        ]
    },
    {
        question: "When learning something new, you prefer to:",
        answers: [
            "Understand the underlying principles and theory",
            "Jump in and learn through hands-on experience",
            "Watch others demonstrate before trying yourself",
            "Find connections to things you already know"
        ]
    },
    {
        question: "Which scenario would make you feel most energized?",
        answers: [
            "Solving a complex logical puzzle no one else could crack",
            "Helping someone through an emotional crisis",
            "Creating something beautiful or meaningful",
            "Discovering a hidden truth or pattern"
        ]
    },
    {
        question: "Under extreme pressure, you've sometimes experienced:",
        answers: [
            "Time seeming to slow down around you",
            "Unusual clarity of thought and heightened focus",
            "A surge of physical strength or endurance",
            "Intuitive insights that later proved accurate"
        ]
    },
    {
        question: "If you could instantly master one skill, you'd choose:",
        answers: [
            "Understanding and speaking all languages",
            "Perfect recall of everything you've ever experienced",
            "The ability to read subtle body language and micro-expressions",
            "Rapid learning and adaptation to any situation"
        ]
    }
];

// Track user responses and metrics
let userResponses = [];
let reactionTimes = [];
let miniGameScore = 0;

// Power profiles based on answers
const powerProfiles = {
    chaosEngine: 0,
    timeBender: 0,
    mindWeaver: 0,
    energyConduit: 0
};

// Results based on dominant power
const resultProfiles = {
    chaosEngine: {
        title: "CHAOS ENGINE",
        description: "Your mind thrives on disorder, finding patterns where others see randomness. You instinctively understand complex systems and can predict cascading effects that others miss. Your neural pathways form unconventional connections, allowing you to solve problems through unexpected approaches."
    },
    timeBender: {
        title: "TIME BENDER",
        description: "Your perception of time is uniquely fluid. In critical moments, your neural processing accelerates, making the world appear to slow down. This gives you exceptional reaction time and decision-making abilities under pressure. You instinctively understand timing and sequence in ways others cannot grasp."
    },
    mindWeaver: {
        title: "MIND WEAVER",
        description: "Your brain exhibits unusual empathic resonance patterns. You naturally sense others' emotional states and can influence social dynamics through subtle cues. Your mirror neurons are hyperactive, giving you an uncanny ability to understand others' perspectives and anticipate their thoughts."
    },
    energyConduit: {
        title: "ENERGY CONDUIT",
        description: "Your nervous system processes and channels energy with remarkable efficiency. You can maintain intense focus for extended periods and rapidly recover from mental fatigue. Your brain's unusual electromagnetic patterns allow you to sense and direct energy in ways science cannot yet explain."
    }
};

// Current question index
let currentQuestionIndex = 0;

// DOM Elements
const introScreen = document.getElementById('intro-screen');
const questionContainer = document.getElementById('question-container');
const minigameScreen = document.getElementById('minigame-screen');
const resultsScreen = document.getElementById('results-screen');
const startTestButton = document.getElementById('start-test');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const questionTextElement = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const emergencyButton = document.getElementById('emergency-button');
const timerProgress = document.getElementById('timer-progress');
const resultTitle = document.getElementById('result-title');
const resultDescription = document.getElementById('result-description');
const shareResultButton = document.getElementById('share-result');
const restartTestButton = document.getElementById('restart-test');
const shareOverlay = document.getElementById('share-overlay');
const closeShareButton = document.getElementById('close-share');
const shareResultTitle = document.getElementById('share-result-title');
const sharePowerBreakdown = document.getElementById('share-power-breakdown');
const downloadResultButton = document.getElementById('download-result');
const copyResultButton = document.getElementById('copy-result');

// Lab equipment interaction
const panelButtons = document.querySelectorAll('.panel-button');

// Initialize the quiz
function initQuiz() {
    // Set up event listeners
    startTestButton.addEventListener('click', startQuiz);
    restartTestButton.addEventListener('click', restartQuiz);
    shareResultButton.addEventListener('click', showShareOverlay);
    closeShareButton.addEventListener('click', hideShareOverlay);
    downloadResultButton.addEventListener('click', downloadResult);
    copyResultButton.addEventListener('click', copyResultLink);

    // Set up lab equipment interaction
    panelButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.style.boxShadow = `0 0 20px ${getComputedStyle(button).backgroundColor}`;
            setTimeout(() => {
                button.style.boxShadow = '';
            }, 500);
            playButtonSound();
        });
    });

    // Initialize parallax effect
    handleParallax();

    // Show intro screen
    showScreen(introScreen);

    // Update total questions
    totalQuestionsElement.textContent = quizQuestions.length;
}

// Start the quiz
function startQuiz() {
    initAudio();
    playButtonSound();
    userResponses = [];
    reactionTimes = [];
    currentQuestionIndex = 0;
    resetPowerProfiles();
    showScreen(questionContainer);
    loadQuestion();
}

// Restart the quiz
function restartQuiz() {
    playButtonSound();
    showScreen(introScreen);
}

// Load a question
function loadQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    questionTextElement.textContent = question.question;
    currentQuestionElement.textContent = currentQuestionIndex + 1;

    // Clear previous answers
    answersContainer.innerHTML = '';

    // Record start time for reaction time measurement
    const startTime = Date.now();

    // Create answer options
    question.answers.forEach((answer, index) => {
        const answerElement = document.createElement('div');
        answerElement.classList.add('answer-option');
        answerElement.textContent = answer;
        answerElement.dataset.index = index;

        answerElement.addEventListener('click', () => {
            // Calculate reaction time
            const endTime = Date.now();
            const reactionTime = endTime - startTime;
            reactionTimes.push(reactionTime);

            // Record response
            userResponses.push(index);

            // Highlight selected answer
            document.querySelectorAll('.answer-option').forEach(option => {
                option.classList.remove('selected');
            });
            answerElement.classList.add('selected');

            playButtonSound();

            // Move to next question or mini-game after delay
            setTimeout(() => {
                if (currentQuestionIndex === Math.floor(quizQuestions.length / 2) - 1) {
                    // Show mini-game at halfway point
                    startMiniGame();
                } else if (currentQuestionIndex < quizQuestions.length - 1) {
                    // Move to next question
                    currentQuestionIndex++;
                    loadQuestion();
                } else {
                    // Show results
                    calculateResults();
                }
            }, 800);
        });

        answersContainer.appendChild(answerElement);
    });
}

// Start the mini-game
function startMiniGame() {
    showScreen(minigameScreen);
    playAlertSound();

    let taps = 0;
    let timeLeft = 100;
    let gameInterval;

    // Reset timer bar
    timerProgress.style.width = '100%';

    // Set up emergency button
    emergencyButton.addEventListener('click', handleEmergencyTap);

    function handleEmergencyTap() {
        taps++;
        emergencyButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            emergencyButton.style.transform = 'scale(1)';
        }, 100);

        // Random position changes
        const randomX = Math.random() * 40 - 20; // -20px to +20px
        const randomY = Math.random() * 40 - 20; // -20px to +20px
        emergencyButton.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.95)`;

        playButtonSound();
    }

    // Start game timer
    gameInterval = setInterval(() => {
        timeLeft -= 1;
        timerProgress.style.width = `${timeLeft}%`;

        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            emergencyButton.removeEventListener('click', handleEmergencyTap);

            // Calculate score based on taps
            miniGameScore = taps;

            // Continue with quiz
            currentQuestionIndex++;
            showScreen(questionContainer);
            loadQuestion();
        }
    }, 50);
}

// Calculate quiz results
function calculateResults() {
    // Process answers to calculate power profile
    userResponses.forEach((response, index) => {
        // Different questions affect different powers
        switch (index % 4) {
            case 0:
                powerProfiles.chaosEngine += response === 0 || response === 3 ? 2 : 1;
                break;
            case 1:
                powerProfiles.timeBender += response === 1 || response === 0 ? 2 : 1;
                break;
            case 2:
                powerProfiles.mindWeaver += response === 2 || response === 1 ? 2 : 1;
                break;
            case 3:
                powerProfiles.energyConduit += response === 3 || response === 2 ? 2 : 1;
                break;
        }
    });

    // Factor in reaction times
    const avgReactionTime = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
    if (avgReactionTime < 1500) {
        powerProfiles.timeBender += 3;
    } else if (avgReactionTime < 2500) {
        powerProfiles.chaosEngine += 2;
    } else if (avgReactionTime < 3500) {
        powerProfiles.mindWeaver += 2;
    } else {
        powerProfiles.energyConduit += 2;
    }

    // Factor in mini-game score
    if (miniGameScore > 30) {
        powerProfiles.timeBender += 3;
        powerProfiles.energyConduit += 2;
    } else if (miniGameScore > 20) {
        powerProfiles.chaosEngine += 2;
        powerProfiles.timeBender += 1;
    } else if (miniGameScore > 10) {
        powerProfiles.mindWeaver += 2;
        powerProfiles.chaosEngine += 1;
    } else {
        powerProfiles.energyConduit += 1;
        powerProfiles.mindWeaver += 1;
    }

    // Normalize to percentages
    const total = Object.values(powerProfiles).reduce((sum, value) => sum + value, 0);
    const normalizedProfiles = {};

    for (const [key, value] of Object.entries(powerProfiles)) {
        normalizedProfiles[key] = Math.round((value / total) * 100);
    }

    // Find dominant power
    let dominantPower = Object.keys(normalizedProfiles).reduce((a, b) =>
        normalizedProfiles[a] > normalizedProfiles[b] ? a : b
    );

    // Update result elements
    resultTitle.textContent = resultProfiles[dominantPower].title;
    resultDescription.textContent = resultProfiles[dominantPower].description;

    // Update power bars with animation
    document.getElementById('power-1').style.width = `${normalizedProfiles.chaosEngine}%`;
    document.getElementById('power-1-percent').textContent = `${normalizedProfiles.chaosEngine}%`;

    document.getElementById('power-2').style.width = `${normalizedProfiles.timeBender}%`;
    document.getElementById('power-2-percent').textContent = `${normalizedProfiles.timeBender}%`;

    document.getElementById('power-3').style.width = `${normalizedProfiles.mindWeaver}%`;
    document.getElementById('power-3-percent').textContent = `${normalizedProfiles.mindWeaver}%`;

    document.getElementById('power-4').style.width = `${normalizedProfiles.energyConduit}%`;
    document.getElementById('power-4-percent').textContent = `${normalizedProfiles.energyConduit}%`;

    // Update brain regions based on power profiles
    updateBrainRegions(normalizedProfiles);

    // Prepare share content
    shareResultTitle.textContent = resultProfiles[dominantPower].title;
    sharePowerBreakdown.textContent = `${normalizedProfiles.chaosEngine}% Chaos Engine | ${normalizedProfiles.timeBender}% Time Bender | ${normalizedProfiles.mindWeaver}% Mind Weaver | ${normalizedProfiles.energyConduit}% Energy Conduit`;

    // Show results screen
    showScreen(resultsScreen);
    playCompleteSound();
}

// Update brain regions visualization
function updateBrainRegions(profiles) {
    document.getElementById('region-1').style.opacity = profiles.chaosEngine / 100;
    document.getElementById('region-2').style.opacity = profiles.timeBender / 100;
    document.getElementById('region-3').style.opacity = profiles.mindWeaver / 100;
    document.getElementById('region-4').style.opacity = profiles.energyConduit / 100;

    document.getElementById('region-1').style.filter = `blur(${5 - profiles.chaosEngine / 25}px)`;
    document.getElementById('region-2').style.filter = `blur(${5 - profiles.timeBender / 25}px)`;
    document.getElementById('region-3').style.filter = `blur(${5 - profiles.mindWeaver / 25}px)`;
    document.getElementById('region-4').style.filter = `blur(${5 - profiles.energyConduit / 25}px)`;
}

// Reset power profiles
function resetPowerProfiles() {
    for (const key in powerProfiles) {
        powerProfiles[key] = 0;
    }
}

// Show share overlay
function showShareOverlay() {
    shareOverlay.classList.add('active');
    playButtonSound();
}

// Hide share overlay
function hideShareOverlay() {
    shareOverlay.classList.remove('active');
    playButtonSound();
}

// Download result as image
function downloadResult() {
    // In a real implementation, this would use html2canvas or similar
    // to capture the share content as an image
    alert('In a full implementation, this would download your results as an image!');
    playButtonSound();
}

// Copy result link
function copyResultLink() {
    // In a real implementation, this would generate a shareable link
    alert('In a full implementation, this would copy a shareable link to your results!');
    playButtonSound();
}

// Helper function to show a screen and hide others
function showScreen(screenToShow) {
    const screens = [introScreen, questionContainer, minigameScreen, resultsScreen];
    screens.forEach(screen => {
        if (screen === screenToShow) {
            screen.classList.add('active');
        } else {
            screen.classList.remove('active');
        }
    });
}

// Sound functions
function playButtonSound() {
    if (audioInitialized) {
        buttonSound.currentTime = 0;
        buttonSound.play();
    }
}

function playAlertSound() {
    if (audioInitialized) {
        alertSound.currentTime = 0;
        alertSound.play();
    }
}

function playCompleteSound() {
    if (audioInitialized) {
        completeSound.currentTime = 0;
        completeSound.play();
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initQuiz);

// Create placeholder audio files for demo purposes
function createPlaceholderAudio() {
    // This function would normally not be needed in a real implementation
    // It's just here to make the demo work without actual audio files
    const audioElements = [ambientSound, buttonSound, alertSound, completeSound];

    audioElements.forEach(audio => {
        if (!audio.src) {
            // Create a silent audio context
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const dst = oscillator.connect(ctx.createMediaStreamDestination());
            oscillator.start();

            // Create a silent audio track
            const mediaRecorder = new MediaRecorder(dst.stream);
            mediaRecorder.start();

            setTimeout(function() {
                mediaRecorder.requestData();
                mediaRecorder.stop();
            }, 100);

            mediaRecorder.ondataavailable = function(evt) {
                const blob = new Blob([evt.data], { type: 'audio/ogg' });
                audio.src = URL.createObjectURL(blob);
            };
        }
    });
}

// Call this function to create placeholder audio
createPlaceholderAudio();