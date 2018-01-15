const IMAGE_PER_PAGE = 1;

let nextKey;
let nextStackKey = [];

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth()
const storage = firebase.storage()
const database = firebase.database()
const loginButton = document.querySelector('.login-button')
const logoutButton = document.querySelector('.logout-button')
const fileInputEl = document.querySelector('.file-input');
const imgListEl = document.querySelector('.img-list');
const backButton = document.querySelector('.back-button');
const nextButton = document.querySelector('.next-button');

loginButton.addEventListener('click', async e => {
  const result = await firebase.auth().signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    console.log(user)
  })
  loginButton.classList.add('readable-hidden')
  looutButton.classList.remove('readable-hidden')
  fileInputEl.addEventListener('change', async e => {
    const uid = auth.currentUser.uid;
    console.log(fileInputEl.files[0])
    const refStr = `/img/${auth.currentUser.uid}:${new Date().getTime()}`;
    const snapshot = await storage.ref(refStr).put(fileInputEl.files[0]);

    database.ref(`/img`).push({
      downloadURL: snapshot.downloadURL,
      fileName: fileInputEl.files[0].name
    })
  })
  refreshImges()
  logoutButton.addEventListener('click', async e => {
    e.stopPropagation();
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    })
    loginButton.classList.remove('readable-hidden')
    logoutButton.classList.add('readable-hidden')
    refreshWeather();
  })
})

async function refreshImges() {
  const uid = auth.currentUser.uid
  const snapshot = await database
    .ref(`/img`)
    .orderByKey()
    .limitToFirst(IMAGE_PER_PAGE + 1)
    .startAt(nextStackKey[nextStackKey.length - 1] || '') // nextKey가 undefind이면 ''열이 실행된다.(startAt('')은 그냥 실행된다.)
    .once('value')
  const img = snapshot.val()
  const keys = Object.keys(img);
  nextKey = keys[keys.length - 1];

  imgListEl.innerHTML = '';

  const imageArr = Object.entries(img).slice(0, IMAGE_PER_PAGE)
  for (let [imgId, imgObj] of imageArr) {
    const imageEl = document.createElement('img');
    const fileNameEl = document.createElement('div')

    const splitName = imgObj.fileName.split('.');
    fileNameEl.textContent = splitName[0];

    imageEl.src = imgObj.downloadURL;

    imgListEl.appendChild(imageEl);
    imgListEl.appendChild(fileNameEl);
    imageEl.classList.add('img-list__item')
    fileNameEl.classList.add('img-list__fileName')
  }
}

nextButton.addEventListener('click', async e => {
  nextStackKey.push(nextKey)
  refreshImges()
})

backButton.addEventListener('click', async e => {
  nextStackKey.pop()
  refreshImges()
})

// 로그인 유지
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    refreshImges()
  }
});