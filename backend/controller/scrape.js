const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const dotenv = require("dotenv");
dotenv.config();

const jobTitles = ["Software+Engineer", "UI+Designer", "Hardware+Engineer"];

const scrapeJobs = async (query) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const url = `https://www.indeed.com/jobs?q=${query}`;
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector(".job_seen_beacon");

  const newJobs = await page.evaluate(() => {
    const jobsData = Array.from(document.querySelectorAll(".job_seen_beacon"));
    return jobsData.map((job) => {
      const title = job.querySelector(".jobTitle a").innerText || "N/A";
      const company_name =
        job.querySelector(".company_location div span").innerText || "N/A";
      const location =
        job.querySelector(".company_location div div").innerText || "N/A";
      const joblink = job.querySelector(".jobTitle a").href || "N/A";
      const description =
        Array.from(job.querySelectorAll(".heading6 ul li"))
          .map((li) => li.innerText)
          .join("\n") || "N/A";

      return { title, company_name, location, joblink, description };
    });
  });
  await browser.close();
  return newJobs;
};

exports.getJobs = async (req, res) => {
  try {
    const { query } = req.query; // Get the search query from request parameters
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
