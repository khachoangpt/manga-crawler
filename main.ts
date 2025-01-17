#! /usr/bin/env node

import { crawlNettruyen } from '@/crawler/nettruyen/nettruyen-crawler'
import { validateCliOptions } from '@/utils'
import {Command} from 'commander'
import { WebsiteEnum } from './src/constants/enums'

const program = new Command()

program
  .version('1.0.0', '-v, --version', 'output the current version')
  .description('CLI to crawl manga from any website')
  .option("-w, --website <value>","specify the website you want to crawl")
  .option("-u, --url <value>","specify the url of manga")
  .parse(process.argv)

const options = program.opts()

const website = options.website
const url = options.url

const isValidOptions = validateCliOptions({website, url})

if (!isValidOptions) {
  process.exit(1)
}

switch (website) {
  case WebsiteEnum.NETTRUYEN:
    crawlNettruyen(url)
    break
  default:
    console.log("Website not supported")
    break
}
