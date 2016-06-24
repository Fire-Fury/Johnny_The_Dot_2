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
        
        //Fonts
        
        this.load.bitmapFont("menuFont", "assets/menu/font.png", "assets/menu/font.fnt");
        
    },
    
    create: function(){
        
        this.state.start('MainMenu');
        
    }
    
};



