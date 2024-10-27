var swiper, layer, layerform = null, isSwiperLoading = false, isVrFirstloading = false, isAutoRotate = true, sceneVideoHotspotTmp = [];
layui.use(function () {
    layer = layui.layer;
    layerform = layui.form;
});

window.onload = function () {
    template.defaults.minimize = true;
    if (isIOS()) {
        $('.iconRight .fullscreen').hide();
    }
    if (startScene == 0) {
        if (groupMode == 0) {
            loadingItemSceneListHtml(visitItemSceneList[0]);
        } else {
            loadingItemSceneListHtml(visitItemSceneList[groupModeFirstId]);
            $('.itemGroupListContainer .itemGroupList .groupName' + groupModeFirstId).addClass('active').siblings('div').removeClass('active');
        }
        isSwiperLoading = true;
        $('.itemSwiper .swiper-wrapper .swiper-slide:eq(0)').children('.swiper-box').addClass('active').children('img').show();
        addScrollAnimationStyle();
    }
    autoClipboard();
    onloadCompalteInit();
    /**移动端不展示部分内容**/
    if (isMobile()) {
        $('.iconBottomRight .share').hide();
        $('.iconRight .vr').show();
        $('.iconRight .gyro').show();
        $('.gestureTips div').html('<img src="skin/img/touch_alert.png"><span>左右滑动 更多精彩</span>');
    } else {
        $('.iconBottomRight .share').show();
        $('.iconRight .vr').hide();
        $('.iconRight .gyro').hide();
        $('.gestureTips div').html('<img src="skin/img/mouse_alert.png"><span>左右拖动 更多精彩</span>');
    }

    if (isFirstSceneCompareMode > 0) {
        $('.iconRight .openCompare').show();
        $('.iconRight .openCompare').click();
    }
    if (sceneListShow == 2) {
        setTimeout(function () {
            $('.itemPreview').css({'z-index': 50});
            $('.itemGroupList').css({'z-index': 50});
        }, 1500);
    }
}

