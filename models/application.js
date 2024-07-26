module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
      application_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id'
        }
      },
      jobposting_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'JobPostings',
          key: 'jobposting_id'
        }
      }
    }, {//사용자는 1회만 지원 가능
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'jobposting_id']
        }
      ]
    });
  
    Application.associate = function(models) {
      Application.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      Application.belongsTo(models.JobPosting, {
        foreignKey: 'jobposting_id',
        as: 'jobPosting'
      });
    };
  
    return Application;
  };
  