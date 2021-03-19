const {Telegraf} = require('telegraf')
const {token} = require('./token')
const axios = require('axios')

const bot = new Telegraf(token)

var surov = `------------------------------\nMISOL UCHUN: \n\t\t\t\t\t\t\t<b>17884541 matches</b>\n--g\'alabalar soni: \n\t\t\t\t\t\t\t<b>wl</b>\n--match haqida:\n\t\t\t\t\t\t\t<b>matches</b>\n--geroyiz haqida:\n\t\t\t\t\t\t\t<b>heroes</b>\n--birga uynaganlar:\n\t\t\t\t\t\t\t<b>peers</b>\n`
bot.start( ctx =>
    {
    let kim = ((ctx.from.first_name || '') +' '+ (ctx.from.last_name || '')).toLocaleUpperCase()
    ctx.replyWithHTML(`nima gap\n ${kim} \n\n <b>steam id raqamini ber!</b>`)
    ctx.replyWithHTML(surov)
    })


bot.on('message', async (msg)=>
    {
    let textMessage = msg.message.text
    let kim = (msg.from.first_name +' '+ msg.from.last_name).toLocaleUpperCase()
    let NewResolt = textMessage.split(' ')
    let bool = +NewResolt[0]

    if (NewResolt.length == 1 && bool)
        {
            try
            {
            const resolt1 = await axios.get('https://api.opendota.com/api/players/'+NewResolt[0])
            let {personaname, plus, avatarfull, profileurl} = resolt1.data.profile
            return msg.replyWithHTML(`STEAM NIK:  ${personaname ?? 'negadir yuq!'}\nTELEGRAM NIK:  ${kim}\ndata plus:  ${plus ? 'bor' : 'yo\'q'}\nrasmi:  ${avatarfull}\nsteam profili:  ${profileurl}\n` + surov)
            }
        catch (e)
            {
            return msg.replyWithHTML(` XATO ID \n{ID} {metod} qilib yozing!!!!\n${surov}`)
            }
        }

        else if (NewResolt[1] == 'heroes' && bool)
            {
            try
                {
                const resolt2 = await axios.get('https://api.opendota.com/api/players/'+NewResolt[0]+'/'+NewResolt[1])
                resolt2.data.forEach(({hero_id, games, win})=>
                    {
                    axios.get('https://www.opendota.com/api/heroes/').then(d =>
                        {
                        d.data.forEach(({id, localized_name})=>
                            {
                            if (id == hero_id)
                                {
                                msg.replyWithHTML(`geroy: ${localized_name}\no'yin: ${games}\ng'alaba: ${win}\n`)
                                }
                            })
                        }).catch(e => e)
                    })
                return msg.replyWithHTML(`\n\n` + surov)
                }
            catch (e)
                {
            return msg.replyWithHTML(` XATO heroes\n{ID} {metod} qilib yozing!!!!\n${surov}`)
                }
            }

        else if (NewResolt[1] == 'matches' && bool)
            {
            try
                {
                const resolt3 = await axios.get('https://api.opendota.com/api/players/'+NewResolt[0]+'/'+NewResolt[1])
                let hrs = resolt3.data.forEach((
                        {
                        match_id, // match id si
                        radiant_win,// yutganligi
                        duration,// qancha vaqt uynagani
                        hero_id,// qaysi geroyda uynagani 
                        start_time,// qachon boshlagani
                        kills, // o'ldirgani
                        deaths, // o'lgani
                        assists, // yordam bergani
                        party_size // nechi kishi bo'lib uynagani
                        })=>
                    {
                    let hero = axios.get('https://www.opendota.com/api/heroes/').then(d =>
                        {
                        d.data.forEach(({id, localized_name})=>
                            {
                            if (id == hero_id)
                                {
                                msg.replyWithHTML(`match ID: ${match_id}\ngeroy: ${localized_name}\nyutganmi: ${radiant_win ? 'yutgan' : 'yutmagan'}\ndavomiyligi: ${parseInt(duration/60)} min\nqachon boshlagani: ${start_time}\n hisob: ${kills}/${deaths}/${assists}\nguruh: ${party_size ? party_size : 'nomalum'} kishi`)
                                }
                            })
                        })
                        .catch(e => e)
                    })
                return msg.replyWithHTML(`matches\n\n` + surov)
                }
            catch (e)
                {
                return msg.replyWithHTML(` XATO matches\n{ID} {metod} qilib yozing!!!!\n${surov}`)
                }
            }

        else if (NewResolt[1] == 'wl' && bool)
            {
            try
                {
                const resolt4 = await axios.get('https://api.opendota.com/api/players/'+NewResolt[0]+'/wl')
                let {win, lose} = resolt4.data
                return msg.replyWithHTML(`TELEGRAM NIK:  ${kim}\ng'alaba:  ${win}\nmag'lubiyat:  ${lose}\n` + surov)
                }
            catch (e)
                {
                return msg.replyWithHTML(` XATO wl\n{ID} {metod} qilib yozing!!!!\n${surov}`)
                }
            }

        else if (NewResolt[1] == 'peers' && bool)
            {
            try
                {
                const resolt5 = await axios.get('https://api.opendota.com/api/players/'+NewResolt[0]+'/peers')
                resolt5.data.forEach(({account_id, win, games, personaname, avatarfull}) =>
                    {
                    axios.get('https://api.opendota.com/api/players/'+account_id)
                        .then(msg.replyWithHTML(`NIKi:  ${personaname}\nu bilan g'alaba:  ${win} ta\nbirga uynagan:  ${games} ta o'yin\nrasm:  ${avatarfull}`))
                        .catch(e => e)
                    })
                }
            catch (e)
                {
                return msg.replyWithHTML(` XATO peers\n{ID} {metod} qilib yozing!!!!\n${surov}`)
                }
            }

        else
            {
            msg.replyWithHTML(`XATO: <b>${msg.message.text}</b>\n${surov}`)
            }
    })

bot.launch()