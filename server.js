import express from "express";
import pool from "./db.js";
import cors from 'cors';
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";



const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());


// get all todos
app.get("/todos/:userEmail", async (req, res) => {
    const { userEmail } = req.params

  try {
    const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1',[userEmail]);
    res.json(todos.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// create a new todo
app.post('/todos', async (req, res) => {
    const  {user_email , title , progress , date} = req.body;
    const id = uuidv4();
    console.log(user_email , title , progress , date)
    try {
        const newTodo  = await pool.query('INSERT INTO todos (id,user_email, title, progress , date) VALUES ($1, $2, $3, $4, $5)', [id,user_email,title,progress,date])
        res.json(newTodo)
    } catch (err) {
        console.error(err);
    }
});
 

// edit a todo
app.put('/todos/:id', async (req,res) => {
 const {id} = req.params;
 const  {user_email , title , progress , date} = req.body;

 try {
   const editTodo =  await pool.query('UPDATE todos SET user_email = $1, title = $2 , progress = $3, date= $4 WHERE id = $5;',[user_email,title,progress,date ,id] )
   res.json(editTodo)
 } catch (err) {
    console.log(err);
 }

})




// delete a todo
app.delete('/todos/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const deletetodo =   await pool.query(`DELETE FROM todos WHERE id = $1;`,[id])
    res.json(deletetodo);
    } catch (err) {
        console.error(err);
    }
})

// signup

app.post('/signup', async (req, res) => {
  const {email,password} = req.body;
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword =  bcrypt.hashSync(password, salt)

  try { 
    const signup =  await pool.query(`INSERT INTO users (email, hashed_password) VALUES ($1 ,$2)`,
    [email, hashedPassword])  

    const token =  Jwt.sign({email},'secret',{expiresIn: "1hr"})

    res.json(token)

  } catch (err) {
    console.error(err);
    if(err){
      res.json({detail: err.detail})
    }
  }
})



// login

app.post('/login', async (req, res) => {

  const {email,password} = req.body;
  try {  
    const users =  await  pool.query(`SELECT * FROM users WHERE email = $1`, [email])

    if (!users.rows.length) return res.json({detail: 'user does not exist'})

    const success = await bcrypt.compare(password, users.rows[0].hashed_password);
    const token =  Jwt.sign({email},'secret',{expiresIn: "1hr"})

    if(success){
      res.json({'email': users.rows[0].email ,token })
    }else{
      res.json({detail: "Login failed"})
    }

  } catch (err) {
    console.error(err);
    
  }
})








app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
