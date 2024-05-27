import express from "express"
import bcrypt from "bcrypt"
import { initializeApp } from 'firebase/app'
import {getDoc, getFirestore, setDoc, collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore'
// configuracion para firebase

const firebaseConfig = {
    apiKey: "AIzaSyAKPw_CU6mBwkVqd9ZuA1DoSERjGQldXLs",
    authDomain: "e-commerce-935d4.firebaseapp.com",
    projectId: "e-commerce-935d4",
    storageBucket: "e-commerce-935d4.appspot.com",
    messagingSenderId: "537084206554",
    appId: "1:537084206554:web:e59b9847442fe9f0b734e3"
}

const firebase = initializeApp(firebaseConfig);
const db=getFirestore()
const app=express()

// Agregadas las dos lineas, faltantes.
app.use(express.static('src'))
app.use(express.json())

// Rutas
// Home Raiz
app.get('/',(req,res) => {
    res.sendFile('index.html',{root:'src'})
})
// Ruta para registro
app.get('/signup',(req,res) => {
    res.sendFile('signup.html',{root: 'src'})
})
app.post('/signup',(req,res) => {
    const { name, apeidos, email, password, number } = req.body
    console.log(req.body)
    // Validaciones
    if(name.length <3){
        res.json({ 'alert': 'name must be 3 letters long'})
    }else if (apeidos.length) {
        res.json({'alert': 'enter your lastname'})
    }else if (!email.length) {
        res.json({'alert': 'enter your email'})
    }else if (password.length < 8) {
        res.json({'alert': 'password must be 8 letters long'})
    }else if (!Number(number) || number.length < 10 ) {
        res.json({'alert': 'invalid number, please enter valid one'})
    }else {
        // Almacenar datos en BD
        const users = collection(db,"users")
        getDoc(doc(users,email)).then(user => {
            if(user.exists()){
            res.json({'alert': 'email already exists'})
            }else {
                //encriptar password
                bcrypt.genSalt(10,(err,salt)=> {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash
                        setDoc(doc(users, email), req.body).then(data =>{
                            res.json({
                                name: req.body.name,
                                email: req.body.email
                            })
                        })
                    })
                })
            }
        })
    }
})

// Ruta Log in

app.get('/login',(req,res) => {
    res.sendFile('login.html',{root: 'src'})
})
app.post('/login',(req,res) => {
    let { email, password } = req.body
    console.log('login', email,password)
    if ( !email.length || !password.length){
        return res.json({
            'alert': 'fill all the inputs'
        })
    }   
    const users = collection(db, 'users')
    getDoc(doc(users, email))
        .then( user => {
            if(!user.exists()) {
                return res.json({
                    'alert': 'fill all the inputs'
                })
            }else {
                bcrypt.compare(password,user.data().password,(err,result) => {
                    if (result) {
                        let data = user.data()
                        return res.json({
                            name: data.name,
                            email: data.email
                        })
                    } else {
                        return res.json({'alert': 'incorrect password'})
                }
            })
        }
    })
})

// Ruta Contacto

// Ruta Productos


app.get('/contacto',(req,res) => {
    res.sendFile('contacto.html',{root:'src'})
})


app.listen(8080,()=>{
    console.log('Servidor ejecutandose')
})