var btn = document.querySelector(".submitBtn");
var taskBox = document.querySelector(".taskMain");
btn.addEventListener("click", getTask);

function getTask() {
  setTimeout(() => {
    fetch("http://localhost:3000")
      .then((res) => {
        return res.json();
      })
      .then((value) => {
        console.log(value);
        displayTask(value);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 100);
}

function displayTask(taskArr) {
  let allTask = document.querySelectorAll(".task");
  allTask.forEach((task) => {
    task.remove();
  });

  taskArr.forEach((task) => {
    taskBox.insertAdjacentHTML("afterend", `<div class="task">${task}</div>`);
  });
}

getTask();
