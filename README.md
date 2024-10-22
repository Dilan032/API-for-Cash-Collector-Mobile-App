<h1 align="center"> API for cash Collector back-end </h1>

## Node.js packages
| `body-parser` | `dotenv` | `express` | `jsonwebtoken` | `md5` | `nodemon` | `nodemailer` | `mysql` |
<hr>

# End-points

<br>

> [!IMPORTANT]
> ## Always user should send `Bearer {Token}`

<br>

## login
- /login/pin 🙇‍♂️ |`post request`| `5 digit number`
- /login/UserName 🙇‍♂️ |`post request`| `UserName`  and `Password`

  <br>

## user
- /user/AccountDetails 🙇‍♂️ |`get request`|
- /user/updateUserPassword 🙇‍♂️ |`post request`| `currentPassword` and `newPassword`
- /user/updateDetails 🙇‍♂️ |`post request`| user can enter any value in database (database column name) to update(store) (dynamic sql query)
-
- /user/all-details 🙇‍♂️ |`get request`| (get all users deatils)
- /user/search 🙇‍♂️ |`post request`| `Name` user should enter at least one letter

<br>

## forgotPassword
- /request/get-otp 🙇‍♂️ |`post request`| `email`
- /request/verify-otp 🙇‍♂️ |`post request`| `email` and `password_reset_otp`
- /request/reset-password 🙇‍♂️ |`post request`| `email` and `Password`

<br>

## customer
- /customer/all-details 🙇‍♂️ |`get request`|
- /customer/search 🙇‍♂️ |`post request`| `Name` user should enter at least one letter

<br>

## collectAmount
- /collectAmount/all 🙇‍♂️ |`post request`| user must enter `accountNumber` and user can enter any value in database (database column name) to update (dynamic sql query)
