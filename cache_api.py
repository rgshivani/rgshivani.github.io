from cache import cache

from models import Theatre, Show,Theatre_Show
# from main import current_app as app

@cache.cached(timeout=60, key_prefix='all_shows_api')
def all_shows_api():
    shows=Show.query.all()
    return shows

@cache.cached(timeout=60,  key_prefix='all_theatres_api')
def all_theatres_api():
    theatres=Theatre.query.all()
    return theatres

@cache.memoize(timeout=60) 
def show_api(id):
    show=Show.query.filter_by(id=id).first()
    return show

@cache.memoize(timeout=60) 
def theatre_api(id):
    theatre=Theatre.query.filter_by(id=id).first()
    return theatre

@cache.cached(timeout=60, key_prefix="theatre_show_api")
def theatre_show_api():
    reqs=Theatre_Show.query.all()
    return reqs

@cache.memoize(timeout=60)
def theatre_show_th(id):
    req=Theatre_Show.query.filter_by(Theatre_id=id).all()
    return req

@cache.memoize(timeout=60)
def theatre_show_sh(id):
    req=Theatre_Show.query.filter_by(Show_id=id).all()
    return req

def delete_pattern(pattern):
    # print(f'{pattern}')
    cache.delete(f'{pattern}')

    return "deleted"
