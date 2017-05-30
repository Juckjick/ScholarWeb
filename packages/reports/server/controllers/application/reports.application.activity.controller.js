/**
 * Getting activity information
 * @param  {Object} data from DB based of UserID and Version
 * @return {Array} of generated contents
 */
exports.getActivity = function(data) {
    var contents = [],
        header, activity; 

    header = {
        text: '6. กิจกรรมนอกหลักสูตรภายในและภายนอกมหาวิทยาลัย\n',
        style: 'header'
    };        

    activity = {};
    activity.style = 'linespace';
    activity.text = [
        '6.1 ภายในมหาวิทยาลัย\n',
        '- กิจกรรมของมหาวิทยาลัย: ',
        data.UserActivity[0].university,
        '\n- กิจจกรมของคณะ: ',
        data.UserActivity[0].faculty,
        '\n\n6.2 ภายนอกมหาวิทยาลัย\n',
        data.UserActivity[0].outside
    ];


    contents.push(header);
    contents.push(activity);
    return contents;

};
