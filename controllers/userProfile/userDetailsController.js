// this file contain 'show login user all details' module and 'login user all details update' module
// Add SQL query that changes dynamically based on user input


const db = require('../../database');

//module for get user details
const userDetails = (req,res) =>{
    const user = req.result; // this data get from Json web token
    
    db.query('SELECT * FROM users WHERE UserName = ?', [user.UserName],(error, result) =>{
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later'  });
        }else {
            // Loop through the results and remove the password field and mobile_password field
            result.forEach(row => {
                delete row.Password;  
                delete row.mobile_password;  
            });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' }); 
        }

        const userDetails = result[0]; // Get the first result


        // Convert OpnDat and DueDat to Sri Lanka Standard Time (UTC +5:30)
        const convertedResult = result.map(row => {
            // Create Date objects
            const created_dateSLST = new Date(new Date(row.created_date).getTime() + (5 * 60 + 30) * 60000);

            // Return a new row object with converted dates
            return {
                ...row,
                created_date: created_dateSLST
            };
        });

        // Return all customer details with SLST dates
        res.status(200).json(convertedResult);
        
    });
};



// module for updateUserDetails 
const updateUserDetails = (req, res) =>{
    const user = req.result; // get user details using json web token
    const newUserData = req.body; // get data from client

    // check client data provide or not
    if(!newUserData || Object.keys(newUserData).length === 0){
        return res.status(400).json({ message: 'No data provided for update' });
    }

    // query update dynamically
    let query = 'UPDATE users SET ';
    const field = [];
    const values = [];

    // in request body data add to the SQL query and to the body
    for(const key in newUserData){
        if(newUserData.hasOwnProperty(key)){
            field.push(`${key} = ?`) // add "field = ?" to the query
            values.push(newUserData[key]); // add the value to the values array
        }
    }

    query = query + field.join(', '); // field add to the query
    query = query + ' WHERE UserName = ?'; // add the sql stetment to the excising query
    values.push(user.UserName); // add the query for idenfify the user

    // main query for Run
    db.query(query, values, (error, result) => {
        if (error)
            { return res.status(500).json({ message: 'Server error, please try again later' })};
    

        // checking whether any user record was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User details updated successfully'
        });
   
    });

};


// export modules
module.exports = {
    userDetails,
    updateUserDetails
};