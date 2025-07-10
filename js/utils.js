/// UTILS: Functions that will be commonly used to support other functionality

function randomRoll(max){
    return Math.floor(Math.random()* max)
}

// NEW: Audio settings variables
let masterMuted = false
let currentMusicTrack = 'henesys'
let audioSettingsOpen = false

// MODIFIED: Update audio object to support multiple tracks
var audioTracks = {
    henesys: new Audio('music/henesys.mp3'),
    ellinia: new Audio('music/Ellinia.mp3'),
    title: new Audio('music/Title.mp3')
}
var currentAudio = audioTracks.henesys

// MODIFIED: Update playBgMusic function
function playBgMusic() {
    if (masterMuted) return
    
    // Stop current audio if playing
    pauseBgMusic()
    
    // Set current audio to selected track
    currentAudio = audioTracks[currentMusicTrack]
    currentAudio.volume = musicVolume
    currentAudio.play()
    currentAudio.loop = true
}

// MODIFIED: Update pauseBgMusic function
function pauseBgMusic(){
    for (let track in audioTracks) {
        audioTracks[track].pause()
    }
}

// MODIFIED: Update all sound effect functions to check mute status
function playTeleportSfx(){
    if (masterMuted) return
    var teleportNoise = new Audio('sfx/teleport.wav');
    teleportNoise.volume = soundVolume
    teleportNoise.play()    
}

function playWinGameSfx(){
    if (masterMuted) return
    var winNoise = new Audio('sfx/winGame.wav');
    winNoise.volume = soundVolume
    winNoise.play()    
}

function playFailSfx(){
    if (masterMuted) return
    var failNoise = new Audio('sfx/fail.wav');
    failNoise.volume = soundVolume
    failNoise.play()    
}

function playClickSfx(){
    if (masterMuted) return
    var clickNoise = new Audio('sfx/click_sfx.m4a');
    clickNoise.volume = soundVolume
    clickNoise.play()    
}

// NEW: Additional sound effect functions (add mute check to existing ones in classes.js)
function playPickupSfx(){
    if (masterMuted) return
    var pickupNoise = new Audio('sfx/pickup.wav'); // Adjust path as needed
    pickupNoise.volume = soundVolume
    pickupNoise.play()    
}

function playJumpSfx(){
    if (masterMuted) return
    var jumpNoise = new Audio('sfx/jump.wav'); // Adjust path as needed
    jumpNoise.volume = soundVolume
    jumpNoise.play()    
}

function playThrowSfx(){
    if (masterMuted) return
    var throwNoise = new Audio('sfx/throw.wav'); // Adjust path as needed
    throwNoise.volume = soundVolume
    throwNoise.play()    
}

function playGetHitSfx(){
    if (masterMuted) return
    var hitNoise = new Audio('sfx/hit1.wav'); // Adjust path as needed
    hitNoise.volume = soundVolume
    hitNoise.play()    
}

function playEatSfx(){
    if (masterMuted) return
    var eatNoise = new Audio('sfx/bite.m4a'); // Adjust path as needed
    eatNoise.volume = soundVolume
    eatNoise.play()    
}

// NEW: Audio settings functions
function toggleAudioSettings() {
    audioSettingsOpen = !audioSettingsOpen
    const panel = document.querySelector("#audioSettingsPanel")
    
    if (audioSettingsOpen) {
        panel.style.display = 'block'
        // Update UI to reflect current settings
        document.querySelector("#musicVolumeSlider").value = Math.round(musicVolume * 100)
        document.querySelector("#musicVolumeDisplay").textContent = Math.round(musicVolume * 100) + '%'
        document.querySelector("#musicTrackSelect").value = currentMusicTrack
        updateMuteButtonDisplay()
    } else {
        panel.style.display = 'none'
    }
}

function updateMusicVolume(value) {
    musicVolume = value / 100
    document.querySelector("#musicVolumeDisplay").textContent = value + '%'
    
    // Update current playing audio volume
    if (currentAudio && !masterMuted) {
        currentAudio.volume = musicVolume
    }
}

