import requests
import re
from bs4 import BeautifulSoup

col_names = ["ID", "Author", "Title", "Publisher", "Year", "Pages", "Language", "Size", "Extension", 
            "Mirror_1", "Mirror_2", "Mirror_3", "Mirror_4", "Mirror_5", "Edit", "Isbn"]


def search(title: str, author, page, extension):
    filters = {}
    if author:
        filters.author = author
    if page:
        filters.page = page
    if extension:
        filters.extension = extension
    
    try:
        result = process_search_format(title)
    except Exception as Error:
        raise Exception(str(Error))

    if len(result) == 0:
        return []
    else:
        return result



def process_search_format(title):
    res = requests.get(f"http://gen.lib.rus.ec/search.php?req={title}&column=title")
    if res.status_code != 200:
        raise Exception("Can not get book information")
    
    pattern = re.compile(r"(?<=<i>)([0-9X ,-])+?(?=<\/i>)")

    soup = BeautifulSoup(res.text, 'lxml')
        
    information_table = soup.find_all('table')[2]

    output = []
    try:
        for row in information_table.find_all('tr')[1:]:
            isbn = re.search(pattern, str(row))
            if isbn == None:
                isbn = ""
            else: 
                if len(isbn.group().split(",")) == 1:
                    isbn = isbn.group()
                else:
                    isbn = isbn.group().split(",")[0]
            x = []
            for td in row.find_all("td"):
                y = td.find_all("i")
                for z in y:
                    z.decompose()
                x.append(td.a['href'] if td.find('a') and td.find('a').has_attr("title") and td.find('a')["title"] != "" else ''.join(td.stripped_strings))
            x.append(isbn)
            output.append(x)
    except:
        raise Exception("Can not search")

    output = [ dict(zip(col_names, row))  for row in output ]
    return output
