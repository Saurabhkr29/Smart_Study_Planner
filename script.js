const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filterInput = document.getElementById("filterInput");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const todayList = document.getElementById("todayList");
const todayHours = document.getElementById("todayHours");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function renderTasks(filter = "") {
  taskList.innerHTML = "";

  
  tasks.sort((a,b) => new Date(a.deadline) - new Date(b.deadline));

  const filteredTasks = tasks.filter(task =>
    task.subject.toLowerCase().includes(filter.toLowerCase())
  );

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");

    li.innerHTML = `
      <div class="info">
        <span>${task.subject} - ${task.hours}h (Deadline: ${task.deadline})</span>
        <span class="priority ${task.priority}">${task.priority}</span>
      </div>
      <div>
        <button onclick="toggleTask(${index})">${task.completed ? "Undo" : "Done"}</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  updateProgress();
  renderTodayTasks();
}


function updateProgress() {
  if(tasks.length === 0) {
    progressFill.style.width = "0%";
    progressText.textContent = "0%";
    return;
  }
  const completed = tasks.filter(t => t.completed).length;
  const percent = Math.round((completed / tasks.length) * 100);
  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "%";
}


function renderTodayTasks() {
  todayList.innerHTML = "";
  const today = new Date().toISOString().split("T")[0];

  const todaysTasks = tasks.filter(t => t.deadline === today);

  if(todaysTasks.length === 0){
    todayList.innerHTML = "<li>No tasks for today!</li>";
    todayHours.textContent = "0";
    return;
  }

  let totalHours = 0;
  todaysTasks.forEach((task) => {
    totalHours += Number(task.hours);
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");
    li.innerHTML = `
      <div class="info">
        <span>${task.subject} - ${task.hours}h (Priority: ${task.priority})</span>
      </div>
      <div>
        <button onclick="toggleTask(${tasks.indexOf(task)})">${task.completed ? "Undo" : "Done"}</button>
      </div>
    `;
    todayList.appendChild(li);
  });

  todayHours.textContent = totalHours;
}


taskForm.addEventListener("submit", e => { // add task
  e.preventDefault();
  const subject = document.getElementById("subject").value;
  const deadline = document.getElementById("deadline").value;
  const hours = document.getElementById("hours").value;
  const priority = document.getElementById("priority").value;

  tasks.push({ subject, deadline, hours, priority, completed: false });
  saveTasks();
  renderTasks();
  taskForm.reset();
});


function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks(filterInput.value);
}


function deleteTask(index) { // Delete task
  tasks.splice(index,1);
  saveTasks();
  renderTasks(filterInput.value);
}

// Filter tasks
filterInput.addEventListener("input", e => {
  renderTasks(e.target.value);
});

renderTasks();
