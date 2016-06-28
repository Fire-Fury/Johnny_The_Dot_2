Game.Tutorial1 = function (game) {
    //Global here variables
};
//Global global variables

var tutorial1Background;

var tutorial_1_map;
var tutorial_1_layer;

var player = {};
var playerHealthBar = {};
var playerExpBar = {};
var playerSpeed = 200;
var jumpTimer = 0;

var respawn;



Game.Tutorial1.prototype = {
    
    preload: function (game) {
        
        game.time.advancedTiming = true;
        
        menuBackgroundImage = game.add.tileSprite(0,0,800,600,"tutorial1background");
        
    },
    
    create: function (game) {
        
        //Physics System
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.physics.arcade.gravity.y = 1400;
        
        //Respawning
        respawn = game.add.group();
        
        //Map and the Map Opject layer
        tutorial_1_map = this.add.tilemap('tutorial1map');
        
        tutorial_1_map.addTilesetImage("SpriteSheet", "tileset");
        
        tutorial_1_layer = tutorial_1_map.createLayer("Tile Layer 1");
        
        tutorial_1_layer.resizeWorld();
        
        tutorial_1_map.setCollisionBetween(0,5);
        
        tutorial_1_map.createFromObjects("Object Layer 1", 8, "", 0, true, false, respawn);
        
        //Player Creation
        player = this.add.sprite(0,0,"player");
        player.anchor.setTo(0.5, 0.5);
        
        //Player's health
        player.currentHealth = 5;
        player.maxHealth = 5;
        
        //Player's Health Bar
        playerHealthBar = this.add.bitmapData(8, 100);
        playerHealthBar.sprite = game.add.sprite(770 , 80, playerHealthBar);
        playerHealthBar.sprite.anchor.setTo(0.5, 0.5);
            //Text portion
        playerHealthBar.txt = game.add.bitmapText(770, 140, "menuFont","HP: " + player.currentHealth + "/" + player.maxHealth, 10);
        playerHealthBar.txt.anchor.setTo(0.5, 0.5);
        
        //Player's XP and Max XP
        player.level = 0;
        player.currentXP = 3;
        player.maxXP = 10;
        
        //Player's experience and level
        playerExpBar = this.add.bitmapData(8, 100);
        playerExpBar.sprite = game.add.sprite(700, 80, playerExpBar);
        playerExpBar.sprite.anchor.setTo(0.5, 0.5);
            //Text portion
        playerExpBar.txt = game.add.bitmapText(700, 140, "menuFont", "Lvl: " + player.level, 10);
        playerExpBar.txt.anchor.setTo(0.5, 0.5);
        
        //Spawn in the player
        this.spawn();
        
        //Enable physics, collide with world boundaries and have the camera follow the player
        this.physics.arcade.enable(player, Phaser.Physics.ARCADE);
        this.camera.follow(player);
        player.body.collideWorldBounds = true;
        
        
        
    },
    
    update: function (game) {
        
        //Collisions
        //Collide between the player and the tiles in the layer
        this.physics.arcade.collide(player, tutorial_1_layer);
        
        //Reset the player's velocity to 0 at the beginning of every frame
        player.body.velocity.x = 0;
        
        //Check if the player is at 0 health
        if(player.currentHealth <= 0){
            this.spawn();
        }
        //Checks XP and sets level accordingly
        Tutorial1Methods.levelUp();
        
        //Display Health and XP
        Tutorial1Methods.playerStatBarUpdate(game, player.body.x, player.body.y);
        
        //Controls
        Tutorial1Methods.detectControls(game);
        
    },
    
    render: function (game) {
        game.debug.text(game.time.fps || "--", 2, 14, "#000000");
        
    },
    
    spawn: function () {
        respawn.forEach(function(spawnPoint){
            
            player.reset(spawnPoint.x, spawnPoint.y);
            player.currentHealth = player.maxHealth;
            
        }, this)
    }
};

