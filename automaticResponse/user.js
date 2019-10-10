const titbit = require("titbit");
const wxmsg = require("./wxsmg");
const parsexml = require("xml2js").parseString;
var app = new titbit();

// app.router.get('/wx/hello', async c => {
//     var token = 'msgtalk';

//     var urlargs = [
//         c.query.nonce,
//         c.query.timestamp,
//         token
//     ];

//     urlargs.sort();  //字典排序

//     var onestr = urlargs.join(''); //拼接成字符串
    
// 	//生成sha1签名字符串
//     var hash = crypto.createHash('sha1');
//     var sign = hash.update(onestr);
		
//     if (c.query.signature === sign.digest('hex')) {
//         c.res.body = c.query.echostr;
//     }
// });

app.router.post("/wx/hello",async c=>{
    try {
        let data = await new Promise((rv,rj)=>{
            parsexml(c.body,{explicitArray:false},(err,result)=>{
                if(err){
                    rj(err);
                }else{
                    rv(result.xml);
                };
            })
        });

        //构造需要的数据
        let retmsg = {
            touser  : data.FromUserName,
            fromuser: data.ToUserName,
            msgtype : '',
            msgtime:  parseInt(Date.now()/1000),
            msg    :  data.Content
        };

        //交给消息派发函数进行处理
        c.res.body = wxmsg.msgDispatch(data,retmsg);

    } catch (error) {
        console.log(error);
    }
});

app.run(8002,'localhost');