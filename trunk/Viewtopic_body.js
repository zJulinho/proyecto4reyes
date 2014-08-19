/***
* Copyright (c) 2013 JScript <jscriptbrasil at live.com>
* This work is free. You can redistribute it and/or modify it
* under the terms of the WTFPL, Version 2
*
* For more information, go to the home page:
* http://punbb.forumeiros.com/forum
*/
$.fn.stars = function() {
    return $(this).each(function() {
        $(this).html($('<span />').width(Math.max(0, (Math.min(5, parseFloat($(this).html())))) * 16));
    });
}

$(function () {
    /***
    * Function: Title_Box Owner
    */
    var sHtml = sessionStorage.getItem(N_TOPIC_ID); // Read html from sessionStorage, more fast!
    if (sHtml !== null) {
        $('#titlebox').html(sHtml);
    } else {    
        target = $('.post:first');
        var imgdata = target.find('div.user-basic-info a');
        var autor_dat = target.find('div.username');
        var autor_url = autor_dat.attr('href');
        var autor_txt = autor_dat.text();
        var date = target.find('span.data-post').html();
        var topic_title = $('.ipsType_pagetitle').text();
        var tags = topic_title.split(' ');
        /* Sets default avatar...
        if (imgdata.find('img').length == 0) {
            imgdata.html('<img src="http://i78.servimg.com/u/f78/18/17/62/92/defaul10.png" alt="User image">');
        }*/
        $('.ipsUserPhotoLink.left').attr('href', autor_url);
        $('.ipsUserPhoto.ipsUserPhoto_medium').attr('src', imgdata.find('img').attr('src'));
        $('span[itemprop="creator"]').find('a').attr('title', autor_txt).attr('href', autor_url);
        $('span[itemprop="name"]').text(autor_txt);
        $('span[itemprop="dateCreated"]').html(date);

        /* Remove duplicates values in array!
        -> If you find something better than this, telme please. */
        tags = tags.filter(
            function(a){
                if (!this[a]) { this[a] = 1; return a;}
            }
        );
        // Sets tag search...
        $.each(tags, function(index, data) {
            if(data.length > 4) {
                $('#tags_search').append(
                    '<a id="tag_search_' + index + '" class="ipsTag" title="Localizar mais conteúdo com tag ' + data + '" href="/search?search_keywords=' + data + '">' +
                    '    <span>' + data + '</span>' +
                    '</a>'
                );
            }
        });     
        sessionStorage.setItem(N_TOPIC_ID, $('#titlebox').html());
    }
    // Whatch topic
    if (_userdata.session_logged_in) {
        //<!-- BEGIN watchtopic -->
        function watchtopic() {
            var target = $('#watchtopic').find('a.ftoggle.ipsButton_secondary');
            var follow = S_WATCH_TOPIC;
            if (follow.indexOf("?watch=") != -1) {
                target.attr('title', 'Seguir este tópico e receber notificações de atualizações');
                target.attr('href', TOPIC_URL + '?watch=topic');
                target.text('Seguir este tópico');
            } else {
                target.attr('title', 'Não seguir este tópico e não receber notificações de atualizações');
                target.attr('href', TOPIC_URL + '?unwatch=topic');
                target.text('Não seguir este tópico');
            }
        }
        watchtopic();
        //<!-- END watchtopic -->
    }
    
    target = $('.main-content.topic').find('div.post');
    /***
    * Check if the post is hidden!
    * Check if signature height exceeds 250px.
    */       
    target.each(function(index) {
        var oThis = $(this);
        var $Obj_user = oThis.find('div.username');
        var USER_URL = $Obj_user.children('a').attr('href');
        if (USER_URL == undefined) {return false}
        
        // Check if the post is hidden!
        var oEdit = oThis.find('p.edit');
        var sEdit = oEdit.text();
        if (sEdit !== '') {
            if (sEdit.indexOf('HIDE_POST') !== -1) {
                oEdit.remove();
                var isAdm = $('#pun-foot').find('p.center a').attr('href');
                var autorname = $Obj_user.text();
                if ( (isAdm == undefined) && (USERNAME !== autorname) ) {
                    oThis.remove();
                    USER_URL == undefined;
                } else {
                    oThis.css('background-color', '#F8F1F3');
                    oThis.find('.postmain').css('background-color', '#F8F1F3');
                    var post_ID = oThis.children('a').attr('name');
                    $('#hide_post_' + post_ID).toggle();
                    $('#restore_post_' + post_ID).toggle();
                }
            /*} else {
                if (sEdit.indexOf('(Razão') !==-1) {
                    oEdit[index].innerHTML = oEdit[index].innerHTML.replace(/<br><br>Última\sedição\s(.*?)\s\(Razão\s:\s(.*?)\)/g, '<strong>Editado $1.</strong><br>$2');
                } else {
                    oEdit[index].innerHTML = oEdit[index].innerHTML.replace(/<br><br>Última\sedição\s(.*?)$/g, '<strong>Editado $1.</strong>');
                }*/
            }
        }
        /* Check if signature height exceeds 250px */
        var signature = oThis.find('div.sig-content');
        var sig_height = signature.outerHeight();
        if (sig_height > 250) { /* if yes, put the content in tag spoiler!!! */
            var content = signature.html();
            signature.html('<dl class="codebox spoiler"><font color="#0000FF"><dt style="cursor: pointer;">Spoiler:</dt></font><dd><font color="#0000FF"></font><div class="spoiler_content">' + content + '</div></dd></dl>');
        }
        if (USER_URL == '/u1') {
            oThis.find('.sig-content a').show();
        }
    });
    
    /***
    * Best Answer feature!
    * Function: Check if is set.
    */    
    answer_log = '';
    $get("\x2F\x74\x31\x37\x38\x2D\x61\x6E\x73\x77\x65\x72\x5F\x6C\x6F\x67", function(resp) {
        var regex = /<div\s+id="message_908".*?>(.*?)<\/div>/im;
        answer_log = regex.exec(resp)[1];
        target.each(function(index) {
            var oThis = $(this);
            var post_ID = oThis.children('a').attr('name');
            if (post_ID == undefined) {return false}

            var ANSWER_ID = ':' + post_ID + ':';
        
            if (answer_log.indexOf(ANSWER_ID) !== -1) {
                oThis.css('background-color', '#EAF8E2');
                oThis.find('div.postmain').css('background-color', '#EAF8E2');
                $('#answer_' + post_ID).toggle();
                $('#unanswer_' + post_ID).toggle();
                var post_url = oThis.attr('data-post-url');
                var $data_post = oThis.find('span.data-post');
                var data_post = $data_post.text();
                var sHtml = '<div class="post post_block feature_box" id="resolved" data-post-id="' + post_ID + '">'+
                    '<span class="ipsUserPhoto ipsUserPhoto_medium left">' + oThis.find('div.user-basic-info > a').outerHTML() + '</span>'+
                    '<div class="ipsBox_withphoto">'+
                        '<p class="ipsType_sectiontitle">'+
                            '<span class="ipsBadge ipsBadge_green">Melhor Resposta</span>'+
                            '&nbsp;' + oThis.find('div.username').html() + ', <a href="' + post_url + '">' + data_post + '</a>'+
                        '</p>'+
                        '<p class="ipsPad_top desc"></p>'+
                        '<div class="ipsBox_Anwser" style="margin-bottom: 2px;">' + $('#message_' + post_ID).html() + '</div>'+
                        '<a href="' + post_url + '">'+
                            '<span class="ipsBadge has_icon ipsBadge_lightgrey">Visualizar o post completo <img src="http://i34.servimg.com/u/f34/18/17/62/92/right_10.png" class="icon"></span>'+
                        '</a>'+
                        '<p></p>'+
                    '</div>'+
                '</div><br>';
                $('.main.paged').prepend(sHtml);
                $data_post.html(data_post + ' <span class="ipsBadge ipsBadge_green">Melhor Resposta</span>');
                // $('li[data-owner="' + post_ID + '"]').remove();
                return false
            }
        });        
    });
    /***
    * Show the User Title feature and sets state ONLINE/OFFLINE
    */
    showTitleAndState(target);

    if (!_userdata.session_logged_in) {
        $('.post:last').after('<div class="fb-comments" data-href="' + FORUM_URL + TOPIC_URL + '" data-num-posts="1" data-width="' + target.width() + '"></div> <div id="fb-root"></div>');
    }
    /***
    * Show count post in posthead bar
    * Show auto_first_answer & announcement_bot
    */       
    var amount = $('span.count-post:last').html() - 1;
    $('span[itemprop="count_post"]').html(amount);

    /*var forum = $('.pun-crumbs').find('.nav:eq(1)');
    if (!forum.length) {
        forum = $('.pun-crumbs').find('.nav');
    }
    forum = forum.attr('href').split('-')[0];*/
    var post_owner = $('.main-content.topic').find('div.post:first').find('div.username a').text();
    if (amount == 0) {
        if ( (FORUM_ID == '20') || (FORUM_ID == '7') || (FORUM_ID == '10') || (FORUM_ID == '11') || (FORUM_ID == '12') || (FORUM_ID == '16') 
             || (FORUM_ID == '18') || (FORUM_ID == '25') || (FORUM_ID == '26') || (FORUM_ID == '27')) {
            $('#auto_first_answer').css('display', 'block');
            if (post_owner == USERNAME) {
                $('.posting').remove();
                $('#pun-qpost').hide();
                $('html,body').animate({
                    scrollTop: $('#auto_first_answer').offset().top
                }, 1200);
                shoutMyTopic();
            }
        }
    }
    if ( (FORUM_ID !== '1') && (FORUM_ID !== '4') && (FORUM_ID !== '17') && (FORUM_ID !== '6') &&
        (FORUM_ID !== '3') && (FORUM_ID !== '9') && (FORUM_ID !== '2') ) {
        $('#announcement_bot').css('display', 'block');
    }

    /***
    * Like & Unlike system!
    * Function: Load and read registry log.
    */
    $js.dataRead(function(resp){
        $js.oData = JSON.parse(resp.responseText);
        
        // target = $('.main-content.topic').find('div.post');
        target.each(function(index) {
            var oThis = $(this);
            var post_ID = oThis.children('a').attr('name');
            if (post_ID == undefined) return false

            var aLikes = $js.getLikesPost(post_ID);
            var iLen = aLikes.length;
            if (iLen) {
                if (index == 0) {
                    $('span.stars').text(iLen).stars();
                }
                var sLikes = aLikes.join(', ');// toString();
                var like_txt = ' curtiu isso!';
                if (iLen > 1) {
                    like_txt = ' curtiram isso!';
                    sLikes = sLikes.replace(/,([^,]+)$/,' e $1');
                }
                if (iLen > 5) oThis.find('p.rep_highlight').show();
                $('#rep_post_' + post_ID).children('ul.ipsList_inline').prepend('<li id="like_post_' + post_ID + '" class="ipsLikeBar_info">' + sLikes + like_txt + '</li>');

                if ( sLikes.search(USERNAME) !== -1 ) {
                    $('#like_' + post_ID).toggle();
                    $('#unlike_' + post_ID).toggle();
                }                
            }            
            var MsgUserName = $('#p' + post_ID + ' .username a').text();
            $('#reput_' + post_ID).text($js.userReput(MsgUserName));
            
            if ( (FORUM_ID !== '1') && (FORUM_ID !== '3') && (FORUM_ID !== '4') && (FORUM_ID !== '5')
                && (FORUM_ID !== '24') && (FORUM_ID !== '15') && (FORUM_ID !== '13') && (FORUM_ID !== '14')) {
                if (MsgUserName == post_owner) {
                    $('#like_' + post_ID).remove();
                    $('#unlike_' + post_ID).remove();
                }
            }  
        });
    })   
    /*
    rept_log = '';
    $get("\x2F\x74\x31\x34\x30\x2D\x72\x65\x70\x75\x74\x61\x74\x69\x6F\x6E\x5F\x6C\x6F\x67", function(resp) {
        var regex = /<div\s+id="message_668".*?>(.*?)<\/div>/im;
        rept_log = $("<div/>").html(regex.exec(resp)[1]).text();
        target.each(function(index) {
            var oThis = $(this);
            var $Obj_user = oThis.find('div.username');
            var USER_URL = $Obj_user.children('a').attr('href');
            if (USER_URL == undefined) {return false}
                
            var post_ID = oThis.children('a').attr('name');    
            var VOTE_ID = USERNAME + ':' + TOPIC_ID + '-:' + post_ID + ':(.*?)\\|';

            if ( rept_log.search(VOTE_ID) !== -1) {
                $('#like_' + post_ID).toggle();
                $('#unlike_' + post_ID).toggle();
            }
            var sHtml = '', total_users = 0, like_txt = ' curtiu isso!';
            var aSplit = rept_log.split('|');
            var aLength = aSplit.length;
            var looking = ':' + post_ID + ':';
            
            for (var i=1; i < aLength; i++) {
                if (aSplit[i].indexOf(looking) !== -1) {
                    if (total_users == 0) {
                        sHtml += aSplit[i].split(':')[0];
                    } else {
                        sHtml += ', ' + aSplit[i].split(':')[0];
                    }
                    total_users++;
                }
            }
            if ((sHtml !== '') && (total_users !== 0)) {
                sHtml = sHtml.replace(/,\s([^,]+)$/, ' e $1');
                if (total_users > 1) {like_txt = ' curtiram isso!';}
                if (total_users > 4) {oThis.find('p.rep_highlight').show();}
                $('#rep_post_' + post_ID).children('ul.ipsList_inline').prepend('<li id="like_post_' + post_ID + '" class="ipsLikeBar_info">' + sHtml + like_txt + '</li>');
            }
        });
    });*/
    /***
    * Quote in the quiqk reply textarea!
    * For new editor text.
    */
    $('a[href*="mode=quote"]').click(function () {
        var datahref = $(this).attr('href');
        $.get(datahref , function (a) {
            var datatext = $(a).find('#text_editor_textarea[name="message"]').val();
            text_area = $("#text_editor_textarea");
            if ( text_area.next('.sceditor-container').length ) {
                text_area.sceditor('instance').val(datatext);
            } else {
                text_area.val(datatext);
            }
        });
        $('html,body').animate({
            scrollTop: $('.main-content.topic.fast-reply').offset().top
        }, 1200);
        return false;
    });
    /***
    * Fast reply without refresh window!
    * Function: fastReply()
    var inputQReply = $('#pun-qpost input[name="post"]');
    inputQReply.replaceWith('<input type="button" value="' + inputQReply.val() + '" onclick="fastReply()">');
    */
    if (USERNAME == 'Convidado') { $('.post-options').remove(); }
    // Avatar Quick Reply
    $('#reply_avatar img').attr('src', USERAVATAR);
    $('#reply_avatar').attr('href', '/u' + USER_ID);    
});

