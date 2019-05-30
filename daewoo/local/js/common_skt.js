function schedule(){

		var Now = new Date(); 
		var year = Now.getFullYear();
		var month = Now.getMonth()+1;
		var date = Now.getDate();
		var hour = Now.getHours();
		var hour1 = Now.getHours();
		var minute = Now.getMinutes();

		if((month+"").length < 2){
			month="0"+month;   //달의 숫자가 1자리면 앞에 0을 붙임.
		}
		
		if((date+"").length < 2){
			date="0"+date;      
		}

		if((hour1+"").length < 2){
			hour1="0"+hour1;      
		}

		if((minute+"").length < 2){
			minute="0"+minute;      
		}
		
		var today = year+"/"+month+"/"+date+" "+hour1+":"+minute+":00";      //오늘 날짜 완성.	


		var cookie = document.cookie;
		var cookieChk = cookie.indexOf("tc");
		var cookieTcChk = getCookie("tc");

		if(cookieTcChk  != ""){ // 쿠키값이 있으면
//			alert("쿠키 있음");
			var oldday = getCookie("today");
			var nowdate = new Date();

			var nYear = nowdate.getFullYear();
			var nMonth = nowdate.getMonth()+1;
			var nDate = nowdate.getDate();
			var nHour = nowdate.getHours();
			var nMinute = nowdate.getMinutes();
			var nToday = nYear+"/"+nMonth+"/"+nDate+" "+nHour+":"+nMinute+":00";      //오늘 날짜 완성.	

			var newdate = new Date(nToday);
			var olddate = new Date(oldday);

			var diffTime = (newdate.getTime() - olddate.getTime()) / (1000*60);

			if(diffTime >= 30){ // 60분이 지나면 조회
//				alert("조회시작");
				setCookie("sky_name", "", -1);
				setCookie("tc", "", -1);

				var tc = "";
				var sky_name = "";

				var city = "서울";
				var county = "강서구";
				var village = "마곡동";
				var stnid = "404"; //고잔 관측소
				var url = "https://api2.sktelecom.com/weather/current/minutely?"+Math.random()+"&version=2&stnid="+stnid;
				$.ajax({
					url: url,
					contentType:"application/x-www-form-urlencoded; charset=UTF-8",    	
					crossDomain:true,
					type: "get",
					async : false,
					dataType: "json",
					timeout: 30000,
					headers	:	{ appkey:"fadc11aa-a209-46ea-a441-b02f23d86ba5" },
				   success:function(data){
							var tc1 = data.weather.minutely[0].temperature.tc.split('.');
							tc = tc1[0];
							sky_name = data.weather.minutely[0].sky.name;
							sky_code = data.weather.minutely[0].sky.code;
				   }
				  });
				setCookie('tc', tc, 3); // name=Ethan, 3일 뒤 만료됨 
				setCookie('sky_name', sky_name, 3); // name=Ethan, 3일 뒤 만료됨 
				setCookie("today",nowdate, 3);
				fnTodayWeather_cookie();
			}
		}else{ // 쿠키값이 없으면
//			alert("쿠키없음");
			var tc = "";
			var sky_name = "";

			var city = "서울";
			var county = "강서구";
			var village = "마곡동";
			var stnid = "404"; //고잔 관측소
			var url = "https://api2.sktelecom.com/weather/current/minutely?"+Math.random()+"&version=2&stnid="+stnid;
			$.ajax({
				url: url,
				contentType:"application/x-www-form-urlencoded; charset=UTF-8",    	
				crossDomain:true,
				type: "get",
				async : false,
				dataType: "json",
				timeout: 30000,
				headers	:	{ appkey:"fadc11aa-a209-46ea-a441-b02f23d86ba5" },
			   success:function(data){
						var tc1 = data.weather.minutely[0].temperature.tc.split('.');
						tc = tc1[0];
						sky_name = data.weather.minutely[0].sky.name;
						sky_code = data.weather.minutely[0].sky.code;
//						alert(tc+" / "+sky_name);
			   }
			  });

			setCookie("tc", tc, 3); // name=Ethan, 3일 뒤 만료됨 
			setCookie("sky_name", sky_name, 3); // name=Ethan, 3일 뒤 만료됨 
			setCookie("today", today, 3);
		}

	}

