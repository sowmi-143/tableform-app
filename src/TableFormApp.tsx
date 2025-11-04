import { useState, useEffect } from "react";

interface Entry {
  id: number;
  name: string;
  email: string;
  number: string;
  date: string;
}

export default function TableFormApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Load from localStorage on first render
  const [entries, setEntries] = useState<Entry[]>(() => {
    const saved = localStorage.getItem("entries");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !number || !date) return;

    const newEntry: Entry = {
      id: editId ?? Date.now(),
      name,
      email,
      number,
      date,
    };

    if (editId) {
      setEntries(entries.map(entry => (entry.id === editId ? newEntry : entry)));
      setEditId(null);
    } else {
      setEntries([...entries, newEntry]);
    }

    setName("");
    setEmail("");
    setNumber("");
    setDate("");
  };

  const handleEdit = (id: number) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setName(entry.name);
      setEmail(entry.email);
      setNumber(entry.number);
      setDate(entry.date);
      setEditId(id);
    }
  };

  const handleDelete = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
    if (editId === id) {
      setEditId(null);
      setName("");
      setEmail("");
      setNumber("");
      setDate("");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h2>📋 Contact Form</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          style={{ marginRight: "1rem" }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ marginRight: "1rem" }}
        />
        <input
          type="tel"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Phone Number"
          required
          style={{ marginRight: "1rem" }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={{ marginRight: "1rem" }}
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <table border={1} cellPadding={8} style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Number</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td>{entry.name}</td>
              <td>{entry.email}</td>
              <td>{entry.number}</td>
              <td>{entry.date}</td>
              <td>
                <button onClick={() => handleEdit(entry.id)}>Edit</button>{" "}
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}