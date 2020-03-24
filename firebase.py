# imports
from libdw import pyrebase

# agent class
class Agent(object):
    def __init__(self, name, skills, availability, queue):
        self.name = name
        self.skills = skills
        self.availability = availability
        self.queue = queue

    def get_name(self):
        return self.name

    def get_skills(self):
        return self.skills

    def get_availability(self):
        return self.availability

    def get_queue(self):
        return self.queue

    def addToQueue(self, customer):
        self.queue.append(customer)

    def deleteFromQueue(self, customer):
        del self.queue[0]

    def setAvailable(self):
        self.availability = True

    def setUnavailable(self):
        self.availability = False

# user class
class Customer(object):
    def __init__(self, name, issue):
        self.name = name
        self.issue = issue

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

# for viewing
#adb = {}
#udb = {}

agent_list = []
user_list = []

# agent details
for agent in agent_database.each():
    agent_name = agent.val().get("name")
    agent_division = agent.val().get("division")
    agent_status = agent.val().get("status")
    agent_queue = agent.val().get("queue")
    #adb[agent_name] = {agent_division, agent_status, agent_queue}
    agent_list.append(Agent(agent_name, agent_division, agent_status, agent_queue))

# user details
for user in user_database.each():
    user_name = user.val().get("name")
    user_issue = user.val().get("issue")
    #udb[user_name] = user_issue
    user_list.append(Customer(user_name, user_issue))

#print(adb)
#print(udb)
