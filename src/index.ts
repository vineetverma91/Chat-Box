// litsen is use for start server
// app.listen(5000,()=> {
//    console.log('server is running at port 5000');
// })




//Routing example
let data = {
    firstname: 'Vineet',
    lastname: 'Verma',
    gender: 'Male'
}

// Note: we are create a middleware function
// app.use(function (req, res, next){
//   console.log('middleware called');
//   next();
// })

// app.get('api/user/login', (req, res, next) => {
//     console.log('middleware of login called');
//     res.status(200).send(data);
// })
// app.get('api/user/signup', (req, res) => {
//     res.status(200).send(data);
// })