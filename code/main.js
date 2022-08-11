import kaboom from "kaboom"

kaboom({
    background: [0, 100, 150]
})
var quest
var quest_done = true
var quests = ["Fall into the void", "Open a chest", "Get 10 loot", "Jump 10 Times"]
var next_quests = [["Fall into the void", "Open a chest", "Get 10 loot", "Jump 10 Times"],["Open 2 chests","Get 20 loot","Find the mystery box"],["Use TNT","Touch the bed","Jump 20 times"]]
var loot = 0
var chest_open = 0
var tnt = 2
loadSprite("grass", "sprites/grass.png")
loadSound("boom", "sounds/boom.wav");
loadSprite("quests", "sprites/quests.png");
loadSprite("dirt", "sprites/dirt.png")
loadSprite("campfire", "sprites/campfire.png");
loadSprite("grass2", "sprites/grass2.png");
loadSprite("bush", "sprites/bush.png");
loadSprite("support", "sprites/support.png");
loadSprite("mosswall", "sprites/mosswall.png");
loadSprite("wall", "sprites/wall.png");
loadSprite("chest", "sprites/chest.png");
loadSprite("bed", "sprites/bed.png");
loadSprite("golddirt", "sprites/golddirt.png");
loadSprite("mysterybox", "sprites/mysterybox.png");
loadSprite("shovel", "sprites/shovel.png");
loadSprite("tnt", "sprites/tnt.png");
loadSprite("bean", "sprites/bean4.png", {
    sliceX: 15,
    anims: {
        "idle": {
            from: 0,
            to: 10,
            speed: 10,
            loop: true,
        },
        "jump": {
            from: 12,
            to: 14,
            speed: 50,
            loop: false,
        },
    },
})
var SPEED = 320
var JUMP = 700
var GRAVITY = 1500
const FALL_DEATH = 2400
var level = 0
var jump = 1
layers([
    "game",
    "ui",
], "game")


