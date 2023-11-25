# from main import cache
from flask_restful import Api
from .resources import Theatres, Profile, Shows, Logout, Screening, Tickets, Backend_Jobs ,Login
from models import Theatre, Show, Theatre_Show
api=Api()  #every end point api starts with /api/blog as prefix
# from main import app
# from cache import cache
#each api end point as root_url/api/blog e.g. root_url/api/blog/create
api.add_resource(Login, "/login/<string:email>")
api.add_resource( Theatres ,'/theatre', '/theatre/<int:id>')
api.add_resource(Profile , '/profile/', '/profile/<int:id>')
api.add_resource(Shows,'/show/',"/show/<string:value>/",'/show/<int:id>')
api.add_resource(Logout, "/logout")
api.add_resource(Screening, "/screening")
api.add_resource(Tickets,"/ticket","/ticket/<int:th_id>/<int:show_id>"
                 )
api.add_resource(Backend_Jobs,"/backend/")
import cache_api
# api.add_resource(Export_data,"/export_data","/export_data/<string:t_s>/<int:id>")
# from models import Theatre
# from main import cache

# @cache.cached(timeout=50)
# def get_all_theatres():
#     print("1")
#     with app.app_context():
#         theatres=Theatre.query.all()
#     return theatres

# api.add_resource(Login,"/login")

# from main import cache
# @cache.cached(timeout=50)
# def get_all_shows():
#     with app.app_context():
#         shows=Show.query.all()
#     try:
#         cache.set('all_sh', shows, timeout=60)
#     except Exception as e:
#         print("Error while setting cache:", e)
#     return shows

# # @cache.cached(timeout=50)
# def get_show_by_id(id):
#     with app.app_context():
#         show_data=Show.query.filter_by(id=id).first()
#     try:
#         cache.set('sh_id', show_data, timeout=60)
#     except Exception as e:
#         print("Error while setting cache:", e)
#     return show_data

# @cache.cached(timeout=50)
# def get_all_theatres():
#     with app.app_context():
#         theatres=Theatre.query.all()
#     try:
#         cache.set('all_th', theatres, timeout=60)
#     except Exception as e:
#         print("Error while setting cache:", e)
#     return theatres

# # @cache.cached(timeout=50)
# def get_theatre_by_id(id):
#     with app.app_context():
#         theatre_data=Theatre.query.filter_by(id=id).first()
#     try:
#         cache.set('th_id', theatre_data, timeout=60)
#     except Exception as e:
#         print("Error while setting cache:", e)
#     return theatre_data

# # @cache.cached(timeout=50)
# def get_screening_by_th_id(id):
#     with app.app_context():
#         scr_data=Theatre_Show.query.filter_by(Theatre_id=id).all()
#     try:
#         cache.set('screen', scr_data, timeout=60)
#     except Exception as e:
#         print("Error while setting cache:", e)

#     return scr_data
