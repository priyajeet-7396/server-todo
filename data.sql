
-- for creating table todos

CREATE TABLE todos (
    id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255),
    title VARCHAR(30),
    progress INT,
    date VARCHAR(300)
);


-- for creating table users
CREATE TABLE users(
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255)
);

-- for inserting data into todos table 

INSERT INTO todos (id,user_email, title, progress , date) VALUES ($1, $2, $3, $4, $5, [id,user_email,title,progress,date])


-- for editing the existing table 

UPDATE todos SET user_email = $1, title = $2 , progress = $3, date= $4 WHERE id = $5;

-- for deleting from todos 

DELETE FROM todos WHERE id = $