const page = document.querySelector('.page')
const page2 = document.querySelector('.page2')
const front = document.querySelector('.front')
const back = document.querySelector('.back')
const fClick = document.querySelector('.front-click')
const bClick = document.querySelector('.back-click')
const home = document.querySelector('.front-padding2')
fClick.addEventListener('click', e => {
  page.classList.add('flipped')

  fClick.classList.add('readable-hidden')
})
bClick.addEventListener('click', e => {
  page.classList.remove('flipped')
  page.classList.add('active')
  fClick.classList.remove('readable-hidden')
})