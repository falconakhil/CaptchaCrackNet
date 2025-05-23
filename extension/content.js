(async function () {
  try {
    console.log("Initializing CAPTCHA solver extension...");

    window.addEventListener("trigger-captcha-solve", async () => {
      console.log("Solve CAPTCHA triggered");

      alert("Please click on the CAPTCHA image you want to solve");

      const imageSelector = async (event) => {
        if (event.target.tagName === "IMG") {
          const selectedImg = event.target;
          console.log("CAPTCHA image selected:", selectedImg.src);
          document.removeEventListener("click", imageSelector);

          // Fetch model from chrome.storage
          chrome.storage.local.get("selectedCaptchaModel", async ({ selectedCaptchaModel }) => {
            if (!selectedCaptchaModel) {
              alert("No model selected.");
              return;
            }

            console.log("Using model from chrome.storage:", selectedCaptchaModel);

            try {
              const requestBody = {
                data: [
                  {
                    path: selectedImg.src,
                    meta: { "_type": "gradio.FileData" }
                  }
                ]
              };

              console.log("Sending prediction request...");
              const postResponse = await fetch(selectedCaptchaModel, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
              });

              if (!postResponse.ok) {
                throw new Error(`POST request failed: ${postResponse.status}`);
              }

              const postData = await postResponse.json();
              if (!postData || !postData.event_id) {
                throw new Error("Invalid response from the model API");
              }

              const eventId = postData.event_id;
              console.log("Received event ID:", eventId);

              console.log("Processing CAPTCHA...");
              await new Promise(resolve => setTimeout(resolve, 5000));

              const getResponse = await fetch(`${selectedCaptchaModel}/${eventId}`);
              if (!getResponse.ok) {
                throw new Error(`GET request failed: ${getResponse.status}`);
              }

              const resultText = await getResponse.text();
              const match = resultText.match(/data: \[(.*?)\]/);
              if (!match) throw new Error("Could not parse prediction result");

              const prediction = match[1].replace(/"/g, '');
              console.log("Extracted prediction:", prediction);

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
          });
        }
      };

      document.addEventListener("click", imageSelector);
    });

    console.log("CAPTCHA solver extension initialized successfully");
  } catch (error) {
    console.error("Extension initialization error:", error);
  }
})();




