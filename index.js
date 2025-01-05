import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

mongoose.connect('mongodb+srv://messageboard1:messageboard123@salimdb.yttt3.mongodb.net/?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const messageSchema = new mongoose.Schema({
    threadTitle: String,
    messageBody: String,
    createdAt: { type: Date, default: Date.now }
});

const MessagePost = mongoose.model('MessagePost', messageSchema);

const app = express();
const port = 3000;
var editThreadTitle;
var editMessageBody;
var editMessageId;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    editThreadTitle = "";
    editMessageBody = "";
    editMessageId = "";

    try {
        const messageList = await MessagePost.find({});
        res.render("index.ejs", { messages: messageList });
    } catch (err) {
        console.error("Failed to retrieve messages:", err);
        res.status(500).send("Error retrieving messages");
    }
});

app.get("/post", (req, res) => {
    res.render("post.ejs", { title: editThreadTitle,
    message: editMessageBody });
});

app.get("/message", (req, res) => {
    res.render("message.ejs", { title: editThreadTitle,
    message: editMessageBody });
})

app.post("/submit", async (req, res) => {
    const newMessage = new MessagePost({
        threadTitle: req.body["title"],
        messageBody: req.body["message"]
    });

    try {
        await newMessage.save();
        res.redirect("/");
    } catch (err) {
        console.error("Failed to save message:", err);
        res.status(500).send("Error saving message");
    }
});

app.post("/resubmit", async (req, res) => {
    try {
        await MessagePost.findByIdAndUpdate(editMessageId, {
            threadTitle: req.body["title"],
            messageBody: req.body["message"]
        });
        res.redirect("/");
    } catch (err) {
        console.error("Failed to update message:", err);
        res.status(500).send("Error updating message");
    }
});

app.post("/delete/:id", async (req, res) => {
    try {
        await MessagePost.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        console.error("Failed to delete message:", err);
        res.status(500).send("Error deleting message");
    }
});

app.post("/edit/:id", async (req, res) => {
    try {
        const message = await MessagePost.findById(req.params.id);
        editMessageId = message._id;
        editThreadTitle = message.threadTitle;
        editMessageBody = message.messageBody;
        res.redirect("/post");
    } catch (err) {
        console.error("Failed to retrieve message for editing:", err);
        res.status(500).send("Error retrieving message for editing");
    }
});

app.post("/message/:id", async (req, res) => {
    try {
        const message = await MessagePost.findById(req.params.id);
        editThreadTitle = message.threadTitle;
        editMessageBody = message.messageBody;
        res.redirect("/message");
    } catch (err) {
        console.error("Failed to retrieve message for viewing:", err);
        res.status(500).send("Error retrieving message for viewing");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
