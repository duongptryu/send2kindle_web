import requests
import re
import time
import os
from functions.delete_book import delete
from functions.send_mail import send_mail
from functions.convert import convert_to_mobi
import config


def download_book(res_html):
    try:
        url_download = re.findall(r'href=[\'"]?([^\'" >]+)', res_html.content.decode())
        url_download = url_download[1]

        title = re.search(r"(?<=<h1>)(.*?)(?=</h1>)", res_html.content.decode())
        title = title.group()
        extension = url_download.split(".")[-1]
        res = requests.get(url_download)

        if res.status_code == 200:
            name_book =title + "_" + str(time.time()) +"." + extension
            name_book = name_book.replace(':', '-').replace('"', '-').replace('?', '-').replace('/', '-').replace('\\', '-').replace('<', '-').replace('>', '-').replace('*', '')
            try:
                with open(name_book, 'wb') as f:
                    f.write(res.content)
            except:
                raise Exception("Can not download")
            
            try:
                size = os.stat(name_book).st_size
                if  int(size) > 25000000:
                    raise Exception("File size must smaller than 25 Mb")
            except:
                delete(name_book)
                raise Exception("File size must smaller than 25 Mb")

            return name_book
        else:
            raise Exception()
    except:
        raise Exception("Can not download")


def process(name_book, kindle_mail):
    extension = name_book.split(".")[-1]
    if extension in config.CONVERT_LIST:
        try:
            name_book = convert_to_mobi(name_book)
        except:
            raise Exception("Can't convert")
    send_mail(name_book, kindle_mail)
    delete(name_book)