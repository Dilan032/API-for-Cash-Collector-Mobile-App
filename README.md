<h1 align="center"> API for cash Collector back-end </h1>

# End-points

<br>

> [!IMPORTANT]
> ## Always user should send `Bearer {Token}`

<br>

## login
- /login/pin 🙇‍♂️ `5 digit number`
- /login/UserName 🙇‍♂️ `UserName`  and `Password`

  <br>

## user
- /user/AccountDetails 🙇‍♂️ `get request`
- /user/updateUserPassword 🙇‍♂️ `currentPassword` and `newPassword`
- /user/all-details 🙇‍♂️ `get request`
- /user/search 🙇‍♂️ `Name` user should enter at least one letter

<br>

## forgotPassword
- /request/get-otp 🙇‍♂️ `email`
- /request/verify-otp 🙇‍♂️ `email` and `password_reset_otp`
- /request/reset-password 🙇‍♂️ `email` and `Password`

<br>

## customer
- /customer/all-details 🙇‍♂️ `get request`
- /customer/search 🙇‍♂️ `Name` user should enter at least one letter

## collectAmount
- /collectAmount/all 🙇‍♂️ `post request` user must enter `accountNumber` and user can enter any value in database (database column name) to update(store)
