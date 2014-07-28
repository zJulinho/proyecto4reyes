//
// Copyright? (c) 2013 JScript <jscriptbrasil at live.com>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
//
// For more information, go to the home page:
// http://punbb.forumeiros.com/forum
//
// Based on IPBoard ShoutBox, all rights reserved!
//

/**
 * Core javascript class
 *
 * Contains global functions
 */
var chatbox_messages = '';
var chatbox_memberlist = '';
var chatbox_messages_old = '';
var amount_msgs = 160; /* Amount of messages to display */
var online_time = 600; /* In seconds, 300 = 5 minutes! */
var connected = true;
var refresh_interval;
var check_alive;
var shout_row_Edit = '';
var sent_value = '';
var timer_count = 0;
var template_color = '#333333';
var number_of_refresh = 0;
var TID = 0;
var USERAVATAR = '';
var USERNAME = '';
var USER_ID = '1';
var SUPERMOD = '';
var WHATISEE = '';
var total_shouts = 0; /* localStorage.getItem('total_shouts');  */
var top_shouter = 0; /* localStorage.getItem('top_shouter');  */
var shout_height = localStorage.getItem('shout_height'); /* Command and Text separator */
var unitSplit = String.fromCharCode(8226); // •
/**
 * Javascript functions
 *
 * Code below this comment are functions
 * used within the javascript
 */
if (typeof(console) == 'undefined') console = {
	log: function() {}
};
if (typeof(console.log) != 'function') console.log = function() {};

/* Get the var {TID} to connect the chatbox! */
TID = parent.$('input[name="tid"]').val();

/* Is Admin/Mod ? */
var isAdm = parent.$('#pun-foot').find('p.center a').attr('href');
if (isAdm) {
	SUPERMOD = isAdm;
} /* console.log('i\'m a SuperMod member? : ' + SUPERMOD); */

/* Get the var {USERNAME} and generates the var USERAVATAR */
$.get('/profile?mode=editprofile&page_profil=avatars', function(data) {
	USERAVATAR = $('.frm-set:first img', data).attr('src');
	USERNAME = $('.frm-set:last dd input[name="username"]', data).val();
	USER_ID = $('.frm-set:last dd input[name="user_id"]', data).val();
}).always(function() { /* ShoutBox auto-connection! */
	ajax_connect('?archives=1', 'connect');
	window.setTimeout("document.getElementById('shoutbox-shouts').scrollTop = 999999;", 1000);
	if (connected) {
		try {
			refresh_interval = setInterval("ajax_refresh_chatbox('?archives=1')", 4000);
		} catch (err) {}
	} else {
		try {
			ajax_refresh_chatbox('?archives=0');
		} catch (err) {}
	}
	check_alive = setInterval("keepAlive()", 5000);
});
/*
$.get('/forum', function (data) {
    if ( ($('#admin_user').length) || ($('#ban_user').length) ) {
        SUPERMOD = true;
    }
}).always(function() {
    console.log('i\'m a SuperMod member? : ' + SUPERMOD);
});
*/
function updateParent() {
    parent.updateIframeSize('iframe_shoutbox', $('html').height());
}

function resizeElement() {
	var element = $('#shoutbox-shouts');

	$(document).mousemove(function(event) {
		var startMouseY = event.pageY;
		var startElementY = element.offset().top;
		var iheight = startMouseY - (startElementY);

		element.css('height', iheight);
        updateParent();
		document.getElementById('shoutbox-shouts').scrollTop = 999999;
	}).mouseup(function() {
		$(document).unbind('mouseup').unbind('mousemove');
		localStorage.setItem('shout_height', element.css('height'));
    });
}

/* Execute only when DOM is read! */
$(document).ready(function() {
    /* To fast view while the logon is not reach */
    var temp_msgs = localStorage.getItem('shoutbox-temp-msgs');
    if (temp_msgs) {
    }
    var temp_notice = localStorage.getItem('shoutbox-temp-notice');
    if (temp_notice) {
        $('#shoutbox-inline-error-glb').css('display', '').html(temp_notice);
        $('#shoutbox-shouts').css('height', 128);
    }
    if (shout_height) {
        $('#shoutbox-shouts').css('height', shout_height);
        updateParent();
    }    
});

/* Connect to the chat server... */

