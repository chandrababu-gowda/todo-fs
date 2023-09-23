function getTask() {
  fetch("http://localhost:3000")
    .then((res) => {
      return res.json();
    })
    .then((value) => {
      console.log(value);
    })
    .catch((err) => {
      console.log(err);
    });
}

getTask();
