import { google_client_id, facebook_app_id } from '../static/config'
import { initGoogleInst } from './public'

/**
 * Google SDK init
 * https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams
 */
setTimeout(() => {
  window.gapi.load('auth2', async () => {
    await window.gapi.auth2.init({
      client_id: google_client_id,
    })
    initGoogleInst()
  });
}, 0)

/**
 * Facebook SDK init
 */
window.fbAsyncInit = function () {
  FB.init({ appId: facebook_app_id, cookie: true, xfbml: true, version: 'v13.0' });
  FB.AppEvents.logPageView();
};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));