import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

// Current module's file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// File upload directory
const uploadDir = path.join(__dirname, "images");
fs.mkdirSync(uploadDir, { recursive: true });

// Serve uploaded images statically
app.use("/images", express.static(uploadDir));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// MySQL connection pool
const pool = mysql.createPool({
    host: "database-1.cdwqyssi0je0.ap-northeast-2.rds.amazonaws.com",
    user: "user_ex",
    password: "1234",
    port: "3306",
    database: "db_ex",
    connectionLimit: 10,
    dateStrings: true
});

// Query function using connection pool
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

// Existing Authentication Endpoints
app.post("/api/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ ok: false, msg: "모든 값을 입력하세요" });
        }
        const exists = await query("select id from member where email=?", [email]);
        if (exists.length > 0) {
            return res.status(409).json({ ok: false, msg: "이미 가입한 이메일입니다." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await query("insert into member(email,password,name) values(?,?,?)", [email, hashedPassword, name]);
        return res.json({
            ok: true,
            user: { id: result.insertId, email, name }
        });
    } catch (e) {
        return res.status(500).json({ ok: false, msg: "서버오류" });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ ok: false, msg: "이메일과 비밀번호를 입력하세요" });
        }
        const rows = await query("select id, email, name, password from member where email=?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ ok: false, msg: "존재하지 않는 이메일입니다." });
        }
        const match = await bcrypt.compare(password, rows[0].password);
        if (!match) {
            return res.status(401).json({ ok: false, msg: "이메일 또는 비밀번호가 올바르지 않습니다." });
        }
        return res.json({
            ok: true,
            msg: "로그인 성공",
            user: { id: rows[0].id, email: rows[0].email, name: rows[0].name }
        });
    } catch (e) {
        res.status(500).json({ ok: false, msg: "서버 오류" });
    }
});

// New Tab Navigation Endpoints
app.get("/api/home", async (req, res) => {
    try {
        res.json({
            title: "Discover Your Next Adventure",
            content: "Welcome to Travel Vista! Start exploring the world’s most exciting destinations with us."
        });
    } catch (e) {
        res.status(500).json({ ok: false, msg: "서버 오류" });
    }
});

app.get("/api/destinations", async (req, res) => {
    try {
        const destinations = await query("select id, title, description, image, modalTitle, modalDescription from destinations");
        res.json({
            title: "Destinations",
            destinations: destinations
        });
    } catch (e) {
        res.status(500).json({ ok: false, msg: "서버 오류" });
    }
});

app.get("/api/destinations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await query("select id, title, description, image, modalTitle, modalDescription from destinations where id=?", [id]);
        if (destination.length === 0) {
            return res.status(404).json({ ok: false, msg: "Destination not found" });
        }
        res.json(destination[0]);
    } catch (e) {
        res.status(500).json({ ok: false, msg: "서버 오류" });
    }
});

app.get("/api/about", async (req, res) => {
    try {
        res.json({
            title: "About Us",
            content: "Travel Vista is your guide to unforgettable adventures, offering inspiration and tips for exploring the world’s most beautiful destinations."
        });
    } catch (e) {
        res.status(500).json({ ok: false, msg: "서버 오류" });
    }
});

app.get("/api/contact", async (req, res) => {
    try {
        res.json({
            title: "Contact Us",
            content: "Get in touch at info@travelvista.com for travel inquiries or collaborations."
        });
    } catch (e) {
        res.status(500).json({ ok: false, msg: "서버 오류" });
    }
});

// Existing Board and Comment Endpoints
app.delete("/comments/:commentId", (req, res) => {
    const { commentId } = req.params;
    const { pass } = req.body;
    if (!pass) res.status(400).json({ message: "pass는 필수입니다." });
    const selectSql = "select pass from comment_table where id=?";
    db.query(selectSql, [commentId], (err, rows) => {
        if (err) return res.status(500).json({ message: "DB 오류", err });
        if (rows.length === 0) return res.status(404).json({ message: "존재하지 않는 댓글" });
        if (rows[0].pass !== pass) {
            res.status(403).json({ message: "비밀번호가 일치 하지 않습니다." });
        }
        const deleteSql = "delete from comment_table where id=?";
        db.query(deleteSql, [commentId], (err, result) => {
            if (err) return res.status(500).json({ message: "DB 오류" });
            return res.status(200).json({ message: "댓글 삭제 완료" });
        });
    });
});

app.get("/board/:id/comments", (req, res) => {
    const { id } = req.params;
    const sql = `select id,board_id,writer,contents, createdAt from comment_table where board_id=? order by id desc`;
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "DB 오류", err });
        res.json(result);
    });
});

app.post("/board/:id/comments", (req, res) => {
    const { id } = req.params;
    const { writer, pass, contents } = req.body;
    const sql = `insert into comment_table(board_id,writer,pass,contents) values(?,?,?,?)`;
    db.query(sql, [id, writer, pass, contents], (err, result) => {
        if (err) return res.status(500).json({ message: "DB 오류", err });
        res.status(200).json({ id: result.insertId });
    });
});

app.delete("/board/:id", async (req, res) => {
    const { id } = req.params;
    const sql = "delete from board_table where id=?";
    await db.query(sql, [id], (err, results, fields) => {
        res.status(200).send("삭제완료");
    });
});

app.put("/board/update/:id", async (req, res) => {
    const { id, boardTitle, boardContents } = req.body.board;
    const sql = `update board_table set boardTitle=?,boardContents=? where id=?`;
    await db.query(sql, [boardTitle, boardContents, id], (err, results, fields) => {
        res.status(200).send("수정완료");
    });
});

app.get("/board/list", (req, res) => {
    const sql = "select * from board_table";
    db.query(sql, (err, results, fields) => {
        res.json(results);
    });
});

app.get("/board/:id", async (req, res) => {
    const { id } = req.params;
    const hitSql = "update board_table set boardHits = boardHits + 1 where id=?";
    await db.query(hitSql, [id], (err, rows, fields) => {});
    const sql = "select * from board_table where id=?";
    await db.query(sql, [id], (err, results, fields) => {
        res.json(results);
    });
});

app.post("/board/save", upload.single("image"), (req, res) => {
    const { boardTitle, boardWriter, boardPass, boardContents } = req.body;
    const file = req.file;
    const fname = file ? `/images/${file.filename}` : null;
    const sql = "insert into board_table(boardTitle,boardWriter,boardPass,boardContents,fname) values(?,?,?,?,?)";
    db.query(sql, [boardTitle, boardWriter, boardPass, boardContents, fname], (err, results, fields) => {
        res.status(200).send("작성완료");
    });
});

// Start server
app.listen(8000, () => {
    console.log("서버 가동!");
});