function changeMusicTrack(trackName) {
    const wasPlaying = currentAudio && !currentAudio.paused
    
    // Stop current track
    pauseBgMusic()
    
    // Update current track
    currentMusicTrack = trackName
    currentAudio = audioTracks[trackName]
    
    // Resume playing if music was playing before
    if (wasPlaying && !masterMuted) {
        playBgMusic()
    }
}

function toggleMasterMute() {
    masterMuted = !masterMuted
    
    if (masterMuted) {
        // Mute all audio
        pauseBgMusic()
    } else {
        // Unmute - resume music if it should be playing
        if (GAMESTATE === "ACTIVE" || GAMESTATE === "TUTORIAL" || GAMESTATE === "BEFORELEVEL") {
            playBgMusic()
        }
    }
    
    updateMuteButtonDisplay()
}

function updateMuteButtonDisplay() {
    const button = document.querySelector("#masterMuteButton")
    if (masterMuted) {
        button.innerHTML = "🔇 Audio Muted"
        button.style.background = "#f44336"
    } else {
        button.innerHTML = "🔊 Audio On"
        button.style.background = "#4CAF50"
    }
}

function startRolls(sprite, decisionInterval, max){
    // generate 
    // may need to revisit this later to ensure Timeout is deleted when object is removed
    function roll(){
        setTimeout(roll,decisionInterval)
        let num = Math.floor(Math.random()* max)
        sprite.movementDecision(num)
    }
    roll()
}

function spriteCollision({ rectangle1, rectangle2 }) {
    var rectangle1Height = rectangle1.height
    var rectangle1Width = rectangle1.width

    var rectangle2Height = rectangle2.height
    var rectangle2Width = rectangle2.width

    var rectangle1_x = rectangle1.position.x + rectangle1.offset_x
    var rectangle1_y = rectangle1.position.y + rectangle1.offset_y

    var rectangle2_x = rectangle2.position.x + rectangle2.offset_x
    var rectangle2_y = rectangle2.position.y + rectangle2.offset_y


    return (
        rectangle1_x + rectangle1Width >= rectangle2_x &&
        rectangle1_x <= rectangle2_x + rectangle2Width &&
        rectangle1_y + rectangle1Height >= rectangle2_y &&
        rectangle1_y <= rectangle2_y + rectangle2Height
    )
}

function decreaseTimer() {
    if (timer > 0) {
        console.log('timer increment')
        timerID = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
        console.log(timer)
    }

    if (timer === 0) {
        endLevel()
        console.log('attempt endlevel')
    }

}

function resetTimer(){
    timer = defaultTimer
    document.querySelector('#timer').innerHTML = timer
}

function resetArrays(){
    player.foods = []
    player.cookedFood = []
    messages = []
    customers = []
    enemies = []
    coins = []
    thornBushes = []
    platforms = []
    portals = []
    foodTrucks = []
}

function resetToActiveBackground(){
    background = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        imageSrc: './img/backgrounds/henebg.png',
        scale: 1.27
    })
}

// Coin cointing and iteration logic
function getCoins(value){
    coinCointer = coinCointer += value
    todaysCoins = todaysCoins += value
    document.querySelector('#coinCounter').innerHTML = `Today's Coins: ${todaysCoins}`
    document.querySelector('#totalCoinCounter').innerHTML = `Total Coins: ${coinCointer}`

}

