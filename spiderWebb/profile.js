const handleProfile = (req, res, id, knex) => {
    //const id = req.params;
    knex.select("*").from("users").where({
        id: id
    }).then(user => {
        user.length === 0 ? res.status(404).send("Id is not Found"):res.json(user[0]);
    }).catch(err => {
        console.log(id)
        res.json(err)
    });
}

module.exports = {
    handleProfile: handleProfile
}