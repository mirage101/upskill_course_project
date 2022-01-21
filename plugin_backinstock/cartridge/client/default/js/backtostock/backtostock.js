'use strict';

var formValidation = require('base/components/formValidation');

module.exports = {
    backtostock: function () {
        $('form.backtostock-form').submit(function (e) {
            var $form = $(this);
            e.preventDefault();
            var url = $form.attr('action');
            $form.spinner().start();
            $('form.backtostock-form').trigger('backtostock:submit', e);
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: $form.serialize(),
                success: function (data) {
                    $form.spinner().stop();
                    if (!data.success) {
                        formValidation($form, data);
                        $('.notifymeinstock-msg-error').hide();
                        $('.notifymeinstock-body').append('<p class="notifymeinstock-msg-error">' + data.receivedMsgBody + '</p>');
                    } else {
                        var oldTitle = $('.notifymeinstock-title').text();
                        var inputPhone = $('.notifymeinstock-body').html();
                        $('.notifymeinstock-msg-error').hide();
                        $('#submitNotifyMeButton').hide();
                        $('.notifymeinstock-title').text(data.receivedMsgHeading).addClass('notifymeinstock-msg-success');
                        $('.notifymeinstock-body').empty()
                            .append('<p>' + data.receivedMsgBody + '</p>');
                        //close after 5sec
                        setTimeout(function(){
                            $('#notifyMeBackToStockModal').hide();
                            
                            $('.modal-backdrop').hide();
                            $('.notifymeinstock-title').removeClass('notifymeinstock-msg-success').delay(200).text(oldTitle);
                            $('.notifymeinstock-body').empty()
                            .append(inputPhone);
                            $('#submitNotifyMeButton').show();
                            $('body').removeClass('modal-open');
                        }, 5000);
                    }
                },
                error: function (err) {
                   $form.spinner().stop();
                }
            });
            return false;
        });
    },

};
