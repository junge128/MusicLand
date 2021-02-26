//获取歌曲数据
song_data = JSON.parse(localStorage.temp_list);
//记录拖动点前的鼠标X值
old_position_left = '';
//记录是否在调整进度条
flag = 0;
//记录是否在监听
Is_Listen = 0;
//歌词时间点
lyric_points = '';
//喜爱歌曲列表
love_song = '';
history_song = '';

_init_playing_song();
tap_switch();

function timetoformat(time) {
	var minute = parseInt(time / 1000 / 60);
	var second = parseInt(time / 1000 / 60 % minute * 60);
	if(minute == 0){
		second = parseInt(time / 1000);
	}
	if(second < 10){
		second = '0' + second;
	}
	if(minute < 10){
		minute = '0' + minute;
	}
	return [minute,second]
}

function play() {
	add_history();
	if(document.getElementById('audio').paused){
		document.getElementById('audio').play();
		if(!Is_Listen){
			Is_Listen = 1;
			audio.addEventListener('ended', function () {  
				Is_Listen = 0;
				var audio=document.getElementById("audio");
				// audio.load();
				$("#play_control_icon").toggleClass("icon-play");
				$("#play_control_icon").toggleClass("icon-pause");
				//预加载
				GetLoveSong();
				love_song = JSON.parse(localStorage.love_song);
				playNext();
			}, false);
		}
	}else{
		document.getElementById('audio').pause();
	}
}

//播放下一首,如果歌单存在
function playNext() {
	//我的歌单不为空
	if(love_song != ''){
		for(var i = 0;i < love_song.length;i++){
			if(love_song[i]['song_id'] == song_data['id']){
				if(i + 1 < love_song.length){
					love_song_click(i+1);
					return;
				}
			}else{
				$(".list_all").children().eq(i).children().eq(0).css('background','');
				$(".list_all").children().eq(i).children().eq(0).css('font-size','');
			}
		}
	}
}

//添加历史播放歌曲
function add_history() {
	$.ajax({
		type: "GET",
		url: "http://musicland.yyuanyin.cn:8080/MusicLand/UserManage",
		dataType: "text",
		data: {username:localStorage.username,
			   method: "addhistory",
			   song_name: song_data['name'],
			   song_artist: song_data['artists'][0]['name'],
			   song_time: song_data['duration'],
			   song_id: song_data['id'],
			   song_img: song_data['album']['picUrl']
			   },
		success: function(data){
				console.log('后台添加历史播放成功');
		},
		error: function(data){
				console.log(data);
		}
	});
}

//动态查找当前播放歌曲 添加ICON
function Dynamic_action_icon() {
	//我的歌单不为空
	if(love_song != ''){
		for(var i = 0;i < love_song.length;i++){
			if(love_song[i]['song_id'] == song_data['id']){
				//当前是否在我的歌单选项
				if($("#love_song").hasClass("active")){
					$(".list_all").children().eq(i).children().eq(0).css('background','url(img/playing.gif) no-repeat 50%');
					$(".list_all").children().eq(i).children().eq(0).css('font-size','0px');
				}
			}else{
				$(".list_all").children().eq(i).children().eq(0).css('background','');
				$(".list_all").children().eq(i).children().eq(0).css('font-size','');
			}
		}
	}
}

$(".music-btn").children().eq(0).on('click',function(){
	tap_switch();
	$(".music-btn").children().eq(0).removeClass('active');
	$(".music-btn").children().eq(1).removeClass('active');
	$(".music-btn").children().eq(2).removeClass('active');
	$(".music-btn").children().eq(3).removeClass('active');
	$(".music-btn").children().eq(0).addClass('active');
});

$("#love_song").on('click',function(){
	//刷新获取最新Love_Song列表
	if(typeof(localStorage.username) != 'undefined'){
		GetLoveSong();
		love_song = JSON.parse(localStorage.love_song);;
		if(love_song.length > 0){
			_init_love_song();
			Dynamic_action_icon();
		}else{
			alert("你还没收藏歌曲");
		}
	}else{
		alert("请登录账号");
	}
});

$(".music-btn").children().eq(2).on('click',function(){
	window.open("search.html?song=IU","_blank");
});

$(".music-btn").children().eq(3).on('click',function(){
	//刷新获取最新Love_Song列表
	if(typeof(localStorage.username) != 'undefined'){
		GetHistorySong();
		history_song = JSON.parse(localStorage.history_song);;
		if(history_song.length > 0){
			_init_history_song();
		}else{
			alert("你还没播放过歌曲");
		}
	}else{
		alert("请登录账号");
	}
});

//我的歌单歌曲 播放点击
function love_song_click(idx) {
	song_data['name'] = love_song[idx]['song_name'];
	song_data['artists'][0]['name'] = love_song[idx]['song_artist'];
	song_data['album']['picUrl']  = love_song[idx]['song_img'];
	song_data['id'] = love_song[idx]['song_id'];
	song_data['duration'] = love_song[idx]['song_time'];
	localStorage.temp_list = JSON.stringify(song_data);
	_init_playing_song();
	Dynamic_action_icon();
}

