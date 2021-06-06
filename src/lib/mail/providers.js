module.exports = {
    providers: {
        // yandex: {
        //     host: 'smtp.yandex.ru',
        //     port: 465,
        //     secure: true,
        //     security: 'SSL',
        //     user: 'wippo.corp@yandex.com',
        //     pass: '' // not include in git commits
        // },
        sendgrid: {
            sender: 'wippo.corp@yandex.com',
            host: 'smtp.sendgrid.net',
            port: 465,
            secure: true,
            security: 'SSL',
            user: 'apikey',
            pass: '' // not include in git commits
        }
    }

}