from flask_restful import Resource , marshal_with, fields
# from flask_security import auth_required, hash_password, roles_accepted, current_user
from flask_security import auth_required, roles_accepted, current_user
from flask_security.utils import hash_password
from flask import Flask, render_template, redirect, request, jsonify
from models import db,User, Theatre_Show
from sec import user_datastore
import json
from flask_login import current_user
from sqlalchemy import func
import os
import csv

from models import Theatre, Show, Tickets , LatestLogin

theatre_resource={
    'id':fields.Integer,
    'Name' : fields.String,
    'Place' :fields.String,
    'Capacity' : fields.Integer, 
    'show_id':fields.Float,
}
show_resource={
    'id':fields.Integer,
    'Name' : fields.String,
    'Tag' :fields.String,
    'Rating' : fields.Float, 
    'Ticket_Price':fields.Float,
}

tix_resource={
    'user_id':fields.Integer,
    'theatre_id':fields.Integer,
    'show_id':fields.Integer
}

#json returns for flask restful
from models import Theatre as theatre_model
from models import Show as show_model
from models import Tickets as ticket_model
from flask_security import logout_user



from datetime import datetime

class Login(Resource):
    def post(self, email):
        user=User.query.filter_by(email=email).first()
        print(user.id)
        print(datetime.now())
        if LatestLogin.query.filter_by(user_id=user.id).count()==0:
            new=LatestLogin(user_id=user.id, time=datetime.now())
            db.session.add(new)
            print(datetime.now())
            db.session.commit()
        else:
            new_log=LatestLogin.query.filter_by(user_id=user.id).first()
            print(datetime.now())
            new_log.time=datetime.now()
            db.session.commit()
        return jsonify(200)
    

class Logout(Resource):

    def post(self):
        logout_user()
        return 200


class Profile(Resource): 

    #isme add the my tickets thing when done
    @auth_required('token')
    def get(self):

        user=User.query.filter_by(email = current_user.email).first()

        return jsonify({"status":200,"username":user.username, "email":user.email,"id":user.id})
    
        
    def post(self):
        username=request.json.get('username')
        email=request.json.get('email')
        password=request.json.get('password')
        # #role=request.json.get('role')
        repeat_user=User.query.filter_by(username = username).count()
        repeat_email=User.query.filter_by(email =email).count()
        # print(repeat_user, repeat_email)

        if (repeat_email>0 ):
            response = jsonify(error='Unacceptable form')
            response.status_code = 410  # HTTP status code for conflict
            return response
        elif (repeat_user >0 ):
            response = jsonify(error='Unacceptable form')
            response.status_code = 411  # HTTP status code for conflict
            return response
        else:
            user_datastore.create_user(username=username,email=email, password=hash_password(password), roles=["user"])
            db.session.commit()
            return 200
        
    
    @auth_required('token')
    def put(self,id=None):
        username=request.json.get('username',"")
        email=request.json.get('email', None)
        password=request.json.get('password', None)
        # #role=request.json.get('role')
        # repeat_user=User.query.filter_by(username = username).count()
        # repeat_email=User.query.filter_by(email =email).count()
        # print(repeat_user, repeat_email)
        # print(id)
        # print(email, username, password)
        user=User.query.filter_by(id=id).first()
        if username=="":
            print('u1')
        elif username!="":
            user.username=username
            # user.username=username
        if email=="":
            print('u3')
        
        elif email !="":
            user.email=email

        if password=="":
            print('u5')

        elif password!="":
            user.password=hash_password(password)
        # print(username, password, email)

        db.session.commit()
        return 200



from time import perf_counter_ns
import api
import cache_api

