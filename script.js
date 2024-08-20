const vnData = '/home/pynux/Documents/visual novel pt1/data.json';

function insertHTML(){
    return `
          <div id='mainbox'>
			<div id='spritebox' class='rightalign'>
				<img src=''>
			</div>
			<div id='namebox'>
					<span>Loading...</span>
			</div>
			<div id='textbox'>
				<p>Loading...</p>
				<div id='optionsbox'></div>
			</div>
		</div>
    `
}


const htmlData = insertHTML();
document.getElementById('VisualNovel').insertAdjacentHTML("beforebegin", htmlData);

const $textbox = document.querySelector("#textbox p");
const $optionsbox = document.querySelector('#optionsbox');
const $namebox = document.querySelector("#namebox span");
const $spritebox = document.querySelector("#spritebox img");
const $mainbox = document.querySelector('#mainbox');

let json, to;

var pageNum = 0;
var currentPage;

async function grabData(){
    const resp = await fetch(vnData)
    
    json = await resp.json();
    
    currentPage = Object.keys(json.Scene1.PAGES)[pageNum];

    initialize(json);
    handleOptions(json);
}

async function initialize(data){
    $spritebox.src = '';
    $namebox.innerText = '';
    $textbox.innerText = '';

    $spritebox.src = data.Characters[data.Scene1.PAGES[currentPage].Character][data.Scene1.PAGES[currentPage].Sprite];

    $namebox.innerText = data.Scene1.PAGES[currentPage].Character;

    typeWriter(data.Scene1.PAGES[currentPage].PageText);

    $mainbox.style.backgroundImage = "url(" + data.Scene1.Background + ")";
}

//städar
function handleOptions(data){
    $optionsbox.innerHTML = "";

    if(data.Scene1.PAGES[currentPage].hasOwnProperty('Options')){
        var o = data.Scene1.PAGES[currentPage].Options;
        var str = Object.keys(o).forEach(k => {
            const row = document.createElement('div');
            row.innerHTML = `${k}`
            $optionsbox.appendChild(row);
            row.addEventListener('click', () => {
                currentPage = (o[k]);
                pageNum = Object.keys(json.Scene1.PAGES).indexOf(currentPage);
                initialize(json);
                $optionsbox.innerHTML = "";
            })
        })
    }
}

//så att texten ser cool ut när den skrivs ut. &nbsp är blanksteg i HTML och är till för att det ska skrivas ut korrekt. 
function typeWriter(txt, i){
    i = i || 0;
    if(!i) {
        $textbox.innerHTML = '';
        clearTimeout(to);
    }
    var speed = 30; 
    if (i < txt.length){
        var c = txt.CharAt(i++);
        if(c === ' ') c = '&nbsp;'
        $textbox.innerHTML += c;
        to = setTimeout(function() {
            typeWriter(txt, i)
        }, speed);
    }
}

function checkPage(data){
    if(data.Scene1.PAGES[currentPage].hasOwnProperty('Options'))
        return false;
    if(data.Scene1.PAGES[currentPage].hasOwnProperty('NextPage')){
        if(data.Scene1.PAGES[currentPage].NextPage == "End") return false;

    }
    return true;
}

document.addEventListener('keydown', (e) => {
    if(!json) return;
    if(e.key == "ArrowRight" && checkPage(json)){
        if(json.Scene1.PAGES[currentPage].hasOwnProperty('NextPage')){
            currentPage = json.Scene1.PAGES[currentPage].NextPage;
        }
        else {
            pageNum++;
            currentPage = Object.keys(json.Scene1.PAGES)[pageNum];
        }

        initialize(json);
        handleOptions(json);
    }
    else return;

})

grabData();
