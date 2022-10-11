// Import modal elements
const shadow = document.getElementById('modal-shadow');
const pvpForm = document.getElementById('pvpForm');
const pvcForm = document.getElementById('pvcForm');
const winDiv = document.getElementById('winDiv');
const tieDiv = document.getElementById('tieDiv');


// Opens 2-Player form
function openModal(e) {
    // Prevent form submission
    e.preventDefault()
    // Display shadow
    shadow.style.display = 'flex';

    if (e.target.getAttribute('id') === 'pvp') {
        // Display 2 player form
        pvpForm.style.display = 'grid';
        return;
    }
    // Display 1 plater form
    pvcForm.style.display = 'grid'
}

// Import buttons that open modals
const pvpButton = document.getElementById('pvp');// 2-Player
pvpButton.addEventListener('click', openModal);
const pvcButton = document.getElementById('pvc');// 1-Player
pvcButton.addEventListener('click', openModal);


// An object that stores the game board & its actions
const gameBoard = {
    tiles: [   
        document.getElementById('t0'),
        document.getElementById('t1'),
        document.getElementById('t2'),
        document.getElementById('t3'),
        document.getElementById('t4'),
        document.getElementById('t5'),
        document.getElementById('t6'),
        document.getElementById('t7'),
        document.getElementById('t8')
    ],
    addText(index, string) {
        this.tiles[index].textContent = string; 
        return; 
    },
    clearText(index) { 
        this.tiles[index].textContent = ' '; 
        return; 
    },
    isAvailable(index) {return this.tiles[index].textContent === ' ' ? true : false},
    availableTiles() { // return an array of all available tiles
        let availableTiles = [];
        for (let i = 0; i < 9; i++){
            if (this.isAvailable(i)){
                availableTiles.push(i);
            }
        }
        return availableTiles;
    },
    hasWin(array) {
        // check if tiles are filled
        let allAreFilled = !this.isAvailable(array[0]) && !this.isAvailable(array[1]) && !this.isAvailable(array[2]);
        if (allAreFilled) { 
            // check if content is matching
            if(this.tiles[array[0]].textContent === this.tiles[array[1]].textContent && this.tiles[array[1]].textContent === this.tiles[array[2]].textContent) {
                return true;
            }
        }
        return false;
    }
};

const counter = {
    count: 0,
    add() {this.count++},
    reset() {this.count = 0}
};


