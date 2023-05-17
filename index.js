const puppeteer = require("puppeteer");
require("dotenv").config();

const usernamevar = process.env.USERNAME_1;
const passwordvar = process.env.PASSWORD_1;


function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function example() {
  console.log("Starting...");
  await wait(5000); // Wait for 2000 milliseconds (2 seconds)
  console.log("...Finished waiting");
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://auth.pltw.org/");
  await page.waitForSelector(".idp-discovery");

  // Fill in the username and password fields
  await page.click("#idp-discovery-username");
  await page.type("#idp-discovery-username", usernamevar);

  await page.waitForSelector("#idp-discovery-submit");
  await page.click("#idp-discovery-submit");

  await page.waitForSelector("#okta-signin-password");
  await page.click("#okta-signin-password");
  await page.type("#okta-signin-password", passwordvar);

  // Click the "Sign In" button
  await Promise.all([
    page.waitForNavigation(), // Wait for the navigation to finish
    page.click("#okta-signin-submit"), // Click the button
  ]);
  // Wait for the page to load after login

  await page.waitForSelector("#CoursesIcon");
  console.log("Sucess Logged in");

  await page.goto(
    "https://auth.pltw.org/home/pltwext_ssoinkling_1/0oadcfc5pW35RzrJQ4x6/alndch6hoYn7kE0Wh4x6"
  );

  await page.waitForSelector(".book-grid");
  await page.goto("https://pltw.read.inkling.com/read/sn_2078");

  await page.click(".show-nav");

  await page.waitForSelector(".tab-label");

  await page.evaluate(() => {
    document.querySelector('[data-tab-name="glossary"]').click();
  });

  await page.waitForSelector(".glossary-container");

  const glossaryEntries = await page.$$(".glossary-entry");

  // Iterate through the glossary entries and click on them, then extract the paragraph text
  for (const entry of glossaryEntries) {
    // Click on the glossary entry
    await entry.click();
    const termName = await entry.$eval(
      ".term",
      (element) => element.textContent
    );
    // Extract the paragraph text from the 'snippet-content' element
    const paragraphText = await entry.$eval(
      ".snippet-content p",
      (element) => element.textContent
    );

    console.log(`${termName},${paragraphText};`);
  }
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  await browser.close();
})();
