# imports
from libdw import pyrebase

# setting up my firebase
# URL to Firebase database
url = 'https://esc-database-e2327.firebaseio.com/'
# unique token used for authentication
apikey = 'AIzaSyA3Tre2bmTQFNiHFDstJZChMy7f5yD2Y0U'

config = {
    "apiKey": apikey,
    "databaseURL": url,
}

# database
firebase = pyrebase.initialize_app(config)
db = firebase.database()

# database first child
agent_database = db.child("Agent").get()
user_database = db.child("User").get()

# reset agent details
for agent in agent_database.val():
    db.child("Agent").child(agent).child("queue").set("NULL")
    db.child("Agent").child(agent).child("status").set("Available")

# reset user details
for user in user_database.val():
    db.child("User").child(user).child("agent").set("Unassigned")
