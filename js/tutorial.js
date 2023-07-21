messages = []

function genTutorial(num) {
    messages = []
    if (num === 1) {
        let msg1 = new Message({
            position: {
                x: 260,
                y: 30
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: .8
        })
        messages.push(msg1)
        document.querySelector("#tutorialMsg").innerHTML = "Hey... Hey new guy! <br><br>Get over here!"
        document.querySelector("#tutorialMsg").style.display = 'flex'
    } else if (num === 2) {
        let msg2 = new Message({
            position: {
                x: 260,
                y: 30
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: .8
        })
        messages.push(msg2)
        document.querySelector("#tutorialMsg").innerHTML = "First day hey? Let me show you the ropes<br><br>Your job is to serve food to the animals of Maple Island.<br><br>We've got to move around and sell food to pay our rent."
        document.querySelector("#tutorialMsg").style.display = 'flex'
    } else if (num === 3) {
        let msg3 = new Message({
            position: {
                x: 260,
                y: 30
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: .8
        })
        messages.push(msg3)
        document.querySelector("#tutorialMsg").innerHTML = "See that food on the top left?<br><br>It's your job to serve it to our hungry Maple monsters.<br><br>You do that with the SPACEBAR."
        document.querySelector("#tutorialMsg").style.display = 'flex'
    } else if (num === 4) {
        let msg4 = new Message({
            position: {
                x: 260,
                y: 30
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: .8
        })
        if (customers.length < 1) {
            genCust(200, 200)
        }
        messages.push(msg4)
        document.querySelector("#tutorialMsg").innerHTML = "Hey, there's our first customer.<br><br>This is a great time to practice.<br><br>Try serving him with SPACEBAR, and come back!"
        document.querySelector("#tutorialMsg").style.display = 'flex'
    } else if (num === 5) {
        let msg5 = new Message({
            position: {
                x: 260,
                y: 30
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: .8
        })
        messages.push(msg5)
        document.querySelector("#tutorialMsg").innerHTML = "Good job.<br><br>We're just about to open for the day, so get ready.<br><br>Oh, forgot to mention...<br><br>Touching thorns is GAME OVER<br><br>And be careful for bandits roaming Maple Island..."
        document.querySelector("#tutorialMsg").style.display = 'flex'
    }
}

function startLevel1() {
    if (LEVEL != 1) {
        LEVEL = 1
        genLevel()
        GAMESTATE = "ACTIVE"
        decreaseTimer()
    }
}

function handleTutorial() {
    if (LEVEL === "TUTORIAL_M1") {
        if (foodTrucks.length < 1) {
            genLevel()
            genTutorial(1)
            document.getElementById("gameWindow").addEventListener("click", (nextLevel) => {
                messages = []
                LEVEL = "TUTORIAL_M2"
                document.querySelector("#tutorialMsg").style.display = 'none'
            }, { once: true })
        }
    }
    else if (LEVEL === "TUTORIAL_M2") {
        if (spriteCollision({ rectangle1: player, rectangle2: foodTrucks[0] })) {
            genTutorial(2)
        } else {
            messages = []
            document.querySelector("#tutorialMsg").style.display = 'none'
        }
        document.getElementById("gameWindow").addEventListener("click", (nextLevel) => {
            LEVEL = "TUTORIAL_M3"
        }, { once: true })
    }
    else if (LEVEL === "TUTORIAL_M3") {
        if (spriteCollision({ rectangle1: player, rectangle2: foodTrucks[0] })) {
            genTutorial(3)
        } else {
            messages = []
            document.querySelector("#tutorialMsg").style.display = 'none'
        }
        document.getElementById("gameWindow").addEventListener("click", (nextLevel) => {
            LEVEL = "TUTORIAL_M4"
        }, { once: true })
    }
    else if (LEVEL === "TUTORIAL_M4") {
        if (spriteCollision({ rectangle1: player, rectangle2: foodTrucks[0] })) {
            genTutorial(4)
        } else {
            messages = []
            document.querySelector("#tutorialMsg").style.display = 'none'
        }
        if (todaysCoins === 1) {
            LEVEL = "TUTORIAL_M5"
        }

    } else if (LEVEL === "TUTORIAL_M5") {
        if (spriteCollision({ rectangle1: player, rectangle2: foodTrucks[0] })) {
            genTutorial(5)
        } else {
            messages = []
            document.querySelector("#tutorialMsg").style.display = 'none'
        }
        document.getElementById("gameWindow").addEventListener("click", (nextLevel) => {
            startLevel1()
            messages = []
            document.querySelector("#tutorialMsg").style.display = 'none'
        }, { once: true })
    }

}
