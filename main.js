// Get modal elements
const shadow = document.getElementById('modal-shadow');
const modal = document.getElementById('modal');
const pvpForm = document.getElementById('pvpForm');
const pvcForm = document.getElementById('pvcForm');
const winDiv = document.getElementById('winDiv');
const tieDiv = document.getElementById('tieDiv');


// Opens 2-Player form
function toggleModal(e) {
    e.preventDefault() // Prevent form submission
    const id = e.target.getAttribute('id'); // get id

    // Hide modal
    if (id === 'modal-shadow' || id === 'modal2' || id === 'modal1') {
        shadow.style.display = 'none';
        modal.style.display = 'none';
        pvpForm.style.display = 'none';
        pvcForm.style.display = 'none';
        winDiv.style.display = 'none';
        tieDiv.style.display = 'none';
        return;
    }
    // Display modal
    shadow.style.display = 'block';
    if (id === 'pvp') {
        // Display 2 player form
        modal.style.display = 'flex';
        pvpForm.style.display = 'grid';
        return;
    }
    // Display 1 player form
    modal.style.display = 'flex';
    pvcForm.style.display = 'grid'
}

// Open modals on button click
const pvpButton = document.getElementById('pvp'); // 2-Player
pvpButton.addEventListener('click', toggleModal);
const pvcButton = document.getElementById('pvc'); // 1-Player
pvcButton.addEventListener('click', toggleModal);

// Close modal on shadow click
shadow.addEventListener('click', toggleModal)

// An object that stores the game board & its actions
const gameBoard = {
    tiles: [   // getElementsByClassName //////////////////////////////////////
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
    availableTiles() { return gameBoard.tiles.filter(tile => tile.getAttribute('class') === 'gameTile') },
    hasWin(array) {
        // check if tiles are filled
        const oTiles = this.availableTiles();
        const firstIsFilled = !oTiles.filter(oTile => oTile === array[0]);
        const midIsFilled = !oTiles.filter(oTile => oTile === array[1]);
        const lastIsFilled = !oTiles.filter(oTile => oTile === array[2]);
        if (firstIsFilled && midIsFilled && lastIsFilled) { 
            // check if icons are the same
            const firstIsX = this.getIcons(array[3]).skull.style.display === 'block';
            const midIsX = this.getIcons(array[4]).skull.style.display === 'block';
            const lastIsX = this.getIcons(array[5]).skull.style.display === 'block';
            if ((firstIsX && midIsX && lastIsX) || (!firstIsX && !midIsX && !lastIsX)) {
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

    getPlayers(id) {    
        if (id === 'modal2') { // If 2-player
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
        // Prevent form submission
        e.preventDefault()
        let id = e.target.getAttribute('id'); 
        let players = gameFlow.getPlayers(id);

        if (!players.player1.name || !players.player2.name) {
            if (id === 'modal2') {// Show error
                document.getElementById('error2').style.display = 'block';
                return;
            }
            document.getElementById('error1').style.display = 'block';
            return;
        }

        toggleModal(e);
        gameFlow.resetGame(); // Reset Game
        gameFlow.players = players;// Fill players object
        for (let i = 0; i < 9; i++){ // Add event listeners to game pieces
            gameBoard.tiles[i].addEventListener('click', gameFlow.addMark);
        }
    },

    computerMove() {
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
        const openTiles = gameBoard.availableTiles();
        if (!(openTiles.filter(openTile => openTile === gameBoard.tiles[index]))){
            return;
        }
        // Change background color
        e.target.className = 'selectedTile';
        // If 1-player game
        if (player2.name === 'computer') {

            // Add mark to game tile & update counter
            gameBoard.showIcon(index, player1.mark);
            counter.add()

            // Check for win/tie
            if (gameFlow.hasWon()){
                gameFlow.returnWinner(player1.mark);
                gameFlow.resetGame();
                return;
            } else if (gameFlow.hasTie()) {
                gameFlow.resetGame();
                return;
            }

            // Get computer move
            let computerIndex = gameFlow.computerMove();
            gameBoard.showIcon(computerIndex, player2.mark);
            gameBoard.tiles[computerIndex].className = 'selectedTile';
            counter.add()

            // Check for winner/tie again
            if (gameFlow.hasWon()){
                gameFlow.returnWinner(player2.mark);
                gameFlow.resetGame();
                return;
            } else if (gameFlow.hasTie()) {
                gameFlow.resetGame();
                return;
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

        // Check for win/tie
        if (gameFlow.hasWon()){
            gameFlow.returnWinner(currentPlayer.mark);
            gameFlow.resetGame();
            return;
        }
        else if (gameFlow.hasTie()) {
            gameFlow.resetGame();
            return;
        }


        // If player2 is computer
        return;
    },
    
    hasWon()  {
        const winCases = {
            horizontalTop: [gameBoard.tiles[0], gameBoard.tiles[1], gameBoard.tiles[2], 0, 1, 2],
            horizontalMid: [gameBoard.tiles[3], gameBoard.tiles[4], gameBoard.tiles[5], 3, 4, 5],
            horizontalBot: [gameBoard.tiles[6], gameBoard.tiles[7], gameBoard.tiles[8], 6, 7, 8],
            verticalTop: [gameBoard.tiles[0], gameBoard.tiles[3], gameBoard.tiles[6], 0, 3, 6],
            verticalMid: [gameBoard.tiles[1], gameBoard.tiles[4], gameBoard.tiles[7], 1, 4, 7],
            verticalBot: [gameBoard.tiles[2], gameBoard.tiles[5], gameBoard.tiles[8], 2, 5, 8],
            diagonalL: [gameBoard.tiles[0], gameBoard.tiles[4], gameBoard.tiles[8], 0, 4, 8],
            diagonalR: [gameBoard.tiles[6], gameBoard.tiles[4], gameBoard.tiles[2], 6, 4, 2],
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


