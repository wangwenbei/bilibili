var loadPicRender = (function () {
    var $loadPic = $.Callbacks(),
    $containerRow = $('.container-row');
    $loadPic.add(function(){
        for(var i=0;i<$containerRow.length;i++){
            var curRow=$containerRow[i];
            var _a=utils.win('clientHeight')+utils.win('scrollTop');
            var _b=/*curRow.offsetHeight+*/utils.offset(curRow).top;
            if(_a>=_b){
                var $imgs = $(curRow).find('img');
                danzhang($imgs);
            }
        }
    });
    function danzhang(img) {
        for(var i=0; i<img.length; i++){
            var curImg = img[i];
            if(curImg.onload){
                return;
            }
            var temp=new Image;
            temp.index = i;
            temp.src=$(curImg).attr('relSrc');
            temp.onload=function(){
                img[this.index].src=this.src;
                $(img[this.index]).css('display','block');
            };
            curImg.onload=true;
        }
    }
    return {
        init:function () {
            $loadPic.fire();
        }
    }
})();
setTimeout(loadPicRender.init,0);

var bannerRender = (function () {
    var $bannerStart = $.Callbacks(),
        $bannerWrap = $('#bannerWrap'),
        $banner = $('.topic-preview'),
        $imgs = $banner.find('img'),
        $spans = $('#title').find('span'),
        $focus = $('#focus').find('li'),
        step = -1;
    $bannerStart.add(function () {
        if(step==$imgs.length-1){
            step=0;
            $banner.css('left',0);
        }
        step++;
        function animate() {
            $banner.stop().animate({'left':-step*440},500);
        }
        animate();
        var tempStep = step;
        tempStep = tempStep == $imgs.length-1 ? 0 : tempStep;
        $spans.each(function (index, item) {
            item.in = index;
             index == tempStep ? $(item).css('display','inline') : $(item).css('display','none');
        });
        $focus.each(function (index, item) {
            index == tempStep ? $(item).addClass('eat') : $(item).removeClass('eat');
        }).on('mouseover',function () {
               if(!$(this).hasClass('eat')){
                   $(this).addClass('on');
               }
        }).on('mouseout',function () {
            $(this).removeClass('on');
        });
        $focus.on('click',function () {
            step = $(this).index();
            $focus.each(function (index, item) {
                $(item).removeClass('on');
                index == step ? $(item).addClass('eat') : $(item).removeClass('eat');
            });
            animate();
        });
    });
    var $box = $('.b-r-b'),
        $uls = $('.top-list'),
        $btn = $('.no-select'),
        $prev = $('.prev'),
        $next = $('.next'),
        $step = 1;
    function toggle() {
        switch ($step){
            case 0:
                $prev.html('一周');
                $next.html('三日');
                break;
            case 1:
                $prev.html('昨日');
                $next.html('一周');
                break;
            case 2:
                $prev.html('三日');
                $next.html('昨日');
                break;
        }
        $uls.each(function (index, item) {
            index == $step ? $(item).addClass('on') : $(item).removeClass('on');
        })
    }
    return {
        init:function () {
            $bannerStart.fire();
            var timer = window.setInterval($bannerStart.fire,1500);
            $bannerWrap.on('mouseover',function () {
                clearInterval(timer);
            }).on('mouseout',function () {
                timer = window.setInterval($bannerStart.fire,1500)
            });


            $box.on('mouseenter',function () {
                $btn.css('display','block');
            }).on('mouseleave',function () {
                $btn.css('display','none');
            });

            $prev.on('click',function () {
                --$step;
                if($step<0) $step=2;
                toggle();
            });

            $next.on('click',function () {
                $step++;
                if($step>2) $step=0;
                toggle();
            });
        }
    }
})();
bannerRender.init();

var liveRender = (function () {
    var $liveRightBtn = $('#liveRightBtn').find('li'),
        $liveRightBody = $('#liveRightBody'),
        $step = 2;
    $liveRightBtn.on('click',function () {
        $step = $(this).index();
        $liveRightBtn.each(function (index, item) {
            index == $step ? $(item).addClass('on') : $(item).removeClass('on');
        });
        $liveRightBody.css('marginLeft',-$step*100+'%');
    });
    return {
        init:function () {

        }
    }
})();
liveRender.init();

