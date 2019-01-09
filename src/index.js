var round_configs = {
    "row" : 2,
    "col" : 6,
    "platformSpeed" : 10,
    "ballMaxVelocityX" : 600
};

var platform;
var ball;
var gameOver = false;

function preload () {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('platform', 'assets/images/Panel.png');
    this.load.image('ball', 'assets/images/Ball.png');
    this.load.image('block', 'assets/images/Block.png');
    this.load.image('pit', "assets/platform.png");
}

function create () {
    //----------------init elems--------------------------
    cursors = this.input.keyboard.createCursorKeys();
    this.add.image(400, 300, 'sky');
    var blocks = this.physics.add.staticGroup();
    var pits = this.physics.add.staticGroup();
    var pit = pits.create(400, 600, "pit").setScale(3).refreshBody();
    var platforms = this.physics.add.staticGroup();
    platform =  platforms.create(400, 500, "platform");
    ball = this.physics.add.sprite(400, 475, 'ball');
    platform.ball = ball;
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
    var score = 0;
    var scoreText;
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '24px', fill: '#000' });
    //----------------blocks generate--------------------
    for (let i = 0; i <= round_configs["row"]; i++){
        for (let k = 0; k <= round_configs["col"]; k++){
            blocks.create( 100 + 90*k, 100 + 50*i, 'block');
        }
    }

    //-----------------functions----------------------------
    function resetLevel() {
        blocks.children.iterate(function (block) {
            block.enableBody(false, 0, 0, true, true);
        });
        ball.setVelocity(0);
        ball.setPosition(platform.x, platform.y - 25);
        ball.enableBody(false, 0, 0, true, true);
        platform.ball = ball;
        score = 0;
        scoreText.setText("Score: "+ score);
    }
    function CollectPit (ball, pit) {

        ball.disableBody(false, true);

        resetLevel();
    }
    function CollectBlock (ball, block){
        block.disableBody(false, true);

        score += 10;
        scoreText.setText('Score: ' + score);
    }
    function CollectPlatform (__ , platform) {

        if (ball.x !== platform.x){
            let multVelocity = ball.x - platform.x;
            console.log(ballVelocityX);
            ball.setVelocityX(ballVelocityX + 2*multVelocity);
            ballVelocityX = ballVelocityX + 2*multVelocity;
        }
    }
    //===========================================================

    //---------------------------------------events------------------------------------
    this.physics.add.overlap(ball, pits, CollectPit, null, this);
    this.physics.add.collider(ball, platform);
    this.physics.add.collider(ball, blocks, CollectBlock, null, this);
    this.physics.add.overlap(ball, blocks);
    //==================================================================================

}

function update () {
    if (cursors.left.isDown && platform.x > platform.width/2)
    {
        // player.setVelocityX(-200);
        // player.anims.play('left', true);
        platform.x -= round_configs["platformSpeed"];
        platform.refreshBody();
        if (platform.ball){
            ball.x -= round_configs["platformSpeed"];
        }
    }
    if (cursors.right.isDown && platform.x < config.width-platform.width/2)
    {
        platform.x += round_configs["platformSpeed"];
        platform.refreshBody();
        if (platform.ball){
            ball.x += round_configs["platformSpeed"];
        }
    }
    if (cursors.up.isDown && platform.ball){
        platform.ball.setVelocityY(-300)
        if (cursors.left.isDown){
            platform.ball.setVelocityX(-400)
            ballVelocityX = -400;
        }
        if (cursors.right.isDown){
            platform.ball.setVelocityX(400)
            ballVelocityX = 400;
        }
        platform.ball = false;
    }
}
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

