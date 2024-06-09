window.onload = () => {
    if (sessionStorage.user) {
        user = JSON.parse(sessionStorage.user)
        if (user.email) {
            location.replace('/')
        }
    }
}
let formBtn = document.querySelector('.submit-btn')
let loader = document.querySelector('.loader')
formBtn.addEventListener('click', () => {
    let name = document.querySelector('#name') || null
    let apeidos = document.querySelector('#apeidos') || null
    let email =  document.querySelector('#email') || null
    let password =  document.querySelector('#password') || null
    let number =  document.querySelector('#number') || null
    if (name !== null) {
        // Pagina de Registro
        if (name.length < 3) {
            showFormError('name must be 3 letters long')
        } else if (!apeidos.value.length < 8) {
            showFormError('must enter an lastname')
        } else if (!email.value.length) {
            showFormError('must enter an email')
        } else if (password.length < 8) {
            showFormError('password must be 8 letters long')
        } else if (Number(number) || number.value.length < 10) {
            showFormError('invalid number')
        } else {
            // Enviamos los datos al back
            loader.style.display = 'block'
            sendData('/signup', {
                name: name.value,
                lastname: apeidos.value,
                email: email.value,
                password: password.value,
                number: number.value,
            })
        }
    } else {
        if ( !email.value.length || !password.value.length) {
            showFormError('fill all inputs')
        } else {
            loader.style.display = 'block'
            sendData('/login', {
                email: email.value,
                password: password.value
            }) 
        }
    }
})
