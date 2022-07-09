const puppeteer = require('puppeteer');

const HOST = 'https://www.youtube.com';
const VIDEO = 'yjsEoVqo_f8'
// const HOST = 'https://www.youtu.be';
// const CHANNEL = 'SzybkiSzmal'

// const URL = `${HOST}/${VIDEO}`;
const URL = `${HOST}/watch?v=${VIDEO}`;
// const URL = `${HOST}/watch?v=${VIDEO}&ab_channel=${CHANNEL}`;
// what is: &lc=Ugx76k4tEvvQ7oyGIMh4AaABAg ???

const consent = async (page) => {

    await page.waitForFunction(`document.querySelector("div.ytd-consent-bump-v2-lightbox") !== null`);
    
    // TODO check language before hand not to look for both
    const cookieBtn2 = "//a[contains(., 'Zaakceptuj wszystko')]"
    const cookieBtn = "//a[contains(., 'Accept all')]"

    let [button] = await page.$x(cookieBtn);
    if (!button) {
        console.error('WRONG LANGUAGE')
        [button] = await page.$x(cookieBtn2);
    }

    if (button) {
        await button.click();
        await page.waitForFunction(`document.querySelector("div.ytd-consent-bump-v2-lightbox") === null`);
        return true
    } else {
        return false
    }
}

const visit = async (runner, run) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    
    const cookies = await page.cookies()

    const pendingConsent = cookies.find(c => c.name === 'CONSENT' && c.value.indexOf('PENDING')===0)

    if (pendingConsent) {
        console.log(`${run}-${runner}: consent needed`)

        try {
            const success = await consent(page)
            if (success) {
                // console.log(`${run}-${runner}: consent done`)
            } else {
                await page.screenshot({path: `screens/error-${run}-${runner}-${+(new Date)}.png`});    
                console.error(`${run}-${runner}: consent FAILED`)
            }
        } catch (err) {
            console.error(`${run}-${runner}: consent ERROR:`, err.message)
            return;// finishing run
        }

    }

    // await page.screenshot({path: `screens/start-${run}-${runner}-${+(new Date)}.png`});    

    // watching the video
    await page.waitForTimeout(36 * 1000)

    // await page.screenshot({path: `screens/end-${run}-${runner}-${+(new Date)}.png`});    

    await browser.close();  

    console.log(`DONE ${run}-${runner}`)
}

const swarm = async (count, run) => {
    const promises = []
    runner = 0
    while (runner < count) {
        runner++
        promises.push(visit(runner, run))
    }

    await Promise.all(await promises)
}

const attack = async (count, runs) => {
    run = 0
    while (run < runs) {
        run++
        await swarm(count, run)
    }
}

// attack(10,10)
attack(5,500)