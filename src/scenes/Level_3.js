class Level_3 extends Phaser.Scene {
    constructor() {
        super("level_3Scene");
    }

    preload() {
        //console.log("in level 2");
        this.load.image('ball', './assets/ball_temp.png');
        this.load.image('wall', './assets/rect.png');
        this.load.image('background2', './assets/Level2background.png');
        this.load.image('hill', './assets/mountain.png');
        this.load.image('ravine', './assets/ravine.png');
        this.load.image('crab','./assets/crab.png');
        this.load.image('hole', './assets/hole.png');
        
        //load player assosciated audio
        this.load.audio("rotate", "./assets/angleTick.wav");
        this.load.audio("chargeHit", "./assets/shotIndicator.wav");
        this.load.audio("ballHit", "./assets/ballHit.wav");
        this.load.audio("ballInHole", "./assets/ballInHole.wav");
        this.load.audio("music", "./assets/music.wav");
    }

    create() {
        //misc set up
        console.log("In Level 3");
        this.cameras.main.setBackgroundColor("#5A5");
        this.singleClick = 0;
        this.ballSpeed = 0;
        this.mouse = this.input.activePointer;
        this.mouseType = "None";
        this.startPosX = 100;
        this.startPosY = game.config.height/2;
        this.endPosX = 750;
        this.endPosY = game.config.height/2;
        this.levelCount = 3;

        //audio volume adjustments
        this.chargeSound = this.sound.add("chargeHit");
        this.chargeSound.volume = .5;
        this.rotateSound = this.sound.add("rotate");
        this.rotateSound.volume = .5;
        this.music = this.sound.add("music");
        this.music.loop = true;
        this.music.play();

        //key bindings
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        
        //key bindings for mouse controls
        keyZERO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        keyONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        keyTWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        keyTHREE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        keyFOUR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);

        //set up map background
        this.add.sprite(0, 0, 'background2').setOrigin(0, 0).setScale(1.1, 1);

        //set up player physics
        this.player = new Player(this, this.startPosX, this.startPosY, 'ball', keyUP, 
                keyRIGHT, keyLEFT).setOrigin(.5).setCircle(135).setScale(.25, .25);
        this.physics.world.on('worldbounds', worldBounce, this);

        //set up obstacles physics
        this.walls = this.add.group();
        {
            //create each walls for the level
            var floorFrame = new Obstacle(this, 0, 0, 'wall').setOrigin(0, 0).setScale(4.6, .75);
            this.walls.add(floorFrame);

            //create each walls for the level
            var floor1 = new Obstacle(this,game.config.width/2, game.config.height/2, 'wall').setOrigin(.5, .5).setScale(1, 3);
            this.walls.add(floor1);

        }
        this.physics.add.collider(this.player, this.walls, objectBounce, null, this);

        //set up hill physics
        this.hills = this.add.group();
        {
            /*var mound = this.physics.add.sprite(750, 205, 'hill');
            mound.setOrigin(.5).setCircle(130, 20, 20).setScale(.75, .75).setInteractive();
            mound.body.setImmovable(true);
            mound.body.setGravity(false);
            this.hills.add(mound)*/
        }
        this.push = this.physics.add.overlap(this.player, this.hills, pushOverlap, null, this);

        //set up ravine phsyics
        this.ravines = this.add.group();
        {
            //create a ravine in the hole
            var hole = this.physics.add.sprite(this.endPosX, this.endPosY, 'ravine');
            hole.setOrigin(.5).setCircle(130, 20, 20).setScale(.4, .4).setInteractive();
            hole.body.setImmovable(true);
            hole.body.setGravity(false);
            this.ravines.add(hole);
        }
        this.pull = this.physics.add.overlap(this.player, this.ravines, pullOverlap, null, this);

        //set up level goal
        this.goal = new Hole(this, this.endPosX, this.endPosY, 'hole',3);
        this.win = this.physics.add.overlap(this.player, this.goal, toNextLevel, null, this);


        //set up crab
        this.crabs= this.add.group();

        this.crab1 = new Crab(this,this.endPosX-100,150,'crab',.5).setScale(.1,.1);
        this.crabs.add(this.crab1);
        this.crab2 = new Crab(this,this.endPosX-100,450,'crab',-.5).setScale(.1,.1);
        this.crabs.add(this.crab2);
        this.physics.add.collider(this.player, this.crabs, objectBounce, null, this);


        //tutorial text for Level_3
        let textConfig = {
            fontFamily: "Courier", 
            fontSize: "32px",
            color: "#000",
            backgroundColor: "#AAA",
            align: "center",
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        };
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;
        //fading tutorial text
        textConfig.backgroundColor = null;
        textConfig.fontSize = "18px";
        this.fadeText1 = this.add.text(this.player.x + 30, this.player.y - textSpacer, "(←) and (→) to turn", 
                textConfig).setOrigin(.5);
        this.fadeText2 = this.add.text(this.player.x + 3*textSpacer, this.player.y + 5, "Hold (↑) to charge",
                textConfig).setOrigin(.5);
        this.fadeText3 = this.add.text(this.player.x + 30, this.player.y + textSpacer, "Release (↑) to fire",
                textConfig).setOrigin(.5);
        this.fadeDelay = false;
        this.time.addEvent({
            delay:10000,
            callback: () => {this.fadeDelay = true;},
            loop:false,
            callbackScope:this
        });

        //permanent control display
        if(this.levelCount > 0) {
            let angleText = this.add.text(centerX - game.config.width/3, game.config.height/15, 
                "(←) / (→)  to angle.\nHold (↑) to charge.\nRelease (↑) to swing.",
                textConfig).setOrigin(.5);
        }
        if(this.levelCount > 1) {
            this.mouseText = this.add.text(centerX, game.config.height/15, 
                "Left Click to use object type.\n(0) -> (4) to change.\nCurrent object type: " + this.mouseType, 
                textConfig).setOrigin(.5);
            let objectText = this.add.text(centerX + game.config.width/3, game.config.height/15, 
                "(0) Remove\n(1) Hill\n(2) Ravine", 
                textConfig).setOrigin(.5);
        }
    }


    update() {
        this.player.update();
        this.crab1.update();
        this.crab2.update();

        //fade out text slowly
        if(this.fadeText1.alpha > 0 && this.fadeDelay) {
            this.fadeText1.alpha -= .005;
            this.fadeText2.alpha -= .005;
            this.fadeText3.alpha -= .005;
        }

        //keyboard controls for pause and restart
        if (Phaser.Input.Keyboard.JustDown(keyP)) {
            //this.sound.play("wipe");
            this.player.body.reset(this.startPosX, this.startPosY);
            this.player.rotation = 0;
        }
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            //this.sound.play("wipe");
            this.music.pause();
            this.scene.restart();
        }
        if (Phaser.Input.Keyboard.JustDown(keyQ)) {
            //this.sound.play("wipe");
            this.music.pause();
            this.scene.start("menuScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyZERO)) {
            //this.sound.play("switch");
            this.mouseType = "Remove";
            this.mouseText.text = "Left Click to use object type.\n(0) -> (4) to change.\nCurrent object type: " + this.mouseType;
        }
        if (Phaser.Input.Keyboard.JustDown(keyONE)) {
            //this.sound.play("switch");
            this.mouseType = "Hill";
            this.mouseText.text = "Left Click to use object type.\n(0) -> (4) to change.\nCurrent object type: " + this.mouseType;
        }
        if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
            //this.sound.play("switch");
            this.mouseType = "Ravine";
            this.mouseText.text = "Left Click to use object type.\n(0) -> (4) to change.\nCurrent object type: " + this.mouseType;
        }

        //mouse controls for terrain manipulation
        if (game.input.mousePointer.isDown) {
            this.singleClick++;
        } else {
            this.singleClick = 0;
        }
        //create new object when clicking
        if (this.singleClick == 1  && !this.player.body.enable) {
            this.input.on('pointerdown', () => {
                if(this.mouseType == "Ravine") {
                    //if left click, add ravine to group
                    var temp = this.physics.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'ravine');
                    console.log("temp: " + temp);
                    temp.setOrigin(.5).setCircle(130, 20, 20).setScale(.01, .01).setInteractive();
                    temp.body.setImmovable(true);
                    temp.body.setGravity(false);
                    this.ravines.add(temp)
                    console.log(this.ravines);
                    sizeIncrease(temp, true,this.mouse,this.time);
                } else if (this.mouseType == "Hill") {
                    //if right click, add hill to group
                    var temp = this.physics.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'hill');
                    console.log("temp: " + temp);
                    temp.setOrigin(.5).setCircle(130, 20, 20).setScale(.01, .01).setInteractive();
                    temp.body.setImmovable(true);
                    temp.body.setGravity(false);
                    this.hills.add(temp)
                    console.log(this.hills);
                    sizeIncrease(temp, true,this.mouse,this.time);
                }
            });
        }
    }

}