//历史歌曲 播放点击
function history_song_click(idx) {
	song_data['name'] = history_song[idx]['song_name'];
	song_data['artists'][0]['name'] = history_song[idx]['song_artist'];
	song_data['album']['picUrl']  = history_song[idx]['song_img'];
	song_data['id'] = history_song[idx]['song_id'];
	song_data['duration'] = history_song[idx]['song_time'];
	localStorage.temp_list = JSON.stringify(song_data);
	_init_playing_song();
	Dynamic_action_icon();
}

function _init_love_song(){
	$(".list_all").html('');
	for(var i = 0 ; i < love_song.length; i++){
		var idx = i + 1 ;
		var time_format = timetoformat(love_song[i]['song_time']);
		var minute = time_format[0];
		var second = time_format[1];
		var temp_html = `	<div class="list-item">
								<span class="item-num">` + idx + `</span>
								<div id="song_name" class="item-name">` + love_song[i]['song_name'] + `
									<div onclick="love_song_click(` + i + `)" class="play_icon_outer">
										<i class="iconfont icon-play-mini"></i>
									</div>
								</div>
								<span id="song_artist" class="item-artist">` + love_song[i]['song_artist'] + `</span>
								<span id="song_time" class="item-time">` + minute + `:` + second + `</span>
							</div>`;
		$(".list_all").html($(".list_all").html() + temp_html);
	}
	$(".music-btn").children().eq(0).removeClass('active');
	$(".music-btn").children().eq(1).removeClass('active');
	$(".music-btn").children().eq(2).removeClass('active');
	$(".music-btn").children().eq(3).removeClass('active');
	$(".music-btn").children().eq(1).addClass('active');
}

function _init_history_song(){
	$(".list_all").html('');
	for(var i = 0 ; i < history_song.length; i++){
		var idx = i + 1 ;
		var time_format = timetoformat(history_song[i]['song_time']);
		var minute = time_format[0];
		var second = time_format[1];
		var temp_html = `	<div class="list-item">
								<span class="item-num">` + idx + `</span>
								<div id="song_name" class="item-name">` + history_song[i]['song_name'] + `
									<div onclick="history_song_click(` + i + `)" class="play_icon_outer">
										<i class="iconfont icon-play-mini"></i>
									</div>
								</div>
								<span id="song_artist" class="item-artist">` + history_song[i]['song_artist'] + `</span>
								<span id="song_time" class="item-time">` + minute + `:` + second + `</span>
							</div>`;
		$(".list_all").html($(".list_all").html() + temp_html);
	}
	$(".music-btn").children().eq(0).removeClass('active');
	$(".music-btn").children().eq(1).removeClass('active');
	$(".music-btn").children().eq(2).removeClass('active');
	$(".music-btn").children().eq(3).removeClass('active');
	$(".music-btn").children().eq(3).addClass('active');
}

//加载所有数据,并不跳转
function _init_playing_song() {
	var song_img = song_data['album']['picUrl'];
	var time_format = timetoformat(song_data['duration']);
	var minute = time_format[0];
	var second = time_format[1];
	var music_link = "http://music.163.com/song/media/outer/url?id=" + song_data['id'] + ".mp3";
	$('.time-bar').html('00:00/' + minute + `:` +  second);
	$('#bar-name').html(song_data['name']);
	$('.img-info').attr("src", song_img);
	$('.bg_image').css("background-image", "url('" + song_img + "')");
	$('#audio').attr("src", music_link);
	GetLyric(song_data['id']);
	$('#audio').load();
	play();
	if(!document.getElementById("audio").paused){
		$("#play_control_icon").removeClass("icon-play");
		$("#play_control_icon").addClass("icon-pause");
	}
}

//跳转回主页
function tap_switch() {
	$(".list_all").html('');
	// 初始化变量
	$('#song_name').html(song_data['name']);
	$('#song_artist').html(song_data['artists'][0]['name']);
	var time_format = timetoformat(song_data['duration']);
	var minute = time_format[0];
	var second = time_format[1];
	var temp_html = `	<div class="list-item">
							<span style="background: url(img/playing.gif) no-repeat 50%;font-size: 0px" class="item-num">1</span>
							<div id="song_name" class="item-name">` + song_data['name'] + `</div>
							<span id="song_artist" class="item-artist">` + song_data['artists'][0]['name'] + `</span>
							<span id="song_time" class="item-time">` + minute + `:` + second + `</span>
						</div>`;
	$(".list_all").html(temp_html);
	$(".music-btn").children().eq(0).removeClass('active');
	$(".music-btn").children().eq(1).removeClass('active');
	$(".music-btn").children().eq(2).removeClass('active');
	$(".music-btn").children().eq(3).removeClass('active');
	$(".music-btn").children().eq(0).addClass('active');
}

