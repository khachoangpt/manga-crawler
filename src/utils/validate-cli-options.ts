const validateCliOptions = ({url,website}: { website?: string; url?: string }) => {
  if (!website) {
    console.log("Please specify the website you want to crawl")
    return false
  }

  if (!url) {
    console.log("Please specify the url of manga")
    return false
  }

  return true
}

export { validateCliOptions }