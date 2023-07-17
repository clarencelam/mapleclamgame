messages = []

function genTutorial(num){
    messages = []
    let tutorial = new Message({
        position:{
            x: 100,
            y: 100
        },
        imageSrc: `./img/messages1/tutorial${num}.png`,
        scale: 0.8    
    })
    messages.push(tutorial)
}

function startLevel1() {
    if (LEVEL != "LEVEL1") {
        LEVEL = "LEVEL1"
        GAMESTATE = "ACTIVE"
        decreaseTimer()
    }
    genThornBush(700, 630)
    genPlatform(220, 380)
    genPlatform(100, 380)
    genPlatform(600, 520)
    genPlatform(1100, 200)
    genPlatform(1400, 550)
    genPlatform(1400, 380)
}

function iterateTutorial(){
    if(LEVEL === "TUTORIAL_M1"){
        // messages.push(tutorial1)
        genTutorial(1)
        document.getElementById("gameWindow").addEventListener("click",(nextLevel) => {
            LEVEL = "TUTORIAL_M2"
        }, {once:true})
    }
     else if (LEVEL === "TUTORIAL_M2"){
        genTutorial(2)
        document.getElementById("gameWindow").addEventListener("click",(nextLevel)=>{
            LEVEL = "TUTORIAL_M3"
        }, {once:true})
    }
    else if (LEVEL === "TUTORIAL_M3"){
        genTutorial(3)
        document.getElementById("gameWindow").addEventListener("click", (nextLevel)=> {
            startLevel1()
                }, {once:true})
        }
}
