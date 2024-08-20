const { Axios } = require('axios');
var dotenv = require('dotenv');
const { ClientRequest } = require('http');
var jsdom = require('jsdom').JSDOM;
var axios = require('axios').default;
var http = require('http');

axios.defaults.withCredentials = true;
axios.defaults.maxRedirects = 0;


var birthday = dotenv.config().parsed.birthday
var id = dotenv.config().parsed.id_number;
var school = dotenv.config().parsed.school_number;

var main = async () => {
    var main_page = await axios.get("https://service202-sds.fcu.edu.tw/tuition/infologin.aspx");
    var dom = new jsdom(main_page.data);
    var view_state = dom.window.document.querySelector("#__VIEWSTATE").value;
    var view_state_generator = dom.window.document.querySelector("#__VIEWSTATEGENERATOR").value;
    var event_validation = dom.window.document.querySelector("#__EVENTVALIDATION").value;

    var form_data = new FormData();
    form_data.append("TextBoxStuBd", birthday);
    form_data.append("TextBoxStuIdNo", id);
    form_data.append("TextBoxStuId", school);
    form_data.append("__VIEWSTATE", view_state);
    form_data.append("__VIEWSTATEGENERATOR", view_state_generator);
    form_data.append("__EVENTVALIDATION", event_validation);
    form_data.append("ButtonLogin", "登入");

    var url = '';
    try{
        await axios.post("https://service202-sds.fcu.edu.tw/tuition/infologin.aspx", form_data);
    }
    catch(err){
        var html = err.response.data;
        url = html.split('a href="')[1].split('">')[0].replaceAll("&amp;", "&");
        url = `https://service202-sds.fcu.edu.tw${url}`;
    }

    return url;
}

http.createServer(async function(req, res){
    var redirectUrl = await main();
    res.writeHead(302, { 'Location': redirectUrl });
    res.end();
}).listen();