/**初次加载后执行**/
function onloadCompalteInit() {
    if (!isVrFirstloading) {
        if ($('.marqueeTop').length > 0) {
            $('.marqueeContent').liMarquee();
            setTimeout(function () {
                $('.marqueeTop').show();
            }, 300);
        }
        setTimeout(function () {
            $('.gestureTips').show();
        }, 1000);
        setTimeout(function () {
            $('.gestureTips').hide();
        }, 4000);
        isVrFirstloading = true;
    }
    if (krpano.get('autorotate.enabled') === false) {
        isAutoRotate = false;
    }
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**退出全屏对比模式**/
$('.exitCompare div').on('click', function () {
    $('#pano').show();
    $('#panoCompare').hide();
    $('.exitCompare div').hide();
    if (krpanoCompare != null) {
        removepano('panoCompare');
        krpanoCompare = null;
    }
});
/**开启全屏对比模式**/
$('.openCompare').on('click', function () {
    $('#pano').hide();
    $('#panoCompare').show();
    $('.exitCompare').css('display', 'flex');
    let _id = panoFirstCompareInfo.id;
    if (panoSceneNums > 1) {
        _id = $('.itemPreviewContainer .itemPreview .swiper-slide-active').attr('data-id');
        if (_id === undefined) {
            _id = panoFirstCompareInfo.id;
        }
    }
    let _xml = VRXMLURL + "comparexml/" + visitId + '-' + _id + '-' + lastTime + '.xml';
    if (krpanoCompare != null) {
        removepano('panoCompare');
    }
    embedpano({
        id: "krpanoCompareObject", xml: _xml, target: "panoCompare", onready: function (k) {
            krpanoCompare = k;
        }
    });
});

/**切换视角弹窗**/
$('.viewswitching').on('click', function () {
    let _area = ['300px', '150px'];
    if (isMobile()) {
        _area = ['90%', '150px'];
    }
    layer.open({
        type: 1,
        title: '视角切换',
        shadeClose: false,
        shade: 0.8,
        area: _area,
        content: $('.viewswitchingContainer')
    });
});

/**切换视角**/
$('.viewswitchingContainer div').on('click', function () {
    $(this).addClass('active').siblings('div').removeClass('active');
    let _index = $(this).index();
    if (_index == 2) {
        krpano.call('skin_view_fisheye();');
    } else if (_index == 1) {
        krpano.call('skin_view_littleplanet();');
    } else {
        krpano.call('skin_view_normal();');
    }
});


window.onresize = function () {
    if (isSwiperLoading) {
        loadingSwiperPlugin();
    }
}

/**加载swiper插件**/
function loadingSwiperGroupPlugin() {
    let _clienWidth = document.body.clientWidth;
    new Swiper(".groupSwiper", {
        slidesPerView: 'auto',
        spaceBetween: 10,
        breakpoints: {
            320: {
                slidesPerView: parseInt(_clienWidth / 75),
                spaceBetween: 10
            },
            768: {
                slidesPerView: parseInt(_clienWidth / 85),
                spaceBetween: 10
            },
            1280: {
                slidesPerView: parseInt(_clienWidth / 95),
                spaceBetween: 10
            }
        },
        grabCursor: true,
        on: {
            init: function () {
                let _slideWidth = $('.itemSwiper .swiper-slide').css("width");
                $('.groupSwiper .swiper-slide').css({"width": (parseInt(_slideWidth) + 10) + 'px'});
            },
            resize: function () {
            },
        },
        centerInsufficientSlides: true,
        freeMode: true,
    });
}

/**加载swiper插件**/
function loadingSwiperPlugin() {
    let _clienWidth = document.body.clientWidth;
    swiper = new Swiper(".itemSwiper", {
        slidesPerView: 'auto',
        spaceBetween: 10,
        breakpoints: {
            320: {
                slidesPerView: parseInt(_clienWidth / 75),
                spaceBetween: 10
            },
            768: {
                slidesPerView: parseInt(_clienWidth / 85),
                spaceBetween: 10
            },
            1280: {
                slidesPerView: parseInt(_clienWidth / 95),
                spaceBetween: 10
            }
        },
        grabCursor: true,
        on: {
            init: function () {
                let _slideWidth = $('.itemSwiper .swiper-slide').css("width");
                $('.itemSwiper .swiper-slide .swiper-box').css({"width": (parseInt(_slideWidth) - 4) + 'px', "height": (parseInt(_slideWidth) - 4) + 'px'});
                showSceneThumbHandler();
            },
            resize: function () {
            },
            observerUpdate: function () {
            },
        },
        centerInsufficientSlides: true,
        freeMode: true,
        observer: true,
    });
    loadingSwiperGroupPlugin();
}

/**重载场景列表数据**/
function loadingItemSceneListHtml(data) {
    $('.itemSwiper .swiper-wrapper').html(template('itemSlideTpl', data));
    loadingSwiperPlugin();
}

/**点击分组加载数据**/
$(document).on('click', '.itemGroupList .groupName', function () {
    $(this).addClass('active').siblings('div').removeClass('active');
    let _index = $(this).attr('data-id');
    loadingItemSceneListHtml(visitItemSceneList[_index]);
    $('.itemSwiper .swiper-wrapper .swiper-slide:eq(0)').click();
});

/**点击场景**/
$(document).on('click', '.itemSwiper .swiper-wrapper .swiper-slide', function () {
    let _id = $(this).attr('data-id');
    let _compareId = $(this).attr('data-compare');
    $(this).children('.swiper-box').addClass('active').parent().siblings().children('.swiper-box').removeClass('active');
    $(this).children('.swiper-box').children('img').show();
    swiper.slideTo($(this).index(), 1000, false);
    if (_compareId > 0) {
        $('.exitCompare div').click();
        $('.iconRight .openCompare').show();
        $('.iconRight .openCompare').click();
        krpano.call('loadscene(scene_' + _id + ', null, MERGE, BLEND(1.0));scene3dtransition(scene_' + _id + ');');
    } else {
        $('.iconRight .openCompare').hide();
        $('.exitCompare div').click();
        krpano.call('loadscene(scene_' + _id + ', null, MERGE, BLEND(1.0));scene3dtransition(scene_' + _id + ');');
    }
    clickSceneThumbTmpHandler(_id);
    isSwitchSceneAutoPlaybg(_id);
});

/**点击展示场景选择**/
var _fristClickScene = false;
$(document).on('click', '.iconBottomLeft .scene', function () {
    if (!_fristClickScene && $('.itemPreviewContainer .itemPreview').css("z-index") == -1) {
        _fristClickScene = true;
        setTimeout(function () {
            $('.itemPreviewContainer .itemPreview').css('z-index', 50);
            $('.itemGroupListContainer .itemGroupList').css('z-index', 50);
            _fristClickScene = false;
        }, 500);
    } else {
        $('.itemPreviewContainer .itemPreview').css('z-index', -1);
        $('.itemGroupListContainer .itemGroupList').css('z-index', -1);
        _fristClickScene = false;
    }
});

/**当前环境是否是手机**/
function isMobile() {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
}

/**作品简介 弹窗**/
$(document).on('click', '.iconBottomRight .infos', function () {
    let _area = ['450px', '350px'];
    if (isMobile()) {
        _area = ['90%', '400px'];
    }
    layer.open({
        type: 1,
        title: '作品简介',
        shadeClose: false,
        shade: 0.8,
        area: _area,
        content: $('.infosContainer')
    });
});

/**联系方式 弹窗**/
$(document).on('click', '.iconBottomRight .contacts', function () {
    let _area = ['360px', '370px'];
    if (isMobile()) {
        _area = ['90%', '370px'];
    }
    layer.open({
        type: 1,
        title: '联系方式',
        shadeClose: false,
        shade: 0.8,
        area: _area,
        content: $('.contactsContainer')
    });
});

/**复制插件**/
function autoClipboard() {
    let clipboard = new ClipboardJS('.clipboard');
    clipboard.on('success', function (e) {
        if (e.text.length > 0) {
            layer.msg('复制成功', {time: 1000});
        }
    });
}

/**音乐播放状态切换**/
function soundOnPlay() {
    $('.iconRight .music img').attr('src', 'skin/img/music-open.png');
}

/**音乐暂停状态切换**/
function soundOnPause() {
    $('.iconRight .music img').attr('src', 'skin/img/music-close.png');
}

/**热点音频暂停**/
function hotspotAudioOnPlay(src) {
    var _src = $('#autoHotspotAudio').attr('src');
    if (_src === undefined || _src != src) {
        $('#autoHotspotAudio').attr('src', src);
        document.getElementById('autoHotspotAudio').play();
        krpano.call("pausesound('bgsnd')");
    } else {
        var _obj = document.getElementById('autoHotspotAudio');
        if (_obj.paused == false) {
            hotspotAudioOnPause();
            krpano.call("playsound('bgsnd')");
        } else {
            document.getElementById('autoHotspotAudio').play();
            krpano.call("pausesound('bgsnd')");
        }
    }
}

/**热点音频播放**/
function hotspotAudioOnPause() {
    document.getElementById('autoHotspotAudio').pause();
}

/**点击热点 跳转场景**/
function HotspotToScene(t) {
    loadingItemSceneListHtml(visitItemSceneList[scene2group[t]]);
    $('.swiper-wrapper .swiper-slide' + t).click();
    $('.swiper-wrapper .swiper-slide' + t).children('.swiper-box').children('img').show();
    $('.itemGroupListContainer .itemGroupList .groupName' + scene2group[t]).addClass('active').siblings('div').removeClass('active');
    clickSceneThumbTmpHandler(t);
}

/**点击热点 打开图片**/
function HotspotToPic(t) {
    let _arr = [];
    _arr['list'] = hotspotlistpics[t];
    $('.hotspotlistpics').html(template('glightBoxPicTpl', _arr));
    var lightboxPics = GLightbox({
        selector: '.glightboxpic',
    });
    lightboxPics.on('open', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", false);
        }
    });
    lightboxPics.on('close', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", true);
        }
    });
    lightboxPics.open();
    $('#glightbox-body .goverlay').css("background-color", "rgba(0, 0, 0, 0.3)");
    $('.glightbox-open').css("height", "100%");
}

