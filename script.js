console.log("Unfortunately I have to use JS... - QAEZZ");

fetch('posts.json')
    .then(response => response.json())
    .then(postsData => {
        console.log("Got Data.");
        processData(postsData.posts);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        processData([
            {
                "id": 1,
                "headline": true,
                "title": "Error fetching data.",
                "title_link": "https://thcotd.org",
                "content": `There was an error fetching data: ${error.message}`
            },
            {
                "id": 2,
                "headline": false,
                "title": "Error fetching data.",
                "title_link": "https://thcotd.org",
                "content": `There was an error fetching data: ${error.message}`
            }
        ]);
    });

function processData(postsData) {
    const middleSectionPosts = document.querySelectorAll('.middle-section-posts');
    
    postsData.sort((a, b) => b.id - a.id);

    for (const post of postsData) {
        const postDiv = document.createElement('div');
        postDiv.className = 'message';

        const titleLink = document.createElement('a');
        titleLink.href = post.title_link;
        titleLink.target = '_blank';
        titleLink.id = 'title';
        titleLink.innerHTML = post.title;

        const contentParagraph = document.createElement('p');
        contentParagraph.innerHTML = post.content;

        postDiv.appendChild(titleLink);
        postDiv.appendChild(contentParagraph);

        if (post.headline) {
            for (const section of middleSectionPosts) {
                const header = section.querySelector('header');
                if (header.textContent === 'Headline') {
                    section.insertBefore(postDiv, header.nextElementSibling);
                    break;
                }
            }
        } else {
            for (const section of middleSectionPosts) {
                const header = section.querySelector('header');
                if (header.textContent === 'Other News') {
                    section.appendChild(postDiv);
                    break;
                }
            }
        }
    }
}
