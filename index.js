const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

// will use 16:9 aspect ratio (1440 x 810)
canvas.width = (480*3)
canvas.height = (270*3)

//c.fillRect(0,0, canvas.width, canvas.height)

const background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png',
    scale: 1.41
})

const player = new Player({
    position:{
        x: 0,
        y: 0
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

const customers = []
const coins = []

function genCusts(){
    if(customers.length<4){
        console.log('triggered cust spawn')
        const snail = new Customer({
            position:{
                x: 200,
                y: 200
            },
            velocity: {
                x: 0,
                y: 10
            },
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
}

function genCoin(pos_x,pos_y){
        console.log('triggered coin spawn')
        const coin = new Coin({
            position:{
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

const grunt = new Enemy({
    position:{
        x: 400,
        y: 200
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
        jump:{
            imageSrc: './img/badGuy1/jump.png',
            framesMax: 1
        },
        jumpRight:{
            imageSrc: './img/badGuy1/jumpRight.png',
            framesMax: 1
        }
    }
})

startRolls(grunt, 1000, 5)

// declaring keys state 
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle= 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    grunt.update()
    genCusts()

    for(const num in customers){
        customers[num].update()
        if(customers[num].position.y > canvas.height){
            customers.splice(num, 1)
            console.log('delete cust')
        }
    }

    for(const num in coins){
        coins[num].update()
        if(coins[num].COINSTATE === "markedForDeath"){
            console.log('delete coin: ' + coins[num])
            coins.splice(num, 1)
        }
    }

    player.update()


    // Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -player.speed
        player.switchSprite('move')
        player.facing = -1
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = player.speed
        player.switchSprite('move')
        player.facing = 1
    } else {
        player.switchSprite('idle')
        player.velocity.x = 0
    }

    // Jump logic
    if (player.velocity.y<0){
        if(player.facing === 1){
            player.switchSprite('jumpRight')
            return
        }
        else if(player.facing === -1){
            player.switchSprite('jump')
        }
    } else if(player.velocity.y>0){
            player.switchSprite('idle')
        }

    // Detect Food Customer Collision
    for(const i in player.foods){
        //console.log(player.foods[i])
        var thisFood = player.foods[i]
        if(thisFood.FOODSTATE != "eaten"){
            for(const num in customers){
                var thisCust = customers[num]
                if(thisCust.eating === false){
                    if(spriteCollision ({
                        rectangle1: thisFood,
                        rectangle2: thisCust
                    })){
                        console.log("Food & Customer collision!")
                        thisCust.eat()
                        thisFood.getEaten(thisCust)
                        var pos_x = thisCust.position.x + (thisCust.width/2)
                        var pos_y = thisCust.position.y// + (thisCust.height/2)

                        // Generate coin at customer location
                        genCoin(pos_x, pos_y-40)                
                    }
                }
            }
        }
    }

    // Make Food stick to Cust if Food is eaten and Cust is eating
    for(const i in player.foods){
        var thisFood = player.foods[i]
        if(thisFood.FOODSTATE === "eaten"){
            for(const i in customers){
                var thisCust = customers[i]
                if(thisCust.eating === true){
                    if(spriteCollision ({
                        rectangle1: thisFood,
                        rectangle2: thisCust
                    })){
                        var custCenterPointX = thisCust.position.x + (thisCust.width/2)
                        var custCenterPointY = thisCust.position.y + (thisCust.height/2)
                        var foodCenterPointX = thisFood.position.x + (thisFood.width/2)
                        var foodCenterPointY = thisFood.position.y + (thisFood.height/2)
                        var xDifferential = custCenterPointX - foodCenterPointX 
                        var yDifferential = custCenterPointY - foodCenterPointY

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

    // Check if Player collides with Coins
    for(const i in coins){
        var thisCoin = coins[i]
        if(thisCoin.COINSTATE === "idle"){
            if(spriteCollision({
                rectangle1: player,
                rectangle2: thisCoin
            })){
                thisCoin.getPickedUp()
                console.log("coin picked up")
                getCoins(1)
            }
        }
    }
    // Make coin stick to Player upon pickup
    for(const i in coins){
        var thisCoin = coins[i]
        if(thisCoin.COINSTATE === "pickedUp"){

                var playerCenterPointX = player.position.x + 25
                var coinCenterPointX = thisCoin.position.x //+ (thisCoin.width/2)
                var playerCenterPointY = player.position.y
                var coinCenterPointY = thisCoin.position.y
                var xDifferential = playerCenterPointX - coinCenterPointX 
                var yDifferential = playerCenterPointY - coinCenterPointY // if positive, player below coin

                // Move food to middle of player sprite
                if(xDifferential === 0){
                    thisCoin.velocity.x = 0
                } else if(xDifferential >0){
                    thisCoin.velocity.x = 3
                } else if(xDifferential<0){
                    thisCoin.velocity.x = -3
                }

                /* laggy functiont trying to lock y
                if(yDifferential === 0){
                    thisCoin.velocity.y = 0
                } else if(yDifferential >0){
                    thisCoin.velocity.y += 1
                } else if(yDifferential<0){
                    thisCoin.velocity.y += -1
                }
                */
        }
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
            }    
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
    }
})