var songList,$=window.Zepto,root=window.player,$scope=$(document.body),index=0,audio=new root.AudioControl;function bindEvent(){$scope.on("play:change",function(o,n,t){audio.getAudio(songList[n].audio),"play"==audio.status&&(cancelAnimationFrame(window.frameID),audio.play(),root.process.start()),root.process.renderAllTime(songList[n].duration),root.render(songList[n]),root.process.update(0)}),$scope.on("click",".prev-btn",function(){var o=controlManager.prev();root.render(songList[o]),$scope.trigger("play:change",o)}),$scope.on("click",".next-btn",function(){var o=controlManager.next();root.render(songList[o]),$scope.trigger("play:change",o)}),$scope.on("click",".play-btn",function(){"play"==audio.status?(audio.pause(),root.process.stop(window.pers)):(audio.play(),root.process.start()),$(this).toggleClass("playing")})}function bindTouch(){var o=$scope.find(".slider-pointer"),n=$scope.find(".pro-wrapper").offset(),r=n.left,a=n.width;o.on("touchstart",function(o){root.process.stop()}).on("touchmove",function(o){var n=(o.changedTouches[0].clientX-r)/a;n<0&&(n=0),1<n&&(n=1),root.process.update(n)}).on("touchend",function(o){var n=(o.changedTouches[0].clientX-r)/a;n<0&&(n=0),1<n&&(n=1);var t=songList[controlManager.index].duration,e=(window.pers=n)*t;root.process.start(window.pers),audio.playTo(e),$scope.find(".play-btn").addClass("playing")})}function getData(o){$.ajax({type:"GET",url:o,success:function(o){root.render(o[0]),songList=o,bindEvent(),bindTouch(),controlManager=new root.controlManager(o.length),$scope.trigger("play:change",index)},error:function(){}})}window.audio=audio,getData("./mock/data.json");
