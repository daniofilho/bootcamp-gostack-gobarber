module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // tabela de destino
      'avatar_id', // nome do novo campo
      {
        // definições do campo
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' }, // todo avatar_id é um id da tabela files
        onUpdate: 'CASCADE', // Se o id for alterado na tabela files, replica a alteração pra cá
        onDelete: 'SET NULL', // o que acontece se o id for deletado da tabela files? seta como null aqui tb
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