/**点击热点 打开视频**/
function HotspotToVideo(t) {
    let _arr = [];
    _arr['list'] = hotspotlistvideo[t];
    $('.hotspotlistvideo').html(template('glightBoxVideoTpl', _arr));
    var lightboxVideo = GLightbox({
        selector: '.glightboxvideo',
    });
    lightboxVideo.on('open', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", false);
        }
    });
    lightboxVideo.on('close', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", true);
        }
    });
    lightboxVideo.open();
    $('#glightbox-body .goverlay').css("background-color", "rgba(0, 0, 0, 0.8)");
    $('.glightbox-open').css("height", "100%");
}

/**点击热点 打开图文热点**/
function hotspotImg2Text(t) {
    let _arr = JSON.parse(hotspotlistImg2Text[t]);
    $('.hotspotlistimgs2text').html(template('glightBoxImgs2TextTpl', _arr));
    var lightboxImgs2Text = GLightbox({
        selector: '.glightboximgs2text',
        moreText: '查看更多',
    });
    lightboxImgs2Text.on('open', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", false);
        }
        $('.gcontainer .gslide-desc').css({'color': '#666666', "font-size": '14px', 'text-indent': '2rem'});
        if (isMobile()) {
            $('.glightbox-clean .gprev').css({"top": "45%", "background-color": 'rgba(0,0,0,.5)'});
            $('.glightbox-clean .gnext').css({"top": "45%", "background-color": 'rgba(0,0,0,.5)'});
            $('.gcontainer .gslide-desc').css({'color': '#ffffff', "font-size": '14px', 'text-indent': '2rem'});
        }
    });
    lightboxImgs2Text.on('close', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", true);
        }
    });
    lightboxImgs2Text.open();
    $('#glightbox-body .goverlay').css("background-color", "rgba(0, 0, 0, 0.8)");
    $('.glightbox-open').css("height", "100%");
}

