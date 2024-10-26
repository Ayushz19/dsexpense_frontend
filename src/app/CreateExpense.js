// pages/expenses/CreateExpense.js
import { useState } from 'react';
import axios from 'axios';

const CreateExpense = ({ onExpenseCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page refresh
    
    try {
      const newExpense = { title, description, category, date, amount };
      await axios.post('http://localhost:8080/api/expense', newExpense);
      
      // Call the onExpenseCreated function after successful expense creation
      onExpenseCreated(); 
      
      // Clear the form fields after submission
      setTitle(''); 
      setDescription(''); 
      setCategory(''); 
      setDate(''); 
      setAmount('');
    } catch (error) {
      console.error("There was an error creating the expense!", error);
    }
  };

  return (
    <div>
      <h1>Create a New Expense</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
        />
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
        />
        <button type="submit">Create Expense</button>
      </form>
    </div>
  );
};

export default CreateExpense;