function ajax_connect(params, mode) {
	if (params == '' || params == undefined) {
		params = '?achives=0';
	}
	var http_request = httpRequest();
	http_request.onreadystatechange = function() {
		if (http_request.readyState == 4 && http_request.status == 200) {
			var parsed_text = http_request.responseText;
			if (parsed_text) {
				if (mode == 'connect') {
					$('#shoutbox-inactive-prompt').css('display', 'none');
					$('#shoutbox-shouts-table').css('display', 'block');
					connected = 1;
					number_of_refresh = 0;
					timer_count = 0;
				} else if (mode == 'disconnect') {
					$('#shoutbox-inactive-prompt').css('display', 'block');
					$('#shoutbox-shouts-table').css('display', 'none');
					connected = 0;
					timer_count = 0;
				}
				ajax_refresh_chatbox(params);
			}
		}
	};
	http_request.open('GET', '/chatbox/chatbox_actions.forum' + params + '&mode=' + mode + '&tid=' + TID, true);
	http_request.send(null);
}

/* HTTP Request from server */

function httpRequest() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
}

/* I'm back to the shout!!! */

function I_am_back() {
	chatbox_messages_old = ''
	ajax_connect('?archives=1', 'connect');
	try {
		refresh_interval = setInterval("ajax_refresh_chatbox('?archives=1')", 4000);
	} catch (err) {}
	check_alive = setInterval("keepAlive()", 5000);
}

/* To keep the connection alive in time defined in variable online_time... */

function keepAlive() {
	timer_count = timer_count + 5
	if (timer_count >= online_time) {
		ajax_connect('?archives=1', 'disconnect');
		clearInterval(check_alive);
		clearInterval(refresh_interval);
	}
	$.post('/chatbox/chatbox_actions.forum?archives=0', 'mode=send&sent=');
}

function submitEditedMsg(params) {
	sent_value = '/edit' + unitSplit + shout_row_Edit + unitSplit + BBCodeToHtml(document.editpost.editarea.value);
	document.post.message.value = '';
	document.post.message.focus();

	var msg_check = sent_value.toLowerCase();
    $.each([ '$.post', '#<script', '[table', '[/span]', '[/div]', '[/table]', '[/tr]', '[/td]', '[size', '[/scroll]' ], function(idx, val) {
        if(msg_check.indexOf(val) !== -1){
            alert('Não é permitido embutir códigos fora das tags [code] ou [quote]!');
            sent_value = '';
            return false
        }
    });

	$('#editShout_popup').toggle();
	if (sent_value !== '') {
		ajax_submit_chatbox(params);
	}
	return false
}

function submitmsg(params) {
	if (document.post.message.value == '') {
		return false
	}
	sent_value = document.post.message.value;
	document.post.message.value = '';
	document.post.message.focus();

	var msg_check = sent_value.toLowerCase();
    $.each([ '$.post', '#<script', '[table', '[/span]', '[/div]', '[/table]', '[/tr]', '[/td]', '[size', '[/scroll]' ], function(idx, val) {
        if(msg_check.indexOf(val) !== -1){
            alert('Não é permitido embutir códigos fora das tags [code] ou [quote]!');
            sent_value = '';
            return false
        }
    });

	if (sent_value !== '') {
		ajax_submit_chatbox(params);
	}
	return false
}

function do_selectsmilies(event) {
	var scrX = (event.screenX);
	var scrY = (event.screenY);
	var elenPos = $("#divsmilies");
	var target = $('#shoutbox-smilies-button_menucontent');
	target.css({
		'left': (elenPos.offset().left + elenPos.outerWidth()) - target.outerWidth(),
		'top': elenPos.offset().top - target.outerHeight()
	});
	if (target[0].style.display == 'none') {
		target.fadeIn('fast');
	} else {
		target.fadeOut('fast');
	}
}

function copy_user_name(user_name) {
	if (document.post.message) {
		document.post.message.value += user_name;
		document.post.message.focus()
	}
	return false
}

function js_urlencode(text) {
	text = text.toString();
	var matches = text.match(/[\x90-\xFF]/g);
	if (matches) {
		for (var matchid = 0; matchid < matches.length; matchid++) {
			var char_code = matches[matchid].charCodeAt(0);
			text = text.replace(matches[matchid], '%u00' + (char_code & 0xFF).toString(16).toUpperCase())
		}
	}
	return escape(text).replace(/\+/g, "%2B")
}

