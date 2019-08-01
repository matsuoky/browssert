/*
 * enjoy
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function searchPage(page, iPage) {
	if (iPage.target) {
		try {
			await evalTarget(page, iPage.target);
		} catch(err) {
			console.log(err.name + ': ' + err.message);
		}
	}
	if (iPage.next) {
		await next(page, iPage.next);
	}
}

async function next(page, iNext) {
	if (!iNext.selector) {
		console.log("selector is required!");
		return;
	}
	if (!iNext.type) {
		console.log("type is required!");
		return;
	}
	if (iNext.input) {
		for (let i = 0; i < iNext.input.length; i++){
			let t = iNext.input[i];
			if (t.type === "text") {
				await page.type(t.selector, t.val);
			}
		}
	}
	if (iNext.type === "click") {
		await Promise.all([
			page.waitForNavigation({timeout: 60000, waitUntil: "domcontentloaded"}),
			page.click(iNext.selector)
		]);
	}
	if (iNext.page) {
		await searchPage(page, iNext.page);
	}
}

async function evalTarget(page, target) {
	let shot = "";
	for (let i = 0; i < target.length; i++){
		console.log("page title: " + await page.title());
		let t = target[i];
		let data = await page.$eval(t.selector, e => e.textContent);
		data = data.replace(/\r\n|\r/g, '\n');
		let result = "";
		if (data === t.expected) {
			result = result + "OK";
			shot = shot + t.expected + "_ok_";
		} else {
			result = result + "NG";
			shot = shot + t.expected + "_ng_";
		}
		result = result + ":result=" + data + ":expected=" + t.expected;
		console.log(result);
	}
	shot = shot.replace(/\r?\n/g, '');
	await page.screenshot({
	        path: shot + ".png",
	        fullPage: true
	});
}

(async() => {
	const browser = await puppeteer.launch();
	if (process.argv.length < 3) {
		console.error('check your cmd.args! > node browssert.js filename');
		process.exit(1);
	}
	try {
		const itemJson = JSON.parse(fs.readFileSync(process.argv[2], {encoding: "utf-8"}));
		for (let i = 0; i < itemJson.items.length; i++) {
			console.log("[item." + i + "] ");
				let item = itemJson.items[i];
				const page = await browser.newPage();
				await page.setViewport({
					width: 1200,
					height: 800
				});
				await page.goto(item.url);
				if (item.page) {
					await searchPage(page, item.page)
				}
				try {
					if (item.target) {
						await evalTarget(page, item.target);
					}
				} catch(err) {
					console.log(err.name + ': ' + err.message);
				}
		}
	} catch(err) {
		console.log(err.name + ': ' + err.message);
	}
	await browser.close();
})();

