setup_CORS = {
    'origin': ["http://localhost:3000",
    "localhost:3000"],
    'allow_credentials': False,
    'allow_methods': ['GET', 'POST'],
    'allow_headers': ["*"]
}

MONGO_URL = "mongodb://127.0.0.1:27017/web_kindle"

CONVERT_LIST = ['epub', 'fb2', 'cbz', 'cbr', 'docx', 'html', 'txt', 'odt', 'chm', 'djvu', 'rtf']
EXT_LIST = ['epub', 'fb2', 'cbz', 'cbr', 'mobi', 'pdf', 'docx', 'html', 'txt', 'odt', 'chm', 'djvu', 'rtf']