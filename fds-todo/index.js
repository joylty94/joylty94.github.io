const addButtonEl = document.querySelector('#add-button');
const inputEl = document.querySelector('#todo-input')
const listEl = document.querySelector('#todo-list')
let cnt = 0;

inputEl.addEventListener('keydown', e => {
  if (e.keyCode === 13) {
    const itemEl = document.createElement('div');
    itemEl.textContent = inputEl.value;
    itemEl.classList.add('item')
    listEl.appendChild(itemEl);
    inputEl.value = '';
  }
})
addButtonEl.addEventListener('click', e => {
  // 추가
  const itemEl = document.createElement('div');
  cnt++
  if (cnt % 2 === 0) {
    itemEl.textContent = inputEl.value;
    itemEl.classList.add('item');
  } else {
    itemEl.textContent = inputEl.value;
    itemEl.classList.add('item2');
  }
  listEl.appendChild(itemEl);
  inputEl.value = '';

  // 선택
  itemEl.addEventListener('click', e => {
    if (itemEl.classList.contains('complete')) {
      itemEl.classList.remove('complete');
    } else {
      itemEl.classList.add('complete')
    }
  })
  const removeButtonEl = document.createElement('div');
  itemEl.appendChild(removeButtonEl);
  removeButtonEl.classList.add('removeButton')
  removeButtonEl.textContent = 'X'

  // 삭제
  removeButtonEl.addEventListener('click', e => {
    listEl.removeChild(itemEl)
  })
})