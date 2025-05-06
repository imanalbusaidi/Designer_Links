const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./server/Models/UserModel.js');
const PostModel = require('./server/Models/Posts.js');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { fileURLToPath } = require('url');
const { dirname } = require('path');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const RequestModel = require('./server/Models/RequestModel.js');
const MessageModel = require('./server/Models/MessageModel.js');
const DesignerRequestModel = require('./server/Models/DesignerRequest.js');
const { body, validationResult, param } = require('express-validator');
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://designerlink.onrender.com",
    "https://designerlink-client.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

module.exports = app;