/**点击热点 打开超链接热点**/
function HotspotToLink(id, target, link) {
    let _arr = target.split(':');
    if (_arr[0] == 0) {
        krpano.call('openurl("' + link + '","_blank")');
    } else if (_arr[0] == 1) {
        krpano.call('openurl("' + link + '","_self")');
    } else {
        let _width = "90vw", _height = "90vh";
        if (_arr[1] == 1) {
            let _h = $(window).height() * 0.5625;
            if (_h > $(window).width() * 0.9) {
                _h = $(window).width() * 0.9;
            }
            _width = _h + "px";
        }
        var lightboxLink = GLightbox({
            elements: [
                {
                    'href': link,
                }
            ],
            width: _width,
            height: _height,
        });
        lightboxLink.on('open', () => {
            if (isAutoRotate === true) {
                krpano.set("autorotate.enabled", false);
            }
        });
        lightboxLink.on('close', () => {
            if (isAutoRotate === true) {
                krpano.set("autorotate.enabled", true);
            }
        });
        lightboxLink.open();
    }
}


/**自动切换下一场景 赋予缩略图新的样式**/
function switchSceneThumb(id) {
    if (groupMode == 0) {
        $('.swiper-slide' + id).children('.swiper-box').addClass('active').parent().siblings().children('.swiper-box').removeClass('active');
        $('.swiper-slide' + id).children('.swiper-box').children('img').show();
        clickSceneThumbTmpHandler(id);
    } else {
        HotspotToScene(id);
    }
}

/**临时储存已经访问过的场景的id**/
function clickSceneThumbTmpHandler(t) {
    clickSceneThumbTmp.includes(t) === false ? clickSceneThumbTmp.push(t) : '';
    addScrollAnimationStyle();
}

/**增加滚动的样式**/
function addScrollAnimationStyle() {
    $("body,html").removeClass('scroll-animation');
    let _gText = $('.itemGroupListContainer .itemGroupList .active div span').text();
    let _iText = $('.itemPreviewContainer .itemPreview .swiper-wrapper .swiper-slide .active div span').text();
    if (_gText.length > 5) {
        $('.itemGroupListContainer .itemGroupList .active div span').addClass('scroll-animation');
    }
    if (_iText.length > 5) {
        $('.itemPreviewContainer .itemPreview .swiper-wrapper .swiper-slide .active div span').addClass('scroll-animation');
    }
}

/**赋予已经访问过的场景的缩略图选中状态**/
function showSceneThumbHandler() {
    $('.swiper-slide').each(function (index, element) {
        let _id = $(this).attr('data-id');
        if (clickSceneThumbTmp.includes(_id) == true) {
            $(this).children('.swiper-box').children('img').show();
        }
    });
}

