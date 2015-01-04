/**
 * bcLib.js
 * 
 * For sitewide BC js libraries/functions
 */
bc.delay = (function () {
	var timer = 0;
	return function (callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
})();

//this function simply gets the window scroll position, works in all browsers
bc.getPageScroll = function () {
	var yScroll;
	if (self.pageYOffset) {
		yScroll = self.pageYOffset;
	} else if (document.documentElement && document.documentElement.scrollTop) {
		yScroll = document.documentElement.scrollTop;
	} else if (document.body) {
		yScroll = document.body.scrollTop;
	}
	return yScroll;
};

bc.getQueryParametersAsMap = function () {
	var qs, params, items, item, name, value, i;
	qs = (location.search.length > 0 ? location.search.substring(1) : "");
	params = {};
	items = qs.split("&");
	item = null;
	name = null;
	value = null;
	for (i = 0; i < items.length; i = i + 1) {
		try {
			item = items[i].split("=");
			name = decodeURIComponent(item[0]);
			value = decodeURIComponent(item[1]);
			params[name] = value;
		} catch (err) {
			//alert(err);
		}
	}
	return params;
};

// Shamelessly copied from Zakas, page 620. and then shamelessly ran through JSLint and tightened up
bc.readCookie = function (name) {
	var cookieName, cookieStart, cookieValue, cookieEnd;
	cookieName = encodeURIComponent(name) + "=";
	cookieStart = document.cookie.indexOf(cookieName);
	cookieValue = null;

	if (cookieStart > -1) {
		cookieEnd = document.cookie.indexOf(";", cookieStart);
		if (cookieEnd === -1) {
			cookieEnd = document.cookie.length;
		}
		cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
	}
	return cookieValue;
};

bc.writeCookie = function (name, value, daysToLive) {
	var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value) + "; path=/";
	if(daysToLive)	{
		var today = new Date();
		today.setDate(today.getDate()+daysToLive);
		cookieText = cookieText+'; expires=' +today.toGMTString();
	}
	document.cookie = cookieText;
};

bc.writeCookieWithDomain = function (name, value, domain) {
	var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value) + "; domain=" + domain + "; path=/";
	document.cookie = cookieText;
};

bc.deleteCookie = function (name) {
	var cookieText = encodeURIComponent(name) + '=blank; path=/; expires=' + new Date('2000-01-01').toGMTString();
	document.cookie = cookieText;
};

bc.deleteCookieWithDomain = function (name, domain) {
	var cookieText = encodeURIComponent(name) + '=blank; domain=' + domain + '; path=/; expires=' + new Date('2000-01-01').toGMTString();
	document.cookie = cookieText;
};

bc.urlIsSafe = function (url, countryDnsSuffix) {
	// Checks to be sure an url is safe to link to (no open redirects)
	var urlIsOk = url && (url.indexOf("@") === -1) && (url.match("^https?:.*" + countryDnsSuffix + ".*") !== null);
	return urlIsOk;
};

/**
 * Get the current media query view - one of "Small", "Medium", or "Large"
 * 
 * @returns {String} the view 
 */
(function ($) {
bc.getView = function() {
	
  var view = 'large'; //default (on non-redesigned pages)
  if (isIe7or8()) {
	  return view;
  }
  
  if (!$('#media-views').length) {
    $('body').prepend('<div id="media-views"><div id="large_view" class="hide-for-large"></div><div id="medium_view" class="hide-for-medium"></div><div id="small_view" class="hide-for-small"></div></div>');
  }

  if (!$('#small_view').is(':visible')) {
    view = 'small';
  }
  else if (!$('#medium_view').is(':visible')) {
    view = 'medium';
  }
  
  return view;
  

  // ----------------------------------------------
  // hoisted private functions
  // ----------------------------------------------
  function isIe7or8() {
    var ua = navigator.userAgent.toLowerCase();
    
    var isIe = !!ua.match(/msie/);
    
    var versions, version;
    if (isIe) {
      versions = ua.match(/msie ([0-9.]+)/);
      version = parseFloat(ua.match(/msie ([0-9.]+)/)[1]);
    }
    
    return (isIe && (version == 8 || version == 7));
  }
  
};
})(jQuery);
/**
 * Function to check whether it is IE 7
 */
bc.isIe7 = function() {
    var ua = navigator.userAgent.toLowerCase();
    
    var isIe = !!ua.match(/msie/);
    
    var versions, version;
    if (isIe) {
      versions = ua.match(/msie ([0-9.]+)/);
      version = parseFloat(ua.match(/msie ([0-9.]+)/)[1]);
    }
    
    return (isIe && version == 7);
}
/**
 * Function for Responsive features to tell if the user is on a small size screen (mobile device)
 * 
 * @returns true if on small screen
 */
bc.isSmallScreen = function() {
	return bc.getView() == 'small';
}
/**
 * Function for Responsive features to tell if the user is on a medium size screen (tablet)
 * 
 * @returns true if on medium screen
 */
bc.isMediumScreen = function() {
	return bc.getView() == 'medium';
}
/**
 * Function for Responsive features to tell if the user is on a large size screen (dektop)
 * 
 * @returns true if on desktop screen
 */
bc.isLargeScreen = function() {
	return bc.getView() == 'large';
}

//get scripts and place them on the page. Does not use JQuery for scripts that cannot be protected by document.ready
bc.getHeadScript = function(path, callback) {
    var script = document.createElement("script");
	var scriptParent = document.getElementsByTagName('script')[0].parentNode || document.documentElement;
	script.type = 'text/javascript';
	script.async = 'true';
	script.src = path;
	if(typeof callback === "function" )
	{		
		if(script.addEventListener) {
			script.addEventListener("load",callback,false);
		} else if(script.readyState) {
			script.onreadystatechange = callback;
		}
	}
	scriptParent.insertBefore(script, scriptParent.firstChild);
};
