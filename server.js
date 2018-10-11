var PORT=8080;    //端口
var DIR='test';   //用作测试的入口目录

var http=require('http');
var url=require('url');
var fs=require('fs');
var mime=require('./mime').types;//媒体查询类型;
var path=require('path');

var server=http.createServer(function(request,response){
      var pathname=url.parse(request.url).pathname;
      var realPath=path.join(DIR,pathname);
      var ext=path.extname(realPath);
      ext=ext?ext.slice(1):'unknown';
      fs.exists(realPath,function(exists){
           if(!exists){
               response.writeHead(404,{
                     'Content-Type':"text/plain"
               });

           response.write("This request URL"+pathname+"was not found on this server");
           response.end();
        }else{
            fs.readFile(realPath,'binary',function(err,file){
                if(err){
                    response.writeHead(404,{
                        'Content-Type':"text/plain"
                    });
                    response.end(err);
                }else{
                    var contentType=mime[ext] ||'text/plain';//Js的||返回第一个不为假的值
                    response.writeHead(200,{
                        "Content-Type":contentType
                    });
                    response.write(file);
                    response.end();
                }
            });
        }
      });
});
server.listen(PORT);
console.log("Server running at port:"+PORT+'.');
