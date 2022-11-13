var imaps = require('imap-simple');
const { sortBy, reverse } = require('lodash');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');
const contents = require("./imap")

function getImapInfo(mail) {
  const arr = contents.split(/\r?\n/)
  const extMail = mail.split("@")[1];
  for (const info of arr) {
    const [ext, host, port] = info.split("|").slice(1);
    if (extMail === ext) {
      return [host, port]
    }
  }
}

const getLink = (mail, pass) => {

  let imapinfo = getImapInfo(mail);
  if (!imapinfo) {
    return "no imap";
  }
  let [host, port] = imapinfo;

  return new Promise((resolve) => {
    var config = {
      imap: {
        user: mail,
        password: pass,
        host,
        port,
        tls: true,
        authTimeout: 5000
      }
    };
    try {
      imaps.connect(config).then(function (connection) {
        connection.on("error", function () {
          console.log("An error occured. This should handle it?");
          resolve(null)
        });
        return connection.openBox('INBOX').then(async function () {
          var delay = 24 * 3600 * 1000;
          var yesterday = new Date();
          yesterday.setTime(Date.now() - delay);
          yesterday = yesterday.toISOString();
          var searchCriteria = [['SINCE', yesterday]];
          var fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
          };
          let urlIds = [];
          let messages = await connection.search(searchCriteria, fetchOptions)
          for (const item of messages) {
            var all = _.find(item.parts, { "which": "" })
            var id = item.attributes.uid;
            var idHeader = "Imap-Id: " + id + "\r\n";
            let mail = await simpleParser(idHeader + all.body)
            let regex = /https:\/\/iforgot.apple.com\/verify\/email\?(\d|\w|=|-)+/
            let urls = regex.exec(mail.html)
            if (urls?.[0]) {
              urlIds.push({ url: urls?.[0], date: mail.date })
            }
          }
          if (urlIds.length > 0) {
            sortBy(urlIds, ['date'])
            reverse(urlIds)
            let newestUrl = urlIds[0]
            resolve(newestUrl.url)
          } else {
            resolve(null)
          }
        }).catch(e => { resolve(null) });
      }).catch(e => { resolve(null) });
    } catch (error) {
      resolve(null)
    }
  })
}

module.exports = getLink;
