from flask_security import SQLAlchemyUserDatastore, Security
from models import db, User, Role
from flask_security import hash_password
## for activate_urser / add_permision to user / add_role_to user / create role/ create_user


#SQLAlchemyUserDatastore 
user_datastore = SQLAlchemyUserDatastore(db, User, Role)

# def new_initialize():
#     user_datastore.create_role(name="admin")
#     user_datastore.create_role(username="admin", email="admin@gmail.com", password=hash_password("1234"))
