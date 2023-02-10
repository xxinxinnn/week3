const https = require('https');
const JSSoup = require('jssoup').default;
const fs = require('fs');
const url = "https://en.wikipedia.org/wiki/Howl%27s_Moving_Castle_(film)"; // FIRST: find a url of a page you are interested in from wikipedia 
const jsonPath = "./json/"; 
const name = "";


/*
This web-scraping example is set up for working with wikipedia.If you want to adapt this
to scrape another site you should go and inspect the site in the browser first, then adapt this. 
*/

//returns one large string of all text
function getParagraphText(soupTag){
    let paragraphs = soupTag.findAll('p');
    // let text = '';
    let howl = [];
    for(let i = 0; i < paragraphs.length; i++){
        let p = paragraphs[i].getText().toLowerCase();
        // text += paragraphs[i].getText();

          if(p.indexOf("anti-war") != -1){
          console.log(p);
         //   text += p;
         howl.push(p);
          }
    }

    return howl;
}

function getAllExternalLinks(soupTag){
    let aTags = soupTag.findAll('a'); // return an array of SoupTag object
    let links = [];
   
    for(let i = 0; i < aTags.length; i++){
        let attrs = aTags[i].attrs;// get a tag attributes

        // if there is an href attribute in attires let's get it
        if('href' in attrs){
            let hrefValue = attrs.href;
            if(hrefValue[0]!= "#" && hrefValue .indexOf("index.php") == -1);
            {
             //从数组的第一个数（0）开始，如果没有#的同时，如果index.php不存在的情况下，运行
                links.push(hrefValue);
            }
        }
 
    }

    return links;
}

//pass in Plain Old Javascript Object that's formatted as JSON
function writeJSON(data){
    try {
        let path = jsonPath+name+".json";
        fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
        console.log("JSON file successfully saved");
    } catch (error) {
        console.log("An error has occurred ", error);
    }
}

//create soup  
function createSoup(document){
    
    let soup = new JSSoup(document);
    let data = {
        "name": name,
        "url": url,
        "content": {},
        "links": {}//json 存储单元
    }; 

    let main = soup.find('main');//only get the content from the main body of the page

    data.content = {
        "text": getParagraphText(main)
    };

    data.links = {
        "text": getAllExternalLinks(main)
    };//赋值
        
    //output json
    writeJSON(data);

}

//Request the url
https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
    
    let document = [];

    res.on('data', (chunk) => {
        document.push(chunk);
    }).on('end', () => {
        document = Buffer.concat(document).toString();
        // console.log(body);
        createSoup(document);
    });

}).on('error', (e) => {
    console.error(e);
});

