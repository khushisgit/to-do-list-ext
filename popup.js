document.addEventListener('DOMContentLoaded', function () {
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

  taskInput.focus();

  taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const task = taskInput.value.trim();
      if (task !== '') {
        addTask(task);
        taskInput.value = '';
      }
    }
  });

  function addTask(taskText) {
    const taskItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const taskLabel = document.createElement('label');
    taskLabel.textContent = taskText;
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskLabel);
    taskList.appendChild(taskItem);
    
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        setTimeout(function () {
          taskItem.remove();
          saveTasks();
        }, 2000);
        taskLabel.style.textDecoration = 'line-through';
      } else {
        taskLabel.style.textDecoration = 'none';
      }
    });

    saveTasks();
  }

  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(function (taskItem) {
      const taskText = taskItem.querySelector('label').textContent;
      const isChecked = taskItem.querySelector('input[type="checkbox"]').checked;
      tasks.push({ text: taskText, checked: isChecked });
    });
    chrome.storage.sync.set({ tasks: tasks });
  }

  function loadTasks() {
    chrome.storage.sync.get(['tasks'], function (result) {
      if (result.tasks) {
        result.tasks.forEach(function (task) {
          addTask(task.text);
          if (task.checked) {
            taskList.lastElementChild.querySelector('input[type="checkbox"]').checked = true;
            taskList.lastElementChild.querySelector('label').style.textDecoration = 'line-through';
          }
        });
      }
    });
  }

  loadTasks();
});
