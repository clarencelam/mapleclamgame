let coinCointer = 0
let todaysCoins = 0
const defaultMinimumCoins = 1
let minimumCoins = 1
levelCoinChange = 0
const defaultTimer = 12
let day = 1
let playerlives = 10
let levelCounter = 1  //  Track current level number

// NEW: Tutorial state tracking
let tutorialStep = 0
let tutorialCompleted = false
let tutorialTimer = 0
let tutorialStepCompleted = false

// LEVEL ITERATION FUNCTIONS
function genLevel() {
    console.log("Generating Level: " + LEVEL)
    if (LEVEL === 1) {
        genFoodTruck(800, 532)
        genPlatform(220, 380)
        genPlatform(100, 380)
        genPlatform(600, 520)
        playBgMusic()

        // NEW: Check if tutorial should start
        if (!tutorialCompleted) {
            GAMESTATE = "TUTORIAL"
            initializeTutorial()
        } else {
            resetTimer()
            GAMESTATE = "ACTIVE"
            decreaseTimer()
        }
    } else {
        // NEW: Dynamic level generation for levels 2+
        generateDynamicLevel()
    }
}

// NEW: Initialize tutorial system
function initializeTutorial() {
    tutorialStep = 0
    tutorialStepCompleted = false

    // Don't start the game timer during tutorial
    timer = defaultTimer
    document.querySelector('#timer').innerHTML = timer
    
    // Show tutorial UI
    document.querySelector("#tutorialMsg").style.display = 'flex'
    document.querySelector("#tutorialTextbox").style.display = 'flex'
    
    // Start first tutorial step
    showTutorialStep()
}

// NEW: Display current tutorial step
function showTutorialStep() {
    tutorialStepCompleted = false
    // tutorialTimer = 0
    let tutorialMessage = ""
    let tutorialTextbox = ""
    let custGenerated = false

    console.log("cust generated? " + custGenerated)
    switch(tutorialStep) {
        case 0:
            tutorialMessage = "Welcome to Maple Restaurant!"
            tutorialTextbox = "Use A/D or Arrow Keys to move left and right. Try moving around!"
            break
        case 1:
            tutorialMessage = "Great! Now let's learn about jumping."
            tutorialTextbox = "Press W or Up Arrow to jump. Try jumping around the platforms!"
            break
        case 2:
            tutorialMessage = "Excellent! Now let's learn about cooking."
            tutorialTextbox = "Watch the apples on the top left. They are cooked automatically. Once they're ready, press SPACEBAR to throw food!"
            break
        case 3:
            tutorialMessage = "Nice throwing! Now let's learn about customers."
            tutorialTextbox = "Green snails are customers. Feed them by throwing food at them to earn coins!"
            // Spawn a customer for tutorial
            if (custGenerated === false) {
                genCust(400, 200)
                custGenerated = true
            }
            break
        case 4:
            tutorialMessage = "Great! You fed a customer and earned a coin!"
            tutorialTextbox = "Walk over coins to collect them. Coins are your main currency!"
            break
        case 5:
            tutorialMessage = "Perfect! Now we're almost ready to start your mission."
            tutorialTextbox = "Go ahead and walk to the foodtruck for a briefing."
            break
        case 6:
            tutorialMessage = "Here's your mission: Collect coins, survive enemies, get upgrades, and reach the highest level possible! Press SPACEBAR to start the game!"
            tutorialTextbox = "After each level, you'll see a portal appear. Go into the portal with SPACEBAR to get upgrades! GOOD LUCK!"
            break
    }
    
    document.querySelector("#tutorialMsg").innerHTML = tutorialMessage
    document.querySelector("#tutorialTextbox").innerHTML = tutorialTextbox
}

