$(document).ready(function(){
	
	// YouTube player initialization
	tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	$("#video").css({"width":$(window).width(),"height":$(window).height()});
	
	sly = new Sly('#slider', {
			horizontal: 1,
			itemNav: 'centered',
			smart: 1,
			activateOn: 'click',
			mouseDragging: 1,
			touchDragging: 1,
			releaseSwing: 1,
			startAt: 1,
			scrollBar: $('#scrollbar'),
			scrollBy: 1,
			speed: 300,
			elasticBounds: 1,
			easing: 'easeOutExpo',
			dragHandle: 1,
			dynamicHandle: 1,
			clickBar: 1,
		}).init();
		
	getting_more = false;
	
	sly.on('change move',function(){
		if(sly.rel.lastItem>last_viewed){
			last_viewed = sly.rel.lastItem;
			if(this.pos.dest > this.pos.end - 1000 && !getting_more){
				getting_more = true;
				getYoutube(0);
			}
			var lastViewed = last_viewed;
			var src = songs_list[lastViewed][2];
			if(src=='images/album.png'){
				$.ajax({
					type: "GET",
					url: "https://itunes.apple.com/search?term="+encodeURIComponent(songs_list[lastViewed][0])+"&media=music&limit=1",
					dataType: "jsonp",
					success:function(res){
						if(res.results.length>0){
							songs_list[lastViewed][2] = res.results[0].artworkUrl100.replace('100x100bb','227x227bb');
							songs_list[lastViewed][1] = res.results[0].artistName;
							songs_list[lastViewed][0] = res.results[0].trackName;
						}
						src = songs_list[lastViewed][2];
						$('ul#songs li:nth-child('+(lastViewed+1)+')').find('img').attr('src',songs_list[lastViewed][2]);
					}
				});
			}else{
				$('ul#songs li:nth-child('+(lastViewed+1)+')').find('img').attr('src',songs_list[lastViewed][2]);
			}
		}
	});
	
	sly.on('active',function(event,index){
		playSong(index);
	});
	
	youtube_page_token = '';
	added = 0;
	found = 0;
	
	songs_list = [];
	temp_list = [];
	last_viewed = 0;
	playing_now = 0;
	
	played = [];
	timer = setInterval('',3600);
	waiting = 0;
	
	loading(0);
	
	getSongs();
	
});

$(window).resize(function(){
	$("#video").css({"width":$(window).width(),"height":$(window).height()});
});

function onYouTubeIframeAPIReady() {
	player = new YT.Player('video', {
		height: $(window).height(),
		width: $(window).width(),
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError': function(event){ if(get_id(player.getVideoUrl())!='') sly.activate(playing_now+1); }
		},
		playerVars: {
			'rel': false,
			'iv_load_policy': 3
		}
	});
}

function onPlayerReady(event){
	event.target.playVideo();
}

function onPlayerStateChange(event){
	if(event.data == YT.PlayerState.ENDED){
		sly.activate(playing_now+1);
	}
}
    
function stopVideo(){
    player.stopVideo();
}

function playSong(id){
	stopVideo();
	loading(1);
	playing_now = id;
	if(id<=songs_list.length-1){
		var video_id = songs_list[id][3];
		if(video_id!=''){
			loading(2);
			player.loadVideoById(video_id, 0, "large");
		}else{
			$.ajax({
				type: "GET",
				url: 'https://content.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&lr=en&orderby=viewCount&maxResults=1&hl=en&key=AIzaSyB0Jm1M4z4ffP3yFdEPFk-sd9XU5JabZLM&videoDuration=short&q='+encodeURIComponent(songs_list[id][0])+'&videoCategoryId=10&regionCode=us',
				dataType: "jsonp",
				success: function(res){
					if(res.items){
						songs_list[id][3] = res.items[0].id.videoId;
						playSong(id);
					}
				}
			})
		}
	}
}

function getSongs(){
	temp_list = [];
	$.ajax({
		type: "GET",
		url: "https://itunes.apple.com/us/rss/topalbums/limit=200/json",
		dataType: "jsonp",
		success: function(res){
			if(res.feed.entry){
				for(var i=0;i<res.feed.entry.length;i++){
					temp_list[i] = [
						res.feed.entry[i].title.label,
						res.feed.entry[i]['im:artist'].label,
						res.feed.entry[i]['im:image'][2].label.replace('170x170bb','227x227bb'),
						''
					];
				}
			}
			getYoutube(0);
		}
	});
}

function add_new_items(){
	if(!waiting){
		clearInterval(timer);
		var playFirst = false;
		for(var i=0;i<temp_list.length;i++){
			if(added<14){
				sly.add("<li><img class='thumb' src='"+temp_list[i][2]+"'/></li>");
			}else{
				sly.add("<li><img class='thumb' src='images/album.png'/></li>");
			}
			if(!added){
				playFirst = true;
			}
			added++;
		}
		songs_list = songs_list.concat(temp_list);
		if(playFirst){
			sly.activate(0);
		}
		getting_more = false;
	}
}

function init_cover(i){
	if(found<14 && temp_list[i][1]==''){
		found++;
		$.ajax({
			type: "GET",
			url: "https://itunes.apple.com/search?term="+encodeURIComponent(temp_list[i][0])+"&media=music&limit=1",
			dataType: "jsonp",
			success: function(res){
				if(res.results.length>0){
					temp_list[i] = [res.results[0].trackName,res.results[0].artistName,res.results[0].artworkUrl100.replace('100x100bb','227x227bb'),''];
				}
				waiting--;
			}
		});
	}
}

function getYoutube(request){
	if(request==0){
		temp_list = [];
	}else if(request==2){
		temp_list = shuffle(temp_list);
		temp_list = temp_list.filter(function(){return true;});
		if(found<14){
			for(var i=0;i<temp_list.length;i++){
				if(waiting<14 && temp_list[i][1]==''){
					waiting++;
				}
				init_cover(i);
			}
		}
		timer = setInterval('add_new_items();',500);
		return;
	}

	$.ajax({
		type: "GET",
		url: "https://content.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&lr=en&orderby=viewCount&maxResults=50&hl=en&key=AIzaSyB0Jm1M4z4ffP3yFdEPFk-sd9XU5JabZLM&videoDuration=short&videoCategoryId=10&regionCode=us&pageToken="+youtube_page_token,
		dataType: "jsonp",
		success: function(response){
			if(response.items){
				for(id=0;id<response.items.length;id++){
					var video_id = response.items[id].id.videoId;
					var video_title = clear_text(response.items[id].snippet.title);
					temp_list[temp_list.length] = [video_title,'','images/album.png',video_id];
				}
			}
			youtube_page_token = response.nextPageToken;
			getYoutube(request+1);
		}
	});
}

function shuffle(array){
	var currentIndex = array.length, temporaryValue, randomIndex;
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

function loading(num){
	if(num==0||num==1){
		$("#loader").fadeIn("slow");
	}else{
		$("#loader").fadeOut("slow");
	}
}