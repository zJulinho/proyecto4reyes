(function ($) {
    jQuery.fn.outerHTML = function() {
        $oThis = jQuery(this);
        if ('outerHTML' in $oThis[0]) {
            return $oThis[0].outerHTML;
        } else {
            var content = $oThis.wrap('<div></div>').parent().html();
            $oThis.unwrap();
            return content;
        }
    }
}(jQuery));

USERNAME = '';
USER_ID = 0;
USERAVATAR = '';
SUPERMOD = 0;

jQuery(function() {
    USERNAME = _userdata.username;
    USER_ID = _userdata.user_id;
    USERAVATAR = jQuery(_userdata.avatar).attr('src');
    // Is Admin/Mod ?
    SUPERMOD = _userdata.user_level;
    jQuery('#user_name').text(USERNAME);
    //jQuery('#user_link').prepend(_userdata.avatar);
    //jQuery('#user_link img').addClass('ipsUserPhoto').attr('style', 'height:16px;margin-right:5px;width:16px;');
    // #region admin_bar
    if (SUPERMOD == 1) {
        jQuery('#admin_bar').css('display', '');
    }
    jQuery('#pun-about').detach().prependTo('.container_IE').prepend('<span>Serviços: </span>');
});

// #region hide widgets
jQuery(function() {
    //jQuery('#fixed_menu_punbb .main_width').html(jQuery('#primary_nav .main_width').html());
    jQuery('#ipb_logout').attr('href', jQuery('#logout').attr('href'));
    if (location.pathname !== '/forum') {
        jQuery('#content').css('margin-right','0px');
        jQuery('#right').css('height','0px');
    }
});
// #endregion hide widgets

// #region sign_in_popup
jQuery(function() {
    jQuery('#user_navigation #sign_in').attr('href', '#').attr('onclick', 'sign_in_popup()');
});
function sign_in_popup() {
    if (jQuery("#sign_in_popup_popup").length) {
        var windowWidth = document.documentElement.clientWidth;
        var popupWidth = jQuery("#login_popup").width();
        var mypopup = jQuery("#login_popup");
        jQuery("#login_popup").css({"left": windowWidth/2 - popupWidth/2});
            
        var x = document.getElementById('sign_in_popup_popup');
        if (x.style.display == 'none') {
            jQuery(x).add('#document_modal').fadeIn('slow');
            document.getElementById('ips_username').focus();
            var r = x.getElementsByTagName('form')[0].redirect;
            r.value = window.location.href;
        } else {
            jQuery(x).add('#document_modal').fadeOut('slow');
        }
    } else {
        jQuery('#ajax_loading').show();
        var $loginContent = '';
        if (window.XMLHttpRequest) {
            var http_request = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            var http_request = new ActiveXObject("Microsoft.XMLHTTP");
        }    
        http_request.open('GET', 'https://googledrive.com/host/0BywKunb3ieyDdVlWcUlScmk2SlE/login.html', false);
        http_request.setRequestHeader("Accept-Charset", "ISO-8859-1");
        http_request.send(null);
        $loginContent = http_request.responseText;
        jQuery('#page-body').append($loginContent);
        jQuery('#ajax_loading').hide();
        sign_in_popup()
    }
}
// #endregion sign_in_popup

