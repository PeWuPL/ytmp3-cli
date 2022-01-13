#!/bin/bash
c_green="\033[0;32m";
c_lgreen="\033[1;32m";
c_red="\033[0;31m";
c_lred="\033[1;31m";
c_yellow="\033[0;33m";
c_lyellow="\033[1;33m";
c_blue="\033[0;34m";
c_lblue="\033[1;34m";
c_magenta="\033[0;35m";
c_lmagenta="\033[1;35m";
c_cyan="\033[0;36m";
c_lcyan="\033[1;36m";
c_white="\033[0;37m";
c_lwhite="\033[1;37m";
c_clear="\033[0m";

echo -ne "Enter YT Link: ${c_green}"
read link
echo -ne "${c_clear}"
universalLink="https://154.82.111.77.sslip.io";
conversionPath="/newp";
echo -en "${c_yellow}Processing...${c_clear}\r";
command=`curl -s -X POST -F "u=${link}" -F 'c=PL' ${universalLink}${conversionPath}`;
status=`echo $command | grep -oP '(?<="status":")[^"]*'`;
message=`echo $command | grep -oP '(?<="message":")[^"]*'`;


title=`echo $command | grep -oP '(?<="title":")[^"]*'`;
duration=`echo $command | grep -oP '(?<="duration":")[^"]*'`;
mp3link=`echo $command | grep -oP '(?<="mp3":")[^"]*'`;
mp4link=`echo $command | grep -oP '(?<="mp4":")[^"]*'`;

download () {
	url=$1
	dtype=$2
	echo -e "File name ($title): ${c_magenta}";
	read filename
	echo -ne "${c_clear}"
	if [ -z $filename ]
	then
		filename=$title
	fi
	if [[ ! $filename == *".mp3" ]] && [[ $dtype == "mp3" ]]
	then
		filename="${filename}.mp3"
	fi
	if [[ ! $filename == *".mp4" ]] && [[ $dtype == "mp4" ]]
	then
		filename="${filename}.mp4"
	fi
	echo -e "Download path (`pwd`): ${c_magenta}"
	read downloadPath
	echo -ne $c_clear
	if [ -z $downloadPath ]
	then
		downloadPath=`pwd`
	fi
	if [[ ! $downloadPath == *"/" ]]
	then
		downloadPath="${downloadPath}/"
	fi
	echo -e "Downloading ${c_lred}${filename}${c_clear} to ${c_lred}${downloadPath}${c_clear}..."
	curlAction=`curl -o "${downloadPath}${filename}" "${url}"`
	echo $curlAction
	echo -e "${c_lgreen}Download complete!${c_clear}"
}
echo -en "              \r";
if [ ! -z "$title" ] 
then
	echo -e "${c_green}Title: ${c_clear}$title \n${c_green}Time: ${c_clear}$duration"
	echo -e "${c_yellow}====================${c_clear}DOWNLOAD OPTIONS${c_yellow}=====================${c_clear}"
	echo -e "${c_blue}[1]${c_clear} Download Audio"
	echo -e "${c_red}[2]${c_clear} Download Video"
	echo -e "${c_green}[0]${c_clear} Cancel"
	read -p ">>> " chA
	case "$chA" in
		"1") download "${universalLink}${mp3link}" "mp3"  ;;
		"2") download "${universalLink}${mp4link}" "mp4"  ;;
		*) echo -e "${c_lblue}Closing...${c_clear}" ;;
	esac

else
	echo -e "${c_red}[ERR]${c_clear} Incorrect Link!"
fi
