Game.MainMenu = function (game) {
    //Global Variables for this file only!
};
//Global Variables for the whole program!
var menuBackgroundImage;

var backgroundv;

var selectorL;
var selectorR;

var selectorState = {};

var controls = {};

var titletxt;




Game.MainMenu.prototype = {
    preload: function(game){
        menuBackgroundImage = game.add.tileSprite(0,0,800,600,'menuBackgroundImage');
        
        backgroundv = 1;
        
        
    },
    
    create: function(game){
        //Sets the background color, This becomes obsolete once the background image is in place.
        //This is helpful to determine when I've loaded an empty state
        this.stage.backgroundColor = "#3A5963";
        
        titletxt = game.add.bitmapText(game.world.centerX, game.world.centerY - 90, "menuFont", "Johnny The Dot 2", 48);
        titletxt.anchor.setTo(0.5, 0.5);
        
        //Create the buttons for our game!
        this.createButton(game, "New Game", game.world.centerX, game.world.centerY + 32, 200, 50, function(){
            //this.state.start('Tutorial_1');
            MainMenuMethods.newGame(game);
        });
        
        this.createButton(game, "Resume", game.world.centerX, game.world.centerY + 92, 200, 50, function(){
            //this.state.start('Tutorial_1');
            MainMenuMethods.resume(game);
        });
        
        this.createButton(game, "Options", game.world.centerX, game.world.centerY + 152, 200, 50, function(){
            //this.state.start('Tutorial_1');
            MainMenuMethods.options(game);
        });
        
        //Creates the two selector arrows and sets their anchor points
        selectorL = this.add.sprite(game.world.centerX - 130, game.world.centerY + 32, "buttonSelector");
        
        selectorL.anchor.setTo(0.5,0.5);
        
        selectorR = this.add.sprite(game.world.centerX + 130, game.world.centerY + 32, "buttonSelector");
        
        selectorR.anchor.setTo(0.5,0.5);
        
        selectorR.scale.setTo(-1,1);
        
        selectorState = {
            state1: true,
            state2: false,
            state3: false,
        }
        
        //Sets up the controls
        
        controls = {
            up: this.input.keyboard.addKey(Phaser.Keyboard.UP),
            down: this.input.keyboard.addKey(Phaser.Keyboard.DOWN),
            left: this.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: this.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            
            one: this.input.keyboard.addKey(Phaser.Keyboard.ONE),
            two: this.input.keyboard.addKey(Phaser.Keyboard.TWO),
            three: this.input.keyboard.addKey(Phaser.Keyboard.THREE),
            four: this.input.keyboard.addKey(Phaser.Keyboard.FOUR),
            
            shift: this.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
            enter: this.input.keyboard.addKey(Phaser.Keyboard.ENTER),
            debug: "Hey this is a debug attribute of controls",
        }
        
        controls.down.onDown.add(function(){MainMenuMethods.selectorInputs(game);}, this);
        controls.up.onDown.add(function(){MainMenuMethods.selectorInputs(game);}, this);
        controls.enter.onDown.add(function(){MainMenuMethods.checkForEnter(game);}, this)
        
        
    },
    
    update: function(game){
        menuBackgroundImage.tilePosition.x += backgroundv;
        
        MainMenuMethods.checkForState(game);
    },
    
    //Button Creation Method called using, this.createButton(game,string,x,y,w,h,callback);
    
    createButton: function(game, string, x, y, w, h, callback){
        
        var button1 = game.add.button(x,y,'button', callback, this, 2, 1, 0);
    
        button1.anchor.setTo(0.5, 0.5);
    
        button1.width = w;
        button1.height = h;
    
        var txt = game.add.bitmapText(button1.x, button1.y - 7, "menuFont", string, 16);

        txt.anchor.setTo(0.5, 0.5);
        
    },

};

var MainMenuMethods = {
    selectorInputs: function(game){
            
            //If down key is pressed
            if(controls.down.isDown && selectorState.state1 == true){
                selectorL.y = game.world.centerY + 92;
                selectorR.y = game.world.centerY + 92;
                
            }
            else if(controls.down.isDown && selectorState.state2 == true){
                selectorL.y = game.world.centerY + 152;
                selectorR.y = game.world.centerY + 152;

            }
            else if(controls.down.isDown && selectorState.state3 == true){
                selectorL.y = game.world.centerY + 32;
                selectorR.y = game.world.centerY + 32;
            }
            else{};
            
            //If up key is pressed
            if(controls.up.isDown && selectorState.state1 == true){
                selectorL.y = game.world.centerY + 152;
                selectorR.y = game.world.centerY + 152;
                
            }
            else if(controls.up.isDown && selectorState.state2 == true){
                selectorL.y = game.world.centerY + 32;
                selectorR.y = game.world.centerY + 32;

            }
            else if(controls.up.isDown && selectorState.state3 == true){
                selectorL.y = game.world.centerY + 92;
                selectorR.y = game.world.centerY + 92;
            }
            else{};
            
    },
    
    checkForState: function(game){
            //Define the state the selector is in
            if (selectorL.y == (game.world.centerY + 32) && selectorR.y == (game.world.centerY + 32)){
                selectorState.state1 = true;
                selectorState.state2 = false;
                selectorState.state3 = false;

            }
            else if(selectorL.y == (game.world.centerY + 92) && selectorR.y == (game.world.centerY + 92)){
                selectorState.state1 = false;
                selectorState.state2 = true;
                selectorState.state3 = false;
            }
            else if(selectorL.y == (game.world.centerY + 152) && selectorR.y == (game.world.centerY + 152)){
                selectorState.state1 = false;
                selectorState.state2 = false;
                selectorState.state3 = true;
            }
            else{};
    },
    
    checkForEnter(game){
            //If Enter is pressed
            if(controls.enter.isDown && selectorState.state1 == true){
                this.newGame(game);
            }
            else if(controls.enter.isDown && selectorState.state2 == true){
                this.resume(game);
            }
            else if(controls.enter.isDown && selectorState.state3 == true){
                this.options(game);
            }
    },
    
    newGame: function(game){
        console.log("New Game works");
        game.state.start("Tutorial1");
    },
    
    resume(game){
        console.log("resume game works");
    },
    
    options(game){
        console.log("Options works");
    }
}