// Module that plays one game of tic tac toe
const gameFlow = {
    players: {},

    getPlayers(button) {
        
        shadow.style.display = 'none'; // hide modal
        
        if (button.getAttribute('id') === 'modal2') { // If 2-player
            const players = {
                player1: { name: document.getElementById('playerX').value, mark: 'X'},
                player2: { name: document.getElementById('playerO').value, mark: 'O'},
            }
            pvpForm.style.display = 'none'; // hide form
            return players;
        
        }
        const name = document.getElementById('name').value // If 1-player
        const isX = document.getElementById('radioX').checked;
        const players = {
            player1: {name, mark: (isX ? 'X' : 'O')},
            player2: { name: 'computer', mark: (isX ? 'O' : 'X')},
        }
        pvcForm.style.display = 'none'; // hide form
        return players;
    },

    resetGame() {
        for (let i = 0; i < 9; i++){
            gameBoard.clearText(i); // clear tiles
        }counter.reset(); // Reset counter
        gameFlow.players = {}; // Clear players object
    },

    startGame(e) {
        gameFlow.resetGame(); // Reset Game
        let button = e.target; // Fill players object
        gameFlow.players = gameFlow.getPlayers(button);
        for (let i = 0; i < 9; i++){ // Add event listeners to game pieces
            gameBoard.tiles[i].addEventListener('click', gameFlow.addMark);
        }
    },

    computerMove() {
        let tiles = gameBoard.availableTiles(); // Create array of available tiles
        let choice = Math.floor(Math.random() * tiles.length); // Create random number <= length of array
        return tiles[choice]; // return random number as tile index
    },

    addMark(e) {
        // Buttons only function if user has selected player form
        if (gameFlow.players.player1 === undefined) {
            return;
        }

        //Get players
        const player1 = gameFlow.players.player1;
        const player2 = gameFlow.players.player2;

        // Find tile index from button id
        const index = e.target.getAttribute('id').substring(1);
        // Ensure space is available
        if (!gameBoard.isAvailable(index)){
            return;
        }

        // If 1-player game
        if (player2.name === 'computer') {

            // Add mark to game tile & update counter
            gameBoard.addText(index, player1.mark);
            counter.add()

            // Begin checking for winner if move count >= 5
            if (counter.count >= 5) {
                if (gameFlow.hasWon()){
                    gameFlow.returnWinner(player1.mark);
                    return;
                }
                if (counter.count === 9) {
                    // Check for tie
                    if (gameFlow.hasTie()) {
                        return;
                    }
                } 
            }

            // Get computer move
            let computerIndex = gameFlow.computerMove();
            gameBoard.addText(computerIndex, player2.mark);
            counter.add()
            //Check for winner again
            if (counter.count >= 5) {
                if (gameFlow.hasWon()){
                    gameFlow.returnWinner(player2.mark);
                    return;
                }
                if (counter.count === 9) {
                    // Check for tie
                    if (gameFlow.hasTie()) {
                        return;
                    }
                } 
            }
            return;
        }

        // If 2-Player game, check whose move it is
        let currentPlayer;
        if (counter.count === 0 || counter.count % 2 === 0 ){
            currentPlayer = player1;
        } else {
            currentPlayer = player2;
        }

        // Add mark to game tile & update counter
        gameBoard.addText(index, currentPlayer.mark);
        counter.add()

        // Begin checking for winner if move count >= 5
        if (counter.count >= 5) {
            if (gameFlow.hasWon()){
                gameFlow.returnWinner(currentPlayer.mark);
                return;
            }
            if (counter.count === 9) {
                // Check for tie
                if (gameFlow.hasTie()) {
                    return;
                }
            } 
        }

        // If player2 is computer
        return;
    },
    
    hasWon()  {
        const winCases = {
            horizontalTop: [0, 1, 2],
            horizontalMid: [3, 4, 5],
            horizontalBot: [6, 7, 8],
            verticalTop: [0, 3, 6],
            verticalMid: [1, 4, 7],
            verticalBot: [2, 5, 8],
            diagonalL: [0, 4, 8],
            diagonalR: [6, 4, 2],
            isWin(array) {return gameBoard.hasWin(array)}
        }
        if (winCases.isWin(winCases.horizontalTop)) {
            return true;
        } else if (winCases.isWin(winCases.horizontalMid)) {
            return true;
        } else if (winCases.isWin(winCases.horizontalBot)) {
            return true;
        } else if (winCases.isWin(winCases.verticalTop)) {
            return true;
        } else if (winCases.isWin(winCases.verticalMid)) {
            return true;
        } else if (winCases.isWin(winCases.verticalBot)) {
            return true;
        } else if (winCases.isWin(winCases.diagonalL)) {
            return true;
        } else if (winCases.isWin(winCases.diagonalR)) {
            return true;
        }
        return false;
    },
    hasTie() {
        // If none of the tiles are available
        if (gameBoard.availableTiles().length === 0){
            //display tie game element
            shadow.style.display = 'flex';
            tieDiv.style.display = 'flex';
            return true;
        }
        return false;
    },
    
    returnWinner(string) {
        // Open modal
        shadow.style.display = 'flex';
        winDiv.style.display = 'flex';

        // Import winner display element
        const winner = document.getElementById('winner');

        // check players
        const player1 = gameFlow.players.player1;
        const player2 = gameFlow.players.player2;

        if (player1.mark === string){
            winner.textContent = player1.name;
            return;
        }
        winner.textContent = player2.name;
        // id of winning p = winner
        return;
    }
};

// Import buttons that submit player info
const submitPVPButton = document.getElementById('modal2');// 2-Player
submitPVPButton.addEventListener('click', gameFlow.startGame);
const submitPVCButton = document.getElementById('modal1');
submitPVCButton.addEventListener('click', gameFlow.startGame);
// Clears game tiles
const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', gameFlow.resetGame);


// use this for x's: ✕