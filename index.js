/** Good start to your game. Your code is pretty readable and organized. If you have a bunch of function definitions and then one function that starts your game
 *  (like the directions function) think about maybe having that at the very end of your code so that it doesn't get lost in the midst of your definitions.
 *  You seem to have an okay understanding of objects and how to use them. I like that you sort of implemented your state machine into your room object that
 *  also has your room messages. As far as functionality, you are almost there. There is some weird behavior happening with your take and drop functions that
 *  you should take a look at. Also, I found a little cheat code in your game: if you start, then type take tea and then drop tea immediately after, I win!! Nice!
 *  Other than those things, see if you can work out how to restrict certain actions to specific rooms. Good work so far. **/
const readline = require('readline');

const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
// | - - - starter code - do not change above - - - |

let currentRoom = "outside";

// player object
/** Your player object is just an array which is the player inventory? **/
let inventory = []

let rooms = {
  /** Maybe allow outside to be able to change to foyer, if the user tries to enter the password without reading the sign, there is some funky behavior happening **/
  'outside': {canChangeTo: ['sign', 'outside'],   // outside is also known as "182 Main St."
              welcomeMessage: `182 Main St. You are standing on Main Street between Church and South Winooski. There is a door here. A keypad sits on the handle.\nOn the door is a handwritten sign.`
            },
  'sign':   {canChangeTo: ['outside', 'sign'],
             welcomeMessage: `The sign says "Welcome to Burlington Code Academy! Come on up to the third floor. If the door is locked, use the code 12345."`
            },
  'foyer': {canChangeTo: ['stairway', 'sign', 'foyer'],
            welcomeMessage:
            `You are in a foyer. Or maybe it's an antechamber. Or a vestibule. Or an entryway. Or an atrium. Or a narthex. But let's forget all that fancy flatlander\nvocabulary, and just call it a foyer. In Vermont, this is pronounced "FO-ee-yurr". You see a stairway ahead of you. A copy of Seven Days lies in a corner.`,
            locked : true
            },
  'stairway': {canChangeTo: ['hallway', 'foyer', 'stairway'],
               welcomeMessage:
              `You walk to the top of a long stair way and arrive at a landing. Ahead of you is a hallway`
              },
  'hallway': {canChangeTo: ['classroom', 'kitchen', 'hallway'],
              welcomeMessage:
              `You have entered a hallway and see the Burlington Code Academy classroom entrance with a kitchen to its left`
              },
  'classroom': {canChangeTo: ['hallway', 'classroom'],
              welcomeMessage:
              `You enter the BCA classroom and find instructor Bob lecturing to an empty classroom about recursion. He's clearly stuck in an infinite loop.\nYou notice his tea mug is empty`
               },
  'kitchen': {canChangeTo : ['hallway', 'kitchen'],
              welcomeMessage:
              `You enter the kitchen. There, you find some utensils, a coffee machine, and the ingredients to make some delicious green tea`
              },
};

// | - - - - - state machine - - - - - |

// func to govern allowable state (room) transitions
function enterState(newState) {
  let validTransitions = rooms[currentRoom].canChangeTo;
  if (validTransitions.includes(newState)) {
    currentRoom = newState;
  } else {
    console.log(`Can't go that way`);
  }
}

// | - - - initialize game  - - - |
async function directions() {
  let input = await ask(`Welcome to zorKington, a land of many mysteries and immense beauty. Throughout the game, you will encounter many treasures. To take an item with you, simply type the name 'take' and of the item. To drop an item, type 'drop_ item name'. To view your inventory, type 'inventory. \nIf you ever want to exit, just type 'exit'.\nPress enter to begin.`)
  if (input.includes('')) { /** This if statement will always be true, because any string entered, including an empty string, will contain an empty string **/
    start()
    enterState('outside')
  } else {
    directions()
  }
}

// | - - - begin game  - - - |
/** Good comments to separate out sections of your code, maybe a few more intermediate comments throughout big blocks, like if-else chains, would be good
 *  to improve readability **/

