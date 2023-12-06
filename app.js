"use strict";

// 1. Додавати задачі +
// 2. Видаляти окремі задачі +
// 3. Видаляти всі задачі +
// 4. Фільтрувати задачі +
// 5. Зберігати в localStorage +
// 6. Показувати актуальні задачі +

// оголошуємо змінні з якими будемо працювати
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filterInput = document.querySelector(".filter-input");
const clearTasksButton = document.querySelector(".clear-tasks");
const taskList = document.querySelector(".collection");

// слухачі подій
// запускаємо функцію renderTasks коли весь HTML загружений
document.addEventListener("DOMContentLoaded", renderTasks);
// запускаємо функцію addTask коли відправляємо форму (клікаємо на кнопку "Додати завдання")
form.addEventListener("submit", addTask);
// запускаємо функцію editATask коли клік попадає на список <ul>
taskList.addEventListener("click", editTask);
// запускаємо функцію removeTask коли клік попадає на список <ul>
taskList.addEventListener("click", removeTask);
// запускаємо функцію після кліку на кнопку "Видалити всі елементи"
clearTasksButton.addEventListener("click", removeAllTasks);
// запускаємо функцію filterTasks після того як ввідпускаємо клавішу (тоді, коли фокус в інпуті "Пошук завдань")
filterInput.addEventListener("input", filterTasks);

function renderTasks() {
  // чистимо все що всередниі тегу ul (collection)
  taskList.innerHTML = "";

  // робимо перевірку чи localStorage є щось за ключем tasks
  if (localStorage.getItem("tasks")) {
    // якщо щось там є - витягуємо і присвоюємо змінній
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    // для кожної задачі яка є
    tasks.forEach((task) => { renderTask(task.taskValue, task.key) });
  }
}

// Функція для рендерінгу окремого завдання
function renderTask(value, key) {
  // створюємо елемент списку - <li></li>
  const li = document.createElement("li");
  li.classList.add('task')
  li.dataset.key = key;
  //створюємо кнопку для редагування
  const editButton = document.createElement("i");
  // додаємо їй клас
  editButton.classList.add("edit-btn", "fa-solid", "fa-pencil");
  // сторюємо кнопку для видалення
  const deleteButton = document.createElement("i");
  // додаємо їй клас
  deleteButton.classList.add("delete-btn", "fa-solid", "fa-xmark");
  //створюємо поле для відображення тексту завдання
  const div = document.createElement('div')
  div.classList.add('task-name');
  div.innerHTML = value;

  // всередині цього елементу списку додаємо опис завдання
  // li.innerHTML = div;
  // записуємо кнопку після всього, що є всередині елементу списку
  li.append(div, editButton, deleteButton);

  // записуємо цей елемент в кінець списку - ul (collection)
  taskList.append(li);
}

// створюємо таску
function addTask(event) {
  // зупиняємо поведінку браузера за замовчуванням
  event.preventDefault();

  // отримуємо значення з інпута через форму
  // const value = taskInput.value;
  // event.target.task ===  taskInput.value
  const value = event.target.task.value;

  // робимо перевірку на пустоту строки
  if (value.trim() === "") {
    return;
  }

  // Знаходимо наступний id для призначення новому елементу
  const maxID = taskList.children.length ? Math.max(...Array.from(taskList.children).map(a => a.dataset.key)) : 0;
  const counter = maxID + 1;

  // повторюємо всі дії з функції renderTasks
  renderTask(value, counter)

  // але тут ще записуємо задачу в локал сторедж
  storeTaskInLocalStorage(value, counter);
  // і чистимо інпут
  taskInput.value = "";
}

function storeTaskInLocalStorage(taskValue, key) {
  // і чистимо інпут
  let tasks = [];

  // перевіряємо чи є у localStorage вже якісь завдання
  if (localStorage.getItem("tasks")) {
    // якщо вони там є - витягуємо їх і присвоюємо змінній
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  // додаємо до списку нове завдання
  tasks.push({ taskValue, key });

  // зберігаємо список завданнь в Local Storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function editTask(event) {
  // отримуємо всі елементи з стореджа
  const tasks = JSON.parse(localStorage.getItem("tasks"));


  // якщо ми клікнули по оливцю - тоді
  if (event.target.classList.contains("edit-btn")) {
    // отримуємо вміст задачі (те що всередині li)
    const currentKey = event.target.parentElement.dataset.key;
    const editButton = event.target
    // створимо кнопку завершення редагування
    const completeEditButton = document.createElement('i');
    completeEditButton.classList.add('complete-edit-btn', 'fa-solid', 'fa-check')

    // створюємо інпут для відображення поточного значення та редагування
    const textInput = document.createElement('input');
    textInput.classList.add('task-input');
    // Запишемо в інпут поточне значення
    textInput.value = tasks.find(task => task.key == currentKey).taskValue;

    // event.target.parentElement.prepend(textInput)
    event.target.previousSibling.replaceWith(textInput);

    editButton.replaceWith(completeEditButton);
  }
  if (event.target.classList.contains("complete-edit-btn")) {
    // Знайдемо в масиві індекс задачі, яку редагуємо
    const currentKey = event.target.parentElement.dataset.key;
    const taskIndex = tasks.findIndex((task) => task.key == currentKey);

    // А також відшукаємо конкретний інпут
    const textInput = Array.from(event.target.parentElement.children).find(element => element.classList.contains('task-input'));
    // Замінимо вміст taskValue на той, що в інпуті
    tasks[taskIndex].taskValue = textInput.value;

    // зберігаємо в стореджі відфільтровані задачі
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // запускаємо функцію renderTasks
    renderTasks();
  }
}



// видалити якусь конкретну таску
function removeTask(event) {
  // якщо ми клікнули по хрестику - тоді
  if (event.target.classList.contains("delete-btn")) {
    // отримуємо всі елементи з стореджа
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    // отримуємо вміст задачі (те що всередині li)
    const currentKey = event.target.parentElement.dataset.key;

    // фільтруємо задачі
    const filteredTasks = tasks.filter((task) => {
      return task.key != currentKey;
    });

    // зберігаємо в стореджі відфільтровані задачі
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    // запускаємо функцію renderTasks
    renderTasks();
  }
}

// видаляємо всі таски
function removeAllTasks() {
  // видаляємо елементи з localStorage по ключу tasks
  localStorage.removeItem("tasks");
  // запускаємо функцію renderTasks
  renderTasks();
}

// фільтруємо задачі
function filterTasks(event) {
  // отримуємо результат з інпуту пошуку
  const searchQuery = event.target.value;
  // отримуємо всі задачі з dom дерева
  const liCollection = taskList.querySelectorAll("li");

  // перебираємо всі задачі
  liCollection.forEach((task) => {
    // отримуємо вміст задачі
    const liValue = task.firstChild.textContent;

    // якщо значення з інпута пошуку присутнє в задачі - додаємо dispaay: list-item
    if (liValue.includes(searchQuery)) {
      task.style.display = "flex";
    } else {
      // інакше - display: none
      task.style.display = "none";
    }
  });
}
