module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      }
    }, {});
  
    // User 모델에 다른 연관 관계가 있는 경우 추가합니다.
    
    return User;
  };
  