// NEW: Check tutorial progress
function checkTutorialProgress() {
    // if (tutorialStepCompleted) return
    switch(tutorialStep) {
        case 0: // Movement
            if (keys.a.pressed || keys.d.pressed) {
                tutorialStepCompleted = true
            }
            break
        case 1: // Jumping
            if (player.jumping) {
                tutorialStepCompleted = true
            }
            break
        case 2: // Cooking
            if (player.foods.length > 0) {
                tutorialStepCompleted = true
            }
            break
        case 3: // Feeding customers
            if (customers.length === 0) {
                tutorialStepCompleted = true
            }
            break
        case 4: // Collecting coins (check if any coin was picked up)
            if (coins.length === 0 && todaysCoins > 0) {
                tutorialStepCompleted = true
            }
            break
        case 5: // Interacting with food truck
            if (spriteCollision({rectangle1: player, rectangle2: foodTrucks[0]})) {
                tutorialStepCompleted = true
            }
            break
        case 6: // Final step
            if (spriteCollision({rectangle1: player, rectangle2: foodTrucks[0]}) && keys.space.pressed) {
                completeTutorial()
                return
            }
            break
    }
    
    // Progress to next step
    if (tutorialStepCompleted) {
            tutorialStep++
            showTutorialStep()
        
    }
}

function completeTutorial() {
    tutorialCompleted = true
    GAMESTATE = "ACTIVE"
    LEVEL = 1

    // Hide tutorial UI
    document.querySelector("#tutorialMsg").style.display = 'none'
    document.querySelector("#tutorialTextbox").style.display = 'none'
    
    // Start the actual game timer
    resetTimer()
    decreaseTimer()
        player.interacting = false
        player.potentialInteraction = false

    keys.space.pressed = false
    // Spawn one Blue Snail on Level 1 (post-tutorial)
    genBlueSnail(600, 200)

    console.log("TUTORIAL COMPLETE")
}


// NEW: Dynamic level generation function
function generateDynamicLevel() {
    player.position.x = 100
    player.position.y = 100
    
    genFoodTruck(800, 532)
        
    // Generate platforms with variety but ensure accessibility
    generateAccessiblePlatforms()
    }


// NEW: Generate platforms that are accessible to the player
function generateAccessiblePlatforms() {
    const maxJumpHeight = 180 // Player's max jump reach
    const floorY = 703 // player.bottomYCordsActive
    const minPlatformY = 200 // Don't generate platforms too high
    const platformWidth = 215 // Standard platform width
    
    // Always generate some low platforms for basic navigation
    const basePlatforms = Math.floor(Math.random() * 3) + 2 // 2-4 base platforms
    for (let i = 0; i < basePlatforms; i++) {
        const x = Math.random() * (canvas.width - platformWidth)
        const y = Math.random() * 200 + 430 // Between y=430-630
        genPlatform(x, y)
    }
    
    // Generate connected platform chains (ensuring accessibility)
    const chainCount = Math.floor(Math.random() * 2) + 1 // 1-2 chains
    for (let chain = 0; chain < chainCount; chain++) {
        generatePlatformChain()
    }
}
// NEW: Generate a chain of connected platforms
function generatePlatformChain() {
    const maxJumpHeight = 180
    const maxJumpDistance = 200 // Horizontal jump distance
    const platformWidth = 215
    const chainLength = Math.floor(Math.random() * 4) + 2 // 2-5 platforms per chain
    
    // Start position for the chain
    let currentX = Math.random() * (canvas.width - chainLength * maxJumpDistance)
    let currentY = Math.random() * 300 + 250 // Between y=250-550
    
    for (let i = 0; i < chainLength; i++) {
        genPlatform(currentX, currentY)
        
        // Calculate next platform position (within jump range)
        if (i < chainLength - 1) {
            const nextX = currentX + (Math.random() * maxJumpDistance) + 50 // Move right
            const nextY = currentY + (Math.random() * maxJumpHeight * 2) - maxJumpHeight // Can go up or down
            
            // Ensure next platform is within bounds and accessible
            currentX = Math.max(0, Math.min(canvas.width - platformWidth, nextX))
            currentY = Math.max(200, Math.min(600, nextY)) // Keep within reasonable bounds
        }
    }
}