function handleCoinPlayerInteractions() {
    for (const i in coins) {
        var thisCoin = coins[i]
        if (thisCoin.COINSTATE === "idle") {
            if (spriteCollision({
                rectangle1: player,
                rectangle2: thisCoin
            })) {
                thisCoin.getPickedUp()
                console.log("coin picked up")
                getCoins(1)
            }
        }
        else if (thisCoin.COINSTATE === "pickedUp") {
            // MODIFIED: Adjust target to player's approximate center for both X and Y
            // (Assumes player height/width ~50; adjust offsets if your player sprite differs)
            var playerCenterPointX = player.position.x + 25;  // Existing (rough center)
            var playerCenterPointY = player.position.y + 25;  // NEW: Target player's vertical center
            var coinCenterPointX = thisCoin.position.x + (thisCoin.width / 2);
            var coinCenterPointY = thisCoin.position.y + (thisCoin.height / 2);
            var xDifferential = playerCenterPointX - coinCenterPointX;
            var yDifferential = playerCenterPointY - coinCenterPointY;  // If positive, player is below coin

            // Existing: Always follow X (even during jump for immediate responsiveness)
            if (xDifferential === 0) {
                thisCoin.velocity.x = 0;
            } else if (xDifferential > 0) {
                thisCoin.velocity.x = 3;  // Move right toward player
            } else if (xDifferential < 0) {
                thisCoin.velocity.x = -3;  // Move left toward player
            }

            // NEW: Only follow Y after the initial jump is done (preserves the "big jump")
            // Use smaller velocity for smoothness (adjust 2/-2 if too fast/slow)
            if (thisCoin.initialJumpDone) {
                if (yDifferential === 0) {
                    thisCoin.velocity.y = 0;  // Stop if aligned
                } else if (yDifferential > 0) {
                    thisCoin.velocity.y = 2;  // Move down toward player (gentle speed)
                } else if (yDifferential < 0) {
                    thisCoin.velocity.y = -2;  // Move up toward player (gentle speed)
                }
            }
            // Note: No gravity is applied post-jump (due to Coin.update() changes), so Y-following works smoothly
        }
    }
}

function handleThornBushPlayerInteractions() {
    // Check if GAME OVER due to thornbush collision
    for (const i in thornBushes) {
        var thisBush = thornBushes[i];
        thisBush.update();
        if (spriteCollision({
            rectangle1: player,
            rectangle2: thisBush
        })) {
            // UPDATED: Removed game-over logic; now just logs for debugging or future effects
            // (e.g., you could add a sound or velocity change here if desired)
            console.log("Player hit bush - no game over, but collision detected");
            // Optionally: Add non-fatal effects, e.g., play a sound or reduce speed temporarily
            // playSomeSound(); // Example placeholder
        }
    }
}

// Food interaction logic
function handleFoodPlayerInteractions(){
            for(const i in player.foods){
                var thisFood = player.foods[i]

                for(const i in customers){
                    var thisCust = customers[i]
                    if(spriteCollision ({
                        rectangle1: thisFood,
                        rectangle2: thisCust
                    })){
                        var custCenterPointX = thisCust.position.x + thisCust.offset_x + (thisCust.width/2)
                        var custCenterPointY = thisCust.position.y + thisCust.offset_y + (thisCust.height/2)
                        var foodCenterPointX = thisFood.position.x + thisFood.offset_x + (thisFood.width/2)
                        var foodCenterPointY = thisFood.position.y + thisFood.offset_y + (thisFood.height/2)

                        // cust not eating, food not eaten, then eat food
                        if(thisCust.eating === false && thisFood.FOODSTATE != "eaten"){
                            console.log("Food & Customer collision!")
                            thisCust.eat()
                            thisFood.getEaten(thisCust)
                            var pos_x = thisCust.position.x + (thisCust.width/2)
                            var pos_y = thisCust.position.y// + (thisCust.height/2)
    
                        } else if(thisFood.FOODSTATE === "eaten" && thisFood.eatenBy === thisCust){
                            var xDifferential = custCenterPointX - foodCenterPointX 

                            // Move food to middle of customer sprite
                            if(xDifferential === 0){
                                thisFood.velocity.x = 0
                            } else if(xDifferential >0){
                                thisFood.velocity.x = 1
                            } else if(xDifferential<0){
                                thisFood.velocity.x = -1
                            }
                            thisFood.position.y = thisCust.position.y + 10
                            
                        }
                    }
                }
                
            }
}

