const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json()) //-> req.body

//Routes//

//get all employees
// app.get('/employees', async (req, res) => {
//     try {
//         const allEmployees = await pool.query("SELECT * FROM employee");
//         res.json(allEmployees.rows);
//     } catch (error) {
//         console.error(error.message);
//     }
// })


// const parameterList = [emp_id, epf_no, name_with_initials, name_in_full, nic_no, address, mobile_number, residence_contact_no, gender, marital_status, bank_account_no, assigned_outlet, email_address, deactive, insertUser, insertDate, date_of_join, disc_per, date_of_resign, designation, image_name, bank_name, branch_name];

// pool.query('CALL get_employee', [parameterList], (error, results) => {
//     if (error) {
//       console.error('Error executing stored procedure:', error);
//     } else {
//       console.log('Stored procedure executed successfully:', results);
//     }
  
//     // Release the client back to the pool
//     pool.end();
//   });





// //get a user by Id
// app.get('/customers/:id', async (req, res) => {
//     const {id} = req.params;
//     try {
//         const Users = await pool.query("SELECT * FROM customers WHERE Id = $1", [id]);
        
//         res.json(Users.rows[0]);
//     } catch (error) {
//         console,error(error.message);
//     }
// })

//use sp file-------------------------------------------------------------------------------------------------------------------------


// Define a route to handle POST requests to insert data
app.post('/employees/insert', async (req, res) => {
    try {
      const {id,  name, address } = req.body;
  
      // Call the stored procedure to insert data
      const result = await pool.query('CALL insert_data($1, $2, $3)', [id, name, address]);
  
      res.status(200).json({ message: 'Data inserted successfully!' });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



// Define a route to fetch all employees
app.get('/employees', async (req, res) => {
    try {
      const client = await pool.connect();

      await client.query('BEGIN; CALL all_employees($1); COMMIT;', ['mycursor']);
      const { rows } = await client.query('FETCH ALL FROM mycursor;');
      
      res.json(rows);
      client.release();
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server Error' });
    }
  });


//delete a user
app.delete('/employees/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deleteUser = await pool.query('CALL delete_employee($1)', [id])
        res.json ("User successfully deleted!")
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});




















//---------------------------------------------------------------------------------------------------------------------------

//create a user
// app.post('/users/create', async (req, res) => {    
//     try {
//         const {Uname, Uaddress} = req.body;
//         const newUser = await pool.query(
//         "INSERT INTO mst_users (Uname, Uaddress) VALUES ($1, $2) RETURNING *", [Uname, Uaddress]
//         );
        
//         res.json(newUser.rows[0]);
        
        
//     } catch (error) {
//         console.error(error.message);
//     }
// });


// // POST endpoint for creating users
// app.post('/employees/create', async (req, res) => {
//     try {
//         const empData = req.body.emp; // Assuming req.body.users is an array of user objects

//         // Extracting user values for insertion into the database
//         const empValues = empData.map(emp => [emp.emp_id, emp.epf_no, emp.name_with_initials, emp.name_in_full, emp.nic_no, emp.address, emp.mobile_number, emp.residence_contact_no, emp.gender, emp.marital_status, emp.bank_account_no, emp.assigned_outlet, emp.email_address, emp.deactive, emp.insertUser, emp.insertDate, emp.date_of_join, emp.disc_per, emp.date_of_resign, emp.designation, emp.image_name, emp.bank_name, emp.branch_name  ]);

//         //Constructing the parameterized query string dynamically
//         const queryString = `
//             INSERT INTO employee (emp_id, epf_no, name_with_initials, name_in_full, nic_no, address, mobile_number, residence_contact_no, gender, marital_status, bank_account_no, assigned_outlet, email_address, deactive, insertUser, insertDate, date_of_join, disc_per, date_of_resign, designation, image_name, bank_name, branch_name )
//             VALUES ${empValues.map((_, index) => `($${index * 23 + 1}, $${index * 23 + 2} , $${index * 23 + 3} , $${index * 23 + 4}, $${index * 23 + 5} , $${index * 23 + 6} , $${index * 23 + 7}, $${index * 23 + 8} , $${index * 23 + 9} , $${index * 23 + 10}, $${index * 23 + 11} , $${index * 23 + 12} , $${index * 23 + 13}, $${index * 23 + 14} , $${index * 23 + 15} , $${index * 23 + 16}, $${index * 23 + 17} , $${index * 23 + 18} , $${index * 23 + 19}, $${index * 23 + 20} , $${index * 23 + 21} , $${index * 23 + 22}, $${index * 23 + 23})`).join(', ')}
//             RETURNING *;`;

//                 // Executing the query with parameterized values using the connection pool
//        const { rows: newEmp } = await pool.query(queryString, empValues.flat());

//         // Sending the newly created user(s) as a JSON response
//         res.status(201).json(newEmp);
//     } catch (error) {
//         // Handling any errors that occur during the process
//         console.error('Error creating empoloyee(s):', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post('/employees/create', async (req, res) => {
//     try {
//         const empData = req.body.emp; // Assuming req.body.emp is a JSONB object containing employee data

//         // Calling the stored procedure using the connection pool
//         const { rows: newEmp } = await pool.query('CALL create_employees($1)', [empData]);

//         // Sending the newly created employee(s) as a JSON response
//         res.status(201).json(newEmp);
//     } catch (error) {
//         // Handling any errors that occur during the process
//         console.error('Error creating employee(s):', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

//update a user










// //delete a user
// app.delete('/customers/:id', async (req, res) => {
//     try {
//         const {id} = req.params;
//         const deleteUser = await pool.query("DELETE FROM customers WHERE Id = $1", [id])
//         res.json ("User successfully deleted!")
//     } catch (error) {
//         console.error(error.message);
//     }
// });


app.listen(5000, ( ) => {
    console.log('server is listening on port 5000');
});
