

//global variables
//array to archive of games ie every time a league of fixtures is generated it is backed up here here
var leagues = [];
//array to store rounds of games
var rounds =[];

//teams arrray - keeps track of league standings
var totalTeams = [];

//on page load
window.onload= function(){


    //read in news
    $('#gaanews').trigger("click");

    //init combobox to select hopw many teams in league - create fixturee section?
    var numberTeams = 0;
    $('#numberTeams').on('change', function(){
        //read in number from drop down
        numberTeams = parseInt($('#numberTeams :selected').val());
        console.log(numberTeams);
        //create text boxes to take in team names
        $('#teamTextBoxes').html(drawFixturesForm(numberTeams)).hide().slideDown(500);

    });


    //generate fixtures attach event
    $('#genFixtures').on('click',function(){
        generateFixtures()
    });

    //init sponsor images
    var imgs = ['coke.jpg','guinness.png','Three-logo.jpg'];
    //slide show
    var i = 0;
    //every 3 seconds loop through inages
    setInterval(function(){
        if(i>2){i=0}
        $('#slideshow').attr('src','imgs/'+imgs[i]);
        if(i>2){
            i=0;
        }else{
            i++;
        }

    },3000);


    //init weather [Displayed value, values to be passed to weather api]
    //combobox vals
    var counties=[
        ['Ulster','Letterkenny'],
        ['Leinster','dublin'],
        ['Connaught','Gaillimh'],
        ['Munster','cork']
    ];
    var select = $('#weatherSelect');
    for(var i = 0; i<counties.length;i++){
        select.append('<option value="'+counties[i][1]+'">'+counties[i][0]+'</option>');
    }
    //init waether at letterkeny
    getWeather('letterkenny');
    //add weather event listeners
    select.on('change', function(){
        getWeather($(this).val());

    });

    //add league results event listeners
    $('#leagueSelect').on('change', function(){
        $('#resultsTable').html(printResults($(this).val())).hide().slideDown(1000);
        //set results heading
        $('#leagueHeading').text($('#leagueSelect option:selected').text());

    });



};


//simple game class data tructure
function Game(team1, team2){
    this.team1=team1;
    this.team2=team2;
    this.score1='';
    this.score2='';
    this.totalScore1='';
    this.totalScore1='';

}

//simple team class
function Team(name){
    this.name = name;
    this.points = 0;
}

//method containing the round robin algorithm that generate the fixtures
function generateFixtures(){


    //reset teams var
    totalTeams = []
    //read in text boxes

    //clear rounds global var
    rounds=[];
    //for each text box get the value
    $("#teamTextBoxes input").each(function(){
        totalTeams.push(new Team($(this).val()));
    });

    //http://stackoverflow.com/questions/26471421/round-robin-algorithm-implementation-java?rq=1
    //round robin algortithm


    //if odd number of teams add a bye
    if(totalTeams.length % 2 != 0){
        totalTeams.push(new Team('bye'))
    }

    //n=number of teams
    var n = totalTeams.length;

    //split teams array with pivot
    var split = n/2;




    ////cals number of rounds necceasry
    var noRounds = n-1

    //for each round
    for(var round = 0; round<noRounds;round++) {
        var games = []
        //for each game
        for (var game = 0; game < split; game++) {


            var firstTeam = totalTeams[game];
            var secondTeam = totalTeams[n-1-game];
            var g = new Game(firstTeam,secondTeam)
            games.push(g);




        }
        //reorder teams array
        var temp = totalTeams[n-1];
        //loop backward through teams shifting index -1
        for(var i = n-1;i>1;i--){
            totalTeams[i] = totalTeams[i-1];
        }
        //set second index to value at last index - value at first index stays same
        totalTeams[1]=temp;


        rounds.push(games);





    }
    //print the generated fixtures
    $('#fixtures').html(printFixtures(rounds)).hide().slideDown(1000);

}
//helper function to print html
function printFixtures(rounds){

    var noRounds = rounds.length;
    var noGames = rounds[0].length;
    //create html table displaying
    html=[];
    for(var round=0; round<noRounds; round++){
        html.push(
            '<div>' +
            '<h2>Round '+(round+1)+'</h2>' +
            '<table class="round table">'
        );
        for(var game=0;game<noGames;game++){
            html.push(
                '<tr>' +
                '<td> '+rounds[round][game].team1.name+' </td>' +
                '<td> vs </td>' +
                '<td> '+rounds[round][game].team2.name+' </td>' +
                '</tr>'
            );
        }
        html.push(
            '</table> </div>'
        );

    }
    html.push('Click button to generate results: <button id="playGames" onclick="playGames();"  class="btn-success" title="Generate Results!">Play Games</button>');
    //return html
    return html.join().split(',').join('');
}
//method takes in url for rss and returns json object of values
function getRSSFeed(feedUrl){
    var url = feedUrl;
    //jquery greatly simplifyes ajax
    $.ajax({
        type: "GET",
        //this line converts the rss(xml) to javascript friendly json
        url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent(url),
        dataType: 'json',
        //if something goes wrong...
        error: function(){
            alert('News! Unable to load feed, Incorrect path or invalid feed');
        },
        //if data successfully retrieved do the following...
        success: function(xml){
            values = xml.responseData.feed.entries;
            console.log(values);

            //create empty array to put <li> elements in
            var items = [];
            //get target dom element to append to
            var targetUL = $('#newsFeed');
            $.each(values, function(index,value){
                //console.log(value);
                //for each rss item put it in items[] (as html)
                items.push(drawRSSItem(value.title,value.contentSnippet,value.link));
            });

            //join strings of html in items and out put to screen with annimation
            targetUL.html(items.join().split(',').join('')).hide().slideDown(3000);
        }
    })



};

