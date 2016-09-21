function getUserId() {
    var url = window.location.href;
    return url.substring(url.indexOf("=") + 1, url.length);
}
function get_action_user(form) {
    form.action = "/challenge_user?uid=" + getUserId();
}
function get_action_comp(form) {
    form.action = "/challenge_comp?uid=" + getUserId();
}