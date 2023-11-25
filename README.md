# Appdev2

## Description
The aim was to create a ticket-booking platform. With different roles i.e. user and admin, both have different functionalities associated with them. The web app allows users to book tickets, and filter by location, and genre. The user also receives regular notifications regarding the monthly booking and regular mail if the site is not visited.
Technologies used
  Vue.js: Frontend framework to render webpages, execute JavaScript logic
  Flask: Backend framework, defining routes, handling APIs
  flask_sqlalchemy: For the database handling, querying with Flask logic
  Sqlite3: Database
  Flask-CORS: for handling cross-server request
  Flask-Security: token-based authentication of user/admin
  Flask-Restful: APIs
  Celery: backend Jobs- e.g. sending emails, scheduled tasks using celery beat
  Redis : redis-server is used along with celery, used for caching
  Smtplib: send emails to the user using Simple Mail Transfer Protocol
  Mailhog: tests the working of the SMTP connections/ validation of working code
  Weasyprint: Create HTML for sending to users using smtplib
  Jinja: used for populating templates in html created using weasyprint
  Bootstrap: used for creating the structure of the webpages

  
## DB Schema Design (In models.py)
  Show: id, Name, Tag, Rating, Ticket_Price
  Theatre: id, Name , Place, Capacity
  Role : id, name, description
  User: id, email, password, active, fs_uniquifier, role
  Theatre_show: id, Theatre_id, Show_id
  LatestLogin : id, user_id, time
  Tickets: id, user_id, theatre_id, show_id, date

## API Design
Profile:
  GET – for user details page, pull user’s email, username
  POST- add user details, in case of repeating username/email – show error // PUT- edit user details
Show:
  GET (id, value) – get all shows , if id is provided – filter by id, is value is provided – filter by Tag / returns shows in specific venue(theatre) , all shows and data after filtering by id/value
  POST- add to shows table, do not accept form, if the show names repeat [only for user], delete existing cache
  PUT – edit shows table [only for user] , delete existing cache
  DELETE – for deleting show, have to delete other associations too – first delete all the screenings ( from Theatre_Show), then from tickets booked, and finally from Show table.
Theatres:  
  GET- pull all theatres, and the shows at specific theatres.
  POST- Add to Theatres table, do not accept the form if Name/ Place repeats / PUT- edit Theatre data (only Name, Capacity)
  DELETE- – for deleting the show, have to delete other associations too – first delete all the screenings ( from Theatre_Show), then from tickets booked, and finally from Theatre table
Screening:
  POST – add the screening to the Theatre_Show table with the theatre_id, show_id, do not accept if show/theatre doesn’t exist or if screening already exists.
Tickets:
  GET- get theatres and screening shows booked by user. Take all the bookings filtered by user, and group them by theatre and show, and the get the count for each existing combination.
  POST- add to the tickets table, along with the booking time using datetime.now()
  
Backend_jobs – for creating specific pages using the booking done by the user.
Login: edit the LatestLogin table when the user is authorized using token ( @auth_required(‘token’) ) , new row is added / the time of login is updated
Periodic Tasks: Send monthly report to the user with tickets booked during the last month // Send mails to the user if the user has not visited the site in the last 24 hours- to encourage visit to the webpage.


Architecture/ Features
The main.py file contains the app initializations, celery initialization, email address, and passwords for the SMTP server along with the celery function definitions and periodic tasks. The config.py contains the configuration details for the app, e.g. the SECRET_KET, SECURITY_PASSWORD_SALT etc.. The models.py contains the table definitions. The celery_config.py contains the configuration details for celery, and the cache_config.py has the details for initializing the cache. The cache_api.py contains the cache functions. The timeout set for cache functions is 50 seconds. The sec.py creates the user_datastore.
The static folder contains app.js, routes.js and a components folder which contains the .js files. The .js files include data for rendering of pages , and the methods required for updating the page, along with routing to other pages on button clicks. The app.js file has the navigation bar which appears on all the pages.
The api folder contains __init__.py and resources.py folder. The __init__.py file has the api resources, whereas the resources.py contains the actual functions of the API. The instances file contains the database.db file.
On export of theatre/show detail by the admin, a csv file containing details of theatre and its corresponding shows is generated, and when exporting show details, all relevant theatres are present in the csv file. The csv files are placed in the static folder. \
For sending monthly emails to user, pdf files are created containing the details of the user’s booking, these are stored in the root folder.
