'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const upload = require('../../services/files/private_messages/uploadFiles');

const {
  privateMessages: {
    create,
    getChatByUserId,
    deleteMessageById,
    readMessages,
    getChats,
    getFiles,
    getMessagesChatByUserId,
  },
} = require('../../controllers');

const {
  validateCreateMessage,
} = require('../../middlewares/private_messages');

router.get('/private/users/:id',
  authorized,
  (req, res) => getChatByUserId(req, res),
);

router.get('/private/users/:id/:messageId',
  authorized,
  (req, res) => getMessagesChatByUserId(req, res),
);

router.post('/private/users',
  upload.fields([
    { name: 'file',
      maxCount: 1,
      fileSize: 1,
    },
  ]),
  validateCreateMessage,

  authorized,
  (req, res) => create(req, res),
);

router.put('/private/read/:id',
  authorized,
  (req, res) => readMessages(req, res),
);

router.delete('/private/:id',
  authorized,
  (req, res) => deleteMessageById(req, res),
);

// router.post('/private/files',
//   upload.single('file'),
//   (req, res) => postFile(req, res),
// );

router.get('/private/chats',
  authorized,
  (req, res) => getChats(req, res),
);

router.get('/private/files/:id/:type',
  authorized,
  (req, res) => getFiles(req, res),
);

module.exports = router;
