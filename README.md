<h1 align="center"> API for cash Collector back-end </h1>

## Node.js packages
| `body-parser` | `dotenv` | `express` | `jsonwebtoken` | `md5` | `nodemon` | `nodemailer` | `mysql` |
<hr>

## deployee API
- `npm init -y` <br>
- `npm i body-parser dotenv express jsonwebtoken md5 nodemon nodemailer mysql` <br>
- add .env file

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
- /user/updateUserPassword 🙇‍♂️ |`put request`| `currentPassword` and `newPassword`
- /user/updateDetails 🙇‍♂️ |`put request`| user can enter any value in database (database column name) to update (dynamic sql query)
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
- /customer/details/:RegId |`get request`| get one customer details `:RegId` is customer id
- /customer/all-details 🙇‍♂️ |`get request`|
- /customer/search 🙇‍♂️ |`post request`| `Name` user should enter at least one letter

<br>

## collectAmount
- /collectAmount/cashCollect 🙇‍♂️ |`post request`| user must enter `accountNumber` , `Bal` , `EmpCode` , `DailyTotal`
- /collectAmount/bankTransfer 🙇‍♂️ |`post request`| user must enter `accountNumber` , `Bal` , `EmpCode` , `DailyTotal`
- /collectAmount/bankCheque  🙇‍♂️ |`post request`| user must enter `accountNumber` , `Bal` , `EmpCode` , `DailyTotal` , `BankName` , `CheqNo` , `CheqDat`

- /collectAmount/dayCollection/:EmpCode 🙇‍♂️ |`get request` | user must send `EmpCode` in URL | show Today Collection
