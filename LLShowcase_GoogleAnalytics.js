window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
gtag('set', 'metric1', getCookie('ids').split(':')[0]);
gtag('js', new Date());
gtag('config', 'UA-115321653-1');