// function to get sri lankan date and time
const getDateAndTime = () =>{

    // Get the current date and time in UTC
    const currentDateTime = new Date();

    // Adjust for Sri Lanka Standard Time (UTC +5:30)
    const sriLankaOffset = 5.5 * 60 * 60 * 1000; // 5 hours and 30 minutes in milliseconds
    const sriLankaTime = new Date(currentDateTime.getTime() + sriLankaOffset);

    // Format the date to 'YYYY-MM-DD HH:MM:SS'
    const formattedDateTime = sriLankaTime.toISOString().slice(0, 19).replace('T', ' ');

    return formattedDateTime;
}

// Export the function 
module.exports = { getDateAndTime };