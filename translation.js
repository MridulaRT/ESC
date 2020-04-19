// basically the classes? I know classes exist in JS but conflicting info about them
function Agent(id, name, skills, availability, queue) {
    // details from contacts
    this.id = id,
    this.name = name,
    this.skills = skills,
    this.availability = availability,
    this.queue = queue
};

function Customer(id, name, issue, agent) {
    // details from the guest accounts
    this.id = id,
    this.name = name,
    // details from the form
    this.issue = issue,
    // log this somewhere?
    this.agent = agent
};

// dummy database (need to figure out how to read json file and get details from rainbow)
var database = {
    agents: [
        {
            id: '123',
            name: 'Joshua',
            email: 'jyeoyi@gmail.com',
            password: 'Mahalo',
            entries: 0,
            //joined: new Date(),
            expertise: 'hardware',
            available: false,
            custqueue: []
        },
        {
            id: '21',
            name: 'ZhaoYi', 
            email: 'tesh@yahoo.com.sg',
            password: 'barmitzvah',
            entries: 21,
            //joined: new Date(),
            expertise: 'software',
            available: true,
            custqueue: ['cs1', 'cs2']
        },
        {
            id: '456',
            name: 'Sandeep', 
            email: 'donaldTrump@potus.com',
            password: 'trump',
            entries: 668,
            //joined: new Date(),
            expertise: 'others',
            available: true,
            custqueue: []
        }
    ],
    customers: [
        {
            id: '1003456',
            name: 'Jack',
            issue: 'software',
            agent: undefined
        },
        {
            id: '1003789',
            name: 'Jill',
            issue: 'software',
            agent: undefined
        },
        {
            id: '1003123',
            name: 'James',
            issue: 'others',
            agent: undefined
        }
    ]
}

/* checks if the agent has <5 customers in the queue before being considered by the algorithm
   also sorts the list of agents according to most free to least free */
function consider_available_agents(agentList) {
    var availableAgents = [];
    for (agent of agentList) {
        if ((agent.availability == true) && agent.queue.length < 5) {
            availableAgents.push(agent);
        }
    }
    availableAgents.sort(function(a, b) {return (a.queue.length - b.queue.length)});
    return availableAgents;
}

/* checks if an agent has been assigned to customer
   if no, add to list of customers to run in algorithm */
function id_unassigned_customers(customerList) {
    var unassignedCustomers = [];
    for (customer of customerList) {
        if (customer.agent == undefined) {
            unassignedCustomers.push(customer);
        }
    }
    return unassignedCustomers;
}

/* make the agentList and customerList here*/
var agentList = [];
for (agent of database.agents) {
    agentList.push(new Agent(agent.id, agent.name, agent.expertise, agent.available, agent.custqueue));
}
//console.log(agentList);

var customerList = [];
for (customer of database.customers) {
    customerList.push(new Customer(customer.id, customer.name, customer.issue, customer.agent));
}

//console.log(id_unassigned_customers(customerList).length);

/* agent assignment happens here*/
while (true) {
    // as long as there are unassigned customers
    var newCustomerList = id_unassigned_customers(customerList);
    if (newCustomerList.length > 0) {
        // take the 1st customer from the list
        var toBeAssigned = newCustomerList[0];
        console.log(toBeAssigned.name)
        console.log(toBeAssigned.issue)
        // check with every available agent if there is a match
        for (agent of consider_available_agents(agentList)) {
            //console.log(consider_available_agents(agentList))
            console.log(agent.name)
            console.log(agent.skills)
            if (agent.skills == toBeAssigned.issue) {
                toBeAssigned.agent = agent.name;
                agent.queue.push(toBeAssigned.name);
                newCustomerList.shift(toBeAssigned);
            }
        }
        // if there is no match among all the agents, pop the customer to move on
        if (toBeAssigned.agent == undefined) {
            newCustomerList.shift();
        }
        console.log(customerList)
    }
    break;
}