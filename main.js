window.onload = () => {
     getRanking();
     getMatch();
}

function addPlayer() {
     let players = JSON.parse(localStorage.getItem("players") || "[]")
     let name = document.getElementById("player-name").value;
     players.push({
          name: name,
          played: 0,
          points: 0
     })
     localStorage.setItem("players", JSON.stringify(players));
     document.getElementById("player-name").value = '';

     displayPlayers()
}

function displayPlayers() {
     let players = JSON.parse(localStorage.getItem("players") || "[]")
     var t = "";
     for (var i = 0; i < players.length; i++) {
          var tr = "<tr>";
          tr += `<td>${i + 1}</td>`;
          tr += `<td><i class="far fa-user"></i>${players[i].name}</td>`;
          tr += "</tr>";
          t += tr;
     }
     document.getElementById("players-list").innerHTML = t;
}

displayPlayers();

function startGame() {
     let players = JSON.parse(localStorage.getItem("players") || "[]")
     if (players.length > 2) {
          // store limit in Local storage
          limit = document.getElementById("gameLimit").value
          localStorage.setItem("limit", limit);

          //store currentRound in Local storage
          let currentRound = []
          console.log(players.length);
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
     } else {
          window.alert('Ther should be up to 3 players to begin a tournamnet')
     }

}

function getRanking() {
     let players = JSON.parse(localStorage.getItem("players"));
     var t = "";
     for (var i = 0; i < players.length; i++) {
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

function getMatch() {
     let players = JSON.parse(localStorage.getItem("players"));
     let currentRound = JSON.parse(localStorage.getItem("currentRound"));
     let match = JSON.parse(localStorage.getItem("match"));
     match[1] = currentRound[0]
     localStorage.setItem("match", JSON.stringify(match));

     document.getElementById("p1").innerHTML = players[match[0]].name;
     document.getElementById("p2").innerHTML = players[match[1]].name;

     currentRound.splice(0, 1)
     localStorage.setItem("currentRound", JSON.stringify(currentRound));

     getRanking()
}

function scorePlayer(w) {
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
               window.location.href = "result.html";
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

function resetScores() {
     let players = JSON.parse(localStorage.getItem("players"));
     players.forEach(p => {
          p.points = 0;
          p.played = 0
     })
     localStorage.setItem("players", JSON.stringify(players));

     getRanking()
}

function looserNum() {
     let players = JSON.parse(localStorage.getItem("players") || "[]")
     var t = "";
     for (var i = 0; i < players.length; i++) {
          var tr = "<tr>";
          tr += `<td>${i + 1}</td>`;
          tr += `<td>${players[i].name}</td>`;
          tr += "</tr>";
          t += tr;
     }
     document.getElementById("players-list").innerHTML = t;
}