function fnTodayWeather_cookie(){
	var tc = 	getCookie('tc'); 
	var sky_name = getCookie('sky_name'); 
	
//	alert(tc+" / "+sky_name);
	$("#now_today").empty();
	html ='<span class="label">오늘</span>'
	html +='<span class="icon"><img src="'+changeImg(changeNulChk(sky_name))+'" alt=""></span>'
	html +='<span class="now_weather">'+ changeNulChk(sky_name) +'<strong>' + tc + '<em>˚</em></strong></span>'
	$("#now_today").html(html);
}

//내일날씨
function fnYesterdayWeather(){
		var num = 0;		
		var highArr = new Array();
		var lowArr = new Array();
		var wfEnArr = new Array();
		var html1="";		

		//내일날씨
		$.ajax({		 
          url: 'http://www.kma.go.kr/wid/queryDFS.jsp?gridx=60&gridy=127',
		  cache: false,
		  timeout: 30000,

          success: function(data) {            
				$(data).find("data").each(function(no){		
					if ($(this).find("day").text() == 1){
						var wfEn = $(this).children("wfEn").text();
						var temp = $(this).children("temp").text();
						var tmx = $(this).children("tmx").text();
						var tmn = $(this).children("tmn").text();			
			
						highArr[num] = new Array();
						lowArr[num] = new Array();
						wfEnArr[num] = new Array();
						highArr[num] = tmx;
						lowArr[num] = tmn;
						wfEnArr[num] = wfEn;						
   
						html1   = '<table class="today_3_table"><tr>'
						html1 += '<td rowspan="4" style="width:370px;"><img src="'+changeImg(chkWeatherContent(wfEnArr))+'" width="370" height="290" /></td>'
						html1 += '<td style="height:40px;"></td></tr><tr>'
						html1 += '<td class="today3_top">최고&nbsp;<h style="color:#F00;"> '+highCnt(highArr)+'˚</h></td></tr><tr>'
						html1 += '<td class="today4_top">최저&nbsp;<h style="color:#03C;"> '+lowCnt(lowArr)+'˚</h></td></tr><tr><td style="height:40px;"></td></tr></table>'

						num++;		
						
					}					
					 		
				});				
				$("#tomorrow").html(html1);			

         }
     }); //내일날씨끝

}

