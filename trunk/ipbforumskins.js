// Created by ipbforumskins.com

var $i = jQuery.noConflict();

jQuery(document).ready(function($){

	$i('a[href=#top], a[href=#ipboard_body]').click(function(){
		$i('html, body').animate({scrollTop:0}, 400);
        return false;
	});
	
	$i(".forum_name").hover(function() {
		$i(this).next(".forum_desc_pos").children(".forum_desc_con").stop()
		.animate({left: "0", opacity:1}, "fast")
		.css("display","block")
	}, function() {
		$i(this).next(".forum_desc_pos").children(".forum_desc_con").stop()
		.animate({left: "10", opacity: 0}, "fast", function(){
			$i(this).hide();
		})
	});
	
	$i('#topicViewBasic').click(function(){
		$i(this).addClass("active");
		$i('#topicViewRegular').removeClass("active");
		$i("#customize_topic").addClass("basicTopicView");
		$.cookie('ctv','basic',{ expires: 365, path: '/'});
		return false;
	});
	
	$i('#topicViewRegular').click(function(){
		$i(this).addClass("active");
		$i('#topicViewBasic').removeClass("active");
		$i("#customize_topic").removeClass("basicTopicView");
		$.cookie('ctv',null,{ expires: -1, path: '/'});
		return false;
	});
	
	if ( ($.cookie('ctv') != null))	{
		$i("#customize_topic").addClass("basicTopicView");
		$i("#topicViewBasic").addClass("active");
	}
	else{
		$i("#topicViewRegular").addClass("active");
	}
	
	$i("#sideNav h4 .sideHide").click(function(){
		var sideParent = $i(this).parent();
		$i(sideParent).addClass("collapsed");
		$i(sideParent).next("div.toggleContent").slideUp();
		var sideId = $i(sideParent).attr("id");
		$.cookie(sideId,'col',{ expires: 365, path: '/'});
	});
	
	$i("#sideNav h4 .sideShow").click(function(){
		var sideParent = $i(this).parent();
		$i(sideParent).removeClass("collapsed");
		$i(sideParent).next("div.toggleContent").slideDown();
		var sideId = $i(sideParent).attr("id");
		$.cookie(sideId,null,{ expires: -1, path: '/'});
	});

	if ( ($.cookie('togNav') != null))	{
		$i("h4#togNav").addClass("collapsed");
		$i("h4#togNav").next("div.toggleContent").hide();
	}
	
	if ( ($.cookie('togMod') != null))	{
		$i("h4#togMod").addClass("collapsed");
		$i("h4#togMod").next("div.toggleContent").hide();
	}
	
	if ( ($.cookie('togSocial') != null))	{
		$i("h4#togSocial").addClass("collapsed");
		$i("h4#togSocial").next("div.toggleContent").hide();
	}
	
	var sideNavHeight = $i("#sideNav").height();
	$i("#mainContent").css("min-height", sideNavHeight);
	
	$i("#toggleBackgroundPicker").click(function(){
		$i("#toggle_background").slideToggle();
	});

});