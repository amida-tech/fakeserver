module.exports = {
    name: 'fake server',
    address: 'localhost',
    port: 3000,
    description: 'This is the description of the fake server... it gets sent when requesting the root ("/")',
    users: [
        {
            username: 'isabella',
            password: 'testtest',
            usertype: 'advanced'
        },
        {
            username: 'daniel',
            password: 'testtest',
            usertype: 'basic'
        }
    ]
};