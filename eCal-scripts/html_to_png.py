#!/usr/bin/env python3
import os
import time
from pathlib import Path

from PIL import Image

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service as ChromeService
# from webdriver_manager.chrome import ChromeDriverManager

def get_cache_dir():
    cache_dir = (
        Path(os.getenv("XDG_CACHE_DIR", Path.home() / ".cache")) / "eCal_chrome"
    )
    cache_dir.mkdir(exist_ok=True)
    return cache_dir


def crop(filename: str):
    im = Image.open(filename)
    left, top = 0, 0
    width, height = 540, 960
    im = im.crop((left, top, left + width, top + height))
    im.save(filename, "PNG")


options = Options()
for argument in [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--disable-extensions",
    "--window-size=540,1500",
    "--disable-web-security",
    "--user-data-dir=eCal_chrome",
    "--allow-running-insecure-content",
    "--force-device-scale-factor=1",
    "--high-dpi-support=1",
    "--proxy-server='direct://'",
    "--proxy-bypass-list=*",
    "--verbose",
]:
    options.add_argument(argument)
        
driver = webdriver.Chrome('/usr/bin/chromedriver',
        # service=ChromeService(ChromeDriverManager().install()),
        options=options,
    )

# print("Getting page...")
# html_file = os.getcwd() + "/" + "eCal-html/eCal.html"
# print(html_file)
# f = open(html_file, 'r')
# file_contents = f.read()
# print (file_contents)
# f.close()
# print("file://" + html_file)
# driver.get("file://" + html_file)

# driver.get(html_file.as_uri())


print("Getting page...")
html_file = os.getcwd() + "//eCal-html//" + "eCal.html"
driver.get("file:///" + html_file)

print("file:///" + html_file)

time.sleep(2)

filename = "eCal_screenshot.png"
driver.save_screenshot(filename)
crop(filename)

driver.close()
