
document.addEventListener('DOMContentLoaded', function () {
    const insertAnchorButton = document.getElementById('insertAnchorButton');
    const insertCodeButton = document.getElementById('insertCodeButton');
    const postBody = document.getElementById('postBody');

    insertAnchorButton.addEventListener('click', function () {
        const anchorUrl = prompt('Enter the URL for the anchor:');
        if (anchorUrl) {
            const selectedText = postBody.value.substring(postBody.selectionStart, postBody.selectionEnd);
            const anchorTag = `<a href="${anchorUrl}" target="_blank">${selectedText}</a>`;
            postBody.value = postBody.value.slice(0, postBody.selectionStart) + anchorTag + postBody.value.slice(postBody.selectionEnd);
        }
    });

    insertCodeButton.addEventListener('click', function () {
        const selectedText = postBody.value.substring(postBody.selectionStart, postBody.selectionEnd);
        const codeTag = `<pre>\n<code>\n${selectedText}\n</code>\n</pre>`;
        postBody.value = postBody.value.slice(0, postBody.selectionStart) + codeTag + postBody.value.slice(postBody.selectionEnd);
    });
});


document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById("textEditorForm").addEventListener("submit", async function (event) {
        try {
            event.preventDefault();

            const postTitle = document.getElementById("postTitle").value;
            const postTitleLink = document.getElementById("postTitleLink").value;
            const postBody = document.getElementById("postBody").value;
            const accessToken = document.getElementById("accessToken").value;
            const discordID = document.getElementById("discordID").value; 
            const isHeadline = document.getElementById("isHeadline").checked;

            const validDiscordIDs = [
                "358736445361487872", // grimtin
                "259445589773647872", // yendy
                "1123758641485459477" // maximumtrollage
            ];

            if (!validDiscordIDs.includes(discordID)) {
                const warning = document.createElement("p");
                warning.textContent = "Invalid Discord ID. Please enter a valid ID.";
                document.getElementById("textEditorForm").appendChild(warning);
                return;
            }
            if (discordID == "358736445361487872") {
                author = "Grimtin, The ???";
            } else if (discordID == "259445589773647872") {
                author = "Yendy, The Owner";
            } else if (discordID == "1123758641485459477") {
                author = "QAEZZ, The Consigliere";
            } else {
                alert("Author coditional statement error.");
                return;
            }

            const repoOwner = "The-Holy-Church-of-Terry-Davis";
            const repoName = "The-Holy-Church-of-Terry-Davis.github.io";
            const filePath = "posts.json";
            const branchName = "main";

            const getOriginalUrl = `https://raw.githubusercontent.com/The-Holy-Church-of-Terry-Davis/The-Holy-Church-of-Terry-Davis.github.io/main/posts.json`;

            const getOriginalResponse = await fetch(getOriginalUrl);
            const originalPostsjsonData = JSON.parse(await getOriginalResponse.text());
            console.log(originalPostsjsonData);


            const centralTzOffset = -5 * 60 * 60 * 1000; // Central Time is UTC-5 in milliseconds
            const utcNow = new Date();
            const centralTime = new Date(utcNow.getTime() + centralTzOffset);

            const postDate = centralTime.toLocaleDateString("en-US");

            const newPostId = originalPostsjsonData.total_posts;

            const post = {
                id: newPostId,
                headline: isHeadline,
                title: `${postTitle} - ${postDate} by ${author}`,
                title_link: postTitleLink,
                content: postBody
            };

            const nextPostId = newPostId + 1;
            const nextPostJson = originalPostsjsonData.posts.concat([post]);
            const modifiedData = {
                total_posts: nextPostId,
                posts: nextPostJson
            };

            const fileContent = JSON.stringify(modifiedData, null, 2);
            const encoder = new TextEncoder();
            const data = encoder.encode(fileContent);
            const fileContentBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));

            const getUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
            const getResponse = await fetch(getUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const currentSha = JSON.parse(await getResponse.text()).sha;

            const payload = {
                message: `New blog post by ${author}`,
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
                console.log("File uploaded successfully.");
                alert("Succesfully uploaded, please allow up to 5 minutes for the post to show up!");
            } else {
                const error = `Failed to upload file: ${await response.text()}`;
                console.error(error);
                alert(`ERR!\n${error}`);
            }

        } catch (error) {
            console.error(error);
            alert(`ERR:\n${error}`);
            return;
        }
    });
});