function fnTommorrowWeather(){
		var num1 = 0;
		var highArr1 = new Array();
		var lowArr1 = new Array();
		var wfEnArr1 = new Array();
		var html2="";

	//모레날씨
		$.ajax({
          url: 'http://www.kma.go.kr/wid/queryDFS.jsp?gridx=60&gridy=127',
		  cache: false,
		  timeout: 30000,

          success: function(data2) {       
				$(data2).find("data").each(function(no){					
					if ($(this).find("day").text() == 2){
						var wfEn1 = $(this).children("wfEn").text();
						var temp1 = $(this).children("temp").text();
						var tmn1 = $(this).children("tmn").text();

						highArr1[num1] = new Array();
						lowArr1[num1] = new Array();
						wfEnArr1[num1] = new Array();
						highArr1[num1] = temp1;
						lowArr1[num1] = tmn1;
						wfEnArr1[num1] = wfEn1;						

						html2   = '<table style="width:auto; margin: 0 auto; text-align:center;  border-style: none; border-collapse: collapse; "><tr>'
						html2 += '<td rowspan="4" style=" text-align:right; font-size:120px; width:auto;">'+chkWeatherContent(wfEnArr1)+'<img src="'+changeImg(chkWeatherContent(wfEnArr1))+'" alt="" /> </td>'
						html2 += '<td style="height:44px;"></td></tr><tr>'
						html2 += '<td class="font_cc">최고<b style="color:#c90420; padding-left:15px;"> '+highCnt(highArr1)+'°</b></td></tr><tr>'
						html2 += '<td class="font_cc">최저<b style="color:#0032b0; padding-left:15px;"> '+lowCnt(lowArr1)+'°</b></td></tr><tr><td style="height:44px;"></td></tr></table>'					
					
						num1++;
					}
					 					
				});								
//				alert(wfEnArr1);
				 $("#after_tomorrow").html(html2);				
			     
         }
     }); //모레날씨끝
}
//현재시간
function todyaDate(){
	var Now = new Date(); 
	var year = Now.getFullYear();
	var month = Now.getMonth()+1;
	var day = Now.getDate();
	var hour = Now.getHours();
	var minute = Now.getMinutes();
	var week = Now.getDay();
	var ampm = 'AM';
	if(hour > 12){
		ampm='PM';
		hour -=12;
	}else if(hour == 12){
		ampm='PM';		
	}
	if ((month+"").length < 2){month = '0'+month;}
	if ((day+"").length < 2){day = '0'+day;}
	if ((hour+"").length < 2){hour = '0'+hour;}
	if ((minute+"").length < 2){minute = '0'+minute;}

	$(".date").html(year+ ". " + month + ". " + day +"."+ "<strong>" + getDay(week) + "요일" + "</strong>");
	$(".time").html("<em>"+ampm+"</em>"+hour+":"+minute)
}

function getDay(idx) {
    var date = "";
  switch (idx) {
    case 0:
        date = "일";
    break;
    case 1: 
        date = "월";
    break;
    case 2: 
        date = "화";
    break;
    case 3: 
        date = "수";
    break;
    case 4: 
        date = "목";
    break;
    case 5: 
        date = "금";
    break;
    case 6: 
        date = "토";
    break;
  }
  return date;
}

function chkWeatherContent(arr){	
	var weatherCont = "";
	if (arr.length > 0){
		var cnt = 0;
		var sort = 0;
		var wacnt = new Array();
		for(var i = 0; i < arr.length; i++){
			switch(arr[i]){
				case "Clear":	sort = 1; 	break;
				case "Partly Cloudy": sort = 2;	break;
				case "Mostly Cloudy": sort = 3;	break;
				case "Cloudy": sort = 4;	break;
				case "Rain": sort = 5;	break;
				case "Snow/Rain":	sort = 6;	break;
				case "Snow":	sort = 7;	break;
				default: sort = 0; break;
			}
			wacnt[i] = sort;			
		}		
		var iconCnt = Math.max.apply(Math, wacnt); //날씨 우선순위선정		
		
		switch(iconCnt){
			case 1:	weatherCont = "맑음"; 	break;
			case 2: weatherCont = "구름조금";	break;
			case 3: weatherCont = "구름많음";	break;
			case 4: weatherCont = "흐림";	break;
			case 5: weatherCont = "비";	break;
			case 6:	weatherCont = "눈/비";	break;
			case 7:	weatherCont = "눈";	break;
			default: weatherCont = "-"; break;
		}
	}	
	return weatherCont;
}
function changeNulChk(txt){
	var chk_txt
	switch(txt){
		case "":  chk_txt= "흐림"; 	break;		
		case "연무":  chk_txt= "안개"; 	break;	
		case "박무":  chk_txt= "안개"; 	break;
		case "구름많고 비":  chk_txt= "비"; 	break;	
		case "구름많고 눈":  chk_txt= "눈"; 	break;	
		case "구름많고 비 또는 눈":  chk_txt= "비 또는 눈"; 	break;	
		case "흐리고 비":  chk_txt= "비"; 	break;	
		case "흐리고 눈":  chk_txt= "눈"; 	break;	
		case "흐리고 비 또는 눈":  chk_txt= "비 또는 눈"; 	break;	
		case "흐리고 낙뢰":  chk_txt= "낙뢰"; 	break;	
		case "뇌우/비":  chk_txt= "비"; 	break;	
		case "뇌우/눈":  chk_txt= "눈"; 	break;	
		case "뇌우/비 또는 눈":  chk_txt= "비 또는 눈"; 	break;	

		default: chk_txt = txt; break;
	}
	return chk_txt;
}


