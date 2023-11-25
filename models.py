# from flask import Flask, render_template, redirect, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_security import RoleMixin, UserMixin
from sqlalchemy import Column, Integer, String, ForeignKey
from flask_login import current_user

db=SQLAlchemy()

 
#UserMixin / RoleMixin - class of functions that can be imported / used in a model 
#UserMixin - all functions useful for User
# #RoleMixin 0 extends role class
# theatre_show= db.Table('theatre_show',
#                        db.Column('theatre_id', db.Integer, db.ForeignKey('theatre.id')),
#                        db.Column("show_id",db.Integer, db.ForeignKey('show.id')))

class Show(db.Model):
    __tablename__="show"
    id=db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(100), nullable=False)
    Tag=db.Column(db.String(), nullable=True)
    Rating=db.Column(db.Integer(), nullable=True)
    Ticket_Price=db.Column(db.Integer(), nullable=False)
    # theatres=db.relationship('Theatre', back_populates='show')


class Theatre(db.Model):
    __tablename__="theatre"
    id = db.Column(db.Integer, primary_key = True)
    Name = db.Column(db.String(100), nullable=False)
    Place = db.Column(db.String(255), nullable=False)
    Capacity=db.Column(db.Integer, nullable=False)


class Theatre_Show(db.Model):
    __tablename__="theatre_show"
    id=db.Column(db.Integer,primary_key=True)
    Theatre_id=db.Column(db.Integer, db.ForeignKey("theatre.id"))
    Show_id=db.Column(db.Integer, db.ForeignKey("show.id"))


roles_users = db.Table('roles_users',
                       db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))



class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String, unique=False, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean())    #user active or not 
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)   #token generation ; random string  token based authentication
    roles = db.relationship('Role', secondary=roles_users,                      #relationship between user and role
                            backref=db.backref('users', lazy='dynamic'))


from datetime import datetime

class LatestLogin(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    user_id=db.Column(db.Integer, db.ForeignKey("user.id"))
    time=db.Column(db.DateTime)



class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


class Tickets(db.Model,UserMixin):
    id=db.Column(db.Integer(), primary_key=True, autoincrement=True)
    user_id=db.Column(db.Integer(),db.ForeignKey("user.id"))
    theatre_id=db.Column(db.Integer(),db.ForeignKey("theatre.id"))
    show_id=db.Column(db.Integer(), db.ForeignKey("show.id"))
    date=db.Column(db.DateTime())



