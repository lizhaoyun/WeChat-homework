const formatMsg = require("./fmtwxmsg");

function help(){
    return "你好这是微信测试号，会原样返回用户消息。";
}


/**
 *  处理用户发过来的消息
 *  第一个参数是解析后的用户消息，第二个参数是要返回的消息对象
 *  基本处理过程：
 *      根据用户发过来的消息判断消息类型并进行处理
 */

function userMsg(wxmsg,retmsg){
    //关键词自动回复
    if(wxmsg.MsgType === 'text'){
        retmsg.msgtype = 'text';    //设置要返回的消息类型为text
        
        switch(wxmsg.Content){
            case "help":
            case '?':
            case '? ':
            case '帮助':
                retmsg.msg = help();
                return formatMsg(retmsg);   //格式化消息并返回
            case 'about':
                retmsg.msg = '我是测试号的开发者';
                return formatMsg(retmsg);
            case 'who':
                retmsg.msg = '开发者：李召云\r\n学号：2017011854'
                return formatMsg(retmsg);
            default:
                //非关键词原样返回消息
                retmsg.msg = wxmsg.Content;
                retmsg.msgtype = wxmsg.MsgType;
                return formatMsg(retmsg);
        }
    }
    else{
         //非文本类型的消息处理
        switch(wxmsg.MsgType){
            case 'image':
            case 'voice':
                retmsg.msgtype = wxmsg.MsgType;
                retmsg.msg = wxmsg.MediaId;
                return formatMsg(retmsg);
            default:
                //因为消息类型为空，所以会返回默认的文本消息
                //提示类型不被支持
                return formatMsg(retmsg);
        }
    }
   
}



function eventMsg(wxmsg,retmsg){
    //默认让返回消息类型为文本
    retmsg.msgtype ='text';
    switch(wxmsg.Event){
        case 'subscribe':
            retmsg.msg="你好，这是个测试号，感谢您关注";
            return formatMsg(retmsg);
        case 'unsubscribe':
            console.log(wxmsg.FromUserName,"取消关注");
            break;
        case "VIEW":
            console.log(wxmsg.EventKey);
            break;
        case "CLICK":
            retmsg.msg=wxmsg.EventKey;
            return formatMsg(retmsg);
        default:
            return  '';
    }
    return '';
}
exports.help = help;
exports.userMsg = userMsg;
exports.msgDispatch = function msgDispatch(wxmsg,retmsg){
    if(wxmsg.MsgType==="event"){
        return eventMsg(wxmsg,retmsg);
    }
    return userMsg(wxmsg,retmsg);

};