class Shows(Resource):
    #no authentication required for viewing the theatres / shows
    def get(self,value="", id=None):
        # start=perf_counter_ns()
        venues=cache_api.all_theatres_api()
        # print(venues)
        # venues=Theatre.query.all()
        venue_show={}
        show_all=[]
        start=perf_counter_ns()
        all_shows=cache_api.all_shows_api()
        end=perf_counter_ns()
        print('test',end-start)
        for i in all_shows:
            show_all+=[{'id':i.id,'Name':i.Name, "Tag":i.Tag, "Ticket_Price":i.Ticket_Price,"Rating":i.Rating}]
        
        req_show=[]
        
        if id:
            id=int(id)
            # req_show=Show.query.filter_by(id=id).first()
            start=perf_counter_ns()
            req_show=cache_api.show_api(id)
            end=perf_counter_ns()
            print("2",start-end)
            req_show=[{'id':req_show.id,'Name':req_show.Name, "Tag":req_show.Tag, "Ticket_Price":req_show.Ticket_Price,"Rating":req_show.Rating}]
        
        for venue in venues:
                # print(venue) 
                # venue2={venue["id"],venue["Place"]}
            # print(venue)
            # print(jsonify(venue))
            # show_at=Theatre_Show.query.filter_by(Theatre_id=venue.id).all()
            show_at=cache_api.theatre_show_th(venue.id)
            # show_at=screen_by_th(venue.id)
            for i in show_at:
                # print(i)
                if value:
                    # show=Show.query.filter_by(id=i.Show_id, Tag=value ).first()
                    show=cache_api.show_api(i.Show_id)
                    # st=perf_counter_ns()
                    # show=get_show_id(i.Show_id)
                    # en=perf_counter_ns()
                    # print("3", en-st)
                    if show.Tag==value:
                        show=show
                    else:
                        show=None
                else:
                    # print("hi")
                    show=cache_api.show_api(i.Show_id)
                    # show=Show.query.filter_by(id=i.Show_id).first()

                if show:
                    # print(show)
                    show={
                            'id':show.id,'Name':show.Name, "Tag":show.Tag, "Ticket_Price":show.Ticket_Price,"Rating":show.Rating
                        }
                        # print(show)
                    venue_show.setdefault(venue.Place, []).append(show)
                else:
                    continue

        return jsonify({"venue_show":venue_show,"all_show":show_all, 'req_show':req_show})
            

    @auth_required('token')
    # @roles_accepted('admin')
    def post(self):

        name=request.json.get('name')
        tag=request.json.get('tag')
        rating=request.json.get('rating')
        price=request.json.get('price')
        # print(tag)
        # current=current_user'
        # print(current_user.email)
        if (current_user.email != "admin@gmail.com"):
            response=jsonify("Not authorized")
            response.status_code=401 
            return response
        
        repeat_name=Show.query.filter_by(Name=name).count()
        
        if (repeat_name >=1 ) :
            response = jsonify(error='Unacceptable form')
            response.status_code = 410
            return response
        else:
            # print()
            new_show=Show(Name=name,Tag=tag, Rating=rating, Ticket_Price=price)
            db.session.add(new_show)
            db.session.commit()
            cache_api.delete_pattern('all_shows_api')         #tested if it working by checkign time to retrive data( inc time from60s t0 200s too)
            return 200

    @auth_required('token')
    def put(self,value="",id=None):
        print(id)
        tag=request.json.get('tag',"")
        # pint("1")
        tag=request.json.get('tag',"")
        price=request.json.get('price', "")
        rating=request.json.get('rating', "")

        if (current_user.email != "admin@gmail.com"):
            response=jsonify("Not authorized")
            response.status_code=401 
            return response
        
        show=show_model.query.filter_by(id=id).first()
        if tag=="":
            print('u1')

        elif tag!="":
            show.Tag=tag

            # user.username=username
        if price=="":
            print('u3')
            
        elif price !="":
            show.Ticket_Price=price


        if rating=="":
            print('u5')

        elif rating!="":
            show.Rating=rating

        # print(tag, rating, price)

        db.session.commit()
        cache_api.delete_pattern('all_shows_api') 
        return 200

    @auth_required('token')
    def delete(self,value="",id=None):
        if (current_user.email == "admin@gmail.com"):
            shows=Theatre_Show.query.filter_by(Show_id=id).all()
            for i in shows:
                # print(shows)
                db.session.delete(i)
                db.session.commit()

            tix=ticket_model.query.filter_by(show_id=id).all()
            for i in tix:
                db.session.delete(i)
                db.session.commit()

            the_show=Show.query.filter_by(id=id).first()
            # print(the_show)
            db.session.delete(the_show)
            db.session.commit()
            cache_api.delete_pattern('all_shows_api')
            
            return 200
        
        else:
            response=jsonify("Not authorized")
            response.status_code=401 
            return response
        

