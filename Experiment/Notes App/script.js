const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header img"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

let notes = [];

let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.body.style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.body.style.overflow = "auto";
});

function showNotes() {
    document.querySelectorAll(".note").forEach(li => li.remove());

    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');

        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <img onclick="showMenu(this)" src="icons/bars.svg" height="20px">
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, \`${note.title}\`, \`${filterDesc}\`)">
                                        Edit
                                    </li>
                                    <li onclick="deleteNote(${id})">
                                        Delete
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>`;

        addBox.insertAdjacentHTML("afterend", liTag);
    });
}

function showMenu(elem) {
    elem.parentElement.classList.add("show");

    document.addEventListener("click", e => {
        if(e.target.tagName != "IMG" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;

    notes.splice(noteId, 1);
    showNotes();
}

function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');

    updateId = noteId;
    isUpdate = true;

    addBox.click();
    titleTag.value = title;
    descTag.value = description;

    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", e => {
    e.preventDefault();

    let title = titleTag.value.trim(),
        description = descTag.value.trim();

    if(title || description) {

        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();

        let noteInfo = {
            title,
            description,
            date: `${month} ${day}, ${year}`
        };

        if(!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }

        showNotes();
        closeIcon.click();
    }
});