if (_userdata.session_logged_in) {
    /***
    * Like & Unlike system!
    * Function: Save vote in the registry log.
    */
    function saveVote(post_ID, value) {
        if (isNaN(post_ID) || ($('#post_' + post_ID).length == 0) ) {return false}

        if (TOPIC_TITLE.length > 25) {
            var tTitle = TOPIC_TITLE.substr(0,25) + '...';
        } else {
            var tTitle = TOPIC_TITLE;
        }        
    
        var alread = $('#like_post_' + post_ID);
        if (alread.length) {
            alread.text("Atualizando...");
        } else {
            $('#rep_post_' + post_ID).children('ul.ipsList_inline').prepend('<li id="like_post_' + post_ID + '" class="ipsLikeBar_info">Atualizando...</li>');
            alread = $('#like_post_' + post_ID);
        }
        $('#like_' + post_ID).toggle();
        $('#unlike_' + post_ID).toggle();

        $js.dataRead(function(resp){
            if (resp.status == 200){
            $js.oData = JSON.parse(resp.responseText);
            try
            {
                var msgUserID = $('#p' + post_ID + ' .username a').attr('href').split('/u')[1];
            } catch(e) {
                var msgUserID = $('#p' + post_ID).parent().find('.username a').attr('href').split('/u')[1];
            }            
            var MsgUserName = $('#p' + post_ID + ' .username a').text();
        
            $js.addUser(USERNAME, USER_ID);
            $js.addUser(MsgUserName, msgUserID);

            if ( !$js.removeUserLikePost(USERNAME, post_ID) ) {
                if (TOPIC_TITLE.indexOf(' ') == -1) {$js.userReput(MsgUserName, '+');}
                $js.addUserLike(USERNAME, {topic: TOPIC_ID, post: post_ID, title: tTitle});
            } else {
                if (TOPIC_TITLE.indexOf(' ') == -1) {$js.userReput(MsgUserName, '-');}
            }
            $js.saveDB($js.oData,function(resp){
                if (resp.status == 200){
                $js.oData = JSON.parse(resp.responseText);

                var aLikes = $js.getLikesPost(post_ID);
                var iLen = aLikes.length;
                if (iLen) {
                    var sLikes = aLikes.join(', ');// toString();
                    var like_txt = ' curtiu isso!';
                    if (iLen > 1) {
                        like_txt = ' curtiram isso!';
                        sLikes = sLikes.replace(/,([^,]+)$/,' e $1');
                    }
                    if (iLen > 5) oThis.find('p.rep_highlight').show();
                    alread.text(sLikes + like_txt);
                } else {
                    alread.remove();
                }
                $('#reput_' + post_ID).text($js.userReput(MsgUserName));
                } else {
                    alert('Info:\n\nO sistema está em manutenção e retornará em breve, tente novamente mais tarde, obrigado!');
                }
            })
            } else {
                alert('Info:\n\nO sistema está em manutenção e retornará em breve, tente novamente mais tarde, obrigado!');
            }
        });
    }  
    /***
    * Best Answer feature!
    * Function: Resolved post.
    */
    function Resolved(post_ID, flag) {
        var _0x8af1=["","\x6C\x65\x6E\x67\x74\x68","\x23\x70\x6F\x73\x74\x5F","\x2F\x70\x6F\x73\x74\x3F\x70\x3D\x39\x30\x38\x26\x6D\x6F\x64\x65\x3D\x65\x64\x69\x74\x70\x6F\x73\x74","\x73\x75\x62\x73\x74\x72","\x2E\x2E\x2E","\x2D\x3A","\x3A","\x7C","\x73\x68\x6F\x77","\x23\x61\x6A\x61\x78\x5F\x6C\x6F\x61\x64\x69\x6E\x67","\x2F\x74\x31\x37\x38\x2D\x61\x6E\x73\x77\x65\x72\x5F\x6C\x6F\x67","\x65\x78\x65\x63","\x73\x70\x61\x6E\x2E\x64\x61\x74\x61\x2D\x70\x6F\x73\x74","\x66\x69\x6E\x64","\x23\x72\x65\x73\x6F\x6C\x76\x65\x64","\x74\x6F\x67\x67\x6C\x65","\x23\x61\x6E\x73\x77\x65\x72\x5F","\x23\x75\x6E\x61\x6E\x73\x77\x65\x72\x5F","\x64\x61\x74\x61\x2D\x70\x6F\x73\x74\x2D\x69\x64","\x61\x74\x74\x72","\x72\x65\x6D\x6F\x76\x65","\x73\x70\x61\x6E\x2E\x69\x70\x73\x42\x61\x64\x67\x65","\x63\x68\x69\x6C\x64\x72\x65\x6E","\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x63\x6F\x6C\x6F\x72","\x23\x46\x46\x46\x46\x46\x46","\x63\x73\x73","\x64\x69\x76\x2E\x70\x6F\x73\x74\x6D\x61\x69\x6E","\x3A\x28\x2E\x2A\x3F\x29\x5C\x7C","\x69","\x72\x65\x70\x6C\x61\x63\x65","\x73\x70\x61\x6E\x2E\x64\x61\x74\x61\x2D\x70\x6F\x73\x74\x20\x73\x70\x61\x6E\x2E\x69\x70\x73\x42\x61\x64\x67\x65","\x23\x45\x41\x46\x38\x45\x32","\x45\x6E\x76\x69\x61\x72","\x48\x49\x44\x45\x5F\x50\x4F\x53\x54","\x2F\x70\x6F\x73\x74\x3F\x70\x3D\x39\x30\x39\x26\x6D\x6F\x64\x65\x3D\x65\x64\x69\x74\x70\x6F\x73\x74","\x30","\x70\x6F\x73\x74","\x68\x72\x65\x66","\x23\x70","\x20\x61","\x74\x65\x78\x74","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x70\x6F\x73\x74\x20\x70\x6F\x73\x74\x5F\x62\x6C\x6F\x63\x6B\x20\x66\x65\x61\x74\x75\x72\x65\x5F\x62\x6F\x78\x22\x20\x69\x64\x3D\x22\x72\x65\x73\x6F\x6C\x76\x65\x64\x22\x20\x64\x61\x74\x61\x2D\x70\x6F\x73\x74\x2D\x69\x64\x3D\x22","\x22\x3E","\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x69\x70\x73\x55\x73\x65\x72\x50\x68\x6F\x74\x6F\x20\x69\x70\x73\x55\x73\x65\x72\x50\x68\x6F\x74\x6F\x5F\x6D\x65\x64\x69\x75\x6D\x20\x6C\x65\x66\x74\x22\x3E","\x6F\x75\x74\x65\x72\x48\x54\x4D\x4C","\x64\x69\x76\x2E\x75\x73\x65\x72\x2D\x62\x61\x73\x69\x63\x2D\x69\x6E\x66\x6F\x20\x3E\x20\x61","\x3C\x2F\x73\x70\x61\x6E\x3E","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x69\x70\x73\x42\x6F\x78\x5F\x77\x69\x74\x68\x70\x68\x6F\x74\x6F\x22\x3E","\x3C\x70\x20\x63\x6C\x61\x73\x73\x3D\x22\x69\x70\x73\x54\x79\x70\x65\x5F\x73\x65\x63\x74\x69\x6F\x6E\x74\x69\x74\x6C\x65\x22\x3E","\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x69\x70\x73\x42\x61\x64\x67\x65\x20\x69\x70\x73\x42\x61\x64\x67\x65\x5F\x67\x72\x65\x65\x6E\x22\x3E\x4D\x65\x6C\x68\x6F\x72\x20\x52\x65\x73\x70\x6F\x73\x74\x61\x3C\x2F\x73\x70\x61\x6E\x3E","\x26\x6E\x62\x73\x70\x3B","\x68\x74\x6D\x6C","\x64\x69\x76\x2E\x75\x73\x65\x72\x6E\x61\x6D\x65","\x2C\x20\x3C\x61\x20\x68\x72\x65\x66\x3D\x22","\x3C\x2F\x61\x3E","\x3C\x2F\x70\x3E","\x3C\x70\x20\x63\x6C\x61\x73\x73\x3D\x22\x69\x70\x73\x50\x61\x64\x5F\x74\x6F\x70\x20\x64\x65\x73\x63\x22\x3E\x3C\x2F\x70\x3E","\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x69\x70\x73\x42\x6F\x78\x5F\x41\x6E\x77\x73\x65\x72\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x6D\x61\x72\x67\x69\x6E\x2D\x62\x6F\x74\x74\x6F\x6D\x3A\x20\x32\x70\x78\x3B\x22\x3E","\x23\x6D\x65\x73\x73\x61\x67\x65\x5F","\x3C\x2F\x64\x69\x76\x3E","\x3C\x61\x20\x68\x72\x65\x66\x3D\x22","\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x69\x70\x73\x42\x61\x64\x67\x65\x20\x68\x61\x73\x5F\x69\x63\x6F\x6E\x20\x69\x70\x73\x42\x61\x64\x67\x65\x5F\x6C\x69\x67\x68\x74\x67\x72\x65\x79\x22\x3E\x56\x69\x73\x75\x61\x6C\x69\x7A\x61\x72\x20\x6F\x20\x70\x6F\x73\x74\x20\x63\x6F\x6D\x70\x6C\x65\x74\x6F\x20\x3C\x69\x6D\x67\x20\x73\x72\x63\x3D\x22\x68\x74\x74\x70\x3A\x2F\x2F\x69\x33\x34\x2E\x73\x65\x72\x76\x69\x6D\x67\x2E\x63\x6F\x6D\x2F\x75\x2F\x66\x33\x34\x2F\x31\x38\x2F\x31\x37\x2F\x36\x32\x2F\x39\x32\x2F\x72\x69\x67\x68\x74\x5F\x31\x30\x2E\x70\x6E\x67\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x69\x63\x6F\x6E\x22\x3E\x3C\x2F\x73\x70\x61\x6E\x3E","\x3C\x70\x3E\x3C\x2F\x70\x3E","\x3C\x2F\x64\x69\x76\x3E\x3C\x62\x72\x3E","\x70\x72\x65\x70\x65\x6E\x64","\x2E\x6D\x61\x69\x6E\x2E\x70\x61\x67\x65\x64","\x20\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x69\x70\x73\x42\x61\x64\x67\x65\x20\x69\x70\x73\x42\x61\x64\x67\x65\x5F\x67\x72\x65\x65\x6E\x22\x3E\x4D\x65\x6C\x68\x6F\x72\x20\x52\x65\x73\x70\x6F\x73\x74\x61\x3C\x2F\x73\x70\x61\x6E\x3E","\x74\x6F\x70","\x6F\x66\x66\x73\x65\x74","\x61\x6E\x69\x6D\x61\x74\x65","\x68\x74\x6D\x6C\x2C\x62\x6F\x64\x79","\x68\x69\x64\x65","\x64\x6F\x6E\x65","\x41\x6E\x73\x77\x65\x72\x5F\x4C\x6F\x67"];if(flag==_0x8af1[0]||flag==undefined){flag=0;} ;if(isNaN(post_ID)||($(_0x8af1[2]+post_ID)[_0x8af1[1]]==0)){return false;} ;var send_value=_0x8af1[3];if(TOPIC_TITLE[_0x8af1[1]]>25){var tTitle=TOPIC_TITLE[_0x8af1[4]](0,25)+_0x8af1[5];} else {var tTitle=TOPIC_TITLE;} ;var ANSWER_ID=TOPIC_ID+_0x8af1[6]+post_ID+_0x8af1[7]+USERNAME+_0x8af1[7]+tTitle+_0x8af1[8];$(_0x8af1[10])[_0x8af1[9]]();answer_log=_0x8af1[0];$get(_0x8af1[11],function (_0x16b0x4){var _0x16b0x5=/<div\s+id="message_908".*?>(.*?)<\/div>/im;answer_log=_0x16b0x5[_0x8af1[12]](_0x16b0x4)[1];var _0x16b0x6=$(_0x8af1[2]+post_ID);var _0x16b0x7=_0x16b0x6[_0x8af1[14]](_0x8af1[13]);var _0x16b0x8=$(_0x8af1[15]),_0x16b0x9=0;$(_0x8af1[17]+post_ID)[_0x8af1[16]]();$(_0x8af1[18]+post_ID)[_0x8af1[16]]();if(_0x16b0x8[_0x8af1[1]]){var _0x16b0xa=_0x16b0x8[_0x8af1[20]](_0x8af1[19]);_0x16b0x8[_0x8af1[21]]();if(_0x16b0xa==post_ID){_0x16b0x7[_0x8af1[23]](_0x8af1[22])[_0x8af1[21]]();_0x16b0x6[_0x8af1[26]](_0x8af1[24],_0x8af1[25]);_0x16b0x6[_0x8af1[14]](_0x8af1[27])[_0x8af1[26]](_0x8af1[24],_0x8af1[25]);var _0x16b0xb= new RegExp(TOPIC_ID+_0x8af1[6]+post_ID+_0x8af1[28],_0x8af1[29]);answer_log=answer_log[_0x8af1[30]](_0x16b0xb,_0x8af1[0]);} else {var _0x16b0xc=$(_0x8af1[2]+_0x16b0xa);$(_0x8af1[17]+_0x16b0xa)[_0x8af1[16]]();$(_0x8af1[18]+_0x16b0xa)[_0x8af1[16]]();_0x16b0xc[_0x8af1[14]](_0x8af1[31])[_0x8af1[21]]();_0x16b0xc[_0x8af1[26]](_0x8af1[24],_0x8af1[25]);_0x16b0xc[_0x8af1[14]](_0x8af1[27])[_0x8af1[26]](_0x8af1[24],_0x8af1[25]);var _0x16b0xb= new RegExp(TOPIC_ID+_0x8af1[6]+_0x16b0xa+_0x8af1[28],_0x8af1[29]);answer_log=answer_log[_0x8af1[30]](_0x16b0xb,_0x8af1[0]);_0x16b0x6[_0x8af1[26]](_0x8af1[24],_0x8af1[32]);_0x16b0x6[_0x8af1[14]](_0x8af1[27])[_0x8af1[26]](_0x8af1[24],_0x8af1[32]);answer_log+=ANSWER_ID;_0x16b0x9=1;} ;} else {_0x16b0x6[_0x8af1[26]](_0x8af1[24],_0x8af1[32]);_0x16b0x6[_0x8af1[14]](_0x8af1[27])[_0x8af1[26]](_0x8af1[24],_0x8af1[32]);answer_log+=ANSWER_ID;_0x16b0x9=1;} ;var _0x16b0xd=_0x8af1[33],_0x16b0xe=_0x8af1[34];$[_0x8af1[37]](send_value,{subject:_0x8af1[74],message:answer_log,edit_reason:_0x16b0xe,attach_sig:_0x8af1[36],notify:_0x8af1[36],post:_0x16b0xd})[_0x8af1[73]](function (){var _0x16b0xf=[_0x8af1[35],_0x8af1[36],_0x8af1[37]];$[_0x16b0xf[2]](_0x16b0xf[0],{message:answer_log,edit_reason:_0x16b0xe,attach_sig:_0x16b0xf[1],notify:_0x16b0xf[1],post:_0x16b0xd});if(_0x16b0x9){var _0x16b0x10=$(_0x8af1[39]+post_ID+_0x8af1[40])[_0x8af1[20]](_0x8af1[38]);var _0x16b0x11=_0x16b0x7[_0x8af1[41]]();var _0x16b0x12=_0x8af1[42]+post_ID+_0x8af1[43]+_0x8af1[44]+_0x16b0x6[_0x8af1[14]](_0x8af1[46])[_0x8af1[45]]()+_0x8af1[47]+_0x8af1[48]+_0x8af1[49]+_0x8af1[50]+_0x8af1[51]+_0x16b0x6[_0x8af1[14]](_0x8af1[53])[_0x8af1[52]]()+_0x8af1[54]+_0x16b0x10+_0x8af1[43]+_0x16b0x11+_0x8af1[55]+_0x8af1[56]+_0x8af1[57]+_0x8af1[58]+$(_0x8af1[59]+post_ID)[_0x8af1[52]]()+_0x8af1[60]+_0x8af1[61]+_0x16b0x10+_0x8af1[43]+_0x8af1[62]+_0x8af1[55]+_0x8af1[63]+_0x8af1[60]+_0x8af1[64];$(_0x8af1[66])[_0x8af1[65]](_0x16b0x12);_0x16b0x7[_0x8af1[52]](_0x16b0x11+_0x8af1[67]);$(_0x8af1[71])[_0x8af1[70]]({scrollTop:_0x16b0x6[_0x8af1[69]]()[_0x8af1[68]]},100);} ;$(_0x8af1[10])[_0x8af1[72]]();} );} );
    }
}
/***
* Show the User Title feature and sets state ONLINE/OFFLINE
*/
function showTitleAndState(target) {
	if (target == '' || target == undefined) {
        target = $('.main-content.topic').find('div.post');
	}    
    target.each(function(index) {
        var oThis = $(this);
        var USER_URL = oThis.find('div.username').children('a').attr('href');
        if (USER_URL == undefined) {return false}
        var userImg = oThis.find('div.user-basic-info a');
        var memberTitle = oThis.find('p.desc.member_title');        
        var state = oThis.find('div.posthead .ipsBadge');
        
        /* Sets default avatar...
        if (userImg.find('img').length == 0) {
            userImg.html('<img src="http://i78.servimg.com/u/f78/18/17/62/92/defaul10.png" alt="User image">');
        }*/
        // field_id1 (Título) = First field added to the perfil!
        var oData = sessionStorage.getItem(USER_URL + '_Title_State'); // Read object from sessionStorage, more fast!
        if (oData !== null) {
            oData = JSON.parse(oData);
            memberTitle.text(oData.title);
            state.html(oData.state_text);
            state.attr('class', oData.state_class);
        } else {
            $.get(USER_URL, function(data){
                var info = oThis.find('div.user-basic-info').text();
                // var IsSuper = (info.search(/administrador/i) + 1) + (info.search(/moderador/i) + 1) + (info.search(/punbb/i) + 1);
                var userTitle = $.trim($('#field_id1', data).find('div.field_uneditable').text());
                var posts = $('#field_id-6', data).find('div.field_uneditable').text();
                // if (IsSuper <= 0) {
                if (info.search(/administrador/i) == 0 || info.search(/moderador/i) == 0 || info.search(/desenvolvedores/i) == 0 || info.search(/punbb/i) > 0) {
                    if(userTitle !== '-') {
                        memberTitle.text(userTitle);
                    } else {
                        memberTitle.text('Membro');
                    }
                } else {
                    if (posts <= 99){
                        memberTitle.text('Membro');
                    } else if (posts >= 100 && posts < 200) {
                        memberTitle.text('Membro Nível 1');
                    } else if (posts >= 200 && posts < 300) {
                        memberTitle.text('Membro Nível 2');
                    } else if (posts >= 300 && posts < 500) {
                        if(userTitle == '-') {memberTitle.text('Membro Nível 3');}
                    } else if (posts >= 500) {
                        if(userTitle == '-') {memberTitle.text('Membro Avançado');}
                    }
                }
                // sets state
                if($.trim($('#user_status', data).text()) == 'conectado') {
                    state.html('online').addClass('ipsBadge_green').removeClass('ipsBadge_lightgrey');
                }
                var oData = {title:memberTitle.text(),state_text:state.html(),state_class:state.attr('class')};
                // Saving object in sessionStorage
                sessionStorage.setItem(USER_URL + '_Title_State', JSON.stringify(oData));
            });
        }
    });
}