// Player & Enemy interaction logic
function handleEnemyPlayerInteractions(){
    for(const i in enemies){
        thisEnemy = enemies[i]
        if(spriteCollision({
            rectangle1: thisEnemy,
            rectangle2: player
        }) && thisEnemy.isAttacking === false){
            console.log("attack")
            thisEnemy.attack()
            player.getHit(thisEnemy.facing,10)

            // Player drops coin
            var pos_x = player.position.x + (player.width/2)
            var pos_y = player.position.y
            if(todaysCoins>0){
                genCoin(pos_x, pos_y-40)  
                getCoins(-1)
            }
        }
    }
}


function handlePlatformLogic(){
        // Handle platform logic
    // Set the bottom of the map for objects to land upon
    player.bottomYCordsActive = 703 // re-apply base bottom Y coords
    player.bottomYCordsBetweeenLevels = 770 // re-apply base bottom Y coords
    for (const num in coins) {  
        coins[num].bottomYCordsActive = 690
    }
    for (const num in customers) {
        customers[num].bottomYCordsActive = 690
        customers[num].leftXBarrier = 0
        customers[num].rightXBarrier = canvas.width
    }
    for (const num in enemies) {
        enemies[num].bottomYCordsActive = 690
    }
    for (const num in player.foods) {
        player.foods[num].bottomYCordsActive = 690
    }

    for(const i in platforms){
        // if player x within platform && y above platform, player y does not go below platform y
        thisPlatform = platforms[i]
        if(
            checkPlatforms(player,thisPlatform)
        ){
            //  player y+height does not go below platform y
            player.bottomYCordsActive = thisPlatform.position.y -1
        } 
        for (const num in coins) {  
            if(checkPlatforms(coins[num],thisPlatform)
            ){
                coins[num].bottomYCordsActive = thisPlatform.position.y - 15
            }
        }    
        for (const num in customers) {  
            if(checkPlatforms(customers[num],thisPlatform)
            ){
                customers[num].bottomYCordsActive = thisPlatform.position.y -18
                // Make customer stay within border
                customers[num].leftXBarrier = thisPlatform.position.x
                customers[num].rightXBarrier = thisPlatform.position.x + thisPlatform.width
                // console.log(customers[num].position.x + customers[num].offset_x + customers[num].width)
                // console.log(thisPlatform.position.x + thisPlatform.width)
            }
        }    
        for (const num in enemies) {  
            if(checkPlatforms(enemies[num],thisPlatform)
            ){
                enemies[num].bottomYCordsActive = thisPlatform.position.y -5
            }
        }    
        for (const num in player.foods) {  
            if(checkPlatforms(player.foods[num],thisPlatform)
            ){
                player.foods[num].bottomYCordsActive = thisPlatform.position.y - 10
            }
        }    
    }
}

function genFoodTruck(x, y) {
    const foodTruck = new FoodTruck(
        {
            position: {
                x: x,
                y: y

            },
            imageSrc: './img/npcs/shop.png',
            scale: 0.65
        }
    )
    foodTrucks.push(foodTruck)
}

function genPortal(x, y) {
    const portal = new Portal(
        {
            position: {
                x: x,
                y: y

            },
            imageSrc: './img/portal/portalsprite.png',
            scale: 1,
        }
    )
    portals.push(portal)
}


// Generate platform
function genPlatform(x, y) {
    const platform = new Platform({
        position: {
            x: x,
            y: y
        },
        imageSrc: './img/platforms/platform1.png',
        scale: 1.3
    })
    platforms.push(platform)
}


// Generate thornbush
function genThornBush(x, y) {
    const thornbush = new Thornbush({
        position: {
            x: x,
            y: y
        },
        imageSrc: './img/thorns1.png',
        scale: 0.15
    })
    thornBushes.push(thornbush)
}

