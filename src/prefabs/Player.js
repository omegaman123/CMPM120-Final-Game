class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, keyUP, keyLeft, keyRight, infiniteHit = false) {
        super(scene, x, y, texture);
        this.keyUp = keyUP;
        this.keyLeft = keyLeft;
        this.keyRight = keyRight;
        this.ballSpeed = 0;
        this.scene = scene;
        this.infiniteHit = infiniteHit;
        this.shotIndicate = this.scene.add.rectangle(x, y, 70, 5, 0xFFFFFF).setOrigin(0, 0);

        //set physics properties
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDamping(true);
        this.setDrag(.999);
        this.setCollideWorldBounds(true, .9, .9);
        this.body.onWorldBounds = true;
        this.setBounce(.75);
        this.body.setGravity(false);
        this.setMaxVelocity(200);
        this.body.setEnable(false);
    }

    update() {
        this.shotIndicate.x = this.x;
        this.shotIndicate.y = this.y;
        this.shotIndicate.rotation = this.rotation;

        // roll over for angles to keep between 0 and 2*Math.PI
        if (this.rotation % (2 * Math.PI) > 0) {
            this.rotation -= (2 * Math.PI);
        } else if (this.rotation < 0) {
            this.rotation += (2 * Math.PI);
        }

        //charge and hit ball by holding and realeasing up key
        if (Phaser.Input.Keyboard.JustUp(this.keyUp) && (!this.body.enable || this.infiniteHit)) {
            this.body.setEnable(true);
            this.shotIndicate.fillColor = '0xFACE44';
            this.shotIndicate.width = 0;
            //hit the ball with velocity proportional to charge time
            this.scene.sound.play("ballHit");
            this.body.stop();
            this.scene.physics.velocityFromRotation(this.rotation, this.ballSpeed * 200, this.body.acceleration);
            this.ballSpeed = 0;
        } else if (this.body.touching.none) {
            //if no forces acting on player, reset acceleration
            this.body.setAcceleration(0);
        }
        //charge hit while key is down
        if (this.keyUp.isDown && (!this.body.enable || this.infiniteHit)) {
            this.scene.chargeSound.play();
            //see if ball speed is less than max velocity - 200
            if (this.ballSpeed < 200) {
                if (this.ballSpeed < 50) {
                    this.shotIndicate.fillColor = '0x00FF00';
                } else if (this.ballSpeed > 50 && this.ballSpeed < 105) {
                    this.shotIndicate.fillColor = '0xFFFF00';
                } else if (this.ballSpeed > 130) {
                    this.shotIndicate.fillColor = '0xFF0000'
                }
                this.shotIndicate.width = this.ballSpeed;
                this.ballSpeed++;
            }
        }

        //rotate the direction the ball is facing
        if (this.keyRight.isDown && (!this.body.enable || this.infiniteHit)) {
            this.scene.rotateSound.play();
            this.rotation -= Math.PI / 100;
        }
        if (this.keyLeft.isDown && (!this.body.enable || this.infiniteHit)) {
            this.scene.rotateSound.play();
            this.rotation += Math.PI / 100;
        }

    }

}