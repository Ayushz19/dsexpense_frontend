// pages/expenses/CreateExpense.js
import { useState , useEffect } from 'react';
import axios from 'axios';




const CreateExpense = ({ onExpenseCreated ,expenseToEdit, onEditComplete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const categories=["Fest" , "event" , "posters" , "Nightout"]
  const [successMessage, setSuccessMessage] = useState("");
  

const handleFileChange=(event)=>{
    setFile(event.target.files[0]);
}




  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setAmount(expenseToEdit.amount);
      setDescription(expenseToEdit.description);
      setCategory(expenseToEdit.category);
    }
  }, [expenseToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      title,
      amount,
      description,
      category,
      date: new Date().toISOString().split("T")[0], // Adjust as needed for your backend format
    };

    try {
      if (expenseToEdit) {
        // Update expense using PUT if editing
        await axios.put('http://localhost:8080/api/expense/${expenseToEdit.id}, expenseData');
        onEditComplete(); // Clear editing state after updating
      } else {
        // Create a new expense using POST if not editing
        await axios.post("http://localhost:8080/api/expense", expenseData);
      }

      // Reset form and trigger refresh
      setTitle("");
      setAmount("");
      setDescription("");
      setCategory("");
      onExpenseCreated();
    } catch (error) {
      console.error("Error submitting expense", error);
    }
  };
 

  return (
    <div className="bg-orange-400  p-5 w-max rounded-lg mt-10">
      <h1 className="text-2xl mb-2">Create a New Expense</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
        <input 
          type="text" 
          placeholder="Name" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        </div>
        <div>
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        </div>
        {/* <input 
          type="text" 
          placeholder="Category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
        /> */}
        <div>
       
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
       
        <div>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
        />
        </div>
        <div>
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
        />
        </div>
        <button className="bg-black text-white p-2 rounded-md " type="submit"> {expenseToEdit ? "Update Expense" : "Create Expense"}</button>
      </form>
       {/* Success message */}
       {successMessage && (
        <p style={{ color: "green", marginTop: "10px" , fontSize:"28px" , fontWeight:"600" }}>{successMessage}</p>
      )}
    </div>
  );
};

export default CreateExpense;