from main import app
from models import db, Theatre, Show, theatre_show
from sec import user_datastore
from flask_security import hash_password



#add this in main.py file for addition of user as sson as creation of file
if __name__=="__main__":
    with app.app_context():
        db.create_all()
        # theatre=Theatre(Name="Airport theatre", Place="Mumbai", Capacity=100, show_id=3)
        # db.session.add(theatre)
        # show=Show(Name="Badshah", Rating="5", Tag="action", Ticket_Price=5000)
        # db.session.add(show)
        # if not user_datastore.find_user(email="shivani@gmail.com"):
        # #     user_datastore.create_user(email="shivani@gmail.com", password=hash_password("1234"))
        # theatre=Theatre.query.filter_by(id=1)
        # print(theatre)
        # theatre.theatre_show.append(1)
        # db.session.commit()