const butterflySystemConfig = {
    databaseName : 'KelebekSistemi',
    URL:'mongodb+srv://admin:Password12@cluster0.uqoht.mongodb.net/test',
    collections:{
        customers:'customers',
        students:'students',
        classes:'classes'
    }
};

module.exports = {
    butterflySystemConfig: butterflySystemConfig,
}