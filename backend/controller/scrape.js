const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const dotenv = require("dotenv");
const { executablePath } = require("puppeteer");
dotenv.config();

const jobTitles = ["Software+Engineer", "UI+Designer", "Hardware+Engineer"];

const scrapeJobs = async (query) => {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1920,1080",
      "--disable-web-security",
      "--disable-features=IsolateOrigins",
      "--disable-site-isolation-trials",
      "--disable-features=BlockInsecurePrivateNetworkRequests",
    ],
    headless: "new",
  });
  console.log("Browser launched");
  try {
    const url = `https://www.indeed.com/jobs?q=${query}`;
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
    });

    await page.goto(url);

    console.log("Page loaded");

    const content = await page.content();
    console.log("Page content length:", content.length);

    // Wait for either selector to appear
    try {
      await page.waitForSelector(".job_seen_beacon", { timeout: 360000 });
    } catch (error) {
      console.log(error);
      console.log(`No job listings found for query: ${query}`);
      return [];
    }

    console.log("got the selector");
    const newJobs = await page.evaluate(() => {
      const jobsData = Array.from(
        document.querySelectorAll(".job_seen_beacon"),
      );
      return jobsData.map((job) => {
        const title =
          job.querySelector('[class*="title"]')?.innerText ||
          job.querySelector('[class*="jobTitle"]')?.innerText ||
          "N/A";

        const company_name =
          job.querySelector('[class*="company"]')?.innerText ||
          job.querySelector('[data-testid*="company-name"]')?.innerText ||
          "N/A";

        const location =
          job.querySelector('[class*="location"]')?.innerText ||
          job.querySelector('[data-testid*="location"]')?.innerText ||
          "N/A";

        const joblink = job.querySelector("a")?.href || "N/A";

        const description =
          Array.from(job.querySelectorAll('li, [class*="description"]'))
            .map((el) => el.innerText)
            .join("\n") || "N/A";

        return { title, company_name, location, joblink, description };
      });
    });
    return newJobs;
  } catch (error) {
    console.error(`Error scraping jobs for query ${query}:`, error);
    return [];
  } finally {
    await browser.close();
  }
};

exports.getJobs = async (req, res) => {
  try {
    const query = req.query.query; // Get the search query from request parameters

    console.log(query);
    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
    }

    const formattedQuery = query.replace(/\s+/g, "+"); // Replace spaces with + for the URL
    const jobs = await scrapeJobs(formattedQuery);

    res.status(200).json({
      status: "success",
      data: jobs,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
