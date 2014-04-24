
// Opt in to strict mode of JavaScript, [ref](http://is.gd/3Bg9QR)
// Use this statement, you can stay away from several frequent mistakes
"use strict";


var lang = require('lang');
var Class = require('class');
var $ = require('jquery');




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
    // overlay.css('height', WIN.height());
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

var Mbox = Class({
    Implements: 'attrs events',
    initialize: function (options) {
        var self = this, o, elem,
            win, close, cont;

        this.set(options||{});
        var content = this.get("content");
        var closable = this.get("closable");
        lang.bind('position', self);

        win = $('<div />').addClass(self.get("winCls")).css(self.get("css"));


        close = $('<div />', { "class": self.get("closeCls") });
        cont = $('<div />', { "class": self.get("contCls") });

        if(lang.isString(content)){
            elem = $(content);
        }else if(content.constructor === $){
            elem = content;
        }else{
            throw "option.content must be a string or an instance of DP.DOM";
        }

        elem.appendTo(cont);


        closable && close.appendTo(win).on('click', function () {
            self.emit('closeBtnClick');
            return false;
        });
        cont.appendTo(win);


        cont.find(".close").on("click", function () {
            self.emit('closeBtnClick');
            return false;
        });

        self.on('closeBtnClick', function () {
            self.close();
        });


        self.set('closeBtn', close);
        self.set('win', win);
        self.set('cont', cont);
    },
    position: function () {
        var self = this,
            needRepose = self.get('needRepose'),
            win = self.get('win'),
            h = parseInt(win.css('height')),
            w = parseInt(win.css('width')),
            W = WIN.width(),
            H = WIN.height(),
            css = self.get("css");


        if (needRepose) {
            win.css({
                "top": (css.top || (H - h) / 2) + (IE6 ? $(document).scrollTop() : 0),
                "left": css.left || (W - w) / 2
            });
        }
        return this;
    },
    open: function () {
        var self = this,
            win = self.get('win'),
            coverCss = self.get("coverCss"),
            needRepose = self.get("needRepose");

        self.emit('open');
        if (!shown_instances.length) {
            if (!overlayExist) {
                overlay.appendTo(B);
            }

            overlay.css(lang.mix({
                "visibility": "visible",
                "z-index": 2150,
                "height": "100%"
            }, coverCss));

            if (IE6) {
                reposeOverlay();
                WIN.on('scroll', reposeOverlay);
            }
            WIN.on('resize', resizeOverlay);
        }

        if (needRepose) {
            self.position();
            WIN.on('resize', self.position);
        }

        if (!self.exist) {
            win.appendTo(B);
            self.exist = true;
        } else {
            win.css('visibility', 'visible');
        }

        self.emit('show');
        var title = win.find('.dialog-title');

        initPosition(self, needRepose);
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
            win.remove();
            if (len === 1) {
                overlay.css('visibility', 'hidden');
            }
            self.exist = false;
            IE6 && WIN.off('scroll', reposeOverlay);
            WIN.off('resize', self.position);
            self.emit('close');

            index = shown_instances.indexOf(self);

            if (index !== -1) {
                shown_instances.splice(index, 2);
            }
        }

        if (!shown_instances.length) {
            WIN.off('resize', resizeOverlay);
            overlay.remove();
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
},{
    cont: {},
    win: {},
    closeBtn: {},
    content:{
        value:""
    },
    winCls: {
        value:'pop-box'
    },
    contCls: {
        value:'pop-main'
    },
    css: {
        value: { width: 'auto', height: 'auto', zIndex: 2300 }
    },
    closable: {
        value: true
    },
    needRepose: {
        value: true
    }
});

Mbox.closefind = function () {
    while(shown_instances.length){
        shown_instances[0].close();
    }
};



// How to use a foreign module ?
// 'cortex-hello' for example:
//
// 1. instfind dependency, exec the command below at the root of the current repo:
//      ctx instfind cortex-hello --save
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