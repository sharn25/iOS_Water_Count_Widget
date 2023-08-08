// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;
//Widget to show glass of water drinked.

// Load modules
const color = importModule('color');


// Create Widget
const widget = new ListWidget()

// Intialize colors
const colors = color.getColors();

fm = FileManager.iCloud();
var base_path = fm.documentsDirectory() + "/water_counter/";

await createWidget_small()
if (!config.runsInWidget) {
    await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

async function createWidget_small() {
  
  //set dynamic background to widget and padding
  widget.backgroundColor = colors.bgColor;
  widget.setPadding(10,10,10,10)
  
  // create top row stack
  let top_row = widget.addStack()
  top_row.layoutVertically()
  top_row.addSpacer(10)
  let icon_row = top_row.addStack()
  icon_row.layoutHorizontally()
  icon_row.addSpacer(5)
  
  var image = Image.fromFile(await fetchimage("water_glass"))
    const iconImg = icon_row.addImage(image)
  iconImg.imageSize = new Size(40, 40)
  icon_row.addSpacer()
  top_row.addSpacer(15)
  
  let text_row_title = top_row.addStack()
  text_row_title.layoutHorizontally()
  text_row_title.addSpacer()
  
  const titleText = text_row_title.addText("Glass Drinked")
  titleText.rightAlignText()
    titleText.font = Font.mediumRoundedSystemFont(12)
    titleText.textColor = colors.secondaryText
    text_row_title.addSpacer(5)
    
    let text_row_total = top_row.addStack()
    text_row_total.layoutHorizontally()
    text_row_total.addSpacer()
    
    var todayDate = gettoadydate()
    var savedDate = await fetchtextfromfile("saveddate.txt")
    var glass = await fetchtextfromfile("water.txt")
    
    if(todayDate != savedDate){
      glass = "0"
    }
    console.log(glass)
    const totalText = text_row_total.addText(glass)
  totalText.rightAlignText()
    totalText.font = Font.boldRoundedSystemFont(32)

    text_row_total.addSpacer(5)
  
  top_row.addSpacer()
  
  widget.addSpacer()
  
  // create status bar row
  let last_row = widget.addStack()
  last_row.layoutHorizontally()
  last_row.addSpacer(5)
  
  // add date and last update time
  const dateToday = last_row.addText("Updated " + getformattedcurrenttime())
  dateToday.font = Font.mediumRoundedSystemFont(10)
  last_row.addSpacer()
  
  const lastUpdate = last_row.addText("@Sharn25")
  lastUpdate.font = Font.mediumRoundedSystemFont(10)
  last_row.addSpacer(5)
  
}

// Load image from local drive
async function fetchtextfromfile(filepath){
  var finalPath = base_path + filepath;
  let dir = fm.documentsDirectory();
  console.log(dir)
  if(fm.fileExists(finalPath)==true){
    console.log("file exists: " + finalPath);
    var glass = fm.readString(finalPath)
    
    return "" + glass;
  }else{
      throw new Error("Error file not found: " + image);
  }
}

// Get formatted Date
function getformatteddate(dateDB){
  var today = new Date();
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  
  if(dateDB === true){
    let year = today.getFullYear()
    year = String(year).substring(2, 4)
    return String(months[today.getMonth()]).toLowerCase() + year
  }
  
  return today.getDate() + "-" + months[today.getMonth()] + "-" + today.getFullYear()
}

function getformattedcurrenttime(){
  var today = new Date()
  
  var hour = today.getHours()
  var min = today.getMinutes()
  
  return hour + ":" + min
}


function gettoadydate(){
  var today = new Date()
  let day = today.getDate()
  let month = today.getMonth() + 1
  if(day<10){
    day = "0" + day
  }
  if(month<10){
    month = "0" + month
  }
  return day+""+month
}

// Load image from local drive or download in case not available
async function fetchimage(path){
  var finalPath = base_path + path + ".png";
  if(fm.fileExists(finalPath)==true){
    console.log("file exists: " + finalPath);
    return finalPath;
  }else{
    //throw new Error("Error file not found: " + path);
    if(fm.fileExists(base_path)==false){
      console.log("Directry not exist creating one.");
      fm.createDirectory(base_path);
    }
    console.log("Downloading file: " + finalPath);
    var imgurl = "https://github.com/sharn25/iOS_Water_Count_Widget/raw/main/water_glass.png";
    const image = await fetchimageurl(imgurl);
    console.log("Downloaded Image");
    fm.writeImage(base_path+path+".png",image);
    if(fm.fileExists(finalPath)==true){
      console.log("file exists after download: " + finalPath);
      return finalPath;
    }else{
      throw new Error("Error file not found: " + path);
    }
  }
}

// Fetch Image from Url
async function fetchimageurl(url) {
	const request = new Request(url)
	var res = await request.loadImage();
	return res;
}