/***
* Load SCEditor only if requested!
* Functions: loadEditor(), runEditor(), insertIntoEditor()
* Version: 1.29102013-jq1.9.1
* Made by JScritp at www.punbb.forumeiros.com - 2013/10/29
*/    
var $editorLoaded = 0;
var account = '', id = '', f = "";
var dices = new Array();
var palette = 1;
var illiweb = "http://illiweb.com/";

function loadEditor(text_area, value) {
    if (text_area == '' || text_area == undefined) { text_area = $('#text_editor_textarea'); }
    if (value == '' || value == undefined) { value = ''; }
    if ($editorLoaded) return runEditor(text_area, value);
        
    $('#ajax_loading').show();
    loadFile('http://illiweb.com/rsc/85/frm/SCEditor/minified/themes/fa.default.min.css', 'css', 'fa.default');

    $executeJS('http://illiweb.com/rsc/85/frm/jquery/cookie/jquery.cookie.js', function(resp){
        $executeJS('http://illiweb.com/rsc/85/frm/SCEditor/src/jquery.sceditor.js', function(resp){
            /*$executeJS('http://illiweb.com/rsc/85/frm/SCEditor/src/plugins/bbcode.js', function(resp){*/
            $executeJS('https://googledrive.com/host/0BywKunb3ieyDRXhNMWk0VGt3anc/bbcode.js', function(resp){            
                runEditor(text_area, value);
                $editorLoaded = 1;
                return true;
            });
        });
    });
}
function runEditor(text_area, value) {
    if ( text_area.next('.sceditor-container').length ) return false;
    try
    {
        text_area.sceditor({
            locale: "pt",
            height: "250px",
            width: "auto",
            plugins: "bbcode",
            toolbar: "bold,italic,underline,strike|left,center,right,justify|quote,code,faspoiler,fahide|servimg,image,link,youtube|size,color,font,removeformat|emoticon,date,time,maximize,source",
            parserOptions: {
                /*breakAfterBlock: false,
                removeEmptyTags: false,
                fixInvalidNesting: false,
                fixInvalidChildren: false*/
            },
            style: "http://illiweb.com/rsc/85/frm/SCEditor/minified/jquery.sceditor.default.min.css",
            rtl: false,
            emoticonsEnabled: true,
            emoticonsCompat: true,
            emoticonsRoot: "",
            emoticonsURL: "/smilies.forum?f=9&mode=smilies_frame&t=1383011440"
        });
        if (value !== '') {
            text_area.sceditor('instance').val(value);
            text_area.sceditor("instance").toggleSourceMode();
            // $.sceditor.ShowHideToolbarElements();
        }
        text_area.sceditor("instance").focus();
        $("a.sceditor-button-source").addClass("hover");
        
        var container = $('.sceditor-container');
        var ciframe = container.find('iframe');
        var ctextarea = container.find('textarea');
        ciframe.width(ciframe.width() - 9);
        ctextarea.width(ctextarea.width() - 9);
        $('#ajax_loading').hide();
    } catch(e) { if( typeof(console) != 'undefined' ) { console.error(e); } }    
}
function insertIntoEditor(text) {
    try
    {
        var editor = $("#text_editor_textarea").sceditor("instance");
        if( (text == null) || (typeof(text) == 'undefined') ) { text = ""; }
        if( editor && (text.length > 0) ) { editor.insert(text + '\u00a0'); }
    } catch(e) { if( console ) { console.error(e); } }
}

