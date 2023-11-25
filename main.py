from flask import Flask, render_template, redirect, request, jsonify
from flask_security import auth_required, roles_accepted
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from api import api
from models import db, Theatre, Show
import config
from flask_security import Security
from sec import user_datastore
from flask_security.utils import hash_password
from redis import Redis
from celery import Celery
from celery.result import AsyncResult
from celery.schedules import crontab
from celery.result import AsyncResult
from celery.schedules import crontab
from models import User, Tickets, Theatre_Show, Theatre
from flask_login import current_user
from flask_caching import Cache
# from Cache import cache 
from flask_cors import CORS
from datetime import timedelta
import time


app=Flask(__name__)

app.config.from_object(config)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

api.init_app(app)
db.init_app(app)   #sql alchemy instance
app.security=Security(app, user_datastore)


redis = Redis(host='localhost', port=6379)


app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379/0',
    RESULT_BACKEND='redis://localhost:6379/0'
)


from celery_config import make_celery
celery = make_celery(app)

from cache import initialize_cache
initialize_cache(app)

CORS(app)



@celery.task()
def add_together(a, b):
    time.sleep(5)
    return a + b


from celery.result import AsyncResult

import smtplib

# print(cache.get("all_th"))
#sender details
SMPTP_SERVER_HOST="localhost"
SMPTP_SERVER_PORT=1025
SENDER_ADDRESS="tix@gmail.com"
SENDER_PASSWORD=""

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.mime.application import MIMEApplication
from email import encoders
# @app.route("/sendemail")
from flask_login import current_user
from weasyprint import HTML
from celery.schedules import crontab

from jinja2 import Template
def format_pdf(temp,data):
    # print(temp)
    # print(data)
    with open(temp) as file_:
        temp=Template(file_.read())
        return temp.render(data=data)
    
from sqlalchemy import func
# from api.resources import all_users
from api.resources import generate_pdf
import csv

 
@celery.task()           #to get the task id
# @app.route("/gen_csv/<string:t_s>/<int:id>")
# @auth_required('token')
def generate_csv_specific(t_s,id):
    if t_s=="t":
        show=[]
        th=Theatre.query.filter_by(id=id).first()
        theatre=[{"id":th.id, "name":th.Name, "place":th.Place,"capacity":th.Capacity}]
        shows_at=Theatre_Show.query.filter_by(Theatre_id=id).all()
        print(theatre[0]['id'],shows_at)
        shows_at_id=[]
        for i in shows_at:
            shows_at_id+=[i.Show_id]
        for i in shows_at_id:
            if Show.query.filter_by(id=i).count()>0:
                tix=Tickets.query.filter_by(theatre_id=id, show_id=i).count()
                show_i=Show.query.filter_by(id=i).first()
                show+=[{'id':show_i.id,'name':show_i.Name, "tag":show_i.Tag, "rating":show_i.Rating, "tickets":tix}]

        data={"show":show}
        fields={"id","name","tag", "rating", "tickets"}
        # print(data['show'])
        with open(f"static/{theatre[0]['name']}.csv", 'w', newline='') as csvfile:
        # creating a csv writer object
            csvwriter =csv.DictWriter(csvfile, fieldnames=fields)
        # writing the fields
            csvwriter.writeheader()
        # writing the data rows
            csvwriter.writerows(data['show']) 
            body_txt=f"CSV created,  click on download to download it to your local system"  
        send_alert("admin@gmail.com","Job finished", body_txt)
        return f"static/{theatre[0]['name']}.csv"
            
    elif t_s=="s":
        theatre=[]
        sh=Show.query.filter_by(id=id).first()
        show=[{"id":sh.id,"name":sh.Name,"tag":sh.Tag,"rating":sh.Rating}]
        theatres_showing=Theatre_Show.query.filter_by(Show_id=id).all()
        for i in theatres_showing:
            if Theatre.query.filter_by(id=i.Theatre_id).count()>0:
                th_data=Theatre.query.filter_by(id=i.Theatre_id).first()
                theatre+=[{"id":th_data.id, "name":th_data.Name,"place":th_data.Place,"capacity":th_data.Capacity}]
        data={ "theatre":theatre}
        fields={"id","name","place", "capacity"}
        
        with open(f"static/{show[0]['name']}.csv", 'w', newline='') as csvfile:
        # creating a csv writer object
            csvwriter = csv.DictWriter(csvfile, fieldnames=fields)
        # witing the fields
            csvwriter.writeheader()
        # writing the data rows
            csvwriter.writerows(data['theatre'])
            body_txt=f"CSV for {theatre[0]['name']} is created,  click on download to download it to your local system"  
        send_alert("admin@gmail.com","Job finished",body_txt)  
        return f"static/{show[0]['name']}.csv" 
    
        # send_alert()
        # print(self.request.id)
        # print(get_download_status(self.request.id))
    

