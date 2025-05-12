let selectedImg = null;

(async function () {
    try {
        console.log(" Initializing CAPTCHA solver extension...");

        window.addEventListener("trigger-captcha-solve", async () => {
            console.log(" Solve CAPTCHA triggered");

            alert("Please click on the CAPTCHA image you want to solve");

            const imageSelector = async (event) => {
                if (event.target.tagName === "IMG") {
                    selectedImg = event.target;
                    console.log("CAPTCHA image selected:", selectedImg.src);
                    document.removeEventListener("click", imageSelector);

                    try {
                        let requestBody;

                        // Try to use image URL directly
                        if (selectedImg.src.startsWith("http")) {
                            console.log("Using image URL for prediction:", selectedImg.src);
                            requestBody = {
                                data: [
                                    {
                                        path: selectedImg.src,
                                        meta: { "_type": "gradio.FileData" }
                                    }
                                ]
                            };
                        } else {
                            // return a alert if the image is not a valid URL
                            alert("Invalid image URL. Please select a valid CAPTCHA image.");
                            return;
                        }

                        // Send POST request
                        console.log(" Sending prediction request...");
                        const postResponse = await fetch("https://dineshmanideep-captchcracknet-v1.hf.space/gradio_api/call/predict", {
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
                        console.log(" Received event ID:", eventId);

                        console.log(" Processing CAPTCHA...");
                        await new Promise(resolve => setTimeout(resolve, 5000));

                        // Get result
                        console.log(" Fetching prediction result...");
                        const getResponse = await fetch(`https://dineshmanideep-captchcracknet-v1.hf.space/gradio_api/call/predict/${eventId}`);

                        if (!getResponse.ok) {
                            throw new Error(`GET request failed: ${getResponse.status}`);
                        }

                        const resultText = await getResponse.text();
                        console.log(" Received prediction:", resultText);

                        const match = resultText.match(/data: \[(.*?)\]/);
                        if (!match) {
                            throw new Error("Could not parse prediction result");
                        }

                        const prediction = match[1].replace(/"/g, '');
                        console.log(" Extracted prediction:", prediction);

                        const input = Array.from(document.querySelectorAll("input")).find(input =>
                            ["name", "placeholder", "id"].some(attr =>
                                input[attr]?.toLowerCase().includes("captcha")
                            )
                        );

                        if (input) {
                            input.value = prediction;
                            console.log(" CAPTCHA filled successfully:", prediction);
                            alert("CAPTCHA solved and filled!");
                        } else {
                            console.warn(" CAPTCHA input field not found");
                            alert(`CAPTCHA solved! Result: ${prediction}`);
                        }

                    } catch (error) {
                        console.error(" CAPTCHA solving error:", error);
                        alert(`Failed to solve CAPTCHA: ${error.message}`);
                    }
                }
            };

            document.addEventListener("click", imageSelector);
        });

        console.log(" CAPTCHA solver extension initialized successfully");

    } catch (error) {
        console.error(" Extension initialization error:", error);
        console.error("Error details:", error.stack);
    }
})();



