function openPvpModal() {
    console.log('pvp')
    const shadow = document.getElementById('modal-shadow');
    shadow.style.display = 'flex';
    const pvpForm = document.getElementById('pvpForm');
    pvpForm.style.display = 'grid';
}

function openPvcModal() {
    console.log('pvc')
    const shadow = document.getElementById('modal-shadow');
    shadow.style.display = 'flex';
    const pvcForm = document.getElementById('pvcForm');
    pvcForm.style.display = 'grid'
}

// Import buttons
const pvpButton = document.getElementById('pvp');
pvpButton.addEventListener('click', gameFlow.players);
const pvcButton = document.getElementById('pvc');
pvcButton.addEventListener('click', gameFlow.players);
const resetButton = document.getElementById('reset');
pvcButton.addEventListener('click', gameFlow.resetGame);

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
    addText: (index, string) => {
        this.tiles[index].textContent = string; 
        return; 
    }
    clearText: (index) => { 
        this.tiles[index].textContent = ' '; 
        return; 
    },
    isAvailable: (index) => {return this.tiles[index].textContent === ' ' ? true : false}
}

// Add event listeners to game pieces
for (let i = 0; i < 9; i++){
    // clear tiles
    gameBoard.tiles[i].addEventListener('click', addMark);
}


// const startGameButton = 
// startGameButton.addEventListener('click', players.decide);

// Module that plays one game of tic tac toe
const gameFlow = (() => {
    const players = ((e) => {
        // start the game
        this.resetGame;
        // get player info depending on which button pressed
        if (e.target.getAttribute('id') === 'm-pvp'){
            // PVP Modal - returns an object containing player info for single-player game
            const pvpModal = {
                player1: { name: document.getElementById('playerX').getAttribute('value'), mark: 'X'},
                player2: { name: document.getElementById('playerO').getAttribute('value'), mark: 'O'}
            }
            return pvpModal;
        }
        // else if (e.target.getAttribute('id') ===  'm-pvc')
        // PVC Modal Module - returns an object containing nested player objects for single-player game
        const pvcModal = (() => {
            const name = document.getElementById('name').getAttribute('value')
            const isX = document.getElementById('radioX').getAttribute('checked')
            const player1 = {
                name,
                mark: isX ? 'X' : 'O'
            }
            const player2 = {
                name: 'computer',
                mark: isX ? 'O' : 'X'
            }
            return {
                player1,
                player2
            };
        })();
        return pvcModal;
    })();
    const resetGame = (() => {
        for (let i = 0; i < 9; i++){
            // clear tiles
            gameBoard.clearText(i) = ' ';
        }
        // Reset counter
        counter.reset();
    })();
    const addMark = ((e) => {
        // Find tile index from button id
        let index = e.target.getAttribute('index').substring(1)
        // Check if space is available
        gameBoard.isAvailable(e.target.getAttribute(index))
        // If not available return
        // If available check whose move it is
    })();

})();


const counter = {
    count: 0,
    add: () => {return this.count++},
    reset: () => {
        this.count = 0;
    return;},
}


















//  #modal-shadow display: flex;

// maxiumum moves per player-- if first 5 moves; if second 4 moves //// 9 moves total
// minimum moves per player-- 3 //// 5 moves total

/*
    0  1  2
    3  4  5
    6  7  8
*/

// 8 ways to win
// across: 0, 1, 2;  3, 4, 5;  6, 7, 8
//   down: 0, 3, 6;  1, 4, 7;  2, 5, 8
//   diag: 0, 4, 8;  6, 4, 2




















// use this for x's: ✕