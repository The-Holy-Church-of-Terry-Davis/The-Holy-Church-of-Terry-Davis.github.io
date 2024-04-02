const validDiscordIDs = [
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

function parsePostBody(postBody) {
    const startIndex = postBody.indexOf("<!--start-edited-tag-->");
    const endIndex = postBody.indexOf("<br/><!--end-edited-tag-->");

    const editedTag = postBody.substring(0, endIndex + 26).trim();
    const body = postBody.replace(editedTag, "").trim();

    return [editedTag, body];
}

function loadEditorDisabled(post) {
    const discordIDMap = {
        "Yendy": "259445589773647872",
        "QAEZZ": "1123758641485459477"
    };

    const discordID = discordIDMap[post.title.includes("Yendy") ? "Yendy" : post.title.includes("QAEZZ") ? "QAEZZ" : "couldn't resolve ID"];

    if (post.content.includes("Edited on:")) {
        postBodyParsed = parsePostBody(post.content);
        editedTag = postBodyParsed[0];
        body = postBodyParsed[1];
    } else {
        body = post.content;
    }

    const editorHTML = `
        <header>Delete Post</header>
            <label for="postTitle">Post Title:</label><br/>
            <textarea style="font-size: large;" id="postTitle" name="postTitle" rows="1" cols="75" disabled>${post.title}</textarea>
            <br/>
            <br/>
            <label for="postID">Post ID:</label><br/>
            <textarea style="font-size: large;" id="postID" name="postID" rows="1" cols="75" disabled>${post.id}</textarea>
            <br/><br/>

            <label for="postTitleLink">Post Title Link:</label><br/>
            <textarea style="font-size: large;" id="postTitleLink" name="postTitleLink" rows="1" cols="75" disabled>${post.title_link}</textarea>
            <br/><br/>
    
            <label for="postBody">Post Body:</label><br/>
    
            <textarea style="font-size: large;" id="postBody" name="postBody" rows="18" cols="75" disabled>${body}</textarea>
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

            <input type="checkbox" id="isHeadline" name="isHeadline" value="true" ${post.headline ? "checked" : ""}disabled>
            <label for="isHeadline">Is Headline</label><br/><br/>
            <hr/>
            <br/>

            <label>Please type "<b><code style="font-size: large;">I want to delete post ID ${post.id}</code></b>" to delete the post. (case-sensitive)</label>
            <textarea style="font-size: large;" id="confirmation" name="confirmation" rows="1" cols="75" required></textarea>
            
            <br/><br/>
            <input type="checkbox" id="checkboxConfirmation" name="checkboxConfirmation" value="true">
            <label for="checkboxConfirmation">Are you sure you want to delete this post?</label><br/><br/>

            <button id="previewEdit" type="submit">Delete Post</button><br/><br/>
    `;

    const middleSection = document.querySelector(".middle-section-posts");

    if (document.contains(document.getElementById("textEditorForm"))) {
        document.getElementById("textEditorForm").remove();
    }

    const editorForm = document.createElement('form');
    editorForm.id = "textEditorForm";
    editorForm.innerHTML = editorHTML;
    middleSection.appendChild(editorForm);

    document.getElementById("confirmation").onpaste = e => e.preventDefault();

    document.getElementById("textEditorForm").addEventListener("submit", async function (event) {
        try {
            event.preventDefault();

            if (!document.getElementById("checkboxConfirmation").checked) {
                alert("Please check the box!");
                return;
            } else if (document.getElementById("confirmation").value.trim() != `I want to delete post ID ${post.id}`) {
                alert("Please type the sentence into the confirmation input!");
                return;
            }

            // Get the ID of the post to delete
            const postIDToDelete = parseInt(document.getElementById("postID").value);

            // Fetch the original postsJson
            const getOriginalUrl = "https://raw.githubusercontent.com/The-Holy-Church-of-Terry-Davis/The-Holy-Church-of-Terry-Davis.github.io/main/posts.json";
            const getOriginalResponse = await fetch(getOriginalUrl);
            const originalPostsjsonData = JSON.parse(await getOriginalResponse.text());

            // Find the index of the post to delete
            const postIndexToDelete = originalPostsjsonData.posts.findIndex(post => post.id === postIDToDelete);

            if (postIndexToDelete !== -1) {
                // Remove the post from the array
                originalPostsjsonData.posts.splice(postIndexToDelete, 1);

                // Update the total_posts count
                originalPostsjsonData.total_posts--;

                // Convert the modified data to JSON
                const fileContent = JSON.stringify(originalPostsjsonData, null, 2);
                const encoder = new TextEncoder();
                const data = encoder.encode(fileContent);
                const fileContentBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));

                const repoOwner = "The-Holy-Church-of-Terry-Davis";
                const repoName = "The-Holy-Church-of-Terry-Davis.github.io";
                const filePath = "posts.json";
                const branchName = "main";
                const accessToken = document.getElementById("accessToken").value;

                const getUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
                const getResponse = await fetch(getUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const currentSha = JSON.parse(await getResponse.text()).sha;

                const payload = {
                    message: `Delete post with ID ${postIDToDelete}`,
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
                    alert(`Post with ID ${postIDToDelete} has been deleted.`);
                } else {
                    const error = `Failed to edit file: ${await response.text()}`;
                    console.error(error);
                    alert(`ERR!\n${error}`);
                }
            } else {
                alert(`Post with ID ${postIDToDelete} not found.`);
            }

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
                loadEditorDisabled(matchedPost);
            } else {
                alert(`Post with ID ${postID} does not exist.`);
            }
        } catch (error) {
            console.error(error);
            alert(`ERR!\n${error}`);
        }
    });
});