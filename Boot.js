var Game = {};

Game.Boot = function(game){
    
};

Game.Boot.prototype = {
    init: function(){
        
        this.input.maxPointers = 1;
        
        this.stage.disableVisibilityChange = true;
        
    },
    
    preload: function(game){
        //Load Game States
        game.state.add("Tutorial_1", Game.Tutorial_1);
        
        
        //Load the preloader bar
        this.load.image("preloaderBar", "assets/menu/preloader.png");
    
    },
    
    create: function() {
        
        this.state.start("Preloader");
        
    }
    
    
}