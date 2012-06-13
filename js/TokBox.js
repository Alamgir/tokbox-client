/**
 * Created by JetBrains WebStorm.
 * User: pufferman
 * Date: 6/9/12
 * Time: 6:36 PM
 * To change this template use File | Settings | File Templates.
 */
if(!window.TokBox)
    window.TokBox = {};

TokBox.req_token = function() {
    $.ajax({
        type: "POST",
        url: "https://api.dropbox.com/1/oauth/request_token",
        dataType: "jsonp",
        data: {
            "oauth_consumer_key": "balh",
            "oauth_signature_method": "RSA-SHA1",
            "oauth_signature": "balh",
            "oauth_timestamp": "blah",
            "oauth_nonce": "balh",
            "oauth_version": "1.0"
        }
    })
}