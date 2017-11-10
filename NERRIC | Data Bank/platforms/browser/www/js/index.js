var serverName = "nustfineartsclub.com/mess";

var app = {

    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        getMessData();
        getFeaturedEvent();
          $(".button-collapse").sideNav();
         $('.collapsible').collapsible();
  $('.button-collapse').sideNav({
      menuWidth: 300, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens,
    }
  );
    
    },
    
};


var breakfast = (new Date()).setHours(8,30,0,0);
var lunch = (new Date()).setHours(15, 30,0,0);
var dinner = (new Date()).setHours(21,0,0,0);
var breakfast_holiday = (new Date()).setHours(10,30,0,0);

var breakfast_time = "07:30am to 08:45am";
var lunch_time = "12:45pm to 03:30pm";
var dinner_time = "07:30pm to 09:00pm";
var lunch_time_holidays = "02:00pm to 03:30pm";
var breakfast_time_holiday = "09:00am to 10:30am";

function getMessData(){
    $.ajax({
        url : "http://" + serverName + "/massDMManager.php",
        type : "post",
        data : "action=requestByApp",
        async : true, 
        success : function(resp){
            //$(".result-div").append(resp);
            var date = new Date();
            makeDate(date.getDate(),date.getDay(),date.getMonth(), date.getFullYear());
            todaysMeal(date, resp);
            $('ul.tabs').tabs();
            $(".disclaimer").removeClass("hide");
            $(".theLoadScreen").addClass("hide");
        },
        error :  function(jqXHR, textStatus, errorThrown){
            console.log(textStatus, errorThrown);
            $(".loading-message").empty();
            $(".loading-message").append("Cannot Connect to Server");
	    setTimeout(function(){
		$(".loading-message").empty();
            	$(".loading-message").append("Trying again...");
		app.onDeviceReady();
	    },2000);
        }
    });
}

function makeMenu(list){
    for(var x in list){
        if(x == 7){return;}
        makeCol(list[x], parseInt(x) + 1);
    }
}

function makeCol(line, num){
    var l = line.trim().split(",");
    var str = "<div id=\"swipe-"+num+"\" style=\"heigth:auto;padding-top:10px;padding-bottom:20px;\" class=\"col s12 white\">" + 
        "<p>Breakfast</p><div class=\"divider\"></div>"  + 
                "<h5>" + l[0] + "</h5>" + 
                "<p>Lunch</p><div class=\"divider\"></div>" + 
                "<h5>" + l[1] + "</h5>" + 
                "<p>Dinner</p><div class=\"divider\"></div>" + 
                "<h5>" + l[2] + "</h5></div>";
    $(".the-mess-menu").append(str);
}


function todaysMeal(dateObj,resp){
    var L = resp.trim().split(";");
    makeMenu(L)
    var t = new Date();
    t.setDate(t.getDate() + 1);
    var date = new Date(t);
    
    var tdate = dateObj.getDay() - 1;
    var ndate = date.getDay() - 1;
    if(tdate < 0){
        tdate = 6;
    }
    if(ndate < 0){
        ndate = 6;
    }
    
    nextMeal(L[tdate],L[ndate]);
    
}

function nextMeal(todaysMeals, nextDayMeal){
    var now = Date.now();
    if(now < dinner){
        var tday = (new Date()).getDay();
        var l = todaysMeals.trim().split(",");
        if(tday == 6 || tday == 0){
            if(now < breakfast_holiday){
                $(".next-meal-time").empty();
                $(".next-meal-time").append("Breakfast - " + breakfast_time_holiday);
                showMeal(l[0]);
            }else if(now < lunch){
                $(".next-meal-time").empty();
                $(".next-meal-time").append("Lunch - " + lunch_time_holidays);
                showMeal(l[1]);
            }else{
                $(".next-meal-time").empty();
                $(".next-meal-time").append("Dinner - " + dinner_time);
                showMeal(l[2]);
            }
        }
        else{
            if(now < breakfast){
                $(".next-meal-time").empty();
                $(".next-meal-time").append("Breakfast - " + breakfast_time);
                showMeal(l[0]);
            }else if(now < lunch){
                $(".next-meal-time").empty();
		if(tday == 5){
			$(".next-meal-time").append("Lunch - " + lunch_time_holidays);
		}else{
                	$(".next-meal-time").append("Lunch - " + lunch_time);
                }
		showMeal(l[1]);
            }else{
                $(".next-meal-time").empty();
                $(".next-meal-time").append("Dinner - " + dinner_time);
                showMeal(l[2]);
            }
        }
    }else{
        // get next days meal.
        var day = (new Date()).getDay();
        var l = nextDayMeal.trim().split(",");
        if(day == 5 || day == 6){
            // next day is holiday
            $(".next-meal-time").empty();
            $(".next-meal-time").append("Breakfast - " + breakfast_time_holiday);
            showMeal(l[0]);
        }else{
            $(".next-meal-time").empty();
            $(".next-meal-time").append("Breakfast - " + breakfast_time);
            showMeal(l[0]);
        }
        var t = new Date();
        t.setDate(t.getDate() + 1);
        var date = new Date(t);
        makeDate(date.getDate(),date.getDay(),date.getMonth(), date.getFullYear());
    }
}

function showMeal(meal){
    $(".current-meal").empty();
    $(".current-meal").append(meal.trim());
}


function makeDate(dateNum ,dayNum, monthNum, yearNum){
    var days = [
        "Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday"
    ];
    var months = [
        "January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    var day = days[dayNum];
    var month = months[monthNum];
    var str = day + " - " + month + " " + dateNum + ", " + yearNum;
    $(".date-para").empty();
    $(".date-para").append(str);
}

function getFeaturedEvent(){
    $.ajax({
        url : "http://" + serverName + "/featuredEventsDBManage.php", 
        type : "post",
        data : "action=requestByApp",
        async : true,
        success : function(resp){
            console.log("dasdfasdasdfasds");
            var l = resp.trim().split("\n");
            $(".nav-bar-div").append("<li><div class=\"divider\"></div></li><li><a class=\"subheader\">Featured Events</a></li>");
            for(var x in l){
                var str = l[x].trim().split("≈");
                $(".nav-bar-div").append("<li><a class=\"waves-effect\" target=\"_blank\" href=\""+str[1]+"\">"+str[0]+"</a></li>");
            }
            var str = "<li><div class=\"divider\"></div></li><li><a class=\"subheader\">Developer</a></li><li><a class=\"waves-effect\" href=\"https://www.facebook.com/profile.php?id=100005595785739\" target=\"_blank\">Saad Ahmad</a></li>"
            $(".nav-bar-div").append(str);
        },
        error :  function(jqXHR, textStatus, errorThrown){
            console.log(textStatus, errorThrown);
            //var str = "<li><div class=\"divider\"></div></li><li><a class=\"subheader\">Developer</a></li><li><a class=\"waves-effect\" href=\"https://www.facebook.com/profile.php?id=100005595785739\" target=\"_blank\">Saad Ahmad</a></li>"
            //$(".nav-bar-div").append(str);
        }
    });
}
