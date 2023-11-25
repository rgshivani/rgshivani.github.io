#seperate file - for adding flask security

# SQLALCHEMY_DATABASE_URI="sqlite:///tktshow.db"
SECRET_KEY = "thisissecter"                 
SECURITY_PASSWORD_SALT = "thisissaltt"                                      #reincript password
SQLALCHEMY_TRACK_MODIFICATIONS = False                                      #seperate the warnings 
WTF_CSRF_ENABLED = False                                                    #protects the form
SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'               #sends in header authentication token 
SECURITY_UNAUTHORIZED_VIEW = '/userlogin'
SECURITY_POST_LOGOUT_VIEW="/userlogin"
CACHE_TYPE="RedisCache"
CACHE_REDIS_HOST="localhost"
CACHE_REDIS_PORT=6379
# CACHE_REDIS_URL="redis://localhost:6379/0"

# authentication system with token - for protection of authentication user uses token header to send the token6379
INIT_SETUP=False