function nextLevel() {
    // In this state, mushroom is in the next level map, but game is not yet active until they interact with the foodstand
    if (GAMESTATE === 'BETWEENLEVELS') {
        // background update
        resetToActiveBackground()
        
        playTeleportSfx()

        // initiate objects
        resetArrays()

        genLevel()
        if (timerID) {
            clearTimeout(timerID);
        }    
        resetTimer()
        genPortal(1300, 525)

        // show active game ui, suppress inbetween game ui
        document.querySelector("#nextLevel").style.display = 'none'
        toShow = ["#coinCounter", "#timer", "#cookingTotal", "#totalCoinCounter"]
        for (let i in toShow) {
            document.querySelector(`${toShow[i]}`).style.display = 'inline'
        }
    
        if (levelCoinChange === 0) {
            document.querySelector("#beforeLevel").innerHTML = `Welcome to day ${day} of the restaurant biz! <br><br>Rent's stayed the same! <br><br>We'll need ${minimumCoins} mesos to get through the day!`
        } else {
            document.querySelector("#beforeLevel").innerHTML = `Welcome to day ${day} of the restaurant biz! <br><br>Rent's gone up... <br><br>We'll need ${minimumCoins} mesos to get through the day!`
        }
        GAMESTATE = "BEFORELEVEL"
        player.position.x = 1350
        player.position.y = 500

    }
}


function goBetweenLevels() {
    // In this state, mushroom is at home, resting between levels
    // Function called after the conclusion of a successful level, after summary screen
    console.log("GAMESTATE CHANGE: GOING INBETWEEN LEVELS")
    GAMESTATE = "BETWEENLEVELS"
    // New: Automatically show upgrade menu in BETWEENLEVELS
    showUpgradeMenu();

    // play sound effect
    playTeleportSfx()

    // clear objects
    toHide = ["#coinCounter", "#timer", "#levelEnd", "#cookingTotal"]
    for (let i in toHide) {
        document.querySelector(`${toHide[i]}`).style.display = 'none'
    }
    todaysCoins = 0
    document.querySelector('#coinCounter').innerHTML = `Today's Coins: ${todaysCoins}`
    resetArrays()

    // background = home (upgrade room), with portal to next level
    background = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        imageSrc: './img/backgrounds/home.png',
        scale: .57
    })
    genPortal(120, 600)
    player.position.x = 130
    player.position.y = 600

}

function incrementLevel() {
    // increment level difficulty
    // Called in GAMESTATE = INACTIVE when player closes summary screen
    minimumCoins = minimumCoins + levelCoinChange
    console.log("Current level: " + LEVEL + " - Level coin requirement increase: " + levelCoinChange + ", for a total of: " + minimumCoins)

    LEVEL += 1
    day += 1
    levelCounter += 1 

    // Update level counter UI
    if (document.querySelector('#levelCounter')) {
        document.querySelector('#levelCounter').innerHTML = `Level: ${levelCounter}`
    }
}

function handleStartScreen(){
    background = new Sprite({
        position:{
            x: 150,
            y: 0
        },
        imageSrc: './img/backgrounds/login.jpeg',
        scale: .8
    })
    background.update()

    // put dark overlay over login screen
    c.globalAlpha = 0.6
    c.fillStyle = "black"
    c.fillRect(0,0,canvas.width,canvas.height)

    // "Press SPACEBAR to start game"
    c.globalAlpha = 1
    c.font = "40px Arial";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText(
      "Press SPACEBAR to start game",
      canvas.width / 2,
      canvas.height / 2 + 50
    );
    
    if(keys.space.pressed){
        GAMESTATE = "TUTORIAL"
        c.globalAlpha = 1
        keys.space.pressed = false
        LEVEL = 1
        messages = []
        document.querySelector("#tutorialMsg").style.display = 'none'
        player.interacting = false
        player.potentialInteraction = false
        genLevel()
        resetToActiveBackground()
        }
}


