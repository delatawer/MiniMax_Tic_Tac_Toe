window.onload = function () {
    //initial states
    var num; //hold numbers from 1 to 9
    var box; //which element was clicked
    var ctx;
    var turn = 1; //the number of turns played
    var filled; // 9 array values to know the state of each zone
    var symbol; //which box is filled with which symbol
    var winner; //winning conditions
    var gameOver = false;
    var human = 'X';
    var ai = 'O';
    var result = {};
    
    filled = new Array();
    symbol = new Array();
    
    winner = [[0,1,2], [3,4,5], [6,7,8],
              [0,3,6], [1,4,7], [2,5,8],
              [0,4,8], [2,4,6]];
    for(var i=0; i<9; i++){
        filled[i] = false;
        symbol[i] = '';
    }
    
    //New Game event
    var n = document.getElementById("new");
    n.addEventListener("click", newGame);
    
    //Reload page
    function newGame() {
        document.location.reload()
    }
    
    //Canvas click 
    document.getElementById("tic").addEventListener("click",function(e){
        boxClick(e.target.id);
    });
    
    //Draw the X's and O's
    function drawX(){
        box.style.backgroundColor = "#fb5181";
        ctx.beginPath();
        ctx.moveTo(15,15);
        ctx.lineTo(85,85);
        ctx.moveTo(85,15);
        ctx.lineTo(15,85);
        ctx.lineWidth = 20;
        ctx.lineCap = "round";
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
        
        symbol[num-1] = human;
    }
    function drawO(next){
        box.style.backgroundColor = "#93f273";
        ctx.beginPath();
        ctx.arc(50,50,35,0,2*Math.PI);
        ctx.lineWidth = 18;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
        
        symbol[next] = ai;
    }
    
    //Checking winner
    function winnerCheck(symbol, player){
        for(var j=0; j<winner.length; j++){
            if((symbol[winner[j][0]] == player) &&
              (symbol[winner[j][1]] == player) &&
              (symbol[winner[j][2]] == player)){
                return true;
            }
        }
        return false;
    }
    
    //click box human
    function boxClick(numId){
        box = document.getElementById(numId)
        ctx = box.getContext("2d");
        switch(numId) {
            case "canvas1": num = 1;
                            break;
            case "canvas2": num = 2;
                            break;
            case "canvas3": num = 3;
                            break;
            case "canvas4": num = 4;
                            break;
            case "canvas5": num = 5;
                            break;
            case "canvas6": num = 6;
                            break;
            case "canvas7": num = 7;
                            break;
            case "canvas8": num = 8;
                            break;
            case "canvas9": num = 9;
                            break;
        }
        
        if(filled[num-1] === false){
            if(gameOver === false){
                if(turn%2 !== 0){
                    drawX();
                    turn += 1;
                    filled[num - 1] = true;
                    
                    if(winnerCheck(symbol,symbol[num-1]) === true){
                        document.getElementById("result").innerText = "Player '" + symbol[num-1] + "' won!";
                        gameOver = true;
                    }
                    if(turn > 9 && gameOver !== true){
                        document.getElementById("result").innerText = "Draw!";
                        gameOver = true;
                        return;
                    }
                    if(turn%2 === 0){
                        playAI();
                    }
                }
            }
            else{
                alert("Game over, please start a new game.")
            }
        }
        else{
            alert("This box was already filled.")
        }
    }
    
    //Find empty boxes for the ai
    function emptyBoxes(newSymbol){
        var j = 0;
        var empty_boxes = [];
        for(var i=0; i<newSymbol.length; i++){
            if(newSymbol[i] !== 'X' && newSymbol[i] !== 'O'){
                empty_boxes[j] = i;
                j += 1;
            }
        }
        return empty_boxes;
    }
    
    //Making the AI play 
    function playAI(){
        var nextMove = miniMax(symbol, ai); //Object that stores id of  next move and score of the box
        var nextId = "canvas" + (nextMove.id + 1);
        box = document.getElementById(nextId);
        ctx = box.getContext("2d")
        if(gameOver === false){
            if(turn%2 === 0){
                drawO(nextMove.id);
                turn += 1;
                filled[nextMove.id] = true;
                
                if(winnerCheck(symbol, symbol[nextMove.id]) === true){
                    document.getElementById("result").innerText = "AI won!";
                    gameOver = true;
                }
                if(turn > 9 && gameOver !== true){
                    document.getElementById("result").innerText = "Draw!";
                }
            }
        }
        else{
            alert("Game is over. Please click the new game button.")
        }
    }
    
    function miniMax(newSymbol, player){
        //recurring function that calls itself to find the optimal solution
        var empty = [];
        empty = emptyBoxes(newSymbol);
        
        if(winnerCheck(newSymbol, human)){
            return { score: -10 } // human wins
        }
        else if(winnerCheck(newSymbol, ai)){
            return { score: 10 }  // AI wins
        }
        else if(empty.length === 0){
            if(winnerCheck(newSymbol,human)){
                return { score: -10 }
            }
            else if(winnerCheck(newSymbol, ai)){
                return { score: 10 }
            }
            return { score: 0 } //game is draw
        }
        //stores the index and the score value
        var possible_moves = [];
        for(var i = 0; i<empty.length; i++){
            var current_move = {}; //index and score of current
            current_move.id = empty[i];
            newSymbol[empty[i]] = player;
            
            if(player === ai){
                result = miniMax(newSymbol, human);
                current_move.score = result.score;
            }
            else{
                result = miniMax(newSymbol, ai);
                current_move.score = result.score;
            }
            
            newSymbol[empty[i]] = '' //eliminate the change
            
            possible_moves.push(current_move); // id and score
            
        }
        
        var bestMove;
        //Max player should choose the max and min should choose the min
        if (player === ai){
            var highestScore = -100;
            for(var j = 0; j<possible_moves.length; j++){
                if (possible_moves[j].score > highestScore){
                    highestScore = possible_moves[j].score;
                    bestMove = j;
                }
            }
        }
        else{
            var lowestScore = 100;
            for(var j = 0; j<possible_moves.length; j++){
                if (possible_moves[j].score < lowestScore){
                    lowestScore = possible_moves[j].score;
                    bestMove = j;
                }
            }
        }
        return possible_moves[bestMove];
        
    }

};