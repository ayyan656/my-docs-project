import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchDocuments();
    }
  }, [user, navigate]);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/docs`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setDocuments(res.data);
    } catch (err) {
      toast.error("Failed to fetch documents");
    }
  };

  const createNewDocument = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/docs`,
        { title: "Untitled Document" },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      navigate(`/editor/${res.data._id}`);
    } catch (err) {
      toast.error("Failed to create document");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/docs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Document deleted");
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (err) {
      toast.error("Failed to delete document");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">DocuSync 📝</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
        >
          🚪 Logout
        </button>
      </header>

      {/* Hero Section */}
      <div className="text-center py-10 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Welcome, {user?.username || "User"}!
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Manage all your documents in one place. Create, edit, and share in real-time with full collaboration support.
        </p>
        <button
          onClick={createNewDocument}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
        >
          ➕ Create New Document
        </button>
      </div>

      {/* Document List */}
      <div className="max-w-4xl mx-auto px-4 w-full">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">📁 Your Documents</h3>
        <ul className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-gray-500">No documents found. Create one to get started!</p>
          ) : (
            documents.map((doc) => (
              <li
                key={doc._id}
                className="flex justify-between items-center p-4 bg-white shadow-sm rounded-md hover:shadow-md transition"
              >
                <a
                  href={`/editor/${doc._id}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  📝 {doc.title || "Untitled Document"}
                </a>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="text-red-500 hover:text-red-700 text-lg"
                  title="Delete Document"
                >
                  ❌
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-sm text-gray-500 py-6">
        🚀 Built by <span className="text-blue-600 font-semibold">Ayyan</span>
      </footer>
    </div>
  );
};

export default Home;

