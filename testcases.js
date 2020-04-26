const assert = require('assert');
const sourceFile = require('./classes.js');

/* assistant function to change the database details for the different tests */
function set_agent_details(i, available, custqueue, expertise, product) {
    var agent = sourceFile.database.agents[i];
    agent.available = available;
    agent.custqueue = custqueue;
    agent.expertise = expertise;
    agent.product = product
}

/* assistant function to change the database details for the different tests */
function set_cust_details(i, product, issue, agent) {
    var cust = sourceFile.database.customers[i];
    cust.product = product;
    cust.issue = issue;
    cust.agent = agent;
}

/* assistant function to get new database of agents */
function get_agents() {
    var agentList = [];
    for (agent of sourceFile.database.agents) {
        agentList.push(new sourceFile.Agent(agent.id, agent.name, agent.expertise, agent.product,
            agent.available, agent.custqueue));
    }
    return agentList;
}

/* assistant function to get new database of customers */
function get_cust() {
    var custList = [];
    for (cust of sourceFile.database.customers) {
        custList.push(new sourceFile.Customer(cust.first, cust.last, cust.product, cust.issue, cust.agent));
    }
    return custList;
}

function match() {
    var updated_cust = [];
    for (customer of get_cust()) {
        for (agent of sourceFile.available(get_agents())) {
            if ((agent.skills == customer.issue) && (agent.product == customer.product)) {
                customer.agent = agent.name;
                //console.log(customer.agent);
                agent.queue.push(customer.firstname + " " + customer.lastname);
                //console.log(agent.queue);
            }
        }
        if (customer.agent == undefined) {
            //console.log("No available agents");
        }
        updated_cust.push(customer.agent);
    }
    return updated_cust;
}

/*** unit test for translated sorting function ***/
/* test 1: some agents are unavailable */
function f01() {
    const fin_ans = ['Joshua', 'ZhaoYi'];
    set_agent_details(0, true, [], 'hardware', 'Epad');
    set_agent_details(1, true, [], 'software', 'Ephone');
    set_agent_details(2, false, [], 'replacement of parts', 'Emac');
    
    var sorted_agents = sourceFile.available(get_agents());
    var names = [];
    for (agent of sorted_agents) {
         names.push(agent.name);
    }
    console.log(fin_ans);
    console.log(names);
}

function f02() {
    const fin_ans = ['ZhaoYi'];
    set_agent_details(0, false, [], 'hardware', 'Epad');
    set_agent_details(1, true, [], 'software', 'Ephone');
    set_agent_details(2, false, [], 'replacement of parts', 'Emac');
    
    var sorted_agents = sourceFile.available(get_agents());
    var names = [];
    for (agent of sorted_agents) {
         names.push(agent.name);
    }
    console.log(fin_ans);
    console.log(names);
}

/* test 2: some agents are unavailable and have >=5 people in queue */
function f03() {
    const fin_ans = ['ZhaoYi'];
    set_agent_details(0, true, ['cust1', 'cust2', 'cust3', 'cust 4', 'cust 5'], 'hardware', 'Epad');
    set_agent_details(1, true, ['cust1', 'cust2', 'cust3', 'cust4'], 'software', 'Ephone');
    set_agent_details(2, false, [], 'replacement of parts', 'Emac');
    
    var sorted_agents = sourceFile.available(get_agents());
    var names = [];
    for (agent of sorted_agents) {
         names.push(agent.name);
    }
    console.log(fin_ans);
    console.log(names);
}

/* test 3: some agents are unavailable and have >=5 people in queue [check order] */
function f04() {
    const fin_ans = ['Sandeep', 'ZhaoYi'];
    set_agent_details(0, true, ['cust1', 'cust2', 'cust3', 'cust 4', 'cust 5'], 'hardware', 'Epad');
    set_agent_details(1, true, ['cust1', 'cust2'], 'software', 'Ephone');
    set_agent_details(2, true, [], 'replacement of parts', 'Emac');
    
    var sorted_agents = sourceFile.available(get_agents());
    var names = [];
    for (agent of sorted_agents) {
         names.push(agent.name);
    }
    console.log(fin_ans);
    console.log(names);
}

/* test 4: no available agents */
function f05() {
    const fin_ans = [];
    set_agent_details(0, false, ['cust1', 'cust2', 'cust3'], 'hardware', 'Epad');
    set_agent_details(1, true, ['cust1', 'cust2', 'cust3', 'cust4', 'cust5'], 'software', 'Ephone');
    set_agent_details(2, false, [], 'replacement of parts', 'Emac');
    
    var sorted_agents = sourceFile.available(get_agents());
    var names = [];
    for (agent of sorted_agents) {
         names.push(agent.name);
    }
    console.log(fin_ans);
    console.log(names);
}

/*** unit test for translated algorithm ***/
/* test 1: agents available but mismatch with product||issue */
function s01() {
    var fin_ans = [undefined, 'Joshua', 'Sandeep'];
    set_agent_details(0, true, [], 'hardware', 'Ephone');
    set_agent_details(1, true, [], 'software', 'Ephone');
    set_agent_details(2, true, [], 'replacement of parts', 'Emac');

    var matched = match();
    console.log(fin_ans);
    console.log(matched);
}

/* test 2: agents available but mismatch with product||issue [check agent assignment order]*/
function s02() {
    var fin_ans = [undefined, 'ZhaoYi', 'Sandeep'];
    set_agent_details(0, true, ['cust1', 'cust2'], 'hardware', 'Ephone');
    set_agent_details(1, true, ['cust1'], 'hardware', 'Ephone');
    set_agent_details(2, true, [], 'replacement of parts', 'Emac');

    var matched = match();
    console.log(fin_ans);
    console.log(matched);
}

/* test 3: agents unavailable||mismatch with product||issue [check agent assignment order] */
function s03() {
    var fin_ans = [undefined, 'Joshua', undefined];
    set_agent_details(0, true, ['cust1', 'cust2'], 'hardware', 'Ephone');
    set_agent_details(1, true, ['cust1', 'cust2', 'cust3', 'cust4'], 'hardware', 'Ephone');
    set_agent_details(2, false, [], 'replacement of parts', 'Emac');

    var matched = match();
    console.log(fin_ans);
    console.log(matched);
}

function s04() {
    var fin_ans = [undefined, undefined, 'Sandeep'];
    set_agent_details(0, true, ['cust1', 'cust2', 'cust3', 'cust4', 'cust5'], 'hardware', 'Ephone');
    set_agent_details(1, false, ['cust1', 'cust2', 'cust3', 'cust4'], 'hardware', 'Ephone');
    set_agent_details(2, true, [], 'replacement of parts', 'Emac');

    var matched = match();
    console.log(fin_ans);
    console.log(matched); 
}

s02();
s03();