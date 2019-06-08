const form = document.querySelector('.form-signup')
const name = document.querySelector('#name')
const email = document.querySelector('#email')
const emailFeedback = document.querySelector('#email~.invalid-feedback')
const password = document.querySelector('#password')
const passwordCheck = document.querySelector('#password-check')

const passwordCheckFeedback = document.querySelector(
  '#password-check~.invalid-feedback'
)
// let errorMessage = ''

form.addEventListener('submit', event => {
  event.preventDefault()
  // 如果驗證沒過，加上.was-validated
  if (form.checkValidity() === false) {
    form.classList.add('was-validated')
  } else {
    // 如果驗證有過，移除.was-validated
    form.classList.remove('was-validated')
    if (password.value !== passwordCheck.value) {
      passwordCheckFeedback.innerHTML = '兩次密碼輸入不同！'
      passwordCheck.classList.add('is-invalid')
      return
    }
    signUp()
  }
})

async function signUp() {
  try {
    let userData = new Object()
    userData.name = name.value
    userData.email = email.value
    userData.password = password.value

    const response = await axios('/signup', {
      method: 'POST',
      data: userData,
    })
    // email有註冊過
    if (response.data.msg) {
      email.classList.add('is-invalid')
      emailFeedback.innerHTML = response.data.msg

      return
    } else {
      window.location = '/signin'
    }
  } catch (error) {
    console.error(error)
  }
}

form.addEventListener('input', e => {
  if (e.target.matches('.is-invalid')) {
    e.target.classList.remove('is-invalid')
  }
})
