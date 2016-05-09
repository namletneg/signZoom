(function () {
    var el = document.getElementById('myHammer'),
        myHammer = new Hammer(el),
        initScale,
        initTranslate,
        getScale = function (el) {
            var str = $(el).css('transform');

            if (str === 'none') {
                return 1;
            } else {
                // 小数点保留两位
                return +parseFloat($(el).css('transform').match(/\d.*\d/)[0].split(',')[0]).toFixed(3);
            }
        },
        getTranslate = function (el) {
            var str = $(el).css('transform'),
                arr,
                scale = getScale(el);

            if (str === 'none') {
                return {
                    x: 0,
                    y: 0
                };
            } else {
                arr = $(el).css('transform').match(/\d.*\d/);
                // 小数点保留两位
                return {
                    x: +parseFloat(arr[0].split(',')[4] / scale).toFixed(3),
                    y: +parseFloat(arr[0].split(',')[5] / scale).toFixed(3)
                };
            }
        };

    initScale = getScale(el);
    initTranslate = getTranslate(el);
    myHammer.get('pinch').set({enable: true});
    myHammer.get('pan').set({direction: Hammer.DIRECTION_ALL});
    myHammer.on('pinch', function (ev) {
        var endScale = initScale + (parseFloat(ev.scale).toFixed(3) - 1);

        $('.console').html(initScale);
        endScale = endScale < 1 ? 1 : endScale;
        endScale = endScale > 3 ? 3 : endScale;

        $(el).css('transform', 'scale(' + endScale + ')');
        $(el).css('transform', 'scale(' + endScale + ') translate3d(' + initTranslate.x + 'px,' + initTranslate.y + 'px,0)');
    }).
        on('pan', function (ev) {
            var endTranslateX = initTranslate.x + ev.deltaX,
                endTranslateY = initTranslate.y + ev.deltaY,
                rangeX = (initScale - 1) * $(el).width() / initScale / 2,
                rangeY = (initScale - 1) * $(el).height() / initScale / 2;

            $('.console').html(rangeX + ',' + rangeY);
            $('.console3').html(endTranslateX + ',' + endTranslateY);
            if (Math.abs(endTranslateX) < rangeX && Math.abs(endTranslateY) < rangeY) {
            }

            if (endTranslateX < 0) {
                if (endTranslateX < -rangeX) {
                    endTranslateX = -rangeX;
                }
            } else {
                if (endTranslateX > rangeX) {
                    endTranslateX = rangeX;
                }
            }
            if (endTranslateY < 0) {
                if (endTranslateY < -rangeY) {
                    endTranslateY = -rangeY;
                }
            } else {
                if (endTranslateY > rangeY) {
                    endTranslateY = rangeY;
                }
            }
            $(el).css('transform', 'scale(' + initScale + ') translate3d(' + endTranslateX + 'px,' + endTranslateY + 'px,0)');
        });

    $(el).bind('touchend', function () {
        initScale = getScale(el);
        initTranslate = getTranslate(el);
    });
})();