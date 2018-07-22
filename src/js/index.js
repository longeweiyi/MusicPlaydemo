var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);

var index = 0;
var songList;
// var curTime;
var audio = new root.AudioControl();
window.audio = audio;
function bindEvent() {
    $scope.on("play:change", function (event, index, flag) {
        audio.getAudio(songList[index].audio);
        if (audio.status == 'play') {
            cancelAnimationFrame(window.frameID);
            audio.play();
            root.process.start();
        }
        root.process.renderAllTime(songList[index].duration);

        root.render(songList[index]);
        root.process.update(0);
    })
    $scope.on('click', ".prev-btn", function () {
        // if(index == 0) {
        //     index = songList.length;
        // }
        // index--;
        var index = controlManager.prev();
        root.render(songList[index]);
        $scope.trigger("play:change", index);
    })
    $scope.on('click', ".next-btn", function () {
        // if(index == songList.length-1) {
        //     index = -1;
        // }
        // index++;
        var index = controlManager.next();
        root.render(songList[index]);
        $scope.trigger("play:change", index);
    })
    $scope.on("click", ".play-btn", function () {
        // console.log(audio.status);
        if (audio.status == "play") {
            audio.pause();
            root.process.stop(window.pers);
        } else {
            audio.play();
            root.process.start();
        }
        $(this).toggleClass("playing");
    })
}

function bindTouch() {
    var $slider = $scope.find('.slider-pointer');
    var offset = $scope.find('.pro-wrapper').offset();
    var left = offset.left;
    var width = offset.width;
    $slider.on('touchstart', function (e) {
        root.process.stop();
    }).on('touchmove', function (e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if (per < 0) {
            per = 0;
        }
        if (per > 1) {
            per = 1;
        }
        root.process.update(per);
    }).on('touchend', function (e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if (per < 0) {
            per = 0;
        }
        if (per > 1) {
            per = 1;
        }
        var curDuration = songList[controlManager.index].duration;
        window.pers = per;
        var cur = per * curDuration;
        root.process.start(window.pers);
        audio.playTo(cur);
        $scope.find('.play-btn').addClass('playing');
    })
}

function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            root.render(data[0]);
            songList = data;
            bindEvent();
            bindTouch();
            controlManager = new root.controlManager(data.length);
            $scope.trigger("play:change", index);
        },
        error: function () {
            console.log('error');
        }
    })
}

getData('../mock/data.json');