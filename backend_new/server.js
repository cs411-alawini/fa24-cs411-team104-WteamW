const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'WteamW2024', // 如果您的MySQL没有密码，就留空
  database: 'education',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const validate = async(userId, password) => {
  const query = 'SELECT UserID FROM User WHERE UserID = ? AND Password = ?'
  const [response] = await pool.query(query, [userId, password]);
  return response[0].UserID
}

// 添加测试连接代码
pool.query('SELECT 1')
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8080;
// Simple API route
app.get('/api/exercises', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;
        const [countResult] = await pool.query('SELECT COUNT(*) as total FROM Exercise');
        const total = countResult[0].total;
        
        // 带分页的查询
        const [exercises] = await pool.query(
            'SELECT * FROM Exercise LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return res.json({
            data: exercises,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch(err) {
        console.error('Database error:', err);
        res.status(500).json({ message: err.message });
    }
    
});

app.get('/api/exercises/searchExercises', async (req, res) => {
  try {
    const { category, difficulty, keyword, page, limit} = req.query;
    // const page = parseInt(rpage) || 1;
    // const limit = parseInt(rlimit) || 6;
    // console.log(page)
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let query = 'SELECT * FROM Exercise WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM Exercise WHERE 1=1';
    const params = [];
    const countParams = [];

    if (category) {
      query += ' AND Category = ?';
      countQuery += ' AND Category = ?';
      params.push(category);
      countParams.push(category);
    }
    if (difficulty) {
      query += ' AND DifficultyLevel = ?';
      countQuery += ' AND DifficultyLevel = ?';
      params.push(difficulty);
      countParams.push(difficulty);
    }
    if (keyword) {
      query += ' AND (QuestionContent LIKE ? OR Category LIKE ?)';
      countQuery += ' AND (QuestionContent LIKE ? OR Category LIKE ?)';
      params.push(`%${keyword}%`, `%s${keyword}%`);
      countParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 添加分页
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    // 执行查询
    const [exercises] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    return res.json({
      data: exercises,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

app.get('/api/exercises/explore-history/list', async (req, res) => {
  try {
    const {page, limit, userId, password} = req.query
    const id = await validate(userId, password)
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const query = 'SELECT ExerciseID, ExerciseType, DifficultyLevel, Category, QuestionContent, AnswerContent, ConceptID, ExploreTime FROM ExploreHistory NATURAL JOIN Exercise WHERE UserID = ? ORDER BY ExploreTime DESC LIMIT ? OFFSET ?'
    const [exercises] = await pool.query(query, [id, parseInt(limit), offset])

    const countQuery = 'SELECT COUNT(*) AS total FROM ExploreHistory WHERE UserID = ?'
    const [countResult] = await pool.query(countQuery, [id])
    const total = countResult[0].total;

    return res.json({data: exercises, totalPages: Math.ceil(total / parseInt(limit))})
  } catch(error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
})

app.post('/api/exercises/add-explore-history', async(req, res) => {
  try {
    const {userId, password, exerciseId, searchContent} = req.body.params
    const id = await validate(userId, password)

    const query = 'INSERT INTO ExploreHistory(HistoryID, UserID, ExerciseID, ExploreTime, SearchContent) VALUES (0, ?, ?, NOW(), ?)'
    await pool.query(query, [id, exerciseId, searchContent])
  } catch(error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
  

})

app.get('/api/users/findMostActiveUsers', async(req, res) => {
  try {
    const query = "CALL FindMostActiveUsers"
    const [users] = await pool.query(query)
    return res.json({
      data: users
    })
  } catch(error) {
    return res.status(500).json({ message: error.message });
  }
  
})

app.get('/api/users/signup', async(req, res) => {
  try {
    const {name, email, password, userType} = req.query;
    const query = `INSERT INTO User(UserID, Username, Email, UserType, NotesCount, StarsCount, Password) VALUES (0, ?, ?, ?, 0, 0, ?)`
    const params = [name, email, userType, password];
    await pool.query(query, params);
    
    const query_id = "SELECT UserID FROM User WHERE Username = ? AND Email = ?"
    const params_id = [name, email]
    const [id] = await pool.query(query_id, params_id)
    return res.json({
      data: id
    })
  } catch(error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
  
})

app.get('/api/users/login', async(req, res) => {
  try {
    const {email, password} = req.query
    const query = "SELECT UserID FROM User WHERE Email = ? AND Password = ?"
    const [id] = await pool.query(query, [email, password])
    return res.json({
      data: id
    })
  } catch(error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
})

app.get('/api/concepts/analyzeMathConcepts', async(req, res) => {
  const query = "CALL AnalyzeMathConcepts"
  const [concepts] = await pool.query(query)
  return res.json({
    data: concepts
  })
})

app.get('/api/notes/get-notes', async(req, res) => {
  try {
    const {userId, password, exerciseId} = req.query
    const id = await validate(userId, password);
    const query = 'SELECT NoteContent FROM Note WHERE UserID = ? AND ExerciseID = ?'
    const [NoteContent] = await pool.query(query, [id, exerciseId])
    return res.json({
      data: NoteContent
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
})

app.post('/api/notes/save-notes', async(req, res) => {
  try {
    const {userId, password, exerciseId, noteContent} = req.body.params
    const id = await validate(userId, password)

    if (!id) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Check if validation fails
    }
    const query = 'CALL InsertNote(?, ?, ?)'

    await pool.query(query, [id, exerciseId, noteContent])
    return res.status(200).json({ message: 'Note saved successfully' });
  } catch(error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
})

app.post('/api/notes/save-answers', async(req, res) => {
  try {
    const {userId, password, exerciseId, answerContent} = req.body.params
    const id = await validate(userId, password)

    if (!id) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Check if validation fails
    }
    const query = 'CALL InsertRecord(?, ?, ?)'

    const [score] = await pool.query(query, [id, exerciseId, answerContent])
    return res.status(200).json({ message: 'Note saved successfully', data: score });
  } catch(error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});