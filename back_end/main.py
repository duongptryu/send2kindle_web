from fastapi import FastAPI,HTTPException, status, Depends, Response, BackgroundTasks, File, UploadFile, Form
from typing import Optional
from functions.search import search
from fastapi.middleware.cors import CORSMiddleware
import config as cfg
import requests
import re
import shutil
import time
import os
from bs4 import BeautifulSoup

from functions.auth import process_sign_up, process_sign_in, generate_token, get_current_user, update_kindle_mail, update_password
from functions.get_book import download_book, process
from modelsSchema import User, UserCreate, UserUpdateKindleMail, UserUpdatePassword
from functions.delete_book import delete
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/sign-in")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=cfg.setup_CORS['origin'],
    allow_credentials=cfg.setup_CORS['allow_credentials'],
    allow_methods=cfg.setup_CORS['allow_methods'],
    allow_headers=cfg.setup_CORS['allow_headers'],
)


@app.get("/search/{title}", status_code=status.HTTP_200_OK)
def pre_search(title: str, author: Optional[str] = None, page: Optional[str]=None, extension: Optional[str]= None):
    title = title.strip()
    # import pdb; pdb.set_trace()
    if len(title) == 0 or title == None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid input")
    try:
        result = search(title, author, page, extension)
        if len(result) == 0:
            return {"result": "not found"}
        else:
            # for book in result:
            #     res = requests.get(book["Mirror_1"])
            #     img_tag = re.search(r'<img[^>]+src="([^">]+)"', res.text)
            #     img_src = re.findall(r'(.*?)"', img_tag.group())[1]
            #     # import pdb; pdb.set_trace()
            #     book['ImageUrl'] = img_src
            return {"result": result[:24]}
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid input")
     

@app.get("/detail/{id_book}", status_code = status.HTTP_200_OK)
def getDetail(id_book):
    series = ""
    try:
        url = f"http://library.lol/main/{id_book}"
        res = requests.get(url)
        x = re.search(r"(?<=<p>)Series(.*?)(?=</p>)", res.content.decode())
        if x:
            series = x.group()[8:]
        description = re.search(r"(?<=<br>)(.*?)(?=</div>)", res.content.decode())
        description = description.group()
        return {"series": series, "description": description}
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid input")


@app.post("/sign-up", status_code=status.HTTP_201_CREATED)
def sign_up(user: UserCreate):
    try:
        email = re.search(r"([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)", user.email)
        if email == None:
            raise Exception("Invalid email")
        kindle_mail = re.search(r"[a-zA-Z0-9-_.]+@kindle.com", user.kindle_mail)
        if kindle_mail == None:
            raise Exception("Invalid kindle mail")
        if user.password != user.repeat_password:
            raise Exception("Password and repeat password not correct")
        password = re.search(r"[A-Za-z0-9[\]()<>?!@#$%^&+=]{8,}", user.password)
        if password == None:
            raise Exception("Password must be larger than 8 character, includes digital, lower, Upper letter, at least one special character")
    except Exception as Error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(Error)) 

    try:
        user_db = process_sign_up(email.group(), kindle_mail.group(), user.password)
        if user:
            return {"detail": "Register successfull"}
    except Exception as Error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(Error))

@app.post("/sign-in", status_code=status.HTTP_200_OK)
def sign_in(res: Response, user: OAuth2PasswordRequestForm = Depends()):
    try:
        email = re.search(r"([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)", user.username)
        if email == None or len(email.group()) == 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email")
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email")
    
    try:
        user_db = process_sign_in(email.group(), user.password)
        if not user_db:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect username or password",
                            headers={"WWW-Authenticate": "Bearer"})
        token = generate_token(data = {
            "email": user_db.email
        })
        res.headers['Authorization'] = "Bearer " + token
        return {"detail": "sign in successfull", "access_token": token}
    except Exception as Error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(Error.detail))


@app.get("/users/me")
def get_user(token: str = Depends(oauth2_scheme)):
    try:
        user = get_current_user(token=token)
    except:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        raise credentials_exception
    return {
        "email": user.email,
        "kindle_mail": user.kindle_mail,
    }


@app.get("/get-book/{book_id}")
def get_book(book_id: str, kindle_mail: str, background_tasks: BackgroundTasks):
    mail = re.search("[a-zA-Z0-9-_.]+@kindle.com", kindle_mail)
    if mail == None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid kindle mail")
    mail = mail.group()
    try:
        url = f"http://library.lol/main/{book_id}"
        res = requests.get(url)
        if res.status_code != 200:
            raise Exception("Invalid book id")
        name_book = download_book(res)
        background_tasks.add_task(process, name_book, kindle_mail)
        return {"detail": "Send mail successfull, please check mail "}
    except Exception as Error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(Error))


@app.post("/upload-file")
def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...), kindle_mail: str = Form(...)):
    #check extension
    try:
        extension = file.filename.split(".")[-1]
        if extension not in cfg.EXT_LIST:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error extension")
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error extension")

    #check name and write file
    try:
        name_upload = file.filename.replace(':', '-').replace('"', '-').replace('?', '-').replace('/', '-').replace('\\', '-').replace('<', '-').replace('>', '-').replace('*', '')
        name = name_upload.split(".")[0] + "_" + str(time.time()) + "." + name_upload.split(".")[-1]
        with open(name, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File size must smaller than 25 Mb")
    finally:
        file.file.close()


    #check size
    try:
        size = os.stat(name).st_size
        if  int(size) > 25000000:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File size must smaller than 25 Mb")
    except:
        delete(name)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File size must smaller than 25 Mb")

    #check kindle mail
    mail = re.search("[a-zA-Z0-9-_.]+@kindle.com", kindle_mail)
    if mail == None:
        delete(name)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid kindle mail")
    mail = mail.group()
    

    #convert and send mail
    try:
        background_tasks.add_task(process, name, kindle_mail)
        return {"detail": "We are sending file to your mail, please check kindle app after 30-60 minutes. If can not receive, please check again steps that we recommend and your kindle mail input"}
    except Exception as Error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(Error))

@app.post("/user/update-kindle-mail")
def update_k_m(info: UserUpdateKindleMail,  token: str = Depends(oauth2_scheme)):
    try:
        user = get_current_user(token)
        if user.email != info.email:
            raise Exception
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    if len(info.email) == 0 or len(info.kindle_mail) == 0 or len(info.password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bad input")
    
    mail = re.search("[a-zA-Z0-9-_.]+@kindle.com", info.kindle_mail)
    if mail == None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid kindle mail")

    try:
        check = update_kindle_mail(user, info.kindle_mail, info.password)
        if check:
            return user
    except Exception as Error:
        raise HTTPException(status_code=Error.status_code, detail = Error.detail)

@app.post("/user/update-password")
def update_p(info: UserUpdatePassword, token: str = Depends(oauth2_scheme)):
    try:
        user = get_current_user(token)
        if user.email != info.email:
            raise Exception
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    if len(info.email) == 0 or len(info.password) < 8 or len(info.new_password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bad input")
    
    if info.password == info.new_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Old password and new password can not similar")

    try:
        check = update_password(user, info.password, info.new_password)
        if check:
            return user
    except Exception as Error:
        raise HTTPException(status_code=Error.status_code, detail = Error.detail)


