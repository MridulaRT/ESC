# imports
from libdw import pyrebase

# agent class
class Agent(object):
    def __init__(self, id, name, skills, availability, queue):
        self.id = id
        self.name = name
        self.skills = skills
        self.availability = availability

        if queue == "NULL":
            self.queue = []
        else:
            self.queue = queue

    def get_id(self):
        return self.id

    def get_name(self):
        return self.name

    def get_skills(self):
        return self.skills

    def get_availability(self):
        return self.availability

    def get_queue(self):
        return self.queue

    def add_to_queue(self, customer):
        self.queue.append(customer)

    def delete_from_queue(self, customer):
        del self.queue[0]

    def set_available(self):
        self.availability = True

    def set_unavailable(self):
        self.availability = False

# user class
class Customer(object):
    def __init__(self, id, name, issue, agent):
        self.id = id
        self.name = name
        self.issue = issue
        self.agent = agent

    def get_id(self):
        return self.id

    def get_name(self):
        return self.name

    def get_issue(self):
        return self.issue

    def get_agent(self):
        return self.agent

# code methods and instantiations
'''this is ian's section of code'''
sorted_agent_list = []

#checks the agentList. If agent has less than 5 customers in their queue, add to sortedAgentList
def check_agent_list(a):
    for i in a[:]:
        if len(i.get_queue()) < 5:
            sorted_agent_list.append(i)
            #a.remove(i)

#checks the sortedAgentList. If agent has more than 5 customers in their queue, remove it and add it back to agentList
def check_sorted_list(a):
    for i in a[:]:
        if len(i.get_queue()) > 5:
            #agent_list.append(i)
            a.remove(i)


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

# for viewing
#adb = {}
#udb = {}

agent_list = []
user_list = []

# agent details
for agent in agent_database.each():
    agent_id = agent.key()
    #print(agent.val())
    agent_name = agent.val().get("name")
    agent_division = agent.val().get("division")
    agent_status = agent.val().get("status")
    agent_queue = agent.val().get("queue")
    #adb[agent_name] = {agent_division, agent_status, agent_queue}
    agent_list.append(Agent(agent_id, agent_name, agent_division, agent_status, agent_queue))

# user details
for user in user_database.each():
    user_id = user.key()
    user_name = user.val().get("name")
    user_issue = user.val().get("issue")
    assigned_agent = user.val().get("agent")
    #udb[user_name] = user_issue
    user_list.append(Customer(user_id, user_name, user_issue, assigned_agent))

#print(adb)
#print(udb)

'''start of algorithm'''
'''this is ian's section of code'''
# identifying all agents with <5 customers
check_agent_list(agent_list)

#If not all agents have empty queues, then sort the agents based on their number of people in queue
# aka no need to sort if all agents have no queue
if all(len(v.get_queue()) == 0 for v in sorted_agent_list) == False:
    sorted_agent_list = sorted(sorted_agent_list, key=lambda Agent:len(Agent.get_queue()))

'''changes made here'''
while True:
    if len(user_list) > 0:
        for i in range(len(sorted_agent_list))[:]:
            if  len(user_list) > 0:
                #if customer's request coincides with agent's skillset
                current_agent = sorted_agent_list[i]
                print(current_agent.get_skills())
                current_user = user_list[0]
                print(current_user.get_issue())
                if current_agent.get_skills() == current_user.get_issue():
                    print("Checking {}'s skills and {}'s skills".format(current_agent.get_name(), current_user.get_name()))
                    #add customer to agent's list
                    current_agent.add_to_queue(current_user.get_name())
                    db.child("Agent").child(current_agent.get_id()).child("queue").set(current_agent.get_queue())
                    # change the assignment on customer side as well
                    db.child("User").child(current_user.get_id()).child("agent").set(current_agent.get_name())
                    print("{} added to {}'s queue".format(current_user.get_name(), current_agent.get_name()))
                    print("----------------------------------------------")
                    del user_list[0] #delete customer from customerList
                    check_sorted_list(sorted_agent_list) #checks the sortedAgentList to see if theres any agent with len(queues)>5
                    check_agent_list(agent_list) #checks the agentList to see if theres any agent with len(queues)<5
                    sorted_agent_list = sorted(sorted_agent_list, key=lambda Agent:len(Agent.get_queue())) #sorts the sortedAgentList
    else:
        break

print("Sorted Agent List in order")
print("----------------------------------------------")
for i in sorted_agent_list:
    print(i.get_name())
    print(i.get_queue())
print("----------------------------------------------")


joinedAgentList = agent_list + sorted_agent_list

for i in joinedAgentList:
    if i.get_availability() == "Available": #if agent has no customer assigned -> means its available
        i.set_assignment() #assign first customer in agent's queue to him
        i.delete_from_queue() #delete first customer in agent's queue
    else:
        pass

#reset code for database
#for user in user_database:
#    user.agent = "Unassigned"

#for agent in agent_database:
#    agent.queue = "NULL"
#    agent.status = "Available"
