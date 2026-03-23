import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneno: "",
  });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ LIVE BACKEND URL
  const API = "https://mern-backend-2hc1.onrender.com/api/users";

  const getUsers = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data.data);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // INPUT HANDLE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Name is required";

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.phoneno) {
      newErrors.phoneno = "Phone number is required";
    } else if (!/^\d+$/.test(form.phoneno)) {
      newErrors.phoneno = "Only numbers allowed";
    } else if (form.phoneno.length !== 10) {
      newErrors.phoneno = "Must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  // ADD USER
  const addUser = async () => {
    if (!validate()) return;

    try {
      await axios.post(API, form);
      showMessage("✅ User Added");
      setForm({ name: "", email: "", phoneno: "" });
      getUsers();
    } catch (err) {
      showMessage(err.response?.data?.message || "Error occurred");
    }
  };

  // DELETE
  const deleteUser = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await axios.delete(`${API}/${id}`);
        showMessage("❌ User Deleted");
        getUsers();
      } catch (err) {
        showMessage(err.response?.data?.message || "Error occurred");
      }
    }
  };

  // EDIT
  const editUser = (user) => {
    setEditId(user._id);
    setForm(user);
  };

  // UPDATE
  const updateUser = async () => {
    if (!validate()) return;

    try {
      await axios.put(`${API}/${editId}`, form);
      showMessage("✏️ User Updated");
      setEditId(null);
      setForm({ name: "", email: "", phoneno: "" });
      getUsers();
    } catch (err) {
      showMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>User CRUD App</h2>

        {message && <p style={styles.message}>{message}</p>}

        {/* FORM */}
        <div style={styles.form}>
          <div>
            <input
              name="name"
              value={form.name}
              placeholder="Name"
              onChange={handleChange}
            />
            <p style={styles.error}>{errors.name}</p>
          </div>

          <div>
            <input
              name="email"
              value={form.email}
              placeholder="Email"
              onChange={handleChange}
            />
            <p style={styles.error}>{errors.email}</p>
          </div>

          <div>
            <input
              name="phoneno"
              value={form.phoneno}
              placeholder="Phone"
              onChange={handleChange}
            />
            <p style={styles.error}>{errors.phoneno}</p>
          </div>

          {editId ? (
            <button onClick={updateUser}>Update</button>
          ) : (
            <button onClick={addUser}>Add</button>
          )}
        </div>

        {/* TABLE */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phoneno}</td>
                <td>
                  <button onClick={() => editUser(u)}>Edit</button>
                  <button
                    style={{
                      marginLeft: "10px",
                      background: "red",
                      color: "#fff",
                    }}
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

// 🎨 STYLES
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f5",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "600px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  error: {
    color: "red",
    fontSize: "12px",
    margin: "0",
  },
  message: {
    color: "green",
    fontWeight: "bold",
  },
};
