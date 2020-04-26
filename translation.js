const cnf = require('./classes.js');
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
    for (agent of cnf.database.agents) {
        agentList.push(new cnf.Agent(agent.id, agent.name, agent.expertise, agent.product, agent.available, agent.custqueue));
    }
    //console.log(agentList);

    var customer = new cnf.Customer(guestFirstName, guestLastName, product, issue);
    console.log(customer);

    /* agent assignment happens here*/
    for (agent of cnf.available(agentList)) {
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