//this method takes in a city accepted by the openweathermaps api
//daat is returned much in the same wa as the get rss func
function getWeather(feedUrl){

    //retrieve weather json from openweathermap.org by ajax
    var url = 'http://api.openweathermap.org/data/2.5/weather?q='+feedUrl+'&units=metric';
    $.ajax({
        type: "GET",
        url:url,
        dataType: 'json',
        error: function(){
            alert('Weather! Unable to load feed, Incorrect path or invalid feed');
        },
        success: function(data){
            values = data;
            console.log(url);
            console.log(values);

            //pass waether data into html template function
            $('#weatherAjax').html(drawWeather(values)).hide().slideDown(500);

            //set heading above weather table to selected combo box item text
            $('#weatherHeading').text($('#weatherSelect option:selected').text());

        }
    })
}

//this method randomly generates scores for all the fixtres generated
// the results are then pushed to the leagues array and archived in the results section
function playGames(){
    //for each game in each round give both teams a random score
    //points are <20
    //goals are <10
    for(var i = 0; i<rounds.length;i++){
        for(var j = 0; j<rounds[0].length;j++){

            //dont do any of this if is a bye game
            if(rounds[i][j].team1.name != 'bye' && rounds[i][j].team2.name != 'bye'){
                var goals1 = Math.floor((Math.random() * 10)+1);
                var goals2 = Math.floor((Math.random() * 10)+1);

                var points1 = Math.floor((Math.random() * 20)+1);
                var points2 = Math.floor((Math.random() * 20)+1);

                //set score ie "2-23"
                rounds[i][j].score1 = goals1 +' - '+ points1;
                rounds[i][j].score2 = goals2 +' - '+ points2;

                //total score ie (points + goals) ie 29
                var totalscore1 = (goals1 *3)+points1;
                var totalscore2 = (goals2 *3)+points2;

                //set total score to game object
                rounds[i][j].totalScore1 = totalscore1;
                rounds[i][j].totalScore2 = totalscore2;


                //update league points
                //id team 1 wins
                if(totalscore1>totalscore2){
                    //find team index of team in global totalTeams array
                    var idx = totalTeams.indexOf(rounds[i][j].team1);
                    totalTeams[idx].points += 3;
                }else if(totalscore1<totalscore2){
                    var idx = totalTeams.indexOf(rounds[i][j].team2);
                    totalTeams[idx].points += 3;
                }else{//in draw both teams +1 point
                    var idx1 = totalTeams.indexOf(rounds[i][j].team1);
                    var idx2 = totalTeams.indexOf(rounds[i][j].team2);
                    totalTeams[idx1].points += 1;
                    totalTeams[idx2].points += 1;
                }



            }





        }

    }

    //push results of tuornament to top of leagues array archive
    leagues.push(rounds);

    //add option to combo box in results archive
    $('#leagueSelect').prepend('<option selected value="'+leagues.length+'">League '+leagues.length+'</option>');

    //print most recent(ie this) league
    $('#resultsTable').html(printResults(leagues.length));

    //alert user to view results
    $( "#resultsLink" ).trigger( "click" );

    //clear fixtures html
    $('#fixtures').html('');

    //set results heading
    $('#leagueHeading').text($('#leagueSelect option:selected').text());

    //update Table
    $('#leagueTable').html(updateTable());

}


