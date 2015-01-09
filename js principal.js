/**
* Cookie plugin
*
* Copyright (c) 2006 Klaus Hartl (stilbuero.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/
jQuery.cookie=function(name,value,options){if(typeof value!="undefined"){options=options||{};if(value===null){value="";options.expires=-1;}var expires="";if(options.expires&&(typeof options.expires=="number"||options.expires.toUTCString)){var date;if(typeof options.expires=="number"){date=new Date();date.setTime(date.getTime()+(options.expires*24*60*60*1000));}else{date=options.expires;}expires="; expires="+date.toUTCString();}var path=options.path?"; path="+(options.path):"";var domain=options.domain?"; domain="+(options.domain):"";var secure=options.secure?"; secure":"";document.cookie=[name,"=",encodeURIComponent(value),expires,path,domain,secure].join("");}else{var cookieValue=null;if(document.cookie&&document.cookie!=""){var cookies=document.cookie.split(";");for(var i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+"=")){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}return cookieValue;}};

/*
* jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
*
*/
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});


jQuery(document).ready(function($)
{
    // Make the jQuery modal login redirect you back to the page you're currently on //
    $('#loginModal input[name="url"]').attr("value", window.location);
    // /Login redirect //

    // Modal Boxes //
    $('a[name="modal"]').on('click', function(event)
    {
        event.preventDefault();
        
        var target = $(this).attr('rel');
        
        // Set up the shadowing
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();
        $('#mask').css({'width': maskWidth, 'height': maskHeight});
        $('#mask').fadeIn(1000);    
        $('#mask').fadeTo("slow", 0.8);  
        
        // Position the actual modal
        var winH = $(window).height();
        var winW = $(window).width();
        $(target).css('top',  (winH / 2) - ($(target).height() / 2));
        $(target).css('left', (winW / 2) - ($(target).width() / 2));
        $(target).fadeIn(2000); 
    });
    
    $('.modalBox a[rel="closeModal"]').on('click', function(event)
    {
        event.preventDefault();
        $('#mask, .modalBox').hide();
    }); 
    
    $('#mask').on('click', function ()
    {
        $(this).hide();
        $('.modalBox').hide();
    }); 
    // /Modal Boxes //
});

        

/*
* fancyCollapses 1.0 - jSnippet by Jorge Lainfiesta
* Copyright 2010 Audentio Design
* http://audentio.com/
*
*/

expandables=null;(function(a){if(jQuery.cookie){jQuery(document).ready(function(){var b="fancyCollapses_collapsed_elmnts",g="|",h=",";var c=a.cookie(b);if(c!=""&&c!=null){var l=c.split(g);for(i=0;i<l.length;i++){var j=l[i].split(h);if(typeof j[0]!="undefined"&&j[0]!=""){if(j[2]=="m"){var d=a(j[1]).attr("src");if(typeof d!="undefined"){d=d.replace("collapse","collapse_collapsed");a(j[1]).attr("src",d);a(j[1]).css("cursor","pointer");var e=a(j[0]);var k=e.closest("table").attr("cellpadding");var f=e.closest("table").attr("cellspacing");e.closest("table").attr("cellspacing","0");e.addClass("fancyCollapses_modded").wrapInner("<tr><td style='padding: 0; margin: 0; width: 100%'><div><table width='100%' border='0' cellspacing='"+f+"' cellpadding='"+k+"'></table></div></td></tr>");e.children().children().children().hide()}}else{a(j[0]).hide()}a(j[1]).addClass("fancyCollapses_collapser_collapsed");a(j[0]).addClass("fancyCollapses_collapsed")}}}})}a.fn.fancyCollapses=function(b){var c=a.extend({},a.fn.fancyCollapses.defaults,b);return this.each(function(){var f="fancyCollapses_collapsed_elmnts",k="|",l=",";function s(o,v,x){var w=a.cookie(f);if(w==null){w=""}var u=w+k+o+l+v+l+x;a.cookie(f,u)}function t(o,u,w){var v=a.cookie(f);var x=k+o+l+u+l+w;v=v.replace(x,"");a.cookie(f,v)}var m=a(this);var e=a.meta?a.extend({},c,m.data()):c;var r="",p="",g,q,d=false;r=m.attr("id");if(e.collapser){p=e.collapser}if(!r){if(!e.collapser){var h=new Error();h.name="fancyCollapses error";h.message="No collapser specified";throw (h)}g=m}else{d=true;r="#"+r;g=a(r);if(e.isTable){p=r.replace("_e","_img");if(!g.hasClass("fancyCollapses_modded")){var n=g.closest("table").attr("cellpadding");var j=g.closest("table").attr("cellspacing");g.closest("table").attr("cellspacing","0");g.wrapInner("<tr><td style='padding: 0; margin: 0; width: 100%'><div><table width='100%' border='0' cellspacing='"+j+"' cellpadding='"+n+"'></table></div></td></tr>")}g=a(r).children().children().children()}else{if(!e.collapser){p=r+"_btn"}}}q=a(p);q.css("cursor","pointer");g.width("100%");q.click(function(){if(!q.hasClass("fancyCollapses_collapser_collapsed")){g.slideUp(e.speed,e.easing);if(e.isTable){var o=q.attr("src");o=o.replace("collapse","collapse_collapsed");q.attr("src",o)}q.addClass("fancyCollapses_collapser_collapsed");g.addClass("fancyCollapses_collapsed");if(d){if(jQuery.cookie){var u="n";if(e.isTable){u="m"}s(r,p,u)}}}else{g.slideDown(e.speed,e.easing);if(e.isTable){var o=q.attr("src");o=o.replace("_collapsed","");q.attr("src",o)}q.removeClass("fancyCollapses_collapser_collapsed");g.removeClass("fancyCollapses_collapsed");if(d){if(jQuery.cookie){var u="n";if(e.isTable){u="m"}t(r,p,u)}}}})})};a.fn.fancyCollapses.defaults={easing:"linear",speed:"normal",collapser:"",isTable:true}})(jQuery);

