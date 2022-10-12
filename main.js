// Import modal elements
const shadow = document.getElementById('modal-shadow');
const modal = document.getElementById('modal');
const pvpForm = document.getElementById('pvpForm');
const pvcForm = document.getElementById('pvcForm');
const winDiv = document.getElementById('winDiv');
const tieDiv = document.getElementById('tieDiv');


// Opens 2-Player form
function toggleModal(e) {
    // Prevent form submission
    e.preventDefault()
    // Display shadow
    if (e.target.getAttribute('id') === 'modal-shadow'){
        // close modal
        shadow.style.display = 'none';
        modal.style.display = 'none';
        pvpForm.style.display = 'none';
        pvcForm.style.display = 'none';
        winDiv.style.display = 'none';
        tieDiv.style.display = 'none';
        return;
    }
    shadow.style.display = 'block';
    if (e.target.getAttribute('id') === 'pvp') {
        // Display 2 player form
        modal.style.display = 'flex';
        pvpForm.style.display = 'grid';
        return;
    }
    // Display 1 plater form
    modal.style.display = 'flex';
    pvcForm.style.display = 'grid'
}

// Open modals on button click
const pvpButton = document.getElementById('pvp');// 2-Player
pvpButton.addEventListener('click', toggleModal);
const pvcButton = document.getElementById('pvc');// 1-Player
pvcButton.addEventListener('click', toggleModal);

// Close modal on shadow click
shadow.addEventListener('click', toggleModal)

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
    getIcons(index) {
        const ghost = document.getElementById('ghost' + index);
        const skull = document.getElementById('skull' + index);
        return {ghost, skull};
    },
    showIcon(index, string) {
        const icons = this.getIcons(index);
        if (string === 'skull'){
            icons.skull.style.display = 'block'; 
            return; 
        }
        icons.ghost.style.display = 'block'; 
        return; 
    }, 
    clearIcons() { 
        for (let i = 0; i < 9; i++){
            let icons = this.getIcons(i); 
            icons.skull.style.display = 'none'; 
            icons.ghost.style.display = 'none'; 
        }
        return; 
    },
    isAvailable(index) { 
        console.log('entered isAvailable: ', index);
        return this.tiles[index].getAttribute('class') === 'gameTile';
    },
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
        const allAreFilled = !this.isAvailable(array[0]) && !this.isAvailable(array[1]) && !this.isAvailable(array[2]);
        if (allAreFilled) { 
            // check if icons are the same
            const tile0isX = this.getIcons(array[0]).skull.style.display === 'block';
            const tile1isX = this.getIcons(array[1]).skull.style.display === 'block';
            const tile2isX = this.getIcons(array[2]).skull.style.display === 'block';
            if ((tile0isX && tile1isX && tile2isX) || (!tile0isX && !tile1isX && !tile2isX)) {
                return true;
            }
            return false;
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
        modal.style.display = 'none';
        pvpForm.style.display = 'none'; // hide form
        
        
        if (button.getAttribute('id') === 'modal2') { // If 2-player
            const players = {
                player1: { name: document.getElementById('playerX').value, mark: 'skull'},
                player2: { name: document.getElementById('playerO').value, mark: 'ghost'},
            }
            return players;
        
        }
        const name = document.getElementById('name').value // If 1-player
        const isX = document.getElementById('radioX').checked;
        const players = {
            player1: {name, mark: (isX ? 'skull' : 'ghost')},
            player2: { name: 'computer', mark: (isX ? 'ghost' : 'skull')},
        }
        pvcForm.style.display = 'none'; // hide form
        return players;
    },

    resetGame() {
        for (let i = 0; i < 9; i++) { // Clear styling
            gameBoard.tiles[i].className = 'gameTile';
        }
        gameBoard.clearIcons(); // clear tiles
        counter.reset(); // Reset counter
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
        console.log('entered computer move')
        let tiles = gameBoard.availableTiles(); // Get array of available tiles
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
        // Change background color
        e.target.className = 'selectedTile';
        // If 1-player game
        if (player2.name === 'computer') {

            // Add mark to game tile & update counter
            gameBoard.showIcon(index, player1.mark);
            counter.add()

            // Begin checking for winner if move count >= 5
            if (counter.count >= 5) {
                if (gameFlow.hasWon()){
                    gameFlow.returnWinner(player1.mark);
                    gameFlow.resetGame();
                    return;
                }
                if (counter.count === 9) {
                    // Check for tie
                    if (gameFlow.hasTie()) {
                        gameFlow.resetGame();
                        return;
                    }
                } 
            }

            // Get computer move
            let computerIndex = gameFlow.computerMove();
            gameBoard.showIcon(computerIndex, player2.mark);
            gameBoard.tiles[computerIndex].className = 'selectedTile';
            counter.add()
            //Check for winner again
            if (counter.count >= 5) {
                if (gameFlow.hasWon()){
                    gameFlow.returnWinner(player2.mark);
                    gameFlow.resetGame();
                    return;
                }
                if (counter.count === 9) {
                    // Check for tie
                    if (gameFlow.hasTie()) {
                        gameFlow.resetGame();
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
        gameBoard.showIcon(index, currentPlayer.mark);
        counter.add()

        // Begin checking for winner if move count >= 5
        if (counter.count >= 5) {
            if (gameFlow.hasWon()){
                gameFlow.returnWinner(currentPlayer.mark);
                gameFlow.resetGame();
                return;
            }
            if (counter.count === 9) {
                // Check for tie
                if (gameFlow.hasTie()) {
                    gameFlow.resetGame();
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
            shadow.style.display = 'block';
            modal.style.display = 'flex';
            tieDiv.style.display = 'flex';
            return true;
        }
        return false;
    },
    
    returnWinner(string) {
        // Open modal
        shadow.style.display = 'block';
        modal.style.display = 'flex';
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