//helepr method to print out league table
function updateTable(){

    //remove bye from teams
    if(totalTeams[totalTeams.length-1].name == 'bye'){
        totalTeams.pop();
    }


    //sor teams by points
    totalTeams.sort(function (a,b) {
        return   b.points - a.points;
    })

    var html=[];

    html.push('<table class="table">'+
    '<thead>'+
    '<td>Position</td><td>Team Name</td><td>Points</td>'+
    '</thead>');

    for(var i=0; i<totalTeams.length;i++){
        html.push('<tr>' +
        '<td>'+(i+1)+'</td><td>'+totalTeams[i].name+'</td><td>'+totalTeams[i].points+'</td>' +
        '</tr>');
    }

    html.push('</table>');

    return html.join().split(',').join('');
}

//helper function to print results html
//takes in an index which correlates to a particular league
function printResults(leagueNo){
    var leagueIdx = leagueNo - 1;

    //initialise league
    var league = leagues[leagueIdx];
    var noRounds = league.length;
    var noGames = league[0].length;

    //create html table displaying
    var html=[];
    for(var round=0; round<noRounds; round++){
        html.push(
            '<div>' +
            '<h1 id="leagueHeading"></h1>' +
            '<h2>Round '+(round+1)+'</h2>' +
            '<table class="round table">' +
            '<thead>' +
            '<td>Score</td><td>Team 1</td><td></td><td>Team 2</td><td>Score</td>' +
            '</thead>'
        );
        for(var game=0;game<noGames;game++){
            html.push(
                '<tr>' +
                '<td> '+league[round][game].score1+' </td>'+
                '<td> '+league[round][game].team1.name+' </td>' +
                '<td> vs </td>' +
                '<td> '+league[round][game].team2.name+' </td>' +
                '<td> '+league[round][game].score2+' </td>' +
                '</tr>'
            );
        }
        html.push(
            '</table> </div>'
        );

    }
    //return html
    return html.join().split(',').join('');
}



//helper method to print weather html
function drawWeather(values){
    return '<h2 id="weatherHeading"></h2>' +
        '<table class="table">' +
        '<thead>' +
        '<td></td><td>Weather Station</td><td>Teperature</td><td>description</td>' +
        '</thead>' +
        '<tr>' +
        '<td><img src="http://openweathermap.org/img/w/'+values.weather[0].icon+'.png"></td><td>'+values.name+'</td><td>'+values.main.temp+'</td><td>'+values.weather[0].description+'</td>' +
        '<tr>' +
        '</table>';
}

//helper method to print fictures text boxes
function drawFixturesForm(numberTeams){
    //empty array to store each text box html
    var html = [];
    for(var i = 1;i<numberTeams+1;i++){
        html.push('<li>'+
        '<label for="team'+i+'">Team '+i+'</label>'+
        '<input type="text" name="team'+i+'" id="team'+i+'">'+
        '</li>');
    }
    //concatinate the array of html strings and rejoin without commas
    return html.join().split(',').join('');
}

//this helper methods provides a html template for rss items
function drawRSSItem(headline,content,link){
    html =
        '<li>'
        +'<div>' +
        '<h2>'+headline+'</h2>' +
            '<p>'+content+'</p>' +
        '<a href="'+link+'">(read more..)</a>'+
        '</div>'+
        '</li>'

    return html;
}