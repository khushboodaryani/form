"use cleint"

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    name:"",
    company:"",
    gender:"",
    age: "",
    email:"",
    contact:"",
    query:"",
    disposition: "Customer Support",
  })
  const [status , setStatus] = useState("");
  const handleChange = (e: any) =>{
    setForm({ ...form, [e.targer.name]: e.target.value});

  };
  const submitForm = async (e: any) =>{
    e.preventDefault();
    setStatus("sending...");

    const res = await fetch("api/enquiry", {
      method: "POST",
      headers: {
      "content-Type ": "application/json"
      },
      body: JSON.stringify(form),
    })

    if(res.ok) {
      setStatus(submitted Successfully);
      setForm({
         name:"",
    company:"",
    gender:"",
    age: "",
    email:"",
    contact:"",
    query:"",
    disposition: "Customer Support",
      })
    } else {
      setStatus("Error submititng")    }
  };
  return (
    <div>
      <h1>
        Multycomm Enquiry Form
      </h1>
      <form onSubmit={submitForm}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required/>
        <label>Company</label>
        <input name="company" value={form.company} onChange={handleChange} required/>
        <label>Company</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
        <option>Male</option>
        <option>female</option>
        <option>other</option>
        </select>
        <label>Age</label>
        <input name="age" value={form.age} onChange={handleChange} type="number" required/>
         <label>Email</label>
         <input name="email" value={form.email} onChange={handleChange} type="email" required/>
         <label>Contact number</label>
         <input name="contact number" value={form.contact} onChange={handleChange} type="number" required/>
         <label>Query</label>
         <textarea name="query" value={form.query} onChange={handleChange}></textarea>
<label>Disposition</label>
<select
name="dispositon"
value={form.disposition}
onChange={handleChange}>
  <option>Customer support</option>
        <option>Consultant Support</option>
        <option>B2B Lead</option>
        <option>New Lead</option>
        <option>General Enquiry</option>
        <option>other</option>
        </select>

        <button type="submit">Submit</button>
        
      </form>
    </div>
  );
}