function changeImg(txt){
	var img_src
	switch(txt){
		case "맑음":  img_src= "icon_2.png"; 	break;			
		case "흐림":  img_src= "icon_1.png"; 	break;			
		case "구름조금": img_src = "icon_1.png";	break;			
		case "구름많음": img_src = "icon_6.png";	break;			
		case "소나기": img_src = "icon_3.png";	break;
		case "비": img_src = "icon_3.png"; 	break;
		case "가끔 비": img_src = "icon_3.png";	break;
		case "한때 비": img_src = "icon_3.png";	break;
		case "눈": img_src = "icon_10.png";	break;
		case "눈/비": img_src = "icon_5.png";	break;
		case "한때 눈": img_src = "icon_10.png";	break;
		case "가끔 눈": img_src = "icon_10.png";	break;
		case "비 또는 눈": img_src = "icon_5.png";	break;
		case "가끔 비 또는 눈": img_src = "icon_5.png"; 	break;
		case "한때 비 또는 눈": img_src = "icon_5.png";	break;
		case "눈 또는 비": img_src = "icon_5.png";	break;
		case "가끔 눈 또는 비": img_src = "icon_5.png";	break;
		case "한때 눈 또는 비": img_src = "icon_5.png";	break;
		case "천둥번개": img_src = "icon_9.png";	break;
		case "연무": img_src = "icon_1.png";	break;
		case "안개": img_src = "icon_1.png";	break;
		case "박무": img_src = "icon_1.png";	break;
		case "황사": img_src = "icon_1.png";	break;
		case "약한이슬비": img_src = "icon_3.png";	break;
		case "이슬비 끝": img_src = "icon_3.png";	break;		
		case "약한비계속": img_src = "icon_3.png";	break;		
		case "약한비단속": img_src = "icon_3.png";	break;	
		case "보통비계속": img_src = "icon_3.png";	break;	
		case "낙뢰": img_src = "icon_9.png";	break;
		default: img_src = "icon_1.png"; break;
	}
	return "./img/weather/"+img_src;
}

function highCnt(arr){	
	var max = Math.max.apply(Math, arr);
	return max;
}
function lowCnt(arr){	
	var min = Math.min.apply(Math, arr);
	return min;
}

// 쿠키 생성
    function setCookie(cName, cValue, cDay){
        var expire = new Date();
        expire.setDate(expire.getDate() + cDay);
        cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
        if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
        document.cookie = cookies;
    }

	//쿠키 가져오기
	var getCookie = function(cName) {
	  cName = cName + '=';
        var cookieData = document.cookie;
        var start = cookieData.indexOf(cName);
        var cValue = '';
        if(start != -1){
            start += cName.length;
            var end = cookieData.indexOf(';', start);
            if(end == -1)end = cookieData.length;
            cValue = cookieData.substring(start, end);
        }
        return unescape(cValue);
	};
	
	//쿠키 삭제
	function delCookie(name) {
        //특정 쿠키값의 만료날짜를 하루 전(-1)으로 되돌린다.
        var date = new Date(); // 오늘 날짜 
        var dd = Number(date.getDate()); //반환된 String 타입의 날짜를  int형으로 형 변환
        expiredays = -1;
        date.setDate( dd + expiredays ); //하루 전으로 날짜 변경 
        //특정 쿠키 값을 ''로 초기화하고 만료 날짜를 하루 전으로 되돌린다.
        document.cookie = name + "=; path=/; expires=" + date.toGMTString(); 
  }