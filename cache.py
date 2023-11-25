from flask_caching import Cache
import config
# from main import current_app as app

cache = Cache()
def initialize_cache(app):
    cache.init_app(app)