function endLevel() {
    // triggered by TIMER === 0
    if (GAMESTATE === "ACTIVE") {
        determineWinLoss()
    }
}
function determineWinLoss() {
    // STATE WHERE DAY SUMMARY IS SHOWN, RIGHT BEFORE BETWEENLEVELS
        console.log("show win/loss message")

        GAMESTATE = "INACTIVE"

        messages = []
        let daySummary = new Message({
            position: {
                x: 250,
                y: 50
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: 0.8
        })
        messages.push(daySummary)
        document.querySelector("#levelEnd").style.display = 'flex'
        document.querySelector("#levelEnd").style.left = `${daySummary.position.x + 100}` + 'px'
        document.querySelector("#levelEnd").style.top = `${daySummary.position.y + 100}` + 'px'

        if (todaysCoins > minimumCoins) {
            playWinGameSfx()
            document.querySelector("#levelEnd").innerHTML = `That's a wrap for day ${day}!<br><br>You made an incredible ${todaysCoins} mesos today!<br><br>${minimumCoins} mesos goes to us, so you'll bring home ${todaysCoins - minimumCoins} extra.<br><br>Good work. See you tomorrow.`
        } else if (todaysCoins === minimumCoins) {
            playWinGameSfx()
            document.querySelector("#levelEnd").innerHTML = `Day ${day} is complete!<br><br>You made ${todaysCoins} mesos for the restaurant today.<br><br>${minimumCoins} mesos goes to us, so sorry-- nothing for you to take home tonight<br><br>Unfortunately work unions aren't big on maple island... better luck tomorrow.`
        }else {
            // LOSS CASE
            playFailSfx()
            document.querySelector("#levelEnd").innerHTML = `You made ${todaysCoins} mesos from your shift today. The minimum was ${minimumCoins}.<br><br>It's been a good ${day} days with you, but... <br><br>You're fired. Refresh to try again!`
        }
}


function restartGame() {
    timer = defaultTimer;
    console.log("reset pressed");


    // hide and show appropriate HTML elements
    document.querySelector("#levelEnd").style.display = 'none';
    toShow = ["#coinCounter", "#timer", "#cookingTotal", "#livesCounter", "#levelCounter"];
    for (let i in toShow) {
        document.querySelector(`${toShow[i]}`).style.display = 'inline';
    }
    pauseBgMusic();
    resetToActiveBackground();

        // New: Reset upgrade-related properties
        player.maxJumps = 1;
        player.jumpCount = 0;
        player.hasDoubleJump = false;
        player.speedLevel = 0;
        player.speed = 3;  // Reset to default
    
    // DEFINE PLAYER
    player = new Player({
        position: {
            x: 1200,
            y: 620
        },
        velocity: {
            x: 0,
            y: 10
        },
        imageSrc: './img/player/idle.png',
        scale: 1.4,
        framesMax: 4,
        sprites: {
            idle: {
                imageSrc: './img/player/idle.png',
                framesMax: 4
            },
            idleRight: {
                imageSrc: './img/player/idleRight.png',
                framesMax: 4
            },
            move: {
                imageSrc: './img/player/move.png',
                framesMax: 6
            },
            moveRight: {
                imageSrc: './img/player/moveRight.png',
                framesMax: 6
            },
            jump: {
                imageSrc: './img/player/jump.png',
                framesMax: 1
            },
            jumpRight: {
                imageSrc: './img/player/jumpRight.png',
                framesMax: 1
            },
        }
    });

    // NEW: Reset lives and update UI
    player.lives = playerlives;
    if (document.querySelector('#livesCounter')) {
        document.querySelector('#livesCounter').innerHTML = `Lives: ${player.lives}`;
    }

    coinCointer = 0;
    todaysCoins = 0;
    minimumCoins = defaultMinimumCoins;
    day = 1;
    levelCounter = 1; 

    // NEW: Reset tutorial state
    tutorialStep = 0
    tutorialCompleted = false
    tutorialStepCompleted = false
    tutorialTimer = 0
    document.querySelector("#tutorialMsg").style.display = 'none'
    document.querySelector("#tutorialTextbox").style.display = 'none'

    // Update level counter UI
    if (document.querySelector('#levelCounter')) {
        document.querySelector('#levelCounter').innerHTML = `Level: ${levelCounter}`
    }

    resetArrays();
    hideUpgradeMenu()
    
    GAMESTATE = "STARTSCREEN";
        // Clear the existing timer to prevent it from continuing
    if (timerID) {
        clearTimeout(timerID);
    }

}
