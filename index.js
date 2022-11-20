import express from "express"
import dotenv from "dotenv"
import db from "./config/db2.js"
import requestIP from "request-ip"
import { createHash } from "node:crypto"
import { v4 as uuidv4 } from "uuid"

dotenv.config()

var app = express()

import cors from "cors"
import { empty, sha256 } from "./helper/function.js"
import moment from "moment"
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
const whitelist = [
  "http://localhost:3000",
  "https://indodax-sinyal-app.herokuapp.com/",
]

/**
 * Gunakan CORS agar tidak error "Allow-Access-Control-Origin"
 */
app.use(cors()) // Use this after the variable declaration
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   // res.setHeader(
//   //   "Access-Control-Allow-Origin",
//   //   "https://webdokter.herokuapp.com"
//   // );
//   const origin = req.headers.origin
//   if (whitelist.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin)
//   }
//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   )

//   // Request headers you wish to allow
//   res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true)

//   // Pass to next layer of middleware
//   next()
// })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})

app.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body
    let hashPassword = sha256(password)
    let resLogin = await db.query(
      `SELECT * FROM user where username = '${username}' AND password = '${hashPassword}'`
    )

    if (!resLogin.length) {
      res.json({
        status: 0,
        message:
          "Data tidak ditemukan di database, silakan cek kembali data yang anda inputkan.",
        data: resLogin,
      })
      return
    }

    res.json({
      status: 1,
      message: "Berhasil Login Akun",
      data: resLogin[0],
    })
  } catch (e) {
    console.log(
      "Error saat Authentikasi Login",
      e.response?.data?.message ?? e.message,
      e.message
    )
    res.json({
      status: 0,
      data: [],
      errorMessage: e.response?.data?.message ?? e.message,
    })
  }
})

app.post("/register", async (req, res, next) => {
  try {
    const { nama, username, email, password } = req.body
    let hashPassword = sha256(password)
    let uuid = uuidv4()
    let resRegister = await db.query(
      `INSERT INTO user VALUES('', '${uuid}', '${nama}', '${username}', '${email}', '${hashPassword}')`
    )

    res.json({
      status: 1,
      message: "Berhasil Register Akun",
      data: resRegister,
    })
  } catch (e) {
    console.log(
      "Error saat Register",
      e.response?.data?.message ?? e.message,
      e.message
    )
    res.json({
      status: 0,
      data: [],
      errorMessage: e.response?.data?.message ?? e.message,
    })
  }
})
