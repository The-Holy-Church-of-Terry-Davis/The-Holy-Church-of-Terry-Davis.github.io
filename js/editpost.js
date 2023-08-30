const validDiscordIDs = [
    "358736445361487872", // grimtin
    "259445589773647872", // yendy
    "1123758641485459477" // maximumtrollage
];

function parsePostTitle(postTitle) {
    const hyphenIndex = postTitle.indexOf(" - ");
    const byIndex = postTitle.indexOf(" by ");

    const title = postTitle.substring(0, hyphenIndex).trim();
    const date = postTitle.substring(hyphenIndex + 3, byIndex).trim();
    const author = postTitle.substring(byIndex + 4).trim();

    return [title, date, author];
}

function loadEditor(post) {
    const discordIDMap = {
        "Yendy": "259445589773647872",
        "Grimtin": "358736445361487872",
        "QAEZZ": "1123758641485459477"
    };

    const discordID = discordIDMap[post.title.includes("Yendy") ? "Yendy" : post.title.includes("Grimtin") ? "Grimtin" : post.title.includes("QAEZZ") ? "QAEZZ" : "couldn't resolve ID"];

    postTitleParsed = parsePostTitle(post.title)
    title = postTitleParsed[0]
    date = postTitleParsed[1]
    author = postTitleParsed[2]

    const editorHTML = `
        <header>Edit Post</header>
            <label for="postTitle">Post Title:</label><br/>
            <textarea style="font-size: large;" id="postTitle" name="postTitle" rows="1" cols="75" required>${title}</textarea>
            <br/>
            <br/>
            <label for="postID">Post ID:</label><br/>
            <textarea style="font-size: large;" id="postID" name="postID" rows="1" cols="75" disabled>${post.id}</textarea>
            <br/><br/>

            <label for="postDate">Post Date:</label><br/>
            <textarea style="font-size: large;" id="postDate" name="postDate" rows="1" cols="75" disabled>${date}</textarea>
            <br/><br/>

            <label for="postAuthor">Post Author:</label><br/>
            <textarea style="font-size: large;" id="postAuthor" name="postAuthor" rows="1" cols="75" disabled>${author}</textarea>
            <br/><br/>

            <label for="postTitleLink">Post Title Link:</label><br/>
            <textarea style="font-size: large;" id="postTitleLink" name="postTitleLink" rows="1" cols="75" required>${post.title_link}</textarea>
            <br/><br/>
    
            <label for="postBody">Post Body:</label><br/>
            <div>
                <button type="button" id="insertAnchorButton">Insert Anchor Tag</button>
                <button type="button" id="insertCodeButton">Insert Code Tag</button>
            </div>
    
            <textarea style="font-size: large;" id="postBody" name="postBody" rows="18" cols="75" required>${post.content}</textarea>
            <br/>
            <br/>
    
            <label for="accessToken">Access Token:</label>
            <br/>
            <input style="font-size: large;" type="password" id="accessToken" name="accessToken" required>
            <br/>
            <br/>

            <label for="discordID">Discord ID:</label>
            <br/>
            <input style="font-size: large;" type="text" id="discordID" name="discordID" disabled value="${discordID}">
            <br/>
            <br/>

            <input type="checkbox" id="isHeadline" name="isHeadline" value="true" ${post.headline ? "checked" : ""}>
            <label for="isHeadline">Is Headline</label><br/><br/>
    
            <button id="previewEdit" type="submit">Preview Edit</button><br/><br/>
    `;

    const middleSection = document.querySelector(".middle-section-posts");

    if (document.contains(document.getElementById("textEditorForm"))) {
        document.getElementById("textEditorForm").remove();
    } else if (document.contains(document.getElementById("previewHeader"))) {
        document.getElementById("previewHeader").remove();
    }

    const editorForm = document.createElement('form');
    editorForm.id = "textEditorForm";
    editorForm.innerHTML = editorHTML;
    middleSection.appendChild(editorForm);

    document.getElementById("textEditorForm").addEventListener("submit", async function (event) {
        try {
            event.preventDefault();

            const postTitle = document.getElementById("postTitle").value;
            const postDate = document.getElementById("postDate").value;
            const postAuthor = document.getElementById("postAuthor").value;

            const postID = document.getElementById("postID").value;
            const formattedTitle = `${postTitle} - ${postDate} by ${postAuthor}`;
            const titleLink = document.getElementById("postTitleLink").value;
            const postBody = document.getElementById("postBody").value;
            const accessToken = document.getElementById("accessToken").value;
            const discordID = document.getElementById("discordID").value;
            const isHeadline = document.getElementById("isHeadline").checked;


            const centralTzOffset = -5 * 60 * 60 * 1000; // Central Time is UTC-5 in milliseconds
            const utcNow = new Date();
            const centralTime = new Date(utcNow.getTime() + centralTzOffset);
            const editDate = centralTime.toLocaleDateString("en-US");

            const formattedPostBody = `<code>Edited on: ${editDate}</code><br/>${postBody}`;


            const middleSection = document.querySelector(".middle-section-posts");

            if (document.contains(document.getElementById("previewPost"))) {
                document.getElementById("previewPost").remove();
            } else if (document.contains(document.getElementById("previewHeader"))) {
                document.getElementById("previewHeader").remove();
            }

            const previewPost = document.createElement('div');
            previewPost.id = "previewPost";
            previewPost.className = "message";

            const previewPostTitleLink = document.createElement('a');
            previewPostTitleLink.href = titleLink;
            previewPostTitleLink.target = "_blank";
            previewPostTitleLink.id = "title";
            previewPostTitleLink.innerHTML = formattedTitle;

            const previewPostContentParagraph = document.createElement('p');
            previewPostContentParagraph.innerHTML = formattedPostBody;

            const previewPostIdPortion = document.createElement('code');
            previewPostIdPortion.innerHTML = `<br/>Post ID: ${postID}`;

            previewPost.appendChild(previewPostTitleLink);
            previewPost.appendChild(previewPostIdPortion);
            previewPost.appendChild(previewPostContentParagraph);

            const previewHeader = document.createElement('header');
            previewHeader.textContent = "Preview";
            previewHeader.id = "previewHeader";

            const submitEditButton = document.createElement('button');
            submitEditButton.textContent = "Submit Edit";
            submitEditButton.id = "submitEditButton"
            submitEditButton.setAttribute("type", "submit");

            middleSection.appendChild(previewHeader);
            middleSection.appendChild(previewPost);
            previewPost.appendChild(submitEditButton);

            document.getElementById("submitEditButton").addEventListener("click", async function (event) {
                try {
                    event.preventDefault();

                    // Get the ID of the post to edit
                    const postIDToEdit = parseInt(document.getElementById("postID").value);

                    // Fetch the original postsJson
                    const getOriginalUrl = "https://raw.githubusercontent.com/The-Holy-Church-of-Terry-Davis/The-Holy-Church-of-Terry-Davis.github.io/main/posts.json";
                    const getOriginalResponse = await fetch(getOriginalUrl);
                    const originalPostsjsonData = JSON.parse(await getOriginalResponse.text());

                    // Find the index of the post to edit
                    const postIndexToEdit = originalPostsjsonData.posts.findIndex(post => post.id === postIDToEdit);

                    if (postIndexToEdit !== -1) {
                        // Update the post values
                        originalPostsjsonData.posts[postIndexToEdit].title = `${postTitle} - ${postDate} by ${author}`;
                        originalPostsjsonData.posts[postIndexToEdit].title_link = document.getElementById("postTitleLink").value;
                        originalPostsjsonData.posts[postIndexToEdit].content = formattedPostBody;
                        originalPostsjsonData.posts[postIndexToEdit].headline = isHeadline;
            
                        // Convert the modified data to JSON
                        const modifiedData = {
                            total_posts: originalPostsjsonData.total_posts,
                            posts: originalPostsjsonData.posts
                        };
                        const fileContent = JSON.stringify(modifiedData, null, 2);
                        const encoder = new TextEncoder();
                        const data = encoder.encode(fileContent);
                        const fileContentBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));
            
                        const repoOwner = "The-Holy-Church-of-Terry-Davis";
                        const repoName = "The-Holy-Church-of-Terry-Davis.github.io";
                        const filePath = "posts.json";
                        const branchName = "main";
            
                        const getUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
                        const getResponse = await fetch(getUrl, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });
                        const currentSha = JSON.parse(await getResponse.text()).sha;
            
                        const payload = {
                            message: `Edit post with ID ${postIDToEdit} by ${postAuthor}`,
                            content: fileContentBase64,
                            branch: branchName,
                            sha: currentSha
                        };
            
                        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
                        const response = await fetch(url, {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(payload)
                        });
            
                        if (response.status === 200) {
                            console.log("File edited and pushed successfully.");
                            alert("Succesfully edited the post!");
                        } else {
                            const error = `Failed to edit file: ${await response.text()}`;
                            console.error(error);
                            alert(`ERR!\n${error}`);
                        }
                    } else {
                        alert(`Post with ID ${postIDToEdit} not found.`);
                    }
                } catch (error) {
                    alert(`ERR!\n${error}`);
                }
            });


        } catch (error) {
            console.error(error);
            alert(`ERR!\n${error}`);
        }
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById("fetchPostForm").addEventListener("submit", async function (event) {
        try {
            event.preventDefault();

            const postID = parseInt(document.getElementById("fetchPost").value);

            const postsJson = "https://raw.githubusercontent.com/The-Holy-Church-of-Terry-Davis/The-Holy-Church-of-Terry-Davis.github.io/main/posts.json";
            const getPostsJson = await fetch(postsJson);
            const postsJsonData = JSON.parse(await getPostsJson.text());

            const matchedPost = postsJsonData.posts.find(post => post.id === postID);

            if (matchedPost) {
                loadEditor(matchedPost);
            } else {
                alert(`Post with ID ${postID} does not exist.`);
            }
        } catch (error) {
            console.error(error);
            alert(`ERR!\n${error}`);
        }
    });
});