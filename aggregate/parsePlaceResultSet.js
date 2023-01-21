module.exports = function (element) {
    if (element.business_status !== 'OPERATIONAL') {
        return;
    }
    console.log(element.place_id);
    console.log(element);
    return;
}
