import express from "express"
import bcrypt from "bcrypt"
import { initializeApp } from 'firebase/app'
import { getDoc, getFirestore, setDoc, collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore'
// configuracion para firebase

const firebaseConfig = {
    apiKey: "AIzaSyAKPw_CU6mBwkVqd9ZuA1DoSERjGQldXLs",
    authDomain: "e-commerce-935d4.firebaseapp.com",
    projectId: "e-commerce-935d4",
    storageBucket: "e-commerce-935d4.appspot.com",
    messagingSenderId: "537084206554",
    appId: "1:537084206554:web:e59b9847442fe9f0b734e3"
};

const firebase = initializeApp(firebaseConfig);
const db=getFirestore(firebase);
const app=express();

// Middleware
app.use(express.static('src'));
app.use(express.json());

// Rutas
// Home Raiz
app.get('/',(req,res) => {
    res.sendFile('index.html',{root:'src'})
})
// Ruta para registro
app.get('/signup',(req,res) => {
    res.sendFile('signup.html',{root: 'src'})
})
/*app.post('/signup', async (req,res) => {
    const { name, apeidos, email, password, number } = req.body
    console.log(req.body)
    // Validaciones
    if(name.length <3){
        res.json({ 'alert': 'name must be 3 letters long'})
    }else if (apeidos.length < 1) {
        res.json({'alert': 'enter your lastname'})
    }else if (!email.length) {
        res.json({'alert': 'enter your email'})
    }else if (password.length < 8) {
        res.json({'alert': 'password must be 8 letters long'})
    }else if (!Number(number) || number.length < 10 ) {
        res.json({'alert': 'invalid number, please enter valid one'})
    }else {
        // Almacenar datos en BD
        /*const users = collection(db,"users")
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
        })*/
        /*try {
            const users = collection(db, "users");
            const userDoc = await getDoc(doc(users, email));

            if (userDoc.exists()) {
                return res.json({ 'alert': 'email already exists' });
            } else {
                // Encriptar password
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);
                req.body.password = hash;
                await setDoc(doc(users, email), req.body);
                return res.json({
                    name: req.body.name,
                    email: req.body.email
                });
            }
        } catch (error) {
            console.error('Error signing up:', error);
            return res.json({ 'alert': 'Error signing up, please try again later.' });
        }
    }
})*/
app.post('/signup', async (req, res) => {
    const { name, apeidos, email, password, number } = req.body;
  
    if (name.length < 3) {
      return res.json({ 'alert': 'name must be 3 letters long' });
    } else if (apeidos.length < 1) {
      return res.json({ 'alert': 'enter your lastname' });
    } else if (!email.length) {
      return res.json({ 'alert': 'enter your email' });
    } else if (password.length < 8) {
      return res.json({ 'alert': 'password must be 8 letters long' });
    } else if (!Number(number) || number.length < 10) {
      return res.json({ 'alert': 'invalid number, please enter valid one' });
    } else {
      try {
        const users = collection(db, 'users');
        const userDoc = await getDoc(doc(users, email));
  
        if (userDoc.exists()) {
          return res.json({ 'alert': 'email already exists' });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          req.body.password = hash;
          await setDoc(doc(users, email), req.body);
          return res.json({
            name: req.body.name,
            email: req.body.email
          });
        }
      } catch (error) {
        console.error('Error signing up:', error);
        return res.json({ 'alert': 'Error signing up, please try again later.' });
      }
    }
  });
  

// Ruta Log in

app.get('/login',(req,res) => {
    res.sendFile('login.html',{root: 'src'})
})
app.post('/login', async (req,res) => {
    const { email, password } = req.body
    console.log('login', email,password)
    if ( !email.length || !password.length){
        return res.json({
            'alert': 'fill all the inputs'
        })
    }  
    try {
        const users = collection(db, 'users');
        const userDoc = await getDoc(doc(users, email));

        if (!userDoc.exists()) {
            return res.json({ 'alert': 'Email does not exist' });
        } else {
            const userData = userDoc.data();
            const match = await bcrypt.compare(password, userData.password);
            if (match) {
                return res.json({
                    name: userData.name,
                    email: userData.email
                });
            } else {
                return res.json({ 'alert': 'Incorrect password' });
            }
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return res.json({ 'alert': 'Error logging in, please try again later.' });
    } 
    /*
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
    })*/
})

// Ruta Productos


app.get('/productos',(req,res) => {
    res.sendFile('productos.html',{root:'src'})
})

// prueba
// Agregar productos al carrito
app.post('/cart', async (req, res) => {
    const { email, productId, quantity } = req.body;

    try {
        const cartCollection = collection(db, 'carts');
        const cartDoc = doc(cartCollection, email);
        const cartSnapshot = await getDoc(cartDoc);

        let cartData = cartSnapshot.exists() ? cartSnapshot.data() : { items: [] };

        const existingProductIndex = cartData.items.findIndex(item => item.productId === productId);

        if (existingProductIndex !== -1) {
            cartData.items[existingProductIndex].quantity += quantity;
        } else {
            cartData.items.push({ productId, quantity });
        }

        await setDoc(cartDoc, cartData);
        return res.json(cartData);
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.json({ 'alert': 'Error adding to cart, please try again later.' });
    }
});

// Obtener productos del carrito
app.get('/cart', async (req, res) => {
    const { email } = req.query;

    try {
        const cartDoc = doc(collection(db, 'carts'), email);
        const cartSnapshot = await getDoc(cartDoc);

        if (cartSnapshot.exists()) {
            return res.json(cartSnapshot.data());
        } else {
            return res.json({ items: [] });
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
        return res.json({ 'alert': 'Error fetching cart, please try again later.' });
    }
});


app.listen(8080,()=>{
    console.log('Servidor ejecutandose')
})