'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Applications', {
      application_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      jobposting_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'JobPostings',
          key: 'jobposting_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('Applications', {
      fields: ['user_id', 'jobposting_id'],
      type: 'unique',
      name: 'unique_user_jobposting'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Applications', 'unique_user_jobposting');
    await queryInterface.dropTable('Applications');
  }
};
