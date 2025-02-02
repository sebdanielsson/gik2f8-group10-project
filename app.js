import express from "express";
import fs from "fs/promises";
import { rateLimit } from "express-rate-limit";

const app = express();
const port = process.env.PORT || 80;
const notesJSON = "./notes.json";

// Rate limiter
var limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

app.use(limiter);

// Middleware
app.use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "*");

        next();
    });

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// Route / to ./index.html
app.use(express.static("build"));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/build/index.html`);
});

// Get all notes
app.get("/notes", async (req, res) => {
    try {
        const notes = await fs.readFile(notesJSON, "utf-8");
        res.send(JSON.parse(notes));
    } catch (err) {
        log("Exception occurred", err.stack);
        res.status(500).send("Internal Server Error");
    }
});

// Get single note
app.get("/notes/:id", async (req, res) => {
    try {
        const currentNotes = JSON.parse(await fs.readFile(notesJSON, "utf-8"));

        const note = currentNotes.find((note) => note.id == req.params.id);

        if (!note) {
            res.status(404).send("Note id " + req.params.id + " not found.");
        }

        res.send(note);
    } catch (err) {
        log("Exception occurred", err.stack);
        res.status(500).send("Internal Server Error");
    }
});

// Create note
app.post("/notes", async (req, res) => {
    try {
        const currentNotes = JSON.parse(await fs.readFile(notesJSON, "utf-8"));

        let newNoteId = 0;
        if (currentNotes && currentNotes.length > 0) {
            newNoteId = currentNotes.reduce((maxId, currentElement) => (currentElement.id > maxId ? currentElement.id : maxId), 0);
            newNoteId++;
        }

        const newNote = { id: newNoteId, ...req.body };
        const newList = currentNotes ? [...currentNotes, newNote] : [newNote];

        await fs.writeFile(notesJSON, JSON.stringify(newList));

        res.send(newNote);
    } catch (err) {
        log("Exception occurred", err.stack);
        res.status(500).send("Internal Server Error");
    }
});

// Update note
app.put("/notes/:id", async (req, res) => {
    try {
        const currentNotes = JSON.parse(await fs.readFile(notesJSON, "utf-8"));

        if (currentNotes.length == 0) {
            res.status(404).send("No notes found.");
        } else {
            const newList = currentNotes.map((note) => {
                if (note.id == req.params.id) {
                    return { ...note, ...req.body };
                }
                return note;
            });

            await fs.writeFile(notesJSON, JSON.stringify(newList));

            res.send(req.params.id);
        }
    } catch (err) {
        log("Exception occurred", err.stack);
        res.status(500).send("Internal Server Error");
    }
});

// Delete note
app.delete("/notes/:id", async (req, res) => {
    try {
        const currentNotes = JSON.parse(await fs.readFile(notesJSON, "utf-8"));
        if (currentNotes.length == 0) {
            res.status(404).send("No notes found.");
        } else {
            const newList = currentNotes.filter((note) => note.id != req.params.id);
            await fs.writeFile(notesJSON, JSON.stringify(newList));
            res.send("Note id " + req.params.id + " deleted.");
        }
    } catch (err) {
        log("Exception occurred", err.stack);
        res.status(500).send("Internal Server Error");
    }
});
