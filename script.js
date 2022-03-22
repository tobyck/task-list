var ul = document.querySelector("ul"),
    overlay = document.getElementById("overlay"),
    messageBox = document.getElementById("messageBox"),
    messageText = document.getElementById("messageText"),
    importanceLevels = [
        "rgb(0, 0, 0)",
        "rgb(156, 224, 47)",
        "rgb(255, 208, 0)",
        "rgb(240, 81, 53)"
    ];

// restore tasks from local storage
if (localStorage.getItem("tasks")) {
    ul.innerHTML = localStorage.getItem("tasks");
    updateEventListeners();
} else {
    localStorage.setItem("tasks", "");
}

// restore width from local storage
if (localStorage.getItem("width")) {
    document.querySelector(":root").style.setProperty("--width", localStorage.getItem("width"));
} else {
    localStorage.setItem("width", "450px");
}

// show instruction message
if (!localStorage.getItem("visited")) {
    openMessage(`Welcome to your new task list!

    Read the following instructions carefully:
    To add a task, type it in the box at the top and press enter. To delete a task, hover over it with your mouse and press backspace. To move a task up or down the list, you can drag and drop it to where you want it to be. Click on a task to mark or unmark it as done, and right click on a task to change its priority level (none, green, yellow, or red). To change the width of the display, command/control + [+] to increase, command/control + [-] to decrease, or command/control + [0] to reset to the default width.`);
    localStorage.setItem("visited", true);
} else {
    if (!sessionStorage.getItem("visited")) {
        openMessage(`Welcome back!

        Here's a quick reminder of how to use this task list:
        Add a task by typing it into the box and pressing enter. You can delete a task by hovering over it and pressing backspace. Drag and drop task to move them up and down the list. Click a task to mark/unmark it as done, and right click to change its priority level. Use command/control + [+], [-], or [0] to change the width of the display.`);
        sessionStorage.setItem("visited", true);
    }
}

// get next element after mouse y position (for drag and drop)
function getNextElement(y) {
    var next = [...document.querySelectorAll("li")].map(element => {
        var rect = element.getBoundingClientRect();
        return {
            element: element,
            top: rect.top
        }
    }).reduce((a, b) => Math.abs(b.top - y) < Math.abs(a.top - y) ? b : a).element;
    next == null ? next = ul.firstElementChild : next;
    return next;
}

// update event listeners (for after a new task is added)
function updateEventListeners() {
    document.querySelectorAll("li").forEach(draggable => {
        draggable.draggable = true;
        draggable.ondrag = event => draggable.classList.add("dragging");

        draggable.ondragstart = event => {
            document.onclick = null;
            ul.appendChild(document.createElement("li"))
        };

        draggable.ondragend = event => {
            draggable.classList.remove("dragging");
            ul.removeChild(ul.lastElementChild);
            setTimeout(() => document.onclick = toggleDone, 5);
            localStorage.setItem("tasks", ul.innerHTML);
            document.querySelectorAll("li").forEach(draggable => draggable.style.backgroundColor = "");
        };

        draggable.ondragover = event => {
            event.preventDefault();
            draggable.style.backgroundColor = "white";
            var next = getNextElement(event.clientY);
            var dragging = document.querySelector('.dragging');
            if (dragging !== null) {
                if (next === null) {
                    ul.appendChild(dragging);
                } else {
                    ul.insertBefore(dragging, next);
                }
            }
        };
    });
}

// open a custom dialog box
function openMessage(message) {
    messageText.innerText = message;
    overlay.style.display = "block";
    messageBox.style.display = "block";
}

// close custom dialog box
function closeMessage() {
    overlay.style.display = "none";
    messageBox.style.display = "none";
    messageText.innerText = "";
}

// add task
function addTask(event) {
    if (event.keyCode === 13) {
        var input = document.querySelector("input");
        if (input.value != "") {
            var task = document.createElement("li");
            task.innerText = input.value;
            task.style.color = importanceLevels[0];
            ul.appendChild(task);
            input.value = "";
        } updateEventListeners();
        localStorage.setItem("tasks", ul.innerHTML);
    }
};

// delete task
function deleteTask(event) {
    if (event.keyCode == 8) {
        for (var element of [...ul.children]){
            if (element.matches(":hover") && element.tagName === "LI") {
                element.remove();
                break;
            }
        } localStorage.setItem("tasks", ul.innerHTML);
    }
}

// toggle strike through
function toggleDone(event) {
    if (event.target.tagName === "LI") {
        event.target.classList.toggle("strike");
        document.querySelectorAll("li").forEach(task => task.id = task.classList.contains("strike") ? 1 : 0);
        ul.innerHTML = [...ul.children].sort((a, b) => a.id - b.id).map(task => task.outerHTML).join("\n");

        localStorage.setItem("tasks", ul.innerHTML);
        updateEventListeners();
    }
}

// change the importance/prioty of a task
function changePriority(event) {
    if (event.target.tagName === "LI") {
        if (!event.target.classList.contains("strike")) {
            event.target.style.color = importanceLevels[(importanceLevels.indexOf(event.target.style.color) + 1) % importanceLevels.length];
            localStorage.setItem("tasks", ul.innerHTML);
        } event.preventDefault();
    }
}

// change width with cmd+ and cmd-
document.addEventListener("keydown", event => {
    if (event.metaKey) {
        if (event.keyCode == 173) {
            var newWidth = parseInt(document.querySelector(":root").style.getPropertyValue("--width").slice(0, -2)) - 25;
            if (newWidth >= 350) {
                document.querySelector(":root").style.setProperty("--width", newWidth + "px");
                localStorage.setItem("width", newWidth + "px");
            } event.preventDefault();
        } else if (event.keyCode == 61) {
            var newWidth = parseInt(document.querySelector(":root").style.getPropertyValue("--width").slice(0, -2)) + 25;
            if (newWidth <= window.innerWidth - 150) {
                document.querySelector(":root").style.setProperty("--width", newWidth + "px");
                localStorage.setItem("width", newWidth + "px");
            } event.preventDefault();
        } else if (event.keyCode == 48) {
            document.querySelector(":root").style.setProperty("--width", "450px");
            localStorage.setItem("width", "450px");
            event.preventDefault();
        }
    }
});

// event listeners
document.onkeydown = addTask;
document.onkeyup = deleteTask;
document.onclick = toggleDone;
document.oncontextmenu = changePriority;
