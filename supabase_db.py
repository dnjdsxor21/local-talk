import os
from dotenv import load_dotenv
from supabase import create_client, Client
import json

load_dotenv()
url: str = os.environ['SUPABASE_URL']
key: str = os.environ["SUPABASE_KEY"]
supabase: Client = create_client(url, key)
TABLE_NAME = 'seoultalk'
ROW1 = "text"
ROW2 = "location"
ROW3 = "user_name"

def fetch_table(location_name):
    # location_name = unicodedata.normalize("NFC", location_name)
    # print(location_name)
    if location_name=='*':
        response = supabase.table(TABLE_NAME).select('*').order('created_at', desc=True).limit(10).execute()    
    else:
        response = supabase.table(TABLE_NAME).select('*').eq(ROW2, location_name).execute()
    # print(len(response.data))
    return response.data

def insert_table(text:str, location:float, user_name:float):
    data, count = supabase.table(TABLE_NAME).insert({
        ROW1: text, ROW2:location, ROW3:user_name
        }).execute()
    return data

def update_table(id:int, name=None, lat=None, lon=None):
    data, count = supabase.table(TABLE_NAME).update({
        str(e):e for e in [name, lat,lon] if e is not None
        }).eq('id', id).execute() 
    return data

def delete_table(id:int, name):
    data, count = supabase.table(TABLE_NAME).delete().eq('id', id).execute()
    return data

def upsert_table(id:list, name:list, lat:list, lon:list):
    data, count = supabase.table(TABLE_NAME).upsert(
        [ {'id':a, ROW1:b, ROW2:c, ROW3:d} for (a,b,c,d) in zip(id, name, lat, lon)]
        ).execute()
    return data

if __name__=='__main__':
    pass