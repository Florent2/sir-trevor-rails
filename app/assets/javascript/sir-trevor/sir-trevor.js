// Sir Trevor, v0.0.1

(function ($, _){
  
  var root = this,
      SirTrevor;
   
  SirTrevor = root.SirTrevor = {}; 
   
  /* 
   Define default attributes that can be extended through an object passed to the
   initialize function of SirTrevor
  */
  
  SirTrevor.DEFAULTS = {
    
    baseCSSClass: "sir-trevor",
    blockStore: {
      data: []
    },
    defaultType: "Text",
    spinner: {
      className: 'spinner',
      lines: 9, 
      length: 8, 
      width: 3, 
      radius: 6, 
      color: '#000', 
      speed: 1.4, 
      trail: 57, 
      shadow: false,
      left: '50%',
      top: '50%'
    },
    marker: {
      baseCSSClass: "marker",
      buttonClass: "button",
      addText: "Click to add:",
      dropText: "Drop to place content"
    },
    formatBar: {
      baseCSSClass: "formatting-control"
    },
    blockLimit: 0,
    blockTypeLimits: {},
    uploadUrl: '/attachments',
    baseImageUrl: '/sir-trevor-uploads/'
  }; 
  
  SirTrevor.Blocks = {};
  SirTrevor.Formatters = {};
  SirTrevor.instances = [];
  
  var formBound = false; // Flag to tell us once we've bound our submit event
  
  /* Generic function binding utility, used by lots of our classes */
  var FunctionBind = {
    bound: [],
    _bindFunctions: function(){
      var args = [];
      args.push(this);
      args.join(this.bound);
      _.bindAll.apply(this, args);
    }
  };
  
  /*
    Given an array or object, flatten it and return only the key => true
  */
  
  function flattern(obj){
    var x = {};
    _.each(obj, function(a,b) {
      x[(_.isArray(obj)) ? a : b] = true;
    });
    return x;
  }
  /* Halt event execution */
  function halt(ev){
    ev.preventDefault();
    ev.stopPropagation();
  }
  
  function controlKeyDown(ev){
    return (ev.which == 17 || ev.which == 224);
  }
  
  function isElementNear($element, distance, event) {
    var left = $element.offset().left - distance,
        top = $element.offset().top - distance,
        right = left + $element.width() + ( 2 * distance ),
        bottom = top + $element.height() + ( 2 * distance ),
        x = event.pageX,
        y = event.pageY;
  
    return ( x > left && x < right && y > top && y < bottom );
  }
  
  /* 
    Drop Area Plugin from @maccman
    http://blog.alexmaccaw.com/svbtle-image-uploading
    --
    Tweaked so we use the parent class of dropzone
  */
  
  (function($){
    function dragEnter(e) {
      $(e.target).addClass("dragOver");
      halt(e);
      return false;
    }
  
    function dragOver(e) {
      e.originalEvent.dataTransfer.dropEffect = "copy";
      halt(e);
      return false;
    }
  
    function dragLeave(e) {
      $(e.target).removeClass("dragOver");
      halt(e);
      return false;
    }
  
    $.fn.dropArea = function(){
      this.bind("dragenter", dragEnter).
           bind("dragover",  dragOver).
           bind("dragleave", dragLeave);
      return this;
    };
  })(jQuery);
  /*
    Backbone Inheritence 
    --
    From: https://github.com/documentcloud/backbone/blob/master/backbone.js
    Backbone.js 0.9.2
    (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
  */
  
  // The self-propagating extend function that Backbone classes use.
  var extend = function(protoProps, classProps) {
    return inherits(this, protoProps, classProps);
  };
  
  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};
  
  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;
  
    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }
  
    // Inherit class (static) properties from parent.
    _.extend(child, parent);
  
    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  
    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);
  
    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);
  
    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;
  
    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;
  
    return child;
  };
  /* String to slug */
  
  function toSlug(string)
  {
      return string
          .toLowerCase()
          .replace(/[^\w ]+/g,'')
          .replace(/ +/g,'-');
  }
  /* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
   * http://benalman.com/
   * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
  var o = $({});
  $.subscribe = function() {
    o.on.apply(o, arguments);
  };
  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };
  $.publish = function() {
    o.trigger.apply(o, arguments);
  };
  //fgnass.github.com/spin.js#v1.2.5
  (function(a,b,c){function g(a,c){var d=b.createElement(a||"div"),e;for(e in c)d[e]=c[e];return d}function h(a){for(var b=1,c=arguments.length;b<c;b++)a.appendChild(arguments[b]);return a}function j(a,b,c,d){var g=["opacity",b,~~(a*100),c,d].join("-"),h=.01+c/d*100,j=Math.max(1-(1-a)/b*(100-h),a),k=f.substring(0,f.indexOf("Animation")).toLowerCase(),l=k&&"-"+k+"-"||"";return e[g]||(i.insertRule("@"+l+"keyframes "+g+"{"+"0%{opacity:"+j+"}"+h+"%{opacity:"+a+"}"+(h+.01)+"%{opacity:1}"+(h+b)%100+"%{opacity:"+a+"}"+"100%{opacity:"+j+"}"+"}",0),e[g]=1),g}function k(a,b){var e=a.style,f,g;if(e[b]!==c)return b;b=b.charAt(0).toUpperCase()+b.slice(1);for(g=0;g<d.length;g++){f=d[g]+b;if(e[f]!==c)return f}}function l(a,b){for(var c in b)a.style[k(a,c)||c]=b[c];return a}function m(a){for(var b=1;b<arguments.length;b++){var d=arguments[b];for(var e in d)a[e]===c&&(a[e]=d[e])}return a}function n(a){var b={x:a.offsetLeft,y:a.offsetTop};while(a=a.offsetParent)b.x+=a.offsetLeft,b.y+=a.offsetTop;return b}var d=["webkit","Moz","ms","O"],e={},f,i=function(){var a=g("style");return h(b.getElementsByTagName("head")[0],a),a.sheet||a.styleSheet}(),o={lines:12,length:7,width:5,radius:10,rotate:0,color:"#000",speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto"},p=function q(a){if(!this.spin)return new q(a);this.opts=m(a||{},q.defaults,o)};p.defaults={},m(p.prototype,{spin:function(a){this.stop();var b=this,c=b.opts,d=b.el=l(g(0,{className:c.className}),{position:"relative",zIndex:c.zIndex}),e=c.radius+c.length+c.width,h,i;a&&(a.insertBefore(d,a.firstChild||null),i=n(a),h=n(d),l(d,{left:(c.left=="auto"?i.x-h.x+(a.offsetWidth>>1):c.left+e)+"px",top:(c.top=="auto"?i.y-h.y+(a.offsetHeight>>1):c.top+e)+"px"})),d.setAttribute("aria-role","progressbar"),b.lines(d,b.opts);if(!f){var j=0,k=c.fps,m=k/c.speed,o=(1-c.opacity)/(m*c.trail/100),p=m/c.lines;!function q(){j++;for(var a=c.lines;a;a--){var e=Math.max(1-(j+a*p)%m*o,c.opacity);b.opacity(d,c.lines-a,e,c)}b.timeout=b.el&&setTimeout(q,~~(1e3/k))}()}return b},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=c),this},lines:function(a,b){function e(a,d){return l(g(),{position:"absolute",width:b.length+b.width+"px",height:b.width+"px",background:a,boxShadow:d,transformOrigin:"left",transform:"rotate("+~~(360/b.lines*c+b.rotate)+"deg) translate("+b.radius+"px"+",0)",borderRadius:(b.width>>1)+"px"})}var c=0,d;for(;c<b.lines;c++)d=l(g(),{position:"absolute",top:1+~(b.width/2)+"px",transform:b.hwaccel?"translate3d(0,0,0)":"",opacity:b.opacity,animation:f&&j(b.opacity,b.trail,c,b.lines)+" "+1/b.speed+"s linear infinite"}),b.shadow&&h(d,l(e("#000","0 0 4px #000"),{top:"2px"})),h(a,h(d,e(b.color,"0 0 1px rgba(0,0,0,.1)")));return a},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),!function(){function a(a,b){return g("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',b)}var b=l(g("group"),{behavior:"url(#default#VML)"});!k(b,"transform")&&b.adj?(i.addRule(".spin-vml","behavior:url(#default#VML)"),p.prototype.lines=function(b,c){function f(){return l(a("group",{coordsize:e+" "+e,coordorigin:-d+" "+ -d}),{width:e,height:e})}function k(b,e,g){h(i,h(l(f(),{rotation:360/c.lines*b+"deg",left:~~e}),h(l(a("roundrect",{arcsize:1}),{width:d,height:c.width,left:c.radius,top:-c.width>>1,filter:g}),a("fill",{color:c.color,opacity:c.opacity}),a("stroke",{opacity:0}))))}var d=c.length+c.width,e=2*d,g=-(c.width+c.length)*2+"px",i=l(f(),{position:"absolute",top:g,left:g}),j;if(c.shadow)for(j=1;j<=c.lines;j++)k(j,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(j=1;j<=c.lines;j++)k(j);return h(b,i)},p.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}):f=k(b,"animation")}(),a.Spinner=p})(window,document);
  if (!UTILS) {
    var UTILS = {};
  }
  
  (function(document, window){
    
    // Constructor
    var CroppingTool = function(img, config) {
      
      this.config = config || {};
      
      // Convert image to base64
      this.prepareImageFromFile(img);
      
    };
    
    CroppingTool.prototype = {
      
      init : function(img) {
        
        var config = this.config,
            preview = config.preview || document.querySelector("#preview");
  
        // Smallest width (visible canvas area)
        var editorWidth = this.editorWidth = config.editorWidth || 580;
  
        // Max width available for whole site - no image on the site will ever have to be bigger than this
        var transmitWidth = this.transmitWidth = config.maxWidth || 1000;
        
        if (img.width < transmitWidth || img.height < ~~(0.5625 * transmitWidth)) {
          $.publish("/editor/notice", ["The image is too small - it will be scaled up and will appear pixelated.", this.config.id]);
          
          var checkScale = this.scale(transmitWidth, img, false, false);
          
          img.width = checkScale.width;
          img.height = checkScale.height;
        }
        
        this.letterboxHeight = 40;
        
        // what percentage of image width is transmit width?
        var percentage = (transmitWidth / img.width) * 100;
        
        // this is the multiplyer for the crop function - the ratio of the editor width to the transmit width
        this.cropRatio = (transmitWidth / editorWidth);
  
        // Panning state
        this.isPanning = false;
  
        // this is what performs the actual crop - never added to the dom
        var cropCanvas = this.cropCanvas = this.createCanvas(this.transmitWidth, img);
        
        // this is what the user sees - scaled version of the one above
        this.canvas = this.createCanvas(this.editorWidth, img);
  
        // Largest width possible so that max zoom level does not exceed max available for the whole site (transmitWidth)
        // this is different to the transmitWidth! imagine the image is zoomed in 100%, the part of the image you see is transmitWidth, 
        // maxWidth is the maximum width allowed to acheive this
        this.maxWidth = Math.round((editorWidth * 100) / percentage);
  
        // store img on instance
        this.img = img;
  
        // baseline for origin of the image relative to top left of canvas - this will move around every time we redraw the image
        this.origin = { x : 0, y : 0 };
        
        // the scale of the image drawn on the canvas
        this.scaleImg = this.cacheScale = this.canvas.scale;
  
        var canvas = this.canvas;
  
        // amount to resize the image by when zooming in and out
        this.resizeAmt = (this.maxWidth * 5) / 100;
  
        // create a parent wrapper for the canvas
        var parent = document.createElement("div");
        parent.className = "crop-parent";
        parent.style.width = editorWidth + "px";
  
        // add the parent to the canvas object
        canvas.parent = parent;
  
        // main initialisation function
        this.start(canvas);
  
        // wrap the canvas in the parent
        parent.appendChild(canvas.canvas);
  
        // place the parent in the dom
        preview.appendChild(parent);
  
        // for debug purposes
        //preview.appendChild(this.cropCanvas.canvas);
  
        // create zoom interface buttons
        this.createUIElement(canvas, "zoomin", "+", "top");
        this.createUIElement(canvas, "zoomout", "-", "top");
  
        // create crop and reset buttons
        this.createUIElement(canvas, "crop", "crop", "bottom");
        this.createUIElement(canvas, "reset", "reset", "bottom");
        this.createUIElement(canvas, "change", "change image", "bottom");
  
        parent = null;
        canvas = null;
        preview = null;
        config = null;
        
        $.publish("/editor/cropready", this.config.id);
        
      },
      
      // Refernced by this when using aaddEventListener
      // Allows us to persist CroppingTool scope in callbacks
      handleEvent : function(e) {
        
        e.preventDefault();
        
        switch(e.type) {
          case "mousedown": this.mousedown(e); break;
          case "mousemove": this.mousemove(e); break;
          case "mouseup": case "mouseleave": case "mouseout": this.mouseup(e); break;
          case "load": break;
          case "click": 
            switch(e.target.dataset.ui) {
              case "crop":
                this.crop();
                break;
              case "change":
                this.change();
                break;
              case "reset":
                this.reset();
                break;
              default:
                this.zoom(e, this.resizeAmt); 
            }
          break;
        }
      },
      
      // Calculate scale for resizing the image
      scale : function(max, obj, limit, checkScale) {
  
        var width = obj.width, 
            height = obj.height,
            scale = Math.min(
              (max) / width,
              height
            ),
            minHeight = ~~(0.5625 * max);
        
        // limit allows us to specify whether we want the scale to be restricted to 100% of the max 
        scale = (limit && scale > 1) ? 1 : scale;
        
        width = parseInt(width * scale, 10);
        height = parseInt(height * scale, 10);
        
        // check to see if wee need to increase dimensions to acheive 16 x 9 ratio
        if (!checkScale && height < minHeight) {
          
          width = (minHeight / height) * width;
          height = minHeight;
  
        }
  
        return {
          width : Math.round(width),
          height : Math.round(height)
        };
      },
      
      createCanvas : function(width, img) {
        
        var canvas = document.createElement("canvas"),
            ratioHeight = Math.round(0.5625 * width),
            scale = this.scale(width, img, false, false),
            maskHeight = (scale.height - ratioHeight) / 2,
            letterboxHeight = this.letterboxHeight;
            
        maskHeight = (maskHeight < 0) ? 0 : maskHeight;
        
        canvas.width = width;
        canvas.height = scale.height;
        
        if (maskHeight > letterboxHeight) {
          maskHeight = letterboxHeight;
          canvas.height = ratioHeight + (letterboxHeight * 2);
        }
              
        return {
          width : width,
          height : canvas.height,
          canvas : canvas,
          ctx : canvas.getContext('2d'),
          scale : scale,
          // this is the height of an individual mask (one of the letterbox things top and bottom)
          maskHeight : maskHeight,
          // this is the distance between the top 0 x 0 point and position that we need to place the bottom mask
          maskOffset : ratioHeight + maskHeight,
          ratioHeight : ratioHeight
        };
        
      },
      
      start : function(obj) {
        
        var canvas = obj.canvas,
            origin = this.origin;
        
        obj.parent.classList.add("active");
  
        canvas.addEventListener("mousedown", this, false);
        canvas.addEventListener("mousemove", this, false);
        canvas.addEventListener("mouseup", this, false);
        canvas.addEventListener("mouseleave", this, false);
        
        window.addEventListener("mouseup", this, false);
        
        this.draw(origin);
        // reset the origin relative to the top left of the canvas
        obj.ctx.translate(origin.x, origin.y);
      },
      
      end : function(obj) {
        
        var canvas = obj.canvas;
        
        if(obj.parent) obj.parent.classList.remove("active");
        
        // disable mouse events
        canvas.removeEventListener("mousedown", this, false);
        canvas.removeEventListener("mousemove", this, false);
        canvas.removeEventListener("mouseup", this, false);
        canvas.removeEventListener("mouseleave", this, false);
        
        window.removeEventListener("mouseup", this, false);
        
      },
      
      // this is the letterbox that appears at the top and bottom of the image in the editor.
      // needs to be redrawn everytime the canvas is redrawn
      letterBox : function(ctx) {
        
        var canvas = this.canvas,
            width = canvas.width,
            maskHeight = canvas.maskHeight;
        
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, width, maskHeight);
        ctx.fillRect(0, canvas.maskOffset, width, maskHeight);
        ctx.restore();
      },
      
      position : function(e) {
        return {
          x : e.layerX,
          y : e.layerY
        };
      },
      
      createUIElement : function(canvas, name, text, pos) {
        
        // function for creating ui buttons - might make this a static method 
        var el = document.createElement("a");
        
        el.textContent = text;
        el.dataset.ui = name;
        el.className = name + " crop-ui";
        el.addEventListener("click", this, false);
        el.style[pos] = ((name === "zoomout") ? canvas.maskHeight + 30 : canvas.maskHeight + 10) + "px";
        
        canvas.parent.insertBefore(el, canvas.canvas);
      },
      
      // click, click, ZOOM!!
      zoom : function(e, amt) {
        
        amt = amt || 1;
        
        var target = e.target,
            scaleImg = this.scaleImg,
            offset = scaleImg.width,
            wheel = e.wheelDeltaY || false;
        
        // Increment or decrement depending on the button pushed or direction of the scroll wheel
        offset += (target.dataset.ui === "zoomin") ? amt : -amt; // || (wheel && wheel > 0)) ? amt : -amt;
        
        if (offset > this.maxWidth) {
          $.publish("/editor/notice", ["The image will appear pixelated if you continue to increase the size.", this.config.id]);
        } else {
          $.publish("/editor/clearnotice", [this.config.id])
        }
        
        if (offset < this.editorWidth) {
          offset = this.editorWidth;
        }
        
        // scale the image based on the offset which is current width +/- amt
        var newSize = this.scale(offset, scaleImg, false, true);
        
        if (newSize.height < Math.round(0.5625 * this.editorWidth)) {
          // scale the image based on the offset which is current width +/- amt
          newSize = this.cacheScale;
        }
        
        this.scaleImg = newSize;
        
        // offset the image by the inverse of half the difference between the old width and height and the new width and height
        // this will make it look like we're resizing from the center
        this.move = { x : ~~(((newSize.width - scaleImg.width) / 2) * -1), y : ~~(((newSize.height - scaleImg.height) / 2) * -1) };
        
        // no need to specify origin as it has already been reset
        this.draw(this.move);
        
        // check that we haven't overstepped the bounds of the crop area
        this.checkBounds();
      },
      
      mousedown : function(e) {
        
        // we are panning, start tracking the mouse position
        this.isPanning = true;
        
        // cache the start position, so we can track the mouse move relative to this point
        this.postStart = this.position(e);
      },
      
      mousemove : function(e) {
        
        
        // if we are no longer panning, stop tracking the mouse position
        if (!this.isPanning) { return; }
          
        var pos = this.position(e),
            posStart = this.postStart,
            move = this.move = { x : (pos.x - posStart.x), y : (pos.y - posStart.y) };
        
        // move the image by the difference between the cached start and current mouse position
        this.draw(move);
      },
      
      mouseup : function(e) {
        
        // if we are no longer panning, stop tracking the mouse position
        if (!this.isPanning) { return; }
        
        // we are no longer panning stop tracking the mouse position
        this.isPanning = false;
        
        // check that we haven't overstepped the bounds of the crop area
        this.checkBounds();
      },
      
      checkBounds : function() {
        
        // move = the amount the mouse cursor has moved relative to its start position
        // origin = the top left of the image relative to the top left of the canvas. We use this later to determine where to crop
        
        var move = this.move,
            origin = this.origin,
            scaleImg = this.scaleImg,
            canvas = this.canvas,
            maskHeight = canvas.maskHeight,
            correct = { x : 0, y : 0 },
            ctx = canvas.ctx;
        
        // reset the origin (top left) to the new location (top left) of the image
        origin.x += move.x;
        origin.y += move.y;
        
        // set the translate origin to the new position
        ctx.translate(move.x, move.y);
        
        // check we haven't overstepped the bounds
        
        // horzontal diff
        var hDiff = (scaleImg.width + origin.x);
        
        // too far right (snap back to LHS)
        if (hDiff >= scaleImg.width) {
          correct.x = -origin.x;
        }
        
        // too far left (snap back to RHS)
        if (hDiff <= canvas.width) {
          correct.x = canvas.width - hDiff;
        }
        
        // Vertical diff and maskOffset (take into accout the letterbox - snap back to that rather than the top and bottom of the canvas)
        var vDiff = (scaleImg.height + origin.y),
            maskOffset = canvas.maskOffset;
        
        // too far down (snap back to TOP)
        if (vDiff >= (scaleImg.height + maskHeight)) {
          correct.y = -origin.y + maskHeight;
        }
        
        // too far up (snap back to BOTTOM)
        if (vDiff <= maskOffset) {
          correct.y = maskOffset - vDiff;
        }
        
        // if we don't need to make a correction - return 
        if (correct.y === 0 && correct.x === 0) { return; }
        
        // otherwise, draw the image in the new position
        this.draw(correct);
        
        // set the translate origin to the new position
        ctx.translate(correct.x, correct.y);
        
        // add the correction to the origin, so that we can keep track of the position relative to the top left of the canvas
        origin.x += correct.x;
        origin.y += correct.y;
        
      },
      
      draw : function(pos) {
        
        pos = pos || {};
        
        var scaleImg = this.scaleImg,
            canvas = this.canvas,
            ctx = canvas.ctx;
        
        // clear the canvas (otherwise we get psychadelic trails)
        this.fillBackground(ctx, canvas.width, canvas.height);
        
        // draw the image
        ctx.drawImage(this.img, pos.x || 0, pos.y || 0, scaleImg.width, scaleImg.height);
        this.letterBox(ctx);
        
      },
      
      destroy : function() {
        
        var canvas = this.canvas,
            el = canvas.parent;
        
        if (el) {
          el.parentNode.removeChild(el);
          el = null;
        }
        
        this.end(canvas);
        
        this.canvas = null;
        this.cropCanvas = null;
      },
  
      change : function() {
        this.destroy();
        $.publish("/editor/change", [this.config.id] );
      },
      
      reset : function() {
        
        var canvas = this.canvas;
        
        // reset the origin and dimensions of the image
        this.origin = { x : 0, y : 0 };
        this.scaleImg = this.cacheScale;
        
        // reinstate the canvas height with the letterboxing (un 16 x 9 it)
        canvas.canvas.height = canvas.height;
        // turn on the event listeners for the canvas
        this.start(canvas);
      },
      
      fillBackground : function(ctx, width, height) {
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      },
      
      crop : function() {
        
        var canvas = this.canvas,
            maskHeight = canvas.maskHeight,
            scaleImg = this.scaleImg,
            ctx = canvas.ctx,
            origin = this.origin;
  
        // resize canvas first to remove mask and make the image 16 x 9
        canvas.canvas.height -= (maskHeight * 2);
  
        // draw the image relative to the tracked origin (minus the maskheight for the y axis)
        ctx.drawImage(this.img, origin.x, origin.y - maskHeight, scaleImg.width, scaleImg.height);
  
        // transmit crop
        var cropCanvas = this.cropCanvas,
            cropCtx = cropCanvas.ctx;
  
        // reset canvas height to 16 * 9 height
        cropCanvas.canvas.height = cropCanvas.ratioHeight;
  
        this.fillBackground(cropCtx, cropCanvas.canvas.width, cropCanvas.canvas.height);
        
        var imageHeight = Math.round(scaleImg.height * this.cropRatio),
            imageWidth = Math.round(scaleImg.width * this.cropRatio);
        
        // Assume the scale is already correct but if we have made the image slightly too 
        // small (due to some rounding error) resize it so that it is large enough to fill 
        // the whole canvas
        
        imageHeight = (imageHeight < cropCanvas.ratioHeight) ? cropCanvas.ratioHeight : imageHeight;
        imageWidth  = (imageWidth < cropCanvas.ratioWidth) ? cropCanvas.width : imageWidth;
        
        // draw the image
        cropCtx.drawImage(this.img, (origin.x * this.cropRatio), ((origin.y - cropCanvas.maskHeight) * this.cropRatio), imageWidth, imageHeight);
              
        // turn off the event listeners for the canvas
        this.end(canvas);
        
        $.publish("/editor/crop", [cropCanvas.canvas.toDataURL("image/jpeg"), this.config.id] );
        
      },
      
      prepareImageFromFile : function() { return false; }
      
    };
    
    
    var urlAPI = (typeof URL !== "undefined") ? URL : (typeof webkitURL !== "undefined") ? webkitURL : null;
  
    // init time branch to decide whether to use createObjectURL or fileReader to get data from dropped file 
    
    if (urlAPI && typeof urlAPI.createObjectURL === "function") {
      
      
      CroppingTool.prototype.prepareImageFromFile = function(f) {
        
        var that = this,
            baseimg = document.createElement('img');
            
        baseimg.src = urlAPI.createObjectURL(f);
        baseimg.onload = function() {
          urlAPI.revokeObjectURL(this.src);
          that.init(this);
        };
  
      };
      
  
    } else if (typeof FileReader !== "undefined" && typeof FileReader.prototype.readAsDataURL === "function") {
      
      CroppingTool.prototype.handleImage = function(f) {
        
        var that = this,
            fileReader = new FileReader();
        
        fileReader.readAsDataURL(f);
  
        fileReader.onload = function (e) {
          var baseimg = document.createElement('img');
          baseimg.src = e.target.result;
          baseimg.onload = imageFromFileCallback;
        };
  
        function imageFromFileCallback() {
          that.init(this);
        }
        
      };
      
    } else {
      throw "Browser does not support createObjectUrl or fileReader - cannot continue";
    }
    
    UTILS.CroppingTool = CroppingTool;
    
  })(document, window);
  /* Extends simple file upload files with the Crop tool */
  
  (function($){
  
    var methods = {
  
      init : function(options) {
  
        return this.each(function(){
  
        /* Extend file upload fields */
          
          if($(this).parents('.image_block').length==0) $(this).wrap($('<div>', { "class": "image_block" }));
          if($(this).parents('.dropzone').length==0) $(this).wrap($('<div>',{ "class": "dropzone", dropzone: "move copy" }));
          if($(this).parents('.dropzone').siblings('.image_editor').length==0) $(this).parents('.dropzone').before($('<div>', { "class": "image_editor" } ));
  
          $(this).data('image_editor', {
            block : $(this).parents('.image_block'),
            dropzone : $(this).parents('.dropzone'),
            editor : $(this).parents('.dropzone').siblings('.image_editor')
          }); 
  
          dom = $(this).data('image_editor');
  
          dom.editor.prepend('<span class="image_preview"></span>');
          dom.dropzone.append('<button>...or choose file</button>');
          dom.dropzone.prepend(dom.dropzone.siblings('label'));
  
          dom.preview = dom.editor.find('.image_preview');
  
        /* If editing (input has JSON on the DOM),
        show with option to change image */
  
          if(!$.isEmptyObject($(this).data('json'))) {
  
            dom.dropzone.hide();
            dom.editor.show();
  
            dom.preview.append($('<img>',{src: $(this).data('json')["post"]["url"] }));
            dom.preview.append('<a class="change non_canvas crop-ui">change image</a>');
  
            dom.preview.find('.change').on('click',function(ev){
  
              input = $(this).parents('.image_block').find('input[type="file"]');
              dom = $(input).data('image_editor');
  
              dom.dropzone.show();
              dom.editor.hide();
  
            });
  
          } else {
            dom.editor.hide();
          }
  
        /* Attach events */
          
          $(this).bind('click',function(ev){ ev.stopPropagation(); });
          dom.dropzone.find('button').bind('click',function(ev){ ev.preventDefault(); })
  
          $(this).on('change',function(ev){
            if(ev.currentTarget.files[0].type.match(/image.*/)) {
              $(this).image_editor('load_editor',ev.currentTarget.files[0]);
            }
          });
  
          dom.block.not('.sedit_block').on('drop', function(ev){
  
            // Sedit binds it's dragging to the window
            if(typeof(editor)!=='undefined') editor.hide_marker();
  
            $('.image_block').removeClass('dragover');
            input = $(this).find('input[type="file"]');
  
            ev.preventDefault(); ev.stopPropagation();
            ev = ev.originalEvent.dataTransfer;
  
            if($.inArray("Files",ev.types) != -1) {
  
              if(ev.files[0].type.match(/image.*/)) {
                $(input).image_editor('load_editor',ev.files[0]);
              } else {
                $(input).preview_error("Image format not recognised.");
              }
  
            }
  
          });
          
          // Complex solutions to the lack of dragexit
          dom.dropzone.parents('.image_block').not('.sedit_block').bind('dragover',function(ev){
  
            target = $(ev.target)
            if(!target.hasClass('.image_block')) target = $(target.parents('.image_block')[0]);
            if(target.length>0) target.addClass('dragover');
      
            ev.preventDefault();
            
          }.bind(this)).bind('dragleave',function(ev){
            $('.image_block').removeClass('dragover');
          });
  
        /* Callbacks from crop tool events */
          
          $.unsubscribe("/editor/crop");
          $.subscribe("/editor/crop", function(e, file, input) {
  
            $(input).image_editor('clear_errors');
  
            $(input).parents('form').find('[type="submit"]').each(function(i,e){
              if(!$(e).is(':disabled')) {
                $(e).attr('disabled','disabled').data('label',$(e).val()).val('Please wait...');
              }
            });
            
            $.ajax({
              type: 'POST',
              url: '/images',
              data: { image: file },
              dataType: 'json',
              context: $(input),
              success: function(data, textStatus, jqXHR) {
  
                if(data.file!==undefined && $.isArray(data.file)) {
                  $(this).image_editor('show_error', 'Image could not be saved: '+data.file[0]);
                } else if(data.file!==undefined && data.id !== undefined) {
                  data.file.id = data.id;
                  $(this).data('json', data.file); 
                }
  
              },
              error: function() {
  
                $(this).image_editor('show_error', 'Image could not be saved.');
  
              },
              complete: function() {
  
                $(this).parents('form').find('[type="submit"]').each(function(i,e){
                  if($(e).is(':disabled')) {
                    $(e).removeAttr('disabled').val($(e).data('label'));
                  }
                });
  
              }
            });
         
          });
  
          $.unsubscribe("/editor/cropready");
          $.subscribe("/editor/cropready", function(e,input) {
  
            dom = $(input).data('image_editor');
            dom.dropzone.hide();
            dom.editor.show();
  
          });
  
          $.unsubscribe("/editor/change");
          $.subscribe("/editor/change", function(e,input) {
  
            dom = $(input).data('image_editor');
  
            $(input).image_editor('clear_errors');
            dom.dropzone.show();
            dom.editor.hide();
  
          });
          
          $.unsubscribe("/editor/notice");
          $.subscribe("/editor/notice", function(e,error,input) {
            $(input).image_editor('show_error',error);
          });
  
          $.unsubscribe("/editor/clearnotice");
          $.subscribe("/editor/clearnotice", function(e,input) {
            $(input).image_editor('clear_errors');
          });
  
        });
  
      },
  
      load_editor : function(file) {
        return this.each(function(){
  
          dom = $(this).data('image_editor');
          $(this).image_editor('clear_errors');
          dom.preview.html('');
  
          new UTILS.CroppingTool(file, { preview : dom.preview[0], editorWidth : dom.preview.width(), maxWidth : 1000, id: $(this) });
  
        });
      },
  
      show_error : function(error) {
        return this.each(function(){
  
          dom = $(this).data('image_editor');
  
          dom.block.addClass('field_with_errors');
          dom.block.find('.error').remove();
          dom.block.prepend('<p class="error">'+error+'</p>');
  
        });
      },
  
      clear_errors : function() {
        return this.each(function(){
          
          dom = $(this).data('image_editor');
  
          dom.block.removeClass('field_with_errors');
          dom.block.find('.sedit_block_editor').removeClass('field_with_errors')
          dom.block.find('.error').remove();
  
        });
      }
  
    };
  
    $.fn.image_editor = function(method) {
  
      if (methods[method]) {
        return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
      } else if ( typeof method === 'object' || ! method ) {
        return methods.init.apply( this, arguments );
      } else {
        $.error('Method ' +  method + ' does not exist on jQuery.image_preview');
      }  
  
    }
     
  })(jQuery);
  
  /*
    Underscore helpers
  */
  
  var url_regex = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
  
  _.mixin({
    isURI : function(string) {
      return (url_regex.test(string));
    },
    
    capitalize : function(string) {
      return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }
  });
  
  
  var Block = SirTrevor.Block = function(instance, data) {
  
    this.instance = instance;
    this.type = this._getBlockType();
    this.data = data;
    
    this.blockID = _.uniqueId(this.className + '-');
    
    this._setBaseElements();
    this._bindFunctions();
    
    this.render();
    
    this.initialize.apply(this, arguments);
  };
  
  var blockOptions = [
    "className", 
    "toolbarEnabled", 
    "dropEnabled", 
    "title", 
    "limit", 
    "editorHTML", 
    "dropzoneHTML", 
    "validate", 
    "loadData", 
    "toData",
    "onDrop",
    "onContentPasted",
    "onBlockRender",
    "beforeBlockRender",
    "toMarkdown",
    "toHTML"
  ];
  
  _.extend(Block.prototype, FunctionBind, {
    
    bound: ["_handleDrop", "_handleContentPaste", "onBlockFocus", "onDrop", "onDragStart", "onDragEnd"],
    
    $: function(selector) {
      return this.$el.find(selector);
    },
    
    $$: function(selector) {
      return this.$editor.find(selector);
    },
    
    /* Defaults to be overriden if required */
    className: '',
    title: '',
    limit: 0,
    editorHTML: '<div></div>',
    dropzoneHTML: '<div class="dropzone"><p>Drop content here</p></div>',
    toolbarEnabled: true,
    dropEnabled: false,
    
    initialize: function() {},
    
    loadData: function(data) {},
    onBlockRender: function(){},
    beforeBlockRender: function(){},
    toMarkdown: function(markdown){ return markdown; },
    toHTML: function(html){ return html; },
    
    render: function() {
      
      this.beforeBlockRender();
          
      // Insert before the marker
      this.instance.formatBar.hide();
      this.instance.marker.hide();
      this.instance.marker.$el.before(this.$el);
      
      // Do we have a dropzone? 
      if (this.dropEnabled) {
        this._initDragDrop();
      }
      
      // Has data already?
      if (!_.isUndefined(this.data) && !_.isEmpty(this.data)) {
        this._loadData();
      }
      
      // And save the state
      this.save();
      
      // Add UI elements
      this.$el.append($('<span>',{ 'class': 'handle', draggable: true }));
      this.$el.append($('<span>',{ 'class': 'delete block-delete' }));
      
      // Stop events propagating through to the container
      this.$el
        .bind('drop', halt)
        .bind('mouseover', halt)
        .bind('mouseout', halt)
        .bind('mouseover', function(ev){ $(this).siblings().removeClass('active'); $(this).addClass('active'); })
        .bind('mouseout', function(ev){ $(this).removeClass('active'); });
  
      // Handle pastes
      this._initPaste();
      
      // Delete
      this.$('.delete.block-delete').bind('click', this.onDeleteClick);
      
      // Handle text blocks
      if (this.$$('.text-block').length > 0) {
        document.execCommand("styleWithCSS", false, false);
        document.execCommand("insertBrOnReturn", false, true);
        
        // Bind our text block to show the format bar
        this.$$('.text-block').focus(this.onBlockFocus);
        
        // Strip out all the HTML on paste
        this.$$('.text-block').bind('paste', this._handleContentPaste);
        
        // Formatting
        this._initFormatting();
      }
      
      // Focus if we're adding an empty block
      if (_.isEmpty(this.data)) {
        var inputs = this.$$('[contenteditable="true"], input');
        if (inputs.length > 0 && !this.dropEnabled) {
          inputs[0].focus();
        }
      }
      
      // Reorderable
      this._initReordering();
      
      // Set ready state
      this.$el.addClass('sir-trevor-item-ready');
      
      this.onBlockRender();
    },
    
    remove: function() {
      this.$block.remove();
    },
  
    /* Save the state of this block onto the blocks data attr */
    save: function() {
      var data = this.getData();
      
      if (_.isUndefined(data)) {
        // Create our data object on the element
        this.$el.data('block', this.to_json());
      } else {
        // We need to grab the state and save it here.
        this.toData();
      }
      return this.getData();
    },
    
    getData: function() {
      return this.$el.data('block');
    },
    
    setData: function(data) {
      var dataObj = this.getData();
      dataObj.data = data;
      // Update our static reference too
      this.data = data;
    },
    
    to_json: function(data) {
      return {
        type: this.type.toLowerCase(),
        data: this.data
      };
    },
    
    loading: function() {
      
      if(!_.isUndefined(this.spinner)) {
        this.ready();
      }
      
      this.spinner = new Spinner(this.instance.options.spinner);
      this.spinner.spin(this.$el[0]);
      
      this.$el.addClass('loading');
    },
    
    ready: function() {
      this.$el.removeClass('loading');
      if (!_.isUndefined(this.spinner)) {
        this.spinner.stop();
        delete this.spinner;
      }
    },
    
    /* Generic implementations */
    
    validate: function() {
      var fields = this.$$('.required'),
          errors = 0;
          
      _.each(fields, _.bind(function(field) {
        field = $(field);
        var content = (field.attr('contenteditable')) ? field.text() : field.val();
          
        if (content.length === 0) {
          // Error!
          field.addClass('error').before($("<div>", {
            'class': 'error-marker',
            'html': '!'
          }));
          errors++;
        } 
      }, this));
      
      return (errors === 0);
    },
    
    /*
      Generic toData implementation.
      Can be overwritten, although hopefully this will cover most situations
    */
    toData: function() {
      var bl = this.$el,
          dataObj = {};
      
      /* Simple to start. Add conditions later */
      if (this.$$('.text-block').length > 0) {
        var content = this.$$('.text-block').html();
        if (content.length > 0) {
          dataObj.text = this.instance._toMarkdown(content, this.type);
        }
      }
      
      var hasTextAndData = (!_.isUndefined(dataObj.text) || this.$$('.text-block').length === 0);
      
      // Add any inputs to the data attr
      if(this.$$('input[type="text"]').not('.paste-block').length > 0) {
        this.$$('input[type="text"]').each(function(index,input){
          input = $(input);
          if (input.val().length > 0 && hasTextAndData) {
            dataObj[input.attr('name')] = input.val();
          }
        });
      }
      
      this.$$('select').each(function(index,input){
        input = $(input);
        if(input.val().length > 0 && hasTextAndData) {
          dataObj[input.attr('name')] = input.val();
        }
      });
      
      this.$$('input[type="file"]').each(function(index,input) {
        input = $(input);
        dataObj.file = input.data('json');
      });
      
      // Set
      this.setData(dataObj);
    },
    
    /*
    * Event handlers
    */
    
    onDrop: function(dataTransferObj) {},
  
    onDragStart: function(ev){
      var item = $(ev.target);
      ev.originalEvent.dataTransfer.setData('Text', item.parent().attr('id'));
      ev.originalEvent.dataTransfer.setDragImage(item.parent()[0], 13, 25);
      item.parent().addClass('dragging');
      this.instance.formatBar.hide();
    },
    
    onDragEnd: function(ev){
      var item = $(ev.target);
      item.parent().removeClass('dragging');
      this.instance.marker.hide();
    },
    
    onBlockFocus: function(ev) {
      this.instance.formatBar.show(this.$el);
    },
    
    onDeleteClick: function(ev) {
      if (confirm('Are you sure you wish to delete this content?')) {
        this.instance.removeBlock(this);
        halt(ev);
      }
    },
    
    onContentPasted: function(ev){
      var textBlock = this.$$('.text-block');
      if (textBlock.length > 0) {
        textBlock.html(this.instance._toHTML(this.instance._toMarkdown(textBlock.html(), this.type)));
      }
    },
    
    /*
      Generic Upload Attachment Function
      Designed to handle any attachments
    */
    
    uploadAttachment: function(file, callback){
      
      var uid  = [this.instance.ID, (new Date()).getTime(), 'raw'].join('-');
      
      var data = new FormData();
      
      data.append('attachment[name]', file.name);
      data.append('attachment[file]', file);
      data.append('attachment[uid]', uid);
      
      var callbackSuccess = function(data){
        if (!_.isUndefined(callback) && _.isFunction(callback)) {
          _.bind(callback, this)(data); // Invoke with a reference to 'this' (the block)
        }
      };
      
      $.ajax({
        url: this.instance.options.uploadUrl,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: _.bind(callbackSuccess, this)
      });
    },
    
    /* Private methods */
    
    _loadData: function() {
      this.loading();
      
      if(this.dropEnabled) {
        this.$dropzone.hide();
        this.$editor.show();
      }
      
      this.loadData(this.data);
      this.ready();
    },
    
    _validate: function() {
      this.errors = []; 
      this.$('.error').removeClass('error');
      this.$('.error-marker').remove();
      return this.validate();
    },
    
    _handleContentPaste: function(ev) {
      // We need a little timeout here
      var timed = function(ev){ 
        // Delegate this off to the super method that can be overwritten
        this.onContentPasted(ev);
      };
      _.delay(_.bind(timed, this, ev), 100);
    },
    
    _handleDrop: function(e) {
      
      e.preventDefault();
      e = e.originalEvent;
    
      var el = $(e.target),
          types = e.dataTransfer.types,
          type, data = [];
      
      this.$dropzone.removeClass('dragOver');
          
      /*
        Check the type we just received,
        delegate it away to our blockTypes to process
      */    
      
      if (!_.isUndefined(types))
      {
        if (_.include(types, 'Files') || _.include(types, 'text/plain') || _.include(types, 'text/uri-list')) 
        {
          this.onDrop(e.dataTransfer);
        } 
      }
    },
  
    _setBaseElements: function(){
      var el = (_.isFunction(this.editorHTML)) ? this.editorHTML() : this.editorHTML;
      
      // Set
      var editor = $('<div>', {
        'class': 'block-editor ' + this.className + '-block',
        html: el
      });
      
      this.$el = $('<div>', { 
        'class': this.instance.options.baseCSSClass + "-block", 
        id: this.blockID,
        "data-type": this.type,
        html: editor
      });
      
      // Set our element references
      this.el = this.$el[0];
      this.$editor = editor;
    },
    
    _getBlockType: function() {
      var objName = "";
      for (var block in SirTrevor.Blocks) {
        if (SirTrevor.Blocks[block].prototype == Object.getPrototypeOf(this)) {
          objName = block;
        }
      } 
      return objName;
    },
    
    /*
    * Init functions for adding functionality
    *
    */
    
    _initDragDrop: function() {
      
      this.$dropzone = $("<div>", {
        html: this.dropzoneHTML,
        class: "dropzone " + this.className + '-block'
      });
      this.$el.append(this.$dropzone);
      this.$editor.hide();
      
      // Bind our drop event
      this.$dropzone.dropArea();
      this.$dropzone.bind('drop', this._handleDrop);
    },
    
    _initReordering: function() {
      this.$('.handle')
        .dropArea()
        .bind('dragstart', this.onDragStart)
        .bind('drag', this.instance.marker.show)
        .bind('dragend', this.onDragEnd)
        .bind('dragleave', function(){});
    },
    
    _initFormatting: function() {
      // Enable formatting keyboard input
      var formatter;
      for (var name in this.instance.formatters) {
        if (this.instance.formatters.hasOwnProperty(name)) {
          formatter = SirTrevor.Formatters[name];
          if (!_.isUndefined(formatter.keyCode)) {
            formatter._bindToBlock(this.$editor);
          }
        }
      }
    },
    
    _initPaste: function() {
      this.$('.paste-block')
        .bind('click', function(){ $(this).select(); })
        .bind('paste', this._handleContentPaste)
        .bind('submit', this._handleContentPaste);
    }
      
  });
  
  Block.extend = extend; // Allow our Block to be extended.
  
  var Format = SirTrevor.Formatter = function(options){
    this.formatId = _.uniqueId('format-');
    this._configure(options || {});
    this.className = SirTrevor.DEFAULTS.baseCSSClass + "-format-" + this.options.className;
    this.initialize.apply(this, arguments);
  };
  
  var formatOptions = ["title", "className", "cmd", "keyCode", "param", "onClick", "toMarkdown", "toHTML"];
  
  _.extend(Format.prototype, {
    
    title: '',
    className: '',
    cmd: null,
    keyCode: null,
    param: null,
    toMarkdown: function(markdown){ return markdown; },
    toHTML: function(html){ return html; },
    
    initialize: function(){},
    
    _configure: function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = formatOptions.length; i < l; i++) {
        var attr = formatOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },
    
    _bindToBlock: function(block) {
      
      var formatter = this,
          ctrlDown = false;
          
      block
        .on('keyup','.text-block', function(ev) {
          if(ev.which == 17 || ev.which == 224) { 
            ctrlDown = false;
          }
        })
        .on('keydown','.text-block', { formatter: formatter }, function(ev) {
          if(ev.which == 17 || ev.which == 224) { 
            ctrlDown = true;
          }  
          if(ev.which == ev.data.formatter.keyCode && ctrlDown === true) {
            document.execCommand(ev.data.formatter.cmd, false, true);
            ev.preventDefault();
          }
        });
    }
  });
  
  Format.extend = extend; // Allow our Formatters to be extended.
  
  /* Default Blocks */
  /*
    Block Quote
  */
  
  SirTrevor.Blocks.Quote = SirTrevor.Block.extend({ 
    
    title: "Quote",
    className: "block-quote",
    limit: 0,
    
    editorHTML: function() {
      return _.template('<blockquote class="required text-block <%= className %>" contenteditable="true"></blockquote><div class="input text"><label>Credit</label><input data-maxlength="140" name="cite" class="input-string required" type="text" /></div>', this);
    },
    
    loadData: function(data){
      this.$$('.text-block').html(this.instance._toHTML(data.text, this.type));
      this.$$('input').val(data.cite);
    },
    
    toMarkdown: function(markdown) {
      return markdown.replace(/^(.+)$/mg,"> $1");
    }
    
  });
  /*
    Gallery
  */
  
  var dropzone_templ = "<p>Drop images here</p><div class=\"input submit\"><input type=\"file\" multiple=\"multiple\" /></div><button>...or choose file(s)</button>";
  
  SirTrevor.Blocks.Gallery = SirTrevor.Block.extend({ 
    
    title: "Gallery",
    className: "gallery",
    dropEnabled: true,
    editorHTML: "<div class=\"gallery-items\"><p>Gallery contents: </p><ul></ul></div>",
    dropzoneHTML: dropzone_templ,
    
    loadData: function(data){
      // Find all our gallery blocks and draw nice list items from it
      if (_.isArray(data)) {
        _.each(data, _.bind(function(item){
          // Create an image block from this
          this.renderGalleryThumb(item);
        }, this));
        
        // Show the dropzone too
        this.$dropzone.show();
      }
    },
    
    renderGalleryThumb: function(item) {
      
      if(_.isUndefined(item.data.file)) return false;
      
      var img = $("<img>", {
        src: item.data.file.thumb.url
      });
      
      var list = $('<li>', {
        id: _.uniqueId('gallery-item'),
        class: 'gallery-item',
        html: img
      });
      
      list.append($("<span>", {
        class: 'delete',
        click: _.bind(function(e){
          // Remove this item
          halt(e);
          
          if (confirm('Are you sure you wish to delete this image?')) {
            $(e.target).parent().remove();
          
            var dataStruct = this.$el.data('block');
            dataStruct.data = [];
          
            _.each(this.$('li.gallery-item'), function(li){
              li = $(li);
              dataStruct.data.push(li.data('block'));
            });
          }
        }, this)
      }));
      
      list.data('block', item);
      
      this.$$('ul').append(list);
      
      // Make it sortable
      list
        .dropArea()
        .bind('dragstart', _.bind(function(ev){
          var item = $(ev.target);
          ev.originalEvent.dataTransfer.setData('Text', item.parent().attr('id'));
          item.parent().addClass('dragging');
        }, this))
        
        .bind('drag', _.bind(function(ev){
          
        }, this))
        
        .bind('dragend', _.bind(function(ev){
          var item = $(ev.target);
          item.parent().removeClass('dragging');
        }, this))
        
        .bind('dragover', _.bind(function(ev){
          var item = $(ev.target);
          item.parents('li').addClass('dragover');
        }, this))
        
        .bind('dragleave', _.bind(function(ev){
          var item = $(ev.target);
          item.parents('li').removeClass('dragover');
        }, this))
        
        .bind('drop', _.bind(function(ev){
          
          var item = $(ev.target),
              parent = item.parent();
              
          item = (item.hasClass('gallery-item') ? item : parent);    
          
          this.$$('ul li.dragover').removeClass('dragover');
          
          // Get the item
          var target = $('#' + ev.originalEvent.dataTransfer.getData("text/plain"));
          
          if(target.attr('id') === item.attr('id')) return false;
          
          if (target.length > 0 && target.hasClass('gallery-item')) {
            item.before(target);
          }
          
          // Reindex the data
          var dataStruct = this.$el.data('block');
          dataStruct.data = [];
          
          _.each(this.$$('li.gallery-item'), function(li){
            li = $(li);
            dataStruct.data.push(li.data('block'));
          });
                  
        }, this));
    },
    
    onBlockRender: function(){
      // We need to setup this block for reordering
       /* Setup the upload button */
        this.$dropzone.find('button').bind('click', halt);
        this.$dropzone.find('input').on('change', _.bind(function(ev){
          this.onDrop(ev.currentTarget);
        }, this));
    },
    
    onDrop: function(transferData){
          
      if (transferData.files.length > 0) {
        // Multi files 'ere
        var l = transferData.files.length,
            file, urlAPI = (typeof URL !== "undefined") ? URL : (typeof webkitURL !== "undefined") ? webkitURL : null;
            
        this.loading();
        
        while (l--) {
          file = transferData.files[l];
          if (/image/.test(file.type)) {
            // Inc the upload count
            this.uploadsCount += 1;
            this.$editor.show();
            
            /* Upload */
            this.uploadAttachment(file, function(data){
              
              this.uploadsCount -= 1;
              var dataStruct = this.getData();
              data = { type: "image", data: data };
              
              // Add to our struct
              if (!_.isArray(dataStruct.data)) {
                dataStruct.data = [];
              }
              dataStruct.data.push(data);
              
              // Pass this off to our render gallery thumb method
              this.renderGalleryThumb(data);
              
              if(this.uploadsCount === 0) {
                this.ready();
              }
            });
          }
        }
      }
    }
    
  });
  /*
    Simple Image Block
  */
  
  var dropzone_templ = "<p>Drop image here</p><div class=\"input submit\"><input type=\"file\" /></div><button>...or choose a file</button>";
  
  
  SirTrevor.Blocks.Image = SirTrevor.Block.extend({ 
    
    title: "Image",
    className: "image",
    dropEnabled: true,
    
    dropzoneHTML: dropzone_templ,
    
    loadData: function(data){
      // Create our image tag
      this.$editor.html($('<img>', {
        src: data.file.url
      }));
    },
    
    onBlockRender: function(){
      /* Setup the upload button */
      this.$dropzone.find('button').bind('click', halt);
      this.$dropzone.find('input').on('change', _.bind(function(ev){
        this.onDrop(ev.currentTarget);
      }, this));
    },
    
    onDrop: function(transferData){
      var file = transferData.files[0],
          urlAPI = (typeof URL !== "undefined") ? URL : (typeof webkitURL !== "undefined") ? webkitURL : null;
          
      // Handle one upload at a time
      if (/image/.test(file.type)) {
        this.loading();
        // Show this image on here
        this.$dropzone.hide();
        this.$editor.html($('<img>', {
          src: urlAPI.createObjectURL(file)
        }));
        this.$editor.show();
        
        // Upload!
        this.uploadAttachment(file, function(data){
          // Store the data on this block
          this.setData(data);
          // Done
          this.ready();
        });
      }
    }
  });
  /*
    Text Block
  */
  
  var tb_template = '<div class="required text-block" contenteditable="true"></div>';
  
  SirTrevor.Blocks.Text = SirTrevor.Block.extend({ 
    
    title: "Text",
    className: "text",
    limit: 0,
    
    editorHTML: function() {
      return _.template(tb_template, this);
    },
    
    loadData: function(data){
      this.$$('.text-block').html(this.instance._toHTML(data.text, this.type));
    }
  });
  var t_template = '<p>Drop tweet link here</p><div class="input text"><label>or paste URL:</label><input type="text" class="paste-block"></div>';
  var tweet_template = '<div class="tweet media"><div class="img"><img src="<%= user.profile_image_url %>" class="tweet-avatar"></div><div class="bd tweet-body"><p><a href="http://twitter.com/#!/<%= user.screen_name %>">@<%= user.screen_name %></a>: <%= text %></p><time><%= created_at %></time></div></div>';
  
  SirTrevor.Blocks.Tweet = SirTrevor.Block.extend({ 
    
    title: "Tweet",
    className: "tweet",
    dropEnabled: true,
    
    dropzoneHTML: t_template,
    
    loadData: function(data){
      this.$editor.html(_.template(tweet_template, data));
    },
    
    onContentPasted: function(event){
      // Content pasted. Delegate to the drop parse method
      var input = $(event.target),
          val = input.val();
      
      // Pass this to the same handler as onDrop
      this.handleTwitterDropPaste(val);
    },
    
    handleTwitterDropPaste: function(url){
      
      if(_.isURI(url)) 
      {
        if (url.indexOf("twitter") != -1 && url.indexOf("status") != -1) {
          // Twitter status
          var tweetID = url.match(/[^\/]+$/);
          if (!_.isEmpty(tweetID)) {
            
            this.loading();
            
            tweetID = tweetID[0];
            
            var tweetCallbackSuccess = function(data) {
              // Parse the twitter object into something a bit slimmer..
              var obj = {
                user: {
                  profile_image_url: data.user.profile_image_url,
                  profile_image_url_https: data.user.profile_image_url_https,
                  screen_name: data.user.screen_name,
                  name: data.user.name
                },
                text: data.text,
                created_at: data.created_at,
                status_url: url
              };
              
              // Save this data on the block
              this.setData(obj);
              this._loadData();
              
              this.ready();
            };
  
            var tweetCallbackFail = function(){
              this.ready();
            };
            
            // Make our AJAX call
            $.ajax({
              url: "http://api.twitter.com/1/statuses/show/" + tweetID + ".json",
              dataType: "JSONP",
              success: _.bind(tweetCallbackSuccess, this),
              error: _.bind(tweetCallbackFail, this)
            });
          }
        }
      }
      
    },
  
    onDrop: function(transferData){
      var url = transferData.getData('text/plain');
      this.handleTwitterDropPaste(url);
    }
  });
  
  /*
    Unordered List
  */
  
  var template = '<div class="text-block <%= className %>" contenteditable="true"></div>';
  
  SirTrevor.Blocks.Ul = SirTrevor.Block.extend({ 
    
    title: "List",
    className: "list",
    
    editorHTML: function() {
      return _.template(template, this);
    },
    
    onBlockRender: function() {
      this.$$('.text-block').bind('click', function(){
        if($(this).html().length === 0){
          document.execCommand("insertUnorderedList",false,false);
        }
      });
      
      // Put in a list
      if (_.isEmpty(this.data)) {
        this.$$('.text-block').focus().click();
      }
      
    },
      
    loadData: function(data){
      this.$$('.text-block').html("<ul>" + this.instance._toHTML(data.text, this.type) + "</ul>");
    },
    
    toMarkdown: function(markdown) {
      return markdown.replace(/<\/li>/mg,"\n")
                     .replace(/<\/?[^>]+(>|$)/g, "")
                     .replace(/^(.+)$/mg," - $1"); 
    },
    
    toHTML: function(html) {
      return html.replace(/^ - (.+)$/mg,"<li>$1</li>");
    }
  });
  
  var video_drop_template = '<p>Drop video link here</p><div class="input text"><label>or paste URL:</label><input type="text" class="paste-block"></div>';
  var video_regex = /http[s]?:\/\/(?:www.)?(?:(vimeo).com\/(.*))|(?:(youtu(?:be)?).(?:be|com)\/(?:watch\?v=)?([^&]*)(?:&(?:.))?)/;
  
  SirTrevor.Blocks.Video = SirTrevor.Block.extend({ 
    
    title: "Video",
    className: "video",
    dropEnabled: true,
    
    dropzoneHTML: video_drop_template,
    
    loadData: function(data){    
      if(data.source == "youtube" || data.source == "youtu") {
        this.$editor.html("<iframe src=\""+window.location.protocol+"//www.youtube.com/embed/" + data.remote_id + "\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>");
      } else if(data.source == "vimeo") {
        this.$editor.html("<iframe src=\""+window.location.protocol+"//player.vimeo.com/video/" + data.remote_id + "?title=0&byline=0\" width=\"580\" height=\"320\" frameborder=\"0\"></iframe>");
      }
    },
    
    onContentPasted: function(event){
      // Content pasted. Delegate to the drop parse method
      var input = $(event.target),
          val = input.val();
      
      // Pass this to the same handler as onDrop
      this.handleDropPaste(val);
    },
    
    handleDropPaste: function(url){
      
      if(_.isURI(url)) 
      {
        if (url.indexOf("youtu") != -1 || url.indexOf("vimeo") != -1) {
            
          var data = {},
          videos = url.match(video_regex);
            
          // Work out the source and extract ID
          if(videos[3] !== undefined) {
            data.source = videos[3];
            data.remote_id = videos[4];
          } else if (videos[1] !== undefined) {
            data.source = videos[1];
            data.remote_id = videos[2];
          }
        
          if (data.source == "youtu") { 
            data.source = "youtube";
          }
          
          // Save the data
          this.setData(data);
          
          // Render  
          this._loadData();  
        }
      }
      
    },
    
    onDrop: function(transferData){
      var url = transferData.getData('text/plain');
      this.handleDropPaste(url);
    }
  });
  
  /* Default Formatters */
  /* Our base formatters */
  
  var Bold = SirTrevor.Formatter.extend({
    title: "B",
    className: "bold",
    cmd: "bold",
    keyCode: 66
  });
  
  var Italic = SirTrevor.Formatter.extend({
    title: "I",
    className: "italic",
    cmd: "italic",
    keyCode: 73
  });
  
  var Underline = SirTrevor.Formatter.extend({
    title: "U",
    className: "underline",
    cmd: "underline"
  });
  
  var Link = SirTrevor.Formatter.extend({
    
    title: "Link",
    className: "link",
    cmd: "CreateLink",
    
    onClick: function() {
      
      var link = prompt("Enter a link"),
          link_regex = /(ftp|http|https):\/\/./;
      
      if(link && link.length > 0) {
        
       if (!link_regex.test(link)) { 
         link = "http://" + link; 
       }
       
       document.execCommand(this.cmd, false, link);
      }
    }
  });
  
  var UnLink = SirTrevor.Formatter.extend({
    title: "Unlink",
    className: "link",
    cmd: "unlink"
  });
  
  var Heading1 = SirTrevor.Formatter.extend({
    
    title: "H1",
    className: "heading h1",
    cmd: "formatBlock",
    param: "H1",
    
    toMarkdown: function(markdown) {
      return markdown.replace(/<h1>([^*|_]+)<\/h1>/mg,"#$1#\n"); 
    },
    
    toHTML: function(html) {
      return html.replace(/(?:#)([^*|_]+)(?:#)/mg,"<h1>$1</h1>"); 
    }
  });
  
  var Heading2 = SirTrevor.Formatter.extend({
    title: "H2",
    className: "heading h2",
    cmd: "formatBlock",
    param: "H2",
    
    toMarkdown: function(markdown) {
      return markdown.replace(/<h2>([^*|_]+)<\/h2>/mg,"##$1##\n"); 
    },
    
    toHTML: function(html) {
      return html.replace(/(?:##)([^*|_]+)(?:##)/mg,"<h2>$1</h2>"); 
    }
  });
  
  /*
    Create our formatters and add a static reference to them
  */
  SirTrevor.Formatters.Bold = new Bold();
  SirTrevor.Formatters.Italic = new Italic();
  SirTrevor.Formatters.Link = new Link();
  SirTrevor.Formatters.Unlink = new UnLink();
  //SirTrevor.Formatters.Heading1 = new Heading1();
  //SirTrevor.Formatters.Heading2 = new Heading2();
  /* Marker */
  /*
    SirTrevor Marker
    --
    This is our toolbar. It's attached to a SirTrveor.Editor instance. 
  */
  
  var Marker = SirTrevor.Marker = function(options, editorInstance){
    this.instance = editorInstance;
    this.options = _.extend({}, SirTrevor.DEFAULTS.marker, options || {});
    this._bindFunctions();
  };
  
  _.extend(Marker.prototype, FunctionBind, {
    
    bound: ["onButtonClick", "show", "hide", "onDrop"],
    
    render: function() {
      
      var marker = $('<span>', {
        'class': this.instance.options.baseCSSClass + "-" + this.options.baseCSSClass,
        html: '<p>' + this.options.addText + '</p><div class="buttons"></div>'
      });
      
      // Bind to the wrapper
      this.instance.$wrapper.append(marker);
      
      // Cache our elements for later use
      this.$el = marker;
      this.$btns = this.$el.find('.buttons');
      this.$p = this.$el.find('p');
      
      // Add all of our buttons
      var blockName, block; 
      
      for (blockName in this.instance.blockTypes) {
        if (SirTrevor.Blocks.hasOwnProperty(blockName)) {
          block = SirTrevor.Blocks[blockName];
          if (block.prototype.toolbarEnabled) {
            this.$btns.append(
             $("<a>", {
              "href": "#",
              "class": this.options.buttonClass + " new-" + block.prototype.className,
              "data-type": blockName,
              "text": block.prototype.title,
              click: this.onButtonClick
             }) 
            );
          }
        }
      }
      
      // Do we have any buttons?
      if(this.$btns.children().length === 0) this.$el.addClass('hidden');
      
      // Bind the drop function onto here
      this.$el.dropArea();
      this.$el.bind('drop', this.onDrop);
      
      // Bind our marker to the wrapper
      this.instance.$wrapper.bind('mouseover', this.show);
      this.instance.$wrapper.bind('mouseout', this.hide);
      
      this.$el.addClass('sir-trevor-item-ready');    
    },
      
    show: function(ev){ 
      if(ev.type == 'drag') {
        this.$p.text(this.options.dropText);
        this.$btns.hide();
      } else {
        this.$p.text(this.options.addText);
        this.$btns.show();
      }
      
      var mouse_enter = (ev) ? ev.originalEvent.pageY - this.instance.$wrapper.offset().top : 0;
      
      // Do we have any sedit blocks?
      if (this.instance.blocks.length > 0) {
      
        // Find the closest block to this position
        var closest_block = false,
            wrapper = this.instance.$wrapper,
            blockClass = "." + this.instance.options.baseCSSClass + "-block";
        
        var blockIterator = function(block, index) {
          block = $(block);
          var block_top = block.position().top - 35,
              block_bottom = block.position().top + block.outerHeight(true) - 35;
      
          if(block_top <= mouse_enter && mouse_enter < block_bottom) {
            closest_block = block;
          }
        };
        _.each(wrapper.find(blockClass), _.bind(blockIterator, this));
        
        // Position it
        if (closest_block) {
          closest_block.before(this.$el);
        } else if(mouse_enter > 0) {
          wrapper.find(blockClass).last().after(this.$el);
        } else {
          wrapper.find(blockClass).first().before(this.$el);
        }
      }
      this.$el.addClass('sir-trevor-item-ready');
    },
  
    hide: function(ev){ 
      this.$el.removeClass('sir-trevor-item-ready'); 
    },
    
    onDrop: function(ev){
      halt(ev);
      
      var marker = $(ev.target),
          item_id = ev.originalEvent.dataTransfer.getData("text/plain"),
          block = $('#' + item_id);
          
      if (!_.isUndefined(item_id) && !_.isEmpty(block)) {
        marker.after(block);
      }
    },
    
    remove: function(){ this.$el.remove(); },
    
    onButtonClick: function(ev){
      halt(ev);
      var button = $(ev.target);
      
      if (button.hasClass('inactive')) {
        alert('You cannot create any more blocks of this type');
        return false;
      }
      
      this.instance.createBlock(button.attr('data-type'), {});
    }
  });
  
  
  
  
  /* FormatBar */
  /*
    Format Bar
    --
    Displayed on focus on a text area.
    Renders with all available options for the editor instance
  */
  
  var FormatBar = SirTrevor.FormatBar = function(options, editorInstance) {
    this.instance = editorInstance;
    this.options = _.extend({}, SirTrevor.DEFAULTS.formatBar, options || {});
    this.className = this.instance.options.baseCSSClass + "-" + this.options.baseCSSClass;
    this._bindFunctions();
  };
  
  _.extend(FormatBar.prototype, FunctionBind, {
    
    bound: ["onFormatButtonClick"],
    
    render: function(){
      
      var bar = $("<div>", {
        "class": this.className
      });
      
      this.instance.$wrapper.prepend(bar);
      this.$el = bar;
      
      var formats = this.instance.formatters,
          formatName, format;
          
      for (formatName in formats) {
        if (SirTrevor.Formatters.hasOwnProperty(formatName)) {
          format = SirTrevor.Formatters[formatName];
          $("<button>", {
            'class': 'format-button ' + format.className,
            'text': format.title,
            'data-type': formatName,
            'data-cmd': format.cmd,
            click: this.onFormatButtonClick
          }).appendTo(this.$el);
        }
      }
      
      if(this.$el.find('button').length === 0) this.$el.addClass('hidden');
      
      this.$el.hide();
      this.$el.bind('mouseout', halt);
      this.$el.bind('mouseover', halt);
      
      this.instance.$wrapper.bind('click', this.onWrapperClick);
    },
    
    /* Convienience methods */
    show: function(relativeEl){
      this.$el.css({
        top: relativeEl.position().top
      });
      this.$el.show();
      this.$el.addClass('sir-trevor-item-ready'); 
    },
    
    onWrapperClick: function(ev){
      var item = $(ev.target),
          parent = item.parent();
          
      if(!(item.hasClass(this.className) || parent.hasClass(this.className) || item.hasClass('text-block') || parent.hasClass('text-block'))) {
        this.hide();
      }
    },
  
    hide: function(){ 
      this.$el.hide();
      this.$el.removeClass('sir-trevor-item-ready'); 
    },
    
    remove: function(){ this.$el.remove(); },
    
    onFormatButtonClick: function(ev){
      halt(ev);
      var btn = $(ev.target),
          format = SirTrevor.Formatters[btn.attr('data-type')];
       
      // Do we have a click function defined on this formatter?     
      if(!_.isUndefined(format.onClick) && _.isFunction(format.onClick)) {
        format.onClick(); // Delegate
      } else {
        // Call default
        document.execCommand(btn.attr('data-cmd'), false, format.param);
      }   
      // Make sure we still show the bar
      this.$el.addClass('sir-trevor-item-ready'); 
    }
    
  });
  /*
    Sir Trevor Editor
    -- 
    Represents one Sir Trevor editor instance (with multiple blocks)
    Each block references this instance. 
    BlockTypes are global however.
  */
  
  var SirTrevorEditor = SirTrevor.Editor = function(options) {
    
    this.blockTypes = {};
    this.formatters = {};
    this.blockCounts = {}; // Cached block type counts
    this.blocks = []; // Block references
    this.options = _.extend({}, SirTrevor.DEFAULTS, options || {});
    this.ID = _.uniqueId(this.options.baseCSSClass + "-");
    
    if (this._ensureAndSetElements()) {
      
      this.marker = new SirTrevor.Marker(this.options.marker, this);
      this.formatBar = new SirTrevor.FormatBar(this.options.formatBar, this);
      
      this._setBlocksAndFormatters();
      this._bindFunctions();
      this.from_json();
      this.build();
      
      SirTrevor.instances.push(this); // Store a reference to this instance
      SirTrevor.bindFormSubmit(this.$form);
    }
  };
  
  _.extend(SirTrevorEditor.prototype, FunctionBind, {
    
    bound: ['onFormSubmit'],
    
    initialize: function() {},
    
    /*
      Build the Editor instance. 
      Check to see if we've been passed JSON already, and if not try and create a default block.
      If we have JSON then we need to build all of our blocks from this.
    */
    build: function() {
      this.$el.hide();
      
      // Render marker & format bar
      this.marker.render();
      this.formatBar.render();
      
      if (this.options.blockStore.data.length === 0) {
        // Create a default instance
        this.createBlock(this.options.defaultType);
      } else {
        // We have data. Build our blocks from here.
        _.each(this.options.blockStore.data, _.bind(function(block){
          this.createBlock(block.type, block.data);
        }, this));
      }
          
      this.$wrapper.addClass('sir-trevor-ready');
    },
    
    /*
      Create an instance of a block from an available type. 
      We have to check the number of blocks we're allowed to create before adding one and handle fails accordingly.
      A block will have a reference to an Editor instance & the parent BlockType.
      We also have to remember to store static counts for how many blocks we have, and keep a nice array of all the blocks available.
    */
    createBlock: function(type, data) {
      
      type = _.capitalize(type); // Proper case
      
      if (this._blockTypeAvailable(type)) {
        
       var blockType = SirTrevor.Blocks[type],
           currentBlockCount = (_.isUndefined(this.blockCounts[type])) ? 0 : this.blockCounts[type],
           totalBlockCounts = this.blocks.length,
           blockTypeLimit = this._getBlockTypeLimit(type);
           
       // Can we have another one of these blocks?
       if ((blockTypeLimit !== 0 && currentBlockCount > blockTypeLimit) || this.options.blockLimit !== 0 && totalBlockCounts >= this.options.blockLimit) {
         return false;
       }
       
       var block = new blockType(this, data || {});  
       
       if (_.isUndefined(this.blockCounts[type])) {
         this.blockCounts[type] = 0;
       }
       
       this.blocks.push(block);
       currentBlockCount++;
       this.blockCounts[type] = currentBlockCount;
       
       // Check to see if we can add any more blocks
       if (this.options.blockLimit !== 0 && this.blocks.length >= this.options.blockLimit) {
         this.marker.$el.addClass('hidden');
       }
        
       if (blockTypeLimit !== 0 && currentBlockCount >= blockTypeLimit) {
         this.marker.$el.find('[data-type="' + type + '"]')
          .addClass('inactive')
          .attr('title','You have reached the limit for this type of block');
       } 
      }
    },
    
    removeBlock: function(block) {
      // Blocks exist purely on the dom. 
      // Remove the block and decrement the blockCount
      block.remove();
      this.blockCounts[block.type] = this.blockCounts[block.type] - 1;
      
      // Remove the block from our store
      this.blocks = _.reject(this.blocks, function(item){ return (item.blockID == block.blockID); });
      if(_.isUndefined(this.blocks)) this.blocks = [];
      this.formatBar.hide();
      
      // Remove our inactive class if it's no longer relevant
      if(this._getBlockTypeLimit(block.type) > this.blockCounts[block.type]) {
        this.marker.$el.find('[data-type="' + block.type + '"]')
          .removeClass('inactive')
          .attr('title','Add a ' + block.type + ' block');
      }
    },
    
    /*
      Handle a form submission of this Editor instance.
      Validate all of our blocks, and serialise all data onto the JSON objects
    */
    onFormSubmit: function() {
      
      var blockLength, block, result, errors = 0;
  
      this.options.blockStore.data = [];
      
      // Loop through blocks to validate
      var blockIterator = function(block,index) {
        // Find our block
        block = $(block);
        var _block = _.find(this.blocks, function(b){ return (b.blockID == block.attr('id')); });
        
        if (!_.isUndefined(_block) || !_.isEmpty(_block) || typeof _block == SirTrevor.Block) {
          // Validate our block
          if(_block.validate())
          {
            var data = _block.save();
            if(!_.isEmpty(data.data)) {
              this.options.blockStore.data.push(data);
            }
          } else errors++;
        }
        
      };
      _.each(this.$wrapper.find('.' + this.options.baseCSSClass + "-block"), _.bind(blockIterator, this));
  
      // Empty or JSON-ify
      this.$el.val((this.options.blockStore.data.length === 0) ? '' : this.to_json());
      return errors;
    },
    
    /*
      Turn our JSON blockStore into a string
    */  
    to_json: function() {
      return JSON.stringify(this.options.blockStore);
    },
    
    /* 
      Try and load our data from the defined element.
      Store it on our blockStore property for later re-use.
    */
    from_json: function() {
      var content = this.$el.val();
      this.options.blockStore = { data: [] };
      
      if (content.length > 0) {
        try{
          
          // Ensure the JSON string has a data element that's an array
          var str = JSON.parse(content);
          
          if (!_.isUndefined(str.data) && (_.isArray(str.data) && !_.isEmpty(str.data))) {
            // Set it
            this.options.blockStore = str;
          } 
        } catch(e) {
          console.log('Sorry there has been a problem with parsing the JSON');
          console.log(e);
        }
      } 
    },
    
    /*
      Get Block Type Limit
      --
      returns the limit for this block, which can be set on a per Editor instance, or on a global blockType scope.
    */
    _getBlockTypeLimit: function(t) {
      if (this._blockTypeAvailable(t)) {
        return (_.isUndefined(this.options.blockTypeLimits[t])) ? SirTrevor.Blocks[t].prototype.limit : this.options.blockTypeLimits[t];
      }
      return 0;
    },
    
    /* 
      Availability helper methods
      --
      Checks if the object exists within the instance of the Editor.
    */
    _blockTypeAvailable: function(t) {
      return !_.isUndefined(this.blockTypes[t]);
    },
    
    _formatterAvailable: function(f) {
      return !_.isUndefined(this.formatters[f]);
    },
    
    _ensureAndSetElements: function() {
      
      if(_.isUndefined(this.options.el) || _.isEmpty(this.options.el)) {
        return false;
      }
       
      this.$el = this.options.el;
      this.el = this.options.el[0];
      this.$form = this.$el.parents('form');
      
      // Wrap our element in lots of containers *eww*
      this.$el.wrap($('<div>', { 
                      id: this.ID,
                      'class': this.options.baseCSSClass + " " + this.options.baseCSSClass + "_dragleave",
                      dropzone: 'copy link move'
                    })
                  );
        
      this.$wrapper = this.$form.find('#' + this.ID); 
      return true;
    },
    
    
    /*
      Set our blockTypes and formatters.
      These will either be set on a per Editor instance, or set on a global scope.
    */
    _setBlocksAndFormatters: function() {
      this.blockTypes = flattern((_.isUndefined(this.options.blockTypes)) ? SirTrevor.Blocks : this.options.blockTypes);
      this.formatters = flattern((_.isUndefined(this.options.formatters)) ? SirTrevor.Formatters : this.options.formatters);    
    },
    
    /*
      A very generic HTML -> Markdown parser
      Looks for available formatters / blockTypes toMarkdown methods and calls these if they exist.
    */
    _toMarkdown: function(content, type) {
  
      var markdown;
      
      markdown = content.replace(/\n/mg,"")
                        .replace(/<a.*?href=[""'](.*?)[""'].*?>(.*?)<\/a>/g,"[$2]($1)")         // Hyperlinks
                        .replace(/<\/?b>/g,"**")
                        .replace(/<\/?STRONG>/g,"**")                   // Bold
                        .replace(/<\/?i>/g,"_")
                        .replace(/<\/?EM>/g,"_");                        // Italic
  
      // Use custom formatters toMarkdown functions (if any exist)
      var formatName, format;
      for(formatName in this.formatters) {
        if (SirTrevor.Formatters.hasOwnProperty(formatName)) {
          format = SirTrevor.Formatters[formatName];
          // Do we have a toMarkdown function?
          if (!_.isUndefined(format.toMarkdown) && _.isFunction(format.toMarkdown)) {
            markdown = format.toMarkdown(markdown);
          }
        }
      }
      
      // Use custom block toMarkdown functions (if any exist)
      var block;
      if (SirTrevor.Blocks.hasOwnProperty(type)) {
        block = SirTrevor.Blocks[type];
        // Do we have a toMarkdown function?
        if (!_.isUndefined(block.prototype.toMarkdown) && _.isFunction(block.prototype.toMarkdown)) {
          markdown = block.prototype.toMarkdown(markdown);
        }
      }
       
      // Do our generic stripping out
      markdown = markdown.replace(/([^<>]+)(<div>)/g,"$1\n\n$2")                                 // Divitis style line breaks (handle the first line)
                     .replace(/(?:<div>)([^<>]+)(?:<div>)/g,"$1\n\n")                            // ^ (handle nested divs that start with content)
                     .replace(/(?:<div>)(?:<br>)?([^<>]+)(?:<br>)?(?:<\/div>)/g,"$1\n\n")        // ^ (handle content inside divs)
                     .replace(/<\/p>/g,"\n\n\n\n")                                               // P tags as line breaks
                     .replace(/<(.)?br(.)?>/g,"\n\n")                                            // Convert normal line breaks
                     .replace(/&nbsp;/g," ")                                                     // Strip white-space entities 
                     .replace(/&lt;/g,"<").replace(/&gt;/g,">")                                  // Encoding
                     .replace(/<\/?[^>]+(>|$)/g, "");                                            // Strip remaining HTML
                     
      return markdown;
    },
    
    /*
      A very generic Markdown -> HTML parser
      Looks for available formatters / blockTypes toMarkdown methods and calls these if they exist.
    */
    _toHTML: function(markdown, type) {
      var html = markdown;
      
      // Use custom formatters toHTML functions (if any exist)
      var formatName, format;
      for(formatName in this.formatters) {
        if (SirTrevor.Formatters.hasOwnProperty(formatName)) {
          format = SirTrevor.Formatters[formatName];
          // Do we have a toMarkdown function?
          if (!_.isUndefined(format.toHTML) && _.isFunction(format.toHTML)) {
            html = format.toHTML(html);
          }
        }
      }
      
      // Use custom block toHTML functions (if any exist)
      var block;
      if (SirTrevor.Blocks.hasOwnProperty(type)) {
        block = SirTrevor.Blocks[type];
        // Do we have a toMarkdown function?
        if (!_.isUndefined(block.prototype.toHTML) && _.isFunction(block.prototype.toHTML)) {
          html = block.prototype.toHTML(html);
        }
      }
      
      html =  html.replace(/^\> (.+)$/mg,"$1")                                       // Blockquotes
                  .replace(/\n\n/g,"<br>")                                           // Give me some <br>s
                  .replace(/\[(.+)\]\((.+)\)/g,"<a href='$2'>$1</a>")                 // Links
                  .replace(/(?:_)([^*|_]+)(?:_)/mg,"<i>$1</i>")                   // Italic
                  .replace(/(?:\*\*)([^*|_]+)(?:\*\*)/mg,"<b>$1</b>");                // Bold
         
      return html;  
    }
  });
  
  

  /* We need a form handler here to handle all the form submits */
  
  SirTrevor.bindFormSubmit = function(form) {
    if (!formBound) {
      form.bind('submit', this.onFormSubmit);
      formBound = true;
    }
  };
  
  SirTrevor.onFormSubmit = function(ev) {
    // Loop through all of our instances and do our form submits on them
    var errors = 0;
    _.each(SirTrevor.instances, function(inst, i) {
      errors += inst.onFormSubmit();
    });
    
    if(errors > 0) {
      ev.preventDefault();
    } 
  };

}(jQuery, _));