def generate_pdf(user_id):
    user=User.query.filter_by(id=user_id).first()
    user_data={'id':user.id , 'u_name':user.username, 'email':user.email}

    u_tix=ticket_model.query.with_entities(ticket_model.user_id,ticket_model.theatre_id,ticket_model.show_id, ticket_model.date, func.count(ticket_model.theatre_id).label('count')).filter_by(user_id=user_id).group_by(ticket_model.theatre_id,ticket_model.show_id).all()
            # print(mytix)
    tickets=[]

    for tix in u_tix:
        # th_name=theatre_model.query.filter_by(id=tix.theatre_id).first()

        th_name=cache_api.theatre_api(tix.theatre_id)
        # sh_name=show_model.query.filter_by(id=tix.show_id).first()
        sh_name=cache_api.show_api(tix.show_id)

        tickets+=[{"user_id":tix.user_id,"theatre_id":tix.theatre_id,
                        "theatre":th_name.Name,"Place":th_name.Place,
                        "show":sh_name.Name,"price":sh_name.Ticket_Price, "tag":sh_name.Tag,
                        "show_id":tix.show_id, 'booked_on':tix.date.date(),'count':tix.count}]
        
    msg=format_pdf(temp="./pdf_gen.html",data=tickets)
        # print(msg)
    html=HTML(string=msg)
    print(html)
    file_name=str(user_data['u_name']) +".pdf"
    print(file_name)
    html.write_pdf(target=file_name)
    return file_name
    


class Theatres(Resource):
    def get(self, id=None):
        venues=Theatre.query.all()
        theatres=[]
        # req_th=[]
        shows_at_id=[]
        if id:
            th=cache_api.theatre_api(id)
            # th=Theatre.query.filter_by(id=id).first()
            # shows_at=Theatre_Show.query.filter_by(Theatre_id=id).all()
            shows_at=cache_api.theatre_show_th(id)
            # print(shows_at)
            shows_at_id=[]
            for i in shows_at:
                # print(i)
                # if(Show.query.filter_by(id=i.Show_id).count()>0):
                if cache_api.show_api(i.Show_id):
                    s=cache_api.show_api(i.Show_id)
                    shows_at_id+=[{'id':s.id,'name':s.Name, 'tag':s.Tag,'rating':s.Rating,'price':s.Ticket_Price}]
            theatres=[{"id":th.id, "name":th.Name, "place":th.Place,"capacity":th.Capacity}]
        else:
            for venue in venues:
                theatres+=[{'id':venue.id, 'Name':venue.Name, 'Place':venue.Place, 'Capacity':venue.Capacity}]
        return {"theatres":theatres,"shows_at_id":shows_at_id}
    
    @auth_required('token')
    def post(self):
        name=request.json.get('name')
        place=request.json.get('place')
        capacity=request.json.get('capacity')
    # func.lower(User.username) == func.lower("GaNyE")
        # venue=venue_data()
        # venue_show={}
        # venue1=json.dumps(venue_data())    #converts dict to string
        # venue_dict= json.loads(venue1)  
        # print(name, place, capacity)
        repeat_name=Theatre.query.filter_by(Name=name).count()
        repeat_place=Theatre.query.filter_by(Place=place).count()
        # print(current_user.email)
        # current=current_user
        user=User.query.filter_by(email = current_user.email).first()
        # print(user.email)
        if (user.email != "admin@gmail.com"):
            response=jsonify("Not authorized")
            response.status_code=401
            return response
        
        if (repeat_name>=1 ) and (repeat_place>=1) :
            response = jsonify(error='Unacceptable form')
            response.status_code = 410
            return response
        else:
            new_theatre=Theatre(Name=name,Place=place, Capacity=capacity)
            db.session.add(new_theatre)
            db.session.commit()
            cache_api.delete_pattern('all_theatres_api') 
            return 200
    
    def put(self, id=None):
        name=request.json.get('name',"")
        # print("1")
        name=request.json.get('name',"")
        capacity=request.json.get('capacity', "")

        if (current_user.email != "admin@gmail.com"):
            response=jsonify("Not authorized")
            response.status_code=401 
            return response
        
        # th_now=theatre_model.query.filter_by(id=id).first()
        th_now=cache_api.theatre_api(id)
        if name=="":
            print('u1')
        elif name!="":
            th_now.Name=name
            
            # user.username=username
        if capacity=="":
            print('u3')
            
        elif capacity !="":
            th_now.Capacity=capacity

        print(name, capacity)

        db.session.commit()
        cache_api.delete_pattern('all_theatres_api') 
        return 200

    @auth_required('token')
    def delete(self,value="",id=None):
        if (current_user.email == "admin@gmail.com"):
            shows=Theatre_Show.query.filter_by(Theatre_id=id).all()
            for i in shows:
                # print(shows)
                db.session.delete(i)
                db.session.commit()
            the_theatre=theatre_model.query.filter_by(id=id).first()
            print(the_theatre)
            tix=ticket_model.query.filter_by(theatre_id=id).all()
            for i in tix:
                db.session.delete(i)
                db.session.commit()
            db.session.delete(the_theatre)
            db.session.commit()
            cache_api.delete_pattern('all_theatres_api') 
            return 200
        else:
            response=jsonify("Not authorized")
            response.status_code=401 
            return response

        
