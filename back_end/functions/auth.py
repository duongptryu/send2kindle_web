from models import User
from passlib.context import CryptContext
from fastapi import HTTPException, status
from jose import JWTError, jwt
from typing import Optional
from datetime import datetime, timedelta

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def process_sign_up(email: str, kindle_mail: str, password: str):
    try:
        user = User.objects.get({"_id": email})
        if user:
            raise Exception("Email already register")
    except User.DoesNotExist:
        try:
            pass_hash = pwd_context.hash(password)
            user = User(email=email, kindle_mail=kindle_mail, password=pass_hash)
            user.save()
            return user
        except:
            raise Exception("Sign up error, please try again")

def get_user(email):
    try:
        user = User.objects.get({"_id": email})
        return user
    except:
        return False

def verify_password(password, password_hash):
    return pwd_context.verify(password, password_hash)

def process_sign_in(email, password):
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def generate_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        user = User.objects.get({"_id": email})
        if not user:
            raise Exception()
    except JWTError:
        raise Exception()

    return user

def update_kindle_mail(user: User, new_kindle_mail: str, password: str):
    if not verify_password(password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Password incorrect")
    try:
        user.kindle_mail = new_kindle_mail
        user.save()
        return True
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can not up date")

def update_password(user: User, old_password: str, new_password: str):
    if not verify_password(old_password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Old Password incorrect")
    try:
        pass_hash = pwd_context.hash(new_password)
        user.password = pass_hash
        user.save()
        return True
    except:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Can not update password, pleasetry again")
