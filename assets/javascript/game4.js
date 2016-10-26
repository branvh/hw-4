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

*/

var game = {


    characters: [{Name: 'Han-Solo', HP: 105 , Attack: 15, Counter: 20},
                {Name: 'Darth-Vander', HP: 115 , Attack: 20, Counter: 25},
                {Name: 'Rey', HP: 100 , Attack: 20, Counter: 10},
                {Name: 'Storm-Trooper', HP: 90 , Attack: 18, Counter: 12},],
    started: false,
    wins: 0,
    user: '',
    userHP: 0,
    userAttack: 0,
    rolesAssigned: false,
    defender: '',
    defenderHP: 0,
    defenderCounter: 0,
    start: function (selection) {

        if (this.started === true){

            return;
        } 
        else this.started = true;

        //load event listeners to the characters
        this.addListeners();

    },
    addListeners: function () {

        var char;

        $(game.characters).each(function(index,value) {

            char = document.getElementById(game.characters[index]['Name']);

            $(char).on('click', function () {

                game.assignRoles($(this), index);

            });

        });

    },
    assignRoles: function (user, index) {

        //don't continue to enable role assignment while game live
        if (this.rolesAssigned === true){
            console.log('tried to assign role again');
            return;
        }

        //set user  
        this.user = user;
        $(this.user).addClass('user');

        //set user attributes
        this.userHP = game.characters[index]['HP'];
        this.userAttack = game.characters[index]['Attack'];

        //set enemies
        this.enemies = $(this.user).siblings();
        $(this.enemies).addClass('enemy');

        //move enemies to the enemy row
        $('#enemy-array').append(this.enemies);

        //show bottom of page
        this.visibleContents();

        //prevent duplicate event firing
        this.rolesAssigned = true;

        //remove old
        this.removeListeners();

    },
    visibleContents: function () {

            if (this.started) {
                $('#fight-section').css('visibility', 'initial');
                $('#enemy-list').css('visibility', 'initial');
                $('#defender-list').css('visibility', 'initial');
            } else {
                $('#fight-section').css('visibility', 'hidden');
                $('#enemy-list').css('visibility', 'hidden');
                $('#defender-list').css('visibility', 'hidden');

            }

    },
    assignDefender: function (choice) {

        console.log('assigining defender');
        this.defender = choice;
        console.log($(this.defender).attr('id'));

        ('#defender-array').append(this.choice);

    },
    removeListeners: function () {

         $(game.characters).each(function(index,value) {

            char = document.getElementById(game.characters[index]['Name']);

            char.removeEventListener('click',game.start);

        });
    },
    reset: function () {

            if (this.reset){

            //reset page and chars back up top
            var char = $('.character');
            $('#character-array').append(char);
            
            //get rid of enemy class
            $('.character').removeClass('.enemy').removeClass('.defender');
            
            //reset win counter
             this.wins = 0;

             //made bottom of page invisible
             this.visibleContents();

             this.reset = false;
            
        }
    }




}

$(document).ready(function () {


    $('#character-selection').on('click', function(e){

        // console.log("event object",e);
        // var index = e.target.dataset.index; 
        // console.log("element index", index);
        // var playerClicked = game.characters[index];
        // console.log("this.players[index]", playerClicked );

        game.start();

    });


    $('.enemy').on('click', function () {

        game.assignDefender($(this));

    });


});


//start w/ an init function and call to reset
//mess with classes for enemy/selection
