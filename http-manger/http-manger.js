const querystring = require('querystring');
const request = require('request');
const needle=require('needle');
const post_request = (url,body,headers)=>{
    const formData = querystring.stringify(body);
    return new Promise((resolve,reject)=>{
        request({
            uri: url,
            body: formData ,
            headers: headers,
            method: 'POST',
            json: true
          },(error,response,body)=>{
            if(response.statusCode==200){
                resolve(response.body);
            }else{
                reject(response);
            }
        });
    });
}

const get_request = (url,headers)=>{
    console.log(url);
    return new Promise(async(resolve,reject)=>{
        const apiRes = await needle('get',url,{headers});
        if(apiRes.statusCode==200){
            resolve(apiRes.body);
        }else{
            reject(apiRes);
        }
    });
}

const post_request_for_youtube = (url,body,headers)=>{
    return new Promise((resolve,reject)=>{
        request({
            uri: url,
            headers: headers,
            method: 'POST',
            json: body
          },(error,response,body)=>{
            console.log(response.statusCode);
            console.log(response.body);
            if(response.statusCode==200){
                resolve(response.body);
            }else{
                reject(response);
            }
        });
    });
}
module.exports={get_request,post_request,post_request_for_youtube};