$("#play_control").on('click',function(){
	$("#play_control_icon").toggleClass("icon-pause");
	$("#play_control_icon").toggleClass("icon-play");
	play();
});

//电脑端的进度条控制
$(".mmProgress-dot").on('mousedown',function(){
	old_position_left = $(this).position().left;
	old_pageX = event.pageX;
	flag = 1;
});
$(document).on('mousemove',function(){
	if(old_position_left != ''){
		new_pageX = event.pageX;;//新的鼠标左侧偏移量
		var new_offset = new_pageX - old_pageX;
		if(old_position_left + new_offset <= $(".progress-line").width()){
			$(".progress-inner").css("width",old_position_left + new_offset + 'px');
		}else if(old_position_left + new_offset > $(".progress-line").width()){
			$(".progress-inner").css("width",$(".progress-line").width() + 'px');
		}
	}
	
});
$(document).on('mouseup',function(){
	if(flag){
		old_position_left = '';
		audio.currentTime = $(".progress-inner").width() / $(".progress-line").width() * audio.duration;
		flag = 0;
	}
});

//移动端的进度条控制
$(".mmProgress-dot").on('touchstart',function(){
	old_position_left = $(this).position().left;
	old_pageX = event.touches[0].clientX;
	flag = 1;
});
$(document).on('touchmove',function(){
	if(old_position_left != ''){
		new_pageX = event.touches[0].clientX;//新的鼠标左侧偏移量
		var new_offset = new_pageX - old_pageX;
		if(old_position_left + new_offset <= $(".progress-line").width()){
			$(".progress-inner").css("width",old_position_left + new_offset + 'px');
		}else if(old_position_left + new_offset > $(".progress-line").width()){
			$(".progress-inner").css("width",$(".progress-line").width() + 'px');
		}
	}
	
});
$(document).on('touchend',function(){
	if(flag){
		old_position_left = '';
		audio.currentTime = $(".progress-inner").width() / $(".progress-line").width() * audio.duration;
		flag = 0;
	}
});

var time_progress = setInterval(function(){
	if(!flag){
		if(!document.getElementById('audio').paused){
			var audio=document.getElementById("audio");
			$(".progress-inner").css("width",audio.currentTime / audio.duration * $(".progress-line").width()  + 'px');
			var temp_total_time = song_data['duration'];
			var now_minute = parseInt(audio.currentTime / 60 );
			var now_second = parseInt(audio.currentTime / 60 % now_minute * 60);
			if(now_minute == 0){
				now_second = parseInt(audio.currentTime);
			}
			if(now_second < 10){
				now_second = '0' + now_second;
			}
			if(now_minute < 10){
				now_minute = '0' + now_minute;
			}
			var now_time = now_minute + ':' + now_second + $('.time-bar').html().substr(5,6);
			$('.time-bar').html(now_time);
			
			//滚动歌词
			for(var i = 0 ; i < lyric_points.length ; i++){
				if(lyric_points[i].slice(1,3) == now_minute && lyric_points[i].slice(4,6) == now_second){
					y_offset = 102 - i * 34;
					$(".lyric-box").css("transform","translate3d(0px, " + y_offset + "px, 0px)");
					console.log(i);
					$(".lyric-box p:eq(" + i + ")").css({"font-size":"20px","color":"#40ce8f"});
					for(var j = 0 ; j < lyric_points.length ; j++){
						if(j != i){
							$(".lyric-box p:eq(" + j + ")").css({"font-size":"","color":""})
						};
					}
				}
			}
		}
	}
}, 500);

function GetLyric(idx) {
	$.ajax({
		type: "GET",
		url: "http://musicland.yyuanyin.cn:8080/MusicLand/GetMusic",
		dataType: "json",
		data: {name:idx, method: "lyric"},
		success: function(data){
			console.log(data);
			temp_data2 = data['lrc']['lyric'];
			temp_data1 = data['tlyric']['lyric'];
			if(typeof(temp_data2) != 'undefined' && temp_data2 != null){
				console.log(1);
				data = temp_data2;
			}
			if(typeof(temp_data1) != 'undefined' && temp_data1 != null){
				console.log(2);
				data = temp_data1;
			}
			data = data.split('\n');
			lyric_points = data;
			console.log(data);
			temp_html = ''
			for(var i = 0;i < data.length; i++){
				var reg=/\d/;
				Is_has_num = reg.test(data[i]);
				if(Is_has_num){
					if(data[i].slice(11) == ''){
						temp_html = temp_html + `<p> MusicLand~ </p>`;
					}else{
						temp_html = temp_html + `<p>` + data[i].slice(11) + `</p>`;
					}
				}else{
					temp_html = temp_html + `<p>` + data[i] + `</p>`;
				}
			}
			$(".lyric-box").html(temp_html);
		},
		error: function(data){
			console.log('error');
		}
	});
}