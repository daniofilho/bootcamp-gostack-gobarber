import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

/*
  Os campos contigos aqui não são um reflexo do banco de dados,
  eles são apenas os campos que o usuário vai preencher no momento do cadastro,
  logo podem existir campos aqui apenas para manipulação de informações, como por
  exemplo o password que será convertido em password_hash
*/

class User extends Model {
  static init(sequelize) {
    // iniciar as colunas inseridas pelo usuário, pode ignorar as "padrão"
    // como as chaves e dates
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Virtual = campo que existe apenas no lado do código
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // Código que será executado antes de determinada ação => nesse caso 'beforeSave'
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8); // 8 = força da criptografia
      }
    });

    return this;
  }

  // Cria um relacionamento entre as tabelas
  static associate(models) {
    // ref: https://sequelize.org/master/class/lib/associations/base.js~Association.html
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  // Compara a senha normal com a hash
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
