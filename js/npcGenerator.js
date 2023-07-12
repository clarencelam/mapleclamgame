// Generate platform
function genPlatform(x, y){
    const platform = new Platform({
        position:{
            x: x,
            y: y
        },
        imageSrc: './img/platforms/platform1.png',
        scale: 1.3
    })    
    platforms.push(platform)
}


// Generate thornbush
function genThornBush(x, y){
    const thornbush = new Thornbush({
        position:{
            x: x,
            y: y
        },
        imageSrc: './img/thorns1.png',
        scale: 0.15
    })    
    thornBushes.push(thornbush)
}

// Generate Coins
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


// Generate customer object
function genCust(x,y){
    console.log('triggered cust spawn')
    const snail = new Customer({
        position:{
            x: x,
            y: y
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

// Generate grunt
function genGrunt(x,y){
    const grunt = new Enemy({
        position:{
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
            jump:{
                imageSrc: './img/badGuy1/jump.png',
                framesMax: 1
            },
            jumpRight:{
                imageSrc: './img/badGuy1/jumpRight.png',
                framesMax: 1
            },
            attack:{
                imageSrc: './img/badGuy1/attack.png',
                framesMax: 6
            },
            attackRight:{
                imageSrc: './img/badGuy1/attackRight.png',
                framesMax: 6
            }
        }
    })
    enemies.push(grunt)
    startRolls(grunt, 1000, 5)
}