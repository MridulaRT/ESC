/* basically the Agent and Customer classes */
class Agent {
    constructor(id, name, skills, product, availability, queue) {
        // details from contacts
        this.id = id,
        this.name = name,
        this.skills = skills,
        this.product = product,
        this.availability = availability,
        this.queue = queue;
    }
};

exports.Agent = Agent;

class Customer {
    constructor(first, last, product, issue, agent) {
        // details from the guest accounts
        this.firstname = first,
        this.lastname = last,
        // details from the form
        this.product = product,
        this.issue = issue,
        // log this somewhere?
        this.agent = agent;
    }
};

exports.Customer = Customer;

/* checks if the agent has <5 customers in the queue before being considered by the algorithm
   also sorts the list of agents according to most free to least free */
exports.available = function consider_available_agents(agentList) {
    var availableAgents = [];
    for (agent of agentList) {
        if ((agent.availability == true) && agent.queue.length < 5) {
            availableAgents.push(agent);
        }
    }
    availableAgents.sort(function(a, b) {return (a.queue.length - b.queue.length)});
    return availableAgents;
}

var database = {
    agents: [
        {
            id: '123',
            name: 'Joshua',
            product: 'Ephone',
            expertise: 'hardware',
            available: false,
            custqueue: []
        },
        {
            id: '21',
            name: 'ZhaoYi', 
            product: 'Epad',
            expertise: 'replacement of parts',
            available: true,
            custqueue: ['cs1', 'cs2']
        },
        {
            id: '456',
            name: 'Sandeep', 
            product: 'Emac',
            expertise: 'maintainance of parts',
            available: true,
            custqueue: []
        }
    ],
    customers: [
        {
            first: '1003456',
            last: 'Jack',
            product: 'Ephone',
            issue: 'maintainance of parts',
            agent: undefined
        },
        {
            first: '1003789',
            last: 'Jill',
            product: 'Ephone',
            issue: 'hardware',
            agent: undefined
        },
        {
            first: '1003123',
            last: 'James',
            product: 'Emac',
            issue: 'others',
            agent: undefined
        }
    ]
}

exports.database = database;