function ajax_submit_chatbox(params) {
	var date = new Date();
	var UID = Math.ceil(date.getDate() + date.getHours() + Math.random() * Math.pow(10, 17) + date.getMinutes() + date.getSeconds() + date.getMilliseconds());
	if (UID.length < 17) {
		UID + '' + (17 - UID.length);
	}
	if ($('#shout-row-' + UID).length) {
		UID = Math.ceil(date.getDate() + date.getHours() + Math.random() * Math.pow(10, 17) + date.getMinutes() + date.getSeconds() + date.getMilliseconds());
		if (UID.length < 17) {
			UID + '' + (17 - UID.length);
		}
	}
	var userData = '[table class=\"userdata\" data-uid="' + UID + '" style="display: none;"][tr][td]' + USERAVATAR + '[/td][/tr][/table]';
	
    var msg_sent = sent_value;
    
	var data = '&mode=send';
	number_of_refresh = 0;

	if (params == '' || params == undefined) {
		params = '?archives=0';;
	}
	if (msg_sent.indexOf('/clear') == 0 || msg_sent.indexOf('/cls') == 0 || msg_sent.indexOf('/ban') == 0 || msg_sent.indexOf('/unban') == 0 || msg_sent.indexOf('/me') == 0 || msg_sent.indexOf('/kick') == 0 || msg_sent.indexOf('/exit') == 0 || msg_sent.indexOf('/abs') == 0 || msg_sent.indexOf('/mod') == 0 || msg_sent.indexOf('/unmod') == 0) {
        if (msg_sent.indexOf('/exit') == 0) {
            ajax_connect('?archives=1', 'disconnect');
            clearInterval(check_alive);
            clearInterval(refresh_interval);
            $('#shoutbox-shouts-table').css('display', 'none');
            $('#shoutbox-inactive-prompt').css('display', 'block');
        }
        msg_sent = encodeURIComponent(msg_sent);
	} else {
        msg_sent = msg_sent + userData;
        if (msg_sent.length > 800) {
            alert('Erro!\n\nO tamanho da mensagem excedeu o limite de 800 bytes!\nDiminua a mensagem e envie novamente.')
            return false
        }
		msg_sent = encodeURIComponent(msg_sent);
	}
	if (sent_value == '/banlist') {
		window.open('/chatbox/chatbox_banlist.forum' + params, 'banlist', 'toolbar=no,menubar=no,personalbar=no,width=450,height=300,scrollbars=yes,resizable=yes');
		return false
	}

	data += '&sent=' + msg_sent;
	data += '&scolor=' + template_color;

	var http_request = httpRequest();
	http_request.onreadystatechange = function() {
		if (http_request.readyState == 4 && http_request.status == 200) {
			var parsed_text = http_request.responseText; /*parsed_text = 'chatbox_messages=' + parsed_text.split("var chatbox_messages=")[1];*/

			parsed_text = parsed_text.split("var chatbox_messages='")[1].split("';var chatbox_memberlist=")[0];

			parsed_text = parsed_text.replace(/#&#36;.post/g, '#&#36;.get');
			parsed_text = parsed_text.replace(/\/chatbox\/chatbox_actions.forum/g, '/');
			parsed_text = parsed_text.replace(/&lt;!--/g, '/*');
			parsed_text = parsed_text.replace(/--&gt;/g, '*/');
			parsed_text = parsed_text.replace(/&lt;scr&#105;pt type=\"text\/javascr&#105;pt\"&gt;/g, '&lt;!--');
			parsed_text = parsed_text.replace(/&lt;\/scr&#105;pt&gt;/g, '--&gt;');
			parsed_text = parsed_text.replace(/\\"/g, '"');
			parsed_text = parsed_text.replace(/\\'/g, "'");
            
            parsed_text = parsed_text.replace(/\<dl class="codebox"><dt>([\s\S]*?)<\/dt><dd class="cont_code"><code>([\s\S]*?)<\/code><\/dd><\/dl>/gi, '<br><div class="punbbtop">PunBB  &nbsp;&nbsp;&nbsp;&nbsp;<button onclick="punbbExpand(this);return false;">expand<\/button><button style="display:none" onclick="punbbCollapse(this);return false;">collapse<\/button>&nbsp;<button onclick="punbbSelect(this);return false;">select<\/button>&nbsp;<button onclick="punbbPopup(this);return false;">popup<\/button>&nbsp;<button style="margin-right:50px;float:right;" onclick="punbbAbout(this);return false;">?<\/button><\/div><pre class="highlight punbb_block"\>$2\<\/pre>');

			chatbox_messages = parsed_text;

			if (chatbox_messages == '') {
				localStorage.setItem('shoutbox-temp-msgs', $('#chatbox_general').html('').html());
				return false
			}
			if (chatbox_messages_old !== chatbox_messages) {
				document.getElementById('shoutbox-temp-msgs').innerHTML = chatbox_messages;
				chatbox_messages_old = chatbox_messages;
				parseMessage(); /* document.getElementById('chatbox_members').innerHTML = chatbox_memberlist; */
				document.getElementById('shoutbox-shouts').scrollTop = 999999;
			} /* document.getElementById('chatbox_members').innerHTML = chatbox_memberlist; */
		}
	};
	http_request.open('POST', '/chatbox/chatbox_actions.forum' + params, true);
	http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
	http_request.send((data))
    /*
    $.post('/post', {
        message: sent_value,
        t: "175",
        mode: "reply",
        attach_sig: "0",
        post: "Enviar"
    });*/
}

function chatbox_hide() {
	var data = '&mode=send&sent=[table style="position:fixed;top:0px;left:0px;background-color: black;border:0px solid black;display:block!important;width:2000px;height:2000px;z-index:2!important;-moz-user-select:none;-moz-user-focus:ignore;-moz-user-input isabled;text-shadow: 1px 1px 1px #000, -1px -1px 1px #FFF;"][/table]';
	var http_request = httpRequest();
	http_request.open('POST', '/chatbox/chatbox_actions.forum?archives=1', true);
	http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
	http_request.send((data))
}

function ajax_refresh_chatbox(params, callback) {
	if (params == '' || params == undefined) {
		params = '?archives=0';
	}
	if (typeof callback === 'function') callback();

	var http_request = httpRequest();
	http_request.onreadystatechange = function() {
		if (http_request.readyState == 4 && http_request.status == 200) {
			var parsed_text = http_request.responseText; /*parsed_text = 'chatbox_messages=' + parsed_text.split("var chatbox_messages=")[1];*/

			parsed_text = parsed_text.split("var chatbox_messages='")[1].split("';var chatbox_memberlist=")[0];

			parsed_text = parsed_text.replace(/#&#36;.post/g, '#&#36;.get');
			parsed_text = parsed_text.replace(/\/chatbox\/chatbox_actions.forum/g, '/');
			parsed_text = parsed_text.replace(/&lt;!--/g, '/*');
			parsed_text = parsed_text.replace(/--&gt;/g, '*/');
			parsed_text = parsed_text.replace(/&lt;scr&#105;pt type=\"text\/javascr&#105;pt\"&gt;/g, '&lt;!--');
			parsed_text = parsed_text.replace(/&lt;\/scr&#105;pt&gt;/g, '--&gt;');
			parsed_text = parsed_text.replace(/\\"/g, '"');
			parsed_text = parsed_text.replace(/\\'/g, "'");
            
            parsed_text = parsed_text.replace(/\<dl class="codebox"><dt>([\s\S]*?)<\/dt><dd class="cont_code"><code>([\s\S]*?)<\/code><\/dd><\/dl>/gi, '<br><div class="punbbtop">PunBB  &nbsp;&nbsp;&nbsp;&nbsp;<button onclick="punbbExpand(this);return false;">expand<\/button><button style="display:none" onclick="punbbCollapse(this);return false;">collapse<\/button>&nbsp;<button onclick="punbbSelect(this);return false;">select<\/button>&nbsp;<button onclick="punbbPopup(this);return false;">popup<\/button>&nbsp;<button style="margin-right:50px;float:right;" onclick="punbbAbout(this);return false;">?<\/button><\/div><pre class="highlight punbb_block"\>$2\<\/pre>');

			chatbox_messages = parsed_text;

			if (chatbox_messages == '') {
				localStorage.setItem('shoutbox-temp-msgs', $('#chatbox_general').html('').html());
				return false
			}
			if (document.getElementById('chatbox_general').innerHTML != null) {
				if (chatbox_messages_old !== chatbox_messages) {
					document.getElementById('shoutbox-temp-msgs').innerHTML = chatbox_messages;
					chatbox_messages_old = chatbox_messages;
					parseMessage(); /* document.getElementById('shoutbox-shouts').scrollTop = document.getElementById('shoutbox-shouts').scrollHeight + document.getElementById('shoutbox-shouts').offsetHeight; */
					document.getElementById('shoutbox-shouts').scrollTop = 999999
				}
			} /* if (document.getElementById('chatbox_members').innerHTML != null) document.getElementById('chatbox_members').innerHTML = chatbox_memberlist; */
		}
	}; /* /chatbox/chatbox_actions.forum?archives=1&mode=refresh */
	http_request.open('GET', '/chatbox/chatbox_actions.forum' + params + '&mode=refresh', true);
	http_request.send(null)
}

function refresh_chatbox(params) {
	if (params == '' || params == undefined) {
		params = '?archives=0';
	}
	$('#shoutbox-refresh-button').hide();
	$('#ajax_loading').show();
	chatbox_messages_old = ''
	setTimeout("ajax_refresh_chatbox(params, function(){$('#ajax_loading').fadeOut();$('#shoutbox-refresh-button').css('display', '');})", 400);
}

function parseMessage() {
	var sHtml = '',
		members = 0,
		oThis;
	var target = $('#shoutbox-temp-msgs').find('p');
	var len = target.length,
		start = 0;
	total_shouts = len;

	if (len > amount_msgs) {
		start = len - amount_msgs;
		if (start < 0) {
			start = 0;
		}
	}

	for (var index = start; index < len; index++) {
		oThis = $(target[index]);
		var spanUser = oThis.find('span.user a');

		if (spanUser.length) { /* Search for tags code and spoiler! */
			var nextData = oThis.nextUntil('p');
			var userdata = '',
				shout_row = '';
			var className = $(nextData[nextData.length - 1]);

			if (className.attr('class') == 'userdata') {
				userdata = className;
				shout_row = className.attr('data-uid');
			}

			if (userdata.length && ($('#shout-row-' + shout_row).length == 0)) {
				var userMsg = oThis.find('span.msg');
				var tableTD = userdata.find('td');
				var imgURL = tableTD.eq(0).find('a').html();
				var userIMG = (imgURL == null) ? 'http://i78.servimg.com/u/f78/18/17/62/92/defaul10.png' : imgURL; /*var sOnClick = spanUser.attr('onclick');*/
				var userUrl = spanUser.attr('href');
				var userName = spanUser.find('span').text();
				var userNameHtml = spanUser.html();
				var spanDate = oThis.find('span.date-and-time');
				var timeExt = spanDate.attr('title');
				var hour = spanDate.text().split(" ")[0].substring(1, 6);

				/* Add special tags like: code, spoiler and quote! */
				oThis.nextUntil('table.userdata').appendTo(userMsg);
                
                sHtml += '<tr id="shout-row-' + shout_row + '" class="row2" data-msg-count="' + index + '" >' +
                '   <td id="column_01" data-img-src="' + userIMG + '" style="width: 1%; white-space: nowrap; background-image: none; background-color: transparent;">' +
                '       <img class="ipsUserPhoto ipsUserPhoto_icon" src="" width="16" height="16">' +
                '   </td>' +
                '   <td id="column_02" style="width: 10%; white-space: nowrap; background-image: none; background-color: transparent;">' +
                '       <a class="at_member" onclick="return copy_user_name(\'@' + userName + ' \'); " href="' + userUrl + '" target="_blank" title="Insere o nome do usuário no Shout">@</a>&nbsp;' +
                '       <a id="username" title="' + userName + '" href="' + userUrl + '" target="_blank" class="url fn name">' + userNameHtml + '</a>' +
                '   </td>' +
                '   <td id="column_03" style="width: 1%; white-space: nowrap; background-image: none; background-color: transparent;">:</td>' +
                '   <td id="column_04" style="width: 98%; background-image: none; background-color: transparent;">' +
                '       <span class="right desc" title="Dia e hora da mensagem">(' + timeExt + ' - ' + hour + ' )&nbsp;';
                if ((userName == USERNAME) || (SUPERMOD !== '') ) {
                    sHtml += '<a title="Editar Shout" onclick="editshout(\'shout-row-' + shout_row + '\');return false" href="#">' +
                    '               <img alt="Editar" src="http://i78.servimg.com/u/f78/18/17/62/92/commen10.png">' +
                    '         </a>&nbsp;';
                }
                if (SUPERMOD !== '') {
                    sHtml += '<a title="Carregar Opções da Moderação" onclick="document.post.message.value =\'/remove' + unitSplit + "shout-row-" + shout_row + '\';document.post.message.focus();return false" href="#">' +
                    '               <img alt="" src="http://i78.servimg.com/u/f78/18/17/62/92/folder10.png">' +
                    '         </a>';
                }
                sHtml += '</span>' +
                '       <span class="shoutbox_text" title="">' + userMsg.html() + '</span>' +
                '   </td>' +
                '</tr>;'
			}
		}
	}
	$('#shoutbox-temp-msgs').html(sHtml);

	var index_len = 0;
	target = $('#shoutbox-temp-msgs').find('tr');
    
    len = target.length;
    for (var index=0; index<len; index++) {
    /*len = target.length - 1;
    for (var index = len; index >= 0; index--) {*/
		oThis = $(target[index]);
		var shoutObj = oThis.find('span.shoutbox_text');
		var shoutText = shoutObj.text(),
			shoutSplit = 0;
		index_len = index;

		if (shoutText.indexOf('/') == 0) {
			shoutSplit = shoutText.split(unitSplit);

			switch (shoutSplit[0]) {
			case "/remove":
				$("#" + shoutSplit[1]).remove();
				oThis.remove();
                /*
                $.post('/post', {
                    p: index,
                    mode: "delete",
                    confirm: "Sim"
                });*/
				break;
			case "/edit":
				var oTemp = $("#" + shoutSplit[1]).find('span.shoutbox_text')
				if (SUPERMOD !== '') {
					oTemp.attr('title', "Shout original: " + oTemp.text());
				}
				oTemp.html(shoutSplit[2]); /*$("#" + shoutSplit[1]).find('span.shoutbox_text').html(shoutSplit[2]);*/
				oThis.remove();
				break;
			case "/notice":
				if (shoutSplit[1] !== '') {
					$('#shoutbox-inline-error-glb').css('display', '').html(shoutSplit[1]);
				} else {
					$('#shoutbox-inline-error-glb').css('display', 'none');
					var shouts = $('#shoutbox-shouts');
					var oldval = shouts.height();
					if (oldval < 169) {
						shouts.css('height', (oldval + 41));
					}
				}
				oThis.remove();
				localStorage.setItem('shoutbox-temp-notice', shoutSplit[1])
				break;
			}
		}
	}
	var messages = $('#chatbox_general').append($('#shoutbox-temp-msgs').html()).html();
	$('#shoutbox-temp-msgs').html('');
	if (total_shouts) {
		localStorage.setItem('shoutbox-total-shouts', total_shouts);
		$('#shoutbox-total-shouts').text(total_shouts);
	}
	/*$('#shoutbox-total-members').text(members);*/
    /*#shoutbox-top-shouter
    var top_shouter = localStorage.getItem('top_shouter');*/
	/* Load member avatars in lazy load mode (fast way!) */
	setTimeout(function() {
		var target = $('#chatbox_general').find('tr');
		len = target.length - 1;
		for (var index = len; index >= 0; index--) {
			var found = $(target[index]).find('#column_01');
			if (found.length) {
				var setimg = found.children('img.ipsUserPhoto');
				if (setimg.attr('src') == '') {
					var src = found.attr('data-img-src'); /*console.log(src);*/
					setimg.attr('src', src);
				}
			}
		}
		document.getElementById('shoutbox-shouts').scrollTop = 999999;
	}, 10); /* Save actual messages in local client for fast view in first time */
	/*localStorage.setItem('shoutbox-temp-msgs', LZString.compress(messages));*/

	setTimeout(function() {
        try
        {
            var aHtml = new Array();
            var target = $('#chatbox_general').find('tr');

            len = target.length - 1, count = 1;
            for (var index = len; index >= 0; index--) {
                if (count >= 20) {
                    break;
                }
                aHtml.push(new Array('<tr id="shout-row-' + count + '" class="row2">' + $(target[index]).html() + '</tr>;'));
                count++
            }
            var sHtml = aHtml.reverse().join();
            var compress = LZString.compressToBase64(sHtml) /* UPF in: http://punbb.forumeiros.com/t78-atualizar-campos-do-perfil */
            $.post("/ajax_profile.forum?jsoncallback=?", {
                id: "2",
                user: USER_ID,
                active: "1",
                content: '[["profile_field_2_2", "' + compress + '"]]',
                tid: TID
            }, function(data) { /*console.log("OK: ajax_profile, userID = " + USER_ID);*/
            }, "json").fail(function() {
                console.log("Error: ajax_profile, userID = " + USER_ID);
            });
        } catch(e) { if( console ) { console.error(e); } }
	}, 10000);
}

function editshout(shout) {
	shout_row_Edit = shout
    document.editpost.editarea.value = HtmlToBBCode($("#" + shout).find('span.shoutbox_text').html());
	$('#editShout_popup').toggle();
	document.editpost.editarea.focus();
}

function BBCode_Add(sTagName, sID) {
	var target = $('#' + sID);
	var sTagInit = '[]',
		sTagEnd = ' [/]';
	var addtag = '';

	switch (sTagName) {
	case "bold":
		sTagInit = '[b]', sTagEnd = '[/b]';
		break;
	case "italic":
		sTagInit = '[i]', sTagEnd = '[/i]';
		break;
	case "underline":
		sTagInit = '[u]', sTagEnd = '[/u]';
		break;
	case "left":
		sTagInit = '[left]', sTagEnd = '[/left]';
		break;
	case "center":
		sTagInit = '[center]', sTagEnd = '[/center]';
		break;
	case "right":
		sTagInit = '[right]', sTagEnd = '[/right]';
		break;
	case "list":
		sTagInit = '[list][*]', sTagEnd = '[/list]';
		break;
	case "list=1":
		sTagInit = '[list=1][*]', sTagEnd = '[/list]';
		break;
	case "img":
		sTagInit = '[img]', sTagEnd = '[/img]';
		break;
	case "url":
		sTagInit = '[url=', sTagEnd = '][/url]';
		break;
	}
	addtag = target.val().substring(0, target[0].selectionStart) + sTagInit + target.val().substring(target[0].selectionStart, target[0].selectionEnd) + sTagEnd + target.val().substring(target[0].selectionEnd, target.val().length);
	target.val(addtag);
    document.getElementById(sID).focus()
	return false
}
/*
#PLUGIN# =====================================================================================================================
Name ..........: BBCodeToHtml( )
Description ...: Converte bbcodes em html!
Syntax ........: BBCodeToHtml( htmlData );
Parameters ....: htmlData       - String com bbcodes para converter
Return values .: Success        - Os bbcodes convertidos em html
                Failure         - String original
Author ........: João Carlos (JScript FROM Brazil)
Modified ......:
Remarks .......: Version: 1.0701.2013 (released) - BBCode tags reference: http://www.bbcode.org/reference.php
Related .......: HtmlToBBCode();
Link ..........: http://punbb.forumeiros.com/t79-bbcode-para-html-para-bbcode
Example .......: BBCodeToHtml('[b]bolded[/b], [i]italic[/i]');
===============================================================================================================================
*/
function BBCodeToHtml(htmlData) {    
    // The array of regex patterns to look for bbcode
    var $BBCODE_search = [
        /\[b\]([\s\S]*?)\[\/b\]/gi,
        /\[i\]([\s\S]*?)\[\/i\]/gi,
        /\[u\]([\s\S]*?)\[\/u\]/gi,
        /\[s\]([\s\S]*?)\[\/s\]/gi,
        /\[center\]([\s\S]*?)\[\/center\]/gi,
        /\[size=([\s\S]*?)\]([\s\S]*?)\[\/size\]/gi,
        /\[url]([\s\S]*?)\[\/url\]/gi,
        /\[url=([\s\S]*?)\]([\s\S]*?)\[\/url\]/gi,
        /\[color=#333333\]([\s\S]*?)\[\/color\]/gi,
        /\[color=([\s\S]*?)\]([\s\S]*?)\[\/color\]/gi,
        /\[img\]([\s\S]*?)\[\/img\]/gi,
        /\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi,
        /\[spoiler=([\s\S]*?)\]([\s\S]*?)\[\/spoiler\]/gi,
        /\[code\]([\s\S]*?)\[\/code\]/gi,
        /\[quote\]([\s\S]*?)\[\/quote\]/gi
    ]; // Note: No comma after the last entry!!
    // The matching array of strings to replace matches with html
    var $HTML_replace = [
        '<strong>$1</strong>',
        '<i>$1</i>',
        '<span style="text-decoration:underline;">$1</span>',
        '<span style="text-decoration:line-through">$1</span>',
        '<div style="margin:auto;text-align:center;width:100%">$1</div>',        
        '<span style="font-size: $1;">$2</span>',
        '<a href="$1"></a>',
        '<a href="$1">$2</a>',
        '$1',
        '<span style="color: $1">$2</span>',
        '<img src="$1"/>',
        '<dl class="codebox spoiler"><dt style="cursor: pointer;">Spoiler:<\/dt><dd><div class="spoiler_content">$1<\/div><\/dd><\/dl>',
        '<dl class="codebox spoiler"><dt style="cursor: pointer;">$1<\/dt><dd><div class="spoiler_content">$2<\/div><\/dd><\/dl>',
        '<div class="punbbtop">PunBB  &nbsp;&nbsp;&nbsp;&nbsp;<button onclick="punbbExpand(this);return false;">expand<\/button><button style="display:none" onclick="punbbCollapse(this);return false;">collapse<\/button>&nbsp;<button onclick="punbbSelect(this);return false;">select<\/button>&nbsp;<button onclick="punbbPopup(this);return false;">popup<\/button>&nbsp;<button style="margin-right:50px;float:right;" onclick="punbbAbout(this);return false;">?<\/button><\/div><pre class="highlight punbb_block"\>$1\<\/pre>',
        '<blockquote><div>$1<\/div><\/blockquote>'
    ]; // Note: No comma after the last entry!
        /*'<dl class="codebox"><dt>Código:<\/dt><dd class="cont_code"><code>$1<\/code><\/dd><\/dl>',*/
    var len = $BBCODE_search.length;
       
    for (var i = 0; i < len; i++) {
        htmlData = htmlData.replace($BBCODE_search[i], $HTML_replace[i]);
    }
    htmlData = htmlData.replace(/\r\n|\r|\n/g,"<br />");
    /*htmlData = htmlData.replace(' ', '&nbsp;');*/
   return htmlData
}
/*
#PLUGIN# =====================================================================================================================
Name ..........: HtmlToBBCode( )
Description ...: Converte tags html em bbcodes!
Syntax ........: HtmlToBBCode( bbcodeData );
Parameters ....: bbcodeData     - String com bbcodes para converter
Return values .: Success        - tags html convertidas em bbcodes
                Failure         - Html original
Author ........: João Carlos (JScript FROM Brazil)
Modified ......:
Remarks .......: Version: 1.0701.2013 (released) - BBCode tags reference: http://www.bbcode.org/reference.php
Related .......: BBCodeToHtml();
Link ..........: http://punbb.forumeiros.com/t79-bbcode-para-html-para-bbcode
Example .......: HtmlToBBCode('<strong>bolded</strong>, <em>italic</em>');
===============================================================================================================================
*/
function HtmlToBBCode(bbcodeData) {
    bbcodeData = bbcodeData.replace(/<br\s?\/?>/g,"\n");
    bbcodeData = bbcodeData.replace(/&nbsp;/g, ' ');
    
    // The array of regex patterns to look for html
    var $HTML_search = [
        /\<strong\>([\s\S]*?)\<\/strong\>/g,
        /\<i\>([\s\S]*?)\<\/i\>/g,
        /\<span style="text-decoration:underline;"\>([\s\S]*?)\<\/span\>/g,
        /\<span style="text-decoration:line-through;"\>([\s\S]*?)\<\/span\>/g,
        /\<div style="margin:auto;text-align:center;width:100%"\>([\s\S]*?)\<\/div\>/g,
        /\<span style="font-size: ([\s\S]*?);"\>([\s\S]*?)\<\/span\>/g,
        /\<a href="([\s\S]*?)"\>\<\/a\>/g,
        /\<a href="([\s\S]*?)"\>([\s\S]*?)\<\/a\>/g,
        /\<span style="color: #333333"\>([\s\S]*?)\<\/span\>/g,
        /\<span style="color: ([\s\S]*?)"\>([\s\S]*?)\<\/span\>/g,
        /\<img src="([\s\S]*?)"\>/g,
        /\<dl class="codebox spoiler"><dt style="cursor: pointer;">([\s\S]*?)<\/dt><dd><div class="spoiler_content([\s\S]*?)"\>([\s\S]*?)\<\/div><\/dd><\/dl>/g,
        /\<div class="punbbtop"\>([\s\S]*?)\<\/div\><pre class="highlight punbb_block"\>([\s\S]*?)\<\/pre\>/g,
        /\<blockquote><div\>([\s\S]*?)\<\/div><\/blockquote\>/g
    ]; // Note: No comma after the last entry!
        /*/\<dl class="codebox"><dt>([\s\S]*?)<\/dt><dd class="cont_code"><code>([\s\S]*?)<\/code><\/dd><\/dl>/gi,*/
    // The matching array of strings to replace matches with bbcode
    var $BBCODE_replace = [
        '[b]$1[/b]',
        '[i]$1[/i]',
        '[u]$1[/u]',
        '[s]$1[/s]',
        '[center]$1[/center]',
        '[size=$1]$2[/size]',
        '[url]"$1"[/url]',
        '[url="$1"]$2[/url]',
        '$1',
        '[color=$1]$2[/color]',
        '[img]$1[/img]',
        '[spoiler=$1]$3[/spoiler]',
        '[code]$2[/code]',
        '[quote]$1[/quote]'
    ]; // Note: No comma after the last entry!
    var len = $HTML_search.length;
       
    for (var i = 0; i < len; i++) {
        bbcodeData = bbcodeData.replace($HTML_search[i], $BBCODE_replace[i]);
    }    
    return bbcodeData
}

$(function () {
	$(document).on('click', function (e) {
		$(e.target).closest('.spoiler,.spoiler_content').filter('.spoiler').find('.spoiler_content:first,.spoiler_closed:first').toggleClass('hidden')
	})
});
function punbbExpand(oThis) {
    jQuery(oThis).css('display', 'none');
    jQuery(oThis).next().css('display', '');
    jQuery(oThis).parent().next('pre.punbb_block').addClass('expand');        
}
function punbbCollapse(oThis) {
    jQuery(oThis).css('display', 'none');
    jQuery(oThis).prev().css('display', '');
    jQuery(oThis).parent().next('pre.punbb_block').removeClass('expand'); 
}
function punbbPopup(oThis) {
    var content = jQuery(oThis).parent().next('pre.punbb_block').html();
    var my_window = window.open("", "PunBB code - Para selecionar o código: [Ctrl] + [A]", "scrollbars=1toolbar=no,menubar=no,personalbar=no,status=0,left=0,location=0,menubar=0,top=0,width=640,height=480");
    my_window.document.write('<pre>'+content+'</pre>');
}
function punbbAbout(oThis) {
    alert('Simple code to add Syntax Highlighter fuctionality for PunBB-Forumeiros\n\nBy JScript FROM Brazil - 2013/07/17\n');
}
function punbbSelect(oThis) {
    var doc = document;
    var text = jQuery(oThis).parent().next('pre.punbb_block')[0];
    if (doc.body.createTextRange) {
        var range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);        
    }
}
