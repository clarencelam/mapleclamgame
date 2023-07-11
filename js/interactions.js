// Coin cointing and iteration logic
let coinCointer = 0

function getCoins(value){
    coinCointer = coinCointer += value
    document.querySelector('#coinCounter').innerHTML = coinCointer
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
                
                // Detect Food Customer Collision
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
                // Make Food stick to Cust if Food is eaten and Cust is eating
                else if(thisFood.FOODSTATE === "eaten"){
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
}