import fs from "node:fs/promises"
import path from "node:path"
import { delay } from "@/utils"
import axios from "axios"
import * as cheerio from "cheerio"

const crawlChapter = async (storyUrl: string, tryCount = 0) => {
  let url = storyUrl
  const origin = new URL(storyUrl).origin

  if (!url.startsWith("http")) {
    url = `${origin}${url}`
  }

  try {
    console.log("Crawling:", url)
    const pageResponse = await axios.get(url, {
      method: "GET",
    })
    const html = pageResponse.data
    const $ = cheerio.load(html)
    const titleElement = $(".txt-primary")
    const title = titleElement.find("a").text().trim()
    const chapterName = titleElement
      .find("span")
      .text()
      .trim()
      .replace("- ", "")
    const images = $(".page-chapter").toArray()
    await fs.mkdir(
      path.join(
        __dirname,
        "data",
        title as string,
        chapterName as string
      ),
      { recursive: true }
    )

    for (const image of images) {
      const src = cheerio.load(image)("img").attr("data-src") ?? ""
      try {
        const response = await axios.get(src, {
          method: "GET",
          headers: { referer: origin },
          responseType: "arraybuffer",
        })
        const filePath = path.join(
          __dirname,
          "data",
          title as string,
          chapterName as string,
          `${images.indexOf(image) + 1}.jpg`
        )
        await fs.writeFile(filePath, response.data)
        await delay(1000)
      } catch (_) {
        console.log("Download image error", src)
      }
    }
  } catch (error) {
    if (tryCount > 5) {
      return
    }
    console.log("🚀 ~ crawlChapter ~ error:", error)
    await delay(30000)
    await crawlChapter(url, tryCount + 1)
  }
}

const crawlNettruyen = async (storyUrl: string) => {
  try {
    const response = await axios.get(storyUrl, {
      method: "GET",
    })

    const html = response.data
    const $ = cheerio.load(html)
    const chaptersWrapper = $("div.list-chapter nav ul#desc")
    const chaptersListElements = chaptersWrapper.find("li").toArray()
    const urls: string[] = []
    for (let i = chaptersListElements.length - 1; i >= 0; i--) {
      const chapterElement = chaptersListElements[i]
      const chapterUrl = cheerio.load(chapterElement)("a").attr("href") ?? ""
      urls.push(chapterUrl)
    }

    for (const url of urls) {
      await crawlChapter(url)
      await delay(5000)
    }
  } catch (error) {
    console.log("🚀 ~ crawlListChapter ~ error:", error)
  }
}

export { crawlNettruyen }