const mailSender = require('./mail-sender');

module.exports = {

    sendValidation(link, contact) {

        mailSender.sendMail({
            to: contact, // list of receivers
            subject: "Wippo, Hola! 👋", // Subject line
            text: "Hello world?", // plain text body
            html: `
                <b>Estamos felices de que te hayas registrado 😃</b>
                <a href="${link}">Haz click para validar la cuenta</a>
                Si el boton no funciona. Intenta copiar y pegar la siguiente dirección
                ${link}
            `, // html body
        });
    },

    sendPassword(link, contact) {

        mailSender.sendMail({
            to: contact, // list of receivers
            subject: "Wippo, Cambio de contraseña! 🔒", // Subject line
            text: "Hello world?", // plain text body
            html: `
                <b>Siempre cuidando tu seguridad 🛡️</b>
                <a href="${link}">Haz click para cambiar tu contraseña</a>
                Si el boton no funciona. Intenta copiar y pegar la siguiente dirección
                ${link}
            `, // html body
        });
    },

    

    sendPurchase(folio, monto, contact, link) {

        mailSender.sendMail({
            to: contact, // list of receivers
            subject: "Wippo, Estamos preparando tu compra 👋", // Subject line
            text: "Hello world?", // plain text body
            html: `
                <b>Hemos recibido tu pedido y proximamente estará en envió 😃</b>
                <p> Compra con el folio ${folio}. Monto: $ ${monto}.</p>
                <a>Para ver más detalles por favor accede a la <a href="${link}">plataforma</a></a>
            `, // html body
        });
    }
}