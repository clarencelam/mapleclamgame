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
    var rectangle1Height = rectangle1.image.height * rectangle1.scale
    var rectangle1Width = rectangle1.image.width * rectangle1.scale / rectangle1.framesMax

    var rectangle2Height = rectangle2.image.height * rectangle2.scale
    var rectangle2Width = rectangle2.image.width * rectangle2.scale / rectangle2.framesMax

    return (
        rectangle1.position.x + rectangle1Width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2Width &&
        rectangle1.position.y + rectangle1Height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2Height
    )
}

let coinCointer = 0

function getCoins(value){
    coinCointer = coinCointer += value
    document.querySelector('#coinCounter').innerHTML = coinCointer
}

