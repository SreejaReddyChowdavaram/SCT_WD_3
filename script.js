const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let board;
let currentPlayer;
let running;
let mode;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", handleClick));

function startGame(selectedMode) {
  mode = selectedMode;
  board = ["","","","","","","","",""];
  currentPlayer = "X";
  running = true;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("x","o","win");
  });

  statusText.textContent = "Player X's Turn";
}

function handleClick() {
  const index = this.dataset.index;

  if (!running || board[index] !== "") return;

  makeMove(index, currentPlayer);

  if (checkWinner(currentPlayer)) return;

  if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    running = false;
    return;
  }

  if (mode === "pvp") {
    switchPlayer();
  } else {
    currentPlayer = "O";
    statusText.textContent = "Computer Thinking...";
    setTimeout(() => {
      if (mode === "easy") easyMove();
      else hardMove();
    }, 400);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function easyMove() {
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  let random = empty[Math.floor(Math.random()*empty.length)];
  makeMove(random,"O");
  afterComputerMove();
}

function hardMove() {
  let bestScore = -Infinity;
  let move;

  for (let i=0;i<9;i++){
    if (board[i]===""){
      board[i]="O";
      let score = minimax(board,0,false);
      board[i]="";
      if (score>bestScore){
        bestScore=score;
        move=i;
      }
    }
  }

  makeMove(move,"O");
  afterComputerMove();
}

function minimax(newBoard, depth, isMaximizing){
  if (checkWinner("O", true)) return 10 - depth;
  if (checkWinner("X", true)) return depth - 10;
  if (!newBoard.includes("")) return 0;

  if (isMaximizing){
    let best = -Infinity;
    for (let i=0;i<9;i++){
      if (newBoard[i]===""){
        newBoard[i]="O";
        best=Math.max(best,minimax(newBoard,depth+1,false));
        newBoard[i]="";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i=0;i<9;i++){
      if (newBoard[i]===""){
        newBoard[i]="X";
        best=Math.min(best,minimax(newBoard,depth+1,true));
        newBoard[i]="";
      }
    }
    return best;
  }
}

function afterComputerMove(){
  if (checkWinner("O")) return;

  if (!board.includes("")){
    statusText.textContent="It's a Draw!";
    running=false;
    return;
  }

  currentPlayer="X";
  statusText.textContent="Player X's Turn";
}

function checkWinner(player, simulate=false){
  for (let pattern of winPatterns){
    if (pattern.every(index=>board[index]===player)){
      if (!simulate){
        pattern.forEach(i=>cells[i].classList.add("win"));
        statusText.textContent=
          mode==="pvp"
            ? `Player ${player} Wins! 🎉`
            : player==="X"
              ? "You Win! 🎉"
              : "Computer Wins! 🤖";

        running=false;
      }
      return true;
    }
  }
  return false;
}

function resetGame(){
  running = false;
  board = ["","","","","","","","",""];
  cells.forEach(cell=>{
    cell.textContent="";
    cell.classList.remove("x","o","win");
  });
  statusText.textContent="Select Mode";
}