/**ai光影效果加载**/
function showEffectInformation(json_string) {
    var _s = JSON.parse(json_string);
    krpano.set("plugin[pp_light].exposure", _s.exposure);
    krpano.set("plugin[pp_light].lights", _s.lights);
    krpano.set("plugin[pp_light].shadows", _s.shadows);
    krpano.set("plugin[pp_light].filterrange", _s.filterrange);
    krpano.set("plugin[pp_light].masking", _s.masking);
    krpano.set("plugin[pp_sharpen].strength", _s.strength);
    krpano.set("plugin[pp_sharpen].range", _s.range);
    krpano.set("plugin[pp_blur].range", _s.blurrange);
}

/**切换陀螺仪**/
function switchGyro(obj) {
    krpano.call('copy(plugin[skin_gyro].url, plugin[skin_gyro].plugin_url);switch(plugin[skin_gyro].enabled);');
    let _opacity = $(obj).css('opacity');
    if (_opacity == 1) {
        $(obj).css('opacity', 0.5);
    } else {
        $(obj).css('opacity', 1);
    }
}

/**全屏设置**/
function jsfullScreen() {
    var isFull = !!(document.webkitIsFullScreen || document.mozFullScreen ||
        document.msFullscreenElement || document.fullscreenElement
    );
    if (isFull == false) {
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        $('.iconRight .fullscreen img').attr('src', 'skin/img/exitfullscreen.png');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        $('.iconRight .fullscreen img').attr('src', 'skin/img/fullscreen.png');
    }
}


/**热点音频暂停**/
function hotspotAudioOnPlay(src) {
    var _src = $('#autoHotspotAudio').attr('src');
    if (_src === undefined || _src != src) {
        $('#autoHotspotAudio').attr('src', src);
        document.getElementById('autoHotspotAudio').play();
        krpano.call("pausesound('bgsnd')");
    } else {
        var _obj = document.getElementById('autoHotspotAudio');
        if (_obj.paused == false) {
            hotspotAudioOnPause();
            krpano.call("playsound('bgsnd')");
        } else {
            document.getElementById('autoHotspotAudio').play();
            krpano.call("pausesound('bgsnd')");
        }
    }
}

/**热点音频播放**/
function hotspotAudioOnPause() {
    document.getElementById('autoHotspotAudio').pause();
}

/***商品热点弹窗显示***/
function hotspotShop(id) {
    let _clas = "";
    let _area = ['570px', '210px'];
    if (isMobile()) {
        _area = ['90%', '300px'];
        _clas = "mobile-bottom";
    }
    let _shopinfo = JSON.parse(hotspotlistShop[id]);
    let _tplobj = {};
    _tplobj['list'] = [
        {
            "thumb": _shopinfo.thumb,
            "name": _shopinfo.name,
            "intro": _shopinfo.intro,
            "price": _shopinfo.price,
            "unit": _shopinfo.unit,
            "link": _shopinfo.link,
            "clas": _clas,
        },
    ];
    layer.open({
        type: 1,
        title: false,
        shadeClose: true,
        area: _area,
        content: template('edit-item-info-hotspot-shop-container-tpl', _tplobj),
    });
}

/**临时储存已经播放过的全景视频的场景id**/
function sceneVideoHotspotTmpHandler(t) {
    sceneVideoHotspotTmp.includes(t) === false ? sceneVideoHotspotTmp.push(t) : '';
}

/**切换场景是否自动播放背景音乐**/
function isSwitchSceneAutoPlaybg(t) {
    if (sceneVideoHotspotTmp.length > 0 && sceneVideoHotspotTmp.includes(t) === false) {
        krpano.call("sound[bgsnd].play()");
    }
}

/**特效 执行特效效果**/
function showSpecialInformation(id) {
    if (specialJson !== "" && specialJson !== undefined) {
        if (specialJson.hasOwnProperty(id)) {
            if (specialJson[id].hasOwnProperty("mode") && specialJson[id].mode == 2) {
                krpano.call("add_single_lensflare('lensflare_" + id + "', '" + specialJson[id].style + "', '" + specialJson[id].ath + "', '" + specialJson[id].atv + "', 'true');")
            } else {
                krpano.call("specialSnow('skin/hotspot/" + specialJson[id].icon + "','" + specialJson[id].imagescale + "','" + specialJson[id].flakes + "','" + specialJson[id].speed + "')");
            }
        }
    }
}

