/// UTILS: Functions that will be commonly used to support other functionality

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

timer = 5

function endLevel() {
    if (GAMESTATE === "ACTIVE") {
        GAMESTATE = "INACTIVE"
        console.log("end level activated")

        messages = []
        let daySummary = new Message({
            position: {
                x: 250,
                y: 200
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: 0.8
        })
        messages.push(daySummary)

        document.querySelector("#levelEnd").style.display = 'flex'

        // WIN CASE
        if (todaysCoins >= minimumCoins) {
            // press space to go to betweenLevels state
            if (todaysCoins > minimumCoins) {
                document.querySelector("#levelEnd").innerHTML = `Your day is complete!<br><br>You made an incredible ${todaysCoins} mesos today!<br><br>We'll pay you out the ${todaysCoins - minimumCoins} extra mesos<br><br>Good work. See you tomorrow.`
            } else if (todaysCoins === minimumCoins) {
                document.querySelector("#levelEnd").innerHTML = `Your day is complete!<br><br>You made ${todaysCoins} mesos for the restaurant today.<br><br>${minimumCoins} mesos goes to us, so sorry-- nothing for you to take home tonight<br><br>Unfortunately work unions aren't big on maple island... better luck tomorrow.`
            }
            window.addEventListener('click', () => {
                    goBetweenLevels()
                    console.log('win gohome triggered')
            }, { once: true })

        } else {
            // LOSS CASE
            document.querySelector("#levelEnd").innerHTML = `You made ${todaysCoins} mesos from your shift today. The minimum was ${minimumCoins}.<br><br>You're fired.`
        }
    }
}

function goBetweenLevels(){
    console.log("GAMESTATE CHANGE: GOING INBETWEEN LEVELS")
    // clear objects
    document.querySelector("#levelEnd").style.display = 'none'
    messages = []
    customers = []
    enemies = []
    coins = []
    thornBushes = []
    platforms = []

    // background = home (upgrade room), with portal to next level
    background = new Sprite({
        position:{
            x: 0,
            y: 0
        },
        imageSrc: './img/backgrounds/home.png',
        scale: .57
    })
    }

function startLevel(){
    // make Gamestate = active
    // increment level
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
    }

}

