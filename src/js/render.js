//实现渲染

(function($, root){
    // renderInfo(data);
    var $scope = $(document.body);
    function renderInfo(info) {
        var html = '<div class="song-name">' + info.song + '</div>\
                    <div class="singer-name">' + info.singer + '</div>\
                    <div class="album-name">' + info.album + '</div>';
        $scope.find(".song-info").html(html);
    }

    function renderImg(data) {
        var img = new Image();
        img.src = data.image;
        img.onload = function() {
            root.blurImg(img,$scope);
            $scope.find(".song-img img").attr("src", img.src);
        }
    }

    function renderIsLike(isLike) {
        if(isLike) {
            $scope.find(".like-btn").addClass("liking");
        } else {
            $scope.find(".like-btn").removeClass("liking");
        }
    }

    root.render = function(data) {
        renderInfo(data);
        renderImg(data);
        renderIsLike(data.isLike);
    }

})(window.Zepto, window.player || (window.player={}))
//通过window.player对象暴露函数