    //<![CDATA[
    jQuery(document).ready(function(){
        var target = $('.post:first');
        target.find('div.postbody').find('strong:contains("Relembrando a primeira mensagem")').closest('div.main-content.topic').hide();
        var imgdata = target.find('div.user-basic-info');
        var autor_dat = target.find('div.username');
        var autor_url = autor_dat.attr('href');
        var autor_txt = autor_dat.text();
        var date = target.find('span.data-post').html();
        var topic_title = '{TOPIC_TITLE}';
        var tags = topic_title.split(' ');
        var follow = '{S_WATCH_TOPIC}';
        
        $('.ipsUserPhotoLink.left').attr('href', imgdata.find('a').attr('href'));
        $('.ipsUserPhoto.ipsUserPhoto_medium').attr('src', imgdata.find('img').attr('src'));
        $('span[itemprop="creator"]').find('a').attr('title', autor_txt).attr('href', autor_url);
        $('span[itemprop="name"]').text(autor_txt);
        $('span[itemprop="dateCreated"]').html(date);
        
        /* Eliminar valores duplicados en el array!
         -> Si usted encuentra algo mejor que esto, por favor suguieralo.*/
        tags = tags.filter(
            function(a){
                if (!this[a]) {
                    this[a] = 1;
                    return a;
                }
            }
        );
        /* Establece búsqueda de etiquetas ...*/
        $.each(tags, function(index, data) {
            if(data.length > 4) {
                $('#tags_search').append(
                    '<a id="tag_search_' + index + '" class="ipsTag" title="Localizar mas Aportes con la tag ' + data + '" href="/search?search_keywords=' + data + '">' +
                    '    <span>' + data + '</span>' +
                    '</a>'
                );
            }
        });
        /* Whatch topic */
        <!-- BEGIN switch_user_logged_in -->
        
        <!-- END switch_user_logged_in -->
        
        var target = $('.main-content.topic').find('div.post');
        target.each(function(index) {
            var oThis = $(this);
            var userImg = oThis.find('div.user-basic-info a');
            var memberTitle = oThis.find('p.desc.member_title');
            var urlID = oThis.find('.username a').attr('href');
            var target = oThis.find('div.user-basic-info').text();
            var IsSuper = (target.search(/administrador/i) + 1) + (target.search(/moderador/i) + 1) + (target.search(/punbb/i) + 1);
            /* Sets default avatar... */
            if (userImg.find('img').length == 0) {
                userImg.html('<img src="http://i78.servimg.com/u/f78/18/17/62/92/defaul10.png" alt="User image">');
            }
            /* field_id1 (Título) = First field added to the perfil! */
            $.get(urlID, function(data){
                var userTitle = $.trim($('#field_id1', data).find('div.field_uneditable').text());
                var posts = $('#field_id-6', data).find('div.field_uneditable').text();
                if (IsSuper <= 0) {
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
                } else {
                    if(userTitle != '-') {memberTitle.text(userTitle);}
                }
                /*conjuntos de estado*/
                /*console.log($.trim($('#user_status', data).text()));*/
                if($.trim($('#user_status', data).text()) == 'conectado') {
                    oThis.find('span.ipsBadge').html('online').addClass('ipsBadge_green').removeClass('ipsBadge_lightgrey');
                } else {
                    oThis.find('span.ipsBadge').html('offline').addClass('ipsBadge_lightgrey').removeClass('ipsBadge_green');
                };
            });
        });
    });
    /* Editar Mensajes*/
    function edit_message(topic_ID, post_ID){
        /* This load and read all form fields ¯| */
        $('#' + topic_ID).load('/post?p=' + post_ID + '&mode=editpost' + ' .main .frm-form', function() {
            var msgID = $('#' + topic_ID);
            msgID.find('.main-head.clearfix').remove();
            msgID.find('.frm-set.multi > dl').hide();
            msgID.find('#textarea_content dt:last').show();
            msgID.find('.frm-set.multi').css('border-bottom', '0px');
            msgID.find('.frm-set > dl').hide();
            msgID.find('.frm-buttons').css('border-top', '0');
            msgID.find('.main').hide();
            msgID.find('.frm-form').attr('target','iframe_' + post_ID).submit(function(){var time=setTimeout("edited()",1000);});
            msgID.find('input[name=post]').css('margin-left', '-225px');
            msgID.find('input[name=preview]').css('margin-left', '120px').attr('value', 'Cancelar');
        });
    }
    function edited(){window.location.reload()}      
    //]]>