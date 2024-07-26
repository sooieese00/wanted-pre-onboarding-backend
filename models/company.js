module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
      company_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false
      },
      region: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {});
  
    Company.associate = function(models) {
      Company.hasMany(models.JobPosting, {
        foreignKey: 'company_id',
        as: 'jobPostings'
      });
    };
  
    return Company;
  };
  