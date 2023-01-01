"use strict";

// Check if user prefers dark mode
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

// Follow user's system theme preference if no website theme preference is set
prefersDarkMode.addEventListener("change", (event) => {
    if (!localStorage.getItem("theme")) {
        if (event.matches) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }
});

// Theme switcher
const themeSystem = document.getElementById("theme-system");
const themeLight = document.getElementById("theme-light");
const themeDark = document.getElementById("theme-dark");

themeSystem.addEventListener("click", () => {
    if (prefersDarkMode.matches) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
        localStorage.removeItem("theme");
    }
});

themeLight.addEventListener("click", () => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
});

themeDark.addEventListener("click", () => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
});

// Create new API instance
const api = new Api("https://gik2f8-group10-project.herokuapp.com/notes");

// Load notes on page load
window.addEventListener("load", () => {
    renderNotes();
});

// Validate fields
noteForm.titleField.addEventListener("input", (e) => validateForm(e.target));
noteForm.titleField.addEventListener("blur", (e) => validateForm(e.target));

let titleValid = false;
function validateForm(field) {
    if (field.value.length > 0) {
        if (titleWarning) {
            titleWarning.style.display = "none";
        }
        titleValid = true;
    } else {
        if (titleWarning) {
            titleWarning.style.display = "block";
        }
        titleValid = false;
    }
}

// Submit form
function addNoteButton() {
    if (titleValid) {
        const newNote = {
            title: noteForm.titleField.value,
            content: noteForm.contentField.value,
            editDate: new Date().toLocaleString(),
            pinned: false,
        };
        addNote(newNote);
    } else {
        console.log("Form is invalid");
    }
}

// Add note
function addNote(newNote) {
    api.create(newNote).then((note) => {
        if (note) {
            clearForm();
            renderNotes();
        }
    });
}

// Render notes
function renderNotes() {
    noteList.innerHTML = "";

    api.getAll().then((notes) => {
        try {
            if (notes && notes.length === 0) {
                noteList.innerHTML = `<li class="text-center py-3"><span class="text-2xl">No notes added.</span></li>`;
            } else if (notes && notes.length > 0) {
                // Sort notes by last edit
                notes.sort((a, b) => {
                    const dateA = new Date(a.editDate);
                    const dateB = new Date(b.editDate);
                    if (dateA < dateB) {
                        return -1;
                    }
                    if (dateA > dateB) {
                        return 1;
                    }
                    return 0;
                });

                // Sort notes by pinned
                const pinnedNotes = notes.filter((note) => note.pinned);
                const nonPinnedNotes = notes.filter((note) => !note.pinned);
                pinnedNotes.forEach((note) => {
                    noteList.insertAdjacentHTML("beforeend", renderNotesHTML(note));
                });
                nonPinnedNotes.forEach((note) => {
                    noteList.insertAdjacentHTML("beforeend", renderNotesHTML(note));
                });
            } else {
                noteList.innerHTML = `
                <li class="flex text-center py-3">
                <svg class="h-7 w-7 my-auto mr-2 dark:fill-white" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.7399 6.32717C24.3781 8.48282 24.2132 11.571 22.2453 13.5389L20.3007 15.4835C20.0078 15.7764 19.533 15.7764 19.2401 15.4835L12.5226 8.76595C12.2297 8.47306 12.2297 7.99818 12.5226 7.70529L14.4671 5.76075C16.4352 3.79268 19.5237 3.62792 21.6793 5.26646L24.7238 2.22166C25.0167 1.92875 25.4916 1.92873 25.7845 2.22161C26.0774 2.51449 26.0774 2.98936 25.7845 3.28227L22.7399 6.32717ZM19.7704 13.8925L21.1846 12.4783C22.7467 10.9162 22.7467 8.3835 21.1846 6.82141C19.6225 5.25931 17.0899 5.25931 15.5278 6.82141L14.1135 8.23562L19.7704 13.8925Z" />
                <path d="M12.7778 11.215C13.0707 11.5079 13.0707 11.9828 12.7778 12.2757L10.6514 14.402L13.5982 17.3489L15.7238 15.2234C16.0167 14.9305 16.4916 14.9305 16.7844 15.2234C17.0773 15.5163 17.0773 15.9912 16.7844 16.284L14.6589 18.4095L15.4858 19.2364C15.7787 19.5293 15.7787 20.0042 15.4858 20.2971L13.5412 22.2416C11.5732 24.2096 8.48484 24.3745 6.32918 22.7361L3.28475 25.7808C2.99187 26.0737 2.517 26.0737 2.22409 25.7808C1.93118 25.488 1.93116 25.0131 2.22404 24.7202L5.26853 21.6754C3.63025 19.5197 3.79509 16.4314 5.76306 14.4635L7.7076 12.5189C8.0005 12.226 8.47537 12.226 8.76826 12.5189L9.59072 13.3414L11.7172 11.215C12.0101 10.9221 12.485 10.9221 12.7778 11.215ZM6.83028 21.1875C8.3929 22.7431 10.9207 22.7409 12.4806 21.181L13.8948 19.7668L8.23793 14.1099L6.82372 15.5241C5.26383 17.084 5.26163 19.6117 6.81709 21.1743L6.82366 21.1808L6.83028 21.1875Z" />
                </svg>
                <span class="text-2xl text-gray-500">
                Error: Could not connect to the server.
                </span>
                </li>`;
            }
        } catch (error) {
            console.log("error", error);
        }
    });
}