from datetime import datetime, timedelta


class Screening(Resource):
    @auth_required('token')
    def post(self):
        theatre_id=int(request.json.get('theatre_id'))
        show_id=int(request.json.get('show_id'))
        screen_theatre=Theatre_Show.query.filter_by(Theatre_id=theatre_id).count()
        # screen_show=Theatre_Show.query.filter_by(Theatre_id=theatre_id).all()
        screen_show=cache_api.theatre_show_th(theatre_id)
        pres=False
        # print(show_id, screen_show)
        print(current_user.email)
        for i in screen_show:
            if i.Show_id==show_id:
                pres=True
                break
        # print(current)
        if (current_user.email != "admin@gmail.com"):

            response=jsonify("Not authorized")
            response.status_code=401
            return response
        
        # print(screen_show)
        # total_theatres=Theatre.query.distinct(Theatre.Name).count()
        # total_shows=Show.query.distinct(Show.Name).count()
        
        if ((theatre_model.query.filter_by(id=theatre_id).count()==0) and (show_model.query.filter_by(id=show_id).count()==0)):
            response=jsonify(error="Theatre and Show not found")
            response.status=407
            return response
        elif (theatre_model.query.filter_by(id=theatre_id).count() ==0):
            response=jsonify(error="Theatre not found")
            response.status=408
            return response
        elif (show_model.query.filter_by(id=show_id).count()==0):
            response=jsonify(error="Show not found")
            response.status=409
            return response
        elif (screen_theatre>=1 and (pres)):
            response = jsonify(error='Already exists')
            response.status=410
            return response
        else:
            # now=datetime.now()
            # next_day = now + timedelta(days=1)
            # next_day_with_time = next_day.replace(hour=18, minute=30, second=0)
            new=Theatre_Show(Theatre_id=theatre_id, Show_id=show_id)
            db.session.add(new)
            db.session.commit()
            cache_api.delete_pattern('theatre_show_api')
            
            return 200

        
