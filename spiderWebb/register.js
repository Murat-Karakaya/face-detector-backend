const handleRegister = (req, res, knex, bcrypt) => {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json("incorrect form submission");
    }
    const hash = bcrypt.hashSync(password);
    knex.transaction(trx => {
        trx.insert({
                hash,
                email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name,
                        joined: new Date()
                    })
                    .then(user => res.json(user[0]))
                    .catch(err => res.status(400).json('err'));
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
}

module.exports = {
    handleRegister,
}