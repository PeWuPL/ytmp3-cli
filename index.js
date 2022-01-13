const readline = require('readline');
const https = require('https');
const FormData = require('form-data');
const util = require("util");
const exec = require("child_process").exec;
const fs = require("fs");
const rl = readline.createInterface({
 	input: process.stdin,
	output: process.stdout
});
var form = new FormData();
var baseHost = "66.90.84.66.sslip.io";
var videoURL = '';
var resultObject={};
//Desanitizing URL to URI
function sanitize(text) {
	text=text
		.replace(/:/g,"%3A")
		.replace(/\//g,'%2F')
		.replace(/\?/g,'%3F')
		.replace(/\=/g,'%3D');
	return text;
}

//1. Entering link
rl.question("Enter yt link: \033[1;32m", (ans)=>{
	videoURL=ans;
	process.stdout.write("\033[0m");
	//Link empty
	if(videoURL=="") {
		console.error("\033[0;41m[ERR]\033[0m No link provided.");
		process.exit(-1);
	}
	let opts = {
		host:baseHost,
		port:443,
		path:"/newp",
		method:"POST",
		headers: form.getHeaders()
	}
	process.stdout.write("PROCESSING...\r");
	var req = https.request(opts,(res)=>{
		let datachunks="";
		res.on('data',(d)=>{
			datachunks+=d;
		});
		res.on('end',()=>{
			process.stdout.write(" ".repeat(13)+"\n");
			resultObject=JSON.parse(datachunks);
			if(resultObject["data"]===null) {
				process.stdout.write("\033[1;33m==============\033[0mERROR OCCURED\033[1;33m================\033[0m\n");
				process.stdout.write("\033[0;32mStatus Code:	\033[0m"+resultObject["status"]+"\n");
				process.stdout.write("\033[0;32mMessage:	\033[0m"+resultObject["message"]+"\n");
			}
			if(resultObject["data"]!==null) {
				var title = resultObject["data"]['title'];
				process.stdout.write("\033[1;33m===============\033[0mCONVERSION INFO\033[1;33m===============\033[0m\n");
				process.stdout.write("\033[0;35mTitle: \033[0m"+resultObject["data"]["title"]+"\n");
				process.stdout.write("\033[0;35mDuration: \033[0m"+resultObject["data"]["duration"]+"\n");
				let mp3link = resultObject["data"]["mp3"];
				let mp4link = resultObject["data"]["mp4"];
				let fileSize = 0;
				let fileSize2 =0;
				let X = https.request({method: "GET", host:baseHost, path: mp3link, port: 443},res2=>{
					res2.on('data',()=>{
						fileSize = res2.headers["content-length"];
						process.stdout.write("\033[0;35mAudio Size: \033[0m"+(fileSize/1000000).toFixed(2)+" MB\n");
						res2.connection.destroy();
						let Y = https.request({method:"GET", host:baseHost, path:mp4link, port:443},res3=>{
							res3.on('data',()=>{
								fileSize2=res3.headers["content-length"];
								process.stdout.write("\033[0;35mVideo Size: \033[0m"+(fileSize2/1000000).toFixed(2)+" MB\n");
								res3.connection.destroy();
            process.stdout.write("\033[0;36m/////////////////\033[0mDOWNLOAD\033[0;36m////////////////////\033[0m\n");
				    process.stdout.write("\033[0;42m[1]\033[0m Download Audio\n");
				    process.stdout.write("\033[0;44m[2]\033[0m Download Video\n");
				    process.stdout.write("\033[0;41m[0]\033[0m Cancel\n");
				    rl.question(">>> ",ans2=>{
					    switch(ans2) {
					    	case '0':
					    		rl.close();
					     	break;
					     	case '1':
					     		rl.question("Audio output filename ("+title+"): ",ans3=>{
				     				if(ans3=="") ans3=title;
				     				if(!ans3.includes(".mp3")){
				     					ans3+=".mp3";
						     		}
						     		var curDir;
						     		rl.question("File location ("+process.cwd()+"): ",ans4=>{
						     			if(ans4=="") curDir=process.cwd();
						      			else curDir=ans4;	
						      			var url;
						       			var child;
   							        	if(curDir[curDir.length-1]=="/") url = curDir+ans3;
	        								else url = curDir+"/"+ans3;
	        								console.log("Saving '"+ans3+"' to '"+curDir+"/'...");
	        								child = exec("wget -O '"+url+"' https://"+baseHost+mp3link,(err,stdout,stderr)=>{
	        									if(err!==null) console.log("err: %s",err);
	        									else process.stdout.write("                                                    \r\033[1;32mDownload success!\033[0m\n");
	        									rl.close();
	        								});
													let newSize = 0;
													let oldSize = 0;
													let diff = 0;
	        								var sizeLoop = setInterval(()=>{
	        									fs.stat(url,(e,st)=>{
															newSize=st.size;
															diff=newSize-oldSize;
	        										process.stdout.write("Downloaded "+(st.size/1000000).toFixed(3)+" MB / "+(fileSize/1000000).toFixed(3)+" MB ("+(diff/1000).toFixed(2)+" KB/s)       \r");
	        										oldSize=st.size;
														});
	        								},1000);
	        							});
	        						});
	        					break;
	        					case '2':
	        						rl.question("Video output filename ("+title+"): ",ans3=>{
	        							if(ans3=="") ans3=title;
	        							if(!ans3.includes(".mp4")){
	        								ans3+=".mp4";
	        							}
	        							var curDir;
	        							rl.question("File location ("+process.cwd()+"): ",ans4=>{
	        								if(ans4=="") curDir=process.cwd();
	        								else curDir=ans4;
	        								var url;
	        								var child;
	        								if(curDir[curDir.length-1]=="/") url = curDir+ans3;
	        								else url = curDir+"/"+ans3;
	        								console.log("Saving '"+ans3+"' to '"+curDir+"/'...");
	        								child = exec("wget -O '"+url+"' https://"+baseHost+mp4link,(err,stdout,stderr)=>{
	        									if(err!==null) console.log("err: %s",err);
	        									else process.stdout.write("                                                    \r\033[1;32mDownload success!\033[0m\n");
	        									rl.close();
	        								});
													let newSize = 0;
													let oldSize = 0;
	        								let diff = 0;
													var sizeLoop = setInterval(()=>{
														fs.stat(url,(e,st)=>{
															newSize=st.size;
															diff = newSize-oldSize;
	        										process.stdout.write("Downloaded "+(st.size/1000000).toFixed(3)+" MB / "+(fileSize2/1000000).toFixed(3)+" MB ("+(diff/1000).toFixed(2)+" KB/s)       \r");
	        										oldSize=st.size;
														});
	        								},1000);
	        							});
	        						});
	        					break;
	        					default:
	        						console.log("\033[0;31mIncorrect choice.\033[0m\n");
	        						rl.close();
	        					break;
	        		}
	        	}) 
					});
							})
							Y.end();
						});
						//Y.end();
				});	
				X.end();		
			}
			else {
				rl.close();
			}
		});
	});
	form.append("u",videoURL);
	form.append("c","PL");
	form.pipe(req);
	req.end();
});

// If closed
rl.on('close', function () {
	console.log("\033[1;34mClosing.\033[0m");
	process.exit(0);
});
