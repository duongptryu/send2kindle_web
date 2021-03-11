from pydantic import BaseModel

class User(BaseModel):
    email: str
    password: str

class UserCreate(User):
    kindle_mail: str
    repeat_password: str


class Token(BaseModel):
    access_token: str
    token_type: str

class UserUpdateKindleMail(User):
    kindle_mail: str

class UserUpdatePassword(User):
    new_password: str