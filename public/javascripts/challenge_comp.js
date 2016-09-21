function getUserId() {
    var url = window.location.href;
    return url.substring(url.indexOf("=")+1, url.length);
}
function playUrl(form) {
    form.action = "/challenge_comp/play?uid=" + getUserId();
}