jQuery(document).ready(function($){       
	$(".tborder  tbody[id$='_e']").fancyCollapses({easing:"easeInOutQuart",speed:"normal"});

$(function(){
	var items = (Math.floor(Math.random() * ($('#testimonials li').length)));
	$('#testimonials li').hide().eq(items).show();
	
  function next(){
		$('#testimonials li:visible').delay(5000).fadeOut('slow',function(){
			$(this).appendTo('#testimonials ul');
			$('#testimonials li:first').fadeIn('slow',next);
    });
   }
  next();
});


            $(document).ready(function() {
                $('.nav-toggle').click(function(){
                    //get collapse content selector
                    var collapse_content_selector = $(this).attr('href');                    
                    
                    //make the collapse content to be shown or hide
                    var toggle_switch = $(this);
                    $(collapse_content_selector).toggle(function(){
                        if($(this).css('display')=='none'){
                            toggle_switch.html('login');//change the button label to be 'Show'
                        }else{
                            toggle_switch.html('Hide');//change the button label to be 'Hide'
                        }
                    });
                });
                
            });    

$('#toggle3').click(function() {
	$('.toggle3').toggle('slow');
	return false;
});

jQuery(document).ready(function() {

    jQuery(".fdes").hide();

    jQuery(".cattitle").live('mouseover mouseout', function(event) {

        var fdes = jQuery(this).parent().children('.fdes');

        var content = fdes.text();

        if (content !== "") {
            if (event.type == 'mouseover') {
                fdes.fadeIn('slow');
            } else {
                fdes.stop(true, true).fadeOut('slow');
            }
        }

    });

});

$(document).ready(function () {
    var setWidth = $.cookie("width");
    if (typeof setWidth !== "undefined" && setWidth == "85%") {
        $('#container,.wrap').width(setWidth); // 85% width set using cookie
    } else if (typeof setWidth !== "undefined" && setWidth == "960px") {
        $('#container,.wrap').width(setWidth); // 960px,1000px(for wrap) width set using cookie
    }
    $('#toggle-button').click(function () {
        var toggleWidth = $("#container").width() == 960 ? "85%" : "960px";

        $('#container, .wrap').animate({
            width: toggleWidth
        });
        $.cookie('width', toggleWidth);
    });
});  

$("#cp").click(function(){
		$("#cpwrap").slideToggle();
		return false;
	})

jQuery(document).ready(function($) {
    if ($(".headavatar img, .pbavatar img").attr("src") === "") {
        $(".headavatar img, .pbavatar img").attr("src", "images/ld/defaultavatar.png");
    }
});

$(window).scroll(function(event){
  
	var st = $(this).scrollTop();
	var parallax = '-'+st*0.575+'px';
  var FDParallax = -53-st*0.1925+'%';
  
  $('headr').css('transform','translateY('+parallax+')');
  $('headr').css('transform','translateX() translateY('+FDParallax+')');
  
});

$('.search-button').click(function(){$('#header_searchbar').toggle('slow');});
$('.pbop').click(function(){$('.pbopt').toggle('slow');});

$(function(){ // document ready
 
  if (!!$('.sticky').offset()) { // make sure ".sticky" element exists
 
    var stickyTop = $('.sticky').offset().top; // returns number 
 
    $(window).scroll(function(){ // scroll event
 
      var windowTop = $(window).scrollTop(); // returns number 
 
      if (stickyTop < windowTop){
        $('.sticky').css({ position: 'fixed', top: 40 });
      }
      else {
        $('.sticky').css({ position: 'static', top: 0 });
      }
 
    });
 
  }
 
});

jQuery(document).ready(function() {

    jQuery('a[href=#top]').click(function(){
        jQuery('html, body').animate({scrollTop:0}, 'slow');
        return false;
    });
});
});

