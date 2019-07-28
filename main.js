window.onload = () => {
     getRanking();
     getMatch();
}

displayPlayers();

//============================================================//
//        Add player                                          //
//============================================================//
function addPlayer() {
     let players = JSON.parse(localStorage.getItem("players") || "[]")
     let name = document.getElementById("player-name").value;
     if (/^[\w]+$/.test(name)) {
          players.push({
               name: name,
               played: 0,
               points: 0
          })
          localStorage.setItem("players", JSON.stringify(players));
     } else {
          window.alert('Enter a valid name')
     }
     document.getElementById("player-name").value = '';

     displayPlayers()
}

//============================================================//
//        Delete player                                       //
//============================================================//
function deletePlayer(i) {
     let players = JSON.parse(localStorage.getItem("players"))
     players.splice(i, 1)
     localStorage.setItem("players", JSON.stringify(players));
     displayPlayers()
}

//============================================================//
//        Display playe                                       //
//============================================================//
function displayPlayers() {
     let players = JSON.parse(localStorage.getItem("players") || "[]")
     var t = "";
     for (var i = 0; i < players.length; i++) {
          var tr = "<tr>";
          tr += `<td>${i + 1}</td>`;
          tr += `<td>
               <i class="far fa-user"></i> 
               ${players[i].name} 
               <i class="fas fa-times delete" onclick="deletePlayer(${i})"></i>
          </td>`;
          tr += "</tr>";
          t += tr;
     }
     document.getElementById("players-list").innerHTML = t;
}

//============================================================//
//        Start game                                          //
//============================================================//
function startGame() {
     let players = JSON.parse(localStorage.getItem("players") || "[]")
     if (players.length > 1) {
          // store limit in Local storage
          limit = document.getElementById("gameLimit").value
          localStorage.setItem("limit", limit);

          //store currentRound in Local storage
          let currentRound = []
          players.forEach((a, i) => {
               currentRound.push(i)
          })

          // store match
          localStorage.setItem("match", JSON.stringify([0, 1]));
          currentRound.splice(0, 1)
          localStorage.setItem("currentRound", JSON.stringify(currentRound));

          localStorage.setItem("nextRound", JSON.stringify([]));

          //redirect to play.html
          window.location.href = "play.html";
          resetScores()
          getMatch()
          playEnd()
     } else {
          window.alert('Ther should be up to 3 players to begin a tournamnet')
     }

}

//============================================================//
//        Get player rankings                                 //
//============================================================//
function getRanking() {
     let players = JSON.parse(localStorage.getItem("players"));
     let playersV = players.sort((a, b) => (a.points < b.points) ? 1 : -1)
     var t = "";
     for (var i = 0; i < playersV.length; i++) {
          var tr = "<tr>";
          tr += `<td>${i + 1}</td>`;
          tr += `<td><i class="far fa-user"></i>${players[i].name}</td>`;
          tr += `<td>${players[i].played}</td>`;
          tr += `<td>${players[i].points}</td>`;
          tr += "</tr>";
          t += tr;
     }
     document.getElementById("rank-table").innerHTML = t;
}

//============================================================//
//        Get next match of players                           //
//============================================================//
function getMatch() {
     let players = JSON.parse(localStorage.getItem("players"));
     let currentRound = JSON.parse(localStorage.getItem("currentRound"));
     let match = JSON.parse(localStorage.getItem("match"));
     match[1] = currentRound[0]
     localStorage.setItem("match", JSON.stringify(match));

     document.getElementById("p1").innerHTML = players[match[0]].name;
     document.getElementById("score1").innerHTML = players[match[0]].points;
     document.getElementById("p2").innerHTML = players[match[1]].name;
     document.getElementById("score2").innerHTML = players[match[1]].points;

     currentRound.splice(0, 1)
     localStorage.setItem("currentRound", JSON.stringify(currentRound));

     getRanking()
}

//============================================================//
//        Score player - winner                               //
//============================================================//
function scorePlayer(w) {
     playPoint()
     let players = JSON.parse(localStorage.getItem("players"));
     let currentRound = JSON.parse(localStorage.getItem("currentRound"));
     let nextRound = JSON.parse(localStorage.getItem("nextRound"));
     let match = JSON.parse(localStorage.getItem("match"));
     let limit = JSON.parse(localStorage.getItem("limit"));
     let l = w > 0 ? 0 : 1

     // increment winner score
     players[match[w]].points += 1

     //increment wineer and looser played
     players[match[w]].played += 1
     players[match[l]].played += 1

     //check if any player has reached limit
     players.forEach(p => {
          if (p.points == limit) {
               if (players.length < 3) {
                    window.location.href = "winner.html";
               } else {
                    window.location.href = "result.html";
               }
          }
     })

     // add looser to nextRound
     nextRound.push(match[l])
     if (nextRound.length == players.length - 1) {
          currentRound = nextRound
          nextRound = []
     }

     //let winner be p1 == match[0]
     match[0] = match[w]

     localStorage.setItem("players", JSON.stringify(players));
     localStorage.setItem("nextRound", JSON.stringify(nextRound));
     localStorage.setItem("currentRound", JSON.stringify(currentRound));
     localStorage.setItem("match", JSON.stringify(match));
     getMatch();
}

//============================================================//
//        Reset all player scores                             //
//============================================================//
function resetScores() {
     playEnd()
     let players = JSON.parse(localStorage.getItem("players"));
     players.forEach(p => {
          p.points = 0;
          p.played = 0
     })
     localStorage.setItem("players", JSON.stringify(players));

     getRanking()
}

//============================================================//
//        Dealete all players                                 //
//============================================================//
function clearAll() {
     let players = JSON.parse(localStorage.getItem("players") || "[]")
     players = []
     localStorage.setItem("players", JSON.stringify(players));
     displayPlayers();
}


//============================================================//
//        Eliminate low score players                         //
//============================================================//
function eliminatePlayers() {
     let players = JSON.parse(localStorage.getItem("players"));
     let lNum = document.getElementById("loosers").value

     let playersV = players.sort((a, b) => (a.points < b.points) ? 1 : -1)
     for (var i = 0; i < lNum; i++) {
          playersV.pop()
     }
     localStorage.setItem("players", JSON.stringify(playersV));

     resetScores()

     let currentRound = []
     players.forEach((a, i) => {
          currentRound.push(i)
     })

     // store match
     localStorage.setItem("match", JSON.stringify([0, 1]));
     currentRound.splice(0, 1)
     localStorage.setItem("currentRound", JSON.stringify(currentRound));
     localStorage.setItem("nextRound", JSON.stringify([]));

     //redirect to play.html
     window.location.href = "play.html";

     getMatch()
}

//============================================================//
//        Play winner sound clip                              //
//============================================================//
function playWinner() {
     var audio = new Audio("audio/winner.mp3")
     audio.play();
}

//============================================================//
//        Player sound clip on each points gotten             //
//============================================================//
function playPoint() {
     var audio = new Audio("audio/point.mp3")
     audio.play();
}

//============================================================//
//        Play sound clip at the end of each round            //
//============================================================//
function playEnd() {
     var audio = new Audio("audio/end.mp3")
     audio.play();
}


