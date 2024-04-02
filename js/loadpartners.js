
function loadPartners() {
    var start = Date.now();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'partners.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var partnersData = JSON.parse(xhr.responseText).partners;
            console.log("Got Partner Data.");
            processPartnerData(partnersData, start);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.error('Error fetching data:', xhr.statusText);
            processPartnerData([
                {
                    "id": 0,
                    "partner_name": "Error fetching data: " + xhr.status,
                    "partner_link": "https://thcotd.org"
                }
            ]);
        }
    };
    xhr.send();
}

function processPartnerData(partnersData, start) {
    var partnersSection = document.getElementById('partners-list');

    partnersData.sort(function (a, b) {
        return b.id - a.id;
    });

    for (var i = 0; i < partnersData.length; i++) {
        var partner = partnersData[i];
        var partnerListItem = document.createElement('li');

        var partnerLink = document.createElement('a');
        partnerLink.href = partner.partner_link;
        partnerLink.target = '_blank';
        partnerLink.textContent = partner.partner_name;

        partnerListItem.appendChild(partnerLink);

        // Code IS unoptimized, I just took it from loadposts, too lazy to make proper.
        partnersSection.insertBefore(partnerListItem, partnersSection.firstElementChild)

    }
    var timeTaken = Date.now() - start;
    console.log("partners loaded in: " + timeTaken + " milliseconds");
    
}