// Add task on button click or Enter key
document.getElementById("add-btn").addEventListener("click", addTask);
document.getElementById("task-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const input = document.getElementById("task-input");
  const taskText = input.value.trim();
  if (!taskText) return;

  const task = createTaskElement(taskText);
  task.style.background = "#99ddee"; // default inbox color

  document.getElementById("inbox").appendChild(task);
  input.value = "";

  saveTasksToStorage();
}

function createTaskElement(text) {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;

  const span = document.createElement("span");
  span.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.addEventListener("click", () => {
    task.remove();
    saveTasksToStorage();
  });

  task.appendChild(span);
  task.appendChild(deleteBtn);

  task.addEventListener("dragstart", () => {
    task.classList.add("dragging");
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
    setTaskColor(task);
    saveTasksToStorage();
  });

  return task;
}

// Drag and drop handlers
function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  if (!dragging) return;

  const target = e.currentTarget;
  target.appendChild(dragging);

  setTaskColor(dragging);
  saveTasksToStorage();
}

function setTaskColor(task) {
  const parentId = task.parentElement.id;

  switch (parentId) {
    case "high":
      task.style.background = "#f08484"; // light red
      break;
    case "medium":
      task.style.background = "#fff9c4"; // light yellow
      break;
    case "low":
      task.style.background = "#c8e6c9"; // light green
      break;
    default:
      task.style.background = "#99ddee"; // inbox default
  }
}

// Save tasks to localStorage
function saveTasksToStorage() {
  const columns = ["inbox", "high", "medium", "low"];
  const tasks = [];

  columns.forEach((col) => {
    const column = document.getElementById(col);
    const colTasks = column.querySelectorAll(".task");
    colTasks.forEach((task) => {
      tasks.push({
        text: task.querySelector("span").textContent,
        column: col,
      });
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load from localStorage on page load
function loadTasksFromStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach(({ text, column }) => {
    const task = createTaskElement(text);

    // Set background based on column from localStorage
    switch (column) {
      case "high":
        task.style.background = "#ffcdd2"; // Light red
        break;
      case "medium":
        task.style.background = "#fff9c4"; // Light yellow
        break;
      case "low":
        task.style.background = "#c8e6c9"; // Light green
        break;
      default:
        task.style.background = "#99ddee"; // Inbox default color
    }

    document.getElementById(column).appendChild(task);
  });
}

// Clear all tasks on button click
document.getElementById("clear-btn").addEventListener("click", () => {
  const columns = ["inbox", "high", "medium", "low"];
  columns.forEach((col) => {
    const column = document.getElementById(col);
    const tasks = column.querySelectorAll(".task");
    tasks.forEach(task => task.remove()); // ✅ Only removes tasks
  }); 
  localStorage.removeItem("tasks");
});

// Initialize
loadTasksFromStorage();
