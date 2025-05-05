import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../config";

const SharePost = () => {
  const [postMsg, setPostMsg] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("Graphic Design");
  const user = useSelector((state) => state.users.user);

  const handlePost = async () => {
    if (user.userType !== "designer") {
      alert("Only designers can share posts.");
      return;
    }

    const formData = new FormData();
    formData.append("postMsg", postMsg);
    formData.append("email", user.email);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`${SERVER_URL}/savePost`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Post successfully saved!");
      } else {
        alert("Failed to save post. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while saving the post.");
    }
  };

  if (user.userType !== "designer") {
    return <p>You do not have permission to upload posts.</p>;
  }

  return (
    <div className="share-post">
      <textarea
        placeholder="What's on your mind?"
        value={postMsg}
        onChange={(e) => setPostMsg(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Graphic Design">Graphic Design</option>
        <option value="3D Design">3D Design</option>
        <option value="Illustration">Illustration</option>
        <option value="UI/UX">UI/UX</option>
      </select>
      <button onClick={handlePost}>Post</button>
    </div>
  );
};

export default SharePost;
