import os
import subprocess
from functions.delete_book import delete

def convert_to_mobi(name_book):
    name_book_split = name_book.split(".")
    new_name_book = name_book_split[0]
    try:
        subprocess.call(["ebook-convert",name_book ,new_name_book +'.mobi'])
        delete(name_book)
        return new_name_book + ".mobi"
    except Exception as e:
        raise Exception("Can not convert")
