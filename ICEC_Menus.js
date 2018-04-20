
function getWikiID() {
    // if you need to compute personalized navigation, do it here and return the id of the
    // correct wiki for this person.

    const wikiID = 'W39576ff9f93f_445b_b244_eb7440591c5a';
    return wikiID;
}

function getNavHierarchy() {
    const wikiID = getWikiID();
    const getFromURL = 'https://apps.na.collabserv.com/wikis/basic/api/wiki/' + wikiID + '/nav/feed';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            processNewData(this.response);
        }
    };
    xhttp.open("GET", getFromURL, true)
    xhttp.send();
}
function getNavLinkURL(itemId) {
    const wikiID = getWikiID();
    const getFromURL = 'https://apps.na.collabserv.com/wikis/basic/api/wiki/' + wikiID + '/page/' + itemId + '/entry';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            findNavURLAndOpen(this.responseXML);
        }
    };
    xhttp.open("GET", getFromURL, true);
    xhttp.send();
}
function findNavURLAndOpen(wikiXML) {
    const debug = false;
    const sumNode = wikiXML.getElementsByTagName('summary');
    let targetURL = sumNode[0].textContent;
    if (debug) console.log('link to open = ' + targetURL);
    if (targetURL) window.location = targetURL;
}
function getRoot(item) {
    return  item.root == 'true';
}
function getByRefId(item, refId) {
    return item.id == refId;
}
function processNewData(data) {
    const debug = false;
    let outHTML = "<div class='xccstyle'><div class='navtop'><div class='xccHeader'><div class='navigation' roles='navigation'>";
    let thisItem;
    let thisItem2;
    let thisItem3;
    outHTML += "<ul class='maindrop'>";
    const topObj = JSON.parse(data)
    var items = topObj.items;
    var root = items.find(getRoot);
    for (let a = 0; a < root.children.length; a++) {
        let targetId = root.children[a]['_reference'];
        let thisItem = findChild(items, targetId);
        outHTML += "<li>"
        outHTML += '<a class="nav-link" onclick="getNavLinkURL(\'' + thisItem.id.trim() + '\')">';
        outHTML += "<span class='nav-text'>" + thisItem.label + "</span></a>";
        if (debug) console.log('maindrop: ' + thisItem.label + ' / ' + thisItem.id.trim() + ' / SG');
        if (thisItem.childSize > 0) {
            outHTML += "<ul class='subdrop'>";
            for (let b = 0; b < thisItem.childSize; b++) {
                let thisItem2 = findChild(items, thisItem.children[b]['_reference']);
                outHTML += "<li>";
                outHTML += '<a class="nav-link" onclick="getNavLinkURL(\'' + thisItem2.id.trim() + '\')">';
                outHTML += "<span class='nav-text'>" + thisItem2.label + "</span>";
                outHTML += "</a>";
                if (debug) console.log("  subdrop: " + thisItem2.label + ' / ' + thisItem2.id.trim());
                if (thisItem2.childSize > 0){
                    outHTML += "<span class='toggle_click'><i rel='toggle_sub' class='fa fa-chevron-right'></i></span>";
                    outHTML += "<ul class='thirddrop'>";
                    for (let c = 0; c < thisItem2.childSize; c++) {
                        let thisItem3 = findChild(items, thisItem2.children[c]['_reference']);
                        outHTML += "<li>";
                        outHTML += '<a class="nav-link" onclick="getNavLinkURL(\'' + thisItem3.id.trim() + '\')">'
                        outHTML += "<span class='nav-text'>" + thisItem3.label + "</span></a></li>";
                        if (debug) console.log("    thisItem3: " + thisItem3.label + ' / ' + thisItem3.id.trim());
                    }
                    outHTML += "</ul>";
                }
                outHTML += "</li>";
            }
            outHTML += "</ul>";
        }
        outHTML += "</li>"
    }
    outHTML += "</ul></div></div></div></div>";
    addNavToPage(outHTML);
}
function findChild(items, targetId) {
    let child = items.find(function(item) {
          return item.id == targetId;
    });
    return child;
}
function addNavToPage(navHTML) {
    let newDiv = document.createElement('div');
    newDiv.setAttribute('id', 'icecNavigation');
    const body = document.querySelector('body');
    let lotusFrame = document.querySelector('.lotusInner');
    body.insertBefore(newDiv, lotusInner);
    const insertTo = document.getElementById('icecNavigation');
    if (insertTo) insertTo.innerHTML = navHTML;
}

getNavHierarchy();
