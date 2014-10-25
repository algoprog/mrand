<!DOCTYPE html>
<html>

<head>
<title>mRand - Random music player</title>
<meta charset="UTF-8">
<meta name="description" content="Discover random top songs from YouTube and iTunes.">
<meta name="keywords" content="mrand, music rand, youtube, itunes, random music">
<link href="images/logo.png" rel="icon" type="image/png"/>
<script src="js/jquery.min.js"></script>
<link href="//vjs.zencdn.net/4.6/video-js.css" rel="stylesheet">
<script src="//vjs.zencdn.net/4.6/video.js"></script>
<style type="text/css">
  .vjs-default-skin .vjs-play-progress,
  .vjs-default-skin .vjs-volume-level { background-color: #ff0000 }
  .vjs-default-skin .vjs-control-bar,
  .vjs-default-skin .vjs-big-play-button { background: rgba(0,0,0,1) }
  .vjs-default-skin .vjs-slider { background: rgba(0,0,0,0.3333333333333333) }
</style>
<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
<script src="js/app.js"></script>
<link rel="stylesheet" href="css/app.css"/>
<link href='http://fonts.googleapis.com/css?family=Dosis:400,700' rel='stylesheet' type='text/css'>

<script src="js/youtube.js"></script>

</head>

<body>

<div class="main">

<div class="top">
	<span class="title">mRand</span> <span class="msg">Random music player</span>
</div>
Discover random top songs from YouTube and iTunes.

<br/><br/>
<div class="result">
<span class="info"></span>
  <div class="video shadow" id="video">
  </div>
</div>

<br/>
<p align="center"><input type="button" class="sbt btn btn-primary" value="mRand"> <input type="button" class="dld btn btn-primary" value="Watch on YT"></p>

<br/>
<p align="center">Songs are played automaticaly. To change song click mRand button</p>
<p align="center">Developed by <a href="http://algoprog.com" target="blank">Algoprog</a> in 1 day - Based on YouTube &amp; iTunes API</p>

</div>

</body>

</html>