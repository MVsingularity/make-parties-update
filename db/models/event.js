'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {

     Eventassociate = function(models) {
         Event.hasMany(models.Rsvp);
       };
    }
  Event.init({
    title: DataTypes.STRING,
    desc: DataTypes.TEXT,
    imgUrl: DataTypes.STRING //add this line (don't forget the comma above!)
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
