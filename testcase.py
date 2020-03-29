'''mri's database code'''
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


# TEST 1: all users are Unassigned and all agents are available
def test1():
    # set agent details
    for agent in agent_database.val():
        db.child("Agent").child(agent).child("queue").set("NULL")
        db.child("Agent").child(agent).child("status").set("Available")

    # set user details
    for user in user_database.val():
        db.child("User").child(user).child("agent").set("Unassigned")


# TEST 2: all agents unavailable and some users Unassigned
def test2():
    # set agent details
    for agent in agent_database.val():
        # TODO: must edit to fill queue?
        db.child("Agent").child(agent).child("queue").set("[NULL, NULL, NULL, NULL, NULL]")
        db.child("Agent").child(agent).child("status").set("Busy")

    # set user details
    i = 0
    for user in user_database.val():
        if i < 3:
            db.child("User").child(user).child("agent").set("Unassigned")
            i++
        else:
            db.child("User").child(user).child("agent").set("Assigned")

# TEST 3: agents available but all users assigned
def test3():
    # TODO: must edit to determine which agents are available and not | consider all?
    # set agent details
    for agent in agent_database.val():
        db.child("Agent").child(agent).child("queue").set("NULL")
        db.child("Agent").child(agent).child("status").set("Available")

    # set user details
    for user in user_database.val():
        db.child("User").child(user).child("agent").set("Assigned")

# TEST 4: agents available but no users
def test4():
    # set agent details
    for agent in agent_database.val():
        db.child("Agent").child(agent).child("queue").set("NULL")
        db.child("Agent").child(agent).child("status").set("Available")

    # TODO: firgure out how to delete the children (users)
    # set user details
    for user in user_database.val():
        db.child("User").child(user).child("agent").set("Unassigned")

# TEST 5: some agents available, some users Unassigned
def test5():
    # TODO: must edit to determine which agents are available and not
    # set agent details
    for agent in agent_database.val():
        db.child("Agent").child(agent).child("queue").set("NULL")
        db.child("Agent").child(agent).child("status").set("Available")

    # TODO: must edit to determine which users are available and not
    # set user details
    for user in user_database.val():
        db.child("User").child(user).child("agent").set("Unassigned")
