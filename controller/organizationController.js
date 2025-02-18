const { sequelize, users } = require("../model")


exports.createOrganization = async (req, res, next) => {
    const {name, address, email, number} = req.body
    const userId = req.userId
    const organizationNumber = Math.floor(1000+ Math.random()*9000)


    await sequelize.query(`CREATE TABLE IF NOT EXISTS organization_${organizationNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        number VARCHAR(255) NOT NULL,
        userId INT NOT NULL REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
    )`,{
        type: sequelize.QueryTypes.CREATE
    })

    const userData = await users.findByPk(userId)
    userData.currentOrganizationNumber = organizationNumber
    await userData.save()

    await sequelize.query(`CREATE TABLE IF NOT EXISTS userHistory_${userId}(
        organizationNumber INT NOT NULL 
        
    )`)
    await sequelize.query(`INSERT INTO organization_${organizationNumber} (name, address, email, number,userId) VALUES(?,?,?,?,?)`,{
        type: sequelize.QueryTypes.INSERT,
        replacements: [name, address, email, number,userId]
    })
    await sequelize.query(`INSERT INTO userHistory_${userId} (organizationNumber) VALUES(?)`,{
        type: sequelize.QueryTypes.INSERT,
        replacements: [organizationNumber]
    })
    req.userId = userId
    req.organizationNumber = organizationNumber
    next()

}



exports.createBlogTable = async (req, res) => {
    
    const organizationNumber = req.organizationNumber
    await sequelize.query(`CREATE TABLE IF NOT EXISTS blog_${organizationNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        createdBy INT NOT NULL REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
    )`,{
        type: sequelize.QueryTypes.CREATE
    })
    // Seeding
    await sequelize.query(`INSERT INTO blog_${organizationNumber}(title,subtitle,description,image,createdBy) VALUES 
        ('seedtitle','test','desc','image',2)`,{
        type : sequelize.QueryTypes.INSERT
    })
    res.status(200).json({
        message : "Organization created Succesfully!",
        orgNo : organizationNumber
    })
}
exports.deleteUser = async (req, res) => {
   const userId = req.userId
   const usersOrganizations = await sequelize.query(`SELECT organizationNumber FROM userHistory_${userId}`,{
        type: sequelize.QueryTypes.SELECT
    })
    await sequelize.query(`DELETE FROM users WHERE id = ?`,{
        replacements: [userId],
        type: sequelize.QueryTypes.DELETE
    })

    for (var i = 0; i < usersOrganizations.length; i++) {
        await sequelize.query(`DROP TABLE organization_${usersOrganizations[i].organizationNumber}`,{
            type: sequelize.QueryTypes.DROP
        })
    
    }

    await sequelize.query(`DROP TABLE userHistory_${userId}`,{
        type: sequelize.QueryTypes.DROP
        
    })
    
    res.status(200).json({
        message: "User and orgs related to user deleted successfully"
    })
}

exports.createBlog = async(req,res)=>{
    const organizationNumber = req.organizationNumber
    await sequelize.query(`INSERT INTO blog_${organizationNumber}`)
}