from datetime import datetime
class Tickets(Resource):

    @auth_required('token') 
    def post(self,th_id=None, show_id=None):
        #no caching used here-  atleast should be realtime for user
        al_booked=ticket_model.query.filter_by(theatre_id=th_id, show_id=show_id).count()
        # cap=Theatre.query.filter_by(id=th_id).first().Capacity
        cap=cache_api.theatre_api(th_id).Capacity
        print(cap)
        # show_chosen=Theatre_Show.query.filter_by(Theatre_id=th_id, Show_id=show_id).first()
        if (current_user.email == "admin@gmail.com"):
            response=jsonify("Not authorized")
            response.status_code=401
            return response
        if al_booked<cap:
            new_tix=ticket_model(user_id=current_user.id,theatre_id=th_id, show_id=show_id, date=datetime.now())
            db.session.add(new_tix)
            db.session.commit()
            return 200
        else:
            response=jsonify(error="Fully Booked")
            response.status=400
            return response
    
    @auth_required('token')
    def get(self, id=None):
        if (current_user.email == "admin@gmail.com"):
            response=jsonify("Not authorized")
            response.status_code=401
            return response
        # print(current_user.email)
        mytix=ticket_model.query.with_entities(ticket_model.user_id,ticket_model.theatre_id,ticket_model.show_id,ticket_model.date, func.count(ticket_model.theatre_id).label('count')).filter_by(user_id=current_user.id).group_by(ticket_model.theatre_id,ticket_model.show_id).all()
        # print(mytix)
        tickets=[]
        for tix in mytix:
            # th_name=Theatre.query.filter_by(id=tix.theatre_id).first()
            # /(24*60*60)
            if ((datetime.now()- tix.date).total_seconds()/(24*60*60))<31:
                th_name=cache_api.theatre_api(tix.theatre_id)
                # sh_name=show_model.query.filter_by(id=tix.show_id).first()
                # print(tix.date.date())
                sh_name=cache_api.show_api(tix.show_id)
                tickets+=[{"user_id":tix.user_id,"theatre_id":tix.theatre_id,
                        "theatre":th_name.Name,"Place":th_name.Place,
                        "show":sh_name.Name,"price":sh_name.Ticket_Price, "tag":sh_name.Tag,
                        "show_id":tix.show_id,"booked_on":tix.date, 'count':tix.count}]
        # print(tickets)
        return jsonify({"status":200,"tix":tickets, "user":current_user.username})
        

# with_entities(Table.column, func.count(Table.column))
from jinja2 import Template

def format_pdf(temp,data):
    # print(temp)
    # print(data)
    with open(temp) as file_:
        temp=Template(file_.read())
        return temp.render(data=data)
    
from weasyprint import HTML
import uuid

class Backend_Jobs(Resource):
    def post(self):
        user_id=current_user.id
        uname=current_user.username
        user=User.query.filter_by(id=user_id).first()
        user_data={'id':user.id , 'u_name':user.username, 'email':user.email}
        u_tix=ticket_model.query.with_entities(ticket_model.user_id,ticket_model.theatre_id,ticket_model.show_id,ticket_model.date, func.count(ticket_model.theatre_id).label('count')).filter_by(user_id=current_user.id).group_by(ticket_model.theatre_id,ticket_model.show_id).all()
            # print(mytix)
        tickets=[]
        for tix in u_tix:
            th_name=theatre_model.query.filter_by(id=tix.theatre_id).first()
            sh_name=show_model.query.filter_by(id=tix.show_id).first()
            tickets+=[{"user_id":tix.user_id,"theatre_id":tix.theatre_id,
                        "theatre":th_name.Name,"Place":th_name.Place,
                        "show":sh_name.Name,"price":sh_name.Ticket_Price, "tag":sh_name.Tag,
                        "show_id":tix.show_id, "booked_on":tix.date.date(),'count':tix.count}]
            # print(tickets)
        # print(tickets)
        # data={tickets}
        msg=format_pdf(temp="./pdf_gen.html",data=tickets)
        # print(msg)
        html=HTML(string=msg)
        print(html)
        file_name=str(user_data['u_name']) +".pdf"
        print(file_name)
        html.write_pdf(target=file_name)


    # HTML.write_pdf("/")
        return {"file_name":file_name, "user":uname}
    
