<h1 align="center"> API for cash Collector back-end </h1>

# end-points

<br>

## login
- /login/pin  => input -> `5 digit number`
- /login/UserName => input -> `UserName`  and `Password`

## user
- /user/AccountDetails => no input -> `get request`
- /user/updateUserPassword => input -> `currentPassword` and `newPassword`

<br>

## forgotPassword
- /request/get-otp => input -> `email`
- /request/verify-otp => input -> `email` and `password_reset_otp`
- /request/reset-password => input -> `email` and `Password`

<br>

## customer
- /customer/all-details => no input -> `get request`
- /customer/search => input -> `Name` user should enter at least one letter
