// Elementos DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const statusDiv = document.getElementById('status');

// Carregar tarefas do localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) span.style.textDecoration = 'line-through';
    span.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });
    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.classList.add('delete');
    delBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;
  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
  taskInput.value = '';
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Detectar online/offline e atualizar status
function updateOnlineStatus() {
  if (navigator.onLine) {
    statusDiv.innerHTML = '🟢 Online - sincronizado';
  } else {
    statusDiv.innerHTML = '🔴 Offline - funcionando normalmente';
  }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('SW registrado com sucesso', reg))
    .catch(err => console.error('Erro ao registrar SW', err));
}

renderTasks();