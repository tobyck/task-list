if (! sessionStorage.getItem("visited")) {
    sessionStorage.setItem("visited", true);
    if (! localStorage.getItem("visited")) {
        alert(`Welcome to your new task list!\n\nTo add a task to the list, enter the name of the task into the box at the top, and press enter. To check off a task, click on it, and to delete it completely, hover over it and press backspace. You can also change the urgency of a task my right clicking on it. The higher the urgency, the higher up the list a task will appear.\n\nIf you need to see the instructions again, press Shift+?`); localStorage.setItem("visited", true);
    } else {
        alert(`Welcome back!\n\nHere's a quick reminder of how to your task list.\nClick a task to check it off, or hover over it and press backspace to delete it completely. Change the urgency of a task by right clicking on it.\n\nIf you need to see the instructions again, press Shift+?`);
    }
}

var importanceLevels = {
    0: "#e63532",
    1: "#f2ce1b",
    2: "#7fe625",
    3: "#000000"
};

if (! localStorage.getItem("tasks")) {
    var tasks = {};
} else {
    var tasks = JSON.parse(localStorage.getItem("tasks"));  
    render();
}

$(document).bind("keydown", event => {
    if (event.keyCode === 13) {
        task = $("input").val();
        tasks[task] = {
            importance: 3,
            completed: false
        }; render();
        $("input").val("");
    }
});

function render() {
    $("ul").empty();
    for (var task of Object.keys(tasks)) {
        var li = document.createElement("li");
        li.innerHTML = task;
        li.style.color = importanceLevels[tasks[task].importance];
        li.id = tasks[task].importance;
        if (tasks[task].completed == true) {
            li.classList.add("strike");
            li.id = 4;
        } $("ul").append(li);
    } var elements = [...document.querySelector("ul").children].sort((x, y) => parseInt(x.id) - parseInt(y.id));
    $("ul").html(elements.map(x => x.outerHTML).join("\n"));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

$(document).bind("click contextmenu", event => {
    if (event.target.tagName == "LI") {
        var task = event.target.innerHTML;
        if (event.type == "click") {
            if (event.detail == 2) {
                delete tasks[task]
            } else {
                tasks[task].completed = tasks[task].completed == true ? false : true;
            }
        } else {
            if (tasks[task].completed == false) {
                tasks[task].importance = tasks[task].importance == 0 ? 3 : tasks[task].importance - 1;
            } event.preventDefault();
        } render();
    }
});

$(document).bind("keydown", event => {
    if (event.keyCode == 191 && event.shiftKey == true) {
        alert(`Intructions:\n\nTo add a task to the list, enter the name of the task into the box at the top, and press enter. To check off a task, click on it, and to delete it completely, hover over it and press backspace. You can also change the urgency of a task my right clicking on it. The higher the urgency, the higher up the list a task will appear.\n\nIf you need to see the instructions again, press Shift+?`);
    } else if (event.keyCode == 8) {
        for (var element of [...document.querySelector("ul").children]){
            if (element.matches(":hover")) {
                delete tasks[element.innerHTML];
                render();
                break;
            }
        }
    }
});
