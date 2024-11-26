const Room = require("./room.model");

module.exports = (sequelize, Sequelize) => {
  const AllocatedRoom = sequelize.define("allocatedRoom", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    roomId: {
      type: Sequelize.INTEGER,
      references: {
        model: Room(sequelize, Sequelize),
        key: "id",
      },
      allowNull: false,
    },
    allocatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }, {
    timestamps: false,
  });

  //   association with Room 
  AllocatedRoom.belongsTo(Room(sequelize, Sequelize), {
    foreignKey: 'roomId',
    as: 'room',
  });

  return AllocatedRoom;
};
