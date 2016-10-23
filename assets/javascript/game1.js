

//attack button listener

//defender's hp

//when hp <= 0, remove from screen and chose new opponent

//each character has 3 attributes: health points, attack power, counter attack power - must differ

//each attack increases base attack power by 6

//enemy has on attribute: COUNTER attack power; never changes

//no healing or health point recovery


//your character

//enemies to attack

//defender

//list actions at bottom

//attack button - you attack X character for Y damage and they counter attacked for Z damage

//announce defeat ... game over .. can restart



//load page

/* PSEUDO CODE

load page

click event - character selection

create a new game object - properties of user character, enemy character, attack status,
attack function, counter attack function, score update function, win chec, function
display text function, property of char names and char attributes

clicked character assigned player class

create a user character object

all other assigned enemy class

select all enemy objects

move them into the enemy row

enemy event click listener -

on click assign defender class

create a defender object

move defender out of the enemy selection row

??make is so that these are not selectable until 
??attacking status is removed

??on click check to see if defender exists, if yes, ignore if no, create a defender

display attack button

attack button event listener -

set an attacking status to active

calculate user attack value
remove attack value from enemy health
display attack outcome
increase your attack value for next iteration
enemy counter attacks
reduce your health value
display counter attack outcome
update yours and enemies health values

*/

/*MISC TO DO LIST TO TWEAK GAME
	
	-Defender background coloring
	-Reset button moves to right side of defender
	-Keep getting type errors of undefined

*/

var started;
var ableToAttack;
var currentGame;

$(document).ready(function(){


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

			if (ableToAttack){
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

			//assign defender attributes to start game
			this.defenderHP = this.defender.attr('data-hp');
			this.defenderCounter = this.defender.attr('data-counter');

			//enable subsequent attacking
			ableToAttack = true;	

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
			this.defender.find('.hp').text('HP: ' + this.defenderHP);

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

		};

		this.reset = function () {

			//remove enemy class, move enemy and defender back to character list at top
			$(this.enemies).toggleClass('enemy');
			$('#character-array').append(this.enemies).append(this.defender);

			//reset all HP
			this.showHP();

			//remove user character status
			$(this.userCharacter).toggleClass('user');

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

			//
			started, ableToAttack = false;

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
