const handleSignin = (knex, bcrypt) => (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json("incorrect form submission");
    }
    knex.select("email", "hash").from("login")
        .where("email", "=", email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return knex.select("*").from("users")
                    .where("email", "=", email)
                    .then(data => {
                        res.json(data[0])
                    })
                    .catch(err => console.log("unable to get user"))
            } else {
                res.json('Sorry! wrong email or password')
            }
        })
        .catch(err => res.json('Sorry! wrong email or password'))
}

module.exports = {
    handleSignin: handleSignin
}