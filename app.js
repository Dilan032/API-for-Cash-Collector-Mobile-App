const express = require('express');

const app = express(); // Create an instance of an Express app

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// port number can change in (.env) file and defalt port number 3000
const port = process.env.PORT || 3000;
app.listen(port,()=>{ console.log(`Sever Start on Port ${port}`); });
    

//define routes
app.get('/', (req, res) => {
    res.send('hello'); // Send the response 'hello'
});

app.use('/login', require('./routes/login')); // {/login/pin} {/login/UserName} routes in (routes folder login.js)
app.use('/user', require('./routes/user')); // {/user/AccountDetails} {/user/updateUserPassword} {/user/all-details} {/user/search} routes in (routes folder user.js)
app.use('/request', require('./routes/forgotPassword')); // {/request/get-otp} {/request/verify-otp} {/request/reset-password} routes in (routes folder forgotPassword.js)
app.use('/customer', require('./routes/customer.js')); // {/customer/all-details} {/customer/search} routes in (routes folder customer.js)
app.use('/collectAmount', require('./routes/collectAmount.js')); // { /collectAmount/all }