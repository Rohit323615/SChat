const moment=require('moment');

function data(username,text)
{
    return {
        username,
        text,
        date:moment().format('h:mm a')
    };
}

module.exports=data;
