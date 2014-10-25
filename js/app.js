$(document).ready(function(){
	titles = [];
	played = [];
	
	get_data();

	$(".sbt").click(function(){
		player.pause();
		get_music();
	});
	
	$(".dld").click(function(){
		if(video_id!=''){
			player.pause();
			window.open('http://www.youtube.com/watch?v='+video_id+'&t='+Math.round(player.currentTime()).toString()+'s','_blank');
		}
	});
	
	video_url = '';

});

function get_music(tried){
	video_id = '';
	
	$(".video").html('');
	
	loading(1);
	
	var yt_url, tmp_title;
	
	var opt = Math.floor(Math.random()*500);
	if(opt<250 && itn_played<200){
		var id = itn_ids[Math.floor(Math.random()*itn_ids.length)];
		yt_url = 'http://gdata.youtube.com/feeds/api/videos?q='+encodeURIComponent(titles[id])+'%2Cofficial&category=music&format=5&max-results=1&start-index=1&v=2&alt=jsonc';
		tmp_title = titles[id];
		itn_played++;
		array_del(id, itn_ids);
	}else if(yt_played<200){
		var id = yt_ids[Math.floor(Math.random()*yt_ids.length)];
		yt_url = 'http://gdata.youtube.com/feeds/api/videos?category=music%2Cofficial&format=5&max-results=1&start-index='+id+'&v=2&alt=jsonc';
		tmp_title = '';
		yt_played++;
		array_del(id, yt_ids);
	}else{
		get_data();
		return;
	}

	$.ajax({
		type: "GET",
		url: yt_url,
		dataType: "jsonp",
		success: function(response){
			if(response.data){
				if(response.data.items){
					var title = response.data.items[0].title;
				}else{
					var title = '';
				}
				var duration = response.data.items[0].duration;
			}else{
				var title = '';
				var duration = 0;
			}
			if(response.data && played.indexOf(response.data.items[0].id)==-1 && title.indexOf("Various Artists")==-1 && duration<=600){
				var video_id = response.data.items[0].id;
				
				played.push(video_id);
				
				var video_title = response.data.items[0].title;

				if(tmp_title!=''){
					video_title = tmp_title;
				}
				
				var clean_title = clear_text(video_title);
				
				$.ajax({
					type: "GET",
					url: "https://itunes.apple.com/search?term="+encodeURIComponent(clean_title)+"&media=music&limit=1",
					dataType: "jsonp",
					success:function(res){
						if(res.results.length>0){
							var cover = res.results[0].artworkUrl100;
							var artist = res.results[0].artistName;
							var song = res.results[0].trackName;
							var info = "<br/><img class='shadow' src='" + cover + "'><br/><br/>[" + artist + "] - " + song + "<br/><br/>";
							$(".info").html(info);
							get_video("http://www.youtube.com/watch?v="+video_id);
						}else{
							get_music();
						}
					}
					
				});
			}else{
				get_music();
			}
			
		}
	});
}

function get_data(){
	loading(0);
	yt_ids = [];
	itn_ids = [];
	yt_played = 0;
	itn_played = 0;
	
	for(var i=0;i<200;i++){
		itn_ids.push(i);
		yt_ids.push(i+1);
	}
	
	itn_ids = shuffle(itn_ids);
	yt_ids = shuffle(yt_ids);
	
	$.ajax({
		type: "GET",
		url: "https://itunes.apple.com/us/rss/topalbums/limit=200/json",
		dataType: "jsonp",
		success: function(res){
			if(res.feed.entry){
				for(i=0;i<res.feed.entry.length;i++){
					titles[i] = res.feed.entry[i].title.label;
				}
				get_music();
			}
		}
	});
}

function clear_text(string){
	string = string.toLowerCase();
	string = string.replace('official video','');
	string = string.replace('official music video','');
	string = string.replace('official lyric video','');
	string = string.replace('music video','');
	string = string.replace('hd video','');
	string = string.replace('hd','');
	string = string.replace('"','');
	string = string.replace(',','');
	string = string.replace(' - ',' ');
	string = string.replace(/ *\([^)]*\) */g, '');
	string = string.replace(/ *\[[^]]*\) */g, '');
	return string;
}

function array_del(val, array){
	var index = array.indexOf(val);
	if(index > -1){
		array.splice(index, 1);
	}
	return array;
}

function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex;
  //While there remain elements to shuffle...
  while (0 !== currentIndex) {
    //Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    //And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function loading(num){
	if(num==0){
		$(".info").html("<br/><img class='loading' src='images/loading.gif'/> Getting data...<br/><br/>");
	}else{
		$(".info").html("<br/><img class='loading' src='images/loading.gif'/> Getting song...<br/><br/>");
	}
}