module.exports = function (element) {
    if (element.business_status !== 'OPERATIONAL') {
        return;
    }
    return element.place_id;
}
