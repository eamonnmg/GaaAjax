/**
 * Created by l00093050 on 25/03/2015.
 */

var teams = [];
var matches = [];
window.onload= function(){
    matches = getFixtures(teams);

}


function getFixtures(teams){

    var fixtures=[];

    var rounds=[]
    ////all the games a team plays
    //var teamGames = [];
    //for(var i = 0; i<teams.length;i++){
    //    teamGames[teams[i]] = [];
    //}

    var pivot = 1;
    //round robin

    var n = teams.length

    for(var i = 0; i<n;i++) {
        for(var i = 0; i<n;i++){

        }
        rounds.push([teams[i],n-pivot]);
        pivot++;




    }
    //get unique pairs ie each team must play each other
    for(var i = 0; i<teams.length;i++){
        var team = teams[i];
        for(var j = i+1; j<teams.length;j++){
                fixtures.push([team, teams[j]])


                ////add match to both teams list of games
                //teamGames[team].push([team, teams[j]]);
                //teamGames[teams[j]].push([team, teams[j]]);

        }
    }

    return fixtures;
}

function addTeam(team){
    teams.push(team);
}

function tableFixturs(fixtures){




}