/**展示地图位置**/
$('.mapNav').on('click', function () {
    let _area = ['450px', '550px'];
    if (isMobile()) {
        _area = ['90%', '80%'];
    }
    layer.open({
        type: 2,
        title: '地图导航',
        shadeClose: true,
        shade: 0.8,
        area: _area,
        content: $('.mapContainer').text(),
    });
});

/**开启清屏模式**/
var isClearScreen = false;
var ClearScreenClickTimeout = null;
$('.clearScreen').on('click', function () {
    $('.iconLeftTop').css('display', 'none');
    $('.iconRight').css('display', 'none');
    $('.iconBottomLeft').css('display', 'none');
    $('.iconBottomRight').css('display', 'none');
    $('.itemPreviewContainer').css('display', 'none');
    $('.itemGroupListContainer').css('display', 'none');
    $('.exitClearScreen').css('display', 'flex');
    isClearScreen = true;
    ClearScreenClickTimeout = setTimeout(function () {
        $('.exitClearScreen').css('display', 'none');
    }, 3000);
});

/**关闭清屏模式**/
$('.exitClearScreen').on('click', function () {
    $('.iconLeftTop').css('display', 'block');
    $('.iconRight').css('display', 'flex');
    $('.iconBottomLeft').css('display', 'flex');
    $('.iconBottomRight').css('display', 'flex');
    $('.itemPreviewContainer').css('display', 'block');
    $('.itemGroupListContainer').css('display', 'block');
    $('.exitClearScreen').css('display', 'none');
    isClearScreen = false;
    clearTimeout(ClearScreenClickTimeout);
});

const divContainer = document.getElementById('itemPreviewContainer');

/**监听点击事件**/
function ClearScreenHandleClickOrTouch(event) {
    if (isClearScreen) {
        if (!divContainer.contains(event.target)) {
            $('.exitClearScreen').css('display', 'flex');
        }
        clearTimeout(ClearScreenClickTimeout);
        ClearScreenClickTimeout = setTimeout(function () {
            $('.exitClearScreen').css('display', 'none');
        }, 3000);
    }
}

document.addEventListener('click', ClearScreenHandleClickOrTouch);
document.addEventListener('touchstart', ClearScreenHandleClickOrTouch);
document.addEventListener('DOMContentLoaded', function () {
    $('.music').click();
}, false);
document.addEventListener('WeixinJSBridgeReady', function () {
    $('.music').click();
}, false);

/**视频热点**/
function videohotspotplay(id) {
    let _muted = krpano.get("hotspot[spot" + id + "].muted");
    if (!_muted) {
        krpano.call("sound[bgsnd].pause()");
        hotspotAudioOnPause();
        soundOnPause();
        sceneVideoHotspotTmpHandler(id);
    }
}

/***视频暂停***/
function videohotspotpaused(id) {
    krpano.call("sound[bgsnd].play()");
}

/**开场场景**/
function startsceneonload(gid, id) {
    $('.itemSwiper .swiper-wrapper .swiper-slide').children('.swiper-box').removeClass('active').children('img').hide();
    if (groupMode == 0) {
        loadingItemSceneListHtml(visitItemSceneList[0]);
    } else {
        loadingItemSceneListHtml(visitItemSceneList[gid]);
        $('.itemGroupListContainer .itemGroupList .groupName' + gid).addClass('active').siblings('div').removeClass('active');
    }
    swiper.slideTo($('.itemSwiper .swiper-wrapper .swiper-slide' + id).first().index(), 1000, false);
    $('.itemSwiper .swiper-wrapper .swiper-slide' + id).children('.swiper-box').addClass('active').children('img').show();
    if (sceneListShow == 2) {
        setTimeout(function () {
            $('.itemPreview').css({'z-index': 50});
            $('.itemGroupList').css({'z-index': 50});
            isSwiperLoading = true;
            addScrollAnimationStyle();
        }, 1500);
    }
}