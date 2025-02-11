"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Edit2, Trash2, X } from "lucide-react";
import { baseURL } from "../baseUrl";

const AssistantManagement = () => {
  const [assistants, setAssistants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAssistant, setCurrentAssistant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    videoLink: "",
    image: "",
    features: [],
    integrations: [],
    howToUse: [{ step: 1, title: "", description: "" }],
    creator: {
      name: "",
      description: "",
      stats: {
        clients: 0,
        rating: 0,
        support: "24/7",
      },
    },
  });

  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/assistants/getAssistantDetails`
      );
      setAssistants(response.data);
    } catch (error) {
      console.error("Error fetching assistants:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `${baseURL}/api/assistants/editAssistantDetails?id=${currentAssistant._id}`,
          formData
        );
      } else {
        await axios.post(
          `${baseURL}/api/assistants/createAssistantDetails`,
          formData
        );
      }
      fetchAssistants();
      resetForm();
    } catch (error) {
      console.error("Error saving assistant:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assistant?")) {
      try {
        await axios.delete(
          `${baseURL}/api/assistants/deleteAssistantDetails?id=${id}`
        );
        fetchAssistants();
      } catch (error) {
        console.error("Error deleting assistant:", error);
      }
    }
  };

  const handleEdit = (assistant) => {
    setCurrentAssistant(assistant);
    setFormData(assistant);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      videoLink: "",
      image: "",
      features: [],
      integrations: [],
      howToUse: [{ step: 1, title: "", description: "" }],
      creator: {
        name: "",
        description: "",
        stats: {
          clients: 0,
          rating: 0,
          support: "24/7",
        },
      },
    });
    setIsEditing(false);
    setIsModalOpen(false);
    setCurrentAssistant(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatorChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      creator: {
        ...prev.creator,
        [name]: value,
      },
    }));
  };

  const addHowToUseStep = () => {
    setFormData((prev) => ({
      ...prev,
      howToUse: [
        ...prev.howToUse,
        {
          step: prev.howToUse.length + 1,
          title: "",
          description: "",
        },
      ],
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Assistant Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" />
          Add Assistant
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        {assistants.map((assistant) => (
          <div
            key={assistant._id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <img
              src={assistant.image}
              alt={assistant.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{assistant.name}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(assistant)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(assistant._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {isEditing ? "Edit Assistant" : "Add New Assistant"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Assistant Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Assistant Name"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="videoLink"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Video Link
                  </label>
                  <input
                    id="videoLink"
                    type="text"
                    name="videoLink"
                    value={formData.videoLink}
                    onChange={handleInputChange}
                    placeholder="Video Link"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image URL
                  </label>
                  <input
                    id="image"
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Image URL"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Creator Details
                  </h3>
                  <div>
                    <label
                      htmlFor="creatorName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Creator Name
                    </label>
                    <input
                      id="creatorName"
                      type="text"
                      name="name"
                      value={formData.creator.name}
                      onChange={handleCreatorChange}
                      placeholder="Creator Name"
                      className="w-full p-2 border rounded-lg mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="creatorDescription"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Creator Description
                    </label>
                    <textarea
                      id="creatorDescription"
                      name="description"
                      value={formData.creator.description}
                      onChange={handleCreatorChange}
                      placeholder="Creator Description"
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">How To Use Steps</h3>
                    <button
                      type="button"
                      onClick={addHowToUseStep}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      + Add Step
                    </button>
                  </div>
                  {formData.howToUse.map((step, index) => (
                    <div key={index} className="space-y-2 mb-4">
                      <div>
                        <label
                          htmlFor={`stepTitle${index}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Step Title
                        </label>
                        <input
                          id={`stepTitle${index}`}
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const newHowToUse = [...formData.howToUse];
                            newHowToUse[index].title = e.target.value;
                            setFormData({ ...formData, howToUse: newHowToUse });
                          }}
                          placeholder="Step Title"
                          className="w-full p-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`stepDescription${index}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Step Description
                        </label>
                        <textarea
                          id={`stepDescription${index}`}
                          value={step.description}
                          onChange={(e) => {
                            const newHowToUse = [...formData.howToUse];
                            newHowToUse[index].description = e.target.value;
                            setFormData({ ...formData, howToUse: newHowToUse });
                          }}
                          placeholder="Step Description"
                          className="w-full p-2 border rounded-lg"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isEditing ? "Update" : "Create"} Assistant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantManagement;
