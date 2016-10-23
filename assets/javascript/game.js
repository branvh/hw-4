

/*MISC TO DO LIST TO TWEAK GAME
	
	-Defender background coloring
	-Reset button moves to right side of defender
	-Keep getting type errors of undefined
	-Best way to reset variables to blank
	-Am I setting copies of DOM objects with assignment or creating a pointer?
	-Keep order of defenders same under reset and original load

	STOPPING POINT = TRYING TO REMOVE DEFENDER FROM ENEMIES VARIABLE
	CREATE CHARACTER ARRAY FOR STORAGE TO RESET..

*/

$(document).ready(function(){

var currentGame;
var started;

	$('.character').click(function(){

		//create a new game only not started
		if (!started){

			//no need for global var - all listeners, etc start here
			currentGame = new newGame($(this));
			currentGame.startGame();
		}

		$('.enemy').click(function (){

			if (!currentGame.defender){
				currentGame.assignDefender($(this));
			}

		});

		$('#attack').click(function (){

			if (currentGame.ableToAttack){
				currentGame.attack();
			}

		});

		$('#reset').click(function () {

			currentGame.reset();

		});

	});



	function newGame(user){
		//game status and character triggers
		this.userCharacter = user;
		this.userCharacterName;
		// this.ableToAttack;
		this.enemies;
		this.defender;
		this.defenderName;
		this.defenderSelected;
		this.ableToAttack;

		//player attributes
		this.userHP;
		this.userAttack;
		this.defenderHP;
		this.defenderCounter;
		this.attackResult;
		this.statusComment;
		this.statusElement;

		//gameplay functions
		this.startGame = function () {

			//show HP
			this.showHP();

			//assign user-character class
			this.userCharacter.toggleClass('user');

			//log user character's name
			this.userCharacterName = this.userCharacter.attr('id');

			//update game via setting global started variable status to true
			started = true;

			//assign user attributes for start of game
			this.userHP = this.userCharacter.attr('data-hp');
			this.userAttack = this.userCharacter.attr('data-attack');

			//grab status comment DOM element
			this.statusElement = $('#game-comment');

			//all other characters become enemies
			this.assignEnemy();

		};

		this.assignEnemy = function () {


			//select siblings and toggle enemy class
			this.userCharacter.siblings().toggleClass('enemy');

			//assign siblings to the enemies variable
			this.enemies = $('.enemy');

			//move enemy list to proper DOM section and then remove
			$('#enemy-array').append(this.enemies);

			//make rest of document visible
			this.visibleContents();

		};

		this.assignDefender = function (defender) {

			//assign defender 
			this.defender = defender;
			this.defenderName = this.defender.attr('id');

			//toggle defender class for selections
			this.defender.addClass('defender');

			//assign defender attributes to start game
			this.defenderHP = this.defender.attr('data-hp');
			this.defenderCounter = this.defender.attr('data-counter');

			//enable subsequent attacking
			this.ableToAttack = true;	

			//prevent selection of another defender whlle battle ongoing
			this.defenderSelected = true;

			//move defender down
			$('#defender-array').append(this.defender);

		};

		this.attack = function () {

			//local var to track attack value
			var attackValue;

			
			//attack
			if (this.defenderHP <= this.userAttack) {
				this.defenderHP = 0;
				attackValue = this.defenderHP;
			}
			else {
				this.defenderHP -= this.userAttack;
				attackValue = this.userAttack;

				//increment user attack strength by 6 each round
				this.userAttack += 6;
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
			this.counterAttack(this.userHP, this.defenderCounter);

		};

		this.counterAttack = function (userHP, defenderCounter) {

			var attackValue;

			//calculate new HP after counter attack
			if (this.userHP <= this.defenderCounter) {
				this.userHP = 0;
				attackValue = this.userHP;
			}
			else {
				this.userHP -= this.defenderCounter;
				attackValue = this.defenderCounter;
			}

			//game comment update
			this.statusComment += ('<br/>' + this.userCharacterName + " was couonter-attacked " + this.defenderName + " inflicting " + attackValue + " of damage!");

			//display comment to screen
			this.statusElement.html(this.statusComment);

			//update user HP text
			this.userCharacter.find('.hp').text('HP: ' + this.userHP);

			//check for victory
			this.winCheck();

		};

		this.winCheck = function () {

		//remember to toggle defender selected to enable new choice..

			//check for current match victory
			if (this.userHP === 0){
				this.statusElement.html('You lost, press reset to try again!');
				this.ableToAttack = false;
				return;
			}	//remove defeated defender
			else if (this.defenderHP === 0){

				//remove defender
				$('.defender').remove();

				//this will enable another defender to be selected
				this.defender = '';

				//remove item from enemies array
				$(this.enemies).filter('.defender').remove();

				//reset HP values
				this.showHP();

				//make person pick another defender prior to being able to attack again
				this.ableToAttack = true;

			}  //check to see if defender was defeated and no more defenders exist
			else if (this.defenderHP === 0 && !this.enemies) {

				this.statusElement.html('You are the master of the galaxy!!');

			}
			else if (this.defenderHP === 0 && this.enemies) {

				this.statusElement.html('You won this round! Pick a new enemy and try to become the master of the galaxy...');

			}


		};

		this.reset = function () {

			//remove enemy class, move enemy and defender back to character list at top
			$(this.enemies).removeClass('enemy');
			$('#character-array').append(this.enemies);
			$('#character-array').append(this.defender);

			//reset all HP
			this.showHP();

			//remove user character status
			$(this.userCharacter).removeClass('user');

			//reset all current game variables

			this.userCharacter;
			this.userCharacterName;
			this.enemies;
			this.defender;
			this.defenderName;
			this.defenderSelected;
			this.userHP;
			this.userAttack;
			this.defenderHP;
			this.defenderCounter;
			this.attackResult;
			this.statusComment;
			this.statusElement;

			//destroy existing game
			currentGame = '';


		};

		this.visibleContents = function () {

			if (started){
				$('#fight-section').css('visibility','initial');
				$('#enemy-list').css('visibility','initial');
				$('#defender-list').css('visibility','initial');
			}
			else {
				$('#fight-section').css('visibility','hidden');
				$('#enemy-list').css('visibility','hidden');
				$('#defender-list').css('visibility','hidden');

			}

		};

		this.showHP = function () {

				$('.character').each( function(index,value){

					$(this).find('.hp').text('HP: ' + $(this).attr('data-hp'));

			});

		};
	}

});