function ImgLb(ele) {
    this.ele = ele;
    this.box = $(this.ele).find('.mini-preview-wrapper');
    this.ul = $(this.box).find('.mini-preview');
    this.lis = $(this.ul).find('li');
    this.step = 0;
    this.infos = $(this.box).find('.info-item');
    this.focus = $(this.box).find('.slider-bar').find('li');
    this.timer = null;
    var that = this;
    let autoMove = () => {
        this.step++;
        if(this.step == this.lis.length) this.step = 0;
        $(this.ul).css('marginLeft',-this.step*100+'%');
        $(this.focus).each((index, item) => {
            index == this.step ? $(item).addClass('on') : $(item).removeClass('on');
        });
        $(this.infos).each((index, item) => {
            index == this.step ? $(item).addClass('on') : $(item).removeClass('on');
        });
    };
    this.ele.timer = setInterval(autoMove,1500);
    $(this.box).on('mouseenter', ()=> {
        clearInterval(this.ele.timer)
    }).on('mouseleave',()=> {
        this.ele.timer = setInterval(autoMove,1500);
    });
    $(this.focus).on('mouseenter',function () {
        that.step = $(this).index()-1;
        autoMove();
    });

}
new ImgLb($('#live'));
new ImgLb($('.b-section-bangumi'));

function allRightBody(ele) {
    let $box = $(ele).find('.r-list-wrapper'),
        $lis = $(ele).find('.b-r').find('.b-head').find('.b-slt-tab').find('li'),
        $date = $(ele).find('.b-slt'),
        $list = $date.find('.list').find('li'),
        $txt = $date.find('.txt'),
        step = 0;
    $lis.on('mouseenter',function () {
       step = $(this).index();
        $lis.each( (index, item) => {
            item === this ? $(item).addClass('on') : $(item).removeClass('on');
        });
        $box.stop().animate({'marginLeft':-step*150+'%'},400)
    });
    $date.on('mouseenter',function () {
        $(this).addClass('on');
    }).on('mouseleave',function () {
        $(this).removeClass('on')
    });
    $list.on('click',function () {
        $txt.html($(this).html());
       $list.each(function (index, item) {
           $(item).hasClass('b-state-selecte') ? $(item).removeClass('b-state-selecte') : $(item).addClass('b-state-selecte');
       });
        $date.removeClass('on');
    });
}

let $all = $('.animation,.fanju,#music,.dance,#game,.b_technology,.life,.movie,.dianshiju');
$all.each(function (index, item) {
    allRightBody(item);
});

var xinfanRender = (function () {
    let $lis = $('.b-section-bangumi').find('.bgm-calendar').find('ul').find('li');
    $lis.on('click',function () {
        console.log(this)
       $lis.each( (index, item) => {
           item == this ? $(item).addClass('on') : $(item).removeClass('on');
       })
    });
})();

