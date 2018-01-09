const provider = new firebase.auth.GoogleAuthProvider();
const loginButton = document.querySelector('.login-button')
loginButton.addEventListener('click', async e => {
  const result = await firebase.auth().signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken; // 토큰 값을 가지고 온다.
    // console.log(token)
    var user = result.user; // 구글 계정 정보.
    // console.log(user)

    const addButtonEl = document.querySelector('#add-button');
    const inputEl = document.querySelector('#todo-input')
    const listEl = document.querySelector('#todo-list')
    const item = document.querySelector('.item')
    loginButton.classList.add('login2') // 로그인 버튼 제거

    inputEl.addEventListener('keydown', async e => {
      if (e.key === 'Enter' && inputEl.value !== '') {
        add(); // 데이터베이스에 입력하는 함수.
        refreshTodos(); // 전체를 그려주는 함수, 비동기 작업.
      }
    })
    addButtonEl.addEventListener('click', async e => {
      if (inputEl.value !== '') {
        add();
        refreshTodos();
      }
    })

    async function add() {
      const uid = firebase.auth().currentUser.uid; // 로그인 계정의 UID
      listEl.classList.add('todo-list--loading') // 데이터 로딩 표시
      await firebase.database().ref(`/users/${uid}/todos`).push({ // push도 비동기여서 await를 사용하지 않으면 한참뒤에 실행된다.
        title: inputEl.value, // 그리고 밑에 그려주는 함수가 먼저 실행되서 push가 실행 됐는지 알 수 없다.
        complete: false
      })
    }

    async function refreshTodos() {
      listEl.classList.add('todo-list--loading')
      const uid = firebase.auth().currentUser.uid;
      const snapshot = await firebase.database().ref(`/users/${uid}/todos`).once('value'); // once 전부 불러오기.
      const todos = snapshot.val() || {}; // snapshot 데이터를 val()메소드로 검색.
      // console.log(todos);  // todos에 할일 객체가 들어있다.

      listEl.innerHTML = ''; // list 목록 지우기.

      // 화면 그리기.
      for (let [todoId, todo] of Object.entries(todos)) { // title과 complete 분해대입, 순환
        // console.log(todoId)
        // console.log(todo)
        const todoEl = document.createElement('div');
        todoEl.textContent = todo.title;
        todoEl.classList.add('item')
        listEl.appendChild(todoEl);
        inputEl.value = '';
        if (todo.complete) { // list를 처음부터 다시 그려주시 때문에 remove부분은 필요없다.
          todoEl.classList.add('complete')
        }

        // 선택
        todoEl.addEventListener('click', async e => {
          e.stopPropagation(); // 버블링을 막는 메소드.
          await firebase.database().ref(`users/${uid}/todos/${todoId}`).update({ complete: !todo.complete })
          refreshTodos()
        })

        // X 삭제 버튼 동적생성.
        const removeButtonEl = document.createElement('div');
        todoEl.appendChild(removeButtonEl);
        removeButtonEl.classList.add('removeButton')
        removeButtonEl.textContent = 'X'

        // ! 수정 버튼 동적 생성.
        const updateButtonEl = document.createElement('div');
        todoEl.appendChild(updateButtonEl);
        updateButtonEl.classList.add('updateButton')
        updateButtonEl.textContent = '!'

        // 수정
        updateButtonEl.addEventListener('click', async e => {
          e.stopPropagation();
          let updateTitle = prompt('수정할 Title을 입력하시오!!!');
          await firebase.database().ref(`users/${uid}/todos/${todoId}`).update({ title: updateTitle })
          refreshTodos()
        })

        // 삭제
        removeButtonEl.addEventListener('click', async e => {
          e.stopPropagation();
          await firebase.database().ref(`users/${uid}/todos/${todoId}`).remove()
          refreshTodos()
        })
      }
      listEl.classList.remove('todo-list--loading')
    }

    firebase.auth().onAuthStateChanged(function(user) { //onAuthStateChanged를 사용해서 사용자의 정보를 가지고 올 수 있다.
      if (user) {
        refreshTodos() // 화면그리기.
      }
    });

  })
})