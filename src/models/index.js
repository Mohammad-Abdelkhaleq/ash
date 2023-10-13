'use strict';
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');


const userModel = require('./users/users.js');
const messagesModel=require('./messagesTable/messages.js');
const roomsModel=require('./rooms/rooms.js');
const privateMessagesModel=require('./messagesTable/privateMessages.js');
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const Collection = require('./data-collection.js');


const POSTGRES_URI = process.env.NODE_ENV === "test" ? "sqlite::memory:" : process.env.DATABASE_URL;
let sequelizeOptions = process.env.NODE_ENV === "production" ?
    {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    } :
    {}


const sequelize = new Sequelize(POSTGRES_URI,sequelizeOptions);
const users = userModel(sequelize, DataTypes);

const messages=messagesModel(sequelize,DataTypes);
const rooms=roomsModel(sequelize,DataTypes);
const privateMessages=privateMessagesModel(sequelize,DataTypes);
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


messages.hasMany(rooms,{foreignKey:'room_id',sourceKey:'id'});
rooms.belongsTo(messages,{foreignKey:'room_id',targetKey:'id'});

//fixed this

users.hasMany(privateMessages,{foreignKey:'sender',sourceKey:'username'});
privateMessages.belongsTo(users,{foreignKey:'sender',targetKey:'username'});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



module.exports = {
  db: sequelize,
//   reviews: new Collection(reviews),
//   charger: new Collection(charger),
//   reservation: new Collection(reservation),
  users: users,
  messagesModal: messages,
  roomsModal: rooms,
  privateMessagesModal: privateMessages,

};