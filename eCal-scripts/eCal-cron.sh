#!/bin/bash

## OPTIONS
Image_Webserver_root_directory="/var/www/timeframe"

##### Script #####

# Move to the folder with the scripts
# cd /root/eCal/eCal-scripts/
export SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
cd $SCRIPT_DIR

# Run script to convert html to png using Selenium
/usr/bin/python3 html_to_png.py

# Convert image to right format, and hash
/usr/bin/python3 convert_image.py eCal_screenshot.png image

#Move image and hash to the right location
cp eCal_screenshot.png $Image_Webserver_root_directory/eCal_screenshot.png
mv image $Image_Webserver_root_directory/image
mv image.sha $Image_Webserver_root_directory/image.sha

exit
