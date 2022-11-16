'use strict';

module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    desc: DataTypes.TEXT,
    imgUrl: DataTypes.STRING //add this line (don't forget the comma above!)
  })

  Event.associate = function(models) {
      Event.hasMany(models.Rsvp);
      Event.belongsTo(models.User);
       }
  return Event;
};
