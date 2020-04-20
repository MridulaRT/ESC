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
    let {answers} = req.body;
    var product = answers[0];
    var issue = answers[1];
    console.log(answers);
    console.log(product);
    console.log(issue);
});