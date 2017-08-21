const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');
//require所需要的模块

for (var i = 1; i < 10; i++) {
    var url = 'url' + i + '.html'; //定义url，定义爬取范围
    
    https.get(url, function(res) { //通过url获取html
        var html = '';
        res.setEncoding('utf-8');
        res.on('data', function(data) {
            html += data;
        });
        res.on('end', function() {
            var BlogData = filterBolg(html);
            var hms= BlogData[0].time.split(' ')[1];
            var h=hms.split(':')[0];
            var m=hms.split(':')[1];
            var s=hms.split(':')[2];
            var time = BlogData[0].time.split(' ')[0]+'-'+h+'-'+m+'-'+s;
            console.log(BlogData);
            imgSave(BlogData, time);
            console.log('\n\n');
        }).on('err', function() {
            console.log('false');
        })
    })

}

//网页解析
function filterBolg(html) {
    var $ = cheerio.load(html);
    var BlogContent = $('.articleText');
    var BlogTitle = $('.skinArticleHeader2').find('h1');
    var BlogTime = $('.articleDetailArea .articleTime').find('time');
    var BlogData = [];

    BlogContent.each(function(item) {
        var content = $(this);
        var imgs = content.find('img');
        var videos = content.find('iframe');
        var text = content.text();
        var title = BlogTitle.text();
        var time = BlogTime.text()
        var Data = {
                title: title,
                time: time,
                text: text,
                img: [],
                video: []
            }
            //json,存放图片。视频。文字
        imgs.each(function(item) {
            var img = $(this) //.find('img');
            var imgUrl = img.attr('src');
            Data.img.push(imgUrl);
        });
        //解析图片src
        videos.each(function(item) {
            var video = $(this);
            var videoUrl = video.attr('src');
            Data.video.push(videoUrl);
        });
        //解析视频src

        BlogData.push(Data); //加进数组
    });

    return BlogData;
}

//保存图片
function imgSave(BlogData,time) {
	for (var i = 0; i < BlogData[0].img.length; i++) {
	    
	    var img_src = BlogData[0].img[i];
	    request.head(img_src, function(err, res, body) {
	        if (err) {
	            console.log(err);
	        }
	    });
	    request(img_src).pipe(fs.createWriteStream('./image/' + time + '-0' + i + '.jpg'));
	}
}

//保存视频
function videoSave(BlogData,time) {
	for (var j = 0; j < BlogData[0].video.length; j++) {
	    var video_src = 'https://static.blog-video.jp/output/hq/' + BlogData[0].video[j].split('=')[1] + '.mp4';
	    request.head(video_src, function(err, res, body) {
	        if (err) {
	            console.log(err);
	        }
	    });
	    request(video_src).pipe(fs.createWriteStream('./video/' + time + '---' + j + '.mp4'));
	}
}


