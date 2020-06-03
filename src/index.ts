import * as express from 'express';

//here is constructor call as express()
let app:express.Application = express();

//litsen is use for start server
app.listen(5000,()=> {
   console.log('server is running at port 5000');
})

//Routing example
let data = {
    firstname: 'Vineet',
    lastname: 'Verma',
    gender: 'Male'
}
app.get('/login', (req, res) => {
    res.send(data);
})