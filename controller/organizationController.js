const { sequelize } = require("../model")


exports.createOrganization = async (req, res) => {
    const {name, address, email, number} = req.body
    const organizationNumber = Math.floor(1000+ Math.random()*9000)


    await sequelize.query(`CREATE TABLE organization_${organizationNumber}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        number VARCHAR(255) NOT NULL
    )`,{
        type: sequelize.QueryTypes.CREATE
    })
    await sequelize.query(`INSERT INTO organization_${organizationNumber} (name, address, email, number) VALUES(?,?,?,?)`,{
        type: sequelize.QueryTypes.INSERT,
        replacements: [name, address, email, number]
    })

    res.status(200).json({
        message: "Organization created successfully",
    })
}