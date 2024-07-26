module.exports = (sequelize, DataTypes) => {
    const JobPosting = sequelize.define('JobPosting', {
      jobposting_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies',
          key: 'company_id'
        }
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reward: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      skills: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {});
  
    JobPosting.associate = function(models) {
      JobPosting.belongsTo(models.Company, {
        foreignKey: 'company_id',
        as: 'company'
      });
    };
  
    return JobPosting;
  };
  