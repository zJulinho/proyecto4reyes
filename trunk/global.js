var f_page = "325816207506417";
var t_page = "ipbforumskins";

function add_commas(number) {
	if (number.length > 3) {
		var mod = number.length % 3;
		var output = (mod > 0 ? (number.substring(0,mod)) : '');
		for (i=0 ; i < Math.floor(number.length / 3); i++) {
		if ((mod == 0) && (i == 0)) {
		output += number.substring(mod+ 3 * i, mod + 3 * i + 3);
		} else {
			output+= ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
		}
	}
		return (output);
	} else {
		return number;
	}
}

$(document).ready(function() {

	$("#showAllThemes").click(function(){
		$("#showFeaturedThemes").removeClass("active");
		$("#allThemes").show();
		$("#featuredThemes").hide();
		$(this).addClass("active");
		return false;
	});
	
	$("#showFeaturedThemes").click(function(){
		$("#showAllThemes").removeClass("active");
		$("#featuredThemes").show();
		$("#allThemes").hide();
		$(this).addClass("active");
		return false;
	});

	$(".questions_list li div").hide();
	
	$(".questions_list li strong").click(function(){
		$(this).parent().find("div").slideToggle('fast');
	});
	
	$(".why").click(function(){
		$(".why_text").slideToggle();
		return false;
	});
	
	$('ul#filter a').click(function() {
		$(this).css('outline','none');
		$('ul#filter .current').parent().find("span").hide();
		$('ul#filter .current').removeClass('current');
		$(this).parent().addClass('current');
		$(this).parent().find("span").show();
		
		var filterVal = $(this).text().toLowerCase().replace(' ','-');
				
		if(filterVal == 'all') {
			$('ul#portfolio li.hidden').fadeIn('fast').removeClass('hidden');
		} else {
			
			$('ul#portfolio li').each(function() {
				if(!$(this).hasClass(filterVal)) {
					$(this).fadeOut('fast').addClass('hidden');
				} else {
					$(this).fadeIn('fast').removeClass('hidden');
				}
			});
		}
		
		return false;
	});
	
	// facebook followers
	$.getJSON('https://graph.facebook.com/'+f_page+'?callback=?', function(data) {
		var fb_count = data['likes'].toString();
		fb_count = add_commas(fb_count);
		$('#fb_count').html(fb_count);
	});
	
	// twitter followers
	$.getJSON('http://api.twitter.com/1/users/show.json?screen_name='+t_page+'&callback=?', function(data) {
		twit_count = data['followers_count'].toString();
		twit_count = add_commas(twit_count);
		// $('#twitter_count').html(twit_count);
	});
	
	// $("#tweet").miniTwitter({username: 'ipbforumskins', limit: 1});
	$("#tweet").html("New IPB theme released, <a href='http://www.ipbfocus.com/premade/dashboard/index.php'>Dashboard</a> which includes a neat vertical navigation panel, background changer and 'transparent' strips.");
	$("#twitter_count").html("292");

	$('#page_viewskin').mousemove(function(e){
	    var amountMovedX = (e.pageX * -1 / 30);
	    var amountMovedY = (e.pageY * -1 / 30);
	    $('.skinPageHero').css('background-position', amountMovedX + 'px ' + amountMovedY + 'px');
	});

});