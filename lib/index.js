
// Opt in to strict mode of JavaScript, [ref](http://is.gd/3Bg9QR)
// Use this statement, you can stay away from several frequent mistakes 
'use strict';


var lang = require('lang');
var Class = require('class');
var $ = require('jquery');

var default_options = {
    winCls: 'pop-box',
    closeCls: 'close',
    contCls: 'pop-main',
    closable: true,
    css: { width: 'auto', height: 'auto', zIndex: 2300 },
    coverCss: {},
    needRepose: true
};


var IE6 = /msie 6/i.test(navigator.userAgent), // $.browser.msie && $.browser.version == 6,
    B = $('body'),
    WIN = $(window),
    OVERLAYCLASS = 'mbox_overlay';

var shown_instances = [];
var overlayExist = false;

var overlay = $('<div />').attr({ "id": OVERLAYCLASS, "class": OVERLAYCLASS });



overlay.css({
    "top": 0,
    "left": 0,
    "width": "100%",
    "background-color": "#000",
    "z-index": 99,
    "zoom": 1,
    "opacity": 0.2,
    "position": IE6 ? "absolute" : "fixed"
});



function reposeOverlay() {
    overlay.css('top', B.scrollTop());
}

function resizeOverlay() {
    overlay.css('height', WIN.height());
}


function createBtn(ele) {
    var ret = $("<span />").addClass(ele.active ? "medi-btn" : "medi-btn-ash");

    var a = $("<a />", { "href": "#", "class": "btn-txt", "title": ele.text }).html(ele.text).inject(ret);
    a.on("click", function () {
        ele.action && ele.action();
        return false;
    })
    return ret;
}

function createDialog(title, cont, btns, wrap) {
    var ret = wrap || $('<div />');
    var hd = $('<div />', { "class": "hd" }).inject(ret);
    var dtitle = title && $('<h3 />').html(title).inject(hd);
    var close = $('<a />', { "title": "关闭", "class": "close", "href": "#" });
    var dcont = cont && $('<div />', { "class": 'con' }).html(cont).inject(ret);
    var dbtns = btns && $('<div />', { "class": "btn-box" }).inject(dcont);

    close.inject(hd);

    btns && btns.forEach(function (e) {
        createBtn(e).inject(dbtns);
    });

    return ret.children();
}


function prompt(title, html, cb) {
    Mbox.closeall();
    var content = '<div class="pop-info"><p class="confirm">' + html + '</p></div>';
    var mbox = new Mbox({
        css: { width: 260 },
        content: Mbox.dialog(title, content, [
        { text: "确定", action: cb, active: true },
        { text: "取消", action: function () { mbox.close(); }, active: false }
    ])
    }).open();
}

function initPosition(mbox, needRepose) {

    var position = IE6 ? 'absolute' : (needRepose ? 'fixed' : 'absolute'),
        win = mbox.get('win');

    win.css('position', position);
    mbox.position();

    if (IE6 && needRepose) {
        WIN.on('scroll', mbox.position);
    }
}

var Mbox = new Class({
    Implements: 'attrs events',
    initialize: function (options) {
        var self = this, o, elem,
            win, close, cont;
        self.set("opt",options);
        o = self.get('opt');

        lang.bind('position', self);

        win = $('<div />', { "class": o.winCls }).css(o.css);


        close = $('<div />', { "class": o.closeCls });
        cont = $('<div />', { "class": o.contCls });

        if(lang.isString(o.content)){
            elem = $(o.content)
        }else if(o.content.constructor == $){
            elem = o.content
        }else{
            throw "option.content must be a string or an instance of DP.DOM"
        }

        elem.inject(cont);


        o.closable && close.inject(win).on('click', function (e) {
            self.fire('closeBtnClick');
            return false;
        });
        cont.inject(win);


        cont.all(".close").on("click", function (e) {
            self.fire('closeBtnClick');
            return false;
        });

        self.on('closeBtnClick', function () {
            self.close();
        });


        self.set('closeBtn', close);

        self.set('needRepose', o.needRepose);
        self.set('win', win);
        self.set('cont', cont);
    },
    position: function () {
        var self = this,
            o = self.get('opt'),
            needRepose = self.get('needRepose'),
            win = self.get('win'),
            h = win.css('height'),
            w = win.css('width'),
            W = WIN.width(),
            H = WIN.height();


        if (needRepose) {
            win.css({
                "top": (o.css.top || (H - h) / 2) + (IE6 ? $(document).scrollTop() : 0),
                "left": o.css.left || (W - w) / 2
            });
        }
        return this;
    },
    open: function () {
        var self = this,
            win = self.get('win'),
            o = self.get('opt');

        self.fire('open');
        if (!shown_instances.length) {
            if (!overlayExist) {
                overlay.inject(B);
            }

            overlay.css(lang.mix({
                "visibility": "visible",
                "z-index": 2150,
                "height": WIN.height()
            }, o.coverCss));

            if (IE6) {
                reposeOverlay();
                WIN.on('scroll', reposeOverlay);
            }
            WIN.on('resize', resizeOverlay);
        }

        if (o.needRepose) {
            self.position();
            WIN.on('resize', self.position);
        }

        if (!self.exist) {
            win.inject(B);
            self.exist = true;
        } else {
            win.css('visibility', 'visible');
        }

        self.fire('show');
        var title = win.all('.dialog-title');

        initPosition(self, o.needRepose);
        if (shown_instances.indexOf(this) === -1) {
            shown_instances.push(this);
        }
        return this;
    },
    close: function () {
        var self = this,
            len = shown_instances.length,
            win = self.get('win'),
            index;
        if (len) {
            win.dispose();
            if (len == 1) {
                overlay.css('visibility', 'hidden');
            }
            self.exist = false;
            IE6 && WIN.off('scroll', reposeOverlay);
            WIN.off('resize', self.position);
            self.fire('close');

            index = shown_instances.indexOf(self);

            if (index != -1) {
                shown_instances.splice(index, 1);
            }
        }

        if (!shown_instances.length) {
            WIN.off('resize', resizeOverlay);
            overlay.dispose();
        }
        return this;

    },
    hide: function () {
        this.get('win').css('display', 'none');
        overlay.css('visibility', 'hidden');
        return this;
    },
    show: function () {
        this.get('win').css('display', '');
        overlay.css('visibility', 'visible');
        return this;
    }
});

Mbox.closeall = function () {
    while(shown_instances.length){
        shown_instances[0].close();    
    }
}



// How to use a foreign module ?
// 'cortex-hello' for example:
//
// 1. install dependency, exec the command below at the root of the current repo:
//      ctx install cortex-hello --save
// 2. use `require(module_idendifier)` method:
//      var hello = require('cortex-hello');

// `exports` is the API of the current module
module.exports = function(options) {
    return new Mbox(options);
};

// or you could code like this:
//      module.exports = {
//          my_method: function() {
//              hello();
//          }
//      };