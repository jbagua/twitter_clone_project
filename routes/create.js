router.post('/createTweet', async function(req, res) {
    let {username, password, content} = req.body
​
    print(req.body, "createTweet req.body")
​
    let user = await User.findOne({
        where: { username, password }
    })
​
    print(user, 'createTweet User retrieval')
​
    if (user) {
        let tweet = await Tweet.create({
            content,
            timeCreated: new Date(),
            UserId: user.id
        })
​
        res.redirect('/')
    } else {
        res.redirect('/error')
    }
})