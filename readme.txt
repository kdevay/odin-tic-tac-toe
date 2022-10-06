1. pick game type by clicking pumpkin, which opens a modal:
    -2player form
    -p vs c form
   Submitting form stores name & X or O status in player object















General:
have as little global code as possible
if you only ever need ONE of something, use a module (gameBoard, displayController), 
If you need multiples of something create them with factories (players!), 
Each function fits in game, player or gameboard objects

Functions:
-renders the gameboard array
-allow players to add marks to a specific spot on the board (function)
-random computer choice function: generate number corresponding to array index


Gameboard object
-store the gameboard as an array 
-control the flow of the game:
--alternate bw X and O
--game is over when 3-in-a-row and a tie.

players stored in objects
-allow players to put in their names


MVP
-button to start/restart the game 
-Modal congratulates the winning player
-2 player
-(do this last) player vs computer


It is possible to create an unbeatable AI using the minimax algorithm.
If you get this running, show it off in the chatroom. It’s quite an accomplishment!