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
