const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");
const filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector("#clear-btn");
let editId;
let isEditedTask = false;

let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let task = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status === "completed" ? "checked" : "";
      if (todo.status == filter || filter == "all") {
        task += `<li class="task">
        <label for="${id}">
        <input  onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}/>
        <p class="${isCompleted}">${todo.name}</p>
        </label>
        <div class="settings">
        <span class="material-icons-sharp dots" onclick="showMenu(this)"> more_horiz </span>
        <ul class="task-menu">
          <li onclick='editTask(${id} ,"${todo.name}")'><span class="material-icons-sharp"> edit </span>Edit</li>
          <li onclick='deleteTask(${id} ,"${filter}")'><span class="material-icons-sharp"> delete </span> Delete</li>
        </ul>
        </div>
        </li>`;
      }
    });
  }
  taskBox.innerHTML = task || `<span>You don't have the any task here</span>`;
  taskBox.offsetHeight >= 300
    ? taskBox.classList.add("overflow")
    : taskBox.classList.remove("overflow");
}
showTodo("all");

function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;

  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "SPAN" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    //update the status to completed
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    //update the status to pending
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}
function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
  isEditedTask = false;
  //delete the selected task form todos array
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list ", JSON.stringify(todos));
  showTodo(filter);
}
clearAll.addEventListener("click", () => {
  isEditedTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list ", JSON.stringify(todos));
  showTodo("all");
});

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditedTask) {
      //if isEditedTask isn't true
      todos = !todos ? [] : todos;
     
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo); //add a new task to todos
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }
});
