function inbtwn(a,b,c){try{var a1 = a.split(b);var a2 = a1[1].split(c);return a2[0];}catch(err){return '';}}

function swap16136(p1,p2){
	var l3 = p1[0];
		var l4c = p2 % p1.length;
	var l4 = p1[l4c];
	p1[0] = l4;
	p1[p2] = l3;
	return p1;
}

function clone16136(p1,p2){
	return p1.slice(p2);
}

function decipher(sig){
	var sigs = sig.split("");
	sigs = clone16136(sigs,1);
	sigs = swap16136(sigs,12);
	sigs = swap16136(sigs,24);
	sigs = clone16136(sigs,1);
	sigs = swap16136(sigs,52);
	sigs = swap16136(sigs,70);
	sigs = clone16136(sigs,2);
	sig = sigs.join("");
	return sig;
}

function get_id(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7].length==11){
        return match[7];
    }else{
        alert("Incorrect YouTube url!");
    }
}

function get_video(url){
var id = get_id(url);
$.get("get_video_info.php?video_id="+id,function(da){
	var vid = id;
	var title=unescape(inbtwn(da,'&title=','&')).replace(/\+/g," ");
	title=escape(title.replace(/\//g,"_").replace(/\"/g, "").replace(/\'/g,"\\\'"));
	var fmt=inbtwn(da,'url_encoded_fmt_stream_map=','&');
	if(fmt==null) fmt=inbtwn(da,'fmt_stream_map": "','"').replace("\\/", "/");
	fmt=unescape(fmt);
	var t5;
	var fa = fmt.split(/,/gi);
	for(i=0;i<=fa.length;i++){
		if(fa[i]=="") break;
		var far="";
		try{
			far=unescape(fa[i].match("url=([^&]+)")[1])+"&title="+decodeURIComponent(escape(title));
		}catch(err){
		}
			if(far.substring(0,4)=="http" || far.substring(0,2)=="-r"){
				var itag = parseInt(fa[i].match("itag=([^&]+)")[1]);
				if(!far.match("signature=")){
					var sign;
					try{sign = fa[i].match("sig=([^&]+)")[1];}catch(e){
						try{sign = fa[i].match("&s=([^&]+)")[1];}catch(e){
							try{sign = fa[i].match("^s=([^&]+)")[1];}catch(e){
							}
						}
					}
					sign = decipher(sign);
					far += "&signature="+sign;
				}
				if(itag==18) t5 = far;
			}
	}
	if(t5==undefined){
		get_video(url);
		return;
	}

	video_id = vid;
	
	$(".video").html('<video id="ytvid" class="video-js vjs-default-skin" controls autoplay preload="auto" width="460" height="295" poster="http://img.ytimg.com/vi/'+vid+'/maxresdefault.jpg" data-setup="{}"><source src="'+t5+'" type="video/mp4"><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p></video>');
	
	player = videojs(document.getElementById('ytvid'), {"controls": true, "autoplay": true, "preload": "auto"}, function(){
		this.on("ended", function(){
			get_music();
		});
	});
	
});
}