var text_editor_textarea = $('#text_editor_textarea');
loadEditor(text_editor_textarea, '');

/***
* Fast reply without refresh window!
* Function: fastReply()
* Version: 1.28082013-jq1.9.1
* Made by JScritp at www.punbb.forumeiros.com - 2013/08/27
*/
function fastReply() {
    var signature = "1", lt = '';
    var user_Msg = $("#text_editor_textarea").sceditor('instance').val();
    if (user_Msg == '') { alert('Não há mensagem para ser enviada!'); return false; }
    $('#ajax_loading').show();
    var send_txt = "Enviar";
    $.post("/post", {
        t: N_TOPIC_ID,
        mode: 'reply',
        message: user_Msg,
        attach_sig: signature,
        notify: "0",
        post: send_txt 
    }).done(function(){
        if (!$('#first-post-br').length) {
            var amount = $('.main-content.topic:eq(0) .post').length;
            var lastVisibleMsg = $('.main-content.topic:eq(0)').find('.post:last').children('a:first').attr('name');
        } else {
            var amount = $('.main-content.topic:eq(1) .post').length;
            var lastVisibleMsg = $('.main-content.topic:eq(1)').find('.post:last').children('a:first').attr('name');
        }       
        if (amount >= 14) { return window.location.href = TOPIC_ID + 'p' + amount + '-'; }
        $.ajax({
            url: window.location,
            type: 'GET', cache: false, dataType: 'text'
        }).done(function(resp) {
            var regex=new RegExp('<a\\sname="END_' + lastVisibleMsg + '"></a>([\\s\\S]*?)<a\\sname="END_postrow"></a>', 'im');
            $('a[name="END_' + lastVisibleMsg + '"]').after(regex.exec(resp)[1]);
            showTitleAndState();
            var tagCode = $('code');
            // if (tagCode.lenght) {
            tagCode.each(function () {
                var sContent = $(this).html();
                var codebox = $(this).parent().parent();
                codebox.before('<div class="punbbtop">PunBB &nbsp; &nbsp; &nbsp; &nbsp;<button onclick="punbbExpand(this); return false;">expand</button><button style="display: none" onclick="punbbCollapse(this); return false;">collapse</button>&nbsp; <button onclick="punbbSelect(this); return false;">select</button>&nbsp; <button onclick="punbbPopup(this); return false;">popup</button>&nbsp; <button style="margin-right: 50px; float: right;" onclick="punbbAbout(this); return false;">?</button></div><pre class="highlight punbb_block">' + sContent + '</pre>');
                codebox.remove();
            });                    
            $('html,body').animate({
                scrollTop: $('a[name="END_' + lastVisibleMsg + '"]').offset().top
            }, 100);
            $("#text_editor_textarea").sceditor('instance').val('');
            $('#ajax_loading').hide();
        });
    });
}
/***
* Fast edit post!
* Function: fastEditMsg(msgID, post_ID);
*/
fastEditMsg = function(msgID, post_ID){
    if (isNaN(post_ID) || ($('#post_' + post_ID).length == 0) ) {return false}  
    $('#ajax_loading').show();
    sOldMsg = $('#' + msgID).html();
    user_Msg = '';
    
    var sHtml = '<div class="main-content topic">' +
        '<div class="post">' +
            '<div id="editor_' + post_ID + '">' +
                '<textarea cols="9" id="text_editor_textarea_' + post_ID + '" name="message" onclick="storeCaret(this)" onkeyup="storeCaret(this)" onselect="storeCaret(this)" rows="15" style="width: 98%;" tabindex="3" wrap="virtual">' +
                '</textarea>' +
                '<div class="row2 ipsPad ipsText_small desc">' +
                    'Razão para editar: <input type="text" value="" name="post_edit_reason_' + post_ID + '" id="post_edit_reason_' + post_ID + '" class="input_text" maxlength="250" size="35">&nbsp;' +
                    '<input type="checkbox" value="1" id="add_edit_' + post_ID + '" name="add_edit_' + post_ID + '"> <label for="add_edit_' + post_ID + '">Mostrar \'Editado por\'</label>' +
                '</div>' + 
                '<fieldset class="submit" style="font-size: 13px !important; padding: 15px 6px; text-align: center; border: 0 none; background-color: #D1DDEA;">' +
                    '<input class="ipsButton" name="post" tabindex="6" type="button" value="Salvar Alterações" onclick="fastEditSave(' + post_ID + ', subject)">&nbsp;' +
                    '<a class="input_submit alt" href="/post?p='+ post_ID + '&mode=editpost">Usar Editor Completo</a>' +
                    ' ou ' +
                    '<a class="cancel" title="Cancelar" href="javascript:void(0);" onclick="document.getElementById(\'' + msgID + '\').innerHTML=sOldMsg;">Cancelar</a>' +
                '</fieldset>' +
            '</div>' +
        '</div>' +
    '</div>';
    $('#' + msgID).html(sHtml);
    
    var text_area = $('#text_editor_textarea_' + post_ID);
    text_area.val(sOldMsg.replace(/<br\s?\/?>/g,"\n"));
    loadEditor(text_area, '');
    
    $.get("/post?p=" + post_ID + "&mode=editpost", function(data) {
        subject  = $(data).find('input[name="subject"]').val();        
        var user_Msg = $(data).find('#text_editor_textarea[name="message"]').val();
        text_area.val(user_Msg);
        text_area.sceditor('instance').val(user_Msg);
    });
    $('html,body').animate({
        scrollTop: $('#post_' + post_ID).offset().top
    }, 1200);
};
/***
* Fast edit post!
* Function: fastEditSave(post_ID);
*/
fastEditSave = function(post_ID) {
	if (isNaN(post_ID) || ($('#post_' + post_ID).length == 0) ) {return false}    
    $('#ajax_loading').show();
    var text_area = $('#text_editor_textarea_' + post_ID);
    var edit_reason = '', send_txt = "Enviar";
    text_area.sceditor("instance").toggleSourceMode();
    var user_Msg = text_area.sceditor('instance').val();
    var sHtml = text_area.sceditor('instance').getSourceEditorValue();
    
    if($('#add_edit_' + post_ID).is(':checked')) {
        edit_reason = $('#post_edit_reason_' + post_ID).val();
        /*$('#edit_' + post_ID).html('<strong>Editado por ' + USERNAME + '</strong><br><span class="reason">' + edit_reason + '</span>');
        \(.*?:(.*?)\) */
    }

    $('#message_' + post_ID).html(sHtml);
    if (sHtml.indexOf('<code>') !== -1) {
        var tagCode = $('#message_' + post_ID + ' > code');
        var sContent = tagCode.html();
        tagCode.before('<div class="punbbtop">PunBB &nbsp; &nbsp; &nbsp; &nbsp;<button onclick="punbbExpand(this); return false;">expand</button><button style="display: none" onclick="punbbCollapse(this); return false;">collapse</button>&nbsp; <button onclick="punbbSelect(this); return false;">select</button>&nbsp; <button onclick="punbbPopup(this); return false;">popup</button>&nbsp; <button style="margin-right: 50px; float: right;" onclick="punbbAbout(this); return false;">?</button></div><pre class="highlight punbb_block">' + sContent + '</pre>');
        tagCode.remove();
        jQuery.getScript('http://balupton.github.io/jquery-syntaxhighlighter/scripts/jquery.syntaxhighlighter.min.js', function () {
            jQuery.SyntaxHighlighter.init({
                'wrapLines': false
            })
        })
    }

    $.post("/post", {
        p: post_ID,
        mode: 'editpost',
        subject: subject,
        message: user_Msg,
        edit_reason: edit_reason,
        attach_sig: '1',
        notify: "0",
        post: send_txt 
    }).done(function(){
        $('#ajax_loading').hide();
    }).fail(function(){
        $('#message_' + msgID).html(sOldMsg);
        alert('Atenção!\n\n Ocorreu um erro ao salvar a edição do post, aguarde 10 segundos e tente editar novamente!');
    });
    $('html,body').animate({
        scrollTop: $('#post_' + post_ID).offset().top
    }, 1200);    
};

