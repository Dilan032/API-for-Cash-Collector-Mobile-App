const db = require('../../database');

//module for get user details
const userDetails = (req,res) =>{
    const user = req.result; // this data get from Json web token
    
    db.query('SELECT * FROM users WHERE UserName = ?', [user.UserName],(error, result) =>{
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later'  });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' }); 
        }

        // Return all user details 
        res.status(200).json( result[0] ); // get first result and send to the client
        
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