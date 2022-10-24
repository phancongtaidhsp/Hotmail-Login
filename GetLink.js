var imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');

const getLink = (mail, pass) => {
  return new Promise((resolve) => {
    var config = {
      imap: {
        user: mail,
        password: pass,
        host: 'imap-mail.outlook.com',
        port: 993,
        tls: true,
        authTimeout: 5000
      }
    };
    try {
      imaps.connect(config).then(function (connection) {
        return connection.openBox('INBOX').then(function () {
          var searchCriteria = ['1:5'];
          var fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
          };
          return connection.search(searchCriteria, fetchOptions).then(function (messages) {
            messages.forEach(function (item) {
              var all = _.find(item.parts, { "which": "" })
              var id = item.attributes.uid;
              var idHeader = "Imap-Id: " + id + "\r\n";
              simpleParser(idHeader + all.body, (err, mail) => {
                // access to the whole mail object
                let regex = /https:\/\/iforgot.apple.com\/verify\/email\?(\d|\w|=|-)+/
                let urls = regex.exec(mail.html)
                if (urls?.[0]) {
                  resolve(urls?.[0])
                }
                resolve(null)
              });
            });
          });
        });
      });
    } catch (error) {
      resolve(null)
    }
  })
}

module.exports = getLink;