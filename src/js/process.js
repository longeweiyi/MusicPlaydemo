(function ($, root) {
    var $scope = $(document.body);
    var curDuration;
    var root = window.player;
    // var frameID;
    var lastPer = 0;
    var startTime;

    //处理时间格式 秒-->分+秒
    function formatTime(duration) {
        duration = Math.round(duration);
        var minute = Math.floor(duration / 60);
        var second = duration - minute * 60;
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
        return minute + ':' + second;
    }
    //渲染每首歌总时间
    function renderAllTime(duration) {
        lastPer = 0;
        curDuration = duration;
        var allTime = formatTime(duration);
        $scope.find('.all-time').html(allTime);
    }
    //更新已经播放的时间和进度条
    function update(percent) {
        var curTime = percent * curDuration;
        curTime = formatTime(curTime);
        $scope.find('.cur-time').html(curTime);
        var per = (percent - 1) * 98 + '%';
        $scope.find('.pro-top').css({
            'transform': 'translateX(' + per + ')'
        })

    }

    // var curS = 0;
    function start(per) {
        //开始播放的时间
        startTime = new Date().getTime();
        //frame每隔16.7ms执行一次
        function frame() {
            var percent;
            var curTime = new Date().getTime();
            if (per) {
                percent = per + (lastPer + curTime - startTime) / (curDuration * 1000);
            } else {
                percent = lastPer + (curTime - startTime) / (curDuration * 1000);
            }
            // console.log(percent);
            if (percent < 1) {
                window.frameID = requestAnimationFrame(frame);
                update(percent);
            }

            if (percent > 1) {
                per = 0;
                lastPer = 0;
                window.pers = undefined;
                window.audio.status = 'pause';
                $scope.find('.playing').removeClass('playing');
                $scope.find('.pro-top').css({ 'transform': 'translateX(-98%)' });
                $('.next-btn').trigger('click');
                $('.play-btn').trigger('click');
            }
        }
        frame();
    }

    function stop(per) {
        var stopTime = new Date().getTime();
        if (per) {
            lastPer = per;
            window.pers = undefined;
            per = 0;
        }
        lastPer += (stopTime - startTime) / (curDuration * 1000);
        cancelAnimationFrame(window.frameID);
    }

    root.process = {
        renderAllTime: renderAllTime,
        update: update,
        start: start,
        stop: stop
    }

})(window.Zepto, window.player || (window.player = {}))