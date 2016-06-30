Game.Preloader = function(game){
    
    this.preloadBar = null;
    
};

Game.Preloader.prototype = {
    preload: function(){
        //Makes the preload bar work properly
        
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
        
        this.preloadBar.anchor.setTo(0.5,0.5);
        
        this.time.advancedTiming = true;
        
        this.load.setPreloadSprite(this.preloadBar);
        
        //Load all assets
        
        //Example: this.load.image("key", "location");
        
        //Images
        
        this.load.image("menuBackgroundImage", "assets/menu/menuBackGroundImage.png");
        
        this.load.image("button", "assets/menu/button.png");
        
        this.load.image("buttonSelector", "assets/menu/buttonSelector.png");
        
        this.load.image("tutorial1background", "assets/tutorial1background.png");
        
        this.load.image('tileset', "assets/SpriteSheet.png");
        
        this.load.image("player", "assets/Johnny.png");
        
        this.load.image("hotbar", "assets/Inventory.png");
            //Items
        this.load.image("Item_HealthPotion", "assets/items/HealthPotion.png");
        
        this.load.image("Item_SpeedPotion", "assets/items/SpeedPotion.png");
        
        //Fonts
        
        this.load.bitmapFont("menuFont", "assets/menu/font.png", "assets/menu/font.fnt");
        
        //Maps
        
        this.load.tilemap("tutorial1map", "maps/Tutorial1.json", null, Phaser.Tilemap.TILED_JSON);
        
        //SpriteSheets
        
        
        
        
        
    },
    
    create: function(){
        
        this.state.start('MainMenu');
        
    }
    
};



