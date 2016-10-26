/*MISC TO DO LIST TO TWEAK GAME
    
    -Defender background coloring
    -Reset button moves to right side of defender
    -Keep getting type errors of undefined
    -Best way to reset variables to blank
    -Am I setting copies of DOM objects with assignment or creating a pointer?
    -Keep order of defenders same under reset and original load
    -Fix reset: need to let you pick new char if won...else reset?

    STOPPING POINT = TRYING TO REMOVE DEFENDER FROM ENEMIES VARIABLE
    CREATE CHARACTER ARRAY FOR STORAGE TO RESET..

    -If no defender selected, can't attack - don't update attack value

*/

var currentGame;

$(document).ready(function() {

    // var currentGame;
    currentGame = new newGame();

    function newGame() {
        //game status and character triggers
        this.userCharacter;
        this.userCharacterName;
        //store characters for reset
        this.charArray;
        // this.ableToAttack;
        this.enemies;
        this.defender;
        this.defenderName;
        this.defenderSelected;
        this.ableToAttack = false;
        this.started = false;

        //player attributes
        this.userHP;
        this.userAttack;
        this.defenderHP;
        this.defenderCounter;
        this.attackResult;
        this.statusComment;
        this.statusElement;
        this.winCounter = 0;

        //gameplay functions
        this.startGame = function(user) {

            var that = this;

            //if game already started, ignore, otherwise set started
            if (this.started === true) {
                return;
            } else {
                this.started = true;
            }

            //update user character
            this.userCharacter = user;

            //create copy for reset
            this.charArray = $('.character');

            //show HP
            this.showHP();

            //assign user-character class
            this.userCharacter.addClass('user');

            //log user character's name
            this.userCharacterName = this.userCharacter.attr('id');

            //update game via setting global started variable status to true
            started = true;

            //assign user attributes for start of game
            this.userHP = parseInt(this.userCharacter.attr('data-hp'), 10);
            this.userAttack = parseInt(this.userCharacter.attr('data-attack'), 10);

            //grab status comment DOM element
            this.statusElement = $('#game-comment');

            //all other characters become enemies
            this.assignEnemy();

        };

        this.assignEnemy = function() {

            //select siblings and toggle enemy class
            this.userCharacter.siblings().addClass('enemy');

            //assign siblings to the enemies variable
            this.enemies = $('.enemy');

            //move enemy list to proper DOM section and then remove
            $('#enemy-array').append(this.enemies);

            //make rest of document visible
            this.visibleContents();

        };

        this.assignDefender = function(defender) {

            //only fire first time defender clicked on
            if (this.defender){
                return;
            }
            //make sure that defender isn't also the user
            if ($(defender).attr('id') === $(this.userCharacter).attr('id')){
                return;
            }
            //assign defender 
            this.defender = defender;
            this.defenderName = this.defender.attr('id');

            //toggle defender class for selections
            this.defender.addClass('defender')

            //assign defender attributes to start game
            this.defenderHP = parseInt(this.defender.attr('data-hp'), 10);
            this.defenderCounter = parseInt(this.defender.attr('data-counter'), 10);

            //enable subsequent attacking
            this.ableToAttack = true;

            //prevent selection of another defender whlle battle ongoing
            this.defenderSelected = true;

            //move defender down
            $('#defender-array').append(this.defender);

            this.statusElement.html('');

        };

        this.attack = function() {

            //local var to track attack value
            var attackValue;

            //address this scope closure issues
            var that = this;

            //break out of function if attack isn't a valid choice yet
            if (that.ableToAttack === false) {
                return;
            }

            //attack
            if (that.defenderHP <= that.userAttack) {
                that.defenderHP = 0;
                attackValue = that.defenderHP;
            } else {
                that.defenderHP -= that.userAttack;
                attackValue = that.userAttack;

                //increment user attack strength by 6 each round
                that.userAttack += 6;
            }

            //game comment update
            this.statusComment = (this.userCharacterName + " attacked " + this.defenderName + " inflicting " + attackValue + " of damage!");

            //display comment to screen
            this.statusElement.html(this.statusComment);

            //update defender HP text
            $(this.defender).find('.hp').text('HP: ' + this.defenderHP);

            //check for victory
            this.winCheck();

            //launch counterAttack of defender isn't dead
            if (!this.defender){
                console.log('not launching counter - dead');
                return;
            }
            else {
                this.counterAttack();
            }

        };

        this.counterAttack = function() {

            var attackValue;
            var that = this;

            if (that.ableToAttack === false){
                return;
            }

            //calculate new HP after counter attack
            if (that.userHP <= that.defenderCounter) {
                that.userHP = 0;
                attackValue = that.userHP;
            } else {
                that.userHP -= that.defenderCounter;
                attackValue = that.defenderCounter;
            }

            //game comment update
            this.statusComment += ('<br/>' + this.userCharacterName + " was counter-attacked " + this.defenderName + " inflicting " + attackValue + " of damage!");

            //display comment to screen
            this.statusElement.html(this.statusComment);

            //update user HP text
            this.userCharacter.find('.hp').text('HP: ' + this.userHP);

            //check for victory
            this.winCheck();

        };

        this.winCheck = function() {

            //remember to toggle defender selected to enable new choice..
            var that = this;

            //check for current match victory
            if (that.userHP === 0) {
                that.statusElement.html('You lost, press reset to try again!');
                that.ableToAttack = false;
                return;
            } //remove defeated defender
            else if (that.defenderHP === 0) {

                //update win counter
                that.winCounter++;

                //remove defender
                $('.defender').remove();

                //this will enable another defender to be selected
                currentGame.defender = '';

                //reset HP values
                that.showHP();

                //reset user HP
                that.userHP = parseInt(this.userCharacter.attr('data-hp'), 10);

                //status update for win 
                that.statusElement.html('You won this round! Pick a new enemy and try to become the master of the galaxy...');

                //make person pick another defender prior to being able to attack again
                that.ableToAttack = true;

            } //check to see if defender was defeated and no more defenders exist
            
            if (that.winCounter === 3) {

                that.statusElement.html('You are the master of the galaxy!!');
            }
        };

        this.reset = function() {

            //remove enemy class, move enemy and defender back to character list at top
            $(this.enemies).removeClass('enemy');
            $(this.userCharacter).removeClass('user');
            $(this.defender).removeClass('defender');

            $('#defender-array').empty();
            $('#enemy-array').empty();

            $('#character-array').append(currentGame.enemies);

            //reset all HP
            this.showHP();

            //reset all current game variables

            this.userCharacter = '';
            this.userCharacterName = '';
            //store characters for reset
            this.charArray = '';
            // this.ableToAttack;
            this.enemies = '';
            this.defender = '';
            this.defenderName = '';
            this.defenderSelected = '';
            this.ableToAttack = false;
            this.started = false;

            //player attributes
            this.userHP = '';
            this.userAttack = '';
            this.defenderHP = '';
            this.defenderCounter = '';
            this.attackResult = '';
            this.statusComment = '';
            this.statusElement = '';
            this.winCounter = 0;

            //CHANGE VISBILE CONTENTS
            this.visibleContents();

            return;
        };

        this.visibleContents = function() {

            if (currentGame.started === true) {
                $('#fight-section').css('visibility', 'initial');
                $('#enemy-list').css('visibility', 'initial');
                $('#defender-list').css('visibility', 'initial');
            } else {
                $('#fight-section').css('visibility', 'hidden');
                $('#enemy-list').css('visibility', 'hidden');
                $('#defender-list').css('visibility', 'hidden');

            }

        };

        this.showHP = function() {

            $('.character').each(function(index, value) {

                $(this).find('.hp').text('HP: ' + $(this).attr('data-hp'));

            });

        };
    }


    $('.character').on('click', function (e) {

        if (currentGame.started === true){
            currentGame.assignDefender($(this));
        }
        else {
            currentGame.startGame($(this));
        }
  
    });

    $('#attack').on('click', function() {

        console.log('attack click');
        currentGame.attack();

    });


    $('#reset').on('click', function() {

        currentGame.reset();

    });


});

