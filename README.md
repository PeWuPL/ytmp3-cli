# ytmp3-cli
## About
This repository is a Command-Line version of [YTMp3.cc](https://YTMp3.cc) mostly made for fun.  
It works, so let's just go into it.  
## Versions
For clarity, I made two versions of this program.  
1. JavaScript version (made in Node.js + some modules)  
2. Bash version (simpler, made for Unix-based systems)  
## JavaScript version
Javascript version has only one function more than bash version. <br>
Generally it shows the file size before downloading <i>(ytmp3 servers are kinda picky)</i> <br>
It also is a little less wild sometimes.  
But - it requires Node.js and some modules.  
#### Modules:
Readline  
Form-Data  
fs, child_process, https, util (Those are bundled with Node.js)  

It's a bit of a hassle for something that simple, so I remade it in bash.  
## Bash version
This one is simpler, using only curl to fetch data.  
It loses the functionality to see file size before downloading.  
(I can't recreate the same mechanism like in JavaScript version)  
<i>Although make sure to have curl installed.</i>  
## Bugs
If you find bugs or errors, make a ticket, I should answer it shortly.  
Now I should recommend some other repositories, but I think that's a bad idea.