function renderNotesHTML({ id, title, content, editDate, pinned }) {
    let html = `
    <li onclick="previewNoteHTML(${id})" class="cursor-pointer flex flex-col p-4 rounded-xl bg-[#F2EDEC]/50 dark:bg-[#2D221D]/50 backdrop-blur-lg backdrop-saturate-[0.85] text-slate-900 dark:text-slate-50">
    <div class="flex flex-row">
    <h6 class="text-lg font-semibold inline truncate text-slate-800 dark:text-slate-300">${title}</h6>
    <div class="ml-auto">
    <button onclick="event.stopPropagation();updateCompletion(${id})">
    `;
    !pinned &&
        (html += `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`);
    pinned &&
        (html += `<svg xmlns="http://www.w3.org/2000/svg" fill="#eab308" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`);
    html += `
    </button>
    <button onclick="event.stopPropagation();if (confirm('Are you sure you want to delete this note?')) { deleteNote(${id}); }">
    <svg xmlns="http://www.w3.org/2000/svg" fill="#f87171" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
    </button>
    </div>
    </div>
    <span class="noteDate text-sm">${editDate}</span>
    <p class="text-base w-full overflow-hidden whitespace-nowrap text-ellipsis">${content}</p>
    </li>
    `;
    return html;
}

// Preview note
function previewNoteHTML(id) {
    api.get(id).then((note) => {
        if (note) {
            noteEditor.classList.add("hidden");
            noteEditor.classList.remove("flex");
            notePreview.classList.remove("hidden");
            let html = `
            <div class="flex flex-row">
                <h3 class="font-['Wendy_One'] text-4xl font-semibold inline truncate text-slate-800 dark:text-slate-300">${note.title}</h6>
                <div class="ml-auto">
                <button onclick="event.stopPropagation();updateCompletion(${id})">
            `;
            !note.pinned &&
                (html += `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
            `);
            note.pinned &&
                (html += `<svg xmlns="http://www.w3.org/2000/svg" fill="#eab308" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>`);
            html += `
                </button>
                <button title="Edit note" onclick="event.stopPropagation();editNoteButton(${id})">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                </button>
                <button title="Delete note" onclick="event.stopPropagation();if (confirm('Are you sure you want to delete this note?')) { deleteNote(${id}); }">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#f87171" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                </button>
                </div>
                </div>
                <span class="noteDate text-sm">Last edit: ${note.editDate}</span>
                <p class="text-base break-all">${note.content}</p>
            `;
            notePreview.innerHTML = html;
        }
    });
}

// Add event listener to edit button
function editNoteButton(id) {
    api.get(id).then((note) => {
        if (note) {
            // Show update button and cancel button, hide add button
            notePreview.classList.add("hidden");
            noteEditor.classList.remove("hidden");
            noteEditor.classList.add("flex");
            noteForm.updateButton.classList.remove("hidden");
            noteForm.cancelUpdateButton.classList.remove("hidden");
            noteForm.addButton.classList.add("hidden");

            // Fill form with note data
            noteForm.titleField.value = note.title;
            noteForm.contentField.value = note.content;

            // Add event listener to update button
            noteForm.updateButton.onclick = (event) => {
                const updatedNote = {
                    title: noteForm.titleField.value,
                    content: noteForm.contentField.value,
                    editDate: new Date().toLocaleString(),
                };

                // Note updated successfully
                api.update(id, updatedNote).then((note) => {
                    previewNoteHTML(id);
                    renderNotes();
                });
            };
        }
    });
}

function cancelUpdate() {
    clearForm();
    noteEditor.classList.add("hidden");
}

// Update completion
function updateCompletion(id) {
    api.get(id).then((note) => {
        if (note) {
            const updatedNote = {
                pinned: !note.pinned,
            };
            api.update(id, updatedNote).then((note) => {
                renderNotes();
                previewNoteHTML(id);
            });
        }
    });
}

// Delete note
function deleteNote(id) {
    api.remove(id).then((response) => {
        if (response.status === 404) {
            console.log("Error deleting note.");
        } else {
            console.log(response);
            renderNotes();
        }
    });
}

// Clear form
function clearForm() {
    noteForm.titleField.value = "";
    noteForm.contentField.value = "";
}