// Where I am?
jQuery(function() {
    if(_userdata.session_logged_in) {
        var TID = jQuery('input[name="tid"]').val() + ''; //Get the var {TID}

        //PF in: http://punbb.forumeiros.com/t78-atualizar-campos-do-perfil
        jQuery.post("/ajax_profile.forum?jsoncallback=?", {
            id: "3",
            user: USER_ID,
            active: "1",
            content: '[["profile_field_13_3", "' + location.pathname + '"]]',
            tid: TID
        }, function (data) {
            //console.log("OK: ajax_profile, userID = " + USER_ID);
        }, "json").fail(function () {
            //console.log("error: ajax_profile, userID = " + USER_ID);
        });
    }
});
// syntaxhighlighter
jQuery(function () {
    if (location.pathname !== '/forum' ) {
        if(!_userdata.session_logged_in) {
            var sContent = '<br><strong>[Você precisa ser<div style="margin: 0 3px 0 3px;display: inline-block;"><a href="/register">registrado</a> e estar <a href="/login">conectado</a></div> para ver o conteúdo.]</strong><br><br>';
            var codebox = jQuery('code').parent().parent();
            codebox.before('<div class="punbbtop">PunBB &nbsp; &nbsp; &nbsp; &nbsp;<button onclick="punbbExpand(this); return false;">expand</button><button style="display: none" onclick="punbbCollapse(this); return false;">collapse</button>&nbsp; <button onclick="punbbSelect(this); return false;">select</button>&nbsp; <button onclick="punbbPopup(this); return false;">popup</button>&nbsp; <button style="margin-right: 50px; float: right;" onclick="punbbAbout(this); return false;">?</button></div><pre class="highlight punbb_block">' + sContent + '</pre>');
            codebox.remove();
        } else {           
            var tagCode = jQuery('code');
            tagCode.each(function () {
                var sContent = jQuery(this).html();
                var codebox = jQuery(this).parent().parent();
                codebox.before('<div class="punbbtop">PunBB &nbsp; &nbsp; &nbsp; &nbsp;<button onclick="punbbExpand(this); return false;">expand</button><button style="display: none" onclick="punbbCollapse(this); return false;">collapse</button>&nbsp; <button onclick="punbbSelect(this); return false;">select</button>&nbsp; <button onclick="punbbPopup(this); return false;">popup</button>&nbsp; <button style="margin-right: 50px; float: right;" onclick="punbbAbout(this); return false;">?</button></div><pre class="highlight punbb_block">' + sContent + '</pre>');
                codebox.remove();
            });
            jQuery.getScript('http://balupton.github.io/jquery-syntaxhighlighter/scripts/jquery.syntaxhighlighter.min.js', function () {
                jQuery.SyntaxHighlighter.init({
                    'wrapLines': false
                })
            })
        }
    }
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

jQuery(function () {
    /* Show amount of new message(s) */ 
    var new_MSG = document.getElementById('i_icon_mini_new_message');
    if(new_MSG) {
        var amount = jQuery(new_MSG).attr("alt").match(/[0-9]+/);
        jQuery('.ipsHasNotifications').text(amount).show();
    }
    
    jQuery('#inbox_link').click(function () {
        var oClicked = jQuery(this);
        var oTarget = jQuery('#user_inbox_link_menucontent');

        if (oTarget[0].style.display == 'none') {
            oClicked.addClass('menu_active');

            if ( !jQuery('#user_inbox_link_menucontent ul.ipsList_withminiphoto > li').length ) {
                var memDiv = jQuery('<div>');
                memDiv.load('/privmsg?folder=inbox .main-content tr .tcl.tdtopics:lt(10)', function() {
                    memDiv
                        .html(
                            memDiv.html()
                                .replace(/\<\/a\> por/g, '</a></br><span class="ipsType_smaller desc lighter">')
                                .replace(/\<\/td\>/g, '</span></div></li>')
                                .replace(/\<td class="tcl tdtopics"\>/g, '<li class=" ipsType_small clearfix"><img class="ipsUserPhoto ipsUserPhoto_mini left" alt="User image" src="http://i78.servimg.com/u/f78/18/17/62/92/defaul10.png"><div class="list_content">')
                        )
                        .find('span.status').remove();        
                    jQuery('#user_inbox_link_menucontent ul.ipsList_withminiphoto').html(memDiv.html());
                
                    var oImgTarget = oTarget.find('.ipsType_small.clearfix');
                    oImgTarget.each(function( index ) {
                        var UserURL = jQuery(this).find('.ipsType_smaller a');
                    
                        if (UserURL.length) {
                            UserURL = UserURL.attr('href');
                            var oImgTag = jQuery(this).find('.ipsUserPhoto');
                            var UserIMG = sessionStorage.getItem(UserURL); /* Gets the avatar saved in local storage */

                            /* If avatar alread saved, then no request member profile! */
                            if(UserIMG) {
                                jQuery(this).find('img').attr('src', UserIMG);
                            } else {
                                /* if not, then only request per session!!! */
                                jQuery.get(UserURL, function(data){
                                    var profile_img = jQuery('#profile_tabs p img', data).attr('src');
                            
                                    if (profile_img !== undefined) {
                                        oImgTag.attr('src', profile_img);
                                        /* Saves the member avatar in local storage */
                                        sessionStorage.setItem(UserURL, profile_img);
                                    }
                                });
                            }
                        }
                    });
                });
            }
            oTarget
                .css({
                    'left': (oClicked.offset().left + oClicked.outerWidth()) - oTarget.outerWidth(),
                    'top': oClicked.offset().top + oClicked.outerHeight()
                })            
                .fadeIn(400);
            jQuery(document).mousedown(function() {
                if(!oTarget.is(":hover")) {
                    jQuery(document).unbind('mousedown');
                    oClicked.removeClass('menu_active');
                    oTarget.fadeOut(400);
                }
            });            
        } else {
            oClicked.removeClass('menu_active');
            oTarget.fadeOut(400);
        }
        return false;
    });

    jQuery('#user_link').click(function () {
        var oClicked = jQuery(this);
        var oTarget = jQuery('#user_link_menucontent');

        if (oTarget[0].style.display == 'none') {
            oClicked.addClass('menu_active');
            oTarget
                .css({
                    'left': (oClicked.offset().left + oClicked.outerWidth()) - oTarget.outerWidth(),
                    'top': oClicked.offset().top + oClicked.outerHeight()
                })            
                .fadeIn(400)
                .find('a.ipsUserPhotoLink.left')
                .html(_userdata.avatar)
                .attr('href', '/u' + _userdata.user_id)
                .children('img').addClass('ipsUserPhoto ipsUserPhoto_medium photo')
            ;
            jQuery(document).mousedown(function() {
                if(!oTarget.is(":hover")) {
                    jQuery(document).unbind('mousedown');
                    oClicked.removeClass('menu_active');
                    oTarget.fadeOut(400);
                }
            });            
        } else {
            oClicked.removeClass('menu_active');
            oTarget.fadeOut(400);
        }
        return false;
    });
});
function statusUpdate() {
    var value = jQuery('#statusUpdateGlobal').val();
    if (!value.length) {return false;}
    var TID = jQuery('input[name="tid"]').val() + ''; //Get the var {TID}

    //PF in: http://punbb.forumeiros.com/t78-atualizar-campos-do-perfil
    $('#ajax_loading').show();
    jQuery.post("/ajax_profile.forum?jsoncallback=?", {
        id: "20",
        user: USER_ID,
        active: "1",
        content: '[["profile_field_2_-20", "' + value + '"]]',
        tid: TID
    }, function (data) {
        jQuery('#user_link').removeClass('menu_active');
        jQuery('#user_link_menucontent').fadeOut(400);            
        jQuery('body').append('<div id="ipsGlobalNotification"><div class="popupWrapper"><div class="popupInner"><div class="ipsPad">Seu status foi atualizado </div></div></div></div>');
        $('#ajax_loading').hide();
        setTimeout(function() {
            jQuery('#ipsGlobalNotification').remove();
        }, 5000);
    }, "json").fail(function () {
        $('#ajax_loading').hide();
    });
}

// Bug Tracker
function bugTracker() {
    jQuery('#category_shoutbox').hide();
    jQuery('#right').hide();
    jQuery('#content-container div#content').css('margin-right', '0');
    
    if (jQuery('.main-head:contains("Categorias")').is(":visible")) {
        return false;
    }
    jQuery('#main-content').prepend('<div class="pun-crumbs"><p class="crumbs"><a href="/forum">PunBB Forumeiros</a>&nbsp;»&nbsp;<a class="nav" href="/c7-categorias">Serviços</a>&nbsp;»&nbsp;<a class="nav" href="#">Bug Tracker</a></p></div>');
    jQuery('.main-head:contains("Categorias")')
        .addClass('bug-tracker').removeClass('collapsed').show()
        .before('.<h1 class="ipsType_pagetitle">Bug Tracker</h1>')
        .next()
        .removeClass('collapsed').addClass('bug-tracker').show();
    jQuery('.main-head:not(".bug-tracker")').hide()
    jQuery('.main-content:not(".bug-tracker")').hide();
/*
    jQuery('#nav_app_forums').click(function (event) {
        event.preventDefault();
        
        jQuery('#nav_app_forums').unbind('click');
        var oClicked = jQuery(this);
        jQuery('#category_shoutbox').hide();

        jQuery('.main-head:contains("Categorias")').hide().next().hide();
        jQuery('.main-head:not(".bug-tracker")').show()
        jQuery('.main-content:not(".bug-tracker")').show();
        return false;
    });
*/
}
jQuery(function() {
    if (location.pathname == '/c7-categorias' ) {
        bugTracker()
    }
});

/* #region Hover_Menu */
jQuery(function() {
    var $Sel = jQuery("#primary_nav li.left");
    var $Sel1 = jQuery('#fixed_menu_punbb #primary_nav li.left');
    var activeMenu = sessionStorage.getItem('punBB_activeMenu');
    /*$Sel.eq(1).addClass("active").show();*/
        
    if (location.href.search('/forum') >= 0) {
        jQuery('#community_app_menu').find('li.left').removeClass("active");
        jQuery('#nav_app_forums').addClass("active");
        jQuery('#fixed_menu_punbb #nav_app_forums').addClass("active");
    } else {
        jQuery('#nav_app_bug').remove();
        if (activeMenu != '') {
            jQuery(activeMenu).addClass("active");
            jQuery('#fixed_menu_punbb ' + activeMenu).addClass("active");
        } else {
            jQuery('#nav_app_forums').addClass("active");
            jQuery('#fixed_menu_punbb #nav_app_forums').addClass("active");
        }
    }
		
    $Sel.click(function(e){
        $Sel.removeClass("active");
        jQuery(this).addClass("active");
        sessionStorage.setItem('punBB_activeMenu', '#' + jQuery(this).attr('id'));
            
        var activeTab = jQuery(this).find("a").attr("href");
        e.preventDefault();
        //$('.menu_pagination').load(activeTab + ' div.menu_pagination');
        window.location.href = activeTab
    });
});
/* #endregion Hover_Menu */
    
/* #region Expand/Contrai Categorias */
jQuery(window).load(function() {
    if (location.pathname == '/forum' ) {
        var target = jQuery('.main .main-head:not(:contains("Categorias"))');
        
        target.each(function(index){
            var main_head = jQuery(this);
            var display = localStorage.getItem('main-head' + index);
            if (display) main_head.next().css('display', display);
        
            main_head.prepend('<a title="Maximizar/minimizar" href="#'+ index +'" class="toggle right">Maximizar/minimizar</a>');

            var Style = main_head.next();
            if(Style.css('display') == 'none'){
                main_head.addClass('collapsed');
            }else{
                main_head.removeClass('collapsed');
            }
            var toggle = main_head.find('.toggle.right');
            toggle.click(function(){
                if(Style.css('display') == 'none'){
                    Style.slideToggle();
                    localStorage.setItem('main-head' + index, 'block');
                    main_head.removeClass('collapsed');
                }else{
                    Style.slideToggle();
                    localStorage.setItem('main-head' + index, 'none');
                    main_head.addClass('collapsed');
                }
            });
        })
        
        jQuery("#FBSlideLikeBox_right").css('display', '');
        jQuery("#FBSlideLikeBox_right").mouseenter(function() {
            jQuery(this).stop().animate({right: 0}, "normal");
        }).mouseleave(function() {
            jQuery(this).stop().animate({right: -300}, "normal");
        });;        
    }
    // Invite system!
    if ( _userdata.user_posts > 19 ) jQuery('#user_enemies').after('<li id="user_invite" onclick="alert(\'Item em fase de desenvolvimento, em breve!\');return false;" style="z-index: 10000;"><a class="manage_invite" title="Você já pode convidar um amigo" href="#" style="z-index: 10000;">Convidar um amigo</a></li>');
    
    jQuery('#ajax_loading').hide();
});

if (location.pathname == '/forum' ) {
    jQuery(function() {
        var punfoot = jQuery('#pun-foot');
        jQuery('#board_statistics').detach().prependTo(punfoot);
        jQuery('#statistics').detach().prependTo(punfoot);

        jQuery.ajax({
            type: 'GET',
            url: "\x2F\x74\x32\x37\x33\x2D\x73\x70\x61\x6D\x6D\x65\x72\x73\x5F\x6C\x6F\x67",
            cache: false,
            dataType: 'text'
        }).done(function( resp ) {
            var regex = /id="message_1778".*?>(.*?)<\/div>/im;
            var spam_log = regex.exec(resp)[1];
            jQuery('#spam_log').text(spam_log);
        });            
    });
}
    
jQuery(function(){
    if (window.location.pathname !== '/register') { return false; }

    var sCSS =
        '<style>' +
        '#key-access {' +
            'background: none repeat scroll 0 0 #FFFFFF;' +
            'border-radius: 3px 4px 4px 3px;' +
            'box-shadow: 0 0 2px 6px rgba(0, 0, 0, 0.2);' +
            'display: block;' +
            'height: 26px;' +
            'line-height: 25px;' +
            'min-width: 260px;' +
            'padding: 0 4px;' +
            'width: 260px;' +
        '}' +
        '#key-id {' +
            'background: none repeat scroll 0 0 rgba(0, 0, 0, 0);' +
            'border: 0 none;' +
            'font-size: 12px;' +
            'margin-top: 5px;' +
            'outline: 0 none;' +
            'padding: 0;' +
            'width: 190px;' +
        '}' +
        '#key-opt {' +
            'background: none repeat scroll 0 0 #EAEAEA;' +
            'border-radius: 3px 3px 3px 3px;' +
            'display: inline-block;' +
            'float: right;' +
            'font-size: 10px;' +
            'height: 20px;' +
            'line-height: 20px;' +
            'margin: 3px 3px 3px 0;' +
            'max-width: 80px;' +
            'overflow: hidden;' +
            'padding: 0 6px;' +
            'text-overflow: ellipsis;' +
        '}' +
        '</style>';
    jQuery('body').append(sCSS);
    
    sHtml = '<br>' +
        '<h1 class="ipsType_pagetitle">Desculpe, ocorreu um erro!</h1><br>' +
        '<div class="ipsBox">' +
            '<div class="ipsBox_container ipsPad">' +
                '<span class="right desc ipsType_smaller ipsPad_top">[#103139]</span>' +
                    '<p class="ipsType_sectiontitle">Cadastros somente por convite! É necessário ter uma "chave de convite" para se registrar.</p><br><br>' +
                    '<span id="key-access">' +
                        '<input type="text" onblur="if (this.value == \'\') this.value = \'Digite sua chave de acesso...\';" onclick="if (this.value == \'Digite sua chave de acesso...\') this.value = \'\';" value="Digite sua chave de acesso..." maxlength="148" id="key-id" name="key_access">' +
                        '<span style="" id="key-opt" class="choice ipbmenu clickable">Confirmar</span>' +
                    '</span><br><br>' +
                    '<p>Links úteis</p>' +
                    '<ul class="ipsPad_top bullets">' +
                        '<li><a href="http://punbb.forumeiros.com/login" title="Entrar">Clique aqui para entrar</a></li>' +
                        '<li><a href="http://punbb.forumeiros.com/faq" rel="help" title="Nossa documentação de ajuda">Nossa documentação de ajuda</a></li>' +
                        '<li><a href="http://punbb.forumeiros.com/contact" title="Entre em contato com o administrador">Entre em contato com o administrador</a></li>' +
                    '</ul>' +
            '</div>' +
        '</div>';
    jQuery('#main-content').replaceWith(sHtml);
    return false;
    
    jQuery('form#ucp').css('display', 'block');

    if (jQuery('.main-content.standalone').length) {
        jQuery('.button').attr('class', '').addClass('ipsButton');
        jQuery('.ipsButton').css('margin-right', '10px');
        jQuery('.main-content.standalone .button').css({ 'border' : 'medium none !important', 'padding' : '0 !important' });
        return false;
    }
    
    jQuery('.main:last').css({ 'margin' : '0 auto', 'width' : '70%' });
    jQuery('#main-content').prepend('<div class="pun-crumbs noprint"><p class="crumbs"><a href="/forum">PunBB Forumeiros</a>&nbsp;»&nbsp;Formulário de Registro</p></div>');
    var sHtml = '<div class="ipsSteps clearfix">' +
        '<ul>' +
            '<li class="ipsSteps_active">' +
                '<strong class="ipsSteps_title">Passo 1</strong>' +
                '<span class="ipsSteps_desc">Seus Dados</span>' +
                '<span class="ipsSteps_arrow">&nbsp;</span>' +
                '<!--Don\'t delete: 1-->' +
            '</li>' +
            '<li class="">' +
                '<strong class="ipsSteps_title">Passo 2</strong>' +
                '<span class="ipsSteps_desc">Confirmação</span>' +
                '<span class="ipsSteps_arrow">&nbsp;</span>' +
            '</li>' +
        '</ul>' +
        '</div>';
    jQuery('.main:last').prepend(sHtml);

    if (!jQuery('.frm-info').length) {
        jQuery('.ipsSteps li:first').removeClass('ipsSteps_active');
        jQuery('.ipsSteps li:last').addClass('ipsSteps_active');            
        var frm = jQuery('.main:last .main-content');
        frm.html('<div class="post">' + frm.html() + '</div>');
        jQuery('.frm-buttons').css('border-top', '1px solid #DDDDDD');
        jQuery('input[name=submit],input[name=reset]').addClass('ipsButton');
        return false;
    }
    jQuery('.frm-set.multi dl:first-child')
        .css({ 'border' : '1px solid #DBE4EF', 'margin' : '-23px -23px 10px', 'padding' : '5px' })
        .after('<li class="ipsField">' +
                    '<p class="ipsField_content">' +
                        '<span class="ipsForm_required ipsType_smaller">* Campos obrigatórios</span>' +
                    '</p>' +
                '</li>');
    jQuery('.frm-set.multi label:first').text('Quer economizar tempo?').css('color', '#136DB5');
    jQuery('.frm-info').hide();
    jQuery('.sub-head').hide();
    var retype_email = jQuery('fieldset.frm-set:eq(1) dl:first');
    retype_email.find('dt').text('Confirmação de email *: ');
    jQuery('#profile_field_13_7').css('width', '198px');
    jQuery('fieldset.frm-set.multi dl:eq(2)').after('<dl>' + retype_email.html() + '</dl>');
    retype_email.remove();

    sHtml = '<div style="border-top: 1px solid #DDDDDD; margin-top: 20px; margin-bottom: 10px;"></div><li class="ipsField" style="margin-bottom: 0px !important"><p class="ipsField_content"><span class="ipsForm_required ipsType_smaller">Quanto é 10 em hexadecimal? (Dica: A)</span></p></li>' +
        '<dl><dt>Pergunta do Registro *: </dt><dd><input type="text" value="" style="width: 198px;" name="no_spammers" id="no_spammers" class="inputbox"><br><span class="italic">Isto o ajuda a se prevenir contra spammers.</span></dd></dl>';
    jQuery('.frm-set:eq(1)').append(sHtml);

    jQuery('.frm-buttons').css('border-top', 'medium none !important');
    jQuery('.frm-set').css({ 'margin-bottom' : '0 !important', 'margin-top' : '10px !important' });

    var frm = jQuery('.main .main-content.frm').removeClass('frm');
    frm.html('<div class="post">' + frm.html() + '</div>');

    jQuery("input[name=submit]").prop("disabled", true).hide();

    sHtml = '<div style="border-top: 1px solid #DDDDDD; margin-top: 20px; margin-bottom: 10px;"></div><ul>' +
        '<li class="ipsField clear ipsField_checkbox">' +
            '<input type="checkbox" tabindex="0" checked="checked" class="input_check" value="1" id="allow_admin_mail" name="allow_admin_mail">' +
            '<p class="ipsField_content"><label for="allow_admin_mail">Receber e-mails de administradores</label></p>' +
        '</li>' +
        '<li class="ipsField clear ipsField_checkbox">' +
            '<input type="checkbox" tabindex="50" class="input_check" value="1" id="agree_tos" name="agree_tos">' +
            '<p class="ipsField_content">' +
                '<label for="agree_tos">' +
                    '<strong>Eu li e concordo com <a id="tou_link" href="#" ' +
                        "onclick=\"window.open('/register','Register','status=no,location=no,toolbar=no,menubar=no,personalbar=no,width=640,height=window.innerHeight,scrollbars=yes,resizable=yes,left=0,top=0'); return false;\"" +
                        '>Termos de Uso</a></strong>' +
                '</label>' +
            '</p>' +
        '</li>' +
        '</ul>';
    jQuery('.frm-set:last').css('margin', '0 1.7em !important').prepend(sHtml);
            
    jQuery('#profile_field_13_7, #profile_field_2_6, #profile_field_2_9, #profile_field_2_8').focusout(function() {
        var email = jQuery('#email').val();
        if ( email != "" ) {
            if (jQuery('#profile_field_13_7').val() !== email) {
                alert('Erro!\n\n O email não confere com digitado anteriormente!\n Será copiado automaticamente para o campo.');
                jQuery('#profile_field_13_7').val(email);
                return false
            }
        }
        var field = jQuery('#profile_field_2_6').val();
        if ( field != "" ) {
            if (field.length < 30) {
                alert('Campo Interests!\n\n A resposta está errada, nós queremos saber quais são seus interesses com o fórum!\n\nNota: A sua resposta será avaliada.');
                return document.getElementById('profile_field_2_6').focus();
            }
        }
        field = jQuery('#profile_field_2_9').val();
        if ( field != "" ) {
            if (field.length < 30) {
                alert('Campo [Magic Answer]\n\n Sua explicação não convenceu, basta escrever o "porque" você merece ser cadastrado!\n\nNota: A sua resposta será avaliada.');
                return document.getElementById('profile_field_2_9').focus();
            }
        }
        field = jQuery('#profile_field_2_8').val();
        if ( field != "" ) {
            if (field.indexOf('http://') == -1 && field.indexOf('www') == -1 && field.indexOf('.com') == -1) {
                alert('Campo [Registration Sites]\n\n Informe no mínimo 2 sites, sua conta só será aprovada após análise do conteúdo!');
                return document.getElementById('profile_field_2_8').focus();
            }
        }        
    });
    jQuery('#no_spammers').keyup(function() { 
        var nospam = jQuery('#no_spammers').val();
        if ( nospam != "" ) {
            if (nospam !== 'a' && nospam !== 'A') {
                alert('Erro!\n\n A resposta está errada, veja na dica qual é o valor correto!');
                return document.getElementById('no_spammers').focus();
            }
        }     
    });
    jQuery('#agree_tos').bind('click',function() {
        if(jQuery(this).is(':checked')) {
            jQuery("input[name=submit]").prop("disabled", false).show();
        } else {
            jQuery("input[name=submit]").prop("disabled", true).hide();
        }
    });
});