@app.route("/gen_csv/<string:t_s>/<int:id>")
# @auth_required('token')
def gen_csv(t_s,id):
    task=generate_csv_specific.delay(t_s,id)
    return jsonify({"task_id":task.id})


@app.route('/status/<string:task_id>')
def get_download_status(task_id,app = celery):
    # Check the Celery task status using the task ID
    res = AsyncResult(task_id)
    status = res.state
    return jsonify({"status":status})
    

def send_alert(to,subject, body):
    msg=MIMEMultipart()
    msg["From"]="backendjob@gmail.com"
      #can be txt/html depends
    #connect to server
    #do try catch here
    server = smtplib.SMTP(host="localhost", port=1025)
    server.login(SENDER_ADDRESS,SENDER_PASSWORD)
    users=User.query.all()
    print(users)
    # response = requests.get(api_url)
    
    msg["To"]=to
    msg["Subject"]=subject
    msg.attach(MIMEText(body,"plain"))
    server.send_message(msg)
    server.quit()


@celery.task
def send_email(subject,body):
    msg=MIMEMultipart()
    msg["From"]="tix@gmail.com"
      #can be txt/html depends
    #connect to server
    #do try catch here
    server = smtplib.SMTP(host="localhost", port=1025)
    server.login(SENDER_ADDRESS,SENDER_PASSWORD)
    users=User.query.all()
    print(users)
    # response = requests.get(api_url)
    for i in users:
        msg["To"]= i.email
        msg["Subject"]=subject
        msg.attach(MIMEText(body,"plain"))
        x=generate_pdf(i.id)
        with open(x, "rb") as file:
            part = MIMEApplication(file.read(), Name=file.name,_subtype="pdf")
        part['Content-Disposition'] = f'attachment; filename="{file.name}"'
        msg.attach(part)
        server.send_message(msg)
    server.quit()

monthly_rep_subject="Monthly Report"
monthly_rep_body="Hi again!, Continue watching shows. Attached to the mail is your bookings in the last month"
#monthly email send out
@celery.on_after_configure.connect
def send_monthly_email(sender, **kwargs):
    sender.add_periodic_task(crontab(47,16), send_email.s(monthly_rep_subject,monthly_rep_body))
#0, 0, day_of_month='1'

from models import LatestLogin
from datetime import datetime, timedelta


@celery.task
def recent_login():
    users=User.query.all()
    print(users)
    for i in users:
        if LatestLogin.query.filter_by(user_id=i.id).count()>0:
            latest=LatestLogin.query.filter_by(user_id=i.id).first()

            if (((datetime.now() - latest.time).total_seconds())/(24*60*60))>1:
                print((latest.time - datetime.now()).total_seconds())
                send_alert(i.email,"Visit TixItIs!", "You haven't visited TixItIs in a long time, log back in\n Check out the new releases")
        elif LatestLogin.query.filter_by(user_id=i.id).count()==0:
            send_alert(i.email,"Visit TixItIs for the first time!", "You haven't visited TixItIs in a long time, log back in\n Check out the new releases")
        else:
            continue

@celery.on_after_configure.connect
def current_user_add(sender,**kwargs):
    sender.add_periodic_task(crontab(15,12),recent_login.s())


from flask import send_file

@app.route("/downloadfile")
def download_file():
    return send_file("static/data.csv")    #no forward slash in beg



@app.get("/")
def home():
    return render_template("index.html")


with app.app_context():
    if not app.config['INIT_SETUP']:
        db.create_all()
        # user_datastore.create_role(name="admin", description="Admin - can create/delete/edit shows and theatres")
        # user_datastore.create_role(name='user', description="Can book shows/ provide rating")
        if not user_datastore.find_user(email="admin@gmail.com"):
            user_datastore.create_user(username="admin", email="admin@gmail.com", password=hash_password("1234"), roles=["admin"])

        db.session.commit()
        app.config.update(INIT_SETUP=True)


if __name__=="__main__":
    app.run(debug=True)
    