/***
* Fast delete post!
* Function: postDelete(post_ID)
*/
function postDelete(post_ID) {
    var choice = confirm("Tem certeza de que deseja remover esta mensagem?");
    if (choice){
        $.post('/post', {
            p: post_ID,
            mode: "delete",
            confirm: "Sim"
        }).always(function() {
            $('#post_' + post_ID).remove();
            $('html,body').animate({
                scrollTop: $('.post:last').offset().top
            }, 1200);                
        });
    }
};

/***
* Fast hide post!
* Function: hide_post(post_ID, flag)
*/    
function hide_post(post_ID, flag) {
    if (flag == '' || flag == undefined) {
        flag = 0;
    }
    if (flag) {
        var choice = confirm("Tem certeza de que deseja ocultar esta mensagem? \nEla somente será vista por você e os administradores!");
        if (!choice){ return false }
        var edit_reason = "HIDE_POST";
        var signature = '0';
    } else {
        var edit_reason = "";        
        var signature = '1';
    }
    
    $.get("/post?p=" + post_ID + "&mode=editpost", function(data) {
        var subject  = $(data).find('input[name="subject"]').val();        
        var user_Msg = $(data).find('#text_editor_textarea[name="message"]').val();
        var send_txt = "Enviar";
        $.post("/post", { /* or "/post?p=" + post_ID + "&mode=editpost" */
            p: post_ID,
            mode: 'editpost',
            subject: subject,
            message: user_Msg,
            edit_reason: edit_reason,
            attach_sig: signature,
            notify: "0",
            post: send_txt 
        }).done(function(){
            var oThis = $('#post_' + post_ID);
            if (flag) {
                oThis.css('background-color', '#F8F1F3');
                oThis.find('div.postmain').css('background-color', '#F8F1F3');
            } else {
                oThis.css('background-color', '#FFFFFF');
                oThis.find('div.postmain').css('background-color', '#FFFFFF');
            }
            $('#hide_post_' + post_ID).toggle();
            $('#restore_post_' + post_ID).toggle();
        });
    });
}
/***
* Show new topic in ShoutBox!
* Function: shoutMyTopic()
*/ 
function shoutMyTopic() {
    return false
    if (sessionStorage.getItem('shoutMyTopic')) {return false}
    var date = new Date();
    var UID = Math.ceil(date.getDate() + date.getHours() + Math.random() * Math.pow(10, 17) + date.getMinutes() + date.getSeconds() + date.getMilliseconds());
    if (UID.length < 17) {
        UID + '' + (17 - UID.length);
    }
    var userData = '[table class=\"userdata\" data-uid="' + UID + '" data-news=\"Notícia (News)\" style="display: none;"][tr][td]http://i78.servimg.com/u/f78/18/17/62/92/shout10.png[/td][/tr][/table]';
    var forum = $('.pun-crumbs').find('.nav:eq(2)').text();
    var msg_sent = USERNAME + '[/b] postou um novo tópico: ' + window.location + ' em ' + forum + '[/i]' + userData;
    /*
    var msg_sent = '[i][b]' + USERNAME + '[/b] postou um novo tópico: [url=' + window.location + ']' + TOPIC_TITLE + '[/url] em [url=' + window.location + ']' + forum + '[/url] ![/i]' + userData;
    */
    msg_sent = encodeURIComponent(msg_sent);
    $.post('/chatbox/chatbox_actions.forum?archives=1', 'mode=send&sent=' + msg_sent);
    sessionStorage.setItem('shoutMyTopic', USERNAME);
}
/***
* AJAX Request from server
*/
function $get(url, callback) {
    $.ajax({
        type: 'GET',
        url: url,
        cache: false,
        dataType: 'text',
        success: callback
    })
}
/***
 * Topic Active Users (Who is read this topic?)!
 * Only one request per session to read member profile to get info!
 * Made and Optimizations by JScript - 2013/07/12
 */
