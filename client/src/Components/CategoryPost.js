import React from "react";
import { useDispatch } from "react-redux";
import { likePost } from "../features/CategoryPostSlice";
import { SERVER_URL } from "../config";

const CategoryPost = ({ post }) => {
  const dispatch = useDispatch();

  const handleLike = () => {
    dispatch(likePost(post._id));
  };

  const postStyle = {
    border: "2px solid #4CAF50",
    borderRadius: "10px",
    padding: "20px",
    margin: "15px 0",
    background: "linear-gradient(135deg, #f3f4f6, #e0f7fa)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    maxWidth: "400px",
    textAlign: "center",
  };

  const postImageStyle = {
    width: "100%",
    maxHeight: "250px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  };

  const buttonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#45a049",
  };

  return (
    <div style={postStyle}>
      <h3>{post.postMsg}</h3>
      {post.image && <img src={`${SERVER_URL}/uploads/${post.image}`} alt="Post" style={postImageStyle} />}
      <button
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        onClick={handleLike}
      >
        Like
      </button>
      <p>Likes: {post.likes.count}</p>
    </div>
  );
};

export default CategoryPost;