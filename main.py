from fastapi import Request,Query, FastAPI
from fastapi.responses import HTMLResponse, JSONResponse,RedirectResponse
from fastapi.staticfiles import StaticFiles 
from fastapi.templating import Jinja2Templates 
import json, pickle

from supabase_db import fetch_table, insert_table
COUNT = 0
COUNT_FILE='static/db/count.pkl'

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.on_event("startup")
async def startup():
    global COUNT, COUNT_FILE
    with open(COUNT_FILE,'rb') as f:
        COUNT = pickle.load(f)


# @app.get('/{something}')
# async def re(request: Request):
#     return RedirectResponse(url='/')

@app.get('/')
async def main(request: Request):
    global COUNT, COUNT_FILE
    COUNT += 1
    with open(COUNT_FILE, 'wb') as f:
        pickle.dump(COUNT, f)
    return templates.TemplateResponse('index.html', {'request':request, 'views':COUNT})


@app.get('/location')
async def get_chats(request: Request, locationName:str=Query(None)):
    chats = fetch_table(location_name=locationName)
    return JSONResponse(chats)

@app.post('/post')
async def add_chat(request: Request, text:str="", userName:str="", location:str=""):
    with open("static/db/location.json",'r',encoding='utf-8') as f:
        locations = json.load(f)
    if text.strip() and userName.strip() and (location.strip() in locations):
        insert_table(text= text.strip(), location=location.strip(), user_name=userName.strip())
    else:
        return {"success":False}
    return {"success":True}