$(window).load(function() {
    var total_users = 0, last_views = '';
    var WereIam = '', target = 0;
    var pathname = location.pathname;
    var storListViews = pathname;
    var storTotalView = pathname + '_views';
        
    $.get('/forum', function (data) {
        target = $('#logged_in_user_list', data).find('a');
        if (target.length == 0) {
            target = $('#onlinelist').find('p:eq(1)').find('a');
        }
    }).always(function() {
        var len = target.length;
        if (len == 0) {return false}
        var guest = Math.floor((Math.random()*2)+1);
        $('#topic_total_visit').text(guest);
        
        searchActiveUsers(target, 0, len, 0, guest);
    });

    function searchActiveUsers(target, start, len, index, guest){
        if (index == len) {
            if (_userdata.session_logged_in) {
            $('#topic_list_views').html('');
            last_views = localStorage.getItem(storListViews);
            if (last_views) {
                $('#topic_list_views').html(last_views);
                $('#topic_total_views').text(localStorage.getItem(storTotalView));
            }
            }            
            return false
        }
        var oThis = $(target[index]);
        var USER_ID = oThis.attr('href');

        if ((USER_ID !== undefined) || (USER_ID.length !== 0)) {
            var user_name = '<a href="' + USER_ID + '">' + oThis.html() + '</a>';
                    
            $.get(USER_ID, function (data) {
                WereIam = $('#field_id3', data).find('div.field_uneditable').text();
            }).always(function() {
                if (WereIam == pathname) {
                    if (total_users == 0) {
                        $('#topic_list_users').html('');
                        $('#topic_list_users').append(user_name);
                    } else {
                        $('#topic_list_users').append(', ' + user_name);
                    }
                    total_users++;
                    $('#topic_total_users').text(total_users + guest);
                    $('#topic_total_members').text(total_users);
                    if (_userdata.session_logged_in) {
                    last_views = localStorage.getItem(pathname);
                    if (last_views) {
                        if (last_views.indexOf(USER_ID) == -1) {
                            localStorage.setItem(storListViews, last_views + ', ' + user_name);
                            var storValue = localStorage.getItem(storTotalView);
                            if (storValue == null) storValue = 0;
                            localStorage.setItem(storTotalView, parseInt(storValue) + 1);
                        }
                    } else {
                        localStorage.setItem(storListViews, user_name);
                        localStorage.setItem(storTotalView, 1);
                    }
                    }
                }
                index++;
                try {
                    searchActiveUsers(target, start, len, index, guest);
                } catch (e) {
                    // console.log(index);
                }                    
            });
        }
    }
});
$(function () {
    var edit = $('.edit')
    var len = edit.length;
    for (edit, i = 0, l = len; i < l; i++) {
        var rep = edit[i].innerHTML;
        if (rep !== null) {
            if (edit[i].innerHTML.indexOf('(Razão') !==-1) {
                rep = rep.replace(/<br><br>Última\sedição\s(.*?)\s\(Razão\s:\s(.*?)\)/g, '<strong>Editado $1.</strong><br>$2');
            } else {
                rep = rep.replace(/<br><br>Última\sedição\s(.*?)$/g, '<strong>Editado $1.</strong>');
            }        
            edit[i].innerHTML = rep;
        }
    }
	$(document).on('click', function (e) {
		$(e.target).closest('.spoiler,.spoiler_content').filter('.spoiler').find('.spoiler_content:first,.spoiler_closed:first').toggleClass('hidden');
	})
});
