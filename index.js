const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

// will use 16:9 aspect ratio (1440 x 810)
canvas.width = (480*3)
canvas.height = (270*3)

//c.fillRect(0,0, canvas.width, canvas.height)


var background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './img/backgrounds/henebg.png',
    scale: 1.27
})

// DEFINE PLAYER
var player = new Player({
    position:{
        x: 50,
        y: 10
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
})

var customers = []
var enemies = []
var coins = []
var thornBushes = []
var platforms = []
var portals = []
var foodTrucks = []


// declaring keys state 
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowDown:{
        pressed: false
    },
    space:{
        pressed: false
    }
}

// DECLARE STARTING GAMESTATE & LEVEL
// GAMESTATES DETERMINE WHAT GAME FUNCTIONALITY IS ACTIVE
// LEVEL DETERMINES WHAT MESSAGES ARE SHOWN ON THE SCREEN, CORRESPONDING TO EACH "STAGE" OF THE GAME
let GAMESTATE = "STARTSCREEN"
let LEVEL = "STARTSCREEN"
// FOR TESTING: 
// let GAMESTATE = "TUTORIAL"
// let LEVEL = "TUTORIAL_M7"

let soundVolume = 0.7
let musicVolume = 0.4

function checkPlatforms(object,platform){
    return(
        object.position.x + object.offset_x >= platform.position.x &&
        object.position.x + object.offset_x + object.width <= platform.position.x + platform.width &&
        object.position.y + object.offset_y + object.height <= platform.position.y
    )
}