// Generate Coins
function genCoin(pos_x, pos_y) {
    console.log('triggered coin spawn')
    const coin = new Coin({
        position: {
            x: pos_x,
            y: pos_y
        },
        velocity: {
            x: 0,
            y: -6
        },
        imageSrc: './img/money/coin.png',
        scale: 1,
        framesMax: 4,
    })
    coins.push(coin)
}


// Generate customer object
function genCust(x, y) {
    console.log('triggered cust spawn')
    const snail = new Customer({
        position: {
            x: x,
            y: y
        },
        velocity: {
            x: 0,
            y: 10
        },
        type:'green',
        imageSrc: './img/greenSnail/idle.png',
        scale: 1.4,
        framesMax: 1,
        sprites: {
            idle: {
                imageSrc: './img/greenSnail/idle.png',
                framesMax: 1
            },
            walk: {
                imageSrc: './img/greenSnail/walk.png',
                framesMax: 5
            },
            idleRight: {
                imageSrc: './img/greenSnail/idleRight.png',
                framesMax: 1
            },
            walkRight: {
                imageSrc: './img/greenSnail/walkRight.png',
                framesMax: 5
            },
        }
    })
    customers.push(snail)
    startRolls(snail, 3500, 3)
}

function genBlueSnail(x, y) {
    console.log('triggered blueSnail spawn')
    const snail = new Customer({
        position: {
            x: x,
            y: y
        },
        velocity: {
            x: 0,
            y: 10
        },
        type:'blue',
        imageSrc: './img/blueSnail/blueSnailIdle.png',
        scale: 1.4,
        framesMax: 1,
        sprites: {
            idle: {
                imageSrc: './img/blueSnail/blueSnailIdle.png',
                framesMax: 1
            },
            idleRight: {
                imageSrc: './img/blueSnail/blueSnailIdleRight.png',
                framesMax: 1
            },
            walk: {
                imageSrc: './img/blueSnail/blueSnailWalk.png',
                framesMax: 4
            },
            walkRight: {
                imageSrc: './img/blueSnail/blueSnailWalkRight.png',
                framesMax: 4
            },
            hit: {
                imageSrc: './img/blueSnail/blueSnailHit.png',
                framesMax: 1
            },
            hitRight: {
                imageSrc: './img/blueSnail/blueSnailHitRight.png',
                framesMax: 1
            },
            die: {
                imageSrc: './img/blueSnail/blueSnailDie.png',
                framesMax: 3
            },
            dieRight: {
                imageSrc: './img/blueSnail/blueSnailDieRight.png',
                framesMax: 3
            },
        }
    })
    customers.push(snail)
    startRolls(snail, 3500, 3)
}

// Generate grunt
function genGrunt(x, y) {
    const grunt = new Enemy({
        position: {
            x: x,
            y: y
        },
        velocity: {
            x: 0,
            y: 10
        },
        imageSrc: './img/badGuy1/idle.png',
        scale: 1.4,
        framesMax: 6,
        sprites: {
            idle: {
                imageSrc: './img/badGuy1/idle.png',
                framesMax: 6
            },
            idleRight: {
                imageSrc: './img/badGuy1/idleRight.png',
                framesMax: 6
            },
            walk: {
                imageSrc: './img/badGuy1/walk.png',
                framesMax: 4
            },
            walkRight: {
                imageSrc: './img/badGuy1/walkRight.png',
                framesMax: 4
            },
            jump: {
                imageSrc: './img/badGuy1/jump.png',
                framesMax: 1
            },
            jumpRight: {
                imageSrc: './img/badGuy1/jumpRight.png',
                framesMax: 1
            },
            attack: {
                imageSrc: './img/badGuy1/attack.png',
                framesMax: 6
            },
            attackRight: {
                imageSrc: './img/badGuy1/attackRight.png',
                framesMax: 6
            }
        }
    })
    enemies.push(grunt)
    startRolls(grunt, 1000, 5)
}