let selectedImg = null;

(async function () {
    try {
        console.log("Initializing CAPTCHA solver extension...");

        window.addEventListener("trigger-captcha-solve", async () => {
            console.log("Solve CAPTCHA triggered");

            alert("Please click on the CAPTCHA image you want to solve");

            const imageSelector = async (event) => {
                if (event.target.tagName === "IMG") {
                    selectedImg = event.target;
                    console.log("CAPTCHA image selected:", selectedImg.src);
                    document.removeEventListener("click", imageSelector);

                    try {
                        let requestBody;

                        // Ensure valid image URL
                        if (!selectedImg.src.startsWith("http")) {
                            alert("Invalid image URL. Please select a valid CAPTCHA image.");
                            return;
                        }

                        // Get selected model URL passed from popup.js
                        const selectedModel = window.selectedCaptchaModel;

                        if (!selectedModel) {
                            alert("No model selected.");
                            return;
                        }

                        console.log("Using model:", selectedModel);

                        requestBody = {
                            data: [
                                {
                                    path: selectedImg.src,
                                    meta: { "_type": "gradio.FileData" }
                                }
                            ]
                        };

                        // Send prediction request
                        console.log("Sending prediction request...");
                        const postResponse = await fetch(selectedModel, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(requestBody)
                        });

                        if (!postResponse.ok) {
                            throw new Error(`POST request failed: ${postResponse.status}`);
                        }

                        const postData = await postResponse.json();
                        const eventId = postData.event_id;
                        console.log("Received event ID:", eventId);

                        console.log("Processing CAPTCHA...");
                        await new Promise(resolve => setTimeout(resolve, 5000));

                        // Fetch prediction result
                        console.log("Fetching prediction result...");
                        const getResponse = await fetch(`${selectedModel}/${eventId}`);

                        if (!getResponse.ok) {
                            throw new Error(`GET request failed: ${getResponse.status}`);
                        }

                        const resultText = await getResponse.text();
                        console.log("Received prediction:", resultText);

                        const match = resultText.match(/data: \[(.*?)\]/);
                        if (!match) {
                            throw new Error("Could not parse prediction result");
                        }

                        const prediction = match[1].replace(/"/g, '');
                        console.log("Extracted prediction:", prediction);

                        // Autofill CAPTCHA input
                        const input = Array.from(document.querySelectorAll("input")).find(input =>
                            ["name", "placeholder", "id"].some(attr =>
                                input[attr]?.toLowerCase().includes("captcha")
                            )
                        );

                        if (input) {
                            input.value = prediction;
                            console.log("CAPTCHA filled successfully:", prediction);
                            alert("CAPTCHA solved and filled!");
                        } else {
                            console.warn("CAPTCHA input field not found");
                            alert(`CAPTCHA solved! Result: ${prediction}`);
                        }

                    } catch (error) {
                        console.error("CAPTCHA solving error:", error);
                        alert(`Failed to solve CAPTCHA: ${error.message}`);
                    }
                }
            };

            document.addEventListener("click", imageSelector);
        });

        console.log("CAPTCHA solver extension initialized successfully");

    } catch (error) {
        console.error("Extension initialization error:", error);
        console.error("Error details:", error.stack);
    }
})();



