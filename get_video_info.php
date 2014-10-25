<?php
include("html_dom.php");
$id = $_GET['video_id'];
$data = file_get_html("http://www.youtube.com/get_video_info?video_id=$id&asv=3&sts=16136&el=detailpage&hl=en_US");
echo $data;
?>