if (document.querySelector('#levelCounter')) {
    document.querySelector('#levelCounter').innerHTML = `Level: ${typeof LEVEL === 'number' ? LEVEL : 1}`;
}

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle= 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()

    handlePlatformLogic()

    // HANDLING GAMESTATES
    //
    //
    if(GAMESTATE === "STARTSCREEN"){
        handleStartScreen()
    }
    if(GAMESTATE === "INACTIVE" || GAMESTATE === "TUTORIAL"){
        if(GAMESTATE === "TUTORIAL"){
            handleTutorial()
            handleCoinPlayerInteractions()
            handleFoodPlayerInteractions()
        }
        if (GAMESTATE === "INACTIVE") { // this gamestate is triggered when a level ends, after level summary is shown, but before going to BETEWEENLEVELS
            if (keys.space.pressed && todaysCoins >= minimumCoins) {
                incrementLevel()
                goBetweenLevels() // go to gamestate === BETWEENLEVELS
            } else{
                //gameover
                console.log("game over")
            }
        }
        // DRAW/UPDATE SELECT OBJECTS
        for(const i in foodTrucks){
            foodTrucks[i].update()
        }
        for (const i in platforms){
            platforms[i].update()
        }
        for (const num in customers) {
            customers[num].update()
        }
        for (const num in coins) {  
            coins[num].update()
            if (coins[num].COINSTATE === "markedForDeath") {
                console.log('delete coin: ' + coins[num])
                coins.splice(num, 1)
            }
        }
        for (const i in enemies) {
            enemies[i].update()
        }
        player.update()

        for(const i in messages){
            messages[i].update()
        }
    }

    if(GAMESTATE === "BEFORELEVEL"){
        // DRAW/UPDATE SELECT OBJECTS
        for (const i in portals) {
            portals[i].update()
        }
        for(const i in foodTrucks){
            foodTrucks[i].update()
        }
        for (const i in platforms){
            platforms[i].update()
        }
        for (const num in customers) {
            customers[num].update()
        }
        for (const num in coins) {  
            coins[num].update()
        }
        for (const i in enemies) {
            enemies[i].update()
        }

        for(const i in messages){
            messages[i].update()
        }
        
        player.update()

        if(portals.length>0){
            if(spriteCollision({rectangle1: player, rectangle2: portals[0]}) && keys.ArrowDown.pressed){
                goBetweenLevels()
                keys.ArrowDown.pressed = false
                console.log("go back to GAMESTATE = 'BETWEENLEVELS'")
            }
        }


        // If the player is over the foodtruck, give interaction prompt to start level
        if(spriteCollision({rectangle1: player, rectangle2: foodTrucks[0]})){
            if(player.interacting === false){
                // enable 'space' to open start-level dialogue 
                player.potentialInteraction = true
                if(keys.space.pressed){
                    player.interacting = true
                    keys.space.pressed = false
                    
                    let beforeLevelSummary = new Message({
                        position: {
                            x: 370,
                            y: 30
                        },
                        imageSrc: `./img/messages1/messageTemplate.png`,
                        scale: 0.55
                    })
                    messages.push(beforeLevelSummary)            
                    document.querySelector("#beforeLevel").style.display = 'flex'
                }    
            } else if(player.interacting === true){
                // 'space' to close dialogue & start level
                if(keys.space.pressed){
                    player.interacting = false
                    player.potentialInteraction = false
                    keys.space.pressed = false
                    
                    GAMESTATE = "ACTIVE"
                    document.querySelector("#beforeLevel").style.display = 'none'
                    messages = []
                    decreaseTimer()   
                }    
            }
        } else{
            player.potentialInteraction = false
        }

    }
    
    // HANDLING "BETWEENLEVELS" GAMESTATE 
    // Character is in "home screen"
    if(GAMESTATE === "BETWEENLEVELS"){
        for (const i in portals) {
            portals[i].update()
        }
        player.update()
        for(const i in messages){
            messages[i].update()
        }    
        if(spriteCollision({rectangle1: player,
        rectangle2: portals[0]}) && keys.ArrowDown.pressed){
            // iterate levels
            console.log("go to nextlevel")
            keys.ArrowDown.pressed = false
            nextLevel()
        }

    }
    
    // HANDLING "ACTIVE" GAMESTATE
    if(GAMESTATE === "ACTIVE"){

        // UPDATE ALL OBJECTS
        for(const i in messages){
            messages[i].update()
        }

        for(const i in foodTrucks){
            foodTrucks[i].update()
        }

        for (const i in platforms){
            platforms[i].update()
        }
         for (const num in customers) {
            customers[num].update()
            if (customers[num].position.y > canvas.height) {
                customers.splice(num, 1)
                console.log('delete cust')
            }
        }
        for (const num in coins) {  // Update Coins, splice those MarkedForDeath
            coins[num].update()
            if (coins[num].COINSTATE === "markedForDeath") {
                console.log('delete coin: ' + coins[num])
                coins.splice(num, 1)
            }
        }
        for (const i in enemies) {
            enemies[i].update()
        }
        player.update()

    // DYNAMIC SPAWNS - adjust based on level
    if(customers.length < Math.min(10 + Math.floor(levelCounter / 2), 15)){ // Gradually increase customer count
        let x = Math.floor(Math.random()* canvas.width)
        genCust(x, 200)
    }

    // Enemy spawning handled in level generation, but maintain minimum
    const minEnemies = Math.floor(levelCounter / 3) + 1
    if(enemies.length < minEnemies){
        let x = Math.floor(Math.random()* canvas.width)
        // Ensure enemy doesn't spawn too close to player
        if (Math.abs(x - player.position.x) > 300) {
            genGrunt(x, 200)
        }
    }
            

        // Check if GAME OVER due to thornbush collision
        handleThornBushPlayerInteractions() // defined in utils.js

        // Detect Food Customer Collision
        // Make Food stick to Cust if Food is eaten and Cust is eating 
        handleFoodPlayerInteractions() // defined in utils.js
    
        // Check if Player collides with Coins
        // Make coin stick to Player upon pickup 
        handleCoinPlayerInteractions() // defined in utils.js

        handleEnemyPlayerInteractions()


    }
}

animate()

// Key listeners
window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'd':
                case 'ArrowRight':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                case 'ArrowLeft':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                case 'ArrowUp':
                player.jump()
                break
            case ' ':
                player.throw()
                keys.space.pressed = true
                break
            case 'ArrowDown':
                keys.ArrowDown.pressed = true
                break
            }    
            event.preventDefault()
    }
)

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            case 'ArrowRight':
            keys.d.pressed = false
            break
        case 'a':
            case 'ArrowLeft':
            keys.a.pressed = false
            break    
        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            break
        case ' ':
            keys.space.pressed = false
            break

    }
})