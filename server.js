import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendTestEmail } from './mailer.js'; // Correct import
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Initialize the express app
const app = express();
const port = 3010;

// Initialize Supabase client with environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle login and send email
app.post('/login', async (req, res) => {
 // Assuming the email is sent with the login request

  try {
    // Check if the user exists in Supabase (or you could validate the login in a different way)
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .order('created_at', { ascending: false }) // Order by latest
      .limit(1)
 // Fetch user by email

    const email = data[0].email;

    if (error) {
      return res.status(400).json({ error: 'User not found' });
    }

    // If user exists, send the email
    try {
      const emailResponse = await sendTestEmail(email); // Send email to the logged-in user
      console.log(`Email sent to: ${email}`);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (sendError) {
      console.error(`Failed to send email:`, sendError.message);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