var Tutorial1Methods = {
    detectControls(game){
        
        if(controls.left.isDown){
            if(controls.shift.isDown){
                player.body.setSize(32,32,-32,0);
                player.scale.setTo(-1,1);
                player.body.velocity.x -= playerSpeed * 1.5;
            }
            else
            {
                player.body.setSize(32,32,-32,0);
                player.scale.setTo(-1,1);
                player.body.velocity.x -= playerSpeed;
            }
            Tutorial1Methods.gainXP(player, 2);
        }
        
        if(controls.right.isDown){
            if(controls.shift.isDown){
                player.body.setSize(32,32,0,0);
                player.scale.setTo(1,1);
                player.body.velocity.x += playerSpeed * 1.5;
            }
            else
            {
                player.body.setSize(32,32,0,0);
                player.scale.setTo(1,1);
                player.body.velocity.x += playerSpeed;
            }
            Tutorial1Methods.gainXP(player, 2);
        }
        
        if(controls.up.isDown && (player.body.onFloor() || player.body.touching.down) && game.time.now > jumpTimer){
            player.body.velocity.y = -600;
            Tutorial1Methods.takeDamage(player, 1)
            jumpTimer = game.time.now + 750;
        }
        
    },
    
    playerStatBarUpdate: function (game, px, py) {
        
        //Health Bar
        playerHealthBar.context.clearRect(0,0, playerHealthBar.width, playerHealthBar.height);
        
        if (player.currentHealth < player.maxHealth/3) {
            playerHealthBar.context.fillStyle = "#f00";
        }
        else if (player.currentHealth < player.maxHealth/2) {
            playerHealthBar.context.fillStyle = "#ff0";
        }
        else
        {
            playerHealthBar.context.fillStyle = "#0f0";
        }
        
        playerHealthBar.context.fillRect(0, playerHealthBar.height - (player.currentHealth * (playerHealthBar.height/player.maxHealth)), 8, (player.currentHealth)*(playerHealthBar.height/player.maxHealth));
        playerHealthBar.context.fillStyle = "#989898";
        playerHealthBar.context.fillRect(0, 0, 8, playerHealthBar.height - (player.currentHealth * (playerHealthBar.height/player.maxHealth)));
        
        playerHealthBar.dirty = true;
        
        playerHealthBar.txt.text = "HP: " + player.currentHealth + "/" + player.maxHealth;
        
        //EXP Bar
        playerExpBar.context.clearRect(0,0, playerExpBar.width, playerExpBar.height);
        
        if (player.currentXP < player.maxXP/2) {
            playerExpBar.context.fillStyle = "#003399";
        }
        else
        {
            playerExpBar.context.fillStyle = "#0066AA";
        }
        
        playerExpBar.context.fillRect(0, playerExpBar.height - (player.currentXP * (playerExpBar.height / player.maxXP)), 8, player.currentXP * (playerExpBar.height / player.maxXP));
        playerExpBar.context.fillStyle = "#989898";
        playerExpBar.context.fillRect(0,0,8, playerExpBar.height - (player.currentXP * (playerExpBar.height/player.maxXP)));
        
        playerExpBar.dirty = true;
        
        playerExpBar.txt.text = "Lvl: " + player.level;
    },
    
    //Sucks the life out of an object
    takeDamage: function (obj, dmg) {
        
        obj.currentHealth -= dmg;
         
    },
    
    gainXP: function (obj, xp) {
        
        obj.currentXP += xp;
        
    },
    
    levelUp: function () {
        
        if(player.currentXP >= player.maxXP){
            var diff = player.currentXP - player.maxXP;
            
            player.currentXP = diff;
            player.level += 1;
            player.maxXP = Math.floor(1.2 * player.maxXP);
            
            this.healthUp();
            
        }
        
    },
    
    healthUp: function () {
        
        player.maxHealth = (player.level+1) * 5;
        player.currentHealth = player.maxHealth;
        
    }
};





