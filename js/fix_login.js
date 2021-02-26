$("#username").on("focus",function(){
	var username = $("#username").parent();
	var password = $("#password").parent();
	username.css('border','1px solid #B4DCFE');
	password.css('border','');
});
$("#password").on("focus",function(){
	var username = $("#username").parent();
	var password = $("#password").parent();
	username.css('border','');
	password.css('border','1px solid #B4DCFE');
});

$(".input_outer input").on("keyup",function(){
	if($("#username").val() != '' && $("#password").val() != ''){
		$(".tip_login").html('');
	}
});

// 弹出登录框
$(".login_btn").on("click",function(){
	$(".mask").css('display','block');
	$(".fix_login").css('display','block');
	$(".fix_login").css("transform","translate3d(0px, -50px, 0px)");
	$(".fix_login").css("opacity","0");
	setTimeout('$(".fix_login").css("transform","translate3d(0px, 0px, 0px)");$(".fix_login").css("opacity","1");', 10);
});

// 弹出登录框 _ Play页
$("#login_btn").on("click",function(){
	$(".mask").css('display','block');
	$(".fix_login").css('display','block');
	$(".fix_login").css("transform","translate3d(0px, -50px, 0px)");
	$(".fix_login").css("opacity","0");
	setTimeout('$(".fix_login").css("transform","translate3d(0px, 0px, 0px)");$(".fix_login").css("opacity","1");', 10);
});

// 退出按钮
$(".login_out").on("click",function(){
	localStorage.removeItem('username');
	localStorage.removeItem('history_song');
	localStorage.removeItem('love_song');
	Username_init();
});

$(".mask").on("click",function(){
	$(".mask").css('display','');
	$(".fix_login").css('display','');
});

$("#register_btn").on("click",function(){
	if($("#username").val() == '' || $("#password").val() == ''){
		$(".tip_login").html('请输入完整');
		return
	}
	$.ajax({
		type: "GET",
		url: "http://musicland.yyuanyin.cn:8080/MusicLand/UserManage",
		dataType: "text",
		async : false,
		data: {username:$("#username").val() , password: $("#password").val(),method: "register"},
		success: function(data){
			  if(data == 'success'){
					alert('注册成功');
					localStorage.username = $("#username").val();
					$(".mask").css('display','');
					$(".fix_login").css('display','');
					Username_init();
			  }else{
					alert('该用户名已经存在');
			  }
		},
		error: function(data){
				console.log(data);
				alert('未知错误');
		}
	});
});

$("#submit_btn").on("click",function(){
	if($("#username").val() == '' || $("#password").val() == ''){
		$(".tip_login").html('请输入完整');
		return
	}
	$.ajax({
		type: "GET",
		url: "http://musicland.yyuanyin.cn:8080/MusicLand/UserManage",
		dataType: "text",
		async : false,
		data: {username: $("#username").val(), password: $("#password").val(),method: "login"},
		success: function(data){
				if(data == 'Wrong'){
					alert('账号不存在或者密码错误');
					return;
				}
				localStorage.username = $("#username").val();
				$(".mask").css('display','');
				$(".fix_login").css('display','');
				Username_init();
		},
		error: function(data){
				console.log(data);
				alert('未知错误');
		}
	});
});


//初始化 登录按钮为个人账户
function Username_init() {
	console.log(localStorage.username);
	if(typeof(localStorage.username) != 'undefined'){
		$(".login_btn").html('欢迎！' + localStorage.username);
		$(".login_out").css('display','block');
	}else{
		$(".login_btn").html('登录');
		$(".login_out").css('display','');
	}
}

function GetLoveSong() {
	$.ajax({
		type: "GET",
		url: "http://musicland.yyuanyin.cn:8080/MusicLand/UserManage",
		dataType: "json",
		async : false,
		data: {username: localStorage.username,method: "GetLoveSong"},
		success: function(data){
				localStorage.love_song = JSON.stringify(data);;
		},
		error: function(data){
				console.log(data);
				alert('未知错误');
		}
	});
}

function GetHistorySong() {
	$.ajax({
		type: "GET",
		url: "http://musicland.yyuanyin.cn:8080/MusicLand/UserManage",
		dataType: "json",
		async : false,
		data: {username: localStorage.username,method: "GetHistorySong"},
		success: function(data){
				localStorage.history_song = JSON.stringify(data);;
		},
		error: function(data){
				console.log(data);
				alert('未知错误');
		}
	});
}


Username_init();