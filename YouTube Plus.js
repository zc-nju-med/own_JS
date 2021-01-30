// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
const apiKey = "填入你的api"
 const channelID = "填入频道ID、不是频道名"
 const channelName = "手动修改频道名"
 const textColor = Color.white()
    
 if (config.runsInWidget) {
   const widget = await createWidget()
   Script.setWidget(widget)
   Script.complete()
 }
    
 async function getData (channelID, apiKey) {
   const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelID}&key=${apiKey}`
   const r = new Request(url)
   const body = await r.loadJSON()
   return body
 }
    
 async function createWidget() {
   const widget = new ListWidget()
      
   let ytData = await getData(channelID, apiKey)
   ytData = ytData.items[0]
      
   const subscribers = widget.addText(abbreviateNumber(ytData.statistics.subscriberCount, 2))
   subscribers.font = Font.boldSystemFont(36)
   subscribers.centerAlignText()
   subscribers.textColor = textColor
      
   const subscribersLabel = widget.addText("Subscribers")
   subscribersLabel.font = Font.semiboldSystemFont(10)
   subscribersLabel.centerAlignText()
   subscribersLabel.textColor = textColor
      
   widget.addSpacer()
      
   const viewsBlock = widget.addStack()
   viewsBlock.addSpacer()
      
   const viewsContainer = viewsBlock.addStack()
   viewsContainer.layoutHorizontally()
   viewsContainer.centerAlignContent()
     
   const viewSymbol = SFSymbol.named("play.fill")
   const viewImage = viewsContainer.addImage(viewSymbol.image)
   viewImage.tintColor = Color.white()
   viewImage.imageSize = new Size(12, 12)
      
   viewsContainer.addSpacer(4)
     
   const views = viewsContainer.addText(abbreviateNumber(ytData.statistics.viewCount))
   views.font = Font.semiboldSystemFont(20)
   views.centerAlignText()
   views.textColor = textColor
      
   viewsBlock.addSpacer()
     
   const viewsLabel = widget.addText("Views")
   viewsLabel.font = Font.semiboldSystemFont(10);
   viewsLabel.centerAlignText()
   viewsLabel.textColor = textColor
      
   widget.addSpacer()
      
   let channelLabel = widget.addText(channelName)
   channelLabel.font = Font.semiboldRoundedSystemFont(10);
   channelLabel.centerAlignText()
   channelLabel.textColor = textColor
      
   widget.addSpacer(2)
      
   let reloadStack = widget.addStack()
   reloadStack.layoutHorizontally()
   reloadStack.centerAlignContent()
      
   reloadStack.addSpacer()
      
   let reloadSymbol = SFSymbol.named("arrow.triangle.2.circlepath")
   let reloadImage = reloadStack.addImage(reloadSymbol.image)
   reloadImage.tintColor = Color.white()
   reloadImage.imageSize = new Size(8, 8)
   reloadImage.imageOpacity = 0.9
   reloadImage.centerAlignImage()
      
   reloadStack.addSpacer(2)
      
   let today = new Date()
   let updateTime = `${today.getMonth() + 1}/${today.getDate()} ${zeroPad(today.getHours())}:${zeroPad(today.getMinutes())}`
      
   let updateLabel = reloadStack.addText(updateTime)
   updateLabel.font = Font.semiboldRoundedSystemFont(8)
   updateLabel.textOpacity = 0.9
   updateLabel.centerAlignText()
   updateLabel.textColor = textColor
      
   reloadStack.addSpacer()
        
   const startColor = new Color("#C70039")
   const endColor = new Color("#303F9F")
   const gradient = new LinearGradient()
   gradient.colors = [startColor, endColor]
   gradient.locations = [0.0, 1]
   widget.backgroundGradient = gradient
      
   return widget
 }
    
 // Credit: https://stackoverflow.com/a/32638472
 // Thanks to https://stackoverflow.com/users/1438550/d-deriso
 function abbreviateNumber(num, fixed) {
   num = Number(num)
   if (num === null) { return null; } // terminate early
   if (num === 0) { return '0'; } // terminate early
   fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
   var b = (num).toPrecision(2).split("e"), // get power
   k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
   c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), // divide by power
   d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
   e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
   return e;
 }
    
 function zeroPad(numToPad) {
   if (numToPad > 9) {
     return numToPad
   } else {
     return `0${numToPad}` 
   }
 }