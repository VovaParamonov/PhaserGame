var round_configs = {
    "row" : 2,
    "col" : 6,
    "platformVelocity" : 500,
    "ballMaxVelocityX" : 600
};
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

var platform;
var ball;
var blocks;
var score = 0;
var scoreText;

function preload () {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('platform', 'assets/images/Panel.png');
    this.load.image('ball', 'assets/images/Ball.png');
    this.load.image('block', 'assets/images/Block.png');
    this.load.image('pit', "assets/platform.png");
}

function create () {
    cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.setBoundsCollision(true, true, true, false);
    //----------------init elems---------------------------------------
    this.add.image(400, 300, 'sky');
    blocks = this.physics.add.staticGroup({
        key: "block",
        repeat: 20,
        gridAlign: {width: 7, height: 3, cellWidth: 100, cellHeight: 50, x: 100, y: 100}
    });
    platform = this.physics.add.image(400, 500, "platform");
    platform.setImmovable();
    ball = this.physics.add.image(400, 475, 'ball');
    platform.ball = ball;
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '24px', fill: '#000' });

    function CollectBlock (ball, block){
        block.disableBody(false, true);

        score += 10;
        scoreText.setText('Score: ' + score);
    }
    //==================================================================

    //---------------------------------------events---------------------
    this.physics.add.collider(ball, platform);
    this.physics.add.collider(ball, blocks, CollectBlock, null, this);
    //==================================================================

}

//----------------------------------functions-----------------------------------
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
//===============================================================================

function update () {
    if (cursors.left.isDown && platform.x > platform.width/2)
    {
        platform.setVelocityX(-round_configs["platformVelocity"]);
    }else if (cursors.right.isDown && platform.x < config.width-platform.width/2)
    {
        platform.setVelocityX(round_configs["platformVelocity"]);
    }
    else {
        platform.setVelocityX(0);
    }
    if (cursors.up.isDown && platform.ball){
        platform.ball.setVelocityY(-300)
        if (cursors.left.isDown){
            platform.ball.setVelocityX(-400)
        }
        if (cursors.right.isDown){
            platform.ball.setVelocityX(400)
        } else {
            platform.ball.setVelocityX(200)
        }
        platform.ball = false;
    }
    if (platform.ball){
        platform.ball.setPosition(platform.x, platform.y-25);
    }
    if (ball.y > 600){
        ball.disableBody(false, true);
        resetLevel();
    }
}




