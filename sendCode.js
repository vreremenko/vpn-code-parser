const puppeteer = require("puppeteer");
const axios = require("axios");

async function sendCode(email)  {
    const PROXY_LIST_URL = 'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/socks5/data.txt';

    console.log('Загружаем список прокси...');
    let proxies = [];

    try {
        const response = await axios.get(PROXY_LIST_URL);
        proxies = response.data.split('\n').filter(proxy => proxy.trim() !== '');
    } catch (error) {
        console.error('Не удалось загрузить список прокси:', error);
        process.exit(1);
    }

    console.log(`Найдено ${proxies.length} прокси.`);

    for (let proxy of proxies) {
        console.log(`Пробуем прокси: ${proxy}`);
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    `--proxy-server=${proxy}`
                ],
            });

            const page = await browser.newPage();

            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
            );

            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
            });

            console.log('Открываем сайт...');
            try {
                await page.goto("https://hidexy.name/demo/", { timeout: 50000, waitUntil: 'load' });


                console.log('Ожидаем появления текстового поля...');
                try {
                    const inputSelector = '.input_text_field';
                    const buttonSelector = '.inputs_wrap button';

                    await page.type(inputSelector, email, { delay: 100 });
                    console.log(`${email} успешно вставлен.`);
                    await page.click(buttonSelector)

                    await new Promise(res => setTimeout(res, 20000))
                } catch {
                    console.error('Не удалось найти текстовое поле!');
                    continue;
                }

                await browser.close();
                console.log('Браузер закрыт, задача выполнена.');
                break;
            } catch (waitError) {
                console.error('Ошибка загрузки сайта.', waitError.message);
            }

            await browser.close();
        } catch (err) {
            console.error(`Ошибка при попытке прокси ${proxy}:`, err.message);
            console.log('Пробуем следующий прокси...');
        }
    }

    console.log('Все прокси проверены или задача выполнена.');
}

module.exports = sendCode;
