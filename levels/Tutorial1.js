Game.Tutorial1 = function (game) {
    //Global here variables
};
//Global global variables

var tutorial1BackgroundImage;

var tutorial_1_map;
var tutorial_1_layer;

var player = {};
var playerHealthBar = {};
var playerExpBar = {};
var playerSpeed = 200;
var jumpTimer = 0;

var respawn;

var hotbar;

// Format: [Item Name, Item ID, Item Sprite ID, Notes, physical image]
// 0: name,  1: ID, 2: Image Sprite, 3: Notes, 4: Physical image,
var itemDataBase = [
    ["Health Potion", 0, "Item_HealthPotion", "Heals 25 HP on consumption", 0],
    ["Speed Potion", 1, 'Item_SpeedPotion', "Increase Speed by 200 for 4 seconds", 0]
]

var inventory = {
    primary: [null, 0],
    secondary: [null, 0],
    one: [itemDataBase[0][2], 1],
    two: [itemDataBase[1][2], 1],
    three: [null, 0],
    four: [null, 0]
};


var style = { font: "12px Arial", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle" };

var healthPotion;


Game.Tutorial1.prototype = {
    
    preload: function (game) {
        
        game.time.advancedTiming = true;
        
        tutorial1BackgroundImage = game.add.tileSprite(0,0,2048,600,"tutorial1background");
        
    },
    
    create: function (game) {
        
        //Physics System
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        //this.physics.arcade.gravity.y = 1400;
        
        //Respawning
        respawn = game.add.group();
        
        //Map and the Map Opject layer
        tutorial_1_map = this.add.tilemap('tutorial1map');
        
        tutorial_1_map.addTilesetImage("SpriteSheet", "tileset");
        
        tutorial_1_layer = tutorial_1_map.createLayer("Tile Layer 1");
        
        tutorial_1_layer.resizeWorld();
        
        tutorial_1_map.setCollisionBetween(0,5);
        
        tutorial_1_map.createFromObjects("Object Layer 1", 8, "", 0, true, false, respawn);
        
        //tutorial_1_map.createFromObjects("Object Layer 2", 9, "", 0, true, false, null);
        
        
        //Player Creation
        player = this.add.sprite(0,0,"player");
        player.anchor.setTo(0.5, 0.5);
        
        //Player's health
        player.currentHealth = 5;
        player.maxHealth = 5;
        
        //Player's Health Bar
        playerHealthBar = this.add.bitmapData(8, 100);
        playerHealthBar.sprite = game.add.sprite(765 , 80, playerHealthBar);
        playerHealthBar.sprite.anchor.setTo(0.5, 0.5);
        playerHealthBar.sprite.fixedToCamera = true;
            //Text portion
        playerHealthBar.txt = game.add.bitmapText(765, 148, "menuFont","HP: " + player.currentHealth + "/" + player.maxHealth, 10);
        playerHealthBar.txt.anchor.setTo(0.5, 0.5);
        playerHealthBar.txt.maxWidth = 35;
        playerHealthBar.txt.fixedToCamera = true;
        
        //Player's XP and Max XP
        player.level = 0;
        player.currentXP = 3;
        player.maxXP = 10;
        
        //Player's experience and level
        playerExpBar = this.add.bitmapData(8, 100);
        playerExpBar.sprite = game.add.sprite(700, 80, playerExpBar);
        playerExpBar.sprite.anchor.setTo(0.5, 0.5);
        playerExpBar.sprite.fixedToCamera = true;
            //Text portion
        playerExpBar.txt = game.add.bitmapText(700, 140, "menuFont", "Lvl: " + player.level, 10);
        playerExpBar.txt.anchor.setTo(0.5, 0.5);
        playerExpBar.txt.fixedToCamera = true;
        
        //Spawn in the player
        this.spawn();
        
        //Enable physics, collide with world boundaries and have the camera follow the player
        this.physics.arcade.enable(player, Phaser.Physics.ARCADE);
        player.body.gravity.y = 1400;
        this.camera.follow(player);
        player.body.collideWorldBounds = true;
        
        //Create the player's inventory hotbar
        hotbar = game.add.sprite(400, game.world.centerY + 250, "hotbar");
        hotbar.anchor.setTo(0.5,0.5);
        hotbar.scale.setTo(1.5,1.5);
        hotbar.fixedToCamera = true;
        //hotbar.x = game.world.centerX - (hotbar.width / 2);
        
        //Make some health potions
        healthPotion = game.add.group();
        this.physics.arcade.enable(healthPotion, Phaser.Physics.ARCADE);
        healthPotion.enableBody = true;
        //Make em physically
        
        tutorial_1_map.createFromObjects("Object Layer 2", 9, itemDataBase[0][2], 0, true, false, healthPotion);
        
        //Make some speed potions
        speedPotion = game.add.group();
        this.physics.arcade.enable(speedPotion, Phaser.Physics.ARCADE);
        speedPotion.enableBody = true;
        //Make em physically
        
        tutorial_1_map.createFromObjects("Object Layer 2", 10, itemDataBase[1][2], 0, true, false, speedPotion);
        

        //Add controls for using items
        controls.one.onDown.add(function(){Tutorial1Methods.useItemslot1(game);});
        controls.two.onDown.add(function(){Tutorial1Methods.useItemslot2(game);});
        controls.three.onDown.add(function(){Tutorial1Methods.useItemslot3(game);});
        controls.four.onDown.add(function(){Tutorial1Methods.useItemslot4(game);});
        
        /*
        ====================
        
           INVENTORY SLOTS
        
        ====================
        */
        
        //Health Potion Slot AKA Slot 1
        itemDataBase[0][4] = game.add.sprite(400, 552, itemDataBase[0][2]);
        itemDataBase[0][4].anchor.setTo(0.5, 0.5);
        itemDataBase[0][4].scale.setTo(1.1, 1.1);
        itemDataBase[0][4].fixedToCamera = true;

        inventory.one[2] = game.add.text(9, 6, inventory.one[1].toString(), style);   itemDataBase[0][4].addChild(inventory.one[2]);
        
        //Speed Potion Slot AKA Slot 2
        itemDataBase[1][4] = game.add.sprite(452, 552, itemDataBase[1][2]);
        itemDataBase[1][4].anchor.setTo(0.5, 0.5);
        itemDataBase[1][4].scale.setTo(1.1, 1.1);
        itemDataBase[1][4].fixedToCamera = true;
        
        inventory.two[2] = game.add.text(9, 6, inventory.two[1].toString(), style);
        itemDataBase[1][4].addChild(inventory.two[2]);
        
        //Jump Potion Slot AKA Slot 3
        
        //Damage Buff Potion Slot AKA Slot 4
        
    },
    
    update: function (game) {
        //Update background :)
        //tutorial1BackgroundImage.tilePosition.x += backgroundv;
        
        //Collisions
        //Collide between the player and the tiles in the layer
        this.physics.arcade.collide(player, tutorial_1_layer);
        
        this.physics.arcade.collide(healthPotion, tutorial_1_layer);
        
        this.physics.arcade.overlap(player, healthPotion, function(player, healthPotions){Tutorial1Methods.collectHP(game, player, healthPotions)}, null, this);
        
        this.physics.arcade.overlap(player, speedPotion, function(player, speedPotions) {Tutorial1Methods.collectSP(game, player, speedPotions)}, null, this);
        
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
        game.debug.cameraInfo(game.camera, 32, 32);
        //game.debug.spriteCoords(player, 32, 500);
        
    },
    
    spawn: function () {
        respawn.forEach(function(spawnPoint){
            
            player.reset(spawnPoint.x, spawnPoint.y);
            player.currentHealth = player.maxHealth;
            
        }, this)
    },
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
            //Tutorial1Methods.gainXP(player, 2);
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
            //Tutorial1Methods.gainXP(player, 2);
        }
        
        if(controls.up.isDown && (player.body.onFloor() || player.body.touching.down) && game.time.now > jumpTimer){
            player.body.velocity.y = -600;
            //Tutorial1Methods.takeDamage(player, 1)
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
        
    },
    
    collectHP: function (game, player, healthPotions) {
        //console.log("collision detected");
            

        if(inventory.one[0] == null || inventory.one[0] == itemDataBase[0][2]){
            
            healthPotions.kill();
            inventory.one[1] += 1;
            inventory.one[2].text = inventory.one[1].toString();

        }   
    },
    
    collectSP: function (game, player, speedPotions) {
        
        speedPotions.kill();
        inventory.two[1] += 1;
        inventory.two[2].text = inventory.two[1].toString();
        
    },
    
    useItemslot1: function (game) {
        console.log("Itemslot 1 used");
        
        //Health Potions
        if(inventory.one[0] == itemDataBase[0][2] && inventory.one[1] >= 1){
            if(player.currentHealth + 25 <= player.maxHealth){
                inventory.one[1] -= 1;
                player.currentHealth += 25;
                inventory.one[2].text = inventory.one[1].toString();
            }
            else{
                inventory.one[1] -= 1;
                player.currentHealth += (player.maxHealth - player.currentHealth);
                inventory.one[2].text = inventory.one[1].toString();
            }
        }
    },
    
    useItemslot2: function (game) {
        console.log("Itemslot 2 used");
        
        if(inventory.two[0] == itemDataBase[1][2] && inventory.two[1] >= 1){
            inventory.two[1] -= 1;
            inventory.two[2].text = inventory.two[1].toString();
            //Give Speed Potions Some abilities
        }
    },
    
    useItemslot3: function (game) {
        console.log("Itemslot 3 used");
        
    },
    
    useItemslot4: function (game) {
        console.log("Itemslot 4 used");
        
    },
    
    
};





/*
Potential bugs:

1. When health potions are in both itemslot 1 and itemslot2 and you trigger itemDataBase[0][4].kill() in the useItemSlot function, it could end up killing both entities.  This isn't too much of an issue because players most likely won't be able to trick the system into putting health potions into both inventory slots 1 and 2.  In order to do that, you must pick up the first health potion, set inventory.one[0] to "asdf" and then pick up a second health potion.

FIXED

*/

