window.onscroll = indexNavTop;
function indexNavTop() {
    loadPicRender.init();
    let $indexNav = $('#indexNav'),
        scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
    $indexNav[0].style.top = scrollHeight > 150 ?  '49px' : '233px';
}
indexNavTop();
var indexNavRender = (function () {
    let body = $('#animation'),
        $indexNav = $('#indexNav'),
        $sortable = $indexNav.find('.sortable'),
        $navList = $indexNav.find('.nav-list'),
        $gotop = $indexNav.find('.gotop'),
        $border = $indexNav.find('.border'),
        $sort = $indexNav.find('.customize'),
        $customBg = $indexNav.find('.custom-bg');
        $sort.flag = true;
    $indexNav.css('left',body.offset().left+body.outerWidth()+10);
    $sortable.on('click',function () {
        var curTop = $(this).attr('data-top');
        $(document.body).animate({'scrollTop': curTop}, 500);
        $(this).addClass('on');
        var $other = $(this).siblings();
        $other.removeClass('on');
    })
    $gotop.on('click',function () {
        $(document.body).animate({'scrollTop':0},500);
    });
    $sort.on('click',function () {
        if($sort.flag){
            $indexNav.addClass('customizing');
            $border.css('display','block');
            for(var i=$sortable.length-1; i>=0; i--){
                var cur = $sortable[i];
                cur.l = cur.offsetLeft;
                cur.t = cur.offsetTop;
                cur.style.position = 'absolute';
                cur.style.left = cur.l + 'px';
                cur.style.top = cur.t + 'px';

                cur.onmousedown = function (e) {
                    $(this).css('zIndex',1).addClass('on');
                    $(this).siblings().css('zIndex',0).removeClass('on');
                    var pageY = e.pageY - this.offsetTop ;

                    var nowT = this.offsetTop; //当前div的top
                    var that = this;
                    $(document.body).on('mousemove',(e)=>{
                        loadPicRender.init(); //图片延迟加载
                        var $prev = $(this).prev(),
                            $next = $(this).next(),
                            $cur = $(this),
                            curDiv = $('#'+$cur.attr('data-id')),
                            prevDiv = $('#'+$prev.attr('data-id')),
                            nextDiv = $('#'+$next.attr('data-id'));
                        var prevT = $prev.length ? $prev[0].offsetTop : null;
                        var nextT = $next.length ? $next[0].offsetTop : null;

                        var tt = e.pageY - pageY ;
                        tt = tt > 288 ? 288 : tt < 0 ? 0 : tt;
                        this.style.top=tt+'px';
                        var curT = this.offsetTop;
                        if(curT > (nextT-16)){
                            $cur = $next;
                            $next = $next.next();
                            $cur.insertBefore($(this));
                            nextDiv.insertBefore(curDiv);
                            var temp = $cur.attr('data-top');
                            $cur.attr('data-top',$(this).attr('data-top'));
                            $(this).attr('data-top',temp);
                            $cur.css('top',nowT);
                            nextT = $next.length ? $next[0].offsetTop : null;
                            nextT+=32;
                            nowT+=32;
                        }else if(curT < (prevT+16)){
                            $cur = $prev;
                            $prev = $prev.prev();
                            $(this).insertBefore($cur);
                            curDiv.insertBefore(prevDiv);
                            temp = $cur.attr('data-top');
                            $cur.attr('data-top',$(this).attr('data-top'));
                            $(this).attr('data-top',temp);
                            $cur.css('top',nowT);
                            prevT = $prev.length ? $prev[0].offsetTop : null;
                            prevT-=32;
                            nowT-=32;
                        }
                        nowT = nowT > 288 ? 288 : nowT < 0 ? 0 : nowT;
                        e.preventDefault();
                    }).on('mouseup',function () {
                        $(that).css('top',nowT);
                        $(this).off();
                    });
                }
            }

        }else{
            for(var i=$sortable.length-1;i>=0;i--){
                 cur = $sortable[i];
                cur.onmousedown = null;
            }
            $indexNav.removeClass('customizing');
            $border.css('display','none');
        }
        $sort.flag = !$sort.flag;
    });
    $border.on('click',function () {
        $sort.flag = !$sort.flag;
        for(var i=$sortable.length-1;i>=0;i--){
            var cur = $sortable[i];
            cur.onmousedown = null;
        }
        $indexNav.removeClass('customizing');
        $border.css('display','none');
    });

    let $mLink = $('.n-i-mlink'),
        $msg = $mLink.find('.mlink-dl-msg'),
        $bg = $mLink.find('.n-i-mlink-bg'),
        step = 0,
        timer = null,
        timer1 = null;
    $mLink.on('mouseenter',function (e) {
         clearInterval(timer);
        clearInterval(timer1);
        timer = setInterval(function () {
            console.log(2)
            step++;
            if(step == 10) $msg.css('display','block');
            if(step == 16)  step=10;
            $bg.css('backgroundPosition',-80*step);
            e.preventDefault();

        },70)
    }).on('mouseleave',function (e) {
        clearInterval(timer);
        $msg.css('display','none');
        clearInterval(timer1);
        console.log(timer1)
        timer1 = setInterval(function () {
            if(step == 0) {
                console.log(step)
                clearInterval(timer1);
                return;
            }
            step--;
            if(step < 0) step = 0;
            $bg.css('backgroundPosition',-80*step);
        },70);
        e.preventDefault();
    })
})();

var PicMouseover = (function () {
    let $wrap = $('.cover-preview');

    $wrap.on('mouseenter',function (e) {
        var $back = $(this).find('.back'),
            $fore = $(this).find('.fore'),
            $bar = $fore.find('.bar'),
            $div = $bar.find('div'),
            step = 0;
        $wrap.on('mousemove',function (e) {
            var wrapL = $bar.offset().left,
                l = e.pageX - wrapL,
                width = l/$bar[0].offsetWidth*100;
            step = Math.floor(width/10);
            $div.css({'width':width+'%'});
            $back.css('backgroundPositionY',-step*90)
            e.preventDefault();
        })
    })
})();




