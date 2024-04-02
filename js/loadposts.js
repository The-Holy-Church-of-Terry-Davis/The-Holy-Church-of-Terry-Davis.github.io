function loadPosts() {
    var start = Date.now();
    console.log("Unfortunately, I have to use JS... - QAEZZ");

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'posts.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var postsData = JSON.parse(xhr.responseText).posts;
            console.log("Got Post Data.");
            processPostData(postsData, start);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.error('Error fetching data:', xhr.statusText);
            processPostData([
                {
                    "id": 1,
                    "headline": true,
                    "title": "Error fetching data.",
                    "title_link": "https://thcotd.org",
                    "content": "There was an error fetching data: " + xhr.statusText
                },
                {
                    "id": 2,
                    "headline": false,
                    "title": "Error fetching data.",
                    "title_link": "https://thcotd.org",
                    "content": "There was an error fetching data: " + xhr.statusText
                }
            ]);
        }
    };
    xhr.send();
}

function processPostData(postsData, start) {
    var middleSectionPosts = document.querySelectorAll('.middle-section-posts');

    postsData.sort(function (a, b) {
        return b.id - a.id;
    });

    for (var i = 0; i < postsData.length; i++) {
        var post = postsData[i];
        var postDiv = document.createElement('div');
        postDiv.className = 'message';

        var titleLink = document.createElement('a');
        titleLink.href = post.title_link;
        titleLink.target = '_blank';
        titleLink.id = 'title';
        titleLink.innerHTML = post.title;

        var contentParagraph = document.createElement('p');
        contentParagraph.innerHTML = post.content.replace("<!--start-edited-tag-->", "").replace("<!--end-edited-tag-->", "");

        var idPortion = document.createElement('code');
        idPortion.innerHTML = `<br/>Post ID: ${post.id}`;

        postDiv.appendChild(titleLink);
        postDiv.appendChild(idPortion);
        postDiv.appendChild(contentParagraph);

        if (post.headline) {
            for (var j = 0; j < middleSectionPosts.length; j++) {
                var header = middleSectionPosts[j].querySelector('header');
                if (header.textContent === 'Headline') {
                    middleSectionPosts[j].insertBefore(postDiv, header.nextElementSibling);
                    break;
                }
            }
        } else {
            for (var k = 0; k < middleSectionPosts.length; k++) {
                var header = middleSectionPosts[k].querySelector('header');
                if (header.textContent === 'Other News') {
                    middleSectionPosts[k].appendChild(postDiv);
                    break;
                }
            }
        }
    }
    var timeTaken = Date.now() - start;
    console.log("Posts loaded in: " + timeTaken + " milliseconds");
}