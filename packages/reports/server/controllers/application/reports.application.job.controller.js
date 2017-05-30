exports.getJob = function(data) {
    var contents = [],
        job = {},
        header;

    // Header
    header = {
        text: '\n9. หากสำเร็จการศึกษาแล้ว ข้าพเจ้ามีความตั้งใจจะประกอบอาชีพ\n',
        style: 'header'
    };

    job.text = [
        '- ' + data.UserProfile[0].Job.name
    ];

    // In case of 'อื่นๆ'
    if (data.UserProfile[0].JobId === 6) {
        job.text = job.text.concat([' ' + data.UserProfile[0].JobNote]);
    }

    job.style = 'linespace';

    contents.push(header);
    contents.push(job);

    return contents;
};