const LEVELS = [
    [
        "========  m    b    bm            ====",
        "xx     x===============         ==xxxx",
        "xx      xxxxxxxxxxxxxxx         xxxxxx",
        "xx          xxxxx",
        "xx",
        "xxmqo^bm                      m  cmb ",
        "xx======/       c =12112/     = ======",
        "xxxxxxxx       ===xxxxxx",
        "xx   xxxc    ==xxxxxx",
        "x      x= ===xxxxx",
        "        ",

    ],
    [
        "",
        "",
        "m mmb         === m",
        "======       xxxx=====        ",
        "xxxx",
        "                          ?  ",
        "       mbc              c=====",
        "cqo ======   112211   ===xxxxx== c",
        "====xx                          ===",
        "",
    ],
    [
        "",
        "cqo      m",
        "=2211212==/",
        "x1/    2xx",
        "x1     1xxc ===",
        "x1c - c2xx==xxx== ",
        "x1112221xx        ==",
        "xxxxxxxxxxc   mm b",
        "xxxxxxxxxx=============",
    ],
]
scene("game", ({ levelIdx }) => {
    gravity(GRAVITY)
    addLevel(LEVELS[levelIdx || 0], {
        width: 64,
        height: 64,
        "=": () => [
            sprite("grass"),
            area(),
            solid(),
            origin("botleft"),
            "dirt",
            "tntyes",
        ],
        "q": () => [
            sprite("quests"),
            area({ height: 50 }),
            solid(),
            origin("botleft"),
            "questbox"
        ],
        "o": () => [
            scale(0.9),
            sprite("bean"),
            area({ height: 64, width: 64 }),
            solid(),
            body(),
            origin("botleft"),
            "bean",
            "tntyes",
        ],
        "x": () => [
            sprite("dirt"),
            area(),
            solid(),
            origin("botleft"),
            "dirt",
            "tntyes",
        ],
        "m": () => [
            sprite("grass2"),
            area(),
            origin("botleft"),
            "grass",
            "tntyes",
        ],
        "b": () => [
            sprite("bush"),
            area(),
            origin("botleft"),
            "grass",
            "tntyes",
        ],
        "/": () => [
            sprite("support"),
            solid(),
            area({ height: 6 }),
            origin("botleft"),
            "tntyes",
        ],
        "c": () => [
            sprite("chest"),
            area({ height: 40, width: 55 }),
            solid(),
            origin("botleft"),
            "chest"
        ],
        "^": () => [
            sprite("campfire"),
            area({ height: 10 }),
            solid(),
            origin("botleft"),
            "tntyes",
        ],
        "1": () => [
            sprite("wall"),
            area(),
            solid(),
            origin("botleft"),
            "tntyes",
        ],
        "2": () => [
            sprite("mosswall"),
            area(),
            solid(),
            origin("botleft"),
            "tntyes",
        ],
        "?": () => [
            sprite("mysterybox"),
            area({ height: 50 }),
            solid(),
            origin("botleft"),
            "box"
        ],
        "-": () => [
            sprite("bed"),
            area({ height: 20 }),
            solid(),
            origin("botleft"),
            "bed",
        ],
    })
    const bean = get("bean")[0]
    const questbox = get("questbox")[0]
    if (level != LEVELS.length - 1) {
        bean.play("idle")
    }
    questbox.onClick(() => {
        debug.log("Welcome to the Quest Box")
        console.log(quests)
        if (quests.length == 0){
            debug.log("You have done all the quest you have now been move to the next level")
            if (levelIdx < LEVELS.length - 1) {
                level += 1
                jump = 0
                quests = next_quests[level]
                go("game", {
                    levelIdx: levelIdx + 1
                })
            }
            else{
                debug.log("You have finished the game")
            }
        }
        else if (quest_done) {
            var ran = randi(0, quests.length)
            quest = quests[ran]
            quest_done = false
            debug.log("Your quest is " + quests[ran])
            console.log(ran)
        } else {
            debug.log("Please compleat your quest: " + quest)
        }
    })
    bean.onGround(() => {
        bean.play("jump")
        wait(0.5, () => {
            bean.play("idle")
        })
    })
    bean.onCollide("bed",()=>{
        if (quest == "Touch the bed"){
            questdone("Touch the bed")
        }
    })
    onClick("chest", (chest) => {
        chest.destroy()
        loot = loot + randi(5,10+level)
        loot_text.text = "Loot: " + loot
        if(level == 2){
            tnt++
        }
        if (quest == "Open a chest") {
            questdone("Open a chest")
        }
        else if (quest == "Open 2 chests"){
            chest_open++
            if (chest_open >= 2){
                questdone("Open 2 chests")
            }
        }
        else if(quest == "Get 10 loot" && loot >= 10){
            questdone("Get 10 loot")
        }
        else if(quest == "Get 20 loot" && loot >= 20){
            questdone("Get 20 loot")
        }
        
    })
    onKeyPress("t",() => {
        if(tnt > 0){
            tnt--
            if(quest == "Use TNT"){
                questdone("Use TNT")
            }
             add([
                sprite("tnt"),
                pos(toWorld(mousePos())),
                body(),
                origin("botleft"),
                area({height:32}),
                lifespan(10),
                "tnt",
                "tntyes",
            ])
            onCollide("bean","tnt",()=>{die()})
            onCollide("tntyes","tnt",(dirt,tnt)=>{
                dirt.destroy()
                tnt.destroy()
                addKaboom(tnt.pos)
                play("boom")
                shake(5)
            })
        }
    })
    onClick("box", (box) => {
        box.destroy()
        regCursor("default", "shovel")
        if (quest == "Find the mystery box") {
            questdone("Find the mystery box","Your got 2 barrels of TNT use it well press T to use")
            tnt = 2
        }
        
    })

    onKeyDown(["left", "a"], () => {
        if (isKeyDown("a") && isKeyDown("left") == false) {
            bean.move(-SPEED, 0)
        }
        else if (isKeyDown("left") && isKeyDown("a") == false) {
            bean.move(-SPEED, 0)
        }
    })

    onKeyDown(["right", "d"], () => {
        if (isKeyDown("d") && isKeyDown("right") == false) {
            bean.move(SPEED, 0)
        }
        else if (isKeyDown("right") && isKeyDown("d") == false) {
            bean.move(SPEED, 0)
        }
    })
    onKeyDown(["up", "w", "space"], () => {
        if (bean.isGrounded()) {
            bean.jump(JUMP)
            if(quest == "Jump 10 Times"){
                jump++
                if (jump > 10){
                    questdone("Jump 10 Times")
                }}
            if(quest == "Jump 20 times"){
                jump++
                if (jump > 20){
                    questdone("Jump 20 times")
                }
            }
        }
    })
    bean.onCollide("kill", () => {
        die()
    })

    bean.onUpdate(() => {
        camPos(bean.pos)
        if (bean.pos.y >= FALL_DEATH) {
            if (quest == "Fall into the void"){
                questdone("Fall into the void")
            }
            die()
        }
    })
    const loot_text = add([
        fixed(),
        text("Loot: " + loot),
        pos(20, 20),
        scale(0.5)
    ])
})

function die() {
    loot = 0
    loot.text = "Loot:"+loot
    if (level == 3){
        tnt = 2
    }
    go("game", {
        levelIdx: level,
    })
}

function start() {
    score = 0
    go("game", {
        levelIdx: 0,
    })
}

function questdone(a, b){
    if (b){
        debug.log("You did the quest!!! Go back to the quest box to get a new one."+b)
    }else{
        debug.log("You did the quest!!! Go back to the quest box to get a new one.")
    }
    i = quests.indexOf(a)
    quests.splice(i,1)
    quest_done = true
    quest = ""
    console.log(quests)
}
start()
