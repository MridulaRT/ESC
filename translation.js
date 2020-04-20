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
}
;

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
}
;

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

// dummy database (need to figure out how to read json file and get details from rainbow)
var database = {
    agents: [
        {
            id: '123',
            name: 'Joshua',
            email: 'jyeoyi@gmail.com',
            password: 'Mahalo',
            entries: 0,
            product: 'Ephone',
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
            product: 'Epad',
            expertise: 'replacement of parts',
            available: true,
            custqueue: ['cs1', 'cs2']
        },
        {
            id: '456',
            name: 'Sandeep', 
            email: 'donaldTrump@potus.com',
            password: 'trump',
            entries: 668,
            product: 'Emac',
            expertise: 'maintainance of parts',
            available: true,
            custqueue: []
        }
    ],
    customers: [
        {
            id: '1003456',
            name: 'Jack',
            product: 'Ephone',
            issue: 'maintainance of parts',
            agent: undefined
        },
        {
            id: '1003789',
            name: 'Jill',
            product: 'Ephone',
            issue: 'hardware',
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

var express = require('express');
var app = express();
app.listen(3001,()=>{
    console.log('running!');
})
app.use(express.json())

// Here's our first endpoint, for the index page
app.get('/',(req,res)=>{
    res.json("Up and running")
});

app.post('/form', (req, res)=>{
    /* get user's form details here */
    let {answers} = req.body;
    let guestFirstName = "First";
    let guestLastName = "Last";
    var product = answers[0];
    var issue = answers[1];

    /* make the agentList and customer instance here*/
    var agentList = [];
    for (agent of database.agents) {
        agentList.push(new Agent(agent.id, agent.name, agent.expertise, agent.product, agent.available, agent.custqueue));
    }
    //console.log(agentList);

    var customer = new Customer(guestFirstName, guestLastName, product, issue);
    console.log(customer);

    /* agent assignment happens here*/
    for (agent of consider_available_agents(agentList)) {
        if ((agent.skills == customer.issue) && (agent.product == customer.product)) {
            customer.agent = agent.name;
            console.log(customer.agent);
            agent.queue.push(customer.firstname + " " + customer.lastname);
            console.log(agent.queue);
        }
    }

    /* note if no agents matched */
    if (customer.agent == undefined) {
        console.log("No available agents");
    }
});



