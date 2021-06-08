export function sendAlert(message, status) {
    window.location.href = './error' + status + '.html' + "?message=" + message
    //console.log(document)
}