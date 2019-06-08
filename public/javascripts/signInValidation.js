const form = document.querySelector('.form-signin')
// const email = document.querySelector('#email')
// const emailFeedback = document.querySelector('#email~.invalid-feedback')
// const password = document.querySelector('#password')

form.addEventListener('submit', event => {
  event.preventDefault()
  // 如果表單驗證沒過，加上.was-validated
  if (form.checkValidity() === false) {
    form.classList.add('was-validated')
  } else {
    // 如果表單驗證有過，移除.was-validated
    form.classList.remove('was-validated')
    form.submit()
  }
})

form.addEventListener('input', e => {
  if (e.target.matches('.is-invalid')) {
    e.target.classList.remove('is-invalid')
  }
})
