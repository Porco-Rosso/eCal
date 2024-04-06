#! /bin/bash
PATH=/usr/local/bin:/usr/local/sbin:~/bin:/usr/bin:/bin:/usr/sbin:/sbin

### User Settings 
Enable_Wifi_check="no"
Wifi_SSID="WIFI_SSID"
Server_Address="root@192.168.1.XXX"
Cal_Output_Filename="eCal_output.js"
Server_Upload_Directory="/root/eCal/eCal-scripts/eCal-html/"


##### Script #####

generate_eCal_Json () {
  icalPal="/usr/local/bin/icalPal"
  FLAGS=(-o json)
  scope="eventsToday"
  output=$($icalPal $scope "${FLAGS[@]}")
  
  echo "Contents"
  echo $output
  
  echo -n 'eCal_output = '$output';' > /tmp/$Cal_Output_Filename
}

upload_to_server () {
# Make sure ssh key is loaded
export SSH_AUTH_SOCK=$( ls /private/tmp/com.apple.launchd.*/Listeners )

	# Upload file to server
	if /usr/bin/rsync -av /tmp/$Cal_Output_Filename $Server_Address:$Server_Upload_Directory$Cal_Output_Filename ; then
			echo "upload succeeded"
	else
			echo "upload failed"
	fi
}




if [[ $Enable_Wifi_check = "yes" ]]; then

	if [[ $(/System/Library/PrivateFrameworks/Apple80211.framework/Resources/airport -I | awk -F: '/ SSID/{print $2}') = '$Wifi_SSID' ]]; then
		echo "On home network, running"
		generate_eCal_Json
		upload_to_server
	else
		echo "Not on home network, not running."
	fi
else
	generate_eCal_Json
	upload_to_server		
fi