async function start() {
  console.log(rooms[currentRoom].welcomeMessage);

  let answer = await ask('What would you like to do? \n >_');
      answer = inputConverter(answer) // standardizes input to lower case, trimmed, string

  while(answer !== 'exit') {
    if (answer.includes('read')) {
      enterState('sign')
      console.log(rooms[currentRoom].welcomeMessage);
    }
    /** Should this be an else if? Changing this to an else if will fix the problem of the else block at the bottom being hit with each command, which is
     *  why I'm assuming it is commented out **/
    if (answer.includes('inventory')) {
      showInventory()
      }
    else if (answer === 'take sign') {
      console.log ('That would be selfish. How will other students find their way?')
    }
    /** What should the reponse be if the user enters the wrong password? **/
    else if (answer.includes('12345')) {
        console.log('Success! The door opens. You enter the foyer and the door shuts behind you\n ');
        rooms.foyer.locked = false
        rooms.sign.canChangeTo.push('foyer')
        enterState('foyer')
        console.log(rooms[currentRoom].welcomeMessage)
      }

    else if (answer.includes('take seven')) {
      console.log ('You pick up the paper and leaf through it looking for comics\nand ignoring the articles, just like everbody else does.');
      addToInventory('Seven Days')
    }

    else if (answer.includes('drop seven')) {
      dropFromInventory('Seven Days')
    }

    else if (answer.includes('stair') || answer.includes('up') || answer.includes('climb')) {
      enterState('stairway')
      console.log(rooms[currentRoom].welcomeMessage)
    }

    else if (answer.includes('hall')) {
      enterState('hallway')
      console.log(rooms[currentRoom].welcomeMessage);
    }

    else if (answer.includes('kitchen')) {
      enterState('kitchen')
      console.log(rooms[currentRoom].welcomeMessage)
    }
    /** You can pick up tea (and also seven days) from any room that you are in, maybe think about a way that only allows this if you are in the kitchen **/
    else if (answer.includes('take tea') || answer.includes('make tea')) {
      addToInventory('tea')
    }

    else if (answer.includes('class')) {
      enterState('classroom')
      console.log(rooms[currentRoom].welcomeMessage)
    }

    else if (answer.includes('give bob tea') || answer.includes('drop tea')) {
      dropFromInventory('tea')
      console.log('You win the game!')
      process.exit()
    }
    /** Why is this commented out? This is a good catch-all clause to catch input that the program doesn't understand! **/
    //else {
      //console.log("Sorry, I don't understand that.")
    //}
  answer = await ask('What would you like to do? \n >_')
  }
}



directions();

// | - - - process functions - do not change below  - - - |

// func to standardize input returning a lower case, trimmed, string
function inputConverter(string) {
  /** Here, you can save an intermediate variable and a line by changing this to: return string.toString().trim().toLowerCase() **/
  let converted = string.toString().trim().toLowerCase();
  return converted;
}
// func to return player inventory at a given time as a string
function showInventory() {
  console.log('You are carrying, ' + inventory.toString())
}
// func to add items to player's inventory
function addToInventory(toAdd) {
  inventory.push(toAdd)
  console.log('You have added ' + toAdd)
}
// func to remove
function dropFromInventory(toDrop) {
  console.log('You have dropped ' + toDrop)
  /** Careful with this, if the item you want to drop is not the last item in your inventory, then you will not be popping the correct item out of the array.
   *  You can find the index of a specific item using indexOf(toDrop) and then you can use the index of the item to splice the item out of the array like:
   *  inventory.splice(index, 1) this means remove 1 element starting at the index 'index'. This method returns the value that is spliced out in a new array.
   *  Ex:
   *    let inv = ['paper', 'keys' 'rock', 'pen'];
   *    let roomInventory = [];
   *    let itemToDrop = 'keys';
   *    let itemIndex = inv.indexOf(itemToDrop);
   *    let itemDropped = inv.splice(itemIndex, 1);  // inv = ['paper', 'rock', 'pen'], itemDropped = ['keys']
   *    roomInventory.push(itemDropped.toString())   // roomInventory = ['keys']
   *
   *    remember that once an item is spliced out of an array, it is returned in a new array, so you would need to turn the item into a string with toString() **/
  inventory.pop()
}
