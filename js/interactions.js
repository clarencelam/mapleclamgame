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

            var playerCenterPointX = player.position.x + 25
            var coinCenterPointX = thisCoin.position.x //+ (thisCoin.width/2)
            var playerCenterPointY = player.position.y
            var coinCenterPointY = thisCoin.position.y
            var xDifferential = playerCenterPointX - coinCenterPointX
            var yDifferential = playerCenterPointY - coinCenterPointY // if positive, player below coin

            // Move food to middle of player sprite
            if (xDifferential === 0) {
                thisCoin.velocity.x = 0
            } else if (xDifferential > 0) {
                thisCoin.velocity.x = 3
            } else if (xDifferential < 0) {
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

function handleThornBushPlayerInteractions(){
            // Check if GAME OVER due to thornbush collision
            for(const i in thornBushes){
                var thisBush = thornBushes[i]
                thisBush.update()
                if(spriteCollision({
                    rectangle1: player,
                    rectangle2: thisBush
                })){
                    // GAME OVER!
                    playFailSfx()
                    console.log("player hit bush")
                    coinCointer = 0
                    GAMESTATE = "GAMEOVER"
                    document.querySelector("#displayText").style.display = 'flex'
                    document.querySelector("#displayText").innerHTML = "GAME OVER"
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
    
                            // Generate coin at customer location
                            genCoin(pos_x, pos_y-40)                    
                        } else if(thisCust.eating === true && thisFood.FOODSTATE === "eaten"){
                            thisCust